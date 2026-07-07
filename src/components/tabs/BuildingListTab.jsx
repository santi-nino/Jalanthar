import { useState, useMemo } from 'react'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import BuildingDetailPanel from '../BuildingDetailPanel'
import NpcDetailModal from '../NpcDetailModal'
import { HeaderDivider } from '../decorations'
import Decoration from '../Decoration'

export default function BuildingListTab({ onEditBuilding, onEditNpc }) {
  const { buildings } = useData()
  const { isDm } = useAuth()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [openId, setOpenId] = useState(null)
  const [selectedNpcId, setSelectedNpcId] = useState(null)

  const typeOptions = useMemo(
    () => ['all', ...new Set(buildings.map((b) => b.type).filter(Boolean))],
    [buildings]
  )

  const filtered = useMemo(() => {
    let list = buildings.filter((b) =>
      b.name.toLowerCase().includes(query.toLowerCase())
    )
    if (typeFilter !== 'all') {
      list = list.filter((b) => b.type === typeFilter)
    }
    list = [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'type') return (a.type || '').localeCompare(b.type || '')
      return 0
    })
    return list
  }, [buildings, query, typeFilter, sortBy])

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-3">
          <Decoration src="sea-serpent.jpeg" alt="" className="w-12 h-12 object-contain" />
          <h2 className="font-display text-2xl sm:text-3xl text-leather-dark">Buildings of Jalanthar</h2>
        </div>
        {isDm && onEditBuilding && (
          <button
            onClick={() => onEditBuilding(null)}
            className="text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm px-3 py-2 hover:bg-leather-dark shrink-0"
          >
            + Add Building
          </button>
        )}
      </div>
      <HeaderDivider className="mb-4" />

      <div className="flex flex-wrap gap-3 mb-6 sticky top-0 bg-parchment/95 backdrop-blur-sm py-3 z-10">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search buildings…"
          aria-label="Search buildings"
          className="flex-1 min-w-[160px] rounded-sm border border-leather bg-white/60 px-3 py-2 font-body focus:outline-none"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filter by type"
          className="rounded-sm border border-leather bg-white/60 px-3 py-2 font-body"
        >
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All Types' : t}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort by"
          className="rounded-sm border border-leather bg-white/60 px-3 py-2 font-body"
        >
          <option value="name">Sort: Name</option>
          <option value="type">Sort: Type</option>
        </select>
      </div>

      {filtered.length === 0 && (
        <p className="text-ink-soft italic">No buildings match that search.</p>
      )}

      <ul className="space-y-3">
        {filtered.map((b) => {
          const isOpen = openId === b.id
          return (
            <li
              key={b.id}
              className="border border-leather/50 rounded-sm bg-parchment paper-texture"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : b.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-leather/5 transition-colors"
              >
                <span>
                  <span className="font-display text-lg text-leather-dark">{b.name}</span>
                  {b.subheader && (
                    <span className="block text-xs uppercase tracking-wide text-ink-soft/70 font-display">
                      {b.subheader}
                    </span>
                  )}
                </span>
                <span className="text-leather-dark text-xl leading-none">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  <BuildingDetailPanel
                    building={b}
                    onEdit={isDm && onEditBuilding ? () => onEditBuilding(b) : undefined}
                    onSelectResident={setSelectedNpcId}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>

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
