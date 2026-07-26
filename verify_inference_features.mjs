// Re-implements the exact fix applied to computeEligiblePoolForAi's
// needsInference branch in LootTab.jsx: when a DM only sets Specific
// Monster (e.g. "Giant Snake") without touching the Size/Kingdom/Diet
// dropdowns, the pool handed to the AI must still exclude
// requiresFeature-gated items (Horns, Tusks, etc) for any feature that
// isn't checked -- since every checkbox starts unchecked, and nothing
// used to apply that filter in this specific code path before the fix.
import { mockSources } from './src/data/mockData.js'

const hunters = mockSources.find(s => s.id === 'src-hunters-trapper-guide-v2')
const beastItems = hunters.wares.filter(w => w.monsterTypeTags?.includes('Beast'))

function eligiblePoolNeedsInference(rawPool, features) {
  // Mirrors the fixed needsInference branch exactly.
  return rawPool.filter((i) => {
    const required = i.lootTags?.requiresFeature
    return !required || !!(features && features[required])
  })
}

// A snake: DM picks "Giant Snake" via Specific Monster, leaves every
// dropdown (and every feature checkbox) untouched -- features is {} or
// undefined, matching real UI default state.
const snakePool = eligiblePoolNeedsInference(beastItems, {})
const leaked = snakePool.filter(i => i.lootTags?.requiresFeature)
console.log('requiresFeature items leaked into an all-unchecked pool:', leaked.map(i => `${i.name} (needs ${i.lootTags.requiresFeature})`))
console.assert(leaked.length === 0, 'FAIL: feature-gated items (e.g. Horns) should never reach an all-unchecked pool')

// Sanity check the fix is actually load-bearing: confirm Horn/Tusk items
// really do exist in the source pool (so the test isn't vacuously
// passing because there's nothing to filter).
const hornOrTuskItems = beastItems.filter(i => ['Horns', 'Tusks', 'Wings', 'Venom', 'Shell', 'Beak'].includes(i.lootTags?.requiresFeature))
console.log('total requiresFeature items in Beast catalog:', hornOrTuskItems.length)
console.assert(hornOrTuskItems.length > 0, 'test setup problem: no requiresFeature items found at all')

// And confirm a DM who DID check Horns still sees horn items (the fix
// shouldn't over-correct into excluding everything).
const boarPool = eligiblePoolNeedsInference(beastItems, { Horns: true })
const hornsVisible = boarPool.filter(i => i.lootTags?.requiresFeature === 'Horns')
console.log('Horns items visible when Horns is checked:', hornsVisible.map(i => i.name))
console.assert(hornsVisible.length > 0, 'FAIL: checked features should still surface their items')

if (leaked.length > 0 || hornOrTuskItems.length === 0 || hornsVisible.length === 0) {
  console.error('FAIL')
  process.exit(1)
}
console.log('PASS: needsInference mode now respects requiresFeature gating both ways')
