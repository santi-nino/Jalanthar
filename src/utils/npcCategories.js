// Bucketing helpers for the searchable/categorizable resident roster.
//
// Every category beyond Name/Family/Location sits behind the SAME "fully
// visible" gate as the detail page itself — species, gender, class, job,
// and age range are all things you'd only know from having actually met
// someone, not from merely knowing their name. A name-only resident (see
// utils/visibility.js) collapses into the "Unknown" bucket for all of
// those, so grouping by e.g. Species never becomes a side channel for
// guessing who's what before the DM has revealed them.

export const UNKNOWN_BUCKET = 'Unknown'

export function ageRangeLabel(age) {
  const n = Number(age)
  if (age === '' || age == null || Number.isNaN(n)) return UNKNOWN_BUCKET
  if (n < 13) return 'Child (0–12)'
  if (n < 18) return 'Adolescent (13–17)'
  if (n < 60) return 'Adult (18–59)'
  return 'Elder (60+)'
}

// `ctx` is per-NPC context computed by the tab: { fullyVisible, locations }
// — `locations` is already restricted to only what a name-only resident's
// reveal reason justifies (see ResidentListTab), so location categorization
// needs no extra gating here.
export const RESIDENT_CATEGORIES = [
  { id: 'none', label: 'No Categories' },
  {
    id: 'family',
    label: 'Family',
    getBuckets: (npc) => [npc.familyName || 'No Family'],
  },
  {
    id: 'location',
    label: 'Location',
    getBuckets: (npc, ctx) => (ctx.locations.length ? ctx.locations : ['No Known Location']),
  },
  {
    id: 'species',
    label: 'Species',
    getBuckets: (npc, ctx) => [ctx.fullyVisible ? npc.species || UNKNOWN_BUCKET : UNKNOWN_BUCKET],
  },
  {
    id: 'gender',
    label: 'Gender',
    getBuckets: (npc, ctx) => [ctx.fullyVisible ? npc.gender || UNKNOWN_BUCKET : UNKNOWN_BUCKET],
  },
  {
    id: 'class',
    label: 'Class',
    getBuckets: (npc, ctx) => [ctx.fullyVisible ? npc.dndClass || UNKNOWN_BUCKET : UNKNOWN_BUCKET],
  },
  {
    id: 'job',
    label: 'Job',
    getBuckets: (npc, ctx) => [ctx.fullyVisible ? npc.job || UNKNOWN_BUCKET : UNKNOWN_BUCKET],
  },
  {
    id: 'ageRange',
    label: 'Age Range',
    getBuckets: (npc, ctx) => [ctx.fullyVisible ? ageRangeLabel(npc.age) : UNKNOWN_BUCKET],
  },
]

export function getCategory(id) {
  return RESIDENT_CATEGORIES.find((c) => c.id === id) || RESIDENT_CATEGORIES[0]
}
