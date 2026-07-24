import { SRD_MONSTERS } from './srdMonsters'

// Default values for the Loot tab's own independent category system. This
// is deliberately NOT shared with any NPC taxonomy (species, dndClass,
// etc.) -- kept fully separate per the DM's request. Seeded here the
// first time, then lives in Firestore (collection `lootConfig`, single
// doc `taxonomy`) once the DM starts editing it.
//
// wealthLevels carries both a gp price range AND an item-count range per
// level -- item count is always rolled from wealth, never its own input.
//
// Per-type ATTRIBUTES (monsterTypeAttributes / locationTypeAttributes)
// are the core of "different options for different types": each type
// defines its own list of {id, name, options, excludedItemPatterns,
// guaranteedItems}. Picking "Beast" swaps in Beast's own fields (Diet,
// Size, Animal Kingdom) instead of a generic Class dropdown.
//
// excludedItemPatterns is intentionally ITEM-NAME-LEVEL, not
// category-level: excluding the whole "Weapon" category for a mage
// would also block daggers and staves that are perfectly reasonable.
// Instead, an option can list specific name substrings (e.g. "Sword")
// that get excluded case-insensitively -- "a mage wouldn't have a
// sword," not "a mage wouldn't have anything tagged Weapon."
// monsterTypeCategories (below) is a separate, coarser layer that still
// operates at the category level for a broad first pass; the two stack.
//
// guaranteedItems (per option, plus monsterTypeGuaranteedItems /
// locationTypeGuaranteedItems at the type level) is the OPPOSITE of
// exclusion -- these are baseline items that always appear regardless of
// the random draw ("most people would have shoes"), resolved separately
// from the item-count roll rather than competing with it for a slot.
export const DEFAULT_LOOT_TAXONOMY = {
  // goldMin/goldMax follow the same "wealth determines everything, no
  // separate free input" rule as item count -- coin gets rolled from the
  // same wealth pick, not a standalone gold field. Destitute's minItems
  // is 1, not 0: even the most destitute bandit has at least one
  // pathetic possession, rather than sometimes generating nothing at all.
  wealthLevels: [
    { id: 'destitute', label: 'Destitute', min: 0, max: 2, minItems: 1, maxItems: 2, goldMin: 0, goldMax: 3 },
    { id: 'poor', label: 'Poor', min: 0, max: 8, minItems: 1, maxItems: 3, goldMin: 1, goldMax: 10 },
    { id: 'modest', label: 'Modest', min: 0, max: 30, minItems: 2, maxItems: 4, goldMin: 5, goldMax: 30 },
    { id: 'comfortable', label: 'Comfortable', min: 10, max: 80, minItems: 3, maxItems: 5, goldMin: 15, goldMax: 75 },
    { id: 'wealthy', label: 'Wealthy', min: 50, max: 300, minItems: 3, maxItems: 6, goldMin: 50, goldMax: 250 },
    { id: 'aristocratic', label: 'Aristocratic', min: 200, max: 2000, minItems: 5, maxItems: 10, goldMin: 200, goldMax: 1500 },
  ],

  // The 14 official 5e/5.5e creature types -- matches SRD_MONSTERS'
  // `type` field exactly, so a specific monster pick can auto-select
  // the right type here.
  monsterTypes: [
    'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental',
    'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead',
  ],

  // Coarse type-level category restriction -- a broad first pass before
  // the finer per-option item-pattern exclusions narrow things further.
  // Coarse type-level category restriction -- a broad first pass before
  // the finer per-option item-pattern exclusions narrow things further.
  // An EXPLICIT empty array here means "this type carries nothing from
  // the manufactured-goods catalog" -- not "unrestricted." Most creature
  // types genuinely shouldn't be pulling from a shopkeeper's item
  // catalog at all (a wolf doesn't carry a crowbar); only the
  // people-like/civilized types get real access by default. A key
  // that's absent entirely (rather than present-as-empty) means
  // unrestricted -- that distinction matters and is preserved through
  // the generation logic, not just this list.
  monsterTypeCategories: {
    Aberration: [],
    Beast: [],
    Celestial: ['Focus'],
    Construct: [],
    Dragon: ['Focus'],
    Elemental: [],
    Fey: ['Focus'],
    // Fiend, Giant, Humanoid, Undead: no entry -- unrestricted, these are
    // all sapient-enough or civilized-enough to plausibly carry a
    // shopkeeper's kind of gear.
    Monstrosity: [],
    Ooze: [],
    Plant: [],
  },

  // Type-level guaranteed baseline items -- always included for every
  // entity of this type, regardless of which options are picked.
  monsterTypeGuaranteedItems: {
    Humanoid: ['Boots', 'Clothes'],
  },

  monsterTypeAttributes: {
    Aberration: [
      { id: 'aberration-origin', name: 'Origin', options: ['Far Realm', 'Aquatic Deep', 'Subterranean', 'Mutated'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'aberration-communication', name: 'Communication', options: ['Telepathic', 'Vocal', 'None'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Beast: [
      { id: 'beast-diet', name: 'Diet', options: ['Herbivore', 'Carnivore', 'Omnivore', 'Insectivore'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'beast-size', name: 'Size', options: ['Tiny', 'Small', 'Medium', 'Large', 'Huge'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'beast-kingdom', name: 'Animal Kingdom', options: ['Mammal', 'Reptile', 'Bird', 'Fish', 'Insect', 'Amphibian'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Celestial: [
      { id: 'celestial-origin', name: 'Origin', options: ['Upper Planes', 'Divine Servant', 'Guardian Spirit'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'celestial-rank', name: 'Rank', options: ['Messenger', 'Guardian', 'Named/Unique'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Construct: [
      { id: 'construct-material', name: 'Material', options: ['Stone', 'Metal', 'Wood', 'Clay', 'Flesh (Reanimated)'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'construct-purpose', name: 'Purpose', options: ['Guardian', 'Laborer', 'Weapon', 'Servant'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Dragon: [
      { id: 'dragon-age', name: 'Age Category', options: ['Wyrmling', 'Young', 'Adult', 'Ancient'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'dragon-lineage', name: 'Lineage', options: ['Chromatic', 'Metallic', 'Gem', 'Other'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Elemental: [
      { id: 'elemental-element', name: 'Element', options: ['Fire', 'Water', 'Air', 'Earth'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'elemental-origin', name: 'Origin', options: ['Elemental Plane', 'Summoned', 'Genie-kin'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Fey: [
      { id: 'fey-court', name: 'Court', options: ['Seelie/Summer', 'Unseelie/Winter', 'Wild/Unaligned'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'fey-temperament', name: 'Temperament', options: ['Mischievous', 'Benevolent', 'Malicious'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Fiend: [
      { id: 'fiend-origin', name: 'Origin', options: ['Devil (Lawful)', 'Demon (Chaotic)', 'Yugoloth (Neutral)', 'Other'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'fiend-rank', name: 'Rank', options: ['Lesser', 'Greater', 'Named/Unique'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    Giant: [
      { id: 'giant-kind', name: 'Giant Kind', options: ['Hill', 'Stone', 'Frost', 'Fire', 'Cloud', 'Storm'], excludedItemPatterns: {}, guaranteedItems: {} },
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
          'Mage/Caster': ['Component Pouch'],
          'Guard/Soldier': ['Shield'],
          'Bandit/Criminal': ['Dagger'],
          'Noble': ['Signet'],
          'Merchant': ['Ledger'],
          'Scholar': ['Ink'],
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
        guaranteedItems: {},
      },
      { id: 'undead-sentience', name: 'Sentience', options: ['Mindless', 'Malevolent Intelligence', 'Tragic Remnant'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
  },

  // Searchable catalog of real monster names, sizes, types, and
  // alignments, extracted directly from the official SRD 5.2.1 -- see
  // src/data/srdMonsters.js for the full list and required attribution.
  // Picking one of these auto-fills Monster Type from its real type.
  monsterCatalog: SRD_MONSTERS,

  settings: [
    'Jungle', 'Mountain', 'Town', 'City', 'Forest', 'Swamp', 'Coast', 'Desert',
    'Underdark', 'Ruins', 'Road', 'Riverside',
  ],

  shopTypes: ['General Store', 'Blacksmith', 'Apothecary', 'Jeweler', 'Bookshop', 'Tailor', 'Magic Shop'],
  restaurantTypes: ['Street Food Stall', 'Modest Eatery', 'Fine Dining'],
  tavernTypes: ['Dive Bar', 'Working Tavern', 'Upscale Inn'],
  explorationTypes: ['Dungeon', 'Ruins', 'Cave', 'Battlefield', 'Shipwreck', 'Tomb', 'Abandoned Camp'],

  locationTypeGuaranteedItems: {},

  // Same attribute-set mechanism as monsterTypeAttributes, one set per
  // location type -- real, DM-editable fields per Shop/Restaurant/
  // Tavern/Exploration, not a fixed extra dropdown or two.
  locationTypeAttributes: {
    shop: [
      { id: 'shop-specialty', name: 'Specialty', options: ['General Goods', 'Weapons Focus', 'Armor Focus', 'Alchemy Focus', 'Luxury Goods', 'Tools & Trade'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'shop-scale', name: 'Scale', options: ['Market Stall', 'Modest Shop', 'Large Emporium'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'shop-reputation', name: 'Reputation', options: ['Shady', 'Modest', 'Reputable', 'Prestigious'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    restaurant: [
      { id: 'restaurant-cuisine', name: 'Cuisine Style', options: ['Home-style', 'Regional Specialty', 'Exotic/Imported', 'Street Food'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'restaurant-reputation', name: 'Reputation', options: ['Rough', 'Modest', 'Reputable', 'Prestigious'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
    tavern: [
      { id: 'tavern-clientele', name: 'Clientele', options: ['Locals', 'Travelers', 'Rough Crowd', 'High Society'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'tavern-atmosphere', name: 'Atmosphere', options: ['Rowdy', 'Quiet', 'Festive', 'Seedy'], excludedItemPatterns: {}, guaranteedItems: { Rowdy: ['Ale'] } },
    ],
    exploration: [
      { id: 'exploration-condition', name: 'Condition', options: ['Pristine', 'Already Looted', 'Ancient/Decayed', 'Trapped'], excludedItemPatterns: {}, guaranteedItems: {} },
      { id: 'exploration-occupied', name: 'Occupied By', options: ['Abandoned', 'Guarded', 'Infested', 'Haunted'], excludedItemPatterns: {}, guaranteedItems: {} },
    ],
  },
}

// Which taxonomy key backs each location subtype's "subsequent choice"
// dropdown, and the friendly label for that dropdown.
export const LOCATION_TYPES = [
  { id: 'shop', label: 'Shop', taxonomyKey: 'shopTypes', commerce: true },
  { id: 'restaurant', label: 'Restaurant', taxonomyKey: 'restaurantTypes', commerce: true },
  { id: 'tavern', label: 'Tavern', taxonomyKey: 'tavernTypes', commerce: true },
  { id: 'exploration', label: 'Exploration', taxonomyKey: 'explorationTypes', commerce: false },
]

// Exact SRD category names (see src/data/dnd5eItems.js) for mounts and
// vehicles. Loot generation excludes these by default -- an explicit
// "Include vehicles & mounts" opt-in checkbox exists per-generation.
export const VEHICLE_CATEGORIES = ['Mount', 'Vehicle']
