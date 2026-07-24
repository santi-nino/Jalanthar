// Reveal has two independent tiers:
//
// 1. NAME visible — the resident's name appears on the relationship tree
//    (and in a building's resident list), but nothing else. This happens
//    the moment the DM has either (a) marked the NPC individually visible,
//    or (b) marked ANY building that lists them as a resident as revealed.
//    Residency is deliberately many-to-many — an NPC can be a resident of
//    as many buildings as the DM adds them to (e.g. someone who can be met
//    at the tavern OR the magistrate's office), and being revealed through
//    ANY one of those is enough for their name to surface. This is a purely
//    additive union across all buildings, so adding a new building for an
//    already-revealed NPC can never un-reveal them, and removing them from
//    one revealed building while they're still listed at another leaves
//    their name visible.
//
// 2. FULLY visible — the NPC's own detail page (appearance, history,
//    relationships, everything) opens. This only ever comes from the DM
//    explicitly flipping that NPC's own `visible` field. A building being
//    revealed is never enough on its own to unlock the full profile — it
//    only surfaces the name, exactly as the DM would narrate "you don't
//    know them, but a woman named X is behind the counter."
//
// The DM always sees everything at both tiers regardless of these flags.

export function isNpcNameVisible(npc, buildings, isDm) {
  if (isDm) return true
  if (npc.visible) return true
  return (buildings || []).some((b) => b.revealed && (b.residents || []).includes(npc.id))
}

export function isNpcFullyVisible(npc, isDm) {
  return isDm || !!npc.visible
}
