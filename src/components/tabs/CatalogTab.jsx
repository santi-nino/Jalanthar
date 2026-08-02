import { useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { DND5E_ITEMS } from '../../data/dnd5eItems'
import { formatPrice, effectivePrice } from '../../utils/price'
import { HeaderDivider } from '../decorations'

// Same 14 official 5e/5.5e creature types the Loot tab's own taxonomy
// uses (see monsterTypes in defaultLootTaxonomy.js) -- kept as a small
// local copy rather than importing the Loot taxonomy itself, since this
// tab is a general-purpose catalog browser, not specifically a Loot tab
// feature, and shouldn't need to pull in that whole data module just for
// one static list. This is also the fixed, closed universe of monster
// type values the DM can apply to an item below -- nothing outside this
// list can ever be added.
const MONSTER_TYPES = [
  'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental',
  'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead',
]

const POOL_LABELS = { wares: 'Wares', menu: 'Menu', services: 'Services' }

// Every rendered row's max, regardless of how many actually match the
// active filters -- a totally unfiltered "All Sources" search is pulling
// from ~2,400 items, and rendering all of them at once as plain DOM cards
// would be genuinely slow for no benefit (nobody's scrolling through 2,400
// unsorted cards looking for something). Narrowing the filters is the
// intended way to get under this, not infinite-scroll/pagination
// machinery this catalogue doesn't otherwise need.
const MAX_RENDERED_ROWS = 400

export default function CatalogTab() {
  const { isDm } = useAuth()
  const { sources, saveSource } = useData()
  const [search, setSearch] = useState('')
  const [sourceId, setSourceId] = useState('all')
  const [category, setCategory] = useState('all')
  const [monsterType, setMonsterType] = useState('all')
  const [tag, setTag] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [savingKey, setSavingKey] = useState(null)

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
      rowId: null,
      name: i.name,
      priceGp: i.priceGp,
      description: i.description,
      category: i.category || 'Misc',
      pool: i.pool,
      monsterTypeTags: i.monsterTypeTags || [],
      tags: i.tags || [],
      sourceId: 'builtin',
      sourceName: 'SRD Catalogue (Built-in)',
      editable: false,
    }))
    const fromSources = (sources || []).flatMap((s) =>
      ['wares', 'menu', 'services'].flatMap((pool) =>
        (s[pool] || []).map((item) => ({
          id: `source-${s.id}-${item.rowId}`,
          rowId: item.rowId,
          name: item.name,
          priceGp: effectivePrice(item, 1),
          description: item.description,
          category: item.category || 'Misc',
          pool,
          monsterTypeTags: item.monsterTypeTags || [],
          tags: item.tags || [],
          sourceId: s.id,
          sourceName: s.name,
          editable: true,
        }))
      )
    )
    return [...builtin, ...fromSources]
  }, [sources])

  const sourceOptions = useMemo(() => {
    const named = (sources || []).map((s) => ({ id: s.id, name: s.name }))
    return [{ id: 'builtin', name: 'SRD Catalogue (Built-in)' }, ...named]
  }, [sources])

  // Category and Tag option lists are scoped to whichever Source is
  // currently picked (not the full unfiltered catalogue) -- picking a
  // narrow source shouldn't leave 20+ irrelevant category options sitting
  // in the dropdown from every OTHER source. DM-only, since these
  // dropdowns themselves are hidden from players.
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

  // The full, closed universe of tags already in use anywhere in the
  // catalogue -- this is the ONLY set of values the DM's tag-editing
  // control below is allowed to apply to an item. There is deliberately
  // no way to type a brand-new tag into existence from this tab.
  const allKnownTags = useMemo(
    () => [...new Set(allItems.flatMap((i) => i.tags))].sort((a, b) => a.localeCompare(b)),
    [allItems]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allItems.filter((i) => {
      if (sourceId !== 'all' && i.sourceId !== sourceId) return false
      if (isDm && category !== 'all' && i.category !== category) return false
      if (isDm && monsterType !== 'all' && !i.monsterTypeTags.includes(monsterType)) return false
      if (isDm && tag !== 'all' && !i.tags.includes(tag)) return false
      if (q) {
        // Players can't filter by type/monster-type/tags, but the free
        // text search still matches against them -- searching "undead" as
        // plain text isn't the same thing as browsing a tag list, and
        // there's no meaningful spoiler in a name/description substring
        // match landing on a tagged item.
        const haystack = [i.name, i.description, i.category, ...i.tags].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [allItems, search, sourceId, category, monsterType, tag, isDm])

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.name.localeCompare(b.name)),
    [filtered]
  )
  const visible = sorted.slice(0, MAX_RENDERED_ROWS)
  const truncated = sorted.length > MAX_RENDERED_ROWS
  const expandedItem = expandedId ? visible.find((i) => i.id === expandedId) : null

  function resetFilters() {
    setSearch('')
    setSourceId('all')
    setCategory('all')
    setMonsterType('all')
    setTag('all')
  }

  async function toggleItemTag(item, value) {
    if (!item.editable) return
    const key = `${item.id}:tag:${value}`
    setSavingKey(key)
    try {
      const source = sources.find((s) => s.id === item.sourceId)
      if (!source) return
      const nextPool = (source[item.pool] || []).map((row) => {
        if (row.rowId !== item.rowId) return row
        const has = (row.tags || []).includes(value)
        return { ...row, tags: has ? row.tags.filter((t) => t !== value) : [...(row.tags || []), value] }
      })
      await saveSource({ ...source, [item.pool]: nextPool })
    } finally {
      setSavingKey(null)
    }
  }

  async function toggleItemMonsterType(item, value) {
    if (!item.editable) return
    const key = `${item.id}:mt:${value}`
    setSavingKey(key)
    try {
      const source = sources.find((s) => s.id === item.sourceId)
      if (!source) return
      const nextPool = (source[item.pool] || []).map((row) => {
        if (row.rowId !== item.rowId) return row
        const has = (row.monsterTypeTags || []).includes(value)
        return {
          ...row,
          monsterTypeTags: has
            ? row.monsterTypeTags.filter((t) => t !== value)
            : [...(row.monsterTypeTags || []), value],
        }
      })
      await saveSource({ ...source, [item.pool]: nextPool })
    } finally {
      setSavingKey(null)
    }
  }

  const selectClass = 'rounded-sm border border-leather bg-white/60 px-3 py-2 font-body text-sm'

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <h2 className="font-display text-2xl sm:text-3xl text-leather-dark">Item Catalogue</h2>
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
          placeholder="Search name, description…"
          aria-label="Search catalogue"
          className="flex-1 min-w-[200px] rounded-sm border border-leather bg-white/60 px-3 py-2 font-body"
        />
        <select value={sourceId} onChange={(e) => { setSourceId(e.target.value); setCategory('all'); setTag('all') }} aria-label="Filter by source" className={selectClass}>
          <option value="all">All Sources</option>
          {sourceOptions.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {/* Type, Monster Type, and Tag filters are DM-only -- players can
            browse and search the catalogue, but these three category
            systems stay invisible to them per the DM's own request. */}
        {isDm && (
          <>
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
          </>
        )}
        {(search || sourceId !== 'all' || (isDm && (category !== 'all' || monsterType !== 'all' || tag !== 'all'))) && (
          <button
            onClick={resetFilters}
            className="text-xs font-display uppercase tracking-wide text-leather-dark hover:text-gold-dark px-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* The "pseudo-pop-up" -- an inline detail panel that appears above
          the card grid when an item is clicked. It is NOT a real popup or
          modal: no fixed/absolute overlay, no backdrop trapping the page,
          nothing rendered via a portal. It's a normal block of page
          content that happens to be styled (heavy border, shadow, a close
          button) to read visually like a popped-up window. Closing it, or
          clicking a different card, simply removes it from the flow. */}
      {expandedItem && (
        <div className="mb-4 rounded-sm border-2 border-gold bg-parchment shadow-xl p-4 sm:p-6 relative">
          <button
            onClick={() => setExpandedId(null)}
            aria-label="Close item details"
            className="absolute top-2 right-2 text-ink-soft/60 hover:text-leather-dark text-xl leading-none px-2"
          >
            ×
          </button>
          <h3 className="font-display text-xl text-leather-dark pr-8">{expandedItem.name}</h3>
          <p className="text-xs text-ink-soft/60 mb-2">
            {expandedItem.sourceName}
            <span className="mx-1">·</span>
            {expandedItem.priceGp == null ? '—' : formatPrice(expandedItem.priceGp)}
            <span className="mx-1">·</span>
            {POOL_LABELS[expandedItem.pool] || expandedItem.pool}
          </p>
          <p className="text-ink-soft italic mb-3">{expandedItem.description}</p>

          {isDm && (
            <div className="border-t border-leather/30 pt-3 mt-3 space-y-3">
              <p className="text-xs font-display uppercase tracking-wide text-ink-soft">
                {expandedItem.category}
              </p>

              {!expandedItem.editable ? (
                <p className="text-xs text-ink-soft/60 italic">
                  Built-in SRD items can't be edited here.
                </p>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-display uppercase tracking-wide text-ink-soft mb-1">
                      Monster Types
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {MONSTER_TYPES.map((t) => {
                        const active = expandedItem.monsterTypeTags.includes(t)
                        const busy = savingKey === `${expandedItem.id}:mt:${t}`
                        return (
                          <button
                            key={t}
                            disabled={busy}
                            onClick={() => toggleItemMonsterType(expandedItem, t)}
                            className={`text-xs px-2 py-1 rounded-sm border transition-colors disabled:opacity-50 ${
                              active
                                ? 'bg-leather-dark text-gold-light border-leather-dark'
                                : 'bg-white/50 text-ink-soft border-leather/40 hover:border-leather'
                            }`}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-display uppercase tracking-wide text-ink-soft mb-1">
                      Tags{' '}
                      <span className="normal-case text-ink-soft/50">
                        (existing tags only — this tab can't create new ones)
                      </span>
                    </p>
                    {allKnownTags.length === 0 ? (
                      <p className="text-xs text-ink-soft/60 italic">No tags exist yet anywhere in the catalogue.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {allKnownTags.map((t) => {
                          const active = expandedItem.tags.includes(t)
                          const busy = savingKey === `${expandedItem.id}:tag:${t}`
                          return (
                            <button
                              key={t}
                              disabled={busy}
                              onClick={() => toggleItemTag(expandedItem, t)}
                              className={`text-xs px-2 py-1 rounded-sm border transition-colors disabled:opacity-50 ${
                                active
                                  ? 'bg-leather-dark text-gold-light border-leather-dark'
                                  : 'bg-white/50 text-ink-soft border-leather/40 hover:border-leather'
                              }`}
                            >
                              {t}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-ink-soft italic">No items match those filters.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {visible.map((i) => (
            <button
              key={i.id}
              onClick={() => setExpandedId(i.id === expandedId ? null : i.id)}
              aria-expanded={expandedId === i.id}
              className={`h-32 flex flex-col items-start justify-between text-left rounded-sm border bg-white/40 p-3 hover:bg-leather/5 transition-colors ${
                expandedId === i.id ? 'border-gold ring-1 ring-gold' : 'border-leather/40'
              }`}
            >
              <span className="font-display text-sm text-leather-dark line-clamp-2">{i.name}</span>
              <span className="text-xs text-ink-soft/70">
                {i.priceGp == null ? '—' : formatPrice(i.priceGp)}
              </span>
              <span className="text-[10px] text-ink-soft/50 truncate w-full">{i.sourceName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
