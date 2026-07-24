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
  // Category names prefixed "Source: X (Category)" match a specific
  // uploaded source's derived category label exactly -- see
  // utils/itemPool.js. These four reference the DM-editable "Hunter's &
  // Trapper's Price Guide" source (seeded by default, same editable
  // shape as any scanned-in source) that supplies exactly the kind of
  // loot these types SHOULD have: hunting trophies, pelts, horns, wings,
  // hearts, fangs, claws, scales, rations, and (for Construct) salvaged
  // parts -- instead of shop goods a wolf or a golem has no business
  // carrying.
  monsterTypeCategories: {
    Aberration: [],
    Beast: [
      "Source: Hunter's & Trapper's Price Guide (Trophy)",
      "Source: Hunter's & Trapper's Price Guide (Pelt)",
      "Source: Hunter's & Trapper's Price Guide (Horn)",
      "Source: Hunter's & Trapper's Price Guide (Wing)",
      "Source: Hunter's & Trapper's Price Guide (Fang)",
      "Source: Hunter's & Trapper's Price Guide (Claw)",
      "Source: Hunter's & Trapper's Price Guide (Scale)",
      "Source: Hunter's & Trapper's Price Guide (Ration)",
    ],
    Celestial: ['Focus'],
    Construct: ["Source: Hunter's & Trapper's Price Guide (Salvage)"],
    Dragon: [
      'Focus',
      "Source: Hunter's & Trapper's Price Guide (Horn)",
      "Source: Hunter's & Trapper's Price Guide (Wing)",
      "Source: Hunter's & Trapper's Price Guide (Heart)",
      "Source: Hunter's & Trapper's Price Guide (Fang)",
      "Source: Hunter's & Trapper's Price Guide (Claw)",
      "Source: Hunter's & Trapper's Price Guide (Scale)",
    ],
    Elemental: [],
    Fey: ['Focus'],
    // Fiend, Giant, Humanoid, Undead: no entry -- unrestricted, all
    // sapient-enough or civilized-enough to plausibly carry a
    // shopkeeper's kind of gear.
    Monstrosity: [
      "Source: Hunter's & Trapper's Price Guide (Trophy)",
      "Source: Hunter's & Trapper's Price Guide (Pelt)",
      "Source: Hunter's & Trapper's Price Guide (Horn)",
      "Source: Hunter's & Trapper's Price Guide (Wing)",
      "Source: Hunter's & Trapper's Price Guide (Heart)",
      "Source: Hunter's & Trapper's Price Guide (Fang)",
      "Source: Hunter's & Trapper's Price Guide (Claw)",
      "Source: Hunter's & Trapper's Price Guide (Scale)",
    ],
    Ooze: [],
    Plant: [],
  },

  // Whether Wealth applies at all for this type. Only genuinely
  // "economic" creatures get it -- a dragon hoards gold, a bandit has a
  // coin purse, a wild beast or an ooze has neither concept. Any type
  // absent from this map defaults to NOT using wealth (matching the
  // request that this should be an opt-in list, not opt-out).
  // For Humanoid/Fiend/Giant/Celestial/Undead/Dragon this is literal
  // economic status. For Beast/Monstrosity/Construct it's the same
  // mechanism reinterpreted -- not "how rich is this wolf" but "how much
  // does this kill yield": a Wealthy-tier Beast roll leans toward
  // pristine, valuable trophies; Destitute leans toward a scrap of pelt
  // and not much else. Same lever, different in-fiction meaning.
  monsterTypeUsesWealth: {
    Humanoid: true,
    Fiend: true,
    Giant: true,
    Celestial: true,
    Undead: true,
    Dragon: true,
    Beast: true,
    Monstrosity: true,
    Construct: true,
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
      {
        id: 'celestial-rank', name: 'Rank',
        options: ['Messenger', 'Guardian', 'Named/Unique'],
        excludedItemPatterns: {},
        guaranteedItems: { Guardian: ['Shield'] },
      },
    ],
    Construct: [
      { id: 'construct-material', name: 'Material', options: ['Stone', 'Metal', 'Wood', 'Clay', 'Flesh (Reanimated)'], excludedItemPatterns: {}, guaranteedItems: {} },
      {
        id: 'construct-purpose', name: 'Purpose',
        options: ['Guardian', 'Laborer', 'Weapon', 'Servant'],
        excludedItemPatterns: {},
        guaranteedItems: { Guardian: ['Shield'], Laborer: ['Tools'] },
      },
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
          'Mage/Caster': ['Component Pouch'],
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
