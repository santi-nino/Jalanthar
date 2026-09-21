import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import {
  SELECTABLE_DEITY_RELATIONSHIP_TYPES,
  getDeityRelationshipType,
  PANTHEONS,
} from '../data/deityRelationshipTypes'

export default function DmEditDeityForm({ deity, onClose }) {
  const { deities, saveDeity, removeDeity } = useData()
  const [form, setForm] = useState(() => {
    const base = deity || {
      name: '',
      title: '',
      pantheon: PANTHEONS[0],
      alignment: '',
      domain: [],
      symbol: '',
      sacredAnimals: '',
      homePlane: '',
      status: 'active',
      statusNote: '',
      creatorPatron: false,
      description: '',
      worship: '',
      holidays: '',
      relationships: [],
    }
    return { ...base, domainText: (base.domain || []).join(', ') }
  })
  const [saveError, setSaveError] = useState('')

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function updateRel(i, key, value) {
    const next = form.relationships.slice()
    next[i] = { ...next[i], [key]: value }
    set('relationships', next)
  }

  function addRel() {
    set('relationships', [...form.relationships, { targetId: '', type: 'ally', note: '' }])
  }

  function removeRel(i) {
    set('relationships', form.relationships.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveError('')
    try {
      const domain = form.domainText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const payload = { ...form, domain }
      delete payload.domainText
      const savedId = await saveDeity(payload)
      const resolvedId = savedId || deity?.id

      // Same bidirectional-sync contract as DmEditNpcForm: whatever this
      // deity's relationship list says, the target's own record must show
      // the correct reciprocal (Enemy<->Enemy, Killed<->Killed by, etc.).
      if (resolvedId) {
        const oldRels = deity?.relationships || []
        const newRels = form.relationships.filter((r) => r.targetId)
        const oldByTarget = Object.fromEntries(oldRels.map((r) => [r.targetId, r]))
        const newByTarget = Object.fromEntries(newRels.map((r) => [r.targetId, r]))
        const allTargetIds = new Set([...Object.keys(oldByTarget), ...Object.keys(newByTarget)])

        for (const targetId of allTargetIds) {
          const oldRel = oldByTarget[targetId]
          const newRel = newByTarget[targetId]
          if (oldRel?.type === newRel?.type && oldRel?.note === newRel?.note) continue
          const target = deities.find((d) => d.id === targetId)
          if (!target) continue
          const targetRels = (target.relationships || []).filter((r) => r.targetId !== resolvedId)
          if (newRel) {
            targetRels.push({
              targetId: resolvedId,
              type: getDeityRelationshipType(newRel.type).reciprocal,
              note: newRel.note || '',
            })
          }
          await saveDeity({ ...target, relationships: targetRels })
        }
      }

      onClose()
    } catch (err) {
      console.error('Failed to save deity:', err)
      setSaveError(err.message || 'Something went wrong while saving. Check the console for details.')
    }
  }

  async function handleDelete() {
    if (deity?.id && confirm(`Delete "${deity.name}"? This cannot be undone.`)) {
      await removeDeity(deity.id)
      onClose()
    }
  }

  const otherDeities = deities.filter((d) => d.id !== deity?.id)

  return (
    <div
      className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        <h2 className="font-display text-xl text-leather-dark uppercase tracking-wide">
          {deity ? 'Edit Deity' : 'New Deity'}
        </h2>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Title / Epithet</span>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Lady of Mysteries"
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2 italic"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Pantheon</span>
            <select
              value={form.pantheon}
              onChange={(e) => set('pantheon', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            >
              {PANTHEONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Alignment</span>
            <input
              value={form.alignment}
              onChange={(e) => set('alignment', e.target.value)}
              placeholder="e.g. Chaotic Good"
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Domain tags</span>
          <input
            value={form.domainText}
            onChange={(e) => set('domainText', e.target.value)}
            placeholder="Comma-separated, e.g. Magic, Mystery, Fate"
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Symbol</span>
            <input
              value={form.symbol}
              onChange={(e) => set('symbol', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Sacred Animals</span>
            <input
              value={form.sacredAnimals}
              onChange={(e) => set('sacredAnimals', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Home Plane</span>
          <input
            value={form.homePlane}
            onChange={(e) => set('homePlane', e.target.value)}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Status</span>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            >
              <option value="active">Active</option>
              <option value="dead">Dead</option>
              <option value="merged">Merged into another god</option>
            </select>
          </label>
          <label className="flex items-center gap-2 pb-2.5">
            <input
              type="checkbox"
              checked={form.creatorPatron}
              onChange={(e) => set('creatorPatron', e.target.checked)}
            />
            <span className="text-sm font-display uppercase text-ink-soft">Creator/Patron of a people</span>
          </label>
        </div>

        {form.status !== 'active' && (
          <label className="block">
            <span className="text-sm font-display uppercase text-ink-soft">Status Note</span>
            <input
              value={form.statusNote}
              onChange={(e) => set('statusNote', e.target.value)}
              placeholder="Who/what happened, and when"
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
        )}

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Domains (prose)</span>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Worship & Clergy</span>
          <textarea
            value={form.worship}
            onChange={(e) => set('worship', e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Holidays</span>
          <textarea
            value={form.holidays}
            onChange={(e) => set('holidays', e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-display uppercase text-ink-soft">Relationships</span>
            <button type="button" onClick={addRel} className="text-xs text-moss-dark underline">
              + Add relationship
            </button>
          </div>
          <p className="text-xs text-ink-soft/60 italic mb-2">
            Each deity can only have one relationship with this one — adding a new one replaces
            any existing tie, on both pages. "Note" is shown on Killed/Absorbed lines (e.g. "Time
            of Troubles").
          </p>
          <div className="space-y-2">
            {form.relationships.map((rel, i) => {
              const usedElsewhere = new Set(
                form.relationships.filter((_, idx) => idx !== i).map((r) => r.targetId)
              )
              const availableTargets = otherDeities.filter(
                (d) => d.id === rel.targetId || !usedElsewhere.has(d.id)
              )
              return (
                <div key={i} className="flex flex-wrap gap-2 items-center">
                  <select
                    value={rel.targetId}
                    onChange={(e) => updateRel(i, 'targetId', e.target.value)}
                    className="flex-1 min-w-[140px] rounded-sm border border-leather bg-white/60 px-2 py-1 text-sm"
                  >
                    <option value="">— select deity —</option>
                    {availableTargets.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={rel.type}
                    onChange={(e) => updateRel(i, 'type', e.target.value)}
                    className="rounded-sm border border-leather bg-white/60 px-2 py-1 text-sm"
                  >
                    {SELECTABLE_DEITY_RELATIONSHIP_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <input
                    value={rel.note || ''}
                    onChange={(e) => updateRel(i, 'note', e.target.value)}
                    placeholder="Note (optional)"
                    className="rounded-sm border border-leather bg-white/60 px-2 py-1 text-sm w-36"
                  />
                  <button
                    type="button"
                    onClick={() => removeRel(i)}
                    aria-label="Remove relationship"
                    className="text-wax text-lg leading-none px-1"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <div>
            {deity && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm text-wax hover:text-wax-dark"
              >
                Delete deity
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-display uppercase text-ink-soft"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-display uppercase bg-leather text-parchment rounded-sm hover:bg-leather-dark"
            >
              Save
            </button>
          </div>
        </div>
        {saveError && (
          <p className="text-sm text-wax bg-wax/10 border border-wax/40 rounded-sm px-3 py-2">
            {saveError}
          </p>
        )}
      </form>
    </div>
  )
}
