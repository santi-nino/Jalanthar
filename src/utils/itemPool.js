import { DND5E_ITEMS } from '../data/dnd5eItems'

// Normalizes an uploaded source's items (see UploadSourceModal) into the
// same {id, name, priceGp, description, category} shape the built-in SRD
// catalog uses, so every bit of browsing/search/category logic across the
// app (building catalog editor, loot generator) works over both without a
// special case. Each item's OWN category — assigned during AI scanning
// against the DM's suggested category list, or hand-edited afterward —
// drives its own group, so a single scanned source can split across
// several categories instead of being lumped under one blanket label.
//
// monsterTypeTag is an optional, invisible field (not shown as a visible
// category, never affects the building catalog editor) that ONLY the
// loot generator reads — see LootTab.jsx. It's how a "Blue Dragon Heart"
// item can be hard-scoped to Dragon entities specifically, rather than
// relying on price ranges or category names to (imperfectly) keep it
// away from, say, a Beast.
export function sourceItemsForPool(sources, pool) {
  return (sources || []).flatMap((s) =>
    (s[pool] || []).map((item) => ({
      id: `source-${s.id}-${item.rowId}`,
      name: item.name,
      priceGp: item.basePrice,
      description: item.description,
      category: `Source: ${s.name} (${item.category || 'Misc'})`,
      monsterTypeTag: item.monsterTypeTag || null,
    }))
  )
}

export function buildItemPool(pool, sources) {
  return [...DND5E_ITEMS.filter((i) => i.pool === pool), ...sourceItemsForPool(sources, pool)]
}

export function groupByCategory(items) {
  const map = {}
  items.forEach((i) => {
    if (!map[i.category]) map[i.category] = []
    map[i.category].push(i)
  })
  return map
}
