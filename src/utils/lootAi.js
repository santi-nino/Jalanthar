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
//
// STANDING RULE (DM directive, hard limit going forward): any entity's
// optional Notes box having text in it is a cue to run AI -- but only to
// SELECT items already in the database, never to CREATE/invent new ones
// via an in-app prompt. There is no legitimate reason for an in-app AI
// prompt to be inventing catalog content from scratch; new items belong
// in the actual catalog (dnd5eItems.js / mockData.js), reviewed and
// added deliberately, not generated ad hoc at loot-roll time. This
// applies to any NEW AI-assisted item-selection feature added to this
// file (or elsewhere) from this point forward -- it must be select-only.
//
// GRANDFATHERED EXCEPTIONS (explicitly exempted by the DM when this rule
// was written -- do not "fix" these to comply, and do not treat their
// existence as license to add further invention elsewhere without
// asking first):
//   1. generateAiAssistedLoot's up-to-2 invented items below (see
//      buildPrompt's TASK step 3/4 and normalizeResult's newCount cap).
//   2. generateAiHordeContents' ~25% invented luxury/art/curio share
//      (see buildHordePrompt's TASK step 2) -- kept because a dragon
//      horde's whole point is one-of-a-kind flavor that a fixed catalog
//      can never fully anticipate.
//   3. generateAiShopWares (added v3.9, DM-directed) -- full, uncapped
//      invention for shop stock, same reasoning as #2: a shop's whole
//      point is stock a fixed catalog can't fully anticipate, and the DM
//      explicitly asked for AI to "make a fully functioning D&D [shop]
//      within the parameters" this round rather than staying select-only.
//      Still constrained to mechanically real 5.5e-style items (see its
//      own prompt), just not select-from-catalog-only.

