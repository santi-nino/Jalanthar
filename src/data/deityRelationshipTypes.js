// The full set of relationship kinds available on the Pantheon tab,
// mirroring relationshipTypes.js's structure for the NPC family tree --
// same `reciprocal`/`genDelta`/`selectable` contract, so PantheonTab.jsx
// can reuse the same union-find/generation-layout approach RelationshipTab
// already proved out, rather than inventing a second system.
//
// Nine distinct kinds, each with its own edge appearance (see
// DEITY_EDGE_STYLE in PantheonTab.jsx):
//   parent/child   -- solid black line, lineage
//   sibling        -- dotted gray line
//   spouse         -- solid rose line, "♥" label
//   ally           -- green dashed line
//   enemy          -- red dashed line
//   killed/killed_by       -- solid red line, skull label + the event
//   absorbed/absorbed_by   -- purple dotted line, "portfolio absorbed"
//   subordinate_to/patron_of -- solid gray line, "patron of"
//   overlap        -- orange dotted line, no direction, "shared domain"
//
// `killed`, `absorbed`, and `subordinate_to` are directional and carry a
// specific real-world meaning (who did what to whom), so unlike the
// symmetric types their reciprocal is a DIFFERENT id, not itself --
// exactly the same pattern parent/child already uses below.
export const DEITY_RELATIONSHIP_TYPES = [
  { id: 'parent', label: 'Parent', reciprocal: 'child', genDelta: -1, selectable: true },
  { id: 'child', label: 'Child', reciprocal: 'parent', genDelta: 1, selectable: false },
  { id: 'sibling', label: 'Sibling', reciprocal: 'sibling', genDelta: 0, selectable: true },
  { id: 'spouse', label: 'Spouse/Consort', reciprocal: 'spouse', genDelta: 0, selectable: true },
  { id: 'ally', label: 'Ally', reciprocal: 'ally', genDelta: 0, selectable: true },
  { id: 'enemy', label: 'Enemy', reciprocal: 'enemy', genDelta: 0, selectable: true },
  { id: 'killed', label: 'Killed', reciprocal: 'killed_by', genDelta: 0, selectable: true },
  { id: 'killed_by', label: 'Killed by', reciprocal: 'killed', genDelta: 0, selectable: false },
  { id: 'absorbed', label: 'Absorbed portfolio of', reciprocal: 'absorbed_by', genDelta: 0, selectable: true },
  { id: 'absorbed_by', label: 'Portfolio absorbed by', reciprocal: 'absorbed', genDelta: 0, selectable: false },
  { id: 'subordinate_to', label: 'Subordinate/created by', reciprocal: 'patron_of', genDelta: -1, selectable: true },
  { id: 'patron_of', label: 'Patron of', reciprocal: 'subordinate_to', genDelta: 1, selectable: false },
  { id: 'overlap', label: 'Overlapping domain', reciprocal: 'overlap', genDelta: 0, selectable: true },
]

const BY_ID = Object.fromEntries(DEITY_RELATIONSHIP_TYPES.map((t) => [t.id, t]))

export function getDeityRelationshipType(id) {
  return BY_ID[id] || { id, label: id, reciprocal: id, genDelta: 0, selectable: true, custom: true }
}

export function getDeityReciprocalTypeId(id) {
  return getDeityRelationshipType(id).reciprocal
}

export function getDeityRelationshipLabel(id) {
  return getDeityRelationshipType(id).label
}

export const SELECTABLE_DEITY_RELATIONSHIP_TYPES = DEITY_RELATIONSHIP_TYPES.filter((t) => t.selectable)

// The closed set of pantheons a deity can belong to -- shown as a filter
// and as a grouping key for the tab's cluster layout. "Uthgardt" covers
// Uthgar and any campaign-specific demigod branch off of him (e.g. Ragna).
export const PANTHEONS = [
  'Faerûnian',
  'Elven (Seldarine)',
  'Drow (Dark Seldarine)',
  'Dwarven (Morndinsamman)',
  'Orc',
  'Gnomish',
  'Halfling (Yondalla\'s Children)',
  'Regional (Chult)',
  'Uthgardt',
]
