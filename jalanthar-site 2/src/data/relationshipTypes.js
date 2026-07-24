// The full set of relationship kinds available to the DM. Each has a
// `reciprocal` — the label that automatically appears on the OTHER person's
// page when this one is added. Most are symmetric (same label both ways);
// a few (Parent, Grandparent, Uncle, Aunt) are not, and their reciprocal
// labels (Child, Grandchild, Niece/Nephew) are system-generated only — they
// never appear in the "add relationship" picker directly.
//
// `genDelta` tells the family-tree layout how many generations apart this
// relationship implies (target's generation = this person's generation + genDelta).
// Custom DM-added types default to 0 (no generational meaning; they still
// draw a connecting line, they just don't affect the tree's row placement).

export const RELATIONSHIP_TYPES = [
  { id: 'parent', label: 'Parent', reciprocal: 'child', genDelta: -1, selectable: true },
  { id: 'child', label: 'Child', reciprocal: 'parent', genDelta: 1, selectable: false },
  { id: 'grandparent', label: 'Grandparent', reciprocal: 'grandchild', genDelta: -2, selectable: true },
  { id: 'grandchild', label: 'Grandchild', reciprocal: 'grandparent', genDelta: 2, selectable: false },
  { id: 'uncle', label: 'Uncle', reciprocal: 'niece_nephew', genDelta: -1, selectable: true },
  { id: 'aunt', label: 'Aunt', reciprocal: 'niece_nephew', genDelta: -1, selectable: true },
  { id: 'niece_nephew', label: 'Niece/Nephew', reciprocal: 'uncle', genDelta: 1, selectable: false },
  { id: 'sibling', label: 'Sibling', reciprocal: 'sibling', genDelta: 0, selectable: true },
  { id: 'cousin', label: 'Cousin', reciprocal: 'cousin', genDelta: 0, selectable: true },
  { id: 'spouse', label: 'Spouse', reciprocal: 'spouse', genDelta: 0, selectable: true },
  { id: 'partner', label: 'Partner', reciprocal: 'partner', genDelta: 0, selectable: true },
  { id: 'friend', label: 'Friend', reciprocal: 'friend', genDelta: 0, selectable: true },
  { id: 'coworker', label: 'Coworker', reciprocal: 'coworker', genDelta: 0, selectable: true },
  { id: 'rival', label: 'Rival', reciprocal: 'rival', genDelta: 0, selectable: true },
  { id: 'enemy', label: 'Enemy', reciprocal: 'enemy', genDelta: 0, selectable: true },
]

const BY_ID = Object.fromEntries(RELATIONSHIP_TYPES.map((t) => [t.id, t]))

export function getRelationshipType(id) {
  return BY_ID[id] || { id, label: id, reciprocal: id, genDelta: 0, selectable: true, custom: true }
}

export function getReciprocalTypeId(id) {
  return getRelationshipType(id).reciprocal
}

export function getLabel(id) {
  return getRelationshipType(id).label
}

export const SELECTABLE_TYPES = RELATIONSHIP_TYPES.filter((t) => t.selectable)
