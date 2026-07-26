import { buildItemPool } from './src/utils/_verify_itemPool.mjs'
import { mockSources } from './src/data/mockData.js'
import { DEFAULT_LOOT_TAXONOMY } from './src/data/_verify_dlt.mjs'

const rawPool = buildItemPool('wares', mockSources)

function sourceOf(item) {
  return item.id.startsWith('source-') ? item.id.split('source-')[1].split(`-row`)[0].replace(/-$/, '') : 'SRD'
}
function labelOf(item) {
  if (item.id.startsWith('source-')) {
    const src = mockSources.find(s => item.id.startsWith(`source-${s.id}-`))
    return src ? src.name : 'unknown-source'
  }
  return 'SRD'
}

const checks = [
  ['Celestial', 'Weapon'],
  ['Celestial', 'Armor'],
  ['Celestial', 'Treasure'],
  ['Celestial', 'Religious'],
  ['Elemental', 'Weapon'],
  ['Elemental', 'Junk'],
  ['Beast', 'Ration'],
  ['Aberration', 'Stomach'],
  ['Construct', 'Component'],
]

let allGood = true
for (const [type, kind] of checks) {
  const pool = rawPool.filter(i => i.monsterTypeTags?.includes(type) && i.lootTags?.kind === kind)
  const bySource = {}
  for (const i of pool) {
    const label = labelOf(i)
    bySource[label] = (bySource[label] || 0) + 1
  }
  const distinctSources = Object.keys(bySource).length
  console.log(`${type}/${kind}: ${pool.length} items across ${distinctSources} source(s) ->`, bySource)
  if (distinctSources < 2) {
    console.error(`  STILL SINGLE-SOURCE: ${type}/${kind}`)
    allGood = false
  }
}

if (!allGood) { console.error('FAIL'); process.exit(1) }
console.log('PASS: every checked kind bucket now mixes the dedicated source with SRD and/or Magical Junk Drawer items')
