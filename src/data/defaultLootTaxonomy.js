// Default values for the Loot tab's own independent category system. This
// is deliberately NOT shared with any NPC taxonomy (species, dndClass,
// etc.) — the DM asked for these to be a fully separate, freely-editable
// set of lists just for loot generation. Seeded here the first time, then
// lives in Firestore (collection `lootConfig`, single doc `taxonomy`) once
// the DM starts editing it.
//
// wealthLevels carries both a gp price range AND an item-count range per
// level — wealth is the one thing that determines both what things cost
// and how many of them there are, so item count is never its own free
// input; it's rolled from whichever wealth level was picked.
//
// monsterTypeCategories maps a monster type name to the specific item
// categories that make sense for it (e.g. "Undead" might only ever carry
// Curiosities and Jewelry, never Tools) — populated by the DM through the
// taxonomy manager, since the underlying item catalog has no such tagging
// on its own. An empty/missing entry means "no restriction, show
// everything available" so this is purely additive and never blocks
// anything until the DM actually configures it.
export const DEFAULT_LOOT_TAXONOMY = {
  wealthLevels: [
    { id: 'destitute', label: 'Destitute', min: 0, max: 2, minItems: 0, maxItems: 1 },
    { id: 'poor', label: 'Poor', min: 0, max: 8, minItems: 1, maxItems: 2 },
    { id: 'modest', label: 'Modest', min: 0, max: 30, minItems: 1, maxItems: 3 },
    { id: 'comfortable', label: 'Comfortable', min: 10, max: 80, minItems: 2, maxItems: 4 },
    { id: 'wealthy', label: 'Wealthy', min: 50, max: 300, minItems: 3, maxItems: 6 },
    { id: 'aristocratic', label: 'Aristocratic', min: 200, max: 2000, minItems: 5, maxItems: 10 },
  ],
  classes: ['Commoner', 'Fighter', 'Caster', 'Rogue', 'Cleric', 'Ranger', 'Barbarian', 'Bard'],
  monsterTypes: [
    'Humanoid', 'Beast', 'Undead', 'Fiend', 'Dragon', 'Construct', 'Aberration',
    'Elemental', 'Fey', 'Giant', 'Monstrosity', 'Ooze', 'Plant',
  ],
  monsterTypeCategories: {},
  settings: [
    'Jungle', 'Mountain', 'Town', 'City', 'Forest', 'Swamp', 'Coast', 'Desert',
    'Underdark', 'Ruins', 'Road', 'Riverside',
  ],
  shopTypes: ['General Store', 'Blacksmith', 'Apothecary', 'Jeweler', 'Bookshop', 'Tailor', 'Magic Shop'],
  restaurantTypes: ['Street Food Stall', 'Modest Eatery', 'Fine Dining'],
  tavernTypes: ['Dive Bar', 'Working Tavern', 'Upscale Inn'],
  explorationTypes: ['Dungeon', 'Ruins', 'Cave', 'Battlefield', 'Shipwreck', 'Tomb', 'Abandoned Camp'],
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
// vehicles. Loot generation excludes these by default — per-generation,
// there's an explicit "Include vehicles & mounts" opt-in checkbox rather
// than a global setting, since whether a horse makes sense as loot is a
// per-roll judgment call, not a permanent site setting.
export const VEHICLE_CATEGORIES = ['Mount', 'Vehicle']
