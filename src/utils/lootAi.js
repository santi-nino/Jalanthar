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
//   4. generateAiExplorationLoot (added v3.14, DM-directed) -- same full
//      invention allowance as Shop, granted explicitly ("let's give it
//      the same allowance as the shop got, in case there's a problem")
//      when the DM approved the Exploration redesign. Originally proposed
//      as select-only (an exploration site "should feel like it's drawn
//      from the world you've already built"), but the DM asked for parity
//      with Shop instead -- noted here for the record, not treated as a
//      mistake to walk back.
//   5. generateAiReskinLoot (added this round, DM-directed) -- a
//      DELIBERATELY NARROW fifth exception, NOT the same full-invention
//      allowance as #2-4 above. Triggered by an actual DM complaint: an
//      "Orc Priestess of Uthgar" generated via regular creature loot came
//      back generic and unmemorable even with Notes filled in, because
//      regular loot is select-only by this very rule. The DM's own
//      example: she might not carry a plain Shortsword, but a "Ceremonial
//      Cudgel of Uthgar" that mechanically FUNCTIONS AS a Shortsword --
//      same category/price/tags, just re-flavored. Hard constraints the
//      DM set, all enforced in code (not just prompt text), same "don't
//      trust compliance alone" reasoning as every other cap in this file:
//        - Only runs when Notes is non-empty. No notes, no reskins, ever.
//        - Capped at ~10% of the entity's total resolved item count (see
//          reskinBudget in generateAiReskinLoot), minimum 1 so a short
//          notes-bearing entity still gets exactly one.
//        - Every result must be either a RESKIN (a real, already-rolled
//          item, renamed/re-described but mechanically byte-for-byte
//          identical -- same category/priceGp/tags/lootTags) or a pure
//          NARRATIVE item (flavor + a gp value, no mechanical tags
//          whatsoever) -- never a new mechanical effect, never a
//          different price band, never a different category.
//      Every result gets persisted into the catalog (see
//      persistAiReskinLoot in LootTab.jsx) with the SAME tag nuance the
//      rest of the catalog carries, so a reskin re-enters the pool for
//      future rolls too, not just this one moment.

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
//
// v3.12: bumped substantially per the DM's own count check (a mobile
// magic shop came back with "too few items, all of them named magic
// items with rarities" -- unusable at the table and nothing like a real
// shop's shelf). Two separate problems, two separate fixes:
// 1. Sheer count was too low across the board -- Road Merchant (the
//    smallest Scale) now targets 20-30 wares, Guild Hall (the biggest)
//    targets 85-100, everything else stepped between. A shop should
//    always read as "a lot of stuff," even the smallest roadside table.
// 2. Nothing enforced a mundane/magic BALANCE, so the model defaulted to
//    "shop = pile of magic items," which is backwards -- most of a real
//    shop's shelf space is boring: rope, rations, tools, trade goods,
//    basic weapons/armor, alchemical odds and ends. See MAGIC_SHARE below
//    and the prompt's explicit ratio instruction, plus a hard code-level
//    cap in normalizeShopResult (same "advisory prompt text alone isn't
//    trustworthy enough" reasoning as every other AI mode on this site).
const SCALE_COUNT_RANGE = {
  'Road Merchant': [20, 30],
  'Market Stall': [30, 45],
  'Modest Shop': [45, 65],
  'Large Emporium': [65, 85],
  'Guild Hall': [85, 100],
}

// --- Wealth-driven magic item rarity system (v3.13, DM-directed) ----------
// The DM's own worked example (destitute: 5% common / cap 3 / avg 0.5;
// modest: 25% common + 10% uncommon / range 3-7 / avg 4) was explicitly
// given as an illustration of the SHAPE they wanted, not literal numbers
// to use -- "COME UP WITH YOUR OWN NUMBERS TO PROPERLY BALANCE THIS."
// The two things the example actually pins down: (1) Wealth should set
// both a magic item COUNT band (with a real average, not just a min/max)
// AND a per-rarity CHANCE distribution that shifts with Wealth, and
// (2) it should "feel like a bell curve" -- top rarities should stay
// genuinely rare even at the richest tier, not just "more likely than
// before."
//
// Reuses the same 6 wealthLevels ids everywhere else on the site
// (destitute/poor/modest/comfortable/wealthy/aristocratic -- see
// defaultLootTaxonomy.js) so a single Wealth field means the same thing
// for a shop as it does for a body's loot. countRange/preferred feed
// weightedRandInt (below) the same "mostly a tight preferred band,
// sometimes the wider full range" logic already used throughout the
// Loadout System, which is what gives the roll its bell-curve feel
// instead of a flat uniform draw. rarityWeights are a full probability
// distribution (always sums to 1) rolled ONCE PER magic item slot -- so
// even Aristocratic's richest shops still only pull Legendary about 3% of
// the time per slot, keeping it a real event rather than a guarantee.
// Every tier's weights strictly shift mass rightward (less Common, more
// of everything above it) as Wealth increases, which is what produces the
// escalating-but-still-rare-at-the-top feel the DM asked for.
const WEALTH_MAGIC_PROFILE = {
  destitute: {
    countRange: [0, 2], preferred: [0, 1],
    rarityWeights: { Common: 0.95, Uncommon: 0.05 },
  },
  poor: {
    countRange: [0, 3], preferred: [1, 2],
    rarityWeights: { Common: 0.82, Uncommon: 0.16, Rare: 0.02 },
  },
  modest: {
    countRange: [1, 4], preferred: [2, 3],
    rarityWeights: { Common: 0.65, Uncommon: 0.28, Rare: 0.07 },
  },
  comfortable: {
    countRange: [2, 6], preferred: [3, 5],
    rarityWeights: { Common: 0.50, Uncommon: 0.33, Rare: 0.15, 'Very Rare': 0.02 },
  },
  wealthy: {
    countRange: [4, 9], preferred: [5, 7],
    rarityWeights: { Common: 0.35, Uncommon: 0.35, Rare: 0.22, 'Very Rare': 0.07, Legendary: 0.01 },
  },
  aristocratic: {
    countRange: [6, 14], preferred: [8, 12],
    rarityWeights: { Common: 0.22, Uncommon: 0.32, Rare: 0.28, 'Very Rare': 0.15, Legendary: 0.03 },
  },
}

