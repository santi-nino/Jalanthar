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
  // The DM's Monster Types / Tags sections inside the expanded panel are
  // collapsible and default CLOSED -- most of the time a DM expanding an
  // item just wants the description, not an immediate wall of toggle
  // buttons. Both collapse back to closed whenever a different item is
  // expanded (see toggleExpanded below), rather than persisting per-item.
  const [monsterTypesOpen, setMonsterTypesOpen] = useState(false)
  const [tagsOpen, setTagsOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', priceGp: '', description: '' })
  const [savingEdit, setSavingEdit] = useState(false)

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

  function toggleExpanded(item) {
    const next = item.id === expandedId ? null : item.id
    setExpandedId(next)
    setMonsterTypesOpen(false)
    setTagsOpen(false)
    setEditing(false)
  }

  function startEdit(item) {
    setEditForm({ name: item.name, priceGp: item.priceGp ?? '', description: item.description || '' })
    setEditing(true)
  }

  async function saveEdit(item) {
    if (!item.editable) return
    setSavingEdit(true)
    try {
      const source = sources.find((s) => s.id === item.sourceId)
      if (!source) return
      const nextPool = (source[item.pool] || []).map((row) => {
        if (row.rowId !== item.rowId) return row
        return {
          ...row,
          name: editForm.name.trim() || row.name,
          basePrice: editForm.priceGp === '' ? row.basePrice : Number(editForm.priceGp),
          description: editForm.description,
        }
      })
      await saveSource({ ...source, [item.pool]: nextPool })
      setEditing(false)
    } finally {
      setSavingEdit(false)
    }
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
          the list when an item is clicked. It is NOT a real popup or
          modal: no fixed/absolute overlay, no backdrop trapping the page,
          nothing rendered via a portal. It's a normal block of page
          content that happens to be styled (heavy border, shadow, a close
          button) to read visually like a popped-up window. Closing it, or
          clicking a different row, simply removes it from the flow. */}
      {expandedItem && (
        <div className="mb-4 rounded-sm border-2 border-gold bg-parchment shadow-xl p-4 sm:p-6 relative">
          <button
            onClick={() => setExpandedId(null)}
            aria-label="Close item details"
            className="absolute top-2 right-2 text-ink-soft/60 hover:text-leather-dark text-xl leading-none px-2"
          >
            ×
          </button>

          {editing ? (
            <div className="pr-8 space-y-2">
              <label className="block">
                <span className="text-xs font-display uppercase tracking-wide text-ink-soft">Name</span>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1 font-display text-leather-dark"
                />
              </label>
              <label className="block">
                <span className="text-xs font-display uppercase tracking-wide text-ink-soft">Price (gp)</span>
                <input
                  type="number"
                  step="any"
                  value={editForm.priceGp}
                  onChange={(e) => setEditForm((f) => ({ ...f, priceGp: e.target.value }))}
                  className="w-32 rounded-sm border border-leather bg-white/70 px-2 py-1 text-ink-soft"
                />
              </label>
              <label className="block">
                <span className="text-xs font-display uppercase tracking-wide text-ink-soft">Description</span>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1 text-ink-soft italic"
                />
              </label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => saveEdit(expandedItem)}
                  disabled={savingEdit}
                  className="text-xs font-display uppercase px-3 py-1.5 rounded-sm bg-leather-dark text-gold-light hover:opacity-90 disabled:opacity-50"
                >
                  {savingEdit ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-xs text-ink-soft underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-display text-xl text-leather-dark pr-8">{expandedItem.name}</h3>
              <p className="text-xs text-ink-soft/60 mb-2">
                {expandedItem.sourceName}
                <span className="mx-1">·</span>
                {expandedItem.priceGp == null ? '—' : formatPrice(expandedItem.priceGp)}
                <span className="mx-1">·</span>
                {POOL_LABELS[expandedItem.pool] || expandedItem.pool}
              </p>
              <p className="text-ink-soft italic mb-3">{expandedItem.description}</p>
            </>
          )}

          {isDm && !editing && (
            <div className="border-t border-leather/30 pt-3 mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-display uppercase tracking-wide text-ink-soft">
                  {expandedItem.category}
                </p>
                {expandedItem.editable && (
                  <button
                    onClick={() => startEdit(expandedItem)}
                    className="text-xs font-display uppercase text-leather-dark hover:text-gold-dark underline"
                  >
                    Edit Name/Price/Description
                  </button>
                )}
              </div>

              {!expandedItem.editable ? (
                <p className="text-xs text-ink-soft/60 italic">
                  Built-in SRD items can't be edited here.
                </p>
              ) : (
                <>
                  {/* Both sections below default to collapsed -- expanding
                      an item is usually just about reading the description,
                      not immediately facing a wall of toggle buttons. */}
                  <div>
                    <button
                      onClick={() => setMonsterTypesOpen((v) => !v)}
                      aria-expanded={monsterTypesOpen}
                      className="flex items-center gap-1.5 text-xs font-display uppercase tracking-wide text-ink-soft hover:text-leather-dark"
                    >
                      <span className={`inline-block transition-transform ${monsterTypesOpen ? 'rotate-90' : ''}`}>▸</span>
                      Monster Types
                      {expandedItem.monsterTypeTags.length > 0 && (
                        <span className="normal-case text-ink-soft/50">({expandedItem.monsterTypeTags.length})</span>
                      )}
                    </button>
                    {monsterTypesOpen && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
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
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => setTagsOpen((v) => !v)}
                      aria-expanded={tagsOpen}
                      className="flex items-center gap-1.5 text-xs font-display uppercase tracking-wide text-ink-soft hover:text-leather-dark"
                    >
                      <span className={`inline-block transition-transform ${tagsOpen ? 'rotate-90' : ''}`}>▸</span>
                      Tags
                      {expandedItem.tags.length > 0 && (
                        <span className="normal-case text-ink-soft/50">({expandedItem.tags.length})</span>
                      )}
                    </button>
                    {tagsOpen && (
                      <>
                        <p className="text-[11px] text-ink-soft/50 mt-1 mb-1.5">
                          Existing tags only — this tab can't create new ones.
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
                      </>
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
        <div className="border border-leather/40 rounded-sm bg-white/40 divide-y divide-leather/15">
          {visible.map((i) => (
            <button
              key={i.id}
              onClick={() => toggleExpanded(i)}
              aria-expanded={expandedId === i.id}
              className={`w-full h-12 flex items-center gap-3 text-left px-3 hover:bg-leather/5 transition-colors ${
                expandedId === i.id ? 'bg-leather/10' : ''
              }`}
            >
              <span className="font-display text-sm text-leather-dark truncate flex-1 min-w-0">{i.name}</span>
              <span className="text-xs text-ink-soft/70 shrink-0 w-16 text-right">
                {i.priceGp == null ? '—' : formatPrice(i.priceGp)}
              </span>
              <span className="text-[11px] text-ink-soft/50 truncate shrink-0 w-40 hidden sm:block">{i.sourceName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
