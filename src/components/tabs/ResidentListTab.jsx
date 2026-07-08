import { useMemo, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import NpcDetailModal from '../NpcDetailModal'
import { HeaderDivider } from '../decorations'
import Decoration from '../Decoration'
import { isNpcNameVisible, isNpcFullyVisible } from '../../utils/visibility'
import { RESIDENT_CATEGORIES, getCategory, ageRangeLabel } from '../../utils/npcCategories'

// Buckets that represent "we don't know" rather than a real grouping value
// always sort to the end, so a category full of mostly-met residents isn't
// pushed below a wall of Unknowns.
const LOW_PRIORITY_BUCKETS = new Set(['Unknown', 'No Family', 'No Known Location'])

function bucketSort(a, b) {
  const aLow = LOW_PRIORITY_BUCKETS.has(a)
  const bLow = LOW_PRIORITY_BUCKETS.has(b)
  if (aLow !== bLow) return aLow ? 1 : -1
  return a.localeCompare(b)
}

function ResidentRow({ entry, onSelect }) {
  const { npc, fullyVisible } = entry
  const meta = fullyVisible
    ? [npc.job, npc.age ? `Age ${npc.age}` : ''].filter(Boolean).join(' · ')
    : ''
  if (!fullyVisible) {
    return (
      <li
        title="Not yet met — no detail page available"
        className="border border-dashed border-leather/40 rounded-sm bg-parchment/50 px-4 py-2.5 italic text-ink-soft/70"
      >
        {npc.name}
      </li>
    )
  }
  return (
    <li className="border border-leather/50 rounded-sm bg-parchment paper-texture">
      <button
        onClick={() => onSelect(npc.id)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left hover:bg-leather/5 transition-colors"
      >
        <span>
          <span className="font-display text-leather-dark">{npc.name}</span>
          {npc.familyName && (
            <span className="ml-2 text-xs uppercase tracking-wide text-ink-soft/60 font-display">
              {npc.familyName}
            </span>
          )}
        </span>
        {meta && <span className="text-xs text-ink-soft/70 italic shrink-0">{meta}</span>}
      </button>
    </li>
  )
}

export default function ResidentListTab({ onEditNpc }) {
  const { npcs, buildings } = useData()
  const { isDm } = useAuth()
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('none')
  const [selectedNpcId, setSelectedNpcId] = useState(null)

  const category = getCategory(categoryId)

  // One pass to work out, per resident, everything the rest of this tab
  // needs: whether their detail page is reachable, which locations they're
  // allowed to show (a name-only resident only ever shows the building(s)
  // that are the actual reason they're visible at all — not every building
  // they're quietly a resident of), and a search-safe text blob that never
  // includes a gated field for a resident who hasn't earned it yet.
  const entries = useMemo(() => {
    return npcs
      .filter((npc) => isNpcNameVisible(npc, buildings, isDm))
      .map((npc) => {
        const fullyVisible = isNpcFullyVisible(npc, isDm)
        const residencies = buildings.filter((b) => (b.residents || []).includes(npc.id))
        const locations = (fullyVisible ? residencies : residencies.filter((b) => b.revealed)).map(
          (b) => b.name
        )
        const searchable = [npc.name, npc.familyName, ...locations]
        if (fullyVisible) {
          searchable.push(npc.job, npc.species, npc.gender, npc.dndClass, ageRangeLabel(npc.age))
        }
        return {
          npc,
          fullyVisible,
          locations,
          searchText: searchable.filter(Boolean).join(' ').toLowerCase(),
        }
      })
  }, [npcs, buildings, isDm])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((e) => e.searchText.includes(q))
  }, [entries, query])

  const grouped = useMemo(() => {
    if (categoryId === 'none') return null
    const map = new Map()
    filtered.forEach((entry) => {
      const buckets = category.getBuckets(entry.npc, entry)
      buckets.forEach((bucket) => {
        if (!map.has(bucket)) map.set(bucket, [])
        map.get(bucket).push(entry)
      })
    })
    return [...map.entries()]
      .sort((a, b) => bucketSort(a[0], b[0]))
      .map(([bucket, list]) => [
        bucket,
        [...list].sort((a, b) => a.npc.name.localeCompare(b.npc.name)),
      ])
  }, [filtered, category, categoryId])

  const flatList = useMemo(
    () => [...filtered].sort((a, b) => a.npc.name.localeCompare(b.npc.name)),
    [filtered]
  )

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-3">
          <Decoration src="warriors-standards.webp" alt="" className="w-14 h-10 object-contain" />
          <h2 className="font-display text-2xl sm:text-3xl text-leather-dark">Roster of Jalanthar</h2>
        </div>
      </div>
      <HeaderDivider className="mb-4" />

      <div className="flex flex-wrap gap-3 mb-6 sticky top-0 bg-parchment/95 backdrop-blur-sm py-3 z-10">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search residents…"
          aria-label="Search residents"
          className="flex-1 min-w-[160px] rounded-sm border border-leather bg-white/60 px-3 py-2 font-body focus:outline-none"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          aria-label="Categorize by"
          className="rounded-sm border border-leather bg-white/60 px-3 py-2 font-body"
        >
          {RESIDENT_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id === 'none' ? 'No Categories' : `Categorize: ${c.label}`}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <p className="text-ink-soft italic">No residents match that search.</p>
      )}

      {grouped ? (
        <div className="space-y-6">
          {grouped.map(([bucket, list]) => (
            <div key={bucket}>
              <h3 className="font-display text-sm uppercase tracking-wide text-leather-dark/80 mb-2 border-b border-leather/30 pb-1">
                {bucket}
                <span className="ml-2 text-ink-soft/50 font-body normal-case tracking-normal">
                  ({list.length})
                </span>
              </h3>
              <ul className="space-y-2">
                {list.map((entry) => (
                  <ResidentRow key={entry.npc.id} entry={entry} onSelect={setSelectedNpcId} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {flatList.map((entry) => (
            <ResidentRow key={entry.npc.id} entry={entry} onSelect={setSelectedNpcId} />
          ))}
        </ul>
      )}

      {selectedNpcId && (
        <NpcDetailModal
          npcId={selectedNpcId}
          onNavigate={setSelectedNpcId}
          onClose={() => setSelectedNpcId(null)}
          onEditNpc={onEditNpc}
        />
      )}
    </div>
  )
}
