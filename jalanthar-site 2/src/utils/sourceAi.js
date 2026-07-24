// Turns an uploaded price list / menu / equipment sheet (PDF or image) into
// structured wares/menu/services rows the DM can review and pull into any
// building. Tries a free AI backend first and only reaches for a paid one
// if that's unavailable — see the two functions below for why.

// Builds the extraction prompt. `suggestedCategories`, if the DM supplied
// any before scanning, gets baked directly into the instructions so the AI
// sorts items into THOSE buckets rather than inventing its own — this is
// what lets one scanned document (a big mixed loot sheet, say) split
// across several categories instead of landing in one lump group.
function buildSchemaDescription(suggestedCategories) {
  const categoryInstruction =
    suggestedCategories && suggestedCategories.length > 0
      ? `Sort every item into ONE of these DM-provided categories (use the exact spelling given): ${suggestedCategories.map((c) => `"${c}"`).join(', ')}. If an item genuinely fits none of them, use "Other" — but prefer one of the given categories whenever it's a reasonable fit.`
      : `Invent a short, sensible category per item yourself (e.g. "Weapons", "Potions", "Armor", "Trinkets") — the document likely covers more than one kind of item, so don't just use one category for everything unless it genuinely is all one kind of thing.`

  return `
Return ONLY JSON (no markdown fences, no commentary) matching exactly this shape:
{
  "sourceName": string,        // a short human title for this document, e.g. "Silverwood Outfitters Price List"
  "wares": [ { "name": string, "basePrice": number, "description": string, "quantity": number, "category": string } ],
  "menu":  [ { "name": string, "basePrice": number, "description": string, "quantity": number, "category": string } ],
  "services": [ { "name": string, "basePrice": number, "description": string, "quantity": number, "category": string } ]
}
Rules:
- "wares" = physical goods/equipment for sale. "menu" = food/drink/lodging. "services" = anything performed for the customer (spellcasting, repairs, lessons, etc). Split items into whichever of the three lists actually fits — most documents will only populate one or two of them.
- category (per item): ${categoryInstruction}
- basePrice is in gold pieces (gp) as a plain number (convert sp/cp/pp to gp: 1gp = 10sp = 100cp = 0.1pp). If a price is a range, use the lower bound. If no price is legible, use 0.
- quantity is a plain integer estimate of how many are in stock/available. If the document doesn't say, use 1.
- description is a short (under 20 words) plain-text note — flavor text, ingredients, or specs, whatever the source actually says. Empty string if nothing legible.
- Do not invent items that aren't actually on the page. If the document is illegible or contains no sellable items, return empty arrays for wares/menu/services but still make a best-effort guess at sourceName from whatever text is visible.
`.trim()
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.readAsDataURL(file)
  })
}

function normalizeResult(raw) {
  const arr = (v) =>
    Array.isArray(v)
      ? v.map((r) => ({
          rowId: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: String(r.name || '').trim(),
          basePrice: Number(r.basePrice) || 0,
          description: String(r.description || '').trim(),
          category: String(r.category || '').trim() || 'Misc',
          priceOverride: '',
          quantity: Number.isFinite(Number(r.quantity)) ? Math.max(0, Math.round(Number(r.quantity))) : 1,
        })).filter((r) => r.name)
      : []
  return {
    sourceName: String(raw.sourceName || '').trim() || 'Untitled Source',
    wares: arr(raw.wares),
    menu: arr(raw.menu),
    services: arr(raw.services),
  }
}

// --- Free tier: Google Gemini (Google AI Studio key, no credit card, no
// billing — a rate-limited 429 is the worst case, never a bill). This is
// deliberately tried first for exactly that reason. Requires
// VITE_GEMINI_API_KEY to be set; see .env.example.
async function parseWithGemini(file, suggestedCategories) {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim()
  if (!apiKey) return null

  const base64 = await fileToBase64(file)
  const model = 'gemini-2.5-flash'
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: buildSchemaDescription(suggestedCategories) },
              { inline_data: { mime_type: file.type, data: base64 } },
            ],
          },
        ],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  )

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Gemini request failed (${res.status}): ${body.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  return normalizeResult(JSON.parse(text))
}

// --- Fallback: Claude, direct from the browser. This is a REAL, metered,
// pay-per-token key — unlike the Gemini key above, a leaked or scraped key
// here is a genuine billing risk, not just a rate-limit inconvenience. It
// is only ever used if Gemini isn't configured or fails, and only if the DM
// has deliberately opted in by setting VITE_ANTHROPIC_API_KEY. See
// .env.example and the README before turning this on.
async function parseWithClaude(file, suggestedCategories) {
  const apiKey = (import.meta.env.VITE_ANTHROPIC_API_KEY || '').trim()
  if (!apiKey) return null

  const base64 = await fileToBase64(file)
  const isPdf = file.type === 'application/pdf'
  const contentBlock = isPdf
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }
    : { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: [contentBlock, { type: 'text', text: buildSchemaDescription(suggestedCategories) }],
        },
      ],
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Claude request failed (${res.status}): ${body.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = (data.content || []).map((b) => (b.type === 'text' ? b.text : '')).join('')
  const cleaned = text.replace(/```json|```/g, '').trim()
  return normalizeResult(JSON.parse(cleaned))
}

export const SOURCE_AI_UNCONFIGURED = 'SOURCE_AI_UNCONFIGURED'

// Tries Gemini first (free); if it's not configured or throws, tries Claude
// (only if the DM opted in with a key); if neither is available, throws
// SOURCE_AI_UNCONFIGURED so the UI can explain how to set one up.
// `suggestedCategories` is an optional array of category names the DM typed
// in before scanning — see buildSchemaDescription above for how it's used.
export async function parseSourceDocument(file, suggestedCategories = []) {
  let lastError = null

  try {
    const geminiResult = await parseWithGemini(file, suggestedCategories)
    if (geminiResult) return geminiResult
  } catch (err) {
    console.error('Gemini source parsing failed, trying fallback:', err)
    lastError = err
  }

  try {
    const claudeResult = await parseWithClaude(file, suggestedCategories)
    if (claudeResult) return claudeResult
  } catch (err) {
    console.error('Claude source parsing failed:', err)
    lastError = err
  }

  if (lastError) throw lastError
  throw new Error(SOURCE_AI_UNCONFIGURED)
}