const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary']

function randomIntLocal(min, max) {
  const lo = Math.min(min, max)
  const hi = Math.max(min, max)
  return Math.round(lo + Math.random() * (hi - lo))
}

// Same "60% of the time draw from the tight preferred band, 40% of the
// time draw from the full range" shape as LootTab.jsx's weightedRandInt --
// duplicated locally rather than imported since this module is meant to
// stay a leaf (LootTab.jsx imports FROM lootAi.js, not the other way).
function weightedRandIntLocal(min, max, preferMin, preferMax) {
  if (preferMin != null && preferMax != null && Math.random() < 0.6) {
    return randomIntLocal(preferMin, preferMax)
  }
  return randomIntLocal(min, max)
}

function rollRarity(rarityWeights) {
  const roll = Math.random()
  let cumulative = 0
  for (const rarity of RARITY_ORDER) {
    const weight = rarityWeights[rarity]
    if (!weight) continue
    cumulative += weight
    if (roll < cumulative) return rarity
  }
  // Floating point leftover (weights should sum to ~1) -- fall back to
  // the richest rarity this tier actually offers.
  for (let i = RARITY_ORDER.length - 1; i >= 0; i--) {
    if (rarityWeights[RARITY_ORDER[i]]) return RARITY_ORDER[i]
  }
  return 'Common'
}

// Rolls the exact magic-item plan for this shop (or exploration site)
// ONCE, up front, so the prompt can hand the model a hard, specific
// target ("exactly 2 Common, 1 Uncommon") instead of a vague ceiling --
// same "don't trust prompt-only compliance" reasoning as everywhere else
// in this file, just applied before generation instead of only after via
// normalizeShopResult.
//
// maxTotal (optional): Shop doesn't pass this -- a shop's own item-count
// band is generous enough that WEALTH_MAGIC_PROFILE's counts always fit
// inside it comfortably. Exploration DOES pass it, because its site-size
// budget (SIZE_COUNT_RANGE below) is much smaller than a shop's shelf --
// without a cap, an Aristocratic Single Room could roll 8-12 magic items
// against a total budget of 2-4, which reads as absurd (a closet
// shouldn't out-treasure a vault just because Wealth rolled high). When
// trimming is needed, Common items go first -- the DM's whole point in
// asking for this system was "so rare items feel rare," so if a small
// site can't hold everything Wealth rolled, what it keeps should skew
// toward the notable finds, not the filler.
function rollMagicPlan(wealthId, maxTotal) {
  const profile = WEALTH_MAGIC_PROFILE[wealthId] || WEALTH_MAGIC_PROFILE.modest
  const [min, max] = profile.countRange
  const [preferMin, preferMax] = profile.preferred
  let magicCount = weightedRandIntLocal(min, max, preferMin, preferMax)
  const breakdown = {}
  for (let i = 0; i < magicCount; i++) {
    const rarity = rollRarity(profile.rarityWeights)
    breakdown[rarity] = (breakdown[rarity] || 0) + 1
  }
  if (maxTotal != null && magicCount > maxTotal) {
    let excess = magicCount - maxTotal
    for (const rarity of RARITY_ORDER) {
      if (excess <= 0) break
      const trim = Math.min(excess, breakdown[rarity] || 0)
      breakdown[rarity] = (breakdown[rarity] || 0) - trim
      if (breakdown[rarity] === 0) delete breakdown[rarity]
      excess -= trim
    }
    magicCount = maxTotal
  }
  return { magicCount, breakdown }
}

