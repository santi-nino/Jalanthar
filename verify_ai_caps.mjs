import { generateAiAssistedLoot } from './src/utils/_verify_lootAi.mjs'

// Simulate Gemini returning a deliberately over-generous, duplicate-laden
// response for a Beast entity whose real tier only allows Trophy: [1,2].
// This is exactly the "too many items altogether" + "multiple skulls"
// complaint -- verifying the CODE-LEVEL safety net catches it even when
// the model completely ignores the prompt's stated limits.
globalThis.fetch = async (url) => {
  const body = {
    items: [
      { name: 'Weathered Skull Fragment', priceGp: 6, description: 'x', kind: 'Trophy', isNew: false },
      { name: 'Weathered Skull Fragment', priceGp: 6, description: 'x', kind: 'Trophy', isNew: false }, // exact dup
      { name: 'Foraged-Diet Skull, Worn Teeth', priceGp: 5, description: 'x', kind: 'Trophy', isNew: false }, // different name, same anatomySlot: Skull
      { name: 'Braided Sinew Trophy Cord', priceGp: 9, description: 'x', kind: 'Trophy', isNew: false }, // 3rd distinct Trophy item, over the max of 2
      { name: 'Invented Thing One', priceGp: 10, description: 'x', kind: 'Trophy', isNew: true },
      { name: 'Invented Thing Two', priceGp: 10, description: 'x', kind: 'Trophy', isNew: true },
      { name: 'Invented Thing Three', priceGp: 10, description: 'x', kind: 'Trophy', isNew: true }, // 3rd invented, must be capped to 2
    ],
  }
  return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(body) }] } }] }) }
}

const result = await generateAiAssistedLoot({
  monsterType: 'Beast',
  monsterName: 'Giant Boar',
  notes: '',
  tierLabel: 'Large',
  countsByKind: { Trophy: [1, 2], Parts: [1, 2] },
  eligibleItems: [
    { name: 'Weathered Skull Fragment', priceGp: 6, description: 'x', kind: 'Trophy', anatomySlot: 'Skull' },
    { name: 'Foraged-Diet Skull, Worn Teeth', priceGp: 5, description: 'x', kind: 'Trophy', anatomySlot: 'Skull' },
    { name: 'Braided Sinew Trophy Cord', priceGp: 9, description: 'x', kind: 'Trophy' },
  ],
  attributeSummary: 'kingdom=Mammal, diet=Herbivore',
  needsInference: false,
})

console.log('Result:', JSON.stringify(result, null, 2))

const trophyItems = result.filter(r => r.kind === 'Trophy')
console.assert(trophyItems.length <= 2, `expected at most 2 Trophy items (the stated max), got ${trophyItems.length}`)
const names = trophyItems.map(r => r.name.toLowerCase())
console.assert(new Set(names).size === names.length, 'expected no exact-duplicate names')
const skullCount = trophyItems.filter(r => ['weathered skull fragment', 'foraged-diet skull, worn teeth'].includes(r.name.toLowerCase())).length
console.assert(skullCount <= 1, `expected at most 1 skull-slot item even though they have different names, got ${skullCount}`)
const newCount = result.filter(r => r.isNew).length
console.assert(newCount <= 2, `expected at most 2 invented items, got ${newCount}`)

if (trophyItems.length > 2 || new Set(names).size !== names.length || skullCount > 1 || newCount > 2) {
  console.error('FAIL')
  process.exit(1)
}
console.log('PASS: per-kind cap, exact-name dedup, anatomySlot dedup, and invented-item cap all enforced in code')
