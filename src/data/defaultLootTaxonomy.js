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

  // monsterTypeCategories (the old coarse type-level category restriction
  // -- Weapon/Armor/Tool/etc, one flat list per type) was removed
  // entirely per the DM ("cluttered and not necessary"): every type now
  // either runs through the kind-bucketed engine or the Loadout System,
  // both of which already scope eligibility far more precisely via real
  // item tags (monsterTypeTags, lootTags.kind/domain/element/role/etc)
  // than a coarse SRD-category allowlist ever did. The handful of types
  // still on the plain flat draw (Undead, Monstrosity, Ooze, Plant, and
  // Humanoid before a Role is picked) just draw unrestricted by category
  // now, same as everything else effectively already was.

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
    Undead: true,
  },
  // Fiend used to be here, using the generic Wealth field like Giant/
  // Undead/Humanoid still do. Removed once Fiend got its own two
  // dedicated economic systems instead -- Rank (Devil lineage: wealth +
  // item-count range, plus a luxury-goods bias at higher ranks) and
  // Power Level (Demon lineage: body-loot amount, same role Size plays
  // for Beast) -- same reasoning as Celestial's Rank and Dragon's Horde
  // already being carved out of this list.
  //
  // Giant removed the same way this round: it now has its own Role field
  // (see monsterTypeAttributes.Giant below) that routes through the
  // Loadout System (loadouts.Brute / Guard / Chief / the five Giant
  // Kind-specific roles), with wealth coming from each role's own
  // goldByRank instead of the generic Wealth dropdown.

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
    // Fiend has two entirely different generation paths depending on
    // Lineage, same shape as Fey's Court/Is-Monster split:
    //  - Devil -> routes to the Loadout System (see `loadouts.Devil`
    //    below and generateLoadoutLoot in LootTab.jsx), same "things
    //    found on a person" mechanism Fey's Person path uses, themed
    //    infernal/fire/seduction instead of nature/whimsy. Gated by
    //    Rank (wealth + item count, with a luxury-goods bias at higher
    //    ranks -- see loadouts.Devil.luxury below), not Power Level.
    //  - Demon -> routes to the ordinary kind-bucketed engine instead
    //    (see sizeLootTable.Fiend and KIND_BUCKET_CONFIG.Fiend in
    //    LootTab.jsx), same anatomical-drop mechanism Beast/Dragon use --
    //    gated by Power Level (amount), not Rank.
    //  - Yugoloth/Other have no dedicated path of their own (the DM
    //    only specified Devil and Demon) -- they fall back to the
    //    kind-bucketed Demon-style path, since a Yugoloth is closer to
    //    "monstrous fiend that drops body parts" than "person with a
    //    coin purse." Worth a dedicated pass later if that's wrong.
    Fiend: [
      {
        id: 'fiend-lineage', name: 'Lineage',
        // Renamed from "Origin" -- this is the field that actually
        // determines which container/path applies (was doing that job
        // under a name that suggested "where they're from" instead of
        // "what kind of fiend they are"). Options unchanged from the
        // original placeholder.
        options: ['Devil (Lawful)', 'Demon (Chaotic)', 'Yugoloth (Neutral)', 'Other'],
        excludedItemPatterns: { 'Demon (Chaotic)': ['Shield'] },
        guaranteedItems: { 'Devil (Lawful)': ['Sword'] },
      },
      {
        id: 'fiend-rank', name: 'Rank',
        showIf: { attr: 'fiend-lineage', values: ['Devil (Lawful)'] },
        // Devil-only. Drives both wealth (gp/gold range) and item-count
        // range via loadouts.Devil below, same role Rank plays for
        // Fey's Loadout System roles. Named/Unique devils (an Asmodeus,
        // a Baalzebul) are where the luxury-goods bias kicks in hardest.
        options: ['Lesser', 'Greater', 'Named/Unique'],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'fiend-power', name: 'Power Level',
        showIf: { attr: 'fiend-lineage', values: ['Demon (Chaotic)'] },
        // Demon-only. Low to high, same role Power Level plays for
        // Elemental and Size plays for Beast -- drives sizeLootTable.
        // Fiend's Demon tiers (body-loot amount), nothing else. Manes
        // are the mindless, weakest true demons in the classic
        // hierarchy; Demon Lord caps it at Demogorgon/Orcus tier.
        options: ['Manes', 'Lesser Demon', 'Greater Demon', 'Demon Lord'],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'fiend-origin', name: 'Origin',
        // The NEW final field -- "where in the Nine Hells (or the Abyss,
        // for demons) they come from," pure theming like Fey's Court or
        // Celestial's Domain (never affects amount or wealth, only which
        // flavor of item is eligible -- feeds KIND_BUCKET_CONFIG.Fiend's
        // 'realm' dimension in LootTab.jsx for the Demon path).
        // optionsFor needs its OWN showIf (not just Power Level/Rank's)
        // to know fiend-lineage is the controlling field -- without it,
        // resolveAttributeOptions in LootTab.jsx has no controllingValue
        // to look up and silently falls back to the empty `options`
        // array, which is exactly the "no categories showed up" bug this
        // fixes. Every Lineage value is listed here so Origin stays
        // visible no matter which one is picked (matches Elemental's
        // Sub-Element listing all 4 Elements the same way). Devil
        // options are the real Nine Hells layers; Demon/Yugoloth layers
        // are invented (the Abyss doesn't have a small fixed SRD-safe
        // list the way the Nine Hells does) -- flagged for the DM to
        // rename.
        showIf: { attr: 'fiend-lineage', values: ['Devil (Lawful)', 'Demon (Chaotic)', 'Yugoloth (Neutral)', 'Other'] },
        optionsFor: {
          'Devil (Lawful)': ['Avernus', 'Dis', 'Minauros', 'Phlegethos', 'Stygia', 'Malbolge', 'Maladomini', 'Cania', 'Nessus'],
          'Demon (Chaotic)': ['Pazunia', 'The Blood Rift', 'The Screaming Maze', 'The Obsidian Wastes', 'The Drowned Depths'],
          'Yugoloth (Neutral)': ['Gehenna', 'Hades', 'Carceri'],
          Other: ['Unknown', 'Elsewhere'],
        },
        options: [],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
    ],
    // Giant runs entirely through the Loadout System (same "things found
    // on a person" mechanism as Fey's Person path and Fiend's Devil
    // lineage) rather than kind-bucketed body loot -- giants are people,
    // just very large ones, not creatures that drop anatomical trophies.
    // Giant Kind plays the role Element plays for Elemental: it's a
    // tagging DIMENSION, not a path-switch. It narrows which loadoutPool
    // items are eligible (see the giantKind filter generateLoadoutLoot
    // takes in LootTab.jsx) -- untagged items stay universal across all
    // six kinds, while a handful of kind-specific items (a Storm Giant's
    // Thundercloud-Charged Warhorn, a Fire Giant's forge tongs) only
    // surface for that one kind, same "generic reachable everywhere,
    // themed narrows" convention as the rest of the catalog.
    Giant: [
      {
        id: 'giant-kind', name: 'Giant Kind',
        options: ['Hill', 'Stone', 'Frost', 'Fire', 'Cloud', 'Storm'],
        excludedItemPatterns: {},
        guaranteedItems: { Hill: ['Club'] },
      },
      { id: 'giant-temperament', name: 'Temperament', options: ['Brutish', 'Cunning', 'Noble'], excludedItemPatterns: {}, guaranteedItems: {} },
      {
        id: 'giant-rank', name: 'Rank',
        // Shared life-stage scale across every Role below -- drives
        // loadouts[role].rankScaled/goldByRank, same job Fey's Rank and
        // Devil's Rank do for their own Loadout roles.
        options: ['Young', 'Adult', 'Elder', 'Ancient'],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'giant-role', name: 'Role',
        // Conditional on Giant Kind, same optionsFor+showIf pattern as
        // Fiend's Origin field -- Brute/Guard/Chief are available to
        // every kind, but each kind (other than Hill, the least
        // differentiated of the six in classic 5e lore) additionally
        // unlocks one specialized role that only makes sense for it: a
        // Storm Giant can be a Storm Caller, a Hill Giant can't. Each
        // option here is its own key in loadouts below.
        showIf: { attr: 'giant-kind', values: ['Hill', 'Stone', 'Frost', 'Fire', 'Cloud', 'Storm'] },
        optionsFor: {
          Hill: ['Brute', 'Guard', 'Chief'],
          Stone: ['Brute', 'Guard', 'Chief', 'Rune Carver'],
          Frost: ['Brute', 'Guard', 'Chief', 'Berserker'],
          Fire: ['Brute', 'Guard', 'Chief', 'Forgemaster'],
          Cloud: ['Brute', 'Guard', 'Chief', 'Schemer'],
          Storm: ['Brute', 'Guard', 'Chief', 'Storm Caller'],
        },
        options: [],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
    ],
    // Humanoid now routes through the Loadout System (same "things found
    // on a person" mechanism as Fey's Person path, Devil, and Giant) --
    // see the isHumanoid dispatch in generateEncounter, LootTab.jsx.
    // Role picks the loadout profile/container (same job Fey's Role or
    // Giant's Role play); the pre-existing Wealth field (still shown,
    // still the same dropdown, monsterTypeUsesWealth.Humanoid stays true)
    // does double duty as the `rank` input into that loadout's
    // rankScaled/goldByRank -- no separate Rank field needed since Wealth
    // was already exactly that concept ("how many possessions, how much
    // gold") for this one type. Subrole is the new second field: a
    // further specialization WITHIN a Role's own loadout/container,
    // conditional on which Role is picked (optionsFor+showIf, same
    // pattern as Fiend's Origin or Dragon's Lineage) -- passed to
    // generateLoadoutLoot as dimensionKey:'subrole', same generic
    // narrowing mechanism Giant Kind already uses for dimensionKey:
    // 'giantKind'. Only items actually tagged lootTags.subrole (a
    // curated set of weapons/tools in dnd5eItems.js, plus a handful of
    // small new flavor items) are narrowed by it -- everything else in
    // the Role's loadout (Boots, Clothes, MagicItem, Supplementary, Junk)
    // stays untagged and universal, which is what naturally produces the
    // "mostly the base Role's own loadout, just an Archer's weapon and a
    // bit of Archer flavor" result the DM asked for, with no separate
    // weighting mechanism needed -- it falls out of which items happen to
    // carry a subrole tag at all.
    // Four new roles added this round (Artisan/Craftsman, Sailor/
    // Dockhand, Entertainer, Farmer/Herder) to round out the set; not
    // every role got a Subrole (Commoner/Laborer/Traveler/Sailor/
    // Entertainer/Farmer don't have an obvious further specialization the
    // way a soldier or a mage does) -- see humanoid-subrole's optionsFor
    // for exactly which 8 do.
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
          'Artisan/Craftsman', 'Sailor/Dockhand', 'Entertainer', 'Farmer/Herder',
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
      {
        id: 'humanoid-subrole', name: 'Subrole',
        // Conditional on Role, same optionsFor+showIf mechanism as
        // Fiend's Origin/Dragon's Lineage -- every Role that HAS
        // subroles needs to be listed in showIf.values (not just have an
        // optionsFor entry), same gotcha documented on Fiend's Origin
        // field above.
        showIf: {
          attr: 'humanoid-role',
          values: [
            'Guard/Soldier', 'Bandit/Criminal', 'Mage/Caster', 'Cleric/Devout',
            'Scholar', 'Merchant', 'Artisan/Craftsman', 'Noble',
          ],
        },
        optionsFor: {
          'Guard/Soldier': ['Archer', 'Swordsman', 'Spearman', 'Cavalry'],
          'Bandit/Criminal': ['Thief', 'Thug', 'Highwayman', 'Smuggler'],
          'Mage/Caster': ['Elementalist', 'Illusionist', 'Enchanter', 'Diviner'],
          'Cleric/Devout': ['Battle Cleric', 'Healer', 'Inquisitor', 'Missionary'],
          Scholar: ['Historian', 'Alchemist', 'Cartographer', 'Astronomer'],
          Merchant: ['General Trader', 'Exotic Importer', 'Moneylender', 'Caravan Master'],
          'Artisan/Craftsman': ['Blacksmith', 'Carpenter', 'Tailor', 'Jeweler'],
          Noble: ['Courtier', 'Warlord', 'Merchant-Prince', 'Recluse'],
        },
        options: [],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
    ],
    // Monstrosity combines the Loadout System with Beast's kind-bucketed
    // "each field is its own container" approach, per the DM's own framing
    // ("a combination of the loadout system from roles and the beast loot
    // generation system"). Three fields, each one narrowing further:
    // - Climate is the first container -- where the creature is actually
    //   found. This is deliberately its own field, separate from the
    //   site-wide Setting field every type already has (Setting drives the
    //   small supplementary side-loadout everywhere; Climate here is a
    //   primary theming dimension in its own right, the same weight
    //   Element carries for Elemental).
    // - Origin is the second container -- WHAT KIND of monstrosity this
    //   is, not where it lives. Natural and Arcanum are the DM's own two
    //   named examples (Natural: phoenixes, rocs -- creatures that are
    //   simply born, however strange; Arcanum: manticores, cockatrices --
    //   creatures whose existence is itself a magical/alchemical act).
    //   Aberrant/Fiendish/Draconic-Touched/Undead-Touched are Claude's own
    //   extrapolation to round out "and more" -- first draft, flag for
    //   correction.
    // - Phenotype is where the Loadout System itself comes in -- it picks
    //   the body-part RECIPE (see loadouts['Monstrosity:<Phenotype>']
    //   below), the same role Role plays for Fey/Giant/Humanoid, just
    //   built from anatomy slots (Skull/Wing/Fang/Scale/etc, see
    //   loadoutPoolFor's default case) instead of "things found on a
    //   person". No separate Rank/tier field -- the DM's spec doesn't
    //   call for one, and generateLoadoutLoot degrades cleanly without a
    //   rank when a loadout has no rankScaled/goldByRank entries (every
    //   Monstrosity phenotype below is fixed/ranged only).
    //
    // Both Origin AND Climate are passed to generateLoadoutLoot as
    // simultaneous dimensions (see its `dimensions` array param) -- an
    // item tagged to a specific origin AND/OR a specific climate only
    // surfaces when the entity's own values match both, while an untagged
    // item stays universal. This is exactly the DM's own example: "a Roc
    // from the desert would have 'sandy-colored feathers'" is an item
    // tagged { loadoutPool: 'Feather', origin: ['Natural'], climate:
    // ['Desert'] } -- it only ever appears for a Natural-origin,
    // Desert-climate entity, while a generic feather with no tags at all
    // reaches every Roc regardless of origin or climate.
    Monstrosity: [
      {
        id: 'monstrosity-climate', name: 'Climate',
        options: [
          'Temperate', 'Desert', 'Arctic/Tundra', 'Jungle/Tropical',
          'Swamp/Wetland', 'Mountain', 'Coastal/Aquatic',
          'Underground/Subterranean', 'Volcanic',
        ],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'monstrosity-origin', name: 'Origin',
        options: [
          'Natural', 'Arcanum', 'Aberrant', 'Fiendish',
          'Draconic-Touched', 'Undead-Touched',
        ],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'monstrosity-phenotype', name: 'Phenotype',
        // Each option is its own key in loadouts below, namespaced
        // 'Monstrosity:<Phenotype>' (same collision-avoidance convention
        // Humanoid's roles use) -- see that block for the exact body-part
        // recipe each one grants.
        options: [
          'Flying Beast', 'Bird', 'Serpentine', 'Quadruped Predator',
          'Insectoid', 'Aquatic Horror',
        ],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
    ],
    // Ooze rebuilt down to just these two fields per the DM (v3.13):
    // Origin was removed entirely -- Composition already carries all the
    // theming an ooze needs, and a third field wasn't pulling its weight
    // for a monster type this simple. Composition is now BOTH a pure
    // flavor dimension (narrows Narrative Flavor items, same "tagged
    // narrows, untagged stays universal" overlap rule as everywhere else)
    // AND, newly, Size drives real amount via sizeLootTable.Ooze below --
    // Ooze finally joins the kind-bucketed engine instead of falling
    // through to the old flat 1-2 item draw (see KIND_BUCKET_CONFIG.Ooze
    // in LootTab.jsx).
    Ooze: [
      { id: 'ooze-composition', name: 'Composition', options: ['Acidic', 'Corrosive', 'Adhesive', 'Caustic'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'ooze-size', name: 'Size', options: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'], excludedItemPatterns: {}, guaranteedItems: {} },
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
    // Ooze rebuilt from scratch (v3.13, DM-directed) -- previously had no
    // sizeLootTable entry at all and fell through to the old flat 1-2
    // item draw (the same "Owlbear always gets 1-2 anatomically-wrong
    // items" bug class that Monstrosity/Plant/Undead used to have too).
    // Three kinds, all new: Biological Waste (harvestable slime/secretion/
    // membrane -- usually pure narrative with a gp value, occasionally
    // reads like a reusable consumable, e.g. a vial that functions like
    // Acid), Narrative Flavor (Composition-themed flavor items, several
    // explicitly reskinned as a real mundane item per the DM's own
    // example -- a Corroded Sword that "can function like a dagger"), and
    // Supplementary (whatever the ooze swallowed and didn't fully
    // dissolve -- coins, a bent arrow, and occasionally a magic item that
    // survived intact -- same role Beast's Den bucket plays, "loot found
    // near/in this creature" rather than "loot that came off its body").
    // Ranges deliberately stay small and overlapping across tiers (a
    // Gargantuan ooze reads as "somewhat more," not "ten times more") --
    // an ooze's whole nature is that swallowing lots of stuff doesn't
    // mean much of it survives intact, so counts grow gently with Size
    // rather than scaling as aggressively as Beast/Aberration do.
    Ooze: {
      Tiny: { BiologicalWaste: [1, 1], NarrativeFlavor: [0, 1], Supplementary: [0, 1] },
      Small: { BiologicalWaste: [1, 2], NarrativeFlavor: [0, 1], Supplementary: [0, 1] },
      Medium: { BiologicalWaste: [1, 2], NarrativeFlavor: [1, 1], Supplementary: [0, 1] },
      Large: { BiologicalWaste: [1, 2], NarrativeFlavor: [1, 2], Supplementary: [1, 1] },
      Huge: { BiologicalWaste: [2, 3], NarrativeFlavor: [1, 2], Supplementary: [1, 2] },
      Gargantuan: { BiologicalWaste: [2, 3], NarrativeFlavor: [2, 3], Supplementary: [1, 2] },
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
    // Fiend -- Demon lineage ONLY (see KIND_BUCKET_CONFIG.Fiend and the
    // Lineage dispatch in generateEncounter, LootTab.jsx). Devil lineage
    // never reaches this table at all -- it uses `loadouts.Devil`
    // instead, same split as Fey's Monster/Person paths. Keyed by Power
    // Level, same mechanism as Elemental. Trophy/Horn/Ichor/Hide are the
    // anatomical kinds (the DM's "drop body parts like beasts and
    // dragons"); Den is the fifth, SUPPLEMENTARY bucket layered on top --
    // same additive role Elemental's Power bucket plays, except themed
    // as "junk found in or around the demon's lair" with a bit of arcane
    // material mixed in (a few Elemental/Aberration-style magic items
    // dual-tagged in here too, not just mundane debris), per the DM's
    // "slightly more arcane bent to this supplementary bucket."
    Fiend: {
      Manes: { Trophy: [1, 1], Horn: [0, 1], Ichor: [0, 1], Hide: [0, 0], Den: [0, 1] },
      'Lesser Demon': { Trophy: [1, 2], Horn: [1, 1], Ichor: [1, 1], Hide: [0, 1], Den: [1, 1] },
      'Greater Demon': { Trophy: [2, 2], Horn: [1, 2], Ichor: [1, 2], Hide: [1, 1], Den: [1, 2] },
      'Demon Lord': { Trophy: [2, 3], Horn: [2, 2], Ichor: [2, 2], Hide: [1, 2], Den: [1, 2] },
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
    // Fiend's Devil lineage -- no Role subdivision the way Fey has
    // (the DM only specified Rank), so this is a single profile keyed
    // by fiend-rank instead of fiend-role. "Luxury" is a new pool, same
    // mechanism as any other (reads lootTags.loadoutPool === 'Luxury'
    // via the default case in loadoutPoolFor) -- fine art, jewelry, and
    // gold-heavy Treasure-flavored items, meant to read as "a shard of
    // a dragon's hoard" per the DM's own comparison. [0,0] at Lesser
    // means no luxury items at all for rank-and-file devils; by Named/
    // Unique, Luxury's range is sized to land around a quarter of the
    // total item count for a typical roll -- an approximation (there's
    // no exact-percentage mechanism here, same as Junk's "0-4 preferring
    // 2-3" being a preference band rather than a literal formula), not
    // a hard guarantee every single time.
    Devil: {
      fixed: [
        { pool: 'MartialWeapon', count: 1 },
        { pool: 'Clothes', count: 1 },
        { pool: 'Boots', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Lesser: [0, 1], Greater: [1, 2], 'Named/Unique': [2, 4] } },
        { pool: 'Luxury', rankRange: { Lesser: [0, 0], Greater: [1, 2], 'Named/Unique': [2, 3] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 0, max: 8 },
        { pool: 'Junk', min: 0, max: 2 },
      ],
      goldByRank: { Lesser: [10, 50], Greater: [50, 200], 'Named/Unique': [200, 1000] },
    },

    // Giant -- eight Role profiles sharing the Young/Adult/Elder/Ancient
    // Rank scale (giant-rank). Brute/Guard/Chief are available to every
    // Giant Kind; the other five (Rune Carver/Berserker/Forgemaster/
    // Schemer/Storm Caller) are each unlocked by exactly one Kind (see
    // monsterTypeAttributes.Giant's giant-role optionsFor) and lean into
    // that kind's own flavor -- Storm Caller in particular runs heaviest
    // on magic, matching storm giants' place at the top of the classic
    // giant hierarchy. Counts/gold are Claude's own scale, following the
    // same shape as Fey's roles and Devil's Rank -- flag for correction.
    Brute: {
      fixed: [
        { pool: 'MartialWeapon', count: 1 },
        { pool: 'Clothes', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Young: [0, 0], Adult: [0, 1], Elder: [1, 2], Ancient: [1, 3] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 0, max: 3 },
        { pool: 'Junk', min: 0, max: 2 },
      ],
      goldByRank: { Young: [5, 20], Adult: [20, 80], Elder: [80, 300], Ancient: [300, 1000] },
    },
    Guard: {
      fixed: [
        { pool: 'MartialWeapon', count: 1 },
        { pool: 'Clothes', count: 1 },
        { pool: 'Boots', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Young: [0, 1], Adult: [0, 1], Elder: [1, 2], Ancient: [2, 3] } },
        { pool: 'MagicWeapon', rankRange: { Young: [0, 0], Adult: [0, 1], Elder: [1, 1], Ancient: [1, 2] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 0, max: 2 },
      ],
      goldByRank: { Young: [10, 30], Adult: [30, 100], Elder: [100, 350], Ancient: [350, 1200] },
    },
    Chief: {
      fixed: [
        { pool: 'MartialWeapon', count: 1 },
        { pool: 'Clothes', count: 1 },
        { pool: 'Boots', count: 1 },
        { pool: 'Helmet', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Young: [1, 1], Adult: [1, 2], Elder: [2, 3], Ancient: [3, 4] } },
        { pool: 'MagicWeapon', rankRange: { Young: [0, 1], Adult: [1, 1], Elder: [1, 2], Ancient: [2, 2] } },
        { pool: 'Luxury', rankRange: { Young: [0, 1], Adult: [1, 2], Elder: [2, 3], Ancient: [3, 5] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 4 },
        { pool: 'Junk', min: 0, max: 2 },
      ],
      goldByRank: { Young: [30, 100], Adult: [100, 400], Elder: [400, 1200], Ancient: [1200, 4000] },
    },
    'Rune Carver': {
      fixed: [
        { pool: 'ArcaneFocus', count: 1 },
        { pool: 'Clothes', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Young: [0, 1], Adult: [1, 2], Elder: [2, 3], Ancient: [3, 4] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 3 },
      ],
      goldByRank: { Young: [10, 40], Adult: [40, 150], Elder: [150, 500], Ancient: [500, 1500] },
    },
    Berserker: {
      fixed: [
        { pool: 'MartialWeapon', count: 2 },
        { pool: 'Clothes', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicWeapon', rankRange: { Young: [0, 1], Adult: [1, 1], Elder: [1, 2], Ancient: [2, 3] } },
      ],
      ranged: [
        { pool: 'Junk', min: 0, max: 3 },
      ],
      goldByRank: { Young: [5, 20], Adult: [20, 80], Elder: [80, 250], Ancient: [250, 800] },
    },
    Forgemaster: {
      fixed: [
        { pool: 'SimpleWeapon', count: 1 },
        { pool: 'Clothes', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicWeapon', rankRange: { Young: [0, 1], Adult: [1, 2], Elder: [2, 3], Ancient: [3, 4] } },
        { pool: 'MagicItem', rankRange: { Young: [0, 1], Adult: [1, 1], Elder: [1, 2], Ancient: [2, 3] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 3 },
      ],
      goldByRank: { Young: [20, 60], Adult: [60, 200], Elder: [200, 600], Ancient: [600, 2000] },
    },
    Schemer: {
      fixed: [
        { pool: 'Clothes', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Young: [0, 1], Adult: [1, 2], Elder: [2, 3], Ancient: [3, 5] } },
        { pool: 'Luxury', rankRange: { Young: [1, 1], Adult: [1, 2], Elder: [2, 4], Ancient: [4, 6] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 0, max: 3 },
      ],
      goldByRank: { Young: [40, 120], Adult: [120, 400], Elder: [400, 1200], Ancient: [1200, 4000] },
    },
    'Storm Caller': {
      fixed: [
        { pool: 'ArcaneFocus', count: 1 },
        { pool: 'Clothes', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Young: [1, 2], Adult: [2, 3], Elder: [3, 4], Ancient: [4, 6] } },
        { pool: 'MagicWeapon', rankRange: { Young: [0, 1], Adult: [1, 2], Elder: [2, 3], Ancient: [3, 4] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 4 },
      ],
      goldByRank: { Young: [50, 150], Adult: [150, 500], Elder: [500, 1500], Ancient: [1500, 5000] },
    },

    // Humanoid -- 14 Role profiles, all keyed by rank = the EXISTING
    // Wealth field's label (Destitute/Poor/Modest/Comfortable/Wealthy/
    // Aristocratic), not a new dedicated rank field -- see the comment on
    // monsterTypeAttributes.Humanoid above for why. goldByRank is
    // deliberately IDENTICAL across every single role below and matches
    // wealthLevels' own goldMin/goldMax exactly (line ~35) -- gold comes
    // from how rich you are, full stop, regardless of profession; only
    // the item-slot recipe differs by role. Boots/Clothes are NOT
    // repeated in any role's `fixed` list -- monsterTypeGuaranteedItems.
    // Humanoid already adds those to every Humanoid regardless of Role,
    // so putting them here too would just double them up.
    // Variety fix (per the DM: a Mage/Caster generated "for the road" came
    // back with only a focus and clothes -- MagicItem is correctly
    // wealth-gated to near-zero at low Wealth, but Supplementary had a
    // min of 0 too, so a run of bad rolls could plausibly return NOTHING
    // beyond the fixed slots). Every role below now guarantees real
    // variety regardless of wealth: Supplementary's min is 1 (not 0)
    // almost everywhere, and every role gets a NEW PersonalEffects slot
    // (min 1, max 2) -- small, characterful belongings (a keepsake, a
    // letter, a worn charm) that are a third, distinct flavor from
    // Supplementary (practical/utility gear) and Junk (worthless odds and
    // ends). MagicItem/MagicWeapon/Luxury stay wealth-gated on purpose --
    // "some of them should have magic items" reads as variety ACROSS many
    // rolls, not a guarantee on every single one -- but nobody should ever
    // walk away with literally just their fixed slots anymore.
    'Humanoid:Commoner': {
      fixed: [],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 0], Comfortable: [0, 1], Wealthy: [0, 1], Aristocratic: [1, 2] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 2 },
        { pool: 'Junk', min: 0, max: 2 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Laborer': {
      fixed: [
        { pool: 'SimpleWeapon', count: 1 },
        { pool: 'Tool', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 0], Comfortable: [0, 1], Wealthy: [0, 1], Aristocratic: [1, 2] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 2 },
        { pool: 'Junk', min: 0, max: 2 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Merchant': {
      fixed: [
        { pool: 'Tool', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 1], Comfortable: [0, 1], Wealthy: [1, 2], Aristocratic: [1, 3] } },
        { pool: 'Luxury', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 0], Comfortable: [0, 1], Wealthy: [1, 2], Aristocratic: [2, 4] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 3 },
        { pool: 'Junk', min: 0, max: 1 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Guard/Soldier': {
      fixed: [
        { pool: 'MartialWeapon', count: 1 },
        { pool: 'Helmet', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 1], Comfortable: [0, 1], Wealthy: [1, 2], Aristocratic: [1, 3] } },
        { pool: 'MagicWeapon', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 0], Comfortable: [0, 1], Wealthy: [1, 1], Aristocratic: [1, 2] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 3 },
        { pool: 'Junk', min: 0, max: 1 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Bandit/Criminal': {
      fixed: [
        { pool: 'SimpleWeapon', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 1], Comfortable: [0, 1], Wealthy: [1, 2], Aristocratic: [1, 3] } },
        { pool: 'MagicWeapon', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 0], Comfortable: [0, 1], Wealthy: [1, 1], Aristocratic: [1, 2] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 2 },
        { pool: 'Junk', min: 0, max: 2 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Noble': {
      fixed: [],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 1], Comfortable: [0, 1], Wealthy: [1, 2], Aristocratic: [2, 3] } },
        { pool: 'Luxury', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 1], Comfortable: [1, 1], Wealthy: [1, 3], Aristocratic: [3, 5] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 2 },
        { pool: 'Junk', min: 0, max: 1 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Scholar': {
      fixed: [
        { pool: 'Tool', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 1], Comfortable: [0, 1], Wealthy: [1, 2], Aristocratic: [1, 3] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 3 },
        { pool: 'Junk', min: 0, max: 1 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Mage/Caster': {
      fixed: [
        { pool: 'ArcaneFocus', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 1], Comfortable: [1, 1], Wealthy: [1, 2], Aristocratic: [2, 4] } },
        { pool: 'MagicWeapon', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 0], Comfortable: [0, 1], Wealthy: [0, 1], Aristocratic: [1, 1] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 3 },
        { pool: 'Junk', min: 0, max: 1 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Cleric/Devout': {
      fixed: [
        { pool: 'SimpleWeapon', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 1], Comfortable: [0, 1], Wealthy: [1, 2], Aristocratic: [1, 3] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 3 },
        { pool: 'Junk', min: 0, max: 1 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Traveler': {
      fixed: [
        { pool: 'SimpleWeapon', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 1], Comfortable: [0, 1], Wealthy: [1, 1], Aristocratic: [1, 2] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 4 },
        { pool: 'Junk', min: 0, max: 2 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Artisan/Craftsman': {
      fixed: [
        { pool: 'Tool', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 0], Comfortable: [0, 1], Wealthy: [0, 1], Aristocratic: [1, 2] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 2 },
        { pool: 'Junk', min: 0, max: 1 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Sailor/Dockhand': {
      fixed: [
        { pool: 'SimpleWeapon', count: 1 },
        { pool: 'Tool', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 0], Comfortable: [0, 1], Wealthy: [0, 1], Aristocratic: [1, 2] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 2 },
        { pool: 'Junk', min: 0, max: 2 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Entertainer': {
      fixed: [
        { pool: 'Tool', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 0], Comfortable: [0, 1], Wealthy: [0, 1], Aristocratic: [1, 2] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 3 },
        { pool: 'Junk', min: 0, max: 2 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },
    'Humanoid:Farmer/Herder': {
      fixed: [
        { pool: 'SimpleWeapon', count: 1 },
        { pool: 'Tool', count: 1 },
      ],
      rankScaled: [
        { pool: 'MagicItem', rankRange: { Destitute: [0, 0], Poor: [0, 0], Modest: [0, 0], Comfortable: [0, 1], Wealthy: [0, 1], Aristocratic: [1, 2] } },
      ],
      ranged: [
        { pool: 'Supplementary', min: 1, max: 2 },
        { pool: 'Junk', min: 0, max: 2 },
        { pool: 'PersonalEffects', min: 1, max: 2 },
      ],
      goldByRank: { Destitute: [0, 3], Poor: [1, 10], Modest: [5, 30], Comfortable: [15, 75], Wealthy: [50, 250], Aristocratic: [200, 1500] },
    },

    // Monstrosity -- six Phenotype profiles, namespaced 'Monstrosity:
    // <Phenotype>' per the collision-avoidance convention (see the
    // Fey/Humanoid "Noble" collision this same session fixed). No
    // rankScaled/goldByRank on any of these -- Monstrosity has no Rank
    // field, these are pure body-part recipes, fixed + ranged only. Pool
    // names (Skull/Wing/Beak/Talon/Feather/Scale/Fang/VenomGland/Tail/
    // Claw/Pelt/Bone/Organ/Horn/Shell/Mandible/Chitin/Leg/Fin/Tentacle)
    // all resolve via loadoutPoolFor's default case (lootTags.loadoutPool
    // === name) -- see the retagged Hunter's & Trapper's Price Guide
    // items and the new anatomy items added alongside them in
    // mockData.js, several of which carry lootTags.origin and/or
    // lootTags.climate for the "sandy-colored feathers on a desert Roc"
    // narrowing the DM specifically asked for.
    'Monstrosity:Flying Beast': {
      fixed: [
        { pool: 'Skull', count: 1 },
        { pool: 'Pelt', count: 1 },
        { pool: 'Wing', count: 2 },
      ],
      ranged: [
        { pool: 'Bone', min: 1, max: 3 },
        { pool: 'Organ', min: 0, max: 1 },
      ],
    },
    'Monstrosity:Bird': {
      fixed: [
        { pool: 'Skull', count: 1 },
        { pool: 'Wing', count: 2 },
        { pool: 'Beak', count: 1 },
      ],
      ranged: [
        { pool: 'Talon', min: 1, max: 2 },
        { pool: 'Feather', min: 1, max: 3 },
      ],
    },
    'Monstrosity:Serpentine': {
      fixed: [
        { pool: 'Skull', count: 1 },
        { pool: 'Fang', count: 1 },
        { pool: 'Tail', count: 1 },
      ],
      ranged: [
        { pool: 'Scale', min: 3, max: 6 },
        { pool: 'VenomGland', min: 0, max: 1 },
      ],
    },
    'Monstrosity:Quadruped Predator': {
      fixed: [
        { pool: 'Skull', count: 1 },
        { pool: 'Pelt', count: 1 },
        { pool: 'Fang', count: 1 },
      ],
      ranged: [
        { pool: 'Claw', min: 2, max: 4 },
        { pool: 'Bone', min: 1, max: 2 },
        { pool: 'Horn', min: 0, max: 1 },
        { pool: 'Organ', min: 0, max: 1 },
      ],
    },
    'Monstrosity:Insectoid': {
      fixed: [
        { pool: 'Shell', count: 1 },
        { pool: 'Mandible', count: 1 },
      ],
      ranged: [
        { pool: 'Chitin', min: 2, max: 4 },
        { pool: 'Leg', min: 1, max: 3 },
      ],
    },
    'Monstrosity:Aquatic Horror': {
      fixed: [
        { pool: 'Skull', count: 1 },
        { pool: 'Fin', count: 2 },
      ],
      ranged: [
        { pool: 'Scale', min: 2, max: 4 },
        { pool: 'Tentacle', min: 0, max: 2 },
      ],
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
    // Rare/Legendary magic items -- the DM's original list was Dragon,
    // Elemental, Celestial, Fiend, Humanoid, and Fey. Dragon/Fiend/
    // Humanoid were left off this list originally because they weren't
    // built out yet -- caught as a real gap during a later tagging-
    // completeness verification pass: several catalog items (including
    // the new named +3 weapons/armor/ammo) were already being TAGGED
    // requiresFeature: 'Very Rare+' with Dragon/Fiend/Humanoid in their
    // monsterTypeTags, but since none of those three ever had 'Very
    // Rare+' in their OWN feature list here, there was no checkbox for a
    // DM to ever check, and those items could never actually surface for
    // any of the three -- silently unreachable rather than functioning
    // as the intended opt-in. All three are fully built out now (Dragon
    // was kind-bucketed from the start; Fiend's Demon path is kind-
    // bucketed; Humanoid runs the Loadout System), so all three are
    // added here to match the DM's original list. Aberration and
    // Construct remain deliberately excluded -- those two still never
    // see Very Rare+ items at all, checkbox or not, since the DM didn't
    // include them. Unchecked by default like every feature here, so a
    // DM has to actively opt an entity in rather than legendary loot
    // appearing by surprise.
    Celestial: ['Bestial', 'Wings', 'Sentient', 'Very Rare+'],
    Elemental: ['Very Rare+'],
    Fey: ['Very Rare+'],
    Dragon: ['Very Rare+'],
    Fiend: ['Very Rare+'],
    Humanoid: ['Very Rare+'],
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

  // The "side loadout system" -- a SEPARATE mechanism from settingRules
  // above (which only nudges the existing draw via guaranteed/excluded
  // patterns). This one ADDS a small number of extra items on top of
  // whatever the entity's normal kind-bucketed roll produced, drawn from
  // Setting-and-type-specific named buckets, sized by the entity's own
  // tier (Size for Beast, Age/Habitat for Dragon, Power Level for
  // Elemental -- see SETTING_LOADOUT_TIER_ORDER and
  // generateSettingLoadout in LootTab.jsx). Per the DM: only Beast,
  // Dragon, and Elemental read this at all -- every other type's Setting
  // field stays purely the settingRules nudge above. Also per the DM,
  // these items must still make sense for the specific creature -- a
  // wolf doesn't wear fancy clothes -- so every item here is framed as
  // something SCAVENGED, CACHED, or ENTANGLED near the creature/its lair
  // rather than worn or used, same "found near, not carried by" framing
  // Beast's existing Den bucket already uses. Each item is tagged
  // lootTags.settingBucket matching one of the ids below, plus the usual
  // monsterTypeTags hard-scoping (Beast/Dragon/Elemental only, never
  // shared across the three) so setting content still respects each
  // type's own eligibility rules, never supersedes them.
  //
  // Only City and Mountain have real catalog content behind them right
  // now (the two settings the DM gave concrete examples for -- City's
  // Junk/Equipment split, Mountain's Survival Gear/Cold Weather Gear/
  // Equipment split). The other ten settings are wired up with the same
  // universal Junk/Equipment shape so the mechanism never errors, but
  // draw from an empty pool until they get their own items -- flag for
  // a follow-up content pass if the DM wants the rest filled in too.
  settingLoadouts: {
    City: [
      { id: 'City-Junk', label: 'Junk' },
      { id: 'City-Equipment', label: 'Equipment' },
    ],
    Mountain: [
      { id: 'Mountain-Survival', label: 'Survival Gear' },
      { id: 'Mountain-ColdWeather', label: 'Cold Weather Gear' },
      { id: 'Mountain-Equipment', label: 'Equipment' },
    ],
    Town: [{ id: 'Town-Junk', label: 'Junk' }, { id: 'Town-Equipment', label: 'Equipment' }],
    Jungle: [{ id: 'Jungle-Junk', label: 'Junk' }, { id: 'Jungle-Equipment', label: 'Equipment' }],
    Forest: [{ id: 'Forest-Junk', label: 'Junk' }, { id: 'Forest-Equipment', label: 'Equipment' }],
    Swamp: [{ id: 'Swamp-Junk', label: 'Junk' }, { id: 'Swamp-Equipment', label: 'Equipment' }],
    Coast: [{ id: 'Coast-Junk', label: 'Junk' }, { id: 'Coast-Equipment', label: 'Equipment' }],
    Desert: [{ id: 'Desert-Junk', label: 'Junk' }, { id: 'Desert-Equipment', label: 'Equipment' }],
    Underdark: [{ id: 'Underdark-Junk', label: 'Junk' }, { id: 'Underdark-Equipment', label: 'Equipment' }],
    Ruins: [{ id: 'Ruins-Junk', label: 'Junk' }, { id: 'Ruins-Equipment', label: 'Equipment' }],
    Road: [{ id: 'Road-Junk', label: 'Junk' }, { id: 'Road-Equipment', label: 'Equipment' }],
    Riverside: [{ id: 'Riverside-Junk', label: 'Junk' }, { id: 'Riverside-Equipment', label: 'Equipment' }],
  },

  // Shop now covers everything commerce-related -- general stores,
  // restaurants, and taverns are all just different Shop Types rather
  // than separate top-level location categories, per the request.
  //
  // v3.9: this list now ALSO absorbs the old "Specialty" field entirely
  // (see the removed shop-specialty attribute below) -- Type and
  // Specialty covered nearly the same ground twice (Blacksmith vs.
  // "Weapons Focus", Apothecary vs. "Alchemy Focus", etc.), so per the
  // DM's request they're merged into this single list, redundancies
  // dropped, and a handful of new categories added (Black Market, Fence/
  // Pawnbroker, Exotic/Luxury Importer) to round it out.
  shopTypes: [
    'General Store', 'Blacksmith', 'Armorer', 'Apothecary/Alchemist', 'Jeweler',
    'Bookshop', 'Tailor/Clothier', 'Magic Shop', 'Black Market', 'Fence/Pawnbroker',
    'Tool & Trade Supplier', 'Exotic/Luxury Importer',
    'Street Food Stall', 'Modest Eatery', 'Fine Dining',
    'Dive Bar', 'Working Tavern', 'Upscale Inn',
  ],
  // The subset of shopTypes above that's genuinely a tavern/eatery --
  // drives showIf on shop-cuisine/shop-clientele/shop-atmosphere below,
  // and matched against the 'shop-type' synthetic key LootTab.jsx merges
  // into DynamicAttributeFields' values (see the shop entity form).
  shopTavernEateryTypes: ['Street Food Stall', 'Modest Eatery', 'Fine Dining', 'Dive Bar', 'Working Tavern', 'Upscale Inn'],
  // Expanded substantially (v3.14, DM-directed -- "what if someone is
  // looting a temple type ship") -- this is still a flat EditableList
  // (the DM can always type in something not listed, and the exploration
  // prompt in lootAi.js leans on Notes for exactly the "temple ship"
  // hybrid case: pick the closest preset, e.g. Shipwreck or Sunken
  // Temple, then use Notes to tell the AI it's actually a sunken temple
  // built like a ship, or a warship converted into a floating shrine).
  // Not trying to enumerate every combination -- just covering enough
  // ground that most sites don't need a Notes workaround at all.
  explorationTypes: [
    'Dungeon', 'Ruins', 'Cave', 'Battlefield', 'Shipwreck', 'Tomb', 'Abandoned Camp',
    'Temple', 'Sunken Temple', 'Crypt', 'Catacombs', 'Barrow/Cairn', 'Mine',
    'Watchtower', 'Fortress', 'Prison/Oubliette', 'Sewer', 'Laboratory', 'Library/Archive',
    'Armory', 'Vault', 'Shrine', 'Monastery', 'Lighthouse', 'Observatory',
    'War Camp', 'Sacred Grove', 'Frozen Wreck', 'Volcanic Forge',
  ],

  locationTypeGuaranteedItems: {},

  // Same attribute-set mechanism as monsterTypeAttributes, one set per
  // location type. Shop's field list now folds in what used to be
  // Restaurant's and Tavern's own fields (Cuisine Style, Clientele,
  // Atmosphere) alongside its original ones, since all of those
  // establishment types now live under Shop.
  //
  // v3.9: shop-specialty removed entirely (merged into shopTypes above);
  // shop-scale expanded per the DM (Road Merchant added, plus Guild Hall
  // as a new top tier so Scale has real range beyond "big store");
  // shop-cuisine/clientele/atmosphere are now genuinely conditional
  // (showIf against the synthetic 'shop-type' key, matched against
  // shopTavernEateryTypes) instead of just a hint in the label text.
  // Reputation's own effect (driving BOTH item quality and quantity, not
  // just a cosmetic descriptor) lives in the new AI shop-generation
  // prompt (see generateAiShopWares in lootAi.js), not in this taxonomy
  // data -- there's no separate "quality" knob to configure here.
  locationTypeAttributes: {
    shop: [
      { id: 'shop-scale', name: 'Scale', options: ['Road Merchant', 'Market Stall', 'Modest Shop', 'Large Emporium', 'Guild Hall'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'shop-reputation', name: 'Reputation', options: ['Shady', 'Modest', 'Reputable', 'Prestigious'], excludedItemPatterns: {}, guaranteedItems: {} },
      {
        id: 'shop-cuisine', name: 'Cuisine Style',
        showIf: { attr: 'shop-type', values: ['Street Food Stall', 'Modest Eatery', 'Fine Dining', 'Dive Bar', 'Working Tavern', 'Upscale Inn'] },
        options: ['Home-style', 'Regional Specialty', 'Exotic/Imported', 'Street Food'], excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'shop-clientele', name: 'Clientele',
        showIf: { attr: 'shop-type', values: ['Street Food Stall', 'Modest Eatery', 'Fine Dining', 'Dive Bar', 'Working Tavern', 'Upscale Inn'] },
        options: ['Locals', 'Travelers', 'Rough Crowd', 'High Society'], excludedItemPatterns: {}, guaranteedItems: {},
      },
      {
        id: 'shop-atmosphere', name: 'Atmosphere',
        showIf: { attr: 'shop-type', values: ['Street Food Stall', 'Modest Eatery', 'Fine Dining', 'Dive Bar', 'Working Tavern', 'Upscale Inn'] },
        options: ['Rowdy', 'Quiet', 'Festive', 'Seedy'], excludedItemPatterns: {}, guaranteedItems: { Rowdy: ['Ale'] },
      },
    ],
    // Rebuilt (v3.14, DM-directed) to match Shop's own field shape: a
    // Size field drives the item-count budget (same "Scale sets the base
    // number, other fields shift it" role Shop's Scale plays), Condition
    // and Occupied By are no longer just flavor labels -- both now
    // actually change what generateAiExplorationLoot does (see lootAi.js)
    // instead of only coloring the description. Occupied By's Guardian
    // Type sub-field is new: conditional on picking Guarded/Infested/
    // Haunted, it reuses the same 14 monsterTypes every creature entity
    // already picks from, so a guarded vault can genuinely pull in real
    // Humanoid- or Undead-tagged flavor items as part of its own loot
    // instead of Exploration and the monster side being two disconnected
    // systems.
    exploration: [
      { id: 'exploration-size', name: 'Size', options: ['Single Room', 'Small Site', 'Sprawling Complex', 'Vast Ruin'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'exploration-condition', name: 'Condition', options: ['Pristine', 'Already Looted', 'Ancient/Decayed', 'Trapped'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'exploration-occupied', name: 'Occupied By', options: ['Abandoned', 'Guarded', 'Infested', 'Haunted'], excludedItemPatterns: {}, guaranteedItems: {} },
      {
        id: 'exploration-guardian-type', name: 'Guardian Type',
        showIf: { attr: 'exploration-occupied', values: ['Guarded', 'Infested', 'Haunted'] },
        // Kept as its own literal rather than referencing monsterTypes
        // above (can't self-reference within one object literal) -- must
        // stay in sync with monsterTypes if that list ever changes.
        options: [
          'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental',
          'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead',
        ],
        excludedItemPatterns: {}, guaranteedItems: {},
      },
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
