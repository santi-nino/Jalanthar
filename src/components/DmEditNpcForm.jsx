import { useState } from 'react'
import { useData } from '../contexts/DataContext'

export default function DmEditNpcForm({ npc, onClose }) {
  const { saveNpc, removeNpc, npcs, families, saveFamily } = useData()
  const [newFamilyName, setNewFamilyName] = useState('')
  const [form, setForm] = useState(
    npc || {
      name: '',
      familyName: families[0]?.name || '',
      homeBuildingId: '',
      visible: false,
      appearance: '',
      personality: '',
      clothing: '',
      history: '',
      relationships: [],
    }
  )

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function updateRel(i, key, value) {
    const next = form.relationships.slice()
    next[i] = { ...next[i], [key]: value }
    set('relationships', next)
  }

  function addRel() {
    set('relationships', [...form.relationships, { targetId: '', type: 'friend', note: '' }])
  }

  function removeRel(i) {
    set('relationships', form.relationships.filter((_, idx) => idx !== i))
  }

  async function handleAddFamily() {
    if (!newFamilyName.trim()) return
    await saveFamily({ name: newFamilyName.trim(), description: '' })
    set('familyName', newFamilyName.trim())
    setNewFamilyName('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await saveNpc(form)
    onClose()
  }

  async function handleDelete() {
    if (npc?.id && confirm(`Delete "${npc.name}"? This cannot be undone.`)) {
      await removeNpc(npc.id)
      onClose()
    }
  }

  const otherNpcs = npcs.filter((n) => n.id !== npc?.id)

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
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4"
      >
        <h2 className="font-display text-xl text-leather-dark uppercase tracking-wide">
          {npc ? 'Edit Resident' : 'New Resident'}
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

        <div className="flex gap-2 items-end">
          <label className="flex-1">
            <span className="text-sm font-display uppercase text-ink-soft">Family</span>
            <select
              value={form.familyName}
              onChange={(e) => set('familyName', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            >
              <option value="">— none —</option>
              {families.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <input
            value={newFamilyName}
            onChange={(e) => setNewFamilyName(e.target.value)}
            placeholder="New family name"
            className="rounded-sm border border-leather bg-white/60 px-2 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleAddFamily}
            className="text-xs font-display uppercase text-moss-dark border border-moss rounded-sm px-2 py-2"
          >
            + Add
          </button>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.visible}
            onChange={(e) => set('visible', e.target.checked)}
          />
          <span className="text-sm font-display uppercase text-ink-soft">
            Visible to players (introduced in game)
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Appearance</span>
          <textarea
            value={form.appearance}
            onChange={(e) => set('appearance', e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Clothing</span>
          <textarea
            value={form.clothing}
            onChange={(e) => set('clothing', e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Personality</span>
          <textarea
            value={form.personality}
            onChange={(e) => set('personality', e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Known History</span>
          <textarea
            value={form.history}
            onChange={(e) => set('history', e.target.value)}
            rows={3}
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
          <div className="space-y-2">
            {form.relationships.map((rel, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select
                  value={rel.targetId}
                  onChange={(e) => updateRel(i, 'targetId', e.target.value)}
                  className="flex-1 rounded-sm border border-leather bg-white/60 px-2 py-1 text-sm"
                >
                  <option value="">— select resident —</option>
                  {otherNpcs.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
                <select
                  value={rel.type}
                  onChange={(e) => updateRel(i, 'type', e.target.value)}
                  className="rounded-sm border border-leather bg-white/60 px-2 py-1 text-sm"
                >
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="rival">Rival</option>
                </select>
                <input
                  value={rel.note}
                  onChange={(e) => updateRel(i, 'note', e.target.value)}
                  placeholder="Note"
                  className="flex-1 rounded-sm border border-leather bg-white/60 px-2 py-1 text-sm"
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
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <div>
            {npc && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm text-wax hover:text-wax-dark"
              >
                Delete resident
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
      </form>
    </div>
  )
}
