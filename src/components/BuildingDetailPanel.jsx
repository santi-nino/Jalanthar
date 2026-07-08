import { useMemo, useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice, effectivePrice } from '../utils/price'
import { isNpcNameVisible, isNpcFullyVisible } from '../utils/visibility'

export default function BuildingDetailPanel({ building, onEdit, onSelectResident }) {
  const [revealed, setRevealed] = useState(false)
  const { npcs, buildings, saveBuilding } = useData()
  const { isDm } = useAuth()

  const residents = (building.residents || [])
    .map((id) => npcs.find((n) => n.id === id))
    .filter(Boolean)
    .filter((n) => isNpcNameVisible(n, buildings, isDm))

  const multiplier = building.priceMultiplier ?? 1.5

  function updateQuantity(pool, rowId, newQty) {
    const rows = (building[pool] || []).map((r) => (r.rowId === rowId ? { ...r, quantity: newQty } : r))
    saveBuilding({ ...building, [pool]: rows })
  }

  return (
    <div className="font-body">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-leather-dark leading-tight">
            {building.name}
          </h3>
          <p className="text-sm uppercase tracking-wide text-ink-soft/70 font-display mt-1">
            {building.subheader || building.type || ''}
          </p>
        </div>
        {isDm && onEdit && (
          <button
            onClick={onEdit}
            className="text-xs font-display uppercase tracking-wide text-wax hover:text-wax-dark border border-wax rounded-sm px-2 py-1 shrink-0"
          >
            Edit
          </button>
        )}
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-5 w-full py-3 border-2 border-dashed border-leather/60 rounded-sm text-leather-dark font-display uppercase tracking-wide text-sm hover:bg-leather/10 transition-colors"
        >
          Reveal
        </button>
      ) : (
        <div className="mt-4 space-y-4">
          {building.interiorLayoutImage && (
            <div>
              <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
                Layout
              </h4>
              <img
                src={building.interiorLayoutImage}
                alt={`${building.name} interior layout`}
                className="w-full rounded-sm border border-leather/40"
              />
            </div>
          )}

          {building.description && (
            <p className="leading-relaxed text-ink-soft">{building.description}</p>
          )}

          {residents.length > 0 && (
            <div>
              <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
                Residents
              </h4>
              <ul className="space-y-1">
                {residents.map((r) => {
                  const fullyVisible = isNpcFullyVisible(r, isDm)
                  return (
                    <li key={r.id}>
                      {fullyVisible ? (
                        <button
                          onClick={() => onSelectResident?.(r.id)}
                          className="underline decoration-dotted hover:text-wax text-left"
                        >
                          {r.name}
                        </button>
                      ) : (
                        <span className="text-ink-soft/70 italic" title="Not yet met — no detail page available">
                          {r.name}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {building.wares?.length > 0 && (
            <CatalogSection
              title="Wares"
              pool="wares"
              rows={building.wares}
              multiplier={multiplier}
              isDm={isDm}
              onQuantityChange={(rowId, q) => updateQuantity('wares', rowId, q)}
            />
          )}
          {building.menu?.length > 0 && (
            <CatalogSection
              title="Menu"
              pool="menu"
              rows={building.menu}
              multiplier={multiplier}
              isDm={isDm}
              onQuantityChange={(rowId, q) => updateQuantity('menu', rowId, q)}
            />
          )}
          {building.services?.length > 0 && (
            <CatalogSection
              title="Services"
              pool="services"
              rows={building.services}
              multiplier={multiplier}
              isDm={isDm}
              onQuantityChange={(rowId, q) => updateQuantity('services', rowId, q)}
            />
          )}
        </div>
      )}
    </div>
  )
}

function QuantityBadge({ quantity, isDm, onChange }) {
  const isInfinite = quantity === 'infinite'
  const qty = isInfinite ? '∞' : quantity ?? 1

  if (!isDm) {
    // Players may only ever lower the count — a single "take one" control,
    // disabled once stock hits zero. Infinite stock shows the symbol with
    // nothing to click, since there's nothing to run out of.
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="font-mono text-xs text-ink-soft/70">×{qty}</span>
        {!isInfinite && (
          <button
            type="button"
            onClick={() => onChange(Math.max(0, Number(quantity ?? 1) - 1))}
            disabled={Number(quantity ?? 1) <= 0}
            title="Take one"
            className="w-5 h-5 flex items-center justify-center border border-leather/50 rounded-sm text-xs disabled:opacity-30"
          >
            −
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={() => onChange(isInfinite ? 1 : Math.max(0, Number(quantity || 0) - 1))}
        disabled={isInfinite}
        className="w-5 h-5 flex items-center justify-center border border-leather rounded-sm text-xs disabled:opacity-30"
      >
        −
      </button>
      <span className="font-mono text-xs w-6 text-center">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(isInfinite ? 1 : Number(quantity || 0) + 1)}
        disabled={isInfinite}
        className="w-5 h-5 flex items-center justify-center border border-leather rounded-sm text-xs disabled:opacity-30"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => onChange(isInfinite ? 1 : 'infinite')}
        title={isInfinite ? 'Make finite' : 'Set unlimited stock'}
        className={`w-5 h-5 flex items-center justify-center border rounded-sm text-xs ${
          isInfinite ? 'bg-moss-dark text-parchment border-moss-dark' : 'border-leather'
        }`}
      >
        ∞
      </button>
    </div>
  )
}

function CatalogSection({ title, rows, multiplier, isDm, onQuantityChange }) {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')

  const filtered = useMemo(() => {
    let list = rows
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (r) => r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q)
      )
    }
    if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'price') {
      list = [...list].sort(
        (a, b) => effectivePrice(a, multiplier) - effectivePrice(b, multiplier)
      )
    }
    return list
  }, [rows, query, sortBy, multiplier])

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark">{title}</h4>
        {rows.length > 4 && (
          <div className="flex gap-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="text-xs rounded-sm border border-leather/40 bg-white/50 px-2 py-0.5 w-24"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs rounded-sm border border-leather/40 bg-white/50 px-1 py-0.5"
            >
              <option value="default">Sort</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        )}
      </div>
      {filtered.length === 0 && (
        <p className="text-xs text-ink-soft/60 italic">No matches.</p>
      )}
      <ul className="space-y-1.5">
        {filtered.map((row, i) => (
          <li key={row.rowId || i} className="flex justify-between items-start gap-2">
            <span className="min-w-0">
              {row.name}
              {row.description && (
                <span className="block text-xs italic text-ink-soft/70">{row.description}</span>
              )}
            </span>
            <span className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-sm">{formatPrice(effectivePrice(row, multiplier))}</span>
              <QuantityBadge
                quantity={row.quantity ?? 1}
                isDm={isDm}
                onChange={(q) => onQuantityChange(row.rowId, q)}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
