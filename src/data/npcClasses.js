// The "Class" field isn't a strict D&D mechanical class (most townsfolk are
// commoners) — it's a rough occupational archetype, useful for browsing the
// Roster by "who's a Caster vs. who's Clergy vs. who's a Criminal." Kept as
// a fixed list (not free text) because it's meant to stay small and
// meaningful as a filter — a free-text field here would fragment into
// dozens of one-off values the way `job` does.
export const NPC_CLASSES = [
  'Caster',
  'Fighter',
  'Hunter',
  'Laborer',
  'Craftsman',
  'Merchant',
  'Clergy',
  'Criminal',
  'Misc',
]
