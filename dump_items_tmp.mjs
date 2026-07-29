import { DND5E_ITEMS } from './src/data/dnd5eItems.js'
import { mockSources } from './src/data/mockData.js'
import fs from 'node:fs'

const all = []
for (const it of DND5E_ITEMS) all.push(it)
for (const src of mockSources) {
  for (const w of (src.wares || [])) all.push(w)
}
fs.writeFileSync('/tmp/all_items.json', JSON.stringify(all))
console.log('total', all.length)
