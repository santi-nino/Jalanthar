// Bumped by hand with every zip delivered — shown at the bottom of the DM
// sidebar so it's possible to visually confirm a deploy actually picked up
// the latest code, independent of whether the underlying DATA (buildings,
// NPCs, sources) has also been reseeded. Code and data are two separate
// deploy steps; this only speaks to the former.
export const BUILD_VERSION = 'Version 3.4 — Humanoid now routes through the Loadout System (14 roles, 4 new: Artisan/Craftsman, Sailor/Dockhand, Entertainer, Farmer/Herder), reusing the existing Wealth field as the rank input instead of a new field; added a Subrole field (conditional on Role, e.g. Guard/Soldier -> Archer/Swordsman/Spearman/Cavalry) that narrows weapon + flavor item selection within the Role\'s own loadout without changing the rest of it; added a generic Tool loadout pool; fixed a Fey/Humanoid "Noble" loadout key collision caught during this build'
