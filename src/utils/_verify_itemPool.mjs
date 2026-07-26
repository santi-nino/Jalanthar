import { DND5E_ITEMS } from '../data/dnd5eItems.js'

// Normalizes an uploaded source's items (see UploadSourceModal) into the
// same {id, name, priceGp, description, category} shape the built-in SRD
// catalog uses, so every bit of browsing/search/category logic across the
// app (building catalog editor, loot generator) works over both without a
// special case. Each item's OWN category — assigned during AI scanning
// against the DM's suggested category list, or hand-edited afterward —
// drives its own group, so a single scanned source can split across
// several categories instead of being lumped under one blanket label.
//
// monsterTypeTags is an optional, invisible field (not shown as a visible
// category, never affects the building catalog editor) that ONLY the
// loot generator reads — see LootTab.jsx. It's an ARRAY, not a single
// value: a generic item (a torch, a coin purse) can legitimately belong
// to several types' loot at once — the same torch found in a soldier's
// pocket, a beast's den, or an aberration's stomach. An item with none
// of these tags at all is simply never reachable by species-scoped
// generation (SRD shop stock stays shop stock unless explicitly opted
// in this way).
//
// lootTags is a second, more flexible invisible field: an object whose
// KEYS are whatever dimensions matter for that monster type's own
// fields (e.g. Aberration uses `origin`, `xenotype`, `kind`; a future
// type overhaul might use entirely different keys) and whose values are
// either a single value (like `kind`) or an array of values the item is
// restricted to (like `origin: ['Aquatic Deep']` — omit the key entirely
// to mean "available regardless of that dimension," which is how items
// overlap across containers). One shared catalog, per-type tag
// dimensions — Aberration's tags are simply never read while generating
// Beast loot, and vice versa.
//
// tags is a THIRD, separate field: generic, cross-cutting labels that
// have nothing to do with monster type at all (martial/simple weapon
// proficiency, melee/ranged, caster-relevant, junk, clothing) — a finer
// sorting axis underneath the visible category, usable by any type's
// generation logic that wants it.
export function sourceItemsForPool(sources, pool) {
  return (sources || []).flatMap((s) =>
    (s[pool] || []).map((item) => ({
      id: `source-${s.id}-${item.rowId}`,
      name: item.name,
      priceGp: item.basePrice,
      description: item.description,
      category: `Source: ${s.name} (${item.category || 'Misc'})`,
      monsterTypeTags: item.monsterTypeTags || (item.monsterTypeTag ? [item.monsterTypeTag] : []),
      lootTags: item.lootTags || null,
      tags: item.tags || [],
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
