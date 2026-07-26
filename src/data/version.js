// VERSION_HISTORY replaces the old single always-visible BUILD_VERSION
// string -- that string used to render in full underneath the sidebar
// every single time, which ate up a chunk of permanent vertical space for
// changelog text nobody was reading day to day. Now the sidebar shows
// just the current version NUMBER (see CURRENT_VERSION below), and
// clicking it opens VersionHistoryModal with the full list. Newest entry
// first. Only entries whose exact changelog text survived in context got
// backfilled here when this switched over (starting at 3.1) -- earlier
// versions (up through 3.0) existed but their exact wording wasn't
// preserved, so this history is deliberately NOT a complete record of
// every version ever shipped, just everything from 3.1 onward.
export const VERSION_HISTORY = [
  {
    version: '3.6',
    notes: 'Weapon/Armor/Ammunition +1/+2/+3 expanded from generic unusable placeholders ("Weapon, +1") into one real instance per SRD weapon/armor/ammo type (36 weapons, 12 armors, 5 ammo types, all 3 tiers each -- Shield stays generic since the SRD only has one Shield item) -- also made these newly-named magic weapons reachable from Humanoid’s Guard/Soldier magic-weapon slot with matching subrole tags. Fixed the real bug behind Owlbear (and any Monstrosity/Ooze/Plant/Undead) always getting 1-2 anatomically-wrong items: those types have no kind-bucketed system, so AI-assist never even ran for them -- added a new "discretion mode" that kicks in whenever a real catalog monster is picked from the Specific Monster dropdown, giving the AI a size-based ballpark instead of the flat draw’s hardcoded 1-2 item count.',
  },
  {
    version: '3.5',
    notes: 'Sidebar version text collapsed into a click-to-open History popup instead of always-on space; Humanoid loadouts reworked for reliable variety (new Personal Effects pool, non-zero minimums on Supplementary/Junk/Personal Effects at every wealth tier); removed the per-monster-type Category Restriction editor entirely (cluttered, largely unused now that most types route through their own kind-bucketed/Loadout systems); AI loot-assist prompt now explicitly excludes anatomically-wrong pool items for a named creature, not just invented ones; full item-tagging completeness pass across every source.',
  },
  {
    version: '3.4',
    notes: 'Humanoid now routes through the Loadout System (14 roles, 4 new: Artisan/Craftsman, Sailor/Dockhand, Entertainer, Farmer/Herder), reusing the existing Wealth field as the rank input instead of a new field; added a Subrole field (conditional on Role, e.g. Guard/Soldier -> Archer/Swordsman/Spearman/Cavalry) that narrows weapon + flavor item selection within the Role’s own loadout without changing the rest of it; added a generic Tool loadout pool; fixed a Fey/Humanoid "Noble" loadout key collision caught during this build.',
  },
  {
    version: '3.3',
    notes: 'Giant rebuilt: Kind is now a real theming dimension, Role (conditional on Kind) routes through the Loadout System, Wealth field removed in favor of per-role goldByRank; new Setting side-loadout system adds tier-scaled, type-appropriate supplementary gear to Beast/Dragon/Elemental (City + Mountain live, 10 more settings wired but empty); stripped redundant UI explainer captions and the "doesn’t use Wealth" fallback text.',
  },
  {
    version: '3.2',
    notes: 'Full aidedd.org DMG audit: added the 5 missing generic bonus-item families (+1/+2/+3 Weapon/Armor/Shield/Ammunition, Greater/Superior/Supreme Healing potions) with real mechanical descriptions; documented the AI-selects-never-creates hard rule in lootAi.js (existing invention allowances grandfathered).',
  },
  {
    version: '3.1',
    notes: 'All 345 DMG magic items now describe their real mechanical effect instead of generic flavor text; fixed Fiend Origin field showing no options (missing showIf); hand-written flavor/trophy items rewritten to narrative-only uses, never mechanical ones.',
  },
]

export const CURRENT_VERSION = VERSION_HISTORY[0].version

// Kept for any code that still imports the old name directly -- resolves
// to just "Version X.Y" now (no changelog text), matching what the
// sidebar itself shows before you click it.
export const BUILD_VERSION = `Version ${CURRENT_VERSION}`