function buildShopPrompt({ shopType, scale, reputation, wealth, cuisine, clientele, atmosphere, notes, eligibleItems, countRange, magicPlan }) {
  const poolText = eligibleItems.map((i) => `- ${i.name} | ${i.priceGp}gp | ${i.category || i.kind || 'Misc'} | ${i.description}`).join('\n')
  const tavernFields = (cuisine || clientele || atmosphere)
    ? `\n- Cuisine Style: ${cuisine || '(unspecified)'}\n- Clientele: ${clientele || '(unspecified)'}\n- Atmosphere: ${atmosphere || '(unspecified)'}`
    : ''
  const breakdownText = RARITY_ORDER
    .map((r) => [r, magicPlan.breakdown[r] || 0])
    .filter(([, n]) => n > 0)
    .map(([r, n]) => `${n} ${r}`)
    .join(', ') || 'none -- this shop should have ZERO genuine magic items'
  return `
You are helping a Dungeon Master stock an entire D&D 5.5e shop with believable wares, working within real game mechanics but otherwise using your own judgment and creativity -- this is NOT a strict select-only task like other loot generation on this site. Build a fully functioning, internally consistent shop within the parameters below.

SHOP:
- Type: ${shopType || '(unspecified)'}
- Scale: ${scale || '(unspecified)'}
- Reputation: ${reputation || '(unspecified)'}
- Wealth: ${wealth || '(unspecified)'}${tavernFields}
- DM's notes: ${notes || '(none)'}

TARGET SIZE: roughly ${countRange[0]}-${countRange[1]} distinct wares. A real shop's shelf is FULL -- even the smallest roadside table should read as genuinely well-stocked, not sparse. Reputation shifts this from the baseline: Shady leans toward the low end of the range (and toward cheap/illicit goods); Prestigious leans toward the high end (and toward higher-value, better-made goods). Reputation should ALSO shift the average price/quality of the MUNDANE goods offered -- a Prestigious emporium's median item should read as noticeably nicer than a Shady stall's, independent of count.

MAGIC ITEM TARGET -- this is a HARD requirement, not a suggestion: this shop's Wealth (${wealth || 'unspecified'}) has already been rolled and must produce EXACTLY this magic item mix, no more, no fewer: ${breakdownText}. Every other item in the shop (the large majority of the stock) must be ORDINARY, NON-MAGICAL goods -- basic adventuring gear, trade tools, raw materials, food/drink, clothing, mundane weapons/armor, alchemical consumables (acid, oil, basic poison), containers, and the like. Do NOT add any additional genuine magic items beyond the exact mix above, and do not fall short of it either -- hit it exactly. A rarer magic item (Rare/Very Rare/Legendary) should feel like a genuine event when the mix includes one -- give it real narrative weight (why does THIS shop have it, is it guarded/displayed differently, is it priced accordingly) rather than shelving it like everything else.

BASE INVENTORY -- a shop's Type has a consistent, recognizable core of goods that shows up at EVERY Scale, not just the big ones: an Apothecary sells glass vials, dried herbs, and basic tinctures whether it's a Road Merchant's cart or a Guild Hall, a Blacksmith sells nails and horseshoes and basic tools alongside weapons at every size. Bigger Scale means MORE of that same core (more vials, more variety of herbs) PLUS additional higher-tier/specialty goods layered on top -- it does NOT mean swapping the fundamentals out for something unrecognizable. Build the shop's base inventory first, then scale it up.

EXISTING DATABASE ITEMS (real 5.5e SRD items and Magical Junk Drawer items -- use these directly by exact name/price/description wherever they fit this shop; they're your anchors for what's mechanically real):
${poolText || '(none particularly relevant -- invent within genuine 5.5e parameters instead)'}

TASK:
1. Populate the shop's stock so it reads like a real, coherent business of this Type/Scale/Reputation -- a Blacksmith sells weapons/armor/tools, not potions; a Fine Dining establishment's stock is food/drink/service items, not adventuring gear.
2. Use EXISTING DATABASE ITEMS above directly wherever they fit -- exact name, price, and description, unchanged. Most of the mundane goods should come from here or be invented in the same plain, unglamorous style.
3. Where the database doesn't cover something this shop would obviously carry, invent it -- genuinely new items are expected and welcome here, not just a rare exception, ESPECIALLY for mundane goods (a shop's core inventory is mostly things too ordinary to be individually catalogued -- rope, nails, jars, herbs, cheap tools). Every invented MAGIC item must still be MECHANICALLY REAL within 5.5e's own logic: its effect must be a plausible, appropriately-costed 5.5e-style effect matching the rarity it's assigned (Common/Uncommon effects are minor conveniences; Rare/Very Rare/Legendary effects are genuinely powerful and should be priced and described accordingly), not a vague or overpowered ability for its stated rarity.
4. Assign every item a "category" for display grouping -- use natural shop-appropriate categories (e.g. "Weapons", "Armor", "Potions & Alchemy", "Magic Items", "Tools & Trade Goods", "Food & Drink", "Trinkets & Curios", "Clothing & Accessories", "Services") -- pick whichever subset actually fits this shop's Type, don't force categories that don't belong.
5. Set "isMagic": true ONLY for items with a genuine mechanical enchantment (a real magic item), false for everything else (mundane gear, tools, consumables, trade goods, even if flavorful or expensive). For every isMagic:true item, set "rarity" to exactly one of "Common", "Uncommon", "Rare", "Very Rare", "Legendary", matching the MAGIC ITEM TARGET mix above. For every isMagic:false item, set "rarity" to "" (empty string).
6. Hit roughly the target size above, shaped by Reputation as described, and hit the MAGIC ITEM TARGET exactly. Do not pad with near-duplicate items just to hit the number, but DO include the kind of mundane variety a real shop shelf has (don't stop at 5 kinds of rope-and-rations filler -- a Blacksmith's shelf has dozens of distinct, specific items: several weapon types, armor pieces, tools, raw materials, repair supplies).

Return ONLY JSON (no markdown fences, no commentary) matching exactly this shape:
{ "items": [ { "name": string, "priceGp": number, "description": string, "category": string, "isMagic": boolean, "rarity": string, "isNew": boolean } ] }
`.trim()
}

