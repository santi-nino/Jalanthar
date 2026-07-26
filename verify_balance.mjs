import { mockSources } from './src/data/mockData.js'
import { DND5E_ITEMS } from './src/data/dnd5eItems.js'

const MAGICAL_JUNK_DRAWER_SOURCE_ID = 'sGUAccXFQOl3hwTl7OYP'
function isEstablishedSource(item) {
  return item.id?.startsWith('item-') || item.id?.startsWith(`source-${MAGICAL_JUNK_DRAWER_SOURCE_ID}-`)
}
function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function fillFrom(picked, pool, target) {
  for (const c of shuffled(pool)) {
    if (picked.length >= target) break
    if (picked.includes(c)) continue
    picked.push(c)
  }
}
function balancedDraw(eligible, n) {
  const established = eligible.filter(isEstablishedSource)
  const homebrew = eligible.filter(i => !isEstablishedSource(i))
  const firstIsEstablished = Math.random() < 0.5
  const [firstPool, secondPool] = firstIsEstablished ? [established, homebrew] : [homebrew, established]
  const picked = []
  fillFrom(picked, firstPool, Math.min(n, Math.ceil(n / 2)))
  fillFrom(picked, secondPool, n)
  if (picked.length < n) fillFrom(picked, eligible, n)
  return picked
}

// Reconstruct Celestial's Weapon-kind eligible pool (26 SRD + 10 Reliquary, per last verification)
function sourceItemsForPool(sources, pool) {
  return (sources || []).flatMap((s) =>
    (s[pool] || []).map((item) => ({
      id: `source-${s.id}-${item.rowId}`, name: item.name, priceGp: item.basePrice,
      monsterTypeTags: item.monsterTypeTags || [], lootTags: item.lootTags || null,
    }))
  )
}
const wares = [...DND5E_ITEMS.filter(i => i.pool === 'wares'), ...sourceItemsForPool(mockSources, 'wares')]
const eligible = wares.filter(i => i.monsterTypeTags?.includes('Celestial') && i.lootTags?.kind === 'Weapon')
console.log('eligible pool:', eligible.length, '| established:', eligible.filter(isEstablishedSource).length, '| homebrew:', eligible.length - eligible.filter(isEstablishedSource).length)

let totalEst = 0, totalHome = 0, trials = 2000, n = 2
for (let i = 0; i < trials; i++) {
  const picked = balancedDraw(eligible, n)
  totalEst += picked.filter(isEstablishedSource).length
  totalHome += picked.length - picked.filter(isEstablishedSource).length
}
const total = totalEst + totalHome
console.log(`over ${trials} draws of n=${n}: established=${totalEst} (${(100*totalEst/total).toFixed(1)}%), homebrew=${totalHome} (${(100*totalHome/total).toFixed(1)}%)`)
if (Math.abs(totalEst - totalHome) / total > 0.15) { console.error('FAIL: not close to even'); process.exit(1) }
console.log('PASS: balanced draw produces a real, roughly-even mix')
