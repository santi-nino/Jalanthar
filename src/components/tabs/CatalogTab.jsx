import { useMemo, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { DND5E_ITEMS } from '../../data/dnd5eItems'
import { formatPrice, effectivePrice } from '../../utils/price'
import { HeaderDivider } from '../decorations'

// Same 14 official 5e/5.5e creature types the Loot tab's own taxonomy
// uses (see monsterTypes in defaultLootTaxonomy.js) -- kept as a small
// local copy rather than importing the Loot taxonomy itself, since this
// tab is a general-purpose catalog browser, not specifically a Loot tab
// feature, and shouldn't need to pull in that whole data module just for
// one static list.
const MONSTER_TYPES = [
  'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental',
  'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead',
]

const POOL_LABELS = { wares: 'Wares', menu: 'Menu', services: 'Services' }

// Every rendered row's max, regardless of how many actually match the
// active filters -- a totally unfiltered "All Sources" search is pulling
// from ~2,400 items, and rendering all of them at once as plain DOM rows
// would be genuinely slow for no benefit (nobody's scrolling through 2,400
// unsorted rows looking for something). Narrowing the filters is the
// intended way to get under this, not infinite-scroll/pagination
// machinery this catalog doesn't otherwise need.
const MAX_RENDERED_ROWS = 400

export default function CatalogTab() {
  const { sources } = useData()
  const [search, setSearch] = useState('')
  const [sourceId, setSourceId] = useState('all')
  const [category, setCategory] = useState('all')
  const [monsterType, setMonsterType] = useState('all')
  const [tag, setTag] = useState('all')

  // Normalizes the built-in SRD catalog AND every uploaded/generated
  // source's wares/menu/services into one flat, consistently-shaped list.
  // Deliberately does NOT reuse itemPool.js's sourceItemsForPool -- that
  // helper wraps a source item's category as "Source: X (Category)" for
  // the loot generator's own display purposes, which would make category
  // filtering here group every source's items under a separate label
  // instead of the shared category they actually belong to (e.g. every
  // source's own "Weapon" items should filter together with the SRD
  // catalog's "Weapon" items, not sit in 13 separate "Source: X (Weapon)"
  // buckets).
  const allItems = useMemo(() => {
    const builtin = DND5E_ITEMS.map((i) => ({
      id: i.id,
      name: i.name,
      priceGp: i.priceGp,
      description: i.description,
      category: i.category || 'Misc',
      pool: i.pool,
      monsterTypeTags: i.monsterTypeTags || [],
      tags: i.tags || [],
      sourceId: 'builtin',
      sourceName: 'SRD Catalog (Built-in)',
    }))
    const fromSources = (sources || []).flatMap((s) =>
      ['wares', 'menu', 'services'].flatMap((pool) =>
        (s[pool] || []).map((item) => ({
          id: `source-${s.id}-${item.rowId}`,
          name: item.name,
          priceGp: effectivePrice(item, 1),
          description: item.description,
          category: item.category || 'Misc',
          pool,
          monsterTypeTags: item.monsterTypeTags || [],
          tags: item.tags || [],
          sourceId: s.id,
          sourceName: s.name,
        }))
      )
    )
    return [...builtin, ...fromSources]
  }, [sources])

  const sourceOptions = useMemo(() => {
    const named = (sources || []).map((s) => ({ id: s.id, name: s.name }))
    return [{ id: 'builtin', name: 'SRD Catalog (Built-in)' }, ...named]
  }, [sources])

  // Category and Tag option lists are scoped to whichever Source is
  // currently picked (not the full unfiltered catalog) -- picking a
  // narrow source shouldn't leave 20+ irrelevant category options sitting
  // in the dropdown from every OTHER source.
  const sourceScoped = useMemo(
    () => (sourceId === 'all' ? allItems : allItems.filter((i) => i.sourceId === sourceId)),
    [allItems, sourceId]
  )

  const categoryOptions = useMemo(
    () => [...new Set(sourceScoped.map((i) => i.category))].sort((a, b) => a.localeCompare(b)),
    [sourceScoped]
  )

  const tagOptions = useMemo(
    () => [...new Set(sourceScoped.flatMap((i) => i.tags))].sort((a, b) => a.localeCompare(b)),
    [sourceScoped]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allItems.filter((i) => {
      if (sourceId !== 'all' && i.sourceId !== sourceId) return false
      if (category !== 'all' && i.category !== category) return false
      if (monsterType !== 'all' && !i.monsterTypeTags.includes(monsterType)) return false
      if (tag !== 'all' && !i.tags.includes(tag)) return false
      if (q) {
        const haystack = [i.name, i.description, i.category, ...i.tags].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [allItems, search, sourceId, category, monsterType, tag])

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.name.localeCompare(b.name)),
    [filtered]
  )
  const visible = sorted.slice(0, MAX_RENDERED_ROWS)
  const truncated = sorted.length > MAX_RENDERED_ROWS

  function resetFilters() {
    setSearch('')
    setSourceId('all')
    setCategory('all')
    setMonsterType('all')
    setTag('all')
  }

  const selectClass = 'rounded-sm border border-leather bg-white/60 px-3 py-2 font-body text-sm'

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <h2 className="font-display text-2xl sm:text-3xl text-leather-dark">Item Catalog</h2>
        <span className="text-xs text-ink-soft/60 italic">
          {sorted.length} match{sorted.length === 1 ? '' : 'es'}
          {truncated ? ` (showing first ${MAX_RENDERED_ROWS} — narrow your filters to see more)` : ''}
        </span>
      </div>
      <HeaderDivider className="mb-4" />

      <div className="flex flex-wrap gap-3 mb-4 sticky top-0 bg-parchment/95 backdrop-blur-sm py-3 z-10">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, description, tags…"
          aria-label="Search catalog"
          className="flex-1 min-w-[200px] rounded-sm border border-leather bg-white/60 px-3 py-2 font-body"
        />
        <select value={sourceId} onChange={(e) => { setSourceId(e.target.value); setCategory('all'); setTag('all') }} aria-label="Filter by source" className={selectClass}>
          <option value="all">All Sources</option>
          {sourceOptions.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by type/category" className={selectClass}>
          <option value="all">All Types</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={monsterType} onChange={(e) => setMonsterType(e.target.value)} aria-label="Filter by monster type tag" className={selectClass}>
          <option value="all">Any Monster Type</option>
          {MONSTER_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Filter by tag" className={selectClass}>
          <option value="all">All Tags</option>
          {tagOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {(search || sourceId !== 'all' || category !== 'all' || monsterType !== 'all' || tag !== 'all') && (
          <button
            onClick={resetFilters}
            className="text-xs font-display uppercase tracking-wide text-leather-dark hover:text-gold-dark px-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="text-ink-soft italic">No items match those filters.</p>
      ) : (
        <div className="border border-leather/40 rounded-sm bg-white/40 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-leather/40 text-left font-display uppercase text-xs text-ink-soft tracking-wide">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Monster Types</th>
                <th className="px-3 py-2">Tags</th>
                <th className="px-3 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((i) => (
                <tr key={i.id} className="border-b border-leather/15 last:border-b-0 align-top hover:bg-leather/5">
                  <td className="px-3 py-2 font-display text-leather-dark whitespace-nowrap">{i.name}</td>
                  <td className="px-3 py-2 text-ink-soft whitespace-nowrap">
                    {i.category}
                    <span className="ml-1 text-ink-soft/50">({POOL_LABELS[i.pool] || i.pool})</span>
                  </td>
                  <td className="px-3 py-2 text-ink-soft whitespace-nowrap">
                    {i.priceGp == null ? '—' : formatPrice(i.priceGp)}
                  </td>
                  <td className="px-3 py-2 text-ink-soft whitespace-nowrap">{i.sourceName}</td>
                  <td className="px-3 py-2 text-ink-soft/70 text-xs">
                    {i.monsterTypeTags.length > 0 ? i.monsterTypeTags.join(', ') : '—'}
                  </td>
                  <td className="px-3 py-2 text-ink-soft/70 text-xs">
                    {i.tags.length > 0 ? i.tags.join(', ') : '—'}
                  </td>
                  <td className="px-3 py-2 text-ink-soft/70 italic max-w-xs">{i.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
