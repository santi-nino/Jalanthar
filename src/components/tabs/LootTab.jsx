import { useMemo, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { buildItemPool } from '../../utils/itemPool'
import { formatPrice } from '../../utils/price'
import { LOCATION_TYPES, VEHICLE_CATEGORIES } from '../../data/defaultLootTaxonomy'
import { generateAiAssistedLoot, generateAiHordeContents, LOOT_AI_UNCONFIGURED } from '../../utils/lootAi'

const POOL_OPTIONS = [
  { id: 'wares', label: 'Wares' },
  { id: 'menu', label: 'Menu' },
  { id: 'services', label: 'Services' },
]

const DEFAULT_POOLS = {
  encounter: ['wares', 'services'],
  // Broadened to cover restaurants and taverns too, now that those are
  // Shop Types rather than their own top-level location category.
  shop: ['wares', 'menu'],
  exploration: ['wares', 'services'],
}

function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomInt(min, max) {
  const lo = Math.min(min, max)
  const hi = Math.max(min, max)
  return Math.round(lo + Math.random() * (hi - lo))
}

// Every place that needs "the available categories for these pools" goes
// through here so the vehicles/mounts default-exclusion is applied
// consistently. Deliberately NOT in utils/itemPool.js -- the building
// catalog editor uses that same buildItemPool() and SHOULD always show
// Mount/Vehicle normally.
function categoriesForPools(pools, sources, includeVehicles) {
  const combined = pools.flatMap((p) => buildItemPool(p, sources))
  const filtered = includeVehicles ? combined : combined.filter((i) => !VEHICLE_CATEGORIES.includes(i.category))
  return [...new Set(filtered.map((i) => i.category))].sort((a, b) => a.localeCompare(b))
}

// Collects every pattern from a given per-option field ('excludedItemPatterns'
// or 'guaranteedItems') across whichever attribute values are currently
// selected. Item-NAME-level, not category-level -- "a mage wouldn't have
// a sword" excludes Longsword/Shortsword/Greatsword by substring match,
// not the entire Weapon category (a dagger or component pouch stays fine).
function patternsFor(attributes, values, field) {
  const result = new Set()
  ;(attributes || []).forEach((attr) => {
    const selected = values[attr.id]
    const patterns = selected && attr[field]?.[selected]
    if (patterns) patterns.forEach((p) => result.add(p))
  })
  return [...result]
}

function matchesAnyPattern(itemName, patterns) {
  if (!patterns || patterns.length === 0) return false
  const lower = itemName.toLowerCase()
  return patterns.some((p) => lower.includes(p.toLowerCase()))
}

// Splits the raw pool into items hard-scoped to this exact monster type
// (via the invisible monsterTypeTags field -- see itemPool.js; an item
// can carry MULTIPLE type tags, since a generic torch or coin purse
// legitimately belongs in a soldier's pocket, a beast's den, AND an
// aberration's stomach at once) and everything else. Tagged-and-matching
// items are ALWAYS eligible, bypassing the coarser category restriction
// entirely -- a "Blue Dragon Heart" reaches a Dragon entity regardless
// of what categories or price range are in play, and never reaches
// anything untagged for Dragon, full stop. Everything else -- including
// fully generic items AND items tagged for a DIFFERENT type (a Torch
// tagged for Aberration's stomach loot is still just an ordinary shop
// item to everyone else) -- still goes through the normal coarse
// category restriction, same as before.
function scopeToMonsterType(pool, monsterType, typeCategoryRestriction) {
  const tagged = monsterType ? pool.filter((i) => i.monsterTypeTags?.includes(monsterType)) : []
  const taggedSet = new Set(tagged)
  const rest = pool.filter((i) => !taggedSet.has(i))
  const allowedRest =
    typeCategoryRestriction !== undefined
      ? rest.filter((i) => typeCategoryRestriction.includes(i.category))
      : rest
  return [...tagged, ...allowedRest]
}

function drawLoot({
  pools, sources, categories, priceMin, priceMax, count, allowDuplicates, includeVehicles, excludedPatterns, monsterType, typeCategoryRestriction,
}) {
  let pool = pools.flatMap((p) => buildItemPool(p, sources).map((item) => ({ ...item, pool: p })))
  if (!includeVehicles) pool = pool.filter((i) => !VEHICLE_CATEGORIES.includes(i.category))
  pool = scopeToMonsterType(pool, monsterType, typeCategoryRestriction)
  if (excludedPatterns && excludedPatterns.length > 0) {
    pool = pool.filter((i) => !matchesAnyPattern(i.name, excludedPatterns))
  }
  const filtered = pool.filter((i) => {
    if (categories.length > 0 && !categories.includes(i.category)) return false
    if (priceMin != null && i.priceGp < priceMin) return false
    if (priceMax != null && i.priceGp > priceMax) return false
    return true
  })
  const n = Math.max(0, Math.round(Number(count) || 0))
  if (n === 0 || filtered.length === 0) return []
  if (allowDuplicates) {
    return Array.from({ length: n }, () => filtered[Math.floor(Math.random() * filtered.length)])
  }
  return shuffled(filtered).slice(0, n)
}

// Maps each kind-bucketed type to its Size attribute id and whichever
// OTHER dimensions its items get filtered by (Aberration: origin/
// xenotype; Beast: kingdom/diet). `key` must match the corresponding key
// used in that item's lootTags (e.g. lootTags.kingdom); `attr` is the
// dynamic attribute id supplying the entity's actual value for it. Add
// an entry here whenever another monster type gets this same overhaul
// treatment -- the engine itself doesn't need to change.
const KIND_BUCKET_CONFIG = {
  Aberration: {
    sizeAttr: 'aberration-size',
    dimensions: [
      { key: 'origin', attr: 'aberration-origin' },
      { key: 'xenotype', attr: 'aberration-xenotype' },
    ],
  },
  Beast: {
    sizeAttr: 'beast-size',
    dimensions: [
      { key: 'kingdom', attr: 'beast-kingdom' },
      { key: 'diet', attr: 'beast-diet' },
    ],
  },
  Celestial: {
    sizeAttr: 'celestial-rank',
    // Low-to-high order, matching the Rank attribute's own options --
    // this is what lets an item's lootTags.minRank (an index into this
    // list) gate it to "this rank or higher" rather than needing an
    // exact-match tag the way Domain works.
    sizeOrder: ['Servant', 'Messenger', 'Guardian', 'Herald', 'Exarch', 'Archon', 'Empyreal'],
    dimensions: [{ key: 'domain', attr: 'celestial-domain' }],
  },
  // Dragon is the first type where WHICH field drives amount depends on
  // another field's value: Metallic/Chromatic use Age Category (and get
  // the full anatomical kind-bucket set); Drake/Draconid use Habitat
  // instead (a smaller, more mundane set). `resolve` computes the
  // actual {sizeAttr, sizeOrder, dimensions} to use for THIS entity,
  // given its current attributeValues -- every consumer below calls
  // this instead of reading a static config.
  Dragon: {
    resolve(attributeValues) {
      const dragonType = attributeValues['dragon-type']
      if (dragonType === 'Drake' || dragonType === 'Draconid') {
        return {
          sizeAttr: 'dragon-habitat',
          dimensions: [{ key: 'lineage', attr: 'dragon-lineage' }],
        }
      }
      // Metallic / Chromatic (or unset, defaults to this richer path)
      return {
        sizeAttr: 'dragon-age',
        dimensions: [{ key: 'lineage', attr: 'dragon-lineage' }],
      }
    },
  },
  // Construct only has two fields total, and Purpose does double duty:
  // it's the sizeAttr (drives sizeLootTable.Construct's counts, same as
  // Size/Rank everywhere else) AND it's ALSO listed as a dimension
  // (drives eligibility via each item's lootTags.purpose), since the
  // request was for Purpose to both narrow AND determine amount at
  // once. Mechanism is the other dimension -- and because every
  // Construct "parts" item is tagged to exactly one mechanism with no
  // untagged overlap between them, this is what actually enforces "no
  // shared body parts between a Magical construct and a Mechanical one."
  Construct: {
    sizeAttr: 'construct-purpose',
    dimensions: [
      { key: 'mechanism', attr: 'construct-mechanism' },
      { key: 'purpose', attr: 'construct-purpose' },
    ],
  },
  // Power Level is the sizeAttr (drives sizeLootTable.Elemental's counts,
  // including the supplementary Power kind's own count). sizeOrder is
  // what lets Power-kind items carry a minRank threshold, same mechanism
  // as Celestial's Rank -- a Mephit (ordinal 0) only sees minRank 0 Power
  // items, a Myrmidon (ordinal 3) sees those plus everything gated up to
  // minRank 3. Element and Sub-Element are both dimensions, same overlap
  // rule as everywhere else -- an item tagged to a specific sub-element
  // only shows there, tagged only to the parent element shows across all
  // of that element's sub-elements, untagged crosses everything.
  Elemental: {
    sizeAttr: 'elemental-power',
    sizeOrder: ['Mephit', 'Elemental', 'Elder Elemental', 'Myrmidon'],
    dimensions: [
      { key: 'element', attr: 'elemental-element' },
      { key: 'subelement', attr: 'elemental-subelement' },
    ],
  },
  // Fey MONSTER path only -- see fey-is-monster in defaultLootTaxonomy.js.
  // Court is the sole dimension (pure theming, per the DM); Rank drives
  // amount, same sizeAttr/sizeOrder role Power Level plays for Elemental.
  // The Person path never reaches this config at all -- see
  // generateLoadoutLoot and the dispatch in generateEncounter instead.
  Fey: {
    sizeAttr: 'fey-rank',
    sizeOrder: ['Minor Fey', 'Fey', 'Noble Fey', 'Arch Fey'],
    dimensions: [{ key: 'court', attr: 'fey-court' }],
  },
}

// Non-kind keys that can appear alongside the kind buckets in a
// sizeLootTable tier (e.g. Celestial's Rank tiers carry priceRange and
// goldRange too) -- these get pulled out before iterating "kinds",
// otherwise they'd be mistaken for kind names with a suspiciously
// two-element array as their "count range."
const SIZE_TABLE_META_KEYS = new Set(['priceRange', 'goldRange'])

// The kind-bucketed generation engine: instead of one flat random count
// across the whole pool, each "kind" (per sizeLootTable) gets its own
// count rolled independently from the entity's Size/Rank, then filled
// from whichever catalog items are compatible with the entity's OTHER
// dimensions (however many are configured above). An item tagged for a
// dimension only shows up when the entity's value matches; an item with
// no tag for that dimension is compatible regardless -- that's the
// "overlap" mechanism (a generic Item shows up for every Domain;
// something tagged Light shows up for a Light-domain celestial of any
// Rank; a Servant-rank Life-domain celestial draws from the
// intersection of "cheap enough for Servant" and "tagged Life, or
// untagged"). A size/rank rolling 0-0 for a given kind is what actually
// enforces "this tier doesn't yield that kind of loot" -- the count is
// zero, not a manual block.
//
// priceRange / goldRange (optional, per tier): when a tier carries
// these, eligible items get further filtered to that price band, and
// gold gets rolled from its own range and returned alongside the items
// -- this is what lets Rank drive POWER as well as quantity for a type
// like Celestial, not just Size-style headcounts.
//
// features (optional): a {featureName: boolean} map for this entity --
// any item requiring a feature (lootTags.requiresFeature) that isn't
// checked true gets excluded outright, regardless of anything else
// matching.
//
// setting (optional): after the main kind buckets, a SEPARATE 0-2 item
// bonus draw from whichever items are tagged kind:'Setting' and (if
// tagged) compatible with this setting specifically -- pure flavor, not
// counted against the main totals at all.
// Some types (Dragon) need a DIFFERENT sizeAttr/dimensions depending on
// another field's current value -- those configs carry a resolve()
// function instead of static keys. Every consumer of KIND_BUCKET_CONFIG
// calls this instead of reading the raw entry directly.
function resolveKindBucketConfig(monsterType, attributeValues) {
  const raw = KIND_BUCKET_CONFIG[monsterType]
  if (!raw) return null
  return raw.resolve ? raw.resolve(attributeValues) : raw
}

// The Magical Junk Drawer's fixed Firestore doc ID -- see mockData.js.
// Hardcoded rather than looked up by name because the DM can rename a
// source, but this specific document's identity as "the" Junk Drawer is
// what matters here, same reasoning as PROGRAMMATIC_SOURCE_IDS in seed.js.
const MAGICAL_JUNK_DRAWER_SOURCE_ID = 'sGUAccXFQOl3hwTl7OYP'

// "Established" = the SRD catalog (dnd5eItems.js, ids like "item-42") or
// the Magical Junk Drawer specifically -- content that isn't this
// project's own original material. Everything else (Xenobiological Ledger,
// Empyreal Reliquary, Animus Salvage Registry, Planebound Ledger, a type's
// future dedicated source, etc) counts as "original" for this purpose. See
// itemPool.js's sourceItemsForPool for the "source-{sourceId}-{rowId}" id
// shape this relies on.
function isEstablishedSource(item) {
  return item.id?.startsWith('item-') || item.id?.startsWith(`source-${MAGICAL_JUNK_DRAWER_SOURCE_ID}-`)
}

// The monster types where the DM asked for an enforced mix between
// established (SRD/Junk Drawer) and original (a type's own dedicated
// source) content -- everything worked on so far EXCEPT Dragon,
// Humanoid, and Beast, which the DM said explicitly "function by their
// own rules" (Beast added to this exemption list after the DM clarified
// it should stay dedicated-source-only, same as Dragon/Humanoid, rather
// than needing an established-item mix). Add a type here once its own
// dedicated source exists and it's ready for this treatment. Fey's
// monster path is included; Fey's Person path (Loadout System) is NOT --
// that path deliberately overlaps with Humanoid's own rules, which are
// explicitly exempt from this balance rule per the DM.
const SOURCE_BALANCED_TYPES = new Set(['Aberration', 'Celestial', 'Construct', 'Elemental', 'Fey'])

function generateKindBucketedLoot({ monsterType, taxonomy, sources, attributeValues, excludedPatterns, features, setting }) {
  const sizeTable = taxonomy.sizeLootTable?.[monsterType]
  const config = resolveKindBucketConfig(monsterType, attributeValues)
  if (!sizeTable || !config) return { items: [], flavorItems: [], gold: 0 }

  const size = attributeValues[config.sizeAttr]
  const dimValues = {}
  config.dimensions.forEach((d) => {
    dimValues[d.key] = attributeValues[d.attr]
  })
  const tier = sizeTable[size]
  if (!tier) return { items: [], flavorItems: [], gold: 0 }

  const rawPool = buildItemPool('wares', sources).filter((i) => i.monsterTypeTags?.includes(monsterType))

  function isCompatible(item) {
    for (const d of config.dimensions) {
      const tagVals = item.lootTags?.[d.key]
      if (tagVals && !tagVals.includes(dimValues[d.key])) return false
    }
    const required = item.lootTags?.requiresFeature
    if (required && !(features && features[required])) return false
    const minRank = item.lootTags?.minRank
    if (minRank != null && config.sizeOrder) {
      const entityOrdinal = config.sizeOrder.indexOf(size)
      if (entityOrdinal < minRank) return false
    }
    return true
  }

  const [priceMin, priceMax] = tier.priceRange || [null, null]

  // lootTags.anatomySlot (optional): marks an item as one of a kind on
  // the actual body -- a creature has exactly one skull, one set of
  // horns, one beak, etc, even though two DIFFERENT catalog items might
  // both represent "the skull" (a plain one and a species-specific one
  // can both be eligible for the same entity via the normal tag-overlap
  // rules). Without this, a Trophy count of 2 could legitimately draw
  // BOTH -- correct per kind-count, wrong anatomically. usedSlots is
  // tracked across the WHOLE entity's draw (every kind bucket shares it),
  // not per-kind, so a skull claimed by Trophy also blocks a second skull
  // item from Parts or anywhere else. Items without an anatomySlot tag
  // are unaffected, same as always. Can be a single string or an array
  // of strings -- an item that's inherently multiple body parts at once
  // (e.g. a "Tusked Skull Trophy" that already includes the tusks) can
  // claim more than one slot, so a separate standalone tusks item never
  // ALSO gets drawn on top of it.
  function slotsOf(item) {
    const raw = item.lootTags?.anatomySlot
    if (!raw) return []
    return Array.isArray(raw) ? raw : [raw]
  }

  const usedSlots = new Set()
  const balanced = SOURCE_BALANCED_TYPES.has(monsterType)

  // Tries to add candidates from `pool`, in shuffled order, until `picked`
  // reaches `target` -- respecting anatomySlot and never adding the same
  // item object twice. Shared by both the plain and balanced draw paths
  // below so slot enforcement is identical either way.
  function fillFrom(picked, pool, target) {
    for (const candidate of shuffled(pool)) {
      if (picked.length >= target) break
      if (picked.includes(candidate)) continue
      const slots = slotsOf(candidate)
      if (slots.some((s) => usedSlots.has(s))) continue
      picked.push(candidate)
      slots.forEach((s) => usedSlots.add(s))
    }
  }

  const items = []
  Object.entries(tier).forEach(([kind, range]) => {
    if (SIZE_TABLE_META_KEYS.has(kind)) return
    const [min, max] = range
    const n = randomInt(min, max)
    if (n === 0) return
    let eligible = rawPool.filter((i) => i.lootTags?.kind === kind && isCompatible(i))
    if (priceMin != null) eligible = eligible.filter((i) => i.priceGp >= priceMin && i.priceGp <= priceMax)
    if (excludedPatterns && excludedPatterns.length > 0) {
      eligible = eligible.filter((i) => !matchesAnyPattern(i.name, excludedPatterns))
    }
    if (eligible.length === 0) return

    const picked = []
    if (balanced) {
      // Split into established (SRD/Junk Drawer) vs original (the type's
      // dedicated source), fill roughly half from each -- WHICH side goes
      // first is randomized per draw so neither side systematically wins
      // the "gets the odd leftover slot" tiebreak over many rolls -- then
      // backfill from the other side, then (only if slot conflicts left
      // both sides short) from the full eligible pool, so a real mix is
      // enforced first and totals still land on n whenever possible.
      const established = eligible.filter(isEstablishedSource)
      const original = eligible.filter((i) => !isEstablishedSource(i))
      const firstIsEstablished = Math.random() < 0.5
      const [firstPool, secondPool] = firstIsEstablished ? [established, original] : [original, established]
      fillFrom(picked, firstPool, Math.min(n, Math.ceil(n / 2)))
      fillFrom(picked, secondPool, n)
      if (picked.length < n) fillFrom(picked, eligible, n)
    } else {
      fillFrom(picked, eligible, n)
    }
    items.push(...picked)
  })

  let flavorItems = []
  if (setting) {
    const settingPool = rawPool.filter(
      (i) => i.lootTags?.kind === 'Setting' && (!i.lootTags?.setting || i.lootTags.setting.includes(setting))
    )
    const flavorCount = randomInt(0, 2)
    if (flavorCount > 0 && settingPool.length > 0) {
      flavorItems = shuffled(settingPool).slice(0, Math.min(flavorCount, settingPool.length))
    }
  }

  const gold = tier.goldRange ? randomInt(tier.goldRange[0], tier.goldRange[1]) : 0

  return { items, flavorItems, gold }
}

// --- The Loadout System ---------------------------------------------------
// A named, reusable alternative to the kind-bucketed engine above, for
// types where loot is "things you'd find on a person" rather than
// anatomy -- built for Fey's Person path, written generically so a future
// request ("implement the Loadout System with Humanoid") can point it at
// any monster type's own `taxonomy.loadouts[role]` entry without engine
// changes. See defaultLootTaxonomy.js's `loadouts` block for the full
// schema (fixed / rankScaled / ranged / goldByRank) and per-role rules.

// Rolls within [min,max], but 60% of the time narrows first to
// [preferMin,preferMax] -- this is what makes "0-4 with a preference for
// 2-3" land mostly in the preferred band without ever being IMPOSSIBLE to
// roll a 0 or a 4, unlike a hard clamp would.
function weightedRandInt(min, max, preferMin, preferMax) {
  if (preferMin != null && preferMax != null && Math.random() < 0.6) {
    return randomInt(preferMin, preferMax)
  }
  return randomInt(min, max)
}

// Resolves a loadout slot's `pool` name to the actual eligible items.
// MartialWeapon/SimpleWeapon and Clothes/ArcaneFocus deliberately read
// the SRD catalog's OWN pre-existing tags/category rather than needing
// new per-item tagging (a "martial" weapon or "clothing"-tagged Gear item
// is already exactly that, for any type that wants it) -- Boots/Helmet/
// Shoes are small new base items added to dnd5eItems.js since the SRD
// itself doesn't price separate footwear/headwear. Everything else reads
// lootTags.loadoutPool, tagged per monsterType (see mockData.js/
// dnd5eItems.js for the Fey tagging pass).
// Firearms (Musket/Pistol) are tagged "martial" like any other weapon, but
// they read as jarringly anachronistic for a fae Fighter/Trickster --
// exactly the "hell-themed fire item for fey" mismatch the DM warned
// about, just for tech-flavor instead of alignment-flavor. Excluded from
// BOTH weapon pools regardless of monster type -- no Loadout-System user
// built so far (Fey; Humanoid whenever it's pointed at this system) wants
// a musket showing up as their "martial weapon."
const LOADOUT_WEAPON_EXCLUDES = new Set(['Musket', 'Pistol'])

function loadoutPoolFor(name, rawPool) {
  switch (name) {
    case 'MartialWeapon':
      return rawPool.filter((i) => i.category === 'Weapon' && i.tags?.includes('martial') && !LOADOUT_WEAPON_EXCLUDES.has(i.name))
    case 'SimpleWeapon':
      return rawPool.filter((i) => i.category === 'Weapon' && i.tags?.includes('simple') && !LOADOUT_WEAPON_EXCLUDES.has(i.name))
    case 'ArcaneFocus':
      return rawPool.filter((i) => i.category === 'Focus' && i.name.startsWith('Arcane Focus'))
    case 'Clothes':
      return rawPool.filter((i) => i.tags?.includes('clothing'))
    default:
      return rawPool.filter((i) => i.lootTags?.loadoutPool === name)
  }
}

function generateLoadoutLoot({ monsterType, role, rank, taxonomy, sources, excludedPatterns }) {
  const loadout = taxonomy.loadouts?.[role]
  if (!loadout) return { items: [], gold: 0 }

  // Unlike the kind-bucketed engine, Loadout pools are NOT hard-scoped by
  // monsterTypeTags for the tag-free pools (MartialWeapon/SimpleWeapon/
  // Clothes/ArcaneFocus/Boots/Helmet/Shoes) -- those already only contain
  // items that make sense for anyone using this system. The
  // loadoutPool-tagged pools (MagicItem/MagicWeapon/Supplementary/Junk)
  // DO still require monsterTypeTags to include this type, same
  // hard-scoping convention as everywhere else, so a Fey-tagged whimsical
  // item never leaks into a different type's Loadout draw.
  const rawPool = buildItemPool('wares', sources).filter(
    (i) => !i.lootTags?.loadoutPool || i.monsterTypeTags?.includes(monsterType)
  )

  const items = []
  const usedNames = new Set()
  function draw(pool, n) {
    if (n <= 0) return
    let avail = pool.filter((i) => !usedNames.has(i.name))
    if (excludedPatterns && excludedPatterns.length > 0) {
      avail = avail.filter((i) => !matchesAnyPattern(i.name, excludedPatterns))
    }
    const picked = shuffled(avail).slice(0, Math.min(n, avail.length))
    picked.forEach((i) => usedNames.add(i.name))
    items.push(...picked)
  }

  ;(loadout.fixed || []).forEach((slot) => draw(loadoutPoolFor(slot.pool, rawPool), slot.count))
  ;(loadout.rankScaled || []).forEach((slot) => {
    const [min, max] = slot.rankRange[rank] || [0, 0]
    draw(loadoutPoolFor(slot.pool, rawPool), randomInt(min, max))
  })
  ;(loadout.ranged || []).forEach((slot) => {
    const n = weightedRandInt(slot.min, slot.max, slot.preferMin, slot.preferMax)
    draw(loadoutPoolFor(slot.pool, rawPool), n)
  })

  const goldRange = loadout.goldByRank?.[rank]
  const gold = goldRange ? randomInt(goldRange[0], goldRange[1]) : 0

  return { items, gold }
}

// Computes the SAME eligible pool and count limits generateKindBucketedLoot
// would use, without actually rolling -- this is what gets handed to the
// AI as context, so it's selecting from (and bounded by) the exact same
// rules a normal deterministic roll would be, not inventing its own.
// Works for kind-bucketed types only; non-kind-bucketed types fall back
// to their normal generation and never reach the AI path (see
// generateEncounter).
function computeEligiblePoolForAi({ monsterType, taxonomy, sources, attributeValues, excludedPatterns, features }) {
  const sizeTable = taxonomy.sizeLootTable?.[monsterType]
  const config = resolveKindBucketConfig(monsterType, attributeValues)
  if (!sizeTable || !config) return null

  const size = attributeValues[config.sizeAttr]
  const tier = sizeTable[size]
  const rawPool = buildItemPool('wares', sources).filter((i) => i.monsterTypeTags?.includes(monsterType))

  if (!tier) {
    // The tier-driving field (Size/Age/Rank/Purpose/Habitat) isn't set
    // -- this happens whenever a DM fills in ONLY Specific Monster or
    // Notes without also touching the dropdowns, which is exactly the
    // "pick Giant Lizard and go" workflow that was asked for. Rather
    // than fail outright (which is what silently produced 0gp/nothing
    // before), hand the AI the FULL tier table so it can infer which
    // tier fits the named monster/notes, plus the full tagged pool
    // (unfiltered by dimension, since we don't know the dimension
    // value yet either) so it has real options to choose from.
    let eligible = rawPool
    // requiresFeature gating still applies even here -- the tier dropdown
    // being unset doesn't mean feature checkboxes are unknown, and every
    // checkbox starts unchecked by convention. Skipping this (as this
    // branch used to) is exactly how a Specific-Monster-only pick like a
    // plain snake could still see Horns-gated items in its pool: nothing
    // ever excluded them, since dimension filtering legitimately can't
    // run yet (Kingdom/Element/etc aren't known), but feature filtering
    // always could have.
    eligible = eligible.filter((i) => {
      const required = i.lootTags?.requiresFeature
      return !required || !!(features && features[required])
    })
    if (excludedPatterns && excludedPatterns.length > 0) {
      eligible = eligible.filter((i) => !matchesAnyPattern(i.name, excludedPatterns))
    }
    return {
      needsInference: true,
      tierOptions: sizeTable,
      eligibleItems: eligible.map((i) => ({
        name: i.name, priceGp: i.priceGp, description: i.description,
        kind: i.lootTags?.kind, tags: i.lootTags, anatomySlot: i.lootTags?.anatomySlot,
        established: isEstablishedSource(i),
      })),
      attributeSummary: 'not yet set by the DM -- infer the right tier and tags from the monster name/notes',
      balanced: SOURCE_BALANCED_TYPES.has(monsterType),
    }
  }

  const dimValues = {}
  config.dimensions.forEach((d) => {
    dimValues[d.key] = attributeValues[d.attr]
  })

  function isCompatible(item) {
    for (const d of config.dimensions) {
      const tagVals = item.lootTags?.[d.key]
      if (tagVals && !tagVals.includes(dimValues[d.key])) return false
    }
    const required = item.lootTags?.requiresFeature
    if (required && !(features && features[required])) return false
    const minRank = item.lootTags?.minRank
    if (minRank != null && config.sizeOrder) {
      const entityOrdinal = config.sizeOrder.indexOf(size)
      if (entityOrdinal < minRank) return false
    }
    return true
  }

  const countsByKind = {}
  Object.entries(tier).forEach(([kind, range]) => {
    if (!SIZE_TABLE_META_KEYS.has(kind)) countsByKind[kind] = range
  })

  let eligible = rawPool.filter((i) => Object.hasOwn(countsByKind, i.lootTags?.kind) && isCompatible(i))
  if (excludedPatterns && excludedPatterns.length > 0) {
    eligible = eligible.filter((i) => !matchesAnyPattern(i.name, excludedPatterns))
  }
  const eligibleItems = eligible.map((i) => ({
    name: i.name, priceGp: i.priceGp, description: i.description, kind: i.lootTags.kind,
    anatomySlot: i.lootTags?.anatomySlot, established: isEstablishedSource(i),
  }))

  return {
    countsByKind, eligibleItems,
    attributeSummary: Object.entries(dimValues).map(([k, v]) => `${k}=${v || '(any)'}`).join(', '),
    balanced: SOURCE_BALANCED_TYPES.has(monsterType),
  }
}

// The other half of "make good guesses": baseline items that appear
// REGARDLESS of the random draw ("most people would have shoes"),
// resolved separately from the item-count roll rather than competing
// with it for one of its slots. Tries to find a real catalog match for
// each pattern (so it carries a real price); falls back to a bare,
// price-less placeholder line if nothing in the current catalog matches,
// so the guarantee still shows up honestly rather than silently vanishing.
function resolveGuaranteedItems(patterns, pools, sources, includeVehicles) {
  if (!patterns || patterns.length === 0) return []
  const pool = pools.flatMap((p) => buildItemPool(p, sources))
  const usable = includeVehicles ? pool : pool.filter((i) => !VEHICLE_CATEGORIES.includes(i.category))
  return patterns.map((pattern) => {
    const match = usable.find((i) => i.name.toLowerCase().includes(pattern.toLowerCase()))
    if (match) return { ...match, id: `${match.id}-guaranteed`, guaranteed: true }
    return {
      id: `guaranteed-${pattern}`,
      name: pattern,
      priceGp: null,
      description: '(guaranteed — no exact match in your current catalog)',
      category: 'Guaranteed',
      guaranteed: true,
    }
  })
}

// --- Small reusable pieces ---------------------------------------------

function EditableList({ label, items, onChange, onRename, placeholder }) {
  const [input, setInput] = useState('')
  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')

  function add() {
    const v = input.trim()
    if (v && !items.includes(v)) onChange([...items, v])
    setInput('')
  }
  function remove(v) {
    onChange(items.filter((x) => x !== v))
  }
  function startEdit(v) {
    setEditing(v)
    setEditValue(v)
  }
  function commitEdit() {
    const newVal = editValue.trim()
    if (!newVal || newVal === editing || items.includes(newVal)) {
      setEditing(null)
      return
    }
    onChange(items.map((x) => (x === editing ? newVal : x)))
    onRename?.(editing, newVal)
    setEditing(null)
  }

  return (
    <div>
      {label && <span className="text-xs font-display uppercase text-ink-soft block mb-1">{label}</span>}
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {items.map((v) =>
          editing === v ? (
            <input
              key={v}
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  commitEdit()
                }
                if (e.key === 'Escape') setEditing(null)
              }}
              className="rounded-sm border border-leather bg-white px-2 py-0.5 text-xs w-28"
            />
          ) : (
            <span key={v} className="inline-flex items-center gap-1 bg-white/60 border border-leather/40 rounded-sm pl-2 pr-1 py-0.5 text-xs">
              <button type="button" onClick={() => startEdit(v)} title="Click to rename" className="hover:underline">
                {v}
              </button>
              <button type="button" onClick={() => remove(v)} aria-label={`Remove ${v}`} className="text-wax-dark hover:text-wax font-bold leading-none px-0.5">×</button>
            </span>
          )
        )}
        {items.length === 0 && <span className="text-xs text-ink-soft/50 italic">None yet</span>}
      </div>
      <div className="flex gap-1.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs"
        />
        <button type="button" onClick={add} disabled={!input.trim()} className="px-2 py-1 text-xs font-display uppercase bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40">Add</button>
      </div>
    </div>
  )
}

