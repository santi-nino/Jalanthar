// Default values for the Loot tab's own independent category system. This
// is deliberately NOT shared with any NPC taxonomy (species, dndClass,
// etc.) — the DM asked for these to be a fully separate, freely-editable
// set of lists just for loot generation. Seeded here the first time, then
// lives in Firestore (collection `lootConfig`, single doc `taxonomy`) once
// the DM starts editing it.
//
// wealthLevels carries a min/max gp range per level — that's the actual
// mechanical lever that picks a price band out of the real item catalog
// (SRD + uploaded sources). Everything else (classes, monsterTypes,
// settings, and the four location subtype lists) are organizing/flavor
// tags — the underlying item catalog has no monster-type or setting
// metadata to filter against, so these drive the UI and get attached to
// results for the DM's own reference rather than mechanically filtering
// which items can appear.
export const DEFAULT_LOOT_TAXONOMY = {
  wealthLevels: [
    { id: 'destitute', label: 'Destitute', min: 0, max: 2 },
    { id: 'poor', label: 'Poor', min: 0, max: 8 },
    { id: 'modest', label: 'Modest', min: 0, max: 30 },
    { id: 'comfortable', label: 'Comfortable', min: 10, max: 80 },
    { id: 'wealthy', label: 'Wealthy', min: 50, max: 300 },
    { id: 'aristocratic', label: 'Aristocratic', min: 200, max: 2000 },
  ],
  classes: ['Commoner', 'Fighter', 'Caster', 'Rogue', 'Cleric', 'Ranger', 'Barbarian', 'Bard'],
  monsterTypes: [
    'Humanoid', 'Beast', 'Undead', 'Fiend', 'Dragon', 'Construct', 'Aberration',
    'Elemental', 'Fey', 'Giant', 'Monstrosity', 'Ooze', 'Plant',
  ],
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
