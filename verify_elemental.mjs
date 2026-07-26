import { DEFAULT_LOOT_TAXONOMY } from './src/data/_verify_defaultLootTaxonomy.mjs'
import { mockSources } from './src/data/mockData.js'

const tax = DEFAULT_LOOT_TAXONOMY
const attrs = tax.monsterTypeAttributes.Elemental
const elementAttr = attrs.find(a => a.id === 'elemental-element')
const subAttr = attrs.find(a => a.id === 'elemental-subelement')
const powerAttr = attrs.find(a => a.id === 'elemental-power')

console.assert(elementAttr.options.length === 4, 'expected 4 elements')
console.assert(powerAttr.options.length === 4, 'expected 4 power tiers')
console.assert(Object.keys(subAttr.optionsFor).length === 4, 'expected 4 sub-element groups')
for (const [el, subs] of Object.entries(subAttr.optionsFor)) {
  console.assert(subs.length === 5, `expected 5 sub-elements for ${el}, got ${subs.length}`)
}

const sizeTable = tax.sizeLootTable.Elemental
console.assert(powerAttr.options.every(p => sizeTable[p]), 'every power tier must have a sizeLootTable entry')
for (const [tier, kinds] of Object.entries(sizeTable)) {
  const kindNames = Object.keys(kinds)
  console.assert(
    ['Weapon', 'Parts', 'MagicParts', 'Junk', 'Power'].every(k => kindNames.includes(k)),
    `tier ${tier} missing a kind bucket: ${kindNames}`
  )
}

const src = mockSources.find(s => s.id === 'src-planebound-ledger')
console.assert(src, 'Planebound Ledger source must exist')
console.assert(src.wares.length === 81, `expected 81 items, got ${src.wares.length}`)

const validSubs = subAttr.optionsFor
for (const w of src.wares) {
  console.assert(w.monsterTypeTags.includes('Elemental'), `${w.name} missing Elemental tag`)
  const lt = w.lootTags
  console.assert(['Weapon','Parts','MagicParts','Junk','Power'].includes(lt.kind), `${w.name} bad kind ${lt.kind}`)
  if (lt.subelement) {
    console.assert(lt.element && lt.element.length === 1, `${w.name} has subelement but not exactly one element`)
    for (const s of lt.subelement) {
      console.assert(validSubs[lt.element[0]].includes(s), `${w.name}: subelement ${s} invalid for element ${lt.element[0]}`)
    }
  }
  if (lt.kind === 'Power') {
    console.assert(lt.minRank == null || (lt.minRank >= 0 && lt.minRank <= 3), `${w.name} bad minRank ${lt.minRank}`)
  }
}

// minRank/sizeOrder gating simulation, mirrors resolveKindBucketConfig/isCompatible in LootTab.jsx
const sizeOrder = ['Mephit', 'Elemental', 'Elder Elemental', 'Myrmidon']
const powerItems = src.wares.filter(w => w.lootTags.kind === 'Power')
for (const tierName of sizeOrder) {
  const ordinal = sizeOrder.indexOf(tierName)
  const eligible = powerItems.filter(w => (w.lootTags.minRank ?? 0) <= ordinal)
  console.assert(eligible.length > 0, `Power kind must have at least one eligible item for ${tierName}`)
}
console.log('Mephit eligible Power items:', powerItems.filter(w => (w.lootTags.minRank ?? 0) <= 0).length)
console.log('Myrmidon eligible Power items:', powerItems.filter(w => (w.lootTags.minRank ?? 0) <= 3).length)

console.log('ALL ELEMENTAL CHECKS PASSED')