function EditableWealthList({ items, onChange }) {
  const [form, setForm] = useState({ label: '', min: '', max: '', minItems: '', maxItems: '', goldMin: '', goldMax: '' })
  const [editingId, setEditingId] = useState(null)
  const [editLabel, setEditLabel] = useState('')

  function add() {
    const label = form.label.trim()
    if (!label) return
    onChange([
      ...items,
      {
        id: `wealth-${Date.now()}`,
        label,
        min: Number(form.min) || 0,
        max: Number(form.max) || 0,
        minItems: Number(form.minItems) || 0,
        maxItems: Number(form.maxItems) || 0,
        goldMin: Number(form.goldMin) || 0,
        goldMax: Number(form.goldMax) || 0,
      },
    ])
    setForm({ label: '', min: '', max: '', minItems: '', maxItems: '', goldMin: '', goldMax: '' })
  }
  function remove(id) {
    onChange(items.filter((w) => w.id !== id))
  }
  function updateField(id, key, value) {
    onChange(items.map((w) => (w.id === id ? { ...w, [key]: Number(value) || 0 } : w)))
  }
  function commitLabel(id) {
    const v = editLabel.trim()
    if (v) onChange(items.map((w) => (w.id === id ? { ...w, label: v } : w)))
    setEditingId(null)
  }

  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1">
        Wealth Levels <span className="text-ink-soft/50 normal-case">— sets the gp price range, item count, AND coin rolled, all from one pick</span>
      </span>
      <div className="space-y-1 mb-1.5">
        {items.map((w) => (
          <div key={w.id} className="flex flex-wrap items-center gap-2 bg-white/60 border border-leather/40 rounded-sm px-2 py-1 text-xs">
            {editingId === w.id ? (
              <input autoFocus value={editLabel} onChange={(e) => setEditLabel(e.target.value)} onBlur={() => commitLabel(w.id)} onKeyDown={(e) => e.key === 'Enter' && commitLabel(w.id)} className="w-24 rounded-sm border border-leather bg-white px-1 py-0.5" />
            ) : (
              <button type="button" onClick={() => { setEditingId(w.id); setEditLabel(w.label) }} title="Click to rename" className="flex-1 text-left hover:underline min-w-[5rem]">{w.label}</button>
            )}
            <span className="text-ink-soft/50">item gp</span>
            <input type="number" min="0" value={w.min} onChange={(e) => updateField(w.id, 'min', e.target.value)} className="w-14 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span>–</span>
            <input type="number" min="0" value={w.max} onChange={(e) => updateField(w.id, 'max', e.target.value)} className="w-14 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span className="text-ink-soft/50 ml-2"># items</span>
            <input type="number" min="0" value={w.minItems} onChange={(e) => updateField(w.id, 'minItems', e.target.value)} className="w-12 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span>–</span>
            <input type="number" min="0" value={w.maxItems} onChange={(e) => updateField(w.id, 'maxItems', e.target.value)} className="w-12 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span className="text-ink-soft/50 ml-2">coin gp</span>
            <input type="number" min="0" value={w.goldMin ?? 0} onChange={(e) => updateField(w.id, 'goldMin', e.target.value)} className="w-14 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span>–</span>
            <input type="number" min="0" value={w.goldMax ?? 0} onChange={(e) => updateField(w.id, 'goldMax', e.target.value)} className="w-14 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <button type="button" onClick={() => remove(w.id)} aria-label={`Remove ${w.label}`} className="text-wax-dark hover:text-wax font-bold leading-none px-1">×</button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label" className="rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs w-24" />
        <input type="number" min="0" value={form.min} onChange={(e) => setForm({ ...form, min: e.target.value })} placeholder="Min item gp" className="w-20 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.max} onChange={(e) => setForm({ ...form, max: e.target.value })} placeholder="Max item gp" className="w-20 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.minItems} onChange={(e) => setForm({ ...form, minItems: e.target.value })} placeholder="Min #" className="w-14 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.maxItems} onChange={(e) => setForm({ ...form, maxItems: e.target.value })} placeholder="Max #" className="w-14 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.goldMin} onChange={(e) => setForm({ ...form, goldMin: e.target.value })} placeholder="Min coin gp" className="w-20 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.goldMax} onChange={(e) => setForm({ ...form, goldMax: e.target.value })} placeholder="Max coin gp" className="w-20 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <button type="button" onClick={add} disabled={!form.label.trim()} className="px-2 py-1 text-xs font-display uppercase bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40">Add</button>
      </div>
    </div>
  )
}

function MonsterTypeCategoryMapper({ monsterTypes, mapping, allCategories, onChange }) {
  const [selectedType, setSelectedType] = useState(monsterTypes[0] || '')
  const current = mapping[selectedType] || []
  function toggle(cat) {
    const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat]
    onChange({ ...mapping, [selectedType]: next })
  }
  if (monsterTypes.length === 0) return <p className="text-xs text-ink-soft/50 italic">Add a monster type above first.</p>
  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1">
        Monster Type → Categories <span className="text-ink-soft/50 normal-case">(coarse pass -- which item categories are eligible at all)</span>
      </span>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-xs mb-1.5">
        {monsterTypes.map((t) => <option key={t} value={t}>{t} {mapping[t]?.length ? `(${mapping[t].length} allowed)` : '(all allowed)'}</option>)}
      </select>
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
        {allCategories.map((cat) => (
          <button key={cat} type="button" onClick={() => toggle(cat)} className={`text-xs rounded-sm px-2 py-1 border ${current.includes(cat) ? 'bg-moss-dark text-parchment border-moss-dark' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}>{cat}</button>
        ))}
        {allCategories.length === 0 && <span className="text-xs text-ink-soft/50 italic">No categories available yet.</span>}
      </div>
    </div>
  )
}

// Editor for ONE attribute (e.g. Beast's "Diet"): rename it, manage its
// options, and manage per-option excluded/guaranteed item NAME patterns
// (free text, substring-matched -- "Sword" excludes Longsword etc.
// without touching the whole Weapon category).
function AttributeEditor({ attribute, onChange, onDelete }) {
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(attribute.name)
  const [patternOption, setPatternOption] = useState(attribute.options[0] || '')

  function commitName() {
    const v = nameValue.trim()
    if (v) onChange({ ...attribute, name: v })
    setEditingName(false)
  }
  function setOptions(newOptions) {
    const nextExcluded = { ...attribute.excludedItemPatterns }
    const nextGuaranteed = { ...attribute.guaranteedItems }
    Object.keys(nextExcluded).forEach((k) => { if (!newOptions.includes(k)) delete nextExcluded[k] })
    Object.keys(nextGuaranteed).forEach((k) => { if (!newOptions.includes(k)) delete nextGuaranteed[k] })
    onChange({ ...attribute, options: newOptions, excludedItemPatterns: nextExcluded, guaranteedItems: nextGuaranteed })
    if (!newOptions.includes(patternOption)) setPatternOption(newOptions[0] || '')
  }
  function renameOption(oldName, newName) {
    const nextExcluded = { ...attribute.excludedItemPatterns }
    const nextGuaranteed = { ...attribute.guaranteedItems }
    if (nextExcluded[oldName]) { nextExcluded[newName] = nextExcluded[oldName]; delete nextExcluded[oldName] }
    if (nextGuaranteed[oldName]) { nextGuaranteed[newName] = nextGuaranteed[oldName]; delete nextGuaranteed[oldName] }
    onChange({ ...attribute, excludedItemPatterns: nextExcluded, guaranteedItems: nextGuaranteed })
    if (patternOption === oldName) setPatternOption(newName)
  }
  function setExcludedPatterns(patterns) {
    onChange({ ...attribute, excludedItemPatterns: { ...attribute.excludedItemPatterns, [patternOption]: patterns } })
  }
  function setGuaranteedPatterns(patterns) {
    onChange({ ...attribute, guaranteedItems: { ...attribute.guaranteedItems, [patternOption]: patterns } })
  }

  return (
    <div className="border border-leather/30 rounded-sm bg-white/50 p-2.5 space-y-2">
      <div className="flex items-center gap-2">
        {editingName ? (
          <input autoFocus value={nameValue} onChange={(e) => setNameValue(e.target.value)} onBlur={commitName} onKeyDown={(e) => e.key === 'Enter' && commitName()} className="flex-1 rounded-sm border border-leather bg-white px-2 py-1 text-sm font-display" />
        ) : (
          <button type="button" onClick={() => setEditingName(true)} title="Click to rename" className="flex-1 text-left font-display text-sm text-leather-dark hover:underline">{attribute.name}</button>
        )}
        <button type="button" onClick={onDelete} className="text-xs text-wax-dark hover:text-wax underline shrink-0">Delete field</button>
      </div>
      <EditableList label="Options" items={attribute.options} onChange={setOptions} onRename={renameOption} placeholder="e.g. Herbivore" />
      {attribute.options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-leather/20">
          <div>
            <span className="text-xs font-display uppercase text-ink-soft block mb-1">
              Per-option: never carries <span className="text-ink-soft/50 normal-case">(name text, e.g. "Sword")</span>
            </span>
            <select value={patternOption} onChange={(e) => setPatternOption(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1 text-xs mb-1">
              {attribute.options.map((o) => (
                <option key={o} value={o}>{o} {attribute.excludedItemPatterns?.[o]?.length ? `(${attribute.excludedItemPatterns[o].length})` : ''}</option>
              ))}
            </select>
            <EditableList items={attribute.excludedItemPatterns?.[patternOption] || []} onChange={setExcludedPatterns} placeholder="e.g. Sword" />
          </div>
          <div>
            <span className="text-xs font-display uppercase text-ink-soft block mb-1">
              Per-option: always carries <span className="text-ink-soft/50 normal-case">(baseline, bypasses the roll)</span>
            </span>
            <select value={patternOption} onChange={(e) => setPatternOption(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1 text-xs mb-1">
              {attribute.options.map((o) => (
                <option key={o} value={o}>{o} {attribute.guaranteedItems?.[o]?.length ? `(${attribute.guaranteedItems[o].length})` : ''}</option>
              ))}
            </select>
            <EditableList items={attribute.guaranteedItems?.[patternOption] || []} onChange={setGuaranteedPatterns} placeholder="e.g. Boots" />
          </div>
        </div>
      )}
    </div>
  )
}

function AttributeSetEditor({ attributes, onChange }) {
  const [newName, setNewName] = useState('')
  function addAttribute() {
    const name = newName.trim()
    if (!name) return
    onChange([...attributes, { id: `attr-${Date.now()}`, name, options: [], excludedItemPatterns: {}, guaranteedItems: {} }])
    setNewName('')
  }
  function updateAttribute(id, updated) {
    onChange(attributes.map((a) => (a.id === id ? updated : a)))
  }
  function deleteAttribute(id) {
    onChange(attributes.filter((a) => a.id !== id))
  }
  return (
    <div className="space-y-2">
      {attributes.map((attr) => (
        <AttributeEditor key={attr.id} attribute={attr} onChange={(updated) => updateAttribute(attr.id, updated)} onDelete={() => deleteAttribute(attr.id)} />
      ))}
      {attributes.length === 0 && <p className="text-xs text-ink-soft/50 italic">No custom fields yet for this type.</p>}
      <div className="flex gap-1.5">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addAttribute()} placeholder="New field name, e.g. Diet" className="flex-1 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <button type="button" onClick={addAttribute} disabled={!newName.trim()} className="px-2 py-1 text-xs font-display uppercase bg-moss-dark text-parchment rounded-sm hover:opacity-90 disabled:opacity-40">+ Add Field</button>
      </div>
    </div>
  )
}

function TypeAttributeManager({ label, types, typeLabels, attributesByType, onChange }) {
  const [selectedType, setSelectedType] = useState(types[0] || '')
  if (types.length === 0) return null
  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1.5">{label}</span>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm mb-2">
        {types.map((t) => <option key={t} value={t}>{typeLabels ? typeLabels[t] : t}</option>)}
      </select>
      <AttributeSetEditor attributes={attributesByType[selectedType] || []} onChange={(v) => onChange({ ...attributesByType, [selectedType]: v })} />
    </div>
  )
}

// Type-level baseline items (e.g. every Humanoid guarantees Boots/Clothes
// regardless of Role) -- simpler than the per-option version, just one
// list per type.
function TypeGuaranteedItemsManager({ label, types, typeLabels, itemsByType, onChange }) {
  const [selectedType, setSelectedType] = useState(types[0] || '')
  if (types.length === 0) return null
  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1.5">{label}</span>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm mb-2">
        {types.map((t) => <option key={t} value={t}>{typeLabels ? typeLabels[t] : t}</option>)}
      </select>
      <EditableList items={itemsByType[selectedType] || []} onChange={(v) => onChange({ ...itemsByType, [selectedType]: v })} placeholder="e.g. Boots" />
    </div>
  )
}

// Which monster types even show a Wealth field. "Wealth" (economic
// status) doesn't apply to a wild beast or an ooze -- only types
// explicitly toggled on here get the field at all.
function WealthApplicabilityEditor({ monsterTypes, usesWealth, onChange }) {
  function toggle(type) {
    onChange({ ...usesWealth, [type]: !usesWealth[type] })
  }
  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1">
        Wealth Applies To <span className="text-ink-soft/50 normal-case">(only these types show a Wealth field at all)</span>
      </span>
      <div className="flex flex-wrap gap-1.5">
        {monsterTypes.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => toggle(t)}
            className={`text-xs rounded-sm px-2 py-1 border ${usesWealth[t] ? 'bg-moss-dark text-parchment border-moss-dark' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

// Same excluded/guaranteed item-name mechanism as attribute options,
// applied to the shared Setting field -- otherwise Setting is purely
// cosmetic (shows in the label, never actually touches what gets drawn).
function SettingRulesEditor({ settings, rules, onChange }) {
  const [selected, setSelected] = useState(settings[0] || '')
  const current = rules[selected] || { excludedItemPatterns: [], guaranteedItems: [] }

  function updateExcluded(patterns) {
    onChange({ ...rules, [selected]: { ...current, excludedItemPatterns: patterns } })
  }
  function updateGuaranteed(patterns) {
    onChange({ ...rules, [selected]: { ...current, guaranteedItems: patterns } })
  }

  if (settings.length === 0) return <p className="text-xs text-ink-soft/50 italic">Add a setting above first.</p>

  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1">
        Setting Rules <span className="text-ink-soft/50 normal-case">(makes Setting actually affect the draw, not just the label)</span>
      </span>
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm mb-2">
        {settings.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="text-xs font-display uppercase text-ink-soft block mb-1">Never carries here</span>
          <EditableList items={current.excludedItemPatterns || []} onChange={updateExcluded} placeholder="e.g. Heavy Armor" />
        </div>
        <div>
          <span className="text-xs font-display uppercase text-ink-soft block mb-1">Always carries here</span>
          <EditableList items={current.guaranteedItems || []} onChange={updateGuaranteed} placeholder="e.g. Waterskin" />
        </div>
      </div>
    </div>
  )
}

function TaxonomyManager({ taxonomy, onSave, sources }) {
  const allCategories = useMemo(() => categoriesForPools(['wares', 'menu', 'services'], sources, true), [sources])
  const locationTypeIds = LOCATION_TYPES.map((t) => t.id)
  const locationTypeLabels = Object.fromEntries(LOCATION_TYPES.map((t) => [t.id, t.label]))

  function renameMonsterType(oldName, newName) {
    if (taxonomy.monsterTypeCategories?.[oldName]) {
      const next = { ...taxonomy.monsterTypeCategories }
      next[newName] = next[oldName]
      delete next[oldName]
      onSave({ monsterTypeCategories: next })
    }
    if (taxonomy.monsterTypeAttributes?.[oldName]) {
      const next = { ...taxonomy.monsterTypeAttributes }
      next[newName] = next[oldName]
      delete next[oldName]
      onSave({ monsterTypeAttributes: next })
    }
    if (taxonomy.monsterTypeGuaranteedItems?.[oldName]) {
      const next = { ...taxonomy.monsterTypeGuaranteedItems }
      next[newName] = next[oldName]
      delete next[oldName]
      onSave({ monsterTypeGuaranteedItems: next })
    }
  }

  return (
    <div className="border border-leather/50 rounded-sm bg-parchment/60 p-4 space-y-5">
      <p className="text-xs text-ink-soft/60 italic">
        These lists are the Loot tab's own — kept completely separate from any NPC species, job,
        or class list elsewhere on the site. Click any entry to rename it; changes save
        immediately. The monster catalog is seeded from the official SRD 5.2.1 (CC-BY-4.0) —
        add original entries the same way.
      </p>
      <EditableWealthList items={taxonomy.wealthLevels} onChange={(v) => onSave({ wealthLevels: v })} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EditableList label="Monster Types" items={taxonomy.monsterTypes} onChange={(v) => onSave({ monsterTypes: v })} onRename={renameMonsterType} placeholder="e.g. Custom Type" />
        <EditableList label="Settings" items={taxonomy.settings} onChange={(v) => onSave({ settings: v })} placeholder="e.g. Volcanic" />
        <EditableList
          label="Shop Types (covers general shops, restaurants, and taverns)"
          items={taxonomy.shopTypes}
          onChange={(v) => onSave({ shopTypes: v })}
          placeholder="e.g. Alchemist, or Dive Bar"
        />
        <EditableList label="Exploration Types" items={taxonomy.explorationTypes} onChange={(v) => onSave({ explorationTypes: v })} placeholder="e.g. Sunken Temple" />
      </div>

      <WealthApplicabilityEditor
        monsterTypes={taxonomy.monsterTypes}
        usesWealth={taxonomy.monsterTypeUsesWealth || {}}
        onChange={(v) => onSave({ monsterTypeUsesWealth: v })}
      />

      <SettingRulesEditor settings={taxonomy.settings} rules={taxonomy.settingRules || {}} onChange={(v) => onSave({ settingRules: v })} />

      <MonsterTypeCategoryMapper monsterTypes={taxonomy.monsterTypes} mapping={taxonomy.monsterTypeCategories || {}} allCategories={allCategories} onChange={(v) => onSave({ monsterTypeCategories: v })} />

      <TypeGuaranteedItemsManager
        label="Monster Type → Always Carries (baseline, e.g. Humanoid → Boots)"
        types={taxonomy.monsterTypes}
        itemsByType={taxonomy.monsterTypeGuaranteedItems || {}}
        onChange={(v) => onSave({ monsterTypeGuaranteedItems: v })}
      />

      <TypeGuaranteedItemsManager
        label="Monster Type → Optional Features (checkboxes per entity, e.g. Beast → Tusks, Horns, Wings -- items can require one, unchecked = excluded)"
        types={taxonomy.monsterTypes}
        itemsByType={taxonomy.monsterTypeFeatures || {}}
        onChange={(v) => onSave({ monsterTypeFeatures: v })}
      />

      <TypeAttributeManager
        label="Monster Type Fields (what changes per monster type -- e.g. Beast gets Diet/Size instead of a generic Class)"
        types={taxonomy.monsterTypes}
        attributesByType={taxonomy.monsterTypeAttributes || {}}
        onChange={(v) => onSave({ monsterTypeAttributes: v })}
      />

      <TypeGuaranteedItemsManager
        label="Location Type → Always Carries"
        types={locationTypeIds}
        typeLabels={locationTypeLabels}
        itemsByType={taxonomy.locationTypeGuaranteedItems || {}}
        onChange={(v) => onSave({ locationTypeGuaranteedItems: v })}
      />

      <TypeAttributeManager
        label="Location Type Fields (extra options per Shop/Exploration)"
        types={locationTypeIds}
        typeLabels={locationTypeLabels}
        attributesByType={taxonomy.locationTypeAttributes || {}}
        onChange={(v) => onSave({ locationTypeAttributes: v })}
      />
    </div>
  )
}

function PoolAndCategoryPicker({ pools, onPoolsChange, categories, onCategoriesChange, availableCategories, includeVehicles, onIncludeVehiclesChange }) {
  return (
    <div className="space-y-2">
      <div>
        <span className="text-xs font-display uppercase text-ink-soft block mb-1">Draw From</span>
        <div className="flex gap-3 flex-wrap items-center">
          {POOL_OPTIONS.map((p) => (
            <label key={p.id} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={pools.includes(p.id)} onChange={() => onPoolsChange(pools.includes(p.id) ? pools.filter((x) => x !== p.id) : [...pools, p.id])} />
              {p.label}
            </label>
          ))}
          <label className="flex items-center gap-1.5 text-sm ml-2 pl-2 border-l border-leather/30">
            <input type="checkbox" checked={includeVehicles} onChange={(e) => onIncludeVehiclesChange(e.target.checked)} />
            Include vehicles &amp; mounts
          </label>
        </div>
      </div>
      {availableCategories.length > 0 && (
        <div>
          <span className="text-xs font-display uppercase text-ink-soft block mb-1">Categories <span className="text-ink-soft/50 normal-case">(none = all)</span></span>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoriesChange(categories.includes(cat) ? categories.filter((c) => c !== cat) : [...categories, cat])}
                className={`text-xs rounded-sm px-2 py-1 border ${categories.includes(cat) ? 'bg-leather text-parchment border-leather' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// An attribute can carry an optional `showIf: {attr, values}` -- it only
// renders once `values[attr]` is one of `values`. This is what lets
// Dragon show Age Category only for Metallic/Chromatic and Habitat only
// for Drake/Draconid, without needing four separate near-duplicate
// monster types.
function isAttributeVisible(attr, values) {
  if (!attr.showIf) return true
  return attr.showIf.values.includes(values[attr.showIf.attr])
}

// An attribute can carry optionsFor: {[controllingValue]: [options]} instead
// of a flat options array -- the actual list shown depends on whatever the
// controlling field (attr.showIf.attr) currently is. Falls back to
// attr.options if optionsFor isn't set or has no entry for the current value.
function resolveAttributeOptions(attr, values) {
  if (!attr.optionsFor) return attr.options
  const controllingValue = attr.showIf ? values[attr.showIf.attr] : null
  return attr.optionsFor[controllingValue] || attr.options || []
}

function DynamicAttributeFields({ attributes, values, onChange }) {
  const visible = (attributes || []).filter((attr) => isAttributeVisible(attr, values))
  if (visible.length === 0) return null
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {visible.map((attr) => (
        <label key={attr.id} className="block">
          <span className="text-xs font-display uppercase text-ink-soft">{attr.name}</span>
          <select value={values[attr.id] || ''} onChange={(e) => onChange(attr.id, e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm">
            <option value="">—</option>
            {resolveAttributeOptions(attr, values).map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
      ))}
    </div>
  )
}

function ResultsPanel({ groups, onCopy, copied }) {
  const grandTotal = groups.reduce((sum, g) => sum + g.items.reduce((s, i) => s + (i.priceGp || 0), 0) + (g.gold || 0), 0)
  return (
    <div className="border border-gold rounded-sm bg-parchment paper-texture p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-leather-dark">Results</h3>
        <button type="button" onClick={onCopy} className="text-xs text-moss-dark underline">{copied ? 'Copied!' : 'Copy as text'}</button>
      </div>
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.label && (
            <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark/80 border-b border-leather/30 pb-1 mb-1.5">
              {g.label}
              {g.aiAssisted && <span className="ml-2 text-xs normal-case italic text-moss-dark">(AI-assisted)</span>}
            </h4>
          )}
          {g.gold != null && <p className="text-sm font-display text-leather-dark mb-1">{g.gold} gp in coin</p>}
          {g.isHorde && g.hordeTotal != null && <p className="text-sm font-display text-leather-dark mb-1">Horde Total: {g.hordeTotal} gp</p>}
          {g.items.length === 0 ? (
            <p className="text-xs text-ink-soft italic">Nothing — widen the filters.</p>
          ) : (
            <ul className="space-y-1">
              {g.items.map((item, i) => (
                <li key={`${item.id}-${i}`} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <span className="font-display text-leather-dark">{item.name}</span>
                    {item.guaranteed && <span className="ml-1.5 text-xs text-moss-dark italic">(always carries)</span>}
                    {item.flavor && <span className="ml-1.5 text-xs text-ink-soft/60 italic">(setting flavor)</span>}
                    <span className="ml-2 text-xs text-ink-soft/60 italic">{item.category}</span>
                    {item.description && <p className="text-xs text-ink-soft/70 italic">{item.description}</p>}
                  </div>
                  <span className="text-xs text-ink-soft shrink-0">{item.priceGp == null ? '—' : formatPrice(item.priceGp)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <p className="text-sm font-display text-leather-dark text-right pt-1 border-t border-leather/30">Grand Total: {formatPrice(grandTotal)}</p>
    </div>
  )
}

// --- Encounter flow -------------------------------------------------------

function EntityBuilder({ taxonomy, sources, onAdd }) {
  const [monsterType, setMonsterType] = useState('')
  const [monsterName, setMonsterName] = useState('')
  const [attributeValues, setAttributeValues] = useState({})
  const [wealthId, setWealthId] = useState('')
  const [setting, setSetting] = useState('')
  const [notes, setNotes] = useState('')
  const [pools, setPools] = useState(DEFAULT_POOLS.encounter)
  const [categories, setCategories] = useState([])
  const [includeVehicles, setIncludeVehicles] = useState(false)
  const [features, setFeatures] = useState({})
  const [hasHorde, setHasHorde] = useState(false)
  const [hordeSize, setHordeSize] = useState('')

  const usesWealth = taxonomy.monsterTypeUsesWealth?.[monsterType] === true
  const isKindBucketed = !!taxonomy.sizeLootTable?.[monsterType]
  const availableFeatures = taxonomy.monsterTypeFeatures?.[monsterType] || []

  const typeAttributes = useMemo(() => taxonomy.monsterTypeAttributes?.[monsterType] || [], [taxonomy.monsterTypeAttributes, monsterType])
  const settingRule = taxonomy.settingRules?.[setting]

  const excludedPatterns = useMemo(() => {
    const fromAttrs = patternsFor(typeAttributes, attributeValues, 'excludedItemPatterns')
    const fromSetting = settingRule?.excludedItemPatterns || []
    return [...new Set([...fromAttrs, ...fromSetting])]
  }, [typeAttributes, attributeValues, settingRule])

  const guaranteedPatterns = useMemo(() => {
    const typeLevel = taxonomy.monsterTypeGuaranteedItems?.[monsterType] || []
    const optionLevel = patternsFor(typeAttributes, attributeValues, 'guaranteedItems')
    const fromSetting = settingRule?.guaranteedItems || []
    return [...new Set([...typeLevel, ...optionLevel, ...fromSetting])]
  }, [taxonomy.monsterTypeGuaranteedItems, monsterType, typeAttributes, attributeValues, settingRule])

  const availableCategories = useMemo(() => {
    let base = pools.flatMap((p) => buildItemPool(p, sources))
    if (!includeVehicles) base = base.filter((i) => !VEHICLE_CATEGORIES.includes(i.category))
    const restriction = taxonomy.monsterTypeCategories?.[monsterType]
    const scoped = scopeToMonsterType(base, monsterType, restriction)
    return [...new Set(scoped.map((i) => i.category))].sort((a, b) => a.localeCompare(b))
  }, [pools, sources, includeVehicles, taxonomy.monsterTypeCategories, monsterType])

  function handleMonsterTypeChange(value) {
    setMonsterType(value)
    // Fey defaults to 'Person' (unchecked "Is a Monster") so Role is
    // visible right away -- attributeValues['fey-is-monster'] needs SOME
    // value from the start, or showIf's exact 'Person' match never fires
    // until the DM happens to click the checkbox at least once.
    setAttributeValues(value === 'Fey' ? { 'fey-is-monster': 'Person' } : {})
    setFeatures({})
    setHasHorde(false)
    setHordeSize('')
    const restriction = taxonomy.monsterTypeCategories?.[value]
    if (restriction !== undefined) {
      setCategories((prev) => prev.filter((c) => restriction.includes(c)))
    }
    // Wealth only shows for types where it's toggled on -- reset it
    // cleanly on type change rather than carrying over a stale pick from
    // a wealth-using type onto one that doesn't use it at all.
    const newUsesWealth = taxonomy.monsterTypeUsesWealth?.[value] === true
    setWealthId(newUsesWealth ? taxonomy.wealthLevels[0]?.id || '' : '')
  }

  function handleMonsterNameChange(value) {
    setMonsterName(value)
    // Auto-fill Monster Type when the typed value exactly matches a
    // catalog entry -- lets a specific pick like "Bandit" drive the
    // right type-specific fields automatically.
    const match = (taxonomy.monsterCatalog || []).find((m) => m.name.toLowerCase() === value.toLowerCase())
    let effectiveType = monsterType
    if (match && taxonomy.monsterTypes.includes(match.type) && match.type !== monsterType) {
      handleMonsterTypeChange(match.type)
      effectiveType = match.type
    }
    // Role hint: if the search text contains a known keyword (e.g.
    // "bandit"), auto-suggest the matching Role on whichever attribute
    // actually offers that option, without clobbering a Role the DM
    // already picked. This is what makes "Specific Monster" actually
    // steer loot rather than just relabeling a generic Humanoid.
    const lower = value.toLowerCase()
    const hint = Object.entries(taxonomy.monsterNameRoleHints || {}).find(([kw]) => lower.includes(kw))
    if (hint) {
      const [, roleValue] = hint
      const attrsForType = taxonomy.monsterTypeAttributes?.[effectiveType] || []
      const roleAttr = attrsForType.find((a) => a.options.includes(roleValue))
      if (roleAttr) {
        setAttributeValues((prev) => (prev[roleAttr.id] ? prev : { ...prev, [roleAttr.id]: roleValue }))
      }
    }
  }

  function handleAdd() {
    onAdd({
      id: `entity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      monsterType,
      monsterName,
      attributeValues,
      wealthId,
      setting,
      notes,
      pools,
      categories,
      includeVehicles,
      excludedPatterns,
      guaranteedPatterns,
      features,
      hasHorde: monsterType === 'Dragon' ? hasHorde : false,
      hordeSize: monsterType === 'Dragon' && hasHorde ? hordeSize : '',
    })
    setNotes('')
  }

  return (
    <div className="border border-leather/40 rounded-sm bg-white/40 p-3 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <label className="block">
          <span className="text-xs font-display uppercase text-ink-soft">Monster Type</span>
          <select value={monsterType} onChange={(e) => handleMonsterTypeChange(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm">
            <option value="">—</option>
            {taxonomy.monsterTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-display uppercase text-ink-soft">Specific Monster (SRD 5.2.1, optional)</span>
          <input
            list="loot-monster-catalog"
            value={monsterName}
            onChange={(e) => handleMonsterNameChange(e.target.value)}
            placeholder="Search or type, e.g. Bandit"
            className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
          />
          <datalist id="loot-monster-catalog">
            {(taxonomy.monsterCatalog || []).map((m) => <option key={m.name} value={m.name}>{m.type} · CR varies</option>)}
          </datalist>
        </label>
        {usesWealth ? (
          <label className="block">
            <span className="text-xs font-display uppercase text-ink-soft">Wealth</span>
            <select value={wealthId} onChange={(e) => setWealthId(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm">
              {taxonomy.wealthLevels.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
            </select>
          </label>
        ) : (
          monsterType && (
            <div className="flex items-end pb-1.5">
              <p className="text-xs text-ink-soft/50 italic">
                {Object.values(taxonomy.sizeLootTable?.[monsterType] || {}).some((tier) => tier.goldRange)
                  ? `${monsterType} doesn't use Wealth — coin comes from its own field above instead.`
                  : `${monsterType} doesn't use Wealth — no coin, only whatever's guaranteed below.`}
              </p>
            </div>
          )
        )}
      </div>

      {monsterType === 'Fey' && (
        <label className="flex items-center gap-1.5 text-sm font-display uppercase text-ink-soft">
          <input
            type="checkbox"
            checked={attributeValues['fey-is-monster'] === 'Monster'}
            onChange={(e) =>
              setAttributeValues((prev) => ({ ...prev, 'fey-is-monster': e.target.checked ? 'Monster' : 'Person', 'fey-role': '' }))
            }
          />
          Is a Monster <span className="text-ink-soft/50 normal-case ml-1">(unchecked = a person, e.g. an eladrin -- uses Role below instead)</span>
        </label>
      )}

      <DynamicAttributeFields attributes={typeAttributes} values={attributeValues} onChange={(attrId, val) => setAttributeValues((prev) => ({ ...prev, [attrId]: val }))} />

      {availableFeatures.length > 0 && (
        <div>
          <span className="text-xs font-display uppercase text-ink-soft block mb-1">
            Optional Features <span className="text-ink-soft/50 normal-case">(unchecked = excluded entirely, e.g. no tusks means no tusk loot)</span>
          </span>
          <div className="flex flex-wrap gap-3">
            {availableFeatures.map((f) => (
              <label key={f} className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={!!features[f]}
                  onChange={(e) => setFeatures((prev) => ({ ...prev, [f]: e.target.checked }))}
                />
                {f}
              </label>
            ))}
          </div>
        </div>
      )}

      {monsterType === 'Dragon' && (
        <div className="border border-leather/30 rounded-sm p-2 bg-white/30">
          <label className="flex items-center gap-1.5 text-sm font-display uppercase text-ink-soft">
            <input type="checkbox" checked={hasHorde} onChange={(e) => { setHasHorde(e.target.checked); if (!e.target.checked) setHordeSize('') }} />
            Has Horde
          </label>
          {hasHorde && (
            <label className="block mt-2">
              <span className="text-xs font-display uppercase text-ink-soft">Horde Size</span>
              <select value={hordeSize} onChange={(e) => setHordeSize(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm">
                <option value="">—</option>
                {Object.keys(taxonomy.hordeGpRanges || {}).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="text-xs text-ink-soft/50 italic block mt-1">
                Determines a target gp value for the hoard (Lineage and Setting shape its actual contents when you generate).
              </span>
            </label>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className="block">
          <span className="text-xs font-display uppercase text-ink-soft">Setting</span>
          <select value={setting} onChange={(e) => setSetting(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm">
            <option value="">—</option>
            {taxonomy.settings.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-display uppercase text-ink-soft">Notes (optional)</span>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. pack leader, wounded" className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm" />
        </label>
      </div>

      {(excludedPatterns.length > 0 || guaranteedPatterns.length > 0) && (
        <div className="text-xs text-ink-soft/60 italic space-y-0.5">
          {excludedPatterns.length > 0 && <p>Never carries: {excludedPatterns.join(', ')}</p>}
          {guaranteedPatterns.length > 0 && <p>Always carries: {guaranteedPatterns.join(', ')}</p>}
        </div>
      )}

      {isKindBucketed ? (
        <p className="text-xs text-ink-soft/50 italic">
          {monsterType} loot is generated from Size + Origin/Xenotype-tagged items directly —
          no pool or category picker needed here.
        </p>
      ) : (
        <PoolAndCategoryPicker
          pools={pools}
          onPoolsChange={setPools}
          categories={categories}
          onCategoriesChange={setCategories}
          availableCategories={availableCategories}
          includeVehicles={includeVehicles}
          onIncludeVehiclesChange={setIncludeVehicles}
        />
      )}

      <button type="button" onClick={handleAdd} className="w-full py-2 text-sm font-display uppercase tracking-wide bg-moss-dark text-parchment rounded-sm hover:opacity-90">+ Add Entity</button>
    </div>
  )
}

// --- Main tab ---------------------------------------------------------

export default function LootTab() {
  const { sources, lootTaxonomy, saveLootTaxonomy } = useData()
  const [showTaxonomy, setShowTaxonomy] = useState(false)

  const [generationType, setGenerationType] = useState(null)

  const [entities, setEntities] = useState([])

  const [locationType, setLocationType] = useState(null)
  const [subtype, setSubtype] = useState('')
  const [locAttributeValues, setLocAttributeValues] = useState({})
  const [locWealthId, setLocWealthId] = useState(lootTaxonomy.wealthLevels[0]?.id || '')
  const [locPools, setLocPools] = useState(DEFAULT_POOLS.shop)
  const [locCategories, setLocCategories] = useState([])
  const [locAllowDuplicates, setLocAllowDuplicates] = useState(false)
  const [locIncludeVehicles, setLocIncludeVehicles] = useState(false)

  const [results, setResults] = useState(null)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [aiNotice, setAiNotice] = useState('')

  const currentLocationType = LOCATION_TYPES.find((t) => t.id === locationType)
  const locTypeAttributes = useMemo(() => lootTaxonomy.locationTypeAttributes?.[locationType] || [], [lootTaxonomy.locationTypeAttributes, locationType])
  const locExcludedPatterns = useMemo(() => patternsFor(locTypeAttributes, locAttributeValues, 'excludedItemPatterns'), [locTypeAttributes, locAttributeValues])
  const locGuaranteedPatterns = useMemo(() => {
    const typeLevel = lootTaxonomy.locationTypeGuaranteedItems?.[locationType] || []
    const optionLevel = patternsFor(locTypeAttributes, locAttributeValues, 'guaranteedItems')
    return [...new Set([...typeLevel, ...optionLevel])]
  }, [lootTaxonomy.locationTypeGuaranteedItems, locationType, locTypeAttributes, locAttributeValues])

  const locAvailableCategories = useMemo(() => categoriesForPools(locPools, sources, locIncludeVehicles), [locPools, sources, locIncludeVehicles])

  function pickLocationType(type) {
    setLocationType(type)
    setSubtype('')
    setLocAttributeValues({})
    setLocPools(DEFAULT_POOLS[type] || ['wares'])
    setResults(null)
  }

  function removeEntity(id) {
    setEntities(entities.filter((e) => e.id !== id))
  }

  function wealthLevel(wealthId) {
    return lootTaxonomy.wealthLevels.find((x) => x.id === wealthId)
  }

  async function generateEncounter() {
    setGenerating(true)
    setAiNotice('')
    const groupLists = await Promise.all(
      entities.map(async (e) => {
        // Fey is the one type where sizeLootTable having an entry does NOT
        // mean "use the kind-bucketed engine" -- Is Monster (checked ->
        // 'Monster') is what actually decides. Unchecked/'Person' routes
        // to the Loadout System instead, further down, and must never
        // fall into the ordinary kind-bucketed or AI-assist branches
        // below (both keyed off isKindBucketed), hence overriding it here.
        const isFeyPerson = e.monsterType === 'Fey' && e.attributeValues?.['fey-is-monster'] !== 'Monster'
        const isKindBucketed = !!lootTaxonomy.sizeLootTable?.[e.monsterType] && !isFeyPerson
        const guaranteed = resolveGuaranteedItems(e.guaranteedPatterns, e.pools, sources, e.includeVehicles)
        const attrTags = Object.values(e.attributeValues || {}).filter(Boolean)
        const tags = [e.monsterName || e.monsterType, ...attrTags, e.setting, e.notes].filter(Boolean)
        const label = tags.join(' · ') || 'Entity'
        let mainGroup

        // Specific Monster or Notes present -> route through the
        // constrained AI-assist path, which is handed the EXACT same
        // eligible pool and count limits the deterministic engine would
        // use, and is told to select from it (inventing at most 1-2
        // items only when genuinely justified). Falls back to the
        // normal deterministic path on any failure, so a missing API
        // key or a network hiccup never blocks generation entirely.
        const wantsAi = isKindBucketed && ((e.monsterName && e.monsterName.trim()) || (e.notes && e.notes.trim()))
        if (wantsAi) {
          const poolInfo = computeEligiblePoolForAi({
            monsterType: e.monsterType, taxonomy: lootTaxonomy, sources,
            attributeValues: e.attributeValues, excludedPatterns: e.excludedPatterns, features: e.features,
          })
          if (poolInfo) {
            const catalogMatch = (lootTaxonomy.monsterCatalog || []).find(
              (m) => m.name.toLowerCase() === (e.monsterName || '').toLowerCase()
            )
            const srdContext = catalogMatch ? ` (SRD data: ${catalogMatch.size} ${catalogMatch.type}${catalogMatch.subtype ? ` (${catalogMatch.subtype})` : ''}, ${catalogMatch.alignment})` : ''
            try {
              const aiItems = await generateAiAssistedLoot({
                monsterType: e.monsterType,
                monsterName: e.monsterName ? `${e.monsterName}${srdContext}` : e.monsterName,
                notes: e.notes,
                tierLabel: e.attributeValues[resolveKindBucketConfig(e.monsterType, e.attributeValues).sizeAttr] || '(not set -- AI will infer)',
                countsByKind: poolInfo.countsByKind,
                eligibleItems: poolInfo.eligibleItems,
                attributeSummary: poolInfo.attributeSummary,
                needsInference: poolInfo.needsInference,
                tierOptions: poolInfo.tierOptions,
                balanced: poolInfo.balanced,
              })
              mainGroup = { label, items: [...guaranteed, ...aiItems], gold: 0, aiAssisted: true }
            } catch (err) {
              if (err.message !== LOOT_AI_UNCONFIGURED) console.error('AI loot assist failed, falling back:', err)
              setAiNotice((prev) =>
                prev ||
                (err.message === LOOT_AI_UNCONFIGURED
                  ? 'AI assist isn\u2019t configured (no API key set) \u2014 used the normal random rules instead.'
                  : 'AI assist failed \u2014 used the normal random rules instead.')
              )
            }
          }
        }

        if (!mainGroup && isKindBucketed) {
          const { items: rolled, flavorItems, gold } = generateKindBucketedLoot({
            monsterType: e.monsterType,
            taxonomy: lootTaxonomy,
            sources,
            attributeValues: e.attributeValues,
            excludedPatterns: e.excludedPatterns,
            features: e.features,
            setting: e.setting,
          })
          const flavorTagged = flavorItems.map((i) => ({ ...i, flavor: true }))
          mainGroup = { label, items: [...guaranteed, ...rolled, ...flavorTagged], gold }
        }

        // Fey Person path -- the Loadout System. Role and Rank both come
        // straight out of attributeValues like any other attribute.
        if (!mainGroup && isFeyPerson) {
          const role = e.attributeValues?.['fey-role']
          const rank = e.attributeValues?.['fey-rank']
          if (role && rank) {
            const { items: rolled, gold } = generateLoadoutLoot({
              monsterType: e.monsterType, role, rank,
              taxonomy: lootTaxonomy, sources, excludedPatterns: e.excludedPatterns,
            })
            mainGroup = { label, items: [...guaranteed, ...rolled], gold }
          }
        }

        if (!mainGroup) {
          const w = wealthLevel(e.wealthId)
          const usesWealth = lootTaxonomy.monsterTypeUsesWealth?.[e.monsterType] === true
          const fixedCount =
            lootTaxonomy.monsterTypeFixedItemCount?.[e.monsterType] ||
            lootTaxonomy.monsterTypeFixedItemCount?.default || { minItems: 1, maxItems: 1 }
          const count = usesWealth
            ? w ? randomInt(w.minItems ?? 1, w.maxItems ?? 1) : 0
            : randomInt(fixedCount.minItems, fixedCount.maxItems)
          const gold = usesWealth && w ? randomInt(w.goldMin ?? 0, w.goldMax ?? 0) : 0
          const typeRestriction = lootTaxonomy.monsterTypeCategories?.[e.monsterType]
          const rolled = drawLoot({
            pools: e.pools,
            sources,
            categories: e.categories,
            priceMin: usesWealth ? w?.min ?? null : null,
            priceMax: usesWealth ? w?.max ?? null : null,
            count,
            allowDuplicates: false,
            includeVehicles: e.includeVehicles,
            excludedPatterns: e.excludedPatterns,
            monsterType: e.monsterType,
            typeCategoryRestriction: typeRestriction,
          })
          const wealthLabel = usesWealth ? w?.label : null
          const fullTags = [e.monsterName || e.monsterType, ...attrTags, wealthLabel, e.setting, e.notes].filter(Boolean)
          mainGroup = { label: fullTags.join(' · ') || 'Entity', items: [...guaranteed, ...rolled], gold }
        }

        const groupsForEntity = [mainGroup]

        // Dragon horde: a SEPARATE result group, not folded into the
        // creature's own loot. Rolls a target gp from hordeGpRanges,
        // then hands it to the (deliberately looser) horde-fill AI
        // along with Lineage/Setting/Notes for flavor and the eligible
        // item pool as thematic anchors. Falls back to a bare "Coins"
        // line at the rolled target if AI is unavailable, so a horde
        // group always has SOME content even without a configured key.
        if (e.monsterType === 'Dragon' && e.hasHorde && e.hordeSize) {
          const gpRange = lootTaxonomy.hordeGpRanges?.[e.hordeSize]
          if (gpRange) {
            const targetGp = randomInt(gpRange[0], gpRange[1])
            const poolInfo = computeEligiblePoolForAi({
              monsterType: 'Dragon', taxonomy: lootTaxonomy, sources,
              attributeValues: e.attributeValues, excludedPatterns: e.excludedPatterns, features: e.features,
            })
            const lineage = e.attributeValues['dragon-lineage']
            // No loot item should appear twice for the same dragon --
            // its own anatomical parts shouldn't also turn up in its
            // horde. Exclude anything already selected for mainGroup
            // from both the pool offered to the AI and (as a hard
            // backstop) the AI's own output, in case it ignores the
            // instruction.
            const usedNames = new Set(mainGroup.items.map((i) => i.name))
            const hordePool = (poolInfo?.eligibleItems || []).filter((i) => !usedNames.has(i.name))
            try {
              const { items: rawHordeItems } = await generateAiHordeContents({
                lineage, setting: e.setting, notes: e.notes, targetGp,
                eligibleItems: hordePool, excludeNames: [...usedNames],
              })
              const hordeItems = rawHordeItems.filter((i) => !usedNames.has(i.name))
              const totalGp = hordeItems.reduce((sum, i) => sum + (i.priceGp || 0), 0)
              groupsForEntity.push({
                label: `${label} \u2014 Horde (${e.hordeSize}, target ~${targetGp}gp)`,
                items: hordeItems, gold: null, aiAssisted: true, isHorde: true, hordeTotal: totalGp,
              })
            } catch (err) {
              if (err.message !== LOOT_AI_UNCONFIGURED) console.error('AI horde fill failed, falling back:', err)
              setAiNotice((prev) =>
                (prev ? prev + ' ' : '') +
                (err.message === LOOT_AI_UNCONFIGURED
                  ? 'AI assist isn\u2019t configured for horde generation \u2014 showing raw coin value only.'
                  : 'AI horde fill failed \u2014 showing raw coin value only.')
              )
              groupsForEntity.push({
                label: `${label} \u2014 Horde (${e.hordeSize}, ~${targetGp}gp)`,
                items: [], gold: targetGp, isHorde: true,
              })
            }
          }
        }

        return groupsForEntity
      })
    )
    setResults(groupLists.flat())
    setCopied(false)
    setGenerating(false)
  }

  function generateLocation() {
    const w = wealthLevel(locWealthId)
    const count = w ? randomInt(w.minItems ?? 1, w.maxItems ?? 1) : 0
    const gold = w ? randomInt(w.goldMin ?? 0, w.goldMax ?? 0) : 0
    const guaranteed = resolveGuaranteedItems(locGuaranteedPatterns, locPools, sources, locIncludeVehicles)
    const rolled = drawLoot({
      pools: locPools,
      sources,
      categories: locCategories,
      priceMin: w?.min ?? null,
      priceMax: w?.max ?? null,
      count,
      allowDuplicates: locAllowDuplicates,
      includeVehicles: locIncludeVehicles,
      excludedPatterns: locExcludedPatterns,
    })
    setResults([{ label: '', items: [...guaranteed, ...rolled], gold }])
    setCopied(false)
  }

  function copyToClipboard() {
    if (!results) return
    const lines = []
    results.forEach((g) => {
      if (g.label) lines.push(`— ${g.label} —`)
      if (g.gold != null) lines.push(`${g.gold} gp`)
      if (g.isHorde && g.hordeTotal != null) lines.push(`Horde Total: ${g.hordeTotal} gp`)
      g.items.forEach((i) => lines.push(`${i.name}${i.guaranteed ? ' (always carries)' : ''} (${i.priceGp == null ? '—' : formatPrice(i.priceGp)})`))
    })
    navigator.clipboard?.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl text-leather-dark">Loot Generator</h2>
          <p className="text-xs text-ink-soft/60 italic mt-1">
            DM-only. Pulls from the same SRD catalog and uploaded sources used across the site.
            Vehicles &amp; mounts are excluded unless you say otherwise.
          </p>
        </div>
        <button type="button" onClick={() => setShowTaxonomy((s) => !s)} className="text-xs text-moss-dark underline shrink-0 whitespace-nowrap">{showTaxonomy ? 'Hide categories' : 'Edit categories'}</button>
      </div>

      {showTaxonomy && <TaxonomyManager taxonomy={lootTaxonomy} onSave={saveLootTaxonomy} sources={sources} />}

      <div className="border border-leather/50 rounded-sm bg-parchment paper-texture p-4 space-y-4">
        <div>
          <span className="text-sm font-display uppercase text-ink-soft block mb-1.5">What are you generating loot for?</span>
          <div className="flex gap-3">
            {['location', 'encounter'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setGenerationType(t); setResults(null) }}
                className={`flex-1 py-2.5 text-sm font-display uppercase tracking-wide rounded-sm border ${generationType === t ? 'bg-leather text-parchment border-leather' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}
              >
                {t === 'location' ? 'Location' : 'Encounter'}
              </button>
            ))}
          </div>
        </div>

        {generationType === 'encounter' && (
          <div className="space-y-4">
            <EntityBuilder taxonomy={lootTaxonomy} sources={sources} onAdd={(e) => setEntities([...entities, e])} />

            {entities.length > 0 && (
              <div>
                <span className="text-xs font-display uppercase text-ink-soft block mb-1.5">Entities ({entities.length})</span>
                <ul className="space-y-1">
                  {entities.map((e) => {
                    const wealthLabel = lootTaxonomy.wealthLevels.find((w) => w.id === e.wealthId)?.label
                    const attrTags = Object.values(e.attributeValues || {}).filter(Boolean)
                    const tags = [e.monsterName || e.monsterType, ...attrTags, wealthLabel, e.setting, e.notes].filter(Boolean)
                    return (
                      <li key={e.id} className="flex items-center justify-between gap-2 bg-white/50 border border-leather/30 rounded-sm px-2 py-1.5 text-sm">
                        <span>{tags.join(' · ') || 'Unnamed entity'}</span>
                        <button type="button" onClick={() => removeEntity(e.id)} aria-label="Remove entity" className="text-wax-dark hover:text-wax font-bold leading-none px-1">×</button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            <button type="button" onClick={generateEncounter} disabled={entities.length === 0 || generating} className="w-full py-2.5 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40">
              {generating ? 'Generating\u2026' : results ? 'Reroll' : 'Generate Loot'}
            </button>
            {aiNotice && <p className="text-xs text-ink-soft/60 italic">{aiNotice}</p>}
          </div>
        )}

        {generationType === 'location' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-display uppercase text-ink-soft block mb-1.5">What kind of location?</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LOCATION_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => pickLocationType(t.id)}
                    className={`py-2 text-xs font-display uppercase tracking-wide rounded-sm border ${locationType === t.id ? 'bg-leather text-parchment border-leather' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {currentLocationType && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-display uppercase text-ink-soft">{currentLocationType.label} Type</span>
                    <select value={subtype} onChange={(e) => setSubtype(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-2 py-1.5 text-sm">
                      <option value="">—</option>
                      {(lootTaxonomy[currentLocationType.taxonomyKey] || []).map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-display uppercase text-ink-soft">Wealth</span>
                    <select value={locWealthId} onChange={(e) => setLocWealthId(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-2 py-1.5 text-sm">
                      {lootTaxonomy.wealthLevels.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
                    </select>
                  </label>
                </div>

                <DynamicAttributeFields attributes={locTypeAttributes} values={locAttributeValues} onChange={(attrId, val) => setLocAttributeValues((prev) => ({ ...prev, [attrId]: val }))} />

                {(locExcludedPatterns.length > 0 || locGuaranteedPatterns.length > 0) && (
                  <div className="text-xs text-ink-soft/60 italic space-y-0.5">
                    {locExcludedPatterns.length > 0 && <p>Never carries: {locExcludedPatterns.join(', ')}</p>}
                    {locGuaranteedPatterns.length > 0 && <p>Always carries: {locGuaranteedPatterns.join(', ')}</p>}
                  </div>
                )}

                <PoolAndCategoryPicker
                  pools={locPools}
                  onPoolsChange={setLocPools}
                  categories={locCategories}
                  onCategoriesChange={setLocCategories}
                  availableCategories={locAvailableCategories}
                  includeVehicles={locIncludeVehicles}
                  onIncludeVehiclesChange={setLocIncludeVehicles}
                />

                <label className="flex items-center gap-1.5 text-xs">
                  <input type="checkbox" checked={locAllowDuplicates} onChange={(e) => setLocAllowDuplicates(e.target.checked)} />
                  Allow duplicates
                </label>

                <button type="button" onClick={generateLocation} className="w-full py-2.5 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm hover:bg-leather-dark">
                  {results ? 'Reroll' : 'Generate Loot'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {results && <ResultsPanel groups={results} onCopy={copyToClipboard} copied={copied} />}
    </div>
  )
}
