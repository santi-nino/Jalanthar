// AI-assisted loot generation for a single entity -- used whenever the DM
// picks a Specific Monster or writes Notes, so the loot reflects that
// context (a "Giant Lizard" pulling reptile/swamp-flavored items; a note
// like "orc priestess" shifting what a plain orc would carry) without
// abandoning the underlying rule system. This is deliberately NOT a free
// generator: the AI is handed the exact eligible item pool and the exact
// count limits for this entity's tier, and is told to select from that
// pool first, inventing at most one or two new items only when the
// specific flavor genuinely isn't covered by anything already eligible.
// Reuses the same Gemini-primary/Claude-fallback pattern as sourceAi.js.

function buildPrompt({ monsterType, monsterName, notes, tierLabel, countsByKind, eligibleItems, attributeSummary }) {
  const countsText = Object.entries(countsByKind)
    .map(([kind, [min, max]]) => `${kind}: ${min}-${max}`)
    .join(', ')
  const poolText = eligibleItems
    .map((i) => `- ${i.name} | ${i.priceGp}gp | ${i.kind} | ${i.description}`)
    .join('\n')

  return `
You are helping a Dungeon Master generate believable loot for a D&D creature, working within a strict pre-built rule system. Do not break the numeric limits below under any circumstances.

CREATURE CONTEXT:
- Monster Type: ${monsterType}
- Specific Monster (if given): ${monsterName || '(none)'}
- DM's freeform notes: ${notes || '(none)'}
- Currently selected fields: ${attributeSummary || '(none set)'}
- Tier: ${tierLabel}

HARD LIMITS (never exceed the maximum for any kind, across ALL items combined):
${countsText}

ELIGIBLE ITEMS (already filtered to match this creature's fields -- prefer selecting from this list):
${poolText || '(no items are currently eligible)'}

TASK:
1. Read the Specific Monster name and notes carefully. If they describe a creature or context that shifts what makes sense (e.g. "orc priestess" implies religious/humanoid flavor even on a base orc; "Giant Lizard" implies a large reptile from a swamp-like environment), let that inform which eligible items you pick and how you interpret the notes -- but you are still bound by the exact count limits above and by the Monster Type's own established rules.
2. SELECT items primarily from the ELIGIBLE ITEMS list above. This is your main job.
3. You may invent AT MOST ONE OR TWO brand-new items, and ONLY if the specific monster/notes describe something genuinely not covered by anything in the eligible list. Never invent more than 2. Any invented item must match the price range and one-sentence narrative style of the surrounding eligible items -- no mechanical claims beyond what a similar eligible item would have.
4. Stay within the HARD LIMITS for every kind. Do not pad the list with extra items "to be thorough" -- a small creature should get a small amount of loot.

Return ONLY JSON (no markdown fences, no commentary) matching exactly this shape:
{ "items": [ { "name": string, "priceGp": number, "description": string, "kind": string, "isNew": boolean } ] }
`.trim()
}

function normalizeResult(raw, validKinds) {
  const items = Array.isArray(raw.items)
    ? raw.items
        .map((r) => ({
          name: String(r.name || '').trim(),
          priceGp: Number(r.priceGp) || 0,
          description: String(r.description || '').trim(),
          kind: String(r.kind || '').trim(),
          isNew: !!r.isNew,
        }))
        .filter((r) => r.name && validKinds.has(r.kind))
    : []
  // Hard safety net regardless of what the model claims: never more than
  // 2 invented items, even if it ignored the instruction.
  let newCount = 0
  return items.filter((r) => {
    if (!r.isNew) return true
    newCount += 1
    return newCount <= 2
  })
}

async function callGemini(prompt) {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim()
  if (!apiKey) return null
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
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
  return JSON.parse(text)
}

