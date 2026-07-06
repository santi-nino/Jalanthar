import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'

const TYPE_LABELS = {
  civic: 'Civic Building',
  tavern: 'Tavern & Inn',
  shrine: 'Shrine',
  garrison: 'Garrison',
  shop: 'Shop',
  residence: 'Residence',
  ruin: 'Ruin',
  other: 'Building',
}

export default function BuildingDetailPanel({ building, onEdit }) {
  const [revealed, setRevealed] = useState(false)
  const { npcs } = useData()
  const { isDm } = useAuth()

  const residents = (building.residents || [])
    .map((id) => npcs.find((n) => n.id === id))
    .filter(Boolean)
    .filter((n) => isDm || n.visible)

  return (
    <div className="font-body">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-leather-dark leading-tight">
            {building.name}
          </h3>
          <p className="text-sm uppercase tracking-wide text-ink-soft/70 font-display mt-1">
            {building.subheader || TYPE_LABELS[building.type] || ''}
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
          {building.description && (
            <p className="leading-relaxed text-ink-soft">{building.description}</p>
          )}

          {building.interiorLayout && (
            <div>
              <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
                Layout
              </h4>
              <p className="text-ink-soft whitespace-pre-line">{building.interiorLayout}</p>
            </div>
          )}

          {residents.length > 0 && (
            <div>
              <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
                Residents
              </h4>
              <ul className="list-disc list-inside text-ink-soft">
                {residents.map((r) => (
                  <li key={r.id}>{r.name}</li>
                ))}
              </ul>
            </div>
          )}

          {building.wares?.length > 0 && (
            <div>
              <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
                Wares
              </h4>
              <ul className="text-ink-soft space-y-0.5">
                {building.wares.map((w, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{w.item}</span>
                    <span className="font-mono text-sm">{w.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {building.menu?.length > 0 && (
            <div>
              <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
                Menu
              </h4>
              <ul className="text-ink-soft space-y-0.5">
                {building.menu.map((m, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span>
                      {m.item}
                      {m.notes && (
                        <span className="text-xs italic text-ink-soft/70"> — {m.notes}</span>
                      )}
                    </span>
                    <span className="font-mono text-sm shrink-0">{m.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {building.services?.length > 0 && (
            <div>
              <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
                Services
              </h4>
              <ul className="text-ink-soft space-y-0.5">
                {building.services.map((s, i) => (
                  <li key={i}>
                    <span className="font-semibold">{s.service}</span>
                    {s.notes && <span className="text-sm italic"> — {s.notes}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