// magicPlan: hard code-level enforcement of the rolled per-rarity mix,
// same "advisory prompt text alone isn't trustworthy enough" reasoning as
// every other count/cap in this file (regular loot's per-kind cap,
// discretion's maxTotal, the invented-item cap). Mundane items are never
// trimmed; only excess magic items -- beyond what the plan allows FOR
// THAT SPECIFIC RARITY -- get dropped, keeping the first ones the model
// listed per rarity (assumed roughly priority order) and cutting from the
// tail. A magic item the model marked isMagic:true but with an unrecognized
// rarity string is treated as excess and dropped rather than silently
// let through uncapped.
function normalizeShopResult(raw, maxTotal, magicPlan) {
  const items = Array.isArray(raw.items)
    ? raw.items
        .map((r) => ({
          name: String(r.name || '').trim(),
          priceGp: Number(r.priceGp) || 0,
          description: String(r.description || '').trim(),
          category: String(r.category || 'Misc').trim() || 'Misc',
          isMagic: !!r.isMagic,
          rarity: r.isMagic ? String(r.rarity || '').trim() : '',
          isNew: !!r.isNew,
        }))
        .filter((r) => r.name)
    : []
  const seenNames = new Set()
  const filtered = []
  const magicCountByRarity = {}
  const breakdown = magicPlan?.breakdown || {}
  for (const r of items) {
    const nameKey = r.name.toLowerCase()
    if (seenNames.has(nameKey)) continue
    if (maxTotal != null && filtered.length >= maxTotal) break
    if (r.isMagic) {
      const allowed = RARITY_ORDER.includes(r.rarity) ? (breakdown[r.rarity] || 0) : 0
      const soFar = magicCountByRarity[r.rarity] || 0
      if (soFar >= allowed) continue
      magicCountByRarity[r.rarity] = soFar + 1
    }
    seenNames.add(nameKey)
    filtered.push(r)
  }
  return filtered
}

// --- Reputation-driven price markup system (v3.13, DM-directed) ----------
// The DM's own worked example (Prestigious: mostly fair, small chance of
// a mild premium on rare items; Shady: flat markup on everything plus a
// chance of a steeper markup on rarer items) was, again, explicitly given
// as illustrative shape rather than literal numbers. Applied as a
// deterministic POST-PROCESSING pass on the model's own returned prices,
// not left to the model to roleplay correctly -- same reasoning as every
// other numeric guarantee in this file: a shop's whole point (per the DM)
// is that Reputation should reliably shift how much you get overcharged,
// and that can't depend on the model choosing to comply on any given call.
// baseMultiplier applies to EVERY item (a Shady shop marks up the mundane
// stuff too, not just the flashy stuff); rareUpchargeChance/Multiplier is
// a SECOND, independent roll that only fires on items at or above
// rareUpchargeMinRarity, layering an extra "the shady fence spotted you
// eyeing something good" or "the collector's premium on something rare
// even at a fair shop" markup on top of the base. Reputable/Prestigious
// intentionally keep the base at (or under) 1.0 -- a well-regarded shop
// doesn't gouge on the ordinary stuff, full stop -- while still allowing
// a small, occasional premium on genuinely rare stock.
const REPUTATION_PRICE_PROFILE = {
  Shady: { baseMultiplier: 1.4, rareUpchargeChance: 0.22, rareUpchargeMultiplier: 1.9, rareUpchargeMinRarity: 'Uncommon' },
  Modest: { baseMultiplier: 1.15, rareUpchargeChance: 0.12, rareUpchargeMultiplier: 1.5, rareUpchargeMinRarity: 'Rare' },
  Reputable: { baseMultiplier: 1.0, rareUpchargeChance: 0.06, rareUpchargeMultiplier: 1.3, rareUpchargeMinRarity: 'Rare' },
  Prestigious: { baseMultiplier: 0.98, rareUpchargeChance: 0.10, rareUpchargeMultiplier: 1.2, rareUpchargeMinRarity: 'Very Rare' },
}

// Rolled independently per item (not per shop) so a Shady stall's rack of
// rare goods doesn't uniformly jump to 2x together -- some items catch
// the upcharge, most don't, which reads more like an opportunistic
// merchant than a shop-wide sale/markup event.
function applyReputationPricing(items, reputation) {
  const profile = REPUTATION_PRICE_PROFILE[reputation] || REPUTATION_PRICE_PROFILE.Modest
  const minIdx = RARITY_ORDER.indexOf(profile.rareUpchargeMinRarity)
  return items.map((item) => {
    let multiplier = profile.baseMultiplier
    let overcharged = false
    const rarityIdx = RARITY_ORDER.indexOf(item.rarity)
    const eligibleForUpcharge = item.isMagic && rarityIdx >= 0 && rarityIdx >= minIdx
    if (eligibleForUpcharge && Math.random() < profile.rareUpchargeChance) {
      multiplier = profile.rareUpchargeMultiplier
      overcharged = true
    }
    const basePriceGp = item.priceGp
    const priceGp = Math.max(1, Math.round(basePriceGp * multiplier))
    return { ...item, priceGp, basePriceGp, overcharged }
  })
}