async function callClaude(prompt) {
  const apiKey = (import.meta.env.VITE_ANTHROPIC_API_KEY || '').trim()
  if (!apiKey) return null
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
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Claude request failed (${res.status}): ${body.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = (data.content || []).map((b) => (b.type === 'text' ? b.text : '')).join('')
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

export const LOOT_AI_UNCONFIGURED = 'LOOT_AI_UNCONFIGURED'

// --- Horde contents: a DIFFERENT, deliberately looser use of AI than
// generateAiAssistedLoot above. Regular creature loot is capped at 1-2
// invented items because the point is respecting a small, precise count
// limit. A dragon's horde is the opposite problem: it has a big GP
// TARGET (rolled from taxonomy.hordeGpRanges) that needs padding out
// with believable content, so invention is expected and encouraged
// here, not a rare exception. Existing database items are still offered
// as thematic anchors and can be pulled in directly, but there's no cap
// on how many new luxury/art/curio items the model invents to reach the
// target.

function buildHordePrompt({ lineage, setting, notes, targetGp, eligibleItems }) {
  const poolText = eligibleItems.map((i) => `- ${i.name} | ${i.priceGp}gp | ${i.description}`).join('\n')
  return `
You are helping a Dungeon Master assemble the CONTENTS of a dragon's horde, targeting an approximate total gp value.

DRAGON CONTEXT:
- Lineage: ${lineage || '(unspecified)'}
- Setting: ${setting || '(unspecified)'}
- DM's notes: ${notes || '(none)'}
- Target horde value: approximately ${targetGp} gp (land within roughly 10-20% of this total)

EXISTING DATABASE ITEMS (thematic inspiration -- include some directly where they genuinely fit, but don't force it):
${poolText || '(none particularly relevant)'}

TASK: Assemble the horde's contents, reasoning about what THIS dragon would realistically have collected given its lineage and setting -- a dragon that loves art hoards differently than one that hoards raw metal or gemstones. Include a mix of:
1. A single "Coins" line item covering the bulk of the raw currency value.
2. A handful of gems and/or art objects (invent specific, evocative ones -- "a marble statue of a satyr," "a fistful of uncut sapphires" -- rather than generic placeholders).
3. A few magic items or curiosities, pulling from the database above where thematically fitting, inventing new ones otherwise.
Invention is expected and encouraged here -- this is not a "pick from a short list" task, it's "build a believable pile of treasure." The SUM of every item's value should land close to the target.

Return ONLY JSON (no markdown fences, no commentary): { "items": [ { "name": string, "priceGp": number, "description": string } ], "totalGp": number }
`.trim()
}

function normalizeHordeResult(raw) {
  const items = Array.isArray(raw.items)
    ? raw.items
        .map((r) => ({
          name: String(r.name || '').trim(),
          priceGp: Number(r.priceGp) || 0,
          description: String(r.description || '').trim(),
        }))
        .filter((r) => r.name)
    : []
  const totalGp = items.reduce((sum, i) => sum + i.priceGp, 0)
  return { items, totalGp }
}

export async function generateAiHordeContents({ lineage, setting, notes, targetGp, eligibleItems }) {
  const prompt = buildHordePrompt({ lineage, setting, notes, targetGp, eligibleItems })

  let lastError = null
  try {
    const result = await callGemini(prompt)
    if (result) return normalizeHordeResult(result)
  } catch (err) {
    console.error('Gemini horde fill failed, trying fallback:', err)
    lastError = err
  }
  try {
    const result = await callClaude(prompt)
    if (result) return normalizeHordeResult(result)
  } catch (err) {
    console.error('Claude horde fill failed:', err)
    lastError = err
  }
  if (lastError) throw lastError
  throw new Error(LOOT_AI_UNCONFIGURED)
}


// countsByKind: { [kind]: [min, max] } for this entity's exact tier --
// the same numbers the deterministic engine would use. eligibleItems:
// the same pool the deterministic engine would draw from (already
// filtered by dimensions/features/minRank/etc), each as
// {name, priceGp, description, kind}.
export async function generateAiAssistedLoot({
  monsterType, monsterName, notes, tierLabel, countsByKind, eligibleItems, attributeSummary,
}) {
  const prompt = buildPrompt({ monsterType, monsterName, notes, tierLabel, countsByKind, eligibleItems, attributeSummary })
  const validKinds = new Set(Object.keys(countsByKind))

  let lastError = null
  try {
    const result = await callGemini(prompt)
    if (result) return normalizeResult(result, validKinds)
  } catch (err) {
    console.error('Gemini loot assist failed, trying fallback:', err)
    lastError = err
  }
  try {
    const result = await callClaude(prompt)
    if (result) return normalizeResult(result, validKinds)
  } catch (err) {
    console.error('Claude loot assist failed:', err)
    lastError = err
  }
  if (lastError) throw lastError
  throw new Error(LOOT_AI_UNCONFIGURED)
}