function buildPrompt({ monsterType, monsterName, notes, tierLabel, countsByKind, eligibleItems, attributeSummary, needsInference, tierOptions, balanced }) {
  const poolText = eligibleItems
    .map((i) => `- ${i.name} | ${i.priceGp}gp | ${i.kind} | ${balanced ? `[${i.established ? 'established' : 'original'}] ` : ''}${i.description}`)
    .join('\n')
  const balanceNote = balanced
    ? '\nSOURCE MIX: each item above is marked [established] (official D&D catalog / the Magical Junk Drawer) or [original] (this campaign’s own material). For every kind with items available in BOTH categories, aim for roughly an even split between them rather than picking mostly one -- do not let one category dominate a kind just because more of its items happen to be listed.\n'
    : ''

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
${balanceNote}
TASK:
1. Infer which tier above best fits the named monster and notes (e.g. "Giant Lizard" -> Large-equivalent tier; "Ancient Red Dragon" -> the Ancient tier).
2. Infer any other relevant tags implied by the name (e.g. "Giant Lizard" implies Reptile-kingdom, "Red Dragon" implies Red lineage) and only select items compatible with those.
3. USE WHAT YOU ACTUALLY KNOW about the named creature's real anatomy and nature before picking anything. This is not optional and it applies to the FULL ITEM POOL just as much as to anything you might invent -- being "in the eligible pool" does NOT make an item automatically fair game. An Owlbear has fur, feathers, a beak, and talons; it does not have scales or an exoskeleton, so those items must be REJECTED even if they're sitting right there in the pool tagged for this monster type. A snake has no legs or horns. A jellyfish has no bones. If you don't recognize the named creature, fall back to the Monster Type's own general body plan instead of guessing.
4. SELECT items primarily from the FULL ITEM POOL above, respecting your inferred tier's exact count limits for every kind -- but only from the subset that survives step 3's anatomical check. If the anatomically-correct subset can't fill a kind's count, leave that kind short rather than padding it with something that doesn't fit -- a wrong-but-present item is worse than a smaller, correct list.
5. You may invent AT MOST ONE OR TWO brand-new items, and ONLY if the monster/notes describe something genuinely not covered by anything in the pool. Never invent more than 2. Never invent an anatomical item the creature plausibly wouldn't have -- same rule as step 3, just for something new instead of something already listed.
6. Do not pad the list "to be thorough" -- respect the inferred tier's limits exactly. Never select two different items that both represent the same single body part (e.g. two different skull items, two different sets of horns) -- a creature has exactly one of each.

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
${balanceNote}
TASK:
1. Read the Specific Monster name and notes carefully. If they describe a creature or context that shifts what makes sense (e.g. "orc priestess" implies religious/humanoid flavor even on a base orc; "Giant Lizard" implies a large reptile from a swamp-like environment), let that inform which eligible items you pick and how you interpret the notes -- but you are still bound by the exact count limits above and by the Monster Type's own established rules.
2. USE WHAT YOU ACTUALLY KNOW about the named creature's real anatomy and nature before picking anything, and apply it to the ELIGIBLE ITEMS list itself, not just to anything you might invent -- an item being "in the eligible list" does NOT make it automatically fair game for THIS specific creature. A named Owlbear has fur, feathers, a beak, and talons; reject any eligible item implying scales or an exoskeleton even though it passed the coarser Monster Type/dimension filters. A snake has no legs or horns. Reject anything that contradicts what you know about the actual named creature, even if it's sitting right there in the list.
3. SELECT items primarily from the ELIGIBLE ITEMS list above, from whatever survives step 2's check. This is your main job. If the anatomically-correct subset can't fill a kind's count, leave it short rather than padding with something that doesn't fit -- a wrong-but-present item is worse than a smaller, correct list.
4. You may invent AT MOST ONE OR TWO brand-new items, and ONLY if the specific monster/notes describe something genuinely not covered by anything in the eligible list. Never invent more than 2. Any invented item must match the price range and one-sentence narrative style of the surrounding eligible items -- no mechanical claims beyond what a similar eligible item would have. Never invent an anatomical item the creature plausibly wouldn't have -- same rule as step 2.
5. Stay within the HARD LIMITS for every kind. Do not pad the list with extra items "to be thorough" -- a small creature should get a small amount of loot. Never select two different items that both represent the same single body part (e.g. two different skull items, two different sets of horns) -- a creature has exactly one of each.

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
//
// originByName (optional, only set for source-balanced types -- see
// SOURCE_BALANCED_TYPES in LootTab.jsx): when present, items are
// re-ordered PER KIND, interleaving established/original/invented before
// the per-kind count cap below ever runs. The prompt already asks the
// model to mix sources, but that's advisory only -- if the model just
// listed every established item before every original one (or vice
// versa), the count cap would silently keep only whichever came first.
// Interleaving first is what makes the cap actually land on a mix rather
// than trusting the model's own ordering.
function interleaveByOrigin(items, originByName) {
  if (!originByName) return items
  const kindOrder = []
  const byKind = {}
  for (const r of items) {
    if (!byKind[r.kind]) { byKind[r.kind] = { established: [], original: [], unknown: [] }; kindOrder.push(r.kind) }
    const origin = originByName.get(r.name.toLowerCase())
    const bucket = origin === true ? 'established' : origin === false ? 'original' : 'unknown'
    byKind[r.kind][bucket].push(r)
  }
  const result = []
  for (const kind of kindOrder) {
    const { established, original, unknown } = byKind[kind]
    const max = Math.max(established.length, original.length, unknown.length)
    for (let i = 0; i < max; i++) {
      if (established[i]) result.push(established[i])
      if (original[i]) result.push(original[i])
      if (unknown[i]) result.push(unknown[i])
    }
  }
  return result
}

function normalizeResult(raw, validKinds, { maxByKind, slotByName, originByName } = {}) {
  let items = Array.isArray(raw.items)
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
  items = interleaveByOrigin(items, originByName)

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


// --- Discretion mode -------------------------------------------------------
// For monster types with no kind-bucketed sizeLootTable entry (Monstrosity,
// Ooze, Plant, Undead) -- these never had a tier/count system to bound the
// AI by in the first place, so a DM picking a real catalog monster of one
// of these types always fell through to the flat draw's flat 1-2 item
// count no matter how large or notable the creature was (the "Owlbear
// always gets 1-2 items, one of them a scale that doesn't belong on an
// Owlbear at all" bug). Per the DM: for a monster picked from the actual
// catalog dropdown (a real, named SRD creature, not just freeform text),
// let the AI use real discretion -- a size-based ballpark count instead of
// rigid per-kind buckets, and NO relaxation of the standing select-don't-
// invent rule (see the file-top STANDING RULE comment) -- still capped at
// 2 invented items, same as the regular path above.

function buildDiscretionPrompt({ monsterType, monsterName, srdContext, notes, countRange, eligibleItems }) {
  const poolText = eligibleItems.map((i) => `- ${i.name} | ${i.priceGp}gp | ${i.kind} | ${i.description}`).join('\n')
  return `
You are helping a Dungeon Master generate believable loot for a specific, named D&D creature picked from the official monster catalog.

CREATURE:
- Name: ${monsterName}${srdContext}
- Monster Type: ${monsterType}
- DM's freeform notes: ${notes || '(none)'}

This creature's type doesn't use the site's tier/count system, so there's no strict per-kind limit here -- use real judgment instead, informed by what you actually know about this creature (its size, temperament, habitat, whether it's the sort of thing that would even carry/guard belongings at all).

LOOSE GUIDANCE: aim for roughly ${countRange[0]}-${countRange[1]} items total (a rough ballpark, not a hard wall) -- fewer for a small, simple, or feral creature that wouldn't realistically have anything on it beyond maybe a trophy-worthy body part; more for a large, territorial, or lair-keeping one that might have scavenged or hoarded things nearby. It is completely fine, and often correct, to return FEWER than the low end if this creature genuinely wouldn't carry much (a mindless ooze should get near nothing) -- the ballpark exists to stop reflexive 1-2-item answers for creatures that would plausibly have more, not to pad every single one up.

ELIGIBLE ITEMS (draw primarily from this list; every item must make sense for THIS specific named creature's real anatomy/nature -- do not pick an item just because it's on the list):
${poolText || '(no items available)'}

TASK:
1. Use what you actually know about this named creature. Reject anything anatomically or thematically wrong for it even if it's in the eligible list (e.g. no scales or exoskeleton fragments on an Owlbear -- it has fur, feathers, a beak, and talons).
2. Select items from the ELIGIBLE ITEMS list that plausibly fit. You may invent AT MOST ONE OR TWO brand-new items, and only if this creature's real nature calls for something genuinely not covered by anything eligible -- never invent an anatomical item it plausibly wouldn't have.
3. Land roughly within the loose guidance above, erring toward less rather than padding to hit a number.
4. Never select two different items that both represent the same single body part.

Return ONLY JSON (no markdown fences, no commentary) matching exactly this shape:
{ "items": [ { "name": string, "priceGp": number, "description": string, "kind": string, "isNew": boolean } ] }
`.trim()
}

function normalizeDiscretionResult(raw, { maxTotal, slotByName } = {}) {
  let items = Array.isArray(raw.items)
    ? raw.items
        .map((r) => ({
          name: String(r.name || '').trim(),
          priceGp: Number(r.priceGp) || 0,
          description: String(r.description || '').trim(),
          kind: String(r.kind || '').trim(),
          isNew: !!r.isNew,
        }))
        .filter((r) => r.name)
    : []

  const seenNames = new Set()
  const usedSlots = new Set()
  const filtered = []
  for (const r of items) {
    const nameKey = r.name.toLowerCase()
    if (seenNames.has(nameKey)) continue
    const rawSlot = slotByName?.get(nameKey)
    const slots = rawSlot ? (Array.isArray(rawSlot) ? rawSlot : [rawSlot]) : []
    if (slots.some((s) => usedSlots.has(s))) continue
    if (maxTotal != null && filtered.length >= maxTotal) break
    seenNames.add(nameKey)
    slots.forEach((s) => usedSlots.add(s))
    filtered.push(r)
  }

  let newCount = 0
  return filtered.filter((r) => {
    if (!r.isNew) return true
    newCount += 1
    return newCount <= 2
  })
}

export async function generateAiAssistedLootDiscretion({ monsterType, monsterName, srdContext, notes, countRange, eligibleItems }) {
  const prompt = buildDiscretionPrompt({ monsterType, monsterName, srdContext, notes, countRange, eligibleItems })
  const slotByName = new Map(
    (eligibleItems || []).filter((i) => i.anatomySlot).map((i) => [i.name.toLowerCase(), i.anatomySlot])
  )
  // Loose safety net -- countRange's upper bound plus a little headroom
  // (the guidance is explicitly a ballpark, not a wall), so a model that
  // reasonably judges "this Huge creature warrants a bit more" isn't cut
  // off, while still guarding against a runaway/malformed response.
  const maxTotal = countRange[1] + 3

  let lastError = null
  try {
    const result = await callGemini(prompt)
    if (result) return normalizeDiscretionResult(result, { maxTotal, slotByName })
  } catch (err) {
    console.error('Gemini discretion loot assist failed, trying fallback:', err)
    lastError = err
  }
  try {
    const result = await callClaude(prompt)
    if (result) return normalizeDiscretionResult(result, { maxTotal, slotByName })
  } catch (err) {
    console.error('Claude discretion loot assist failed:', err)
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
// --- Shop wares: a THIRD, deliberately loose use of AI, same spirit as
// generateAiHordeContents above but for an entire store's stock instead
// of one dragon's pile. Per the DM (v3.9): shop generation is AI-driven
// now, full stop -- every field from the shop entity form (Type/Scale/
// Reputation/Cuisine/Clientele/Atmosphere/Notes) gets handed to the
// model, which is expected to build "a fully functioning D&D [store]
// within the parameters" -- i.e. genuine invention is not just allowed
// here, it's the point, same as horde contents. This is a THIRD explicit
// grandfathered exception to the file-top STANDING RULE, alongside the
// two already listed there -- add it to that list's reasoning: a shop's
// whole point (like a horde's) is one-of-a-kind stock a fixed catalog
// can never fully anticipate, and the DM asked for this explicitly this
// round rather than it being inferred.
//
// Existing database items are still offered as anchors/inspiration (and
// the model is told to use them directly where they fit), but there's no
// invented-item cap the way regular/discretion loot has -- a shop with
// zero invented flavor would read as flat and same-y run after run.
//
// Reputation drives BOTH quality (price band/rarity skew) and quantity
// (a shady back-alley table and a prestigious emporium shouldn't just
// differ in flavor text) -- SCALE_COUNT_RANGE below sets the baseline
// item-count band per Scale, and the prompt itself is what actually
// tells the model how Reputation should shift both dimensions from
// there, since "how much fancier is Prestigious than Modest" isn't a
// clean enough number to hardcode.
const SCALE_COUNT_RANGE = {
  'Road Merchant': [4, 8],
  'Market Stall': [6, 12],
  'Modest Shop': [12, 24],
  'Large Emporium': [25, 45],
  'Guild Hall': [35, 60],
}

function buildShopPrompt({ shopType, scale, reputation, cuisine, clientele, atmosphere, notes, eligibleItems, countRange }) {
  const poolText = eligibleItems.map((i) => `- ${i.name} | ${i.priceGp}gp | ${i.category || i.kind || 'Misc'} | ${i.description}`).join('\n')
  const tavernFields = (cuisine || clientele || atmosphere)
    ? `\n- Cuisine Style: ${cuisine || '(unspecified)'}\n- Clientele: ${clientele || '(unspecified)'}\n- Atmosphere: ${atmosphere || '(unspecified)'}`
    : ''
  return `
You are helping a Dungeon Master stock an entire D&D 5.5e shop with believable wares, working within real game mechanics but otherwise using your own judgment and creativity -- this is NOT a strict select-only task like other loot generation on this site. Build a fully functioning, internally consistent shop within the parameters below.

SHOP:
- Type: ${shopType || '(unspecified)'}
- Scale: ${scale || '(unspecified)'}
- Reputation: ${reputation || '(unspecified)'}${tavernFields}
- DM's notes: ${notes || '(none)'}

TARGET SIZE: roughly ${countRange[0]}-${countRange[1]} distinct wares (a shop should have MUCH more stock than a single creature's body loot -- do not undershoot this). Reputation shifts this from the baseline: Shady leans toward the low end of the range (and toward cheap/illicit goods); Prestigious leans toward the high end (and toward higher-value, rarer, better-made goods). Reputation should ALSO shift the average price/rarity of what's offered -- a Prestigious emporium's median item should read as noticeably nicer than a Shady stall's, independent of count.

EXISTING DATABASE ITEMS (real 5.5e SRD items and Magical Junk Drawer items -- use these directly by exact name/price/description wherever they fit this shop; they're your anchors for what's mechanically real):
${poolText || '(none particularly relevant -- invent within genuine 5.5e parameters instead)'}

TASK:
1. Populate the shop's stock so it reads like a real, coherent business of this Type/Scale/Reputation -- a Blacksmith sells weapons/armor/tools, not potions; a Fine Dining establishment's stock is food/drink/service items, not adventuring gear.
2. Use EXISTING DATABASE ITEMS above directly wherever they fit -- exact name, price, and description, unchanged.
3. Where the database doesn't cover something this shop would obviously carry, invent it -- genuinely new items are expected and welcome here, not just a rare exception. Every invented item must still be MECHANICALLY REAL within 5.5e's own logic: if you invent a magic item, its effect must be a plausible, appropriately-costed 5.5e-style effect (comparable to real Common/Uncommon/Rare/Very Rare magic items at that price point), not a vague or overpowered ability. Mundane goods (food, drink, trade goods, tools, trinkets) just need a sensible price and one-line description.
4. Assign every item a "category" for display grouping -- use natural shop-appropriate categories (e.g. "Weapons", "Armor", "Potions & Alchemy", "Magic Items", "Tools & Trade Goods", "Food & Drink", "Trinkets & Curios", "Clothing & Accessories", "Services") -- pick whichever subset actually fits this shop's Type, don't force categories that don't belong.
5. Hit roughly the target size above, shaped by Reputation as described. Do not pad with near-duplicate items just to hit the number.

Return ONLY JSON (no markdown fences, no commentary) matching exactly this shape:
{ "items": [ { "name": string, "priceGp": number, "description": string, "category": string, "isNew": boolean } ] }
`.trim()
}

function normalizeShopResult(raw, maxTotal) {
  const items = Array.isArray(raw.items)
    ? raw.items
        .map((r) => ({
          name: String(r.name || '').trim(),
          priceGp: Number(r.priceGp) || 0,
          description: String(r.description || '').trim(),
          category: String(r.category || 'Misc').trim() || 'Misc',
          isNew: !!r.isNew,
        }))
        .filter((r) => r.name)
    : []
  const seenNames = new Set()
  const filtered = []
  for (const r of items) {
    const nameKey = r.name.toLowerCase()
    if (seenNames.has(nameKey)) continue
    if (maxTotal != null && filtered.length >= maxTotal) break
    seenNames.add(nameKey)
    filtered.push(r)
  }
  return filtered
}

export async function generateAiShopWares({ shopType, scale, reputation, cuisine, clientele, atmosphere, notes, eligibleItems }) {
  const [lo, hi] = SCALE_COUNT_RANGE[scale] || [10, 20]
  const countRange = [lo, hi]
  const prompt = buildShopPrompt({ shopType, scale, reputation, cuisine, clientele, atmosphere, notes, eligibleItems, countRange })
  // Loose safety net, not a strict cap -- same reasoning as discretion
  // mode's headroom, just scaled up: a Prestigious Guild Hall reasonably
  // running past the stated band shouldn't get truncated mid-shelf.
  const maxTotal = hi + Math.ceil(hi * 0.5)

  let lastError = null
  try {
    const result = await callGemini(prompt)
    if (result) return normalizeShopResult(result, maxTotal)
  } catch (err) {
    console.error('Gemini shop wares generation failed, trying fallback:', err)
    lastError = err
  }
  try {
    const result = await callClaude(prompt)
    if (result) return normalizeShopResult(result, maxTotal)
  } catch (err) {
    console.error('Claude shop wares generation failed:', err)
    lastError = err
  }
  if (lastError) throw lastError
  throw new Error(LOOT_AI_UNCONFIGURED)
}

export async function generateAiAssistedLoot({
  monsterType, monsterName, notes, tierLabel, countsByKind, eligibleItems, attributeSummary,
  needsInference, tierOptions, balanced,
}) {
  const prompt = buildPrompt({
    monsterType, monsterName, notes, tierLabel, countsByKind, eligibleItems, attributeSummary,
    needsInference, tierOptions, balanced,
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

  // originByName: only built for source-balanced types (see `balanced`,
  // set from LootTab.jsx's SOURCE_BALANCED_TYPES) -- true = established
  // (SRD/Junk Drawer), false = original. Feeds interleaveByOrigin above.
  const originByName = balanced
    ? new Map((eligibleItems || []).map((i) => [i.name.toLowerCase(), !!i.established]))
    : null

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
    if (result) return normalizeResult(result, validKinds, { maxByKind: resolveMaxByKind(result), slotByName, originByName })
  } catch (err) {
    console.error('Gemini loot assist failed, trying fallback:', err)
    lastError = err
  }
  try {
    const result = await callClaude(prompt)
    if (result) return normalizeResult(result, validKinds, { maxByKind: resolveMaxByKind(result), slotByName, originByName })
  } catch (err) {
    console.error('Claude loot assist failed:', err)
    lastError = err
  }
  if (lastError) throw lastError
  throw new Error(LOOT_AI_UNCONFIGURED)
}