export async function generateAiShopWares({ shopType, scale, reputation, wealth, wealthLabel, cuisine, clientele, atmosphere, notes, eligibleItems }) {
  const [lo, hi] = SCALE_COUNT_RANGE[scale] || [20, 30]
  const countRange = [lo, hi]
  const magicPlan = rollMagicPlan(wealth)
  const prompt = buildShopPrompt({ shopType, scale, reputation, wealth: wealthLabel || wealth, cuisine, clientele, atmosphere, notes, eligibleItems, countRange, magicPlan })
  // Loose safety net, not a strict cap -- same reasoning as discretion
  // mode's headroom, just scaled up: a Prestigious Guild Hall reasonably
  // running past the stated band shouldn't get truncated mid-shelf.
  const maxTotal = hi + Math.ceil(hi * 0.5)

  let lastError = null
  try {
    const result = await callGemini(prompt)
    if (result) return applyReputationPricing(normalizeShopResult(result, maxTotal, magicPlan), reputation)
  } catch (err) {
    console.error('Gemini shop wares generation failed, trying fallback:', err)
    lastError = err
  }
  try {
    const result = await callClaude(prompt)
    if (result) return applyReputationPricing(normalizeShopResult(result, maxTotal, magicPlan), reputation)
  } catch (err) {
    console.error('Claude shop wares generation failed:', err)
    lastError = err
  }
  if (lastError) throw lastError
  throw new Error(LOOT_AI_UNCONFIGURED)
}

// --- Exploration site loot: a FOURTH loose AI mode (v3.14, DM-directed),
// same full-invention allowance as Shop -- granted explicitly by the DM
// ("let's give it the same allowance as the shop got, in case there's a
// problem") rather than the select-only design originally proposed. See
// the file-top STANDING RULE comment's exception #4.
//
// Mirrors Shop's architecture closely on purpose (the DM asked to keep
// "the logic and momentum of this system"): Size plays Scale's role
// (sets the base item-count budget), Wealth rolls the same magic-item
// plan Shop uses (WEALTH_MAGIC_PROFILE/rollMagicPlan, shared code) just
// capped to the site's own much smaller budget so a small room can't
// out-treasure a shop. Condition and Occupied By are exploration-only
// wrinkles Shop doesn't have: Condition shifts the budget itself
// (Already Looted trims hard and suppresses magic finds -- the good
// stuff is already gone) and colors tone; Occupied By's Guardian Type
// blends a real monster type's own tagged item pool in as thematic
// anchors, so a Guarded vault's loot can genuinely include Humanoid- or
// Undead-flavored pieces instead of Exploration being disconnected from
// the monster side entirely.
const SIZE_COUNT_RANGE = {
  'Single Room': [2, 4],
  'Small Site': [4, 8],
  'Sprawling Complex': [8, 15],
  'Vast Ruin': [15, 25],
}

// countMultiplier shrinks/grows the Size-driven budget; magicMultiplier
// separately shrinks/grows the maxTotal handed to rollMagicPlan's cap --
// kept as two separate knobs because Already Looted should suppress
// magic finds much harder than it suppresses overall count (a picked-over
// room can still have plenty of mundane junk left behind, just not the
// good stuff). toneNote feeds directly into the prompt.
const CONDITION_MODIFIER = {
  Pristine: {
    countMultiplier: 1, magicMultiplier: 1,
    toneNote: 'Untouched and well-preserved. Items should read as intact, in good condition for their age, and if anything skew toward the better-preserved/higher-value end of what fits this site.',
  },
  'Already Looted': {
    countMultiplier: 0.5, magicMultiplier: 0.25,
    toneNote: 'Already picked over by someone else. What remains is what previous looters missed, discarded, or couldn\'t carry -- mostly low-value scraps, dropped coin, and things not worth an earlier looter\'s time. Genuine magic items should be rare here specifically because anything obviously valuable is already gone.',
  },
  'Ancient/Decayed': {
    countMultiplier: 1, magicMultiplier: 1,
    toneNote: 'Old enough that time has taken a toll. Describe mundane items as worn, rusted, rotted, or faded -- narratively decayed -- WITHOUT changing their real mechanical stats or a magic item\'s actual enchantment; the decay is flavor, not a nerf. A few items can be narrative-only husks of what they used to be (no gp value beyond curiosity).',
  },
  Trapped: {
    countMultiplier: 1, magicMultiplier: 1,
    toneNote: 'This site\'s best find is guarded by a trap or hazard -- call this out explicitly in that item\'s description (a pressure plate, a ward, a rigged mechanism) so the DM can run it at the table. The rest of the site is normal.',
  },
}

