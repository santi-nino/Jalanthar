import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { getDeityRelationshipLabel } from '../data/deityRelationshipTypes'

const ADVERSE = new Set(['enemy', 'killed', 'killed_by'])
function relColor(typeId) {
  if (ADVERSE.has(typeId)) return 'text-wax-dark'
  if (typeId === 'ally' || typeId === 'spouse') return 'text-moss-dark'
  return 'text-ink-soft'
}

function StatRow({ label, value }) {
  if (!value) return null
  return (
    <li>
      <span className="text-ink-soft/60">{label}:</span> {value}
    </li>
  )
}

// The half-page "info page" the DM asked for: a compact stat-card up top
// (name/title/alignment/domain/symbol/animals/home plane/status), then a
// few prose paragraphs below it. Not a real popup or modal -- it's a
// normal aside panel taking up roughly half the viewport, same non-overlay
// philosophy the Catalogue tab's expand panel uses, just sized for how
// much more content a deity page holds than an item card.
export default function DeityDetailPanel({ deity, deitiesById, onEdit, onSelectRelated }) {
  const { isDm } = useAuth()
  const { saveDeity } = useData()
  const [editingField, setEditingField] = useState(null) // 'description' | 'worship' | 'holidays' | null
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  function startEditingProse(field) {
    setDraft(deity[field] || '')
    setEditingField(field)
  }

  async function saveProse(field) {
    setSaving(true)
    try {
      await saveDeity({ ...deity, [field]: draft })
      setEditingField(null)
    } finally {
      setSaving(false)
    }
  }

  function ProseSection({ field, title }) {
    const text = deity[field]
    const isEditing = editingField === field
    return (
      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">{title}</h4>
          {isDm && !isEditing && (
            <button
              onClick={() => startEditingProse(field)}
              className="text-xs text-leather-dark hover:text-gold-dark underline"
            >
              Edit
            </button>
          )}
        </div>
        {isEditing ? (
          <div className="space-y-1.5">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm text-ink-soft"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => saveProse(field)}
                disabled={saving}
                className="text-xs font-display uppercase px-3 py-1 rounded-sm bg-leather-dark text-gold-light hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setEditingField(null)} className="text-xs text-ink-soft underline">
                Cancel
              </button>
            </div>
          </div>
        ) : text ? (
          <p className="text-ink-soft text-sm leading-relaxed">{text}</p>
        ) : (
          <p className="text-ink-soft/50 text-sm italic">Not written yet.</p>
        )}
      </div>
    )
  }

  return (
    <div className="font-body">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-leather-dark leading-tight">{deity.name}</h3>
          {deity.title && (
            <p className="text-sm italic text-ink-soft/70 mt-0.5">{deity.title}</p>
          )}
          <p className="text-xs uppercase tracking-wide text-ink-soft/60 font-display mt-1">
            {deity.pantheon}
            {deity.status && deity.status !== 'active' && (
              <span className="ml-2 text-wax-dark">
                · {deity.status === 'dead' ? 'Dead' : 'Merged'}
                {deity.statusNote ? '' : ''}
              </span>
            )}
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

      {deity.statusNote && (
        <p className="mt-2 text-xs text-wax-dark italic border-l-2 border-wax pl-2">{deity.statusNote}</p>
      )}

      {/* Compact stat-card -- everything the DM asked to see "up top in a
          little info card": domain, symbol, sacred animals, plus the rest
          of the quick-reference facts. */}
      <div className="mt-3 rounded-sm border border-leather/40 bg-white/40 px-3 py-2">
        <ul className="text-sm space-y-0.5">
          <StatRow label="Alignment" value={deity.alignment} />
          <StatRow label="Domain" value={deity.domain?.join(', ')} />
          <StatRow label="Symbol" value={deity.symbol} />
          <StatRow label="Sacred Animals" value={deity.sacredAnimals} />
          <StatRow label="Home Plane" value={deity.homePlane} />
        </ul>
      </div>

      <div className="mt-4 space-y-4">
        <ProseSection field="description" title="Domains" />
        <ProseSection field="worship" title="Worship & Clergy" />
        <ProseSection field="holidays" title="Holidays" />

        {deity.relationships?.length > 0 && (
          <div>
            <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
              Relationships
            </h4>
            <ul className="space-y-1">
              {deity.relationships.map((rel, i) => {
                const target = deitiesById[rel.targetId]
                if (!target) return null
                return (
                  <li key={i} className="text-sm">
                    <button
                      onClick={() => onSelectRelated(target.id)}
                      className="text-leather-dark hover:text-wax underline underline-offset-2"
                    >
                      {target.name}
                    </button>
                    <span className={`ml-1.5 ${relColor(rel.type)}`}>
                      ({getDeityRelationshipLabel(rel.type)}
                      {rel.note ? ` — ${rel.note}` : ''})
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
