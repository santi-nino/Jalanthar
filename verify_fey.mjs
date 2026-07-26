import { buildItemPool } from './src/utils/_verify_itemPool.mjs'
import { mockSources } from './src/data/mockData.js'
import { DND5E_ITEMS } from './src/data/dnd5eItems.js'

const MAGICAL_JUNK_DRAWER_SOURCE_ID = 'sGUAccXFQOl3hwTl7OYP'
function isEstablishedSource(item) {
  return item.id?.startsWith('item-') || item.id?.startsWith(`source-${MAGICAL_JUNK_DRAWER_SOURCE_ID}-`)
}
function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] }
  return a
}
function randomInt(min, max) { const lo=Math.min(min,max), hi=Math.max(min,max); return Math.round(lo+Math.random()*(hi-lo)) }
function weightedRandInt(min, max, pMin, pMax) {
  if (pMin != null && pMax != null && Math.random() < 0.6) return randomInt(pMin, pMax)
  return randomInt(min, max)
}

// ---- 1. Fey MONSTER path: sizeLootTable.Fey + KIND_BUCKET_CONFIG.Fey exist and balance works ----
const rawPool = buildItemPool('wares', mockSources)
const feyWhimsy = rawPool.filter(i => i.monsterTypeTags?.includes('Fey') && i.lootTags?.kind === 'Whimsy')
console.log('Fey/Whimsy pool:', feyWhimsy.length, '| established:', feyWhimsy.filter(isEstablishedSource).length, '| homebrew:', feyWhimsy.length - feyWhimsy.filter(isEstablishedSource).length)
if (feyWhimsy.filter(isEstablishedSource).length === 0) { console.error('FAIL: no established Whimsy items'); process.exit(1) }
if (feyWhimsy.length - feyWhimsy.filter(isEstablishedSource).length === 0) { console.error('FAIL: no homebrew Whimsy items'); process.exit(1) }

const feyCourtTagged = rawPool.filter(i => i.monsterTypeTags?.includes('Fey') && i.lootTags?.court)
console.log('Fey items with a Court tag:', feyCourtTagged.length, '(courts used:', [...new Set(feyCourtTagged.flatMap(i=>i.lootTags.court))], ')')

// ---- 2. Loadout System pools resolve correctly ----
function loadoutPoolFor(name, pool) {
  switch (name) {
    case 'MartialWeapon': return pool.filter(i => i.category === 'Weapon' && i.tags?.includes('martial'))
    case 'SimpleWeapon': return pool.filter(i => i.category === 'Weapon' && i.tags?.includes('simple'))
    case 'ArcaneFocus': return pool.filter(i => i.category === 'Focus' && i.name.startsWith('Arcane Focus'))
    case 'Clothes': return pool.filter(i => i.tags?.includes('clothing'))
    default: return pool.filter(i => i.lootTags?.loadoutPool === name)
  }
}
const feyRawPool = rawPool.filter(i => !i.lootTags?.loadoutPool || i.monsterTypeTags?.includes('Fey'))
for (const poolName of ['MartialWeapon', 'SimpleWeapon', 'ArcaneFocus', 'Clothes', 'Boots', 'Helmet', 'Shoes', 'MagicItem', 'MagicWeapon', 'Supplementary', 'Junk']) {
  const p = loadoutPoolFor(poolName, feyRawPool)
  console.log(`  pool ${poolName}: ${p.length} items`)
  if (p.length === 0) { console.error(`FAIL: pool ${poolName} is empty`); process.exit(1) }
}

// ---- 3. Simulate a Fighter loadout draw at Arch Fey rank ----
function draw(items, pool, n, used) {
  if (n <= 0) return
  const avail = pool.filter(i => !used.has(i.name))
  const picked = shuffled(avail).slice(0, Math.min(n, avail.length))
  picked.forEach(i => used.add(i.name))
  items.push(...picked)
}
const fighterItems = []
const used = new Set()
draw(fighterItems, loadoutPoolFor('MartialWeapon', feyRawPool), 1, used)
draw(fighterItems, loadoutPoolFor('Boots', feyRawPool), 1, used)
draw(fighterItems, loadoutPoolFor('Helmet', feyRawPool), 1, used)
draw(fighterItems, loadoutPoolFor('MagicWeapon', feyRawPool), randomInt(1,2), used)
draw(fighterItems, loadoutPoolFor('MagicItem', feyRawPool), randomInt(1,2), used)
draw(fighterItems, loadoutPoolFor('Supplementary', feyRawPool), randomInt(0,10), used)
draw(fighterItems, loadoutPoolFor('Junk', feyRawPool), weightedRandInt(0,4,2,3), used)
console.log('\nSample Arch Fey Fighter loadout:', fighterItems.map(i => i.name))
if (fighterItems.length === 0) { console.error('FAIL: fighter loadout produced nothing'); process.exit(1) }

console.log('\nPASS: Fey monster path and Loadout System both resolve real, populated pools')