function buildExplorationPrompt({ explorationType, size, condition, occupied, guardianType, wealth, notes, eligibleItems, countRange, magicPlan, conditionNote }) {
  const poolText = eligibleItems.map((i) => `- ${i.name} | ${i.priceGp}gp | ${i.category || i.kind || 'Misc'} | ${i.description}`).join('\n')
  const breakdownText = RARITY_ORDER
    .map((r) => [r, magicPlan.breakdown[r] || 0])
    .filter(([, n]) => n > 0)
    .map(([r, n]) => `${n} ${r}`)
    .join(', ') || 'none -- this site should have ZERO genuine magic items'
  const guardianText = guardianType
    ? `\n- Guardian Type: ${guardianType} (this site is ${(occupied || 'occupied').toLowerCase()} by something of this type -- some loot may plausibly belong to it or reflect its presence, alongside the site's own inherent loot)`
    : ''
  return `
You are helping a Dungeon Master populate the loot found at a D&D 5.5e exploration site, working within real game mechanics but otherwise using your own judgment and creativity -- this is NOT a strict select-only task like regular creature loot on this site. Build a believable, internally consistent haul for the site below.

SITE:
- Type: ${explorationType || '(unspecified)'}
- Size: ${size || '(unspecified)'}
- Condition: ${condition || '(unspecified)'}
- Occupied By: ${occupied || '(unspecified)'}${guardianText}
- Wealth: ${wealth || '(unspecified)'}
- DM's notes: ${notes || '(none)'}

CONDITION NOTE: ${conditionNote}

TARGET SIZE: roughly ${countRange[0]}-${countRange[1]} distinct items total, before Condition's own adjustment above is applied.

MAGIC ITEM TARGET -- this is a HARD requirement, not a suggestion: this site's Wealth (${wealth || 'unspecified'}) has already been rolled and must produce EXACTLY this magic item mix, no more, no fewer: ${breakdownText}. Every other item found must be ORDINARY, NON-MAGICAL loot appropriate to the site -- coin, trade goods, tools, mundane weapons/armor, personal effects, raw materials, whatever this specific Type of site would plausibly contain. Do NOT add any additional genuine magic items beyond the exact mix above. A rarer magic item (Rare/Very Rare/Legendary) should feel like a genuine discovery -- give it real narrative weight (why is it here, how is it protected or hidden) rather than treating it like ordinary clutter.

EXISTING DATABASE ITEMS (real 5.5e SRD items, Magical Junk Drawer items, and -- if a Guardian Type is set above -- that monster type's own tagged flavor items: use these directly by exact name/price/description wherever they genuinely fit this site; they're your anchors for what's mechanically real):
${poolText || '(none particularly relevant -- invent within genuine 5.5e parameters instead)'}

TASK:
1. Populate the site's loot so it reads like a real, coherent find for this specific Type/Size/Condition/Occupied By combination -- a Tomb's loot looks different from a Shipwreck's, even at the same Wealth and Size. If the Type or Notes describe an unusual combination (a temple built like a ship, a sunken warship converted into a shrine, etc.), honor that specific framing rather than defaulting to the closest generic preset.
2. Use EXISTING DATABASE ITEMS above directly wherever they fit -- exact name, price, and description, unchanged.
3. Where the database doesn't cover something this site would obviously contain, invent it -- genuinely new items are expected and welcome here, not just a rare exception. Every invented MAGIC item must still be MECHANICALLY REAL within 5.5e's own logic: its effect must be a plausible, appropriately-costed 5.5e-style effect matching the rarity it's assigned, not a vague or overpowered ability for its stated rarity.
4. Assign every item a "category" for display grouping -- use natural categories for this kind of find (e.g. "Coin & Valuables", "Weapons", "Armor", "Magic Items", "Tools & Supplies", "Personal Effects", "Curiosities", "Religious Items") -- pick whichever subset actually fits this site, don't force categories that don't belong.
5. Set "isMagic": true ONLY for items with a genuine mechanical enchantment, false for everything else. For every isMagic:true item, set "rarity" to exactly one of "Common", "Uncommon", "Rare", "Very Rare", "Legendary", matching the MAGIC ITEM TARGET mix above. For every isMagic:false item, set "rarity" to "" (empty string).
6. Hit roughly the target size above (adjusted per the CONDITION NOTE), and hit the MAGIC ITEM TARGET exactly. Do not pad with near-duplicate items just to hit the number.
7. For every item where "isNew" is true (genuinely invented, not pulled from EXISTING DATABASE ITEMS): set "monsterTypeTags" to an array of zero or more of these 14 creature types -- Aberration, Beast, Celestial, Construct, Dragon, Elemental, Fey, Fiend, Giant, Humanoid, Monstrosity, Ooze, Plant, Undead -- ONLY include a type if this specific item would genuinely, plausibly turn up as THAT creature's own loot too (anatomically or thematically), not just "could theoretically exist near one." Most invented items should get an empty array -- this is deliberately conservative; a wrong tag here would let an item leak into loot it doesn't belong in. For every item where "isNew" is false, set "monsterTypeTags" to [].

Return ONLY JSON (no markdown fences, no commentary) matching exactly this shape:
{ "items": [ { "name": string, "priceGp": number, "description": string, "category": string, "isMagic": boolean, "rarity": string, "isNew": boolean, "monsterTypeTags": string[] } ] }
`.trim()
}

