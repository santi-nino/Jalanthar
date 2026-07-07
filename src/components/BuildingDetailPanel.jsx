import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice, effectivePrice } from '../utils/price'

export default function BuildingDetailPanel({ building, onEdit, onSelectResident }) {
  const [revealed, setRevealed] = useState(false)
  const { npcs } = useData()
  const { isDm } = useAuth()

  const residents = (building.residents || [])
    .map((id) => npcs.find((n) => n.id === id))
    .filter(Boolean)
    .filter((n) => isDm || n.visible)

  const multiplier = building.priceMultiplier ?? 1.5

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
                {residents.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => onSelectResident?.(r.id)}
                      className="underline decoration-dotted hover:text-wax text-left"
                    >
                      {r.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {building.wares?.length > 0 && (
            <CatalogSection title="Wares" rows={building.wares} multiplier={multiplier} />
          )}
          {building.menu?.length > 0 && (
            <CatalogSection title="Menu" rows={building.menu} multiplier={multiplier} />
          )}
          {building.services?.length > 0 && (
            <CatalogSection title="Services" rows={building.services} multiplier={multiplier} />
          )}
        </div>
      )}
    </div>
  )
}

function CatalogSection({ title, rows, multiplier }) {
  return (
    <div>
      <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
        {title}
      </h4>
      <ul className="space-y-1.5">
        {rows.map((row, i) => (
          <li key={row.rowId || i} className="flex justify-between gap-2">
            <span>
              {row.name}
              {row.description && (
                <span className="block text-xs italic text-ink-soft/70">{row.description}</span>
              )}
            </span>
            <span className="font-mono text-sm shrink-0">
              {formatPrice(effectivePrice(row, multiplier))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
