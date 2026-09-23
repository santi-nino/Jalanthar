// The full set of relationship kinds available on the Pantheon tab. Same
// `reciprocal`/`genDelta`/`selectable` field shape as relationshipTypes.js
// (the NPC family tree) purely for consistency's sake -- the Pantheon tab
// does NOT reuse RelationshipTab's layout code or its rules (no collapsing,
// no cluster-anchor dragging, no jittered scatter; see PantheonTab.jsx for
// the tab's own, much more restrained layout and drag behavior). `genDelta`
// is still used for the one thing it's genuinely useful for here: placing
// a deity's parent/patron a row above them when both sides of that edge
// belong to the same pantheon.
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

// Per-pantheon color identity for the Pantheon tab. This is the ONLY way a
// deity card signals which pantheon it belongs to (there's deliberately no
// grouping box, cluster, or collapsible header anymore -- see PantheonTab
// for why). Picked to stay inside the site's muted, leather-bound palette
// rather than reaching for saturated/neon colors: each pantheon reads as a
// distinct material or dye a scribe of this world could actually reach
// for (Elven = a green ink on parchment, Dwarven = worked slate/asphalt,
// Orc = dried blood/rust, and so on). `dark: true` means the swatch is
// dark enough that card text needs to render in parchment, not ink.
export const PANTHEON_STYLES = {
  'Faerûnian': { bg: '#E8D9A0', border: '#8C6D1F', text: '#14120D', dark: false },
  'Elven (Seldarine)': { bg: '#D9E2C4', border: '#5C6B34', text: '#14120D', dark: false },
  'Drow (Dark Seldarine)': { bg: '#332B44', border: '#6B4A8C', text: '#DCD3B4', dark: true },
  'Dwarven (Morndinsamman)': { bg: '#5A6068', border: '#2E3136', text: '#DCD3B4', dark: true },
  'Orc': { bg: '#6E4536', border: '#3A241C', text: '#DCD3B4', dark: true },
  'Gnomish': { bg: '#C79A55', border: '#7A5426', text: '#14120D', dark: false },
  'Halfling (Yondalla\'s Children)': { bg: '#D9C08A', border: '#8C6D3A', text: '#14120D', dark: false },
  'Regional (Chult)': { bg: '#33503B', border: '#1E3324', text: '#DCD3B4', dark: true },
  'Uthgardt': { bg: '#8C6F4E', border: '#5A4630', text: '#14120D', dark: false },
}

export function getPantheonStyle(pantheon) {
  return PANTHEON_STYLES[pantheon] || PANTHEON_STYLES['Faerûnian']
}