// Unlike normalizeShopResult (shop-invented items are never persisted
// anywhere, so their monsterTypeTags guess would just be dead weight),
// Exploration's invented items DO get saved back into the catalog (see
// generateLocation's exploration branch in LootTab.jsx) -- so this keeps
// monsterTypeTags on the way out instead of discarding it. Otherwise
// identical dedup/cap logic (name dedup, maxTotal cap, per-rarity
// magicPlan enforcement).
const VALID_MONSTER_TYPES = new Set([
  'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental',
  'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead',
])
function normalizeExplorationResult(raw, maxTotal, magicPlan) {
  const withTags = Array.isArray(raw.items)
    ? raw.items.map((r) => ({
        ...r,
        monsterTypeTags: r.isNew && Array.isArray(r.monsterTypeTags)
          ? r.monsterTypeTags.filter((t) => VALID_MONSTER_TYPES.has(t))
          : [],
      }))
    : []
  const filtered = normalizeShopResult({ items: withTags }, maxTotal, magicPlan)
  const tagByName = new Map(withTags.map((r) => [String(r.name || '').trim().toLowerCase(), r.monsterTypeTags]))
  return filtered.map((r) => ({ ...r, monsterTypeTags: tagByName.get(r.name.toLowerCase()) || [] }))
}

export async function generateAiExplorationLoot({ explorationType, size, condition, occupied, guardianType, wealth, wealthLabel, notes, eligibleItems }) {
  const [baseLo, baseHi] = SIZE_COUNT_RANGE[size] || [4, 8]
  const modifier = CONDITION_MODIFIER[condition] || CONDITION_MODIFIER.Pristine
  const lo = Math.max(0, Math.round(baseLo * modifier.countMultiplier))
  const hi = Math.max(lo + 1, Math.round(baseHi * modifier.countMultiplier))
  const countRange = [lo, hi]

  // Magic count is capped against the site's OWN budget (scaled by
  // Condition's separate magicMultiplier), not Shop's generous headroom
  // -- see the comment above CONDITION_MODIFIER and rollMagicPlan's
  // maxTotal param for why this matters.
  const magicCap = Math.max(0, Math.round(hi * 0.4 * modifier.magicMultiplier))
  const magicPlan = rollMagicPlan(wealth, magicCap)

  const prompt = buildExplorationPrompt({
    explorationType, size, condition, occupied, guardianType,
    wealth: wealthLabel || wealth, notes, eligibleItems, countRange, magicPlan,
    conditionNote: modifier.toneNote,
  })
  const maxTotal = hi + Math.ceil(hi * 0.5)

  let lastError = null
  try {
    const result = await callGemini(prompt)
    if (result) return normalizeExplorationResult(result, maxTotal, magicPlan)
  } catch (err) {
    console.error('Gemini exploration loot generation failed, trying fallback:', err)
    lastError = err
  }
  try {
    const result = await callClaude(prompt)
    if (result) return normalizeExplorationResult(result, maxTotal, magicPlan)
  } catch (err) {
    console.error('Claude exploration loot generation failed:', err)
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

// --- Notes-driven reskins: a FIFTH, deliberately NARROW exception to the
// file-top STANDING RULE -- see exception #5 in that comment block for the
// full reasoning/constraints. Runs AFTER an entity's normal loot (kind-
// bucketed, Loadout System, or flat draw -- doesn't matter which) has
// already been resolved, and only ever touches a small slice of it.

// Claude's own scale, capped hard: never more than 3 reskins/narrative
// items on a single entity regardless of how large its item count is --
// even a big Aristocratic haul with lots of Notes text shouldn't turn into
// "everything is a unique snowflake."
const RESKIN_MAX = 3

function reskinBudget(itemCount) {
  if (itemCount <= 0) return 0
  return Math.max(1, Math.min(RESKIN_MAX, Math.round(itemCount * 0.1)))
}

function buildReskinPrompt({ monsterType, monsterName, notes, candidates, budget }) {
  const poolText = candidates
    .map((i, idx) => `${idx}. ${i.name} | ${i.category || 'Misc'} | ${i.priceGp}gp | ${i.description || ''}`)
    .join('\n')
  return `
You are helping a Dungeon Master add small, memorable narrative flourishes to a D&D creature's loot, based on their freeform notes. This is a NARROW task -- you are NOT generating this creature's whole loot list (that already happened separately), you are only deciding whether up to ${budget} of the items below deserve a themed reskin, or whether one small purely-narrative item should be added.

CREATURE CONTEXT:
- Monster Type: ${monsterType}
- Specific Monster (if given): ${monsterName || '(none)'}
- DM's notes: ${notes}

THIS CREATURE'S ALREADY-ROLLED ITEMS (0-indexed -- reskin candidates ONLY come from this exact list):
${poolText || '(none)'}

TASK: produce AT MOST ${budget} entries, each one of exactly two kinds:
1. "reskin" -- pick one item from the numbered list above by its index and give it a new, evocative name and a one-sentence description that reflects the DM's notes, WITHOUT changing what it mechanically is. The DM's own example: a Shortsword doesn't have to stay "Shortsword" for an orc priestess of Uthgar -- it could become a "Ceremonial Cudgel of Uthgar" (same category, same price, same everything mechanical -- purely a rename + re-description). Only reskin an item if the notes genuinely suggest something more specific/thematic than the generic catalog name -- do not reskin something that's already perfectly fitting as-is. The new name must NOT reference or contain the original item's catalog name (e.g. don't call it "Ceremonial Cudgel (formerly Shortsword)") -- that equivalence belongs ONLY in the description, and gets appended there automatically afterward, so just write the flavor description itself, without your own "functions like X" line.
2. "narrative" -- a brand-new SMALL, flavorful, non-mechanical item implied by the notes but not covered by anything already rolled (a keepsake, a personal token, a small memento) -- gp value only (roughly 1-30gp, this is flavor, not treasure), no mechanical properties whatsoever.

It is completely fine, and often correct, to return FEWER than ${budget} entries (including zero) if the notes don't genuinely call for any -- do not force reskins/narrative items that don't fit.

Return ONLY JSON (no markdown fences, no commentary) matching exactly this shape:
{ "entries": [ { "type": "reskin", "index": number, "newName": string, "newDescription": string } | { "type": "narrative", "newName": string, "newDescription": string, "priceGp": number } ] }
`.trim()
}

// The DM's fix (this round): the "(reskin of X)" UI badge wasn't working
// well as the way to communicate mechanical equivalence -- replaced with a
// plain-language phrase baked directly INTO the item's own description,
// picked from three DM-specified variants. This is enforced here in code,
// not left to the prompt alone (same "don't trust compliance" reasoning
// as every other guarantee in this file) -- every reskin gets this phrase
// appended regardless of what the model actually wrote.
const RESKIN_EQUIVALENCE_PHRASES = [
  (name) => `Functions like ${name}.`,
  (name) => `Functions the same as ${name}.`,
  (name) => `Has the same properties as ${name}.`,
]

function withEquivalencePhrase(description, originalName) {
  const phrase = RESKIN_EQUIVALENCE_PHRASES[Math.floor(Math.random() * RESKIN_EQUIVALENCE_PHRASES.length)](originalName)
  return description ? `${description} ${phrase}` : phrase
}

// Deterministic guard (same "don't trust compliance" reasoning as
// withEquivalencePhrase above): the prompt now tells the model not to put
// the original item's catalog name inside the new name, but nothing stops
// it from doing so anyway. If the original name (or a parenthetical
// referencing it, e.g. "(formerly Shortsword)" / "(was: Shortsword)")
// shows up in the model's newName, strip it out here in code rather than
// hoping the instruction was followed -- the original item's identity is
// only ever supposed to live in the description, via the equivalence
// phrase appended above.
function stripOriginalNameReference(newName, originalName) {
  if (!originalName) return newName
  const escaped = originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  let cleaned = newName
    .replace(new RegExp(`\\s*\\([^()]*${escaped}[^()]*\\)`, 'gi'), '')
    .replace(new RegExp(escaped, 'gi'), '')
  cleaned = cleaned.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:])/g, '$1').trim()
  return cleaned || newName.trim()
}

