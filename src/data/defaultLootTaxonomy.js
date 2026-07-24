// Default values for the Loot tab's own independent category system. This
// is deliberately NOT shared with any NPC taxonomy (species, dndClass,
// etc.) -- the DM asked for these to be a fully separate, freely-editable
// set of lists just for loot generation. Seeded here the first time, then
// lives in Firestore (collection `lootConfig`, single doc `taxonomy`) once
// the DM starts editing it.
//
// wealthLevels carries both a gp price range AND an item-count range per
// level -- wealth is the one thing that determines both what things cost
// and how many of them there are, so item count is never its own free
// input; it's rolled from whichever wealth level was picked.
//
// Per-type ATTRIBUTES (monsterTypeAttributes / locationTypeAttributes) are
// the core of "different options for different types": instead of one
// fixed set of fields for every entity/location, each type defines its
// own list of {id, name, options}. Picking "Beast" as a monster type
// swaps in Beast's own attributes (Diet, Size, Animal Kingdom) instead of
// a generic "Class" dropdown that never made sense for a wolf. Each
// option value can also carry its own `excludedCategories` -- this is
// the mechanism for "a mage wouldn't have a weapon": picking "Mage" for
// Humanoid's Role attribute can mark the Weapon category as excluded for
// that specific entity, layered on top of the coarser
// monsterTypeCategories restriction. Both layers are DM-editable and
// start empty/unconfigured for anything not seeded below -- they only
// ever narrow things down once actually set, never block by surprise.
export const DEFAULT_LOOT_TAXONOMY = {
  wealthLevels: [
    { id: 'destitute', label: 'Destitute', min: 0, max: 2, minItems: 0, maxItems: 1 },
    { id: 'poor', label: 'Poor', min: 0, max: 8, minItems: 1, maxItems: 2 },
    { id: 'modest', label: 'Modest', min: 0, max: 30, minItems: 1, maxItems: 3 },
    { id: 'comfortable', label: 'Comfortable', min: 10, max: 80, minItems: 2, maxItems: 4 },
    { id: 'wealthy', label: 'Wealthy', min: 50, max: 300, minItems: 3, maxItems: 6 },
    { id: 'aristocratic', label: 'Aristocratic', min: 200, max: 2000, minItems: 5, maxItems: 10 },
  ],

  monsterTypes: [
    'Humanoid', 'Beast', 'Undead', 'Fiend', 'Dragon', 'Construct', 'Aberration',
    'Elemental', 'Fey', 'Giant', 'Monstrosity', 'Ooze', 'Plant',
  ],

  // Coarse type-level category restriction (unchanged from before) --
  // still useful as a first, broad pass before the finer per-attribute
  // exclusions below narrow things further.
  monsterTypeCategories: {},

  // Fine per-type attribute sets. Seeded with real examples for the most
  // commonly-used types; every other type starts with none configured
  // (falls back to no extra fields beyond Wealth/Setting/Monster search
  // until the DM adds some through the taxonomy manager).
  monsterTypeAttributes: {
    Beast: [
      {
        id: 'beast-diet', name: 'Diet',
        options: ['Herbivore', 'Carnivore', 'Omnivore', 'Insectivore'],
        excludedCategories: {},
      },
      {
        id: 'beast-size', name: 'Size',
        options: ['Tiny', 'Small', 'Medium', 'Large', 'Huge'],
        excludedCategories: {},
      },
      {
        id: 'beast-kingdom', name: 'Animal Kingdom',
        options: ['Mammal', 'Reptile', 'Bird', 'Fish', 'Insect', 'Amphibian'],
        excludedCategories: {},
      },
    ],
    Humanoid: [
      {
        id: 'humanoid-role', name: 'Role',
        // Deliberately NOT the standard D&D classes -- this is how NPCs
        // and humanoid monsters get sorted for loot purposes, which is a
        // different axis entirely (a Commoner and a Noble both might be
        // "no class" mechanically but carry very different loot).
        options: [
          'Commoner', 'Laborer', 'Merchant', 'Guard/Soldier', 'Bandit/Criminal',
          'Noble', 'Scholar', 'Mage/Caster', 'Cleric/Devout', 'Traveler',
        ],
        excludedCategories: {
          // The concrete example from the request: a mage's loot
          // shouldn't default to including a weapon.
          'Mage/Caster': ['Weapon'],
        },
      },
    ],
    Undead: [
      {
        id: 'undead-origin', name: 'Origin',
        options: ['Freshly Risen', 'Ancient', 'Skeletal', 'Spectral', 'Ghoulish'],
        excludedCategories: {
          Spectral: ['Weapon', 'Armor', 'Tool'],
        },
      },
    ],
  },

  // Searchable catalog of known monster names (5e/5.5e SRD-style,
  // generic creature names -- no copyrighted stat-block text, just
  // names) -- available as an optional pick regardless of which
  // Monster Type is selected, per the request. Editable like every
  // other list here, so homebrew monsters can be added freely.
  monsterCatalog: [
    'Bandit', 'Bandit Captain', 'Cultist', 'Cult Fanatic', 'Guard', 'Knight', 'Noble',
    'Spy', 'Thug', 'Tribal Warrior', 'Acolyte', 'Commoner', 'Veteran', 'Assassin',
    'Berserker', 'Druid', 'Mage', 'Priest', 'Scout', 'Apprentice',
    'Wolf', 'Dire Wolf', 'Black Bear', 'Brown Bear', 'Giant Rat', 'Giant Spider',
    'Giant Eagle', 'Boar', 'Panther', 'Crocodile', 'Hawk', 'Mastiff',
    'Riding Horse', 'Draft Horse',
    'Skeleton', 'Zombie', 'Ghoul', 'Ghast', 'Wight', 'Wraith', 'Specter',
    'Mummy', 'Vampire Spawn',
    'Imp', 'Quasit', 'Dretch', 'Manes', 'Hell Hound',
    'Pseudodragon', 'Young Dragon (Wyrmling)',
    'Animated Armor', 'Flying Sword', 'Homunculus', 'Clay Golem', 'Stone Golem',
    'Gibbering Mouther', 'Grell', 'Otyugh',
    'Fire Elemental', 'Water Elemental', 'Earth Elemental', 'Air Elemental',
    'Magmin', 'Steam Mephit',
    'Pixie', 'Sprite', 'Satyr', 'Dryad', 'Blink Dog',
    'Hill Giant', 'Stone Giant', 'Frost Giant', 'Ogre', 'Fire Giant',
    'Owlbear', 'Manticore', 'Displacer Beast', 'Chimera', 'Basilisk', 'Griffon',
    'Gelatinous Cube', 'Black Pudding', 'Ochre Jelly',
    'Shambling Mound', 'Awakened Shrub', 'Awakened Tree', 'Vine Blight', 'Twig Blight',
  ],

  settings: [
    'Jungle', 'Mountain', 'Town', 'City', 'Forest', 'Swamp', 'Coast', 'Desert',
    'Underdark', 'Ruins', 'Road', 'Riverside',
  ],

  shopTypes: ['General Store', 'Blacksmith', 'Apothecary', 'Jeweler', 'Bookshop', 'Tailor', 'Magic Shop'],
  restaurantTypes: ['Street Food Stall', 'Modest Eatery', 'Fine Dining'],
  tavernTypes: ['Dive Bar', 'Working Tavern', 'Upscale Inn'],
  explorationTypes: ['Dungeon', 'Ruins', 'Cave', 'Battlefield', 'Shipwreck', 'Tomb', 'Abandoned Camp'],

  // Same attribute-set mechanism as monsterTypeAttributes, one set per
  // location type -- this is what "more options for shop/restaurant/
  // tavern/exploration" actually is: real, DM-editable fields, not a
  // fixed extra dropdown or two.
  locationTypeAttributes: {
    shop: [
      {
        id: 'shop-specialty', name: 'Specialty',
        options: ['General Goods', 'Weapons Focus', 'Armor Focus', 'Alchemy Focus', 'Luxury Goods', 'Tools & Trade'],
        excludedCategories: {},
      },
      {
        id: 'shop-scale', name: 'Scale',
        options: ['Market Stall', 'Modest Shop', 'Large Emporium'],
        excludedCategories: {},
      },
      {
        id: 'shop-reputation', name: 'Reputation',
        options: ['Shady', 'Modest', 'Reputable', 'Prestigious'],
        excludedCategories: {},
      },
    ],
    restaurant: [
      {
        id: 'restaurant-cuisine', name: 'Cuisine Style',
        options: ['Home-style', 'Regional Specialty', 'Exotic/Imported', 'Street Food'],
        excludedCategories: {},
      },
      {
        id: 'restaurant-reputation', name: 'Reputation',
        options: ['Rough', 'Modest', 'Reputable', 'Prestigious'],
        excludedCategories: {},
      },
    ],
    tavern: [
      {
        id: 'tavern-clientele', name: 'Clientele',
        options: ['Locals', 'Travelers', 'Rough Crowd', 'High Society'],
        excludedCategories: {},
      },
      {
        id: 'tavern-atmosphere', name: 'Atmosphere',
        options: ['Rowdy', 'Quiet', 'Festive', 'Seedy'],
        excludedCategories: {},
      },
    ],
    exploration: [
      {
        id: 'exploration-condition', name: 'Condition',
        options: ['Pristine', 'Already Looted', 'Ancient/Decayed', 'Trapped'],
        excludedCategories: {},
      },
      {
        id: 'exploration-occupied', name: 'Occupied By',
        options: ['Abandoned', 'Guarded', 'Infested', 'Haunted'],
        excludedCategories: {},
      },
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
// vehicles. Loot generation excludes these by default -- per-generation,
// there's an explicit "Include vehicles & mounts" opt-in checkbox rather
// than a global setting, since whether a horse makes sense as loot is a
// per-roll judgment call, not a permanent site setting.
export const VEHICLE_CATEGORIES = ['Mount', 'Vehicle']
