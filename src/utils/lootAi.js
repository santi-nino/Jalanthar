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

function buildPrompt({ monsterType, monsterName, notes, tierLabel, countsByKind, eligibleItems, attributeSummary, needsInference, tierOptions }) {
  const poolText = eligibleItems
    .map((i) => `- ${i.name} | ${i.priceGp}gp | ${i.kind} | ${i.description}`)
    .join('\n')

  if (needsInference) {
    // The DM only filled in Specific Monster and/or Notes -- the
    // dropdown that would normally pick a tier (Size/Age Category/
    // Rank/Purpose/Habitat) was left blank. Rather than fail, the AI
    // does double duty: pick the tier that best fits the named
    // creature/notes, THEN select loot within THAT tier's exact counts.
    const tierOptionsText = Object.entries(tierOptions)
      .map(([tierName, counts]) => {
        const countsText = Object.entries(counts)
          .filter(([k]) => k !== 'priceRange' && k !== 'goldRange')
          .map(([kind, range]) => `${kind}: ${range[0]}-${range[1]}`)
          .join(', ')
        return `- ${tierName}: ${countsText}`
      })
      .join('\n')

    return `
You are helping a Dungeon Master generate believable loot for a D&D creature, working within a strict pre-built rule system.

CREATURE CONTEXT:
- Monster Type: ${monsterType}
- Specific Monster (if given): ${monsterName || '(none)'}
- DM's freeform notes: ${notes || '(none)'}

The DM has NOT set a tier (size/age/rank/purpose category) -- infer the single best-fitting tier below from the monster name and notes.

AVAILABLE TIERS (pick exactly one, then NEVER exceed its limits for any kind, across ALL items combined):
${tierOptionsText}

FULL ITEM POOL FOR THIS MONSTER TYPE (each item may be tagged to a specific kind and to other dimensions like origin/lineage/domain -- only select items that make sense for the inferred creature; an item tagged to a specific color/kingdom/domain that doesn't match this creature should NOT be picked):
${poolText || '(no items available)'}

TASK:
1. Infer which tier above best fits the named monster and notes (e.g. "Giant Lizard" -> Large-equivalent tier; "Ancient Red Dragon" -> the Ancient tier).
2. Infer any other relevant tags implied by the name (e.g. "Giant Lizard" implies Reptile-kingdom, "Red Dragon" implies Red lineage) and only select items compatible with those.
3. SELECT items primarily from the FULL ITEM POOL above, respecting your inferred tier's exact count limits for every kind.
4. You may invent AT MOST ONE OR TWO brand-new items, and ONLY if the monster/notes describe something genuinely not covered by anything in the pool. Never invent more than 2. Never invent an anatomical item the creature plausibly wouldn't have (no horns on a snake, no wings on a legless creature, etc) -- stay grounded in real anatomy for the named creature.
5. Do not pad the list "to be thorough" -- respect the inferred tier's limits exactly. Never select two different items that both represent the same single body part (e.g. two different skull items, two different sets of horns) -- a creature has exactly one of each.

Return ONLY JSON (no markdown fences, no commentary) matching exactly this shape:
{ "inferredTier": string, "items": [ { "name": string, "priceGp": number, "description": string, "kind": string, "isNew": boolean } ] }
`.trim()
  }

  const countsText = Object.entries(countsByKind)
    .map(([kind, [min, max]]) => `${kind}: ${min}-${max}`)
    .join(', ')

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
3. You may invent AT MOST ONE OR TWO brand-new items, and ONLY if the specific monster/notes describe something genuinely not covered by anything in the eligible list. Never invent more than 2. Any invented item must match the price range and one-sentence narrative style of the surrounding eligible items -- no mechanical claims beyond what a similar eligible item would have. Never invent an anatomical item the creature plausibly wouldn't have (no horns on a snake, no wings on a legless creature, etc).
4. Stay within the HARD LIMITS for every kind. Do not pad the list with extra items "to be thorough" -- a small creature should get a small amount of loot. Never select two different items that both represent the same single body part (e.g. two different skull items, two different sets of horns) -- a creature has exactly one of each.

Return ONLY JSON (no markdown fences, no commentary) matching exactly this shape:
{ "items": [ { "name": string, "priceGp": number, "description": string, "kind": string, "isNew": boolean } ] }
`.trim()
}

// Hard, code-level safety net around what the model actually returns --
// the prompt asks nicely for count limits and anatomical plausibility,
// but prompt compliance alone has repeatedly not been trustworthy enough
// (this is the same reasoning behind the pre-existing invented-item cap
// below). Three checks, in order:
// 1. Exact-name dedup (case-insensitive) -- the model should never return
//    the literal same catalog item twice, but nothing stopped it before.
// 2. anatomySlot dedup (see lootTags.anatomySlot in LootTab.jsx) -- catches
//    the "two DIFFERENT items that are both, anatomically, a skull" case
//    that exact-name dedup can't, using the same slot data the
//    deterministic engine enforces. Only applies to items the AI picked
//    from the pool (slotByName is built from eligibleItems); invented
//    items have no known slot and aren't touched by this step.
// 3. Per-kind count cap -- countsByKind/inferredTier's max was always
//    stated in the prompt as a hard limit, but was never actually
//    enforced in code. This is what stops "too many items altogether":
//    the model padding a kind well past its stated max no longer survives
//    normalization, regardless of whether it respected the instruction.
// The existing invented-item cap (max 2 isNew items) runs last, unchanged.
function normalizeResult(raw, validKinds, { maxByKind, slotByName } = {}) {
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

  const seenNames = new Set()
  const usedSlots = new Set()
  const kindCounts = {}
  const filtered = []
  for (const r of items) {
    const nameKey = r.name.toLowerCase()
    if (seenNames.has(nameKey)) continue
    // anatomySlot can be a single string or an array (see LootTab.jsx's
    // slotsOf) -- normalize either way before checking/claiming.
    const rawSlot = slotByName?.get(nameKey)
    const slots = rawSlot ? (Array.isArray(rawSlot) ? rawSlot : [rawSlot]) : []
    if (slots.some((s) => usedSlots.has(s))) continue
    const max = maxByKind?.[r.kind]
    const countSoFar = kindCounts[r.kind] || 0
    if (max != null && countSoFar >= max) continue
    seenNames.add(nameKey)
    slots.forEach((s) => usedSlots.add(s))
    kindCounts[r.kind] = countSoFar + 1
    filtered.push(r)
  }

  // Hard safety net regardless of what the model claims: never more than
  // 2 invented items, even if it ignored the instruction.
  let newCount = 0
  return filtered.filter((r) => {
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

function buildHordePrompt({ lineage, setting, notes, targetGp, eligibleItems, excludeNames }) {
  const poolText = eligibleItems.map((i) => `- ${i.name} | ${i.priceGp}gp | ${i.description}`).join('\n')
  const excludeText = excludeNames && excludeNames.length > 0
    ? `\nDO NOT include any of these (already accounted for elsewhere for this dragon): ${excludeNames.join(', ')}`
    : ''
  return `
You are helping a Dungeon Master assemble the CONTENTS of a dragon's horde, targeting an approximate total gp value.

DRAGON CONTEXT:
- Lineage: ${lineage || '(unspecified)'}
- Setting: ${setting || '(unspecified)'}
- DM's notes: ${notes || '(none)'}
- Target horde value: approximately ${targetGp} gp (land within roughly 10-20% of this total)

EXISTING DATABASE ITEMS (draw from these for most of the non-coin value):
${poolText || '(none particularly relevant)'}
${excludeText}

TASK: Assemble the horde's contents, reasoning about what THIS dragon would realistically have collected given its lineage and setting -- a dragon that loves art hoards differently than one that hoards raw metal or gemstones.
1. A single "Coins" line item covering the bulk of the raw currency value -- this is baseline and doesn't count toward the ratio in step 2.
2. Of the REMAINING value (everything besides the Coins line): roughly 75% of that value should come from items pulled DIRECTLY from the EXISTING DATABASE ITEMS list above (use their exact name, price, and description), and roughly 25% should be newly invented luxury goods, art objects, gems, or curiosities specific to this dragon's taste (invent specific, evocative ones -- "a marble statue of a satyr," "a fistful of uncut sapphires" -- not generic placeholders). This is the one AI use case where invention is expected, but it should still be the smaller share of the total.
3. The SUM of every item's value (including Coins) should land close to the target.
4. Never repeat an item name from the exclusion list above.

Return ONLY JSON (no markdown fences, no commentary): { "items": [ { "name": string, "priceGp": number, "description": string } ], "totalGp": number }
`.trim()
}

function normalizeHordeResult(raw, excludeNames) {
  const excludeSet = new Set(excludeNames || [])
  const items = Array.isArray(raw.items)
    ? raw.items
        .map((r) => ({
          name: String(r.name || '').trim(),
          priceGp: Number(r.priceGp) || 0,
          description: String(r.description || '').trim(),
        }))
        .filter((r) => r.name && !excludeSet.has(r.name))
    : []
  const totalGp = items.reduce((sum, i) => sum + i.priceGp, 0)
  return { items, totalGp }
}

export async function generateAiHordeContents({ lineage, setting, notes, targetGp, eligibleItems, excludeNames }) {
  const prompt = buildHordePrompt({ lineage, setting, notes, targetGp, eligibleItems, excludeNames })

  let lastError = null
  try {
    const result = await callGemini(prompt)
    if (result) return normalizeHordeResult(result, excludeNames)
  } catch (err) {
    console.error('Gemini horde fill failed, trying fallback:', err)
    lastError = err
  }
  try {
    const result = await callClaude(prompt)
    if (result) return normalizeHordeResult(result, excludeNames)
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
// {name, priceGp, description, kind}. When needsInference is true
// (DM only set Specific Monster/Notes, no tier dropdown), countsByKind
// is omitted and tierOptions (the full sizeLootTable for this type) is
// passed instead -- the AI infers the tier itself as part of the call.
export async function generateAiAssistedLoot({
  monsterType, monsterName, notes, tierLabel, countsByKind, eligibleItems, attributeSummary,
  needsInference, tierOptions,
}) {
  const prompt = buildPrompt({
    monsterType, monsterName, notes, tierLabel, countsByKind, eligibleItems, attributeSummary,
    needsInference, tierOptions,
  })
  const validKinds = needsInference
    ? new Set(
        Object.values(tierOptions || {}).flatMap((tier) =>
          Object.keys(tier).filter((k) => k !== 'priceRange' && k !== 'goldRange')
        )
      )
    : new Set(Object.keys(countsByKind))

  // Same lookup table the deterministic engine's anatomySlot enforcement
  // uses, built from the exact eligible pool the AI was handed -- keyed
  // lowercase to match normalizeResult's name-based lookup.
  const slotByName = new Map(
    (eligibleItems || [])
      .filter((i) => i.anatomySlot)
      .map((i) => [i.name.toLowerCase(), i.anatomySlot])
  )

  // maxByKind: the per-kind hard ceiling to enforce in code, not just
  // prompt text. In the normal path it's just countsByKind's own max. In
  // needsInference mode, the count table isn't known until the model
  // declares which tier it inferred -- computed fresh per response below,
  // since two calls (Gemini then Claude fallback) could plausibly infer
  // different tiers.
  function resolveMaxByKind(result) {
    if (!needsInference) {
      return Object.fromEntries(Object.entries(countsByKind).map(([k, range]) => [k, range[1]]))
    }
    const tier = tierOptions?.[result?.inferredTier]
    if (!tier) return null // unknown/missing tier -- name+slot dedup still applies, just no count cap
    return Object.fromEntries(
      Object.entries(tier)
        .filter(([k]) => k !== 'priceRange' && k !== 'goldRange')
        .map(([k, range]) => [k, range[1]])
    )
  }

  let lastError = null
  try {
    const result = await callGemini(prompt)
    if (result) return normalizeResult(result, validKinds, { maxByKind: resolveMaxByKind(result), slotByName })
  } catch (err) {
    console.error('Gemini loot assist failed, trying fallback:', err)
    lastError = err
  }
  try {
    const result = await callClaude(prompt)
    if (result) return normalizeResult(result, validKinds, { maxByKind: resolveMaxByKind(result), slotByName })
  } catch (err) {
    console.error('Claude loot assist failed:', err)
    lastError = err
  }
  if (lastError) throw lastError
  throw new Error(LOOT_AI_UNCONFIGURED)
}
