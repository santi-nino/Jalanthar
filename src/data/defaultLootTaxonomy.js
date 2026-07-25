import { SRD_MONSTERS } from './srdMonsters'

// Default values for the Loot tab's own independent category system. This
// is deliberately NOT shared with any NPC taxonomy -- kept fully separate
// per the DM's request. Seeded here the first time, then lives in
// Firestore (collection `lootConfig`, single doc `taxonomy`) once the DM
// starts editing it.
//
// wealthLevels carries a gp price range, an item-count range, AND a gold
// range per level -- wealth is the one thing that determines all three,
// so none of them are ever their own free input.
//
// monsterTypeUsesWealth controls whether the Wealth field even shows up
// for a given type: "wealth" (economic status, how many possessions you
// own) is a human-society concept that doesn't really apply to a wild
// wolf or a patch of blighted moss. Only types explicitly marked true
// show the field at all -- for everything else, item count and gold both
// come out to 0 (guaranteed items still apply regardless, since those
// aren't wealth-gated).
//
// Per-type ATTRIBUTES (monsterTypeAttributes / locationTypeAttributes)
// are the core of "different options for different types": each type
// defines its own list of {id, name, options, excludedItemPatterns,
// guaranteedItems}. Both excludedItemPatterns and guaranteedItems are
// ITEM-NAME-level (substring match), not category-level -- "a mage
// wouldn't have a sword" excludes Longsword/Shortsword/Greatsword by
// name, not the whole Weapon category. guaranteedItems is the opposite:
// baseline items that always appear regardless of the random draw
// ("most people would have shoes"), resolved separately from the
// item-count roll. settingRules applies the same two mechanisms to the
// shared Setting field, since a Jungle encounter and a City encounter
// shouldn't pull from the exact same expectations.
export const DEFAULT_LOOT_TAXONOMY = {
  wealthLevels: [
    { id: 'destitute', label: 'Destitute', min: 0, max: 2, minItems: 1, maxItems: 2, goldMin: 0, goldMax: 3 },
    { id: 'poor', label: 'Poor', min: 0, max: 8, minItems: 1, maxItems: 3, goldMin: 1, goldMax: 10 },
    { id: 'modest', label: 'Modest', min: 0, max: 30, minItems: 2, maxItems: 4, goldMin: 5, goldMax: 30 },
    { id: 'comfortable', label: 'Comfortable', min: 10, max: 80, minItems: 3, maxItems: 5, goldMin: 15, goldMax: 75 },
    { id: 'wealthy', label: 'Wealthy', min: 50, max: 300, minItems: 3, maxItems: 6, goldMin: 50, goldMax: 250 },
    { id: 'aristocratic', label: 'Aristocratic', min: 200, max: 2000, minItems: 5, maxItems: 10, goldMin: 200, goldMax: 1500 },
  ],

  // The 14 official 5e/5.5e creature types -- matches SRD_MONSTERS' `type`
  // field exactly, so a specific monster pick can auto-select the right
  // type here.
  monsterTypes: [
    'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental',
    'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead',
  ],

  // Coarse type-level category restriction -- a broad first pass before
  // the finer per-option item-name exclusions narrow things further. An
  // EXPLICIT empty array means "this type carries nothing from the
  // manufactured-goods catalog" -- not "unrestricted." A key that's
  // absent entirely means unrestricted.
  // Category names here are SRD category names only (Weapon, Armor,
  // Tool, Focus, etc) or "Source: X (Y)" for a specific uploaded
  // source's category. The Hunter's & Trapper's Price Guide items
  // (trophies, pelts, horns, hearts, etc.) are DELIBERATELY not listed
  // here at all -- they reach Beast/Monstrosity/Construct/Dragon through
  // the separate, invisible monsterTypeTag mechanism instead (see
  // LootTab.jsx), which hard-scopes each item to its actual creature
  // type regardless of category or price overlap. Listing those
  // category strings here too was fragile (an exact-string dependency
  // on the source's name) and unnecessary once the tag exists.
  monsterTypeCategories: {
    Aberration: [],
    Beast: [],
    // Fiend, Giant, Humanoid, Undead: no entry -- unrestricted, all
    // sapient-enough or civilized-enough to plausibly carry a
    // shopkeeper's kind of gear. Celestial, Construct, Dragon, Elemental,
    // and now Fey aren't listed here either -- Fey's own dispatch (see
    // generateEncounter in LootTab.jsx) always routes to either the
    // kind-bucketed engine or the Loadout System, so this coarse
    // restriction is never consulted for it either.
    Monstrosity: [],
    Ooze: [],
    Plant: [],
  },

  // Whether Wealth applies at all for this type. Only genuinely
  // "economic" creatures get it -- a dragon hoards gold, a bandit has a
  // coin purse, a wild beast or an ooze has neither concept. Any type
  // absent from this map defaults to NOT using wealth (matching the
  // request that this should be an opt-in list, not opt-out).
  // Wealth is literal economic status, and it genuinely doesn't apply to
  // a wild beast, a monstrosity, or a construct -- none of them have a
  // "how rich am I" concept, full stop. Those get their loot from their
  // own tag-scoped pools instead (see monsterTypeFixedItemCount below
  // for Monstrosity's fallback, and sizeLootTable.Construct for
  // Construct's Purpose-driven count). Celestial and Dragon aren't here
  // either anymore -- both have their own dedicated economic systems now
  // (Celestial's Rank price/gold bands; Dragon's Horde GP-value system),
  // so a separate Wealth field would just be a second, conflicting way
  // to set the same thing.
  monsterTypeUsesWealth: {
    Humanoid: true,
    Fiend: true,
    Giant: true,
    Undead: true,
  },

  // For any type NOT using Wealth, item count still has to come from
  // somewhere other than a free-standing input (same "no separate
  // option" rule as everywhere else) -- this is that fallback. Missing
  // a type here just falls back to the default at the bottom. Construct
  // isn't here anymore -- it's kind-bucketed now, with Purpose driving
  // its count directly (see sizeLootTable.Construct).
  monsterTypeFixedItemCount: {
    Beast: { minItems: 1, maxItems: 2 },
    Monstrosity: { minItems: 1, maxItems: 2 },
    default: { minItems: 1, maxItems: 1 },
  },

  // Type-level guaranteed baseline items -- always included for every
  // entity of this type, regardless of which attribute options are
  // picked. Left unconfigured for types that shouldn't carry anything
  // (matches monsterTypeCategories above).
  monsterTypeGuaranteedItems: {
    Humanoid: ['Boots', 'Clothes'],
  },

  monsterTypeAttributes: {
    Aberration: [
      {
        id: 'aberration-origin', name: 'Origin',
        // Each origin is its own "container" — items tagged to an
        // origin (see the seeded Aberration loot below) only ever
        // appear for entities with that origin selected; untagged items
        // are generic and overlap across every origin's container.
        options: [
          'Far Realm', 'Aquatic Deep', 'Subterranean', 'Mutated',
          'Illithid-Touched', 'Void-Touched', 'Symbiotic',
        ],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'aberration-size', name: 'Size',
        // Drives both WHAT kind of loot appears and HOW MUCH of each
        // kind — see sizeLootTable below, keyed by these exact option
        // strings. Large and above also unlock the Stomach kind.
        options: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'aberration-xenotype', name: 'Xenotype',
        // Body-plan archetype. Items tagged to specific xenotypes (e.g.
        // wing-bearing trophies tagged to Squid/Octopus/Insectoid) never
        // appear for a xenotype that isn't in that list — pick Slug and
        // every wing item is automatically excluded, with no manual
        // exclusion rule needed.
        options: [
          'Slug', 'Squid', 'Octopus', 'Crustacean', 'Worm', 'Jellyfish',
          'Insectoid', 'Amorphous', 'Eye-Cluster', 'Humanoid-Adjacent',
        ],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      { id: 'aberration-communication', name: 'Communication', options: ['Telepathic', 'Vocal', 'None'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Beast: [
      { id: 'beast-diet', name: 'Diet', options: ['Herbivore', 'Carnivore', 'Omnivore', 'Insectivore'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'beast-size', name: 'Size', options: ['Tiny', 'Small', 'Medium', 'Large', 'Huge'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'beast-kingdom', name: 'Animal Kingdom', options: ['Mammal', 'Reptile', 'Bird', 'Fish', 'Insect', 'Amphibian'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Celestial: [
      // Just Rank and Domain -- Origin was removed, it wasn't adding
      // anything (it never filtered generation, purely cosmetic, and
      // wasn't wanted). Rank -> amount + power (via sizeLootTable.
      // Celestial's price/gold bands and item counts); Domain -> which
      // items are even eligible (see each item's lootTags.domain).
      {
        id: 'celestial-rank', name: 'Rank',
        // Low to high. Rank ONLY controls amount and power (via
        // sizeLootTable.Celestial's price/gold ranges and item counts
        // per tier) -- it never determines WHAT kind of item shows up,
        // that's Domain's job entirely.
        options: ['Servant', 'Messenger', 'Guardian', 'Herald', 'Exarch', 'Archon', 'Empyreal'],
        excludedItemPatterns: {},
        guaranteedItems: {},
      },
      {
        id: 'celestial-domain', name: 'Domain',
        // Each domain is its own container, same overlap rules as every
        // other kind-bucketed type: an item tagged to one domain only
        // shows up there; an untagged item is available regardless of
        // domain. A Servant-rank Life-domain celestial draws from the
        // intersection of "cheap enough for Servant rank" and "tagged
        // Life (or untagged)".
        options: ['Light', 'Life', 'War', 'Death', 'Knowledge', 'Nature'],
        excludedItemPatterns: {},
        guaranteedItems: {},
      },
    ],
    Construct: [
      // Only these two fields -- nothing else belongs on this page.
      {
        id: 'construct-mechanism', name: 'Mechanism',
        // What actually animates/builds the thing. This is the ONE
        // field that's strictly exclusive at the item level: a
        // Mechanical construct's parts should never overlap with a
        // Magical construct's parts, and so on -- no shared "body part"
        // pool between mechanisms, only truly generic base loot (coins,
        // arrows, scrap currency-equivalents) crosses between them.
        options: ['Magical', 'Arcane-Mechanical', 'Mechanical', 'Bio-Mechanical', 'Biological'],
        excludedItemPatterns: {},
        guaranteedItems: {},
      },
      {
        id: 'construct-purpose', name: 'Purpose',
        // Purpose does double duty: it narrows WHICH items are
        // eligible (same tag-matching as every other dimension) AND it
        // drives HOW MANY (see sizeLootTable.Construct, keyed by these
        // exact option strings) -- there's no separate Size/Rank field
        // for Construct at all, Purpose covers both jobs.
        options: [
          'Guardian', 'Laborer', 'Sentinel', 'Messenger', 'Siege Engine',
          'Servant', 'Infiltrator', 'Archivist', 'Excavator',
        ],
        excludedItemPatterns: {},
        guaranteedItems: {},
      },
    ],
    Dragon: [
      {
        id: 'dragon-type', name: 'Type',
        // Draconid is the deliberate catch-all -- anything that doesn't
        // fit the other three. This field alone decides which of the
        // two fields below even shows up (see showIf on each).
        options: ['Metallic', 'Chromatic', 'Drake', 'Draconid'],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'dragon-lineage', name: 'Lineage',
        // Now visible for Draconid too -- it gets the non-color subset,
        // not full exclusion.
        showIf: { attr: 'dragon-type', values: ['Metallic', 'Chromatic', 'Drake', 'Draconid'] },
        // Genuinely conditional options, not just a combined list: which
        // exact options show depends on the current Dragon Type. Drake
        // is the only one that sees the full 15; Draconid sees only the
        // 5 non-color (elemental/environmental) ones; Chromatic/Metallic
        // each see just their own 5 colors.
        optionsFor: {
          Chromatic: ['Black', 'Blue', 'Green', 'Red', 'White'],
          Metallic: ['Brass', 'Bronze', 'Copper', 'Gold', 'Silver'],
          Drake: [
            'Black', 'Blue', 'Green', 'Red', 'White',
            'Brass', 'Bronze', 'Copper', 'Gold', 'Silver',
            'Fire', 'Frost', 'Storm', 'Swamp', 'Forest',
          ],
          Draconid: ['Fire', 'Frost', 'Storm', 'Swamp', 'Forest'],
        },
        // Fallback only -- optionsFor is what actually renders once a
        // Dragon Type is picked.
        options: [
          'Black', 'Blue', 'Green', 'Red', 'White',
          'Brass', 'Bronze', 'Copper', 'Gold', 'Silver',
          'Fire', 'Frost', 'Storm', 'Swamp', 'Forest',
        ],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'dragon-age', name: 'Age Category',
        showIf: { attr: 'dragon-type', values: ['Metallic', 'Chromatic'] },
        // Only true dragons get this -- it's what drives the full
        // anatomical kind-bucket set (Wing/Heart/Stomach/Fang/Talon/
        // Breath Organ/Color-Specific; see sizeLootTable.Dragon).
        options: ['Wyrmling', 'Young', 'Adult', 'Ancient'],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'dragon-habitat', name: 'Habitat',
        showIf: { attr: 'dragon-type', values: ['Drake', 'Draconid'] },
        // Drakes and draconids use Habitat instead of Age Category --
        // it plays the exact same dual role (narrows AND determines
        // amount) but for a much smaller, more mundane creature.
        // Domestic = tamed/urban, and runs noticeably smaller than the
        // others.
        options: ['Domestic', 'Wild', 'Feral', 'Mountain', 'Swamp', 'Coastal'],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
    ],
    // Kind-bucketed now (see sizeLootTable.Elemental /
    // KIND_BUCKET_CONFIG.Elemental in LootTab.jsx). Three fields, same
    // "each is its own container" overlap rules as every other
    // kind-bucketed type:
    // - Element is the broad dimension -- Fire/Water/Earth/Air. An item
    //   tagged to one element only ever shows for that element; untagged
    //   items are generic and cross every element.
    // - Sub-Element is the narrower dimension, and genuinely conditional
    //   on Element via optionsFor (same mechanism as Dragon's Lineage) --
    //   Fire's sub-elements (Flame/Magma/Ash/Cinder/Plasma) are things
    //   that are actually fire-adjacent; something like Steam belongs
    //   under Water instead (water changing state), not Fire, even
    //   though a naive "hot vapor" reading might suggest otherwise. An
    //   item tagged to a specific sub-element only shows there; tagged
    //   only to the parent Element (no sub-element tag) shows across
    //   every sub-element of that element; fully untagged crosses
    //   everything.
    // - Power Level is the sizeAttr -- drives both amount (via
    //   sizeLootTable.Elemental's per-kind counts) AND, for the Power
    //   kind specifically, which items are even eligible (via each
    //   item's lootTags.minRank against this list's own low-to-high
    //   order, configured as KIND_BUCKET_CONFIG.Elemental.sizeOrder) --
    //   same minRank/sizeOrder mechanism Celestial's Rank uses. A Mephit
    //   still gets a couple of Power-container items (minRank 0), a
    //   Myrmidon additionally sees everything gated to higher tiers.
    Elemental: [
      {
        id: 'elemental-element', name: 'Element',
        options: ['Fire', 'Water', 'Earth', 'Air'],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'elemental-subelement', name: 'Sub-Element',
        showIf: { attr: 'elemental-element', values: ['Fire', 'Water', 'Earth', 'Air'] },
        optionsFor: {
          Fire: ['Flame', 'Magma', 'Ash', 'Cinder', 'Plasma'],
          Water: ['Wave', 'Frost', 'Brine', 'Steam', 'Deep'],
          Earth: ['Stone', 'Crystal', 'Sand', 'Mud', 'Ore'],
          Air: ['Gale', 'Storm', 'Cloud', 'Vacuum', 'Static'],
        },
        // Fallback only, mirrors Dragon's Lineage pattern -- optionsFor
        // is what actually renders once an Element is picked.
        options: [],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'elemental-power', name: 'Power Level',
        // Low to high -- Mephit is the weakest elemental spirit, a
        // Myrmidon the strongest, most martial form. See
        // KIND_BUCKET_CONFIG.Elemental.sizeOrder in LootTab.jsx, which
        // must match this list exactly.
        options: ['Mephit', 'Elemental', 'Elder Elemental', 'Myrmidon'],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
    ],
    // Fey works differently from every other overhauled type -- closer to
    // Humanoid than to Aberration/Beast/etc. There's no anatomy involved
    // at all when a fey is a person (an eladrin courtier carries armor,
    // weapons, coin, potions -- things you'd find on a person, just
    // fae-flavored), so a straight kind-bucketed Trophy/Organ-style system
    // never fit. Four fields:
    // - Court: PURE theming, no effect on amount or wealth whatsoever --
    //   see fey-is-monster below for what actually drives quantity.
    // - Is Monster: a checkbox, not a dropdown (see the custom UI block
    //   in EntityBuilder) -- stored as attributeValues['fey-is-monster']
    //   = 'Monster' | 'Person' so the existing showIf/optionsFor engine
    //   can gate Role on it with no new mechanism needed. true -> the
    //   ordinary kind-bucketed path (sizeLootTable.Fey, KIND_BUCKET_CONFIG.
    //   Fey), same engine as Aberration/Beast/etc, drawing from a new
    //   dedicated Fey source PLUS relevant established/original items
    //   (subject to the source-balance rule same as those types). false ->
    //   Role appears and generation routes through the new Loadout System
    //   instead (see `loadouts` below and generateLoadoutLoot in
    //   LootTab.jsx) -- this is the "overlaps with Humanoid's rules" path
    //   the DM asked for, just with richer per-role rules than Humanoid's
    //   simple guaranteed-item list.
    // - Rank: the tier field for BOTH paths -- Minor Fey up to Arch Fey --
    //   drives amount and gold. Never determines WHICH items are eligible,
    //   only how many/how much (Court and, on the person path, Role are
    //   what determine "which").
    // - Role: only visible when Is Monster is false (see showIf below).
    //   Keys into `loadouts` -- see that block for what each role actually
    //   grants. Interpretation call: Caster and Fighter are exactly what
    //   the DM specified; Trickster/Noble/Wanderer are extrapolated by
    //   Claude to round out the set the way Humanoid's own Role list does,
    //   and should be treated as a first draft, not settled.
    Fey: [
      {
        id: 'fey-court', name: 'Court',
        // Wild = never belonged to any court at all (distinct from
        // Courtless, which implies HAVING belonged and left/been cast
        // out). Independent covers non-court factions like hag covens.
        // Gloaming Court and Thorned Court are Claude's own additions for
        // "smaller courts, their own categories" -- invented names, not
        // official lore, flag for correction if they don't fit the
        // campaign. Twisted/Blighted is deliberately separate from
        // Unseelie -- corrupted/monstrous fey, not just "winter court."
        options: [
          'Wild', 'Seelie', 'Unseelie', 'Courtless', 'Independent',
          'Gloaming Court', 'Thorned Court', 'Twisted/Blighted',
        ],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'fey-rank', name: 'Rank',
        // Low to high. Drives sizeLootTable.Fey's counts on the monster
        // path and loadouts[role].rankScaled / goldByRank on the person
        // path -- see KIND_BUCKET_CONFIG.Fey.sizeOrder in LootTab.jsx,
        // which must match this list exactly.
        options: ['Minor Fey', 'Fey', 'Noble Fey', 'Arch Fey'],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'fey-role', name: 'Role',
        // Only shown once Is Monster is unchecked (Person) -- see the
        // checkbox block in EntityBuilder, which writes 'Person'/'Monster'
        // directly into attributeValues['fey-is-monster'] specifically so
        // this ordinary showIf mechanism can gate on it with no special
        // casing needed anywhere else.
        showIf: { attr: 'fey-is-monster', values: ['Person'] },
        options: ['Caster', 'Fighter', 'Trickster', 'Noble', 'Wanderer'],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
    ],
    Fiend: [
      {
        id: 'fiend-origin', name: 'Origin',
        options: ['Devil (Lawful)', 'Demon (Chaotic)', 'Yugoloth (Neutral)', 'Other'],
        excludedItemPatterns: { 'Demon (Chaotic)': ['Shield'] },
        guaranteedItems: { 'Devil (Lawful)': ['Sword'] },
      },
      { id: 'fiend-rank', name: 'Rank', options: ['Lesser', 'Greater', 'Named/Unique'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Giant: [
      {
        id: 'giant-kind', name: 'Giant Kind',
        options: ['Hill', 'Stone', 'Frost', 'Fire', 'Cloud', 'Storm'],
        excludedItemPatterns: {},
        guaranteedItems: { Hill: ['Club'] },
      },
      { id: 'giant-temperament', name: 'Temperament', options: ['Brutish', 'Cunning', 'Noble'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Humanoid: [
      {
        id: 'humanoid-role', name: 'Role',
        // Deliberately NOT the standard D&D classes -- this is how NPCs
        // and humanoid monsters get sorted for loot purposes, a
        // different axis entirely (a Commoner and a Noble both might be
        // "no class" mechanically but carry very different loot).
        options: [
          'Commoner', 'Laborer', 'Merchant', 'Guard/Soldier', 'Bandit/Criminal',
          'Noble', 'Scholar', 'Mage/Caster', 'Cleric/Devout', 'Traveler',
        ],
        excludedItemPatterns: {
          // The concrete example from the request: a mage specifically
          // wouldn't carry a SWORD -- not "nothing tagged Weapon" (a
          // dagger or a component pouch is still perfectly fine).
          'Mage/Caster': ['Sword'],
        },
        guaranteedItems: {
          'Guard/Soldier': ['Shield'],
          'Bandit/Criminal': ['Dagger'],
          Noble: ['Signet'],
          Merchant: ['Ledger'],
          Scholar: ['Ink'],
          'Cleric/Devout': ['Holy Symbol'],
        },
      },
    ],
    Monstrosity: [
      { id: 'monstrosity-origin', name: 'Origin', options: ['Natural Mutation', 'Magical Creation', 'Ancient Beast'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'monstrosity-threat', name: 'Threat Level', options: ['Predator', 'Territorial', 'Aggressive'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Ooze: [
      { id: 'ooze-composition', name: 'Composition', options: ['Acidic', 'Corrosive', 'Adhesive', 'Caustic'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'ooze-origin', name: 'Origin', options: ['Natural', 'Alchemical Accident', 'Cursed'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Plant: [
      { id: 'plant-growth', name: 'Growth Type', options: ['Rooted', 'Mobile', 'Parasitic', 'Fungal'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'plant-origin', name: 'Origin', options: ['Awakened', 'Natural', 'Cursed/Blighted'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Undead: [
      {
        id: 'undead-origin', name: 'Origin',
        options: ['Freshly Risen', 'Ancient', 'Skeletal', 'Spectral', 'Ghoulish'],
        excludedItemPatterns: { Spectral: ['Sword', 'Shield', 'Armor'] },
        guaranteedItems: { Skeletal: ['Sword'], 'Freshly Risen': ['Clothes'] },
      },
      { id: 'undead-sentience', name: 'Sentience', options: ['Mindless', 'Malevolent Intelligence', 'Tragic Remnant'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
  },

  // Searchable catalog of real monster names, sizes, types, and
  // alignments, extracted directly from the official SRD 5.2.1 -- see
  // src/data/srdMonsters.js for the full list and required attribution.
  // Picking one of these auto-fills Monster Type from its real type.
  // Presence of a type here is what switches that type's loot
  // generation over to the kind-bucketed system (see LootTab.jsx's
  // generateKindBucketedLoot): instead of one flat random draw, each
  // "kind" gets its own count rolled independently from the picked
  // Size, then filled from whichever catalog items are compatible with
  // the entity's other dimensions (Origin/Xenotype for Aberration,
  // Kingdom/Diet for Beast). A size rolling 0-0 for a given kind is what
  // actually enforces "this size doesn't yield that kind of loot" -- not
  // a manual exclusion, the count is just zero. Types absent from this
  // map keep using the older single-pool random draw (Monstrosity,
  // Construct, Dragon, and everything else, pending their own overhaul
  // pass).
  sizeLootTable: {
    Aberration: {
      Tiny: { Trophy: [1, 2], Organ: [0, 0], Pelt: [0, 0], Stomach: [0, 0] },
      Small: { Trophy: [1, 2], Organ: [0, 1], Pelt: [0, 1], Stomach: [0, 0] },
      Medium: { Trophy: [1, 2], Organ: [1, 1], Pelt: [1, 1], Stomach: [0, 0] },
      Large: { Trophy: [2, 3], Organ: [1, 2], Pelt: [1, 1], Stomach: [1, 1] },
      Huge: { Trophy: [2, 3], Organ: [2, 2], Pelt: [1, 2], Stomach: [1, 2] },
      Gargantuan: { Trophy: [3, 4], Organ: [2, 3], Pelt: [2, 2], Stomach: [2, 3] },
    },
    // Den is new: this represents whatever's lying around a beast's lair
    // rather than anything from the beast's own body -- broken arrows,
    // bloody scraps of clothing, gnawed belongings, that kind of thing.
    // Beast stays exempt from the established/original balance rule (its
    // own dedicated source only, same as Dragon/Humanoid), so Den items
    // live in that same dedicated source, not the SRD/Junk Drawer.
    Beast: {
      Tiny: { Trophy: [1, 1], Parts: [0, 1], Pelt: [0, 0], Ration: [0, 0], Den: [0, 1] },
      Small: { Trophy: [1, 2], Parts: [1, 1], Pelt: [0, 1], Ration: [0, 1], Den: [0, 1] },
      Medium: { Trophy: [1, 2], Parts: [1, 2], Pelt: [1, 1], Ration: [1, 1], Den: [1, 1] },
      Large: { Trophy: [2, 2], Parts: [2, 3], Pelt: [1, 2], Ration: [1, 2], Den: [1, 2] },
      Huge: { Trophy: [2, 3], Parts: [3, 4], Pelt: [2, 2], Ration: [1, 2], Den: [1, 2] },
    },
    // Celestial's tiers are keyed by Rank, not Size -- same mechanism,
    // different name for the same "which attribute drives amount"
    // concept. No price or gold bands anymore -- this is deliberately
    // narrative, not economic: a higher rank means more of, and
    // access to better, Armor/Weapon/Treasure/Religious, not "a bigger
    // gp budget." Power comes from each item's own lootTags.minRank
    // (an ordinal threshold against Rank's own low-to-high order,
    // configured in LootTab.jsx's KIND_BUCKET_CONFIG.Celestial.sizeOrder)
    // -- a Servant only ever sees minRank 0 items ("a common blessed
    // shortsword"), an Empyreal sees those AND everything gated to
    // higher tiers too. Domain still decides WHICH flavor of item is
    // even in the running -- see each item's lootTags.domain.
    Celestial: {
      Servant: { Armor: [0, 1], Weapon: [0, 1], Treasure: [0, 1], Religious: [1, 1] },
      Messenger: { Armor: [0, 1], Weapon: [0, 1], Treasure: [1, 1], Religious: [1, 1] },
      Guardian: { Armor: [1, 1], Weapon: [1, 1], Treasure: [1, 2], Religious: [1, 1] },
      Herald: { Armor: [1, 2], Weapon: [1, 1], Treasure: [1, 2], Religious: [1, 2] },
      Exarch: { Armor: [1, 2], Weapon: [1, 2], Treasure: [2, 2], Religious: [1, 2] },
      Archon: { Armor: [2, 2], Weapon: [1, 2], Treasure: [2, 3], Religious: [2, 2] },
      Empyreal: { Armor: [2, 3], Weapon: [2, 2], Treasure: [3, 4], Religious: [2, 3] },
    },
    // Keyed by Purpose, not Size/Rank -- Construct only has two fields
    // total, and Purpose does double duty (see monsterTypeAttributes.
    // Construct): it's both a normal filtering dimension (via each
    // item's lootTags.purpose) AND the thing driving these counts,
    // exactly like Size/Rank do everywhere else. No price/gold bands
    // here -- Construct doesn't use Wealth and Purpose isn't meant to
    // convey "power" the way Celestial's Rank does, just headcount.
    Construct: {
      Guardian: { Component: [1, 2], Core: [1, 1] },
      Laborer: { Component: [1, 2], Core: [0, 1] },
      Sentinel: { Component: [1, 2], Core: [1, 1] },
      Messenger: { Component: [0, 1], Core: [0, 1] },
      'Siege Engine': { Component: [2, 3], Core: [1, 2] },
      Servant: { Component: [1, 1], Core: [0, 1] },
      Infiltrator: { Component: [1, 2], Core: [1, 1] },
      Archivist: { Component: [1, 2], Core: [1, 2] },
      Excavator: { Component: [2, 2], Core: [0, 1] },
    },
    // Two entirely different tier sets coexist in one table because
    // Dragon's sizeAttr itself is conditional (see KIND_BUCKET_CONFIG.
    // Dragon.resolve in LootTab.jsx): Metallic/Chromatic look up by Age
    // Category and get the full anatomical set every true dragon has --
    // 2 wings, a heart, stomach, fangs, talons, a breath organ, and one
    // slot specific to their color. Drake/Draconid look up by Habitat
    // instead and get a much smaller, more mundane Trophy/Parts set,
    // since they were never meant to have the same anatomy as a true
    // dragon.
    Dragon: {
      Wyrmling: { Wing: [2, 2], Heart: [1, 1], Stomach: [0, 1], Fang: [1, 2], Talon: [1, 2], 'Breath Organ': [0, 1], 'Color-Specific': [1, 1] },
      Young: { Wing: [2, 2], Heart: [1, 1], Stomach: [1, 1], Fang: [2, 2], Talon: [2, 2], 'Breath Organ': [1, 1], 'Color-Specific': [1, 2] },
      Adult: { Wing: [2, 2], Heart: [1, 1], Stomach: [1, 2], Fang: [2, 3], Talon: [2, 3], 'Breath Organ': [1, 1], 'Color-Specific': [2, 2] },
      Ancient: { Wing: [2, 2], Heart: [1, 1], Stomach: [2, 3], Fang: [3, 4], Talon: [3, 4], 'Breath Organ': [1, 2], 'Color-Specific': [2, 3] },
      Domestic: { Trophy: [0, 1], Parts: [1, 1] },
      Wild: { Trophy: [1, 1], Parts: [1, 2] },
      Feral: { Trophy: [1, 2], Parts: [1, 2] },
      Mountain: { Trophy: [1, 2], Parts: [2, 2] },
      Swamp: { Trophy: [1, 1], Parts: [1, 2] },
      Coastal: { Trophy: [1, 1], Parts: [1, 2] },
    },
    // Keyed by Power Level, not Size -- same mechanism, different name.
    // Four buckets carry the entity's own straightforward loot (Weapon/
    // Parts/MagicParts/Junk, filtered by Element+Sub-Element like any
    // other dimension pair); Power is a fifth, SUPPLEMENTARY bucket on
    // top of those, gated by lootTags.minRank against
    // KIND_BUCKET_CONFIG.Elemental.sizeOrder in LootTab.jsx -- a Mephit
    // only ever sees minRank 0 Power items (a couple of minor supernatural
    // odds and ends), a Myrmidon sees those PLUS everything gated to
    // higher tiers too, same additive-not-exclusive relationship
    // Celestial's Rank has with its own minRank-tagged items.
    Elemental: {
      Mephit: { Weapon: [0, 1], Parts: [1, 2], MagicParts: [0, 1], Junk: [1, 2], Power: [1, 1] },
      Elemental: { Weapon: [1, 1], Parts: [1, 2], MagicParts: [1, 1], Junk: [1, 2], Power: [1, 2] },
      'Elder Elemental': { Weapon: [1, 2], Parts: [2, 3], MagicParts: [1, 2], Junk: [1, 2], Power: [1, 2] },
      Myrmidon: { Weapon: [1, 2], Parts: [2, 3], MagicParts: [2, 2], Junk: [1, 2], Power: [2, 2] },
    },
    // Fey MONSTER path only (Is Monster checked) -- Person path bypasses
    // this table entirely and uses `loadouts` instead (see below and
    // generateLoadoutLoot in LootTab.jsx). Keyed by Rank, same mechanism
    // as everywhere else. Kinds are deliberately non-anatomical (a fey
    // monster like a boggle doesn't have "organs" the way an Aberration
    // does) -- Trophy/Charm/Treasure/Whimsy instead, covering fae-specific
    // monster loot from the new dedicated Fey source plus relevant
    // established/original items (see SOURCE_BALANCED_TYPES in
    // LootTab.jsx, which now includes Fey).
    Fey: {
      'Minor Fey': { Trophy: [0, 1], Charm: [1, 1], Treasure: [0, 1], Whimsy: [1, 2] },
      Fey: { Trophy: [1, 1], Charm: [1, 2], Treasure: [1, 1], Whimsy: [1, 2] },
      'Noble Fey': { Trophy: [1, 2], Charm: [1, 2], Treasure: [1, 2], Whimsy: [2, 3] },
      'Arch Fey': { Trophy: [1, 2], Charm: [2, 2], Treasure: [2, 3], Whimsy: [2, 3] },
    },
  },

  // The Loadout System -- Fey's Person path (Is Monster unchecked), and
  // named for reuse: the DM can ask for this same mechanism on Humanoid
  // (or any future type) later just by saying so. Each role is a fixed
  // recipe rather than a single item-count roll:
  // - fixed: exactly `count` of `pool`, always included (a Fighter always
  //   gets exactly one martial weapon, no roll involved).
  // - rankScaled: a [min,max] range that itself depends on Rank -- this is
  //   how "x magic items where x is determined by power" works. The
  //   ranges below are Claude's own scale (Minor Fey light, Arch Fey
  //   heaviest), not specified exactly by the DM -- flag for correction.
  // - ranged: a flat [min,max] roll, same as any ordinary count range,
  //   EXCEPT when preferMin/preferMax are set -- see weightedRandInt in
  //   LootTab.jsx, which then rolls 60% of the time from the tighter
  //   preferred band and 40% from the full range, matching "0-4 with a
  //   preference for 2-3" precisely rather than a flat uniform roll.
  // - goldByRank: this role's own gold table, keyed by Rank.
  // `pool` names resolve in generateLoadoutLoot: MartialWeapon/
  // SimpleWeapon and ArcaneFocus/Clothes read the SRD catalog's own
  // existing tags/category (no new tagging needed -- "martial"/"simple"
  // weapon tags and "clothing"-tagged Gear already exist); Boots/Helmet/
  // Shoes are three small new base Gear items added to dnd5eItems.js
  // (SRD tables don't price separate footwear/headwear, so these are a
  // deliberate small gap-fill); MagicItem/MagicWeapon/Supplementary/Junk
  // read lootTags.loadoutPool, tagged onto the Magical Junk Drawer's
  // whimsical items and a curated set of SRD consumables/alchemical/
  // utility gear -- see the tagging pass in mockData.js and dnd5eItems.js.
  loadouts: {
    Caster: {
      fixed: [
        { pool: 'Shoes', count: 1 },
        { pool: 'Clothes', count: 1 },
        { pool: 'ArcaneFocus', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { 'Minor Fey': [0, 1], Fey: [1, 2], 'Noble Fey': [2, 3], 'Arch Fey': [3, 4] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 0, max: 10 },
        { pool: 'Junk', min: 0, max: 4, preferMin: 2, preferMax: 3 },
      ],
      goldByRank: { 'Minor Fey': [5, 20], Fey: [20, 60], 'Noble Fey': [60, 150], 'Arch Fey': [150, 400] },
    },
    Fighter: {
      fixed: [
        { pool: 'MartialWeapon', count: 1 },
        { pool: 'Boots', count: 1 },
        { pool: 'Helmet', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicWeapon', rankRange: { 'Minor Fey': [0, 0], Fey: [0, 1], 'Noble Fey': [1, 1], 'Arch Fey': [1, 2] } },
      ],
      ranged: [
        { pool: 'MagicItem', min: 1, max: 2 },
        { pool: 'Supplementary', min: 0, max: 10 },
        { pool: 'Junk', min: 0, max: 4, preferMin: 2, preferMax: 3 },
      ],
      goldByRank: { 'Minor Fey': [5, 20], Fey: [20, 60], 'Noble Fey': [60, 150], 'Arch Fey': [150, 400] },
    },
    // Claude's own extrapolation, matching the Caster/Fighter shape --
    // first draft, correct as needed.
    Trickster: {
      fixed: [
        { pool: 'Shoes', count: 1 },
        { pool: 'Clothes', count: 1 },
        { pool: 'SimpleWeapon', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { 'Minor Fey': [0, 1], Fey: [1, 2], 'Noble Fey': [2, 3], 'Arch Fey': [3, 4] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 0, max: 8 },
        { pool: 'Junk', min: 0, max: 4, preferMin: 2, preferMax: 3 },
      ],
      goldByRank: { 'Minor Fey': [3, 15], Fey: [15, 45], 'Noble Fey': [45, 110], 'Arch Fey': [110, 300] },
    },
    Noble: {
      fixed: [
        { pool: 'Clothes', count: 1 },
        { pool: 'Boots', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { 'Minor Fey': [1, 1], Fey: [1, 2], 'Noble Fey': [2, 3], 'Arch Fey': [3, 5] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 0, max: 6 },
        { pool: 'Junk', min: 0, max: 2 },
      ],
      goldByRank: { 'Minor Fey': [10, 40], Fey: [40, 120], 'Noble Fey': [120, 300], 'Arch Fey': [300, 800] },
    },
    Wanderer: {
      fixed: [
        { pool: 'Shoes', count: 1 },
        { pool: 'Clothes', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { 'Minor Fey': [0, 1], Fey: [0, 2], 'Noble Fey': [1, 2], 'Arch Fey': [2, 3] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 10 },
        { pool: 'Junk', min: 0, max: 4, preferMin: 2, preferMax: 3 },
      ],
      goldByRank: { 'Minor Fey': [3, 15], Fey: [15, 45], 'Noble Fey': [45, 110], 'Arch Fey': [110, 300] },
    },
  },

  // Optional per-entity checkboxes for anatomical/nature features that
  // don't apply to every creature of a type even within the same
  // container -- not every mammal has tusks, not every celestial is
  // bestial. Items can require one of these (see the seeded items'
  // lootTags.requiresFeature); unchecked = those items are excluded for
  // this entity, no matter what else matches. Every checkbox starts
  // unchecked, since assuming a feature is present by default risks
  // handing out tusks (or wings) to something that shouldn't have any.
  monsterTypeFeatures: {
    Beast: ['Tusks', 'Horns', 'Wings', 'Venom', 'Shell', 'Beak'],
    // 'Very Rare+' reuses this same checkbox mechanism to gate Very
    // Rare/Legendary magic items -- the DM said these should be an
    // explicit per-entity opt-in for Dragon, Elemental, Celestial,
    // Fiend, Humanoid, and Fey (Dragon/Humanoid/Fiend aren't built out
    // yet, so it's only wired up here for Celestial/Elemental/Fey for
    // now -- add it to the others' own feature lists once they get
    // this same treatment). Aberration and Construct were deliberately
    // left off this list -- those two still never see Very Rare+ items
    // at all, checkbox or not, since the DM didn't include them.
    // Unchecked by default like every feature here, so a DM has to
    // actively opt an entity in rather than legendary loot appearing
    // by surprise.
    Celestial: ['Bestial', 'Wings', 'Sentient', 'Very Rare+'],
    Elemental: ['Very Rare+'],
    Fey: ['Very Rare+'],
  },

  // Dragon-only: when a DM checks "Has Horde," Horde Size picks one of
  // these ranges as the horde's TARGET total gp value -- a simplified
  // 4-tier scale inspired by the real 5e SRD Treasure Hoard tables (CR
  // 0-4 / 5-10 / 11-16 / 17+), not an exact replica of their percentile
  // sub-rolls (those require the full Magic Item Tables A-I, which
  // aren't reproduced here). A random value is rolled within the
  // chosen range, then handed to the AI horde-fill step along with
  // Lineage/Setting/Notes as the actual gp budget to assemble contents
  // toward.
  hordeGpRanges: {
    Small: [300, 800],
    Medium: [3000, 8000],
    Large: [20000, 40000],
    Huge: [60000, 150000],
  },

  monsterCatalog: SRD_MONSTERS,

  // Keyword -> Role suggestion for the Specific Monster search field.
  // When a picked/typed monster name contains one of these keywords and
  // the entity's Role attribute is still unset, the matching Role gets
  // auto-suggested too -- not just Monster Type. This is what makes
  // searching "Bandit" actually pull toward bandit-flavored loot instead
  // of a bare, role-less Humanoid.
  monsterNameRoleHints: {
    bandit: 'Bandit/Criminal',
    thug: 'Bandit/Criminal',
    thief: 'Bandit/Criminal',
    cultist: 'Cleric/Devout',
    priest: 'Cleric/Devout',
    acolyte: 'Cleric/Devout',
    guard: 'Guard/Soldier',
    knight: 'Guard/Soldier',
    veteran: 'Guard/Soldier',
    soldier: 'Guard/Soldier',
    mage: 'Mage/Caster',
    druid: 'Mage/Caster',
    noble: 'Noble',
    commoner: 'Commoner',
    scout: 'Traveler',
    spy: 'Bandit/Criminal',
  },

  settings: [
    'Jungle', 'Mountain', 'Town', 'City', 'Forest', 'Swamp', 'Coast', 'Desert',
    'Underdark', 'Ruins', 'Road', 'Riverside',
  ],

  // Setting-level rules, same two mechanisms as attribute options
  // (excludedItemPatterns / guaranteedItems), so Setting actually
  // influences generation instead of being a cosmetic label. Left
  // unconfigured for settings where nothing specific applies (Town/City
  // -- everything's reasonably available there already).
  settingRules: {
    Jungle: { guaranteedItems: ['Waterskin'], excludedItemPatterns: [] },
    Desert: { guaranteedItems: ['Waterskin'], excludedItemPatterns: [] },
    Mountain: { guaranteedItems: ["Traveler's"], excludedItemPatterns: [] },
    Coast: { guaranteedItems: [], excludedItemPatterns: [] },
    Swamp: { guaranteedItems: [], excludedItemPatterns: [] },
    Underdark: { guaranteedItems: [], excludedItemPatterns: [] },
    Forest: { guaranteedItems: [], excludedItemPatterns: [] },
    Ruins: { guaranteedItems: [], excludedItemPatterns: [] },
    Road: { guaranteedItems: [], excludedItemPatterns: [] },
    Riverside: { guaranteedItems: [], excludedItemPatterns: [] },
    Town: { guaranteedItems: [], excludedItemPatterns: [] },
    City: { guaranteedItems: [], excludedItemPatterns: [] },
  },

  // Shop now covers everything commerce-related -- general stores,
  // restaurants, and taverns are all just different Shop Types rather
  // than separate top-level location categories, per the request.
  shopTypes: [
    'General Store', 'Blacksmith', 'Apothecary', 'Jeweler', 'Bookshop', 'Tailor', 'Magic Shop',
    'Street Food Stall', 'Modest Eatery', 'Fine Dining',
    'Dive Bar', 'Working Tavern', 'Upscale Inn',
  ],
  explorationTypes: ['Dungeon', 'Ruins', 'Cave', 'Battlefield', 'Shipwreck', 'Tomb', 'Abandoned Camp'],

  locationTypeGuaranteedItems: {},

  // Same attribute-set mechanism as monsterTypeAttributes, one set per
  // location type. Shop's field list now folds in what used to be
  // Restaurant's and Tavern's own fields (Cuisine Style, Clientele,
  // Atmosphere) alongside its original ones, since all of those
  // establishment types now live under Shop.
  locationTypeAttributes: {
    shop: [
      { id: 'shop-specialty', name: 'Specialty', options: ['General Goods', 'Weapons Focus', 'Armor Focus', 'Alchemy Focus', 'Luxury Goods', 'Tools & Trade', 'Food & Drink'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'shop-scale', name: 'Scale', options: ['Market Stall', 'Modest Shop', 'Large Emporium'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'shop-reputation', name: 'Reputation', options: ['Shady', 'Modest', 'Reputable', 'Prestigious'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'shop-cuisine', name: 'Cuisine Style (if food/drink)', options: ['Home-style', 'Regional Specialty', 'Exotic/Imported', 'Street Food'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'shop-clientele', name: 'Clientele (if tavern/eatery)', options: ['Locals', 'Travelers', 'Rough Crowd', 'High Society'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'shop-atmosphere', name: 'Atmosphere (if tavern/eatery)', options: ['Rowdy', 'Quiet', 'Festive', 'Seedy'], excludedItemPatterns: {}, guaranteedItems: { Rowdy: ['Ale'] } },
    ],
    exploration: [
      { id: 'exploration-condition', name: 'Condition', options: ['Pristine', 'Already Looted', 'Ancient/Decayed', 'Trapped'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'exploration-occupied', name: 'Occupied By', options: ['Abandoned', 'Guarded', 'Infested', 'Haunted'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
  },
}

// Which taxonomy key backs each location subtype's "subsequent choice"
// dropdown, and the friendly label for that dropdown. Restaurant and
// Tavern are no longer their own top-level location types -- they're
// entries in Shop's own "Shop Type" list now.
export const LOCATION_TYPES = [
  { id: 'shop', label: 'Shop', taxonomyKey: 'shopTypes', commerce: true },
  { id: 'exploration', label: 'Exploration', taxonomyKey: 'explorationTypes', commerce: false },
]

// Exact SRD category names (see src/data/dnd5eItems.js) for mounts and
// vehicles. Loot generation excludes these by default -- an explicit
// "Include vehicles & mounts" opt-in checkbox exists per-generation.
export const VEHICLE_CATEGORIES = ['Mount', 'Vehicle']