function normalizeReskinResult(raw, candidates, budget) {
  const entries = Array.isArray(raw.entries) ? raw.entries : []
  const usedIndexes = new Set()
  const reskins = []
  const narrativeItems = []
  for (const e of entries) {
    if (reskins.length + narrativeItems.length >= budget) break
    if (e.type === 'reskin') {
      const idx = Number(e.index)
      if (!Number.isInteger(idx) || idx < 0 || idx >= candidates.length || usedIndexes.has(idx)) continue
      const rawName = String(e.newName || '').trim()
      const rawDescription = String(e.newDescription || '').trim()
      if (!rawName) continue
      const original = candidates[idx]
      const newName = stripOriginalNameReference(rawName, original.name)
      const newDescription = withEquivalencePhrase(rawDescription, original.name)
      usedIndexes.add(idx)
      reskins.push({ index: idx, original, newName, newDescription })
    } else if (e.type === 'narrative') {
      const newName = String(e.newName || '').trim()
      const newDescription = String(e.newDescription || '').trim()
      if (!newName) continue
      const priceGp = Math.max(0, Math.min(30, Number(e.priceGp) || 1))
      narrativeItems.push({ newName, newDescription, priceGp })
    }
  }
  return { reskins, narrativeItems }
}

// candidates: the entity's own already-resolved items, each as
// {name, category, priceGp, description} (see LootTab.jsx's dispatch for
// exactly what gets passed). Returns { reskins, narrativeItems } -- see
// normalizeReskinResult -- caller (LootTab.jsx) is responsible for both
// applying these to the entity's item list AND persisting them into the
// catalog (see persistAiReskinLoot).
export async function generateAiReskinLoot({ monsterType, monsterName, notes, candidates }) {
  const budget = reskinBudget(candidates.length)
  if (budget === 0 || !notes || !notes.trim()) return { reskins: [], narrativeItems: [] }

  const prompt = buildReskinPrompt({ monsterType, monsterName, notes, candidates, budget })

  let lastError = null
  try {
    const result = await callGemini(prompt)
    if (result) return normalizeReskinResult(result, candidates, budget)
  } catch (err) {
    console.error('Gemini reskin generation failed, trying fallback:', err)
    lastError = err
  }
  try {
    const result = await callClaude(prompt)
    if (result) return normalizeReskinResult(result, candidates, budget)
  } catch (err) {
    console.error('Claude reskin generation failed:', err)
    lastError = err
  }
  if (lastError) throw lastError
  throw new Error(LOOT_AI_UNCONFIGURED)
}
