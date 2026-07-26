// Standalone re-implementation of the anatomySlot-aware selection logic
// added to generateKindBucketedLoot in LootTab.jsx, tested against the
// real Beast skull scenario the DM reported (giant boar getting multiple
// skull items). Mirrors the actual engine code exactly.
import { mockSources } from './src/data/mockData.js'

function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function slotsOf(item) {
  const raw = item.lootTags?.anatomySlot
  if (!raw) return []
  return Array.isArray(raw) ? raw : [raw]
}

const hunters = mockSources.find(s => s.id === 'src-hunters-trapper-guide-v2')
const beastTrophy = hunters.wares.filter(w =>
  w.monsterTypeTags?.includes('Beast') &&
  w.lootTags?.kind === 'Trophy' &&
  (!w.lootTags.kingdom || w.lootTags.kingdom.includes('Mammal')) &&
  (!w.lootTags.diet || w.lootTags.diet.includes('Herbivore'))
)
console.log('Eligible Trophy pool for a Mammal/Herbivore boar-like Beast:', beastTrophy.map(w => w.name))

// A giant boar-like entity: Large size -> Trophy [2,2] per sizeLootTable.Beast
const n = 2
let skullDraws = 0
for (let trial = 0; trial < 500; trial++) {
  const usedSlots = new Set()
  const picked = []
  for (const candidate of shuffled(beastTrophy)) {
    if (picked.length >= n) break
    const slots = slotsOf(candidate)
    if (slots.some((s) => usedSlots.has(s))) continue
    picked.push(candidate)
    slots.forEach((s) => usedSlots.add(s))
  }
  const skulls = picked.filter(p => slotsOf(p).includes('Skull')).length
  if (skulls > 1) skullDraws++
}
console.log(`Trials with >1 Skull-slot item drawn (should be 0): ${skullDraws}/500`)
if (skullDraws > 0) { console.error('FAIL: anatomySlot did not prevent duplicate skulls'); process.exit(1) }
console.log('PASS: anatomySlot enforcement prevents duplicate skull draws')
