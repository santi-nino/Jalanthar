import { useState } from 'react'
import { useData } from '../contexts/DataContext'

export default function DmEditFamilyForm({ family, onClose }) {
  const { saveFamily, removeFamily, npcs } = useData()
  const [form, setForm] = useState(
    family || { name: '', description: '', genOverrides: {} }
  )

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function setGen(npcId, value) {
    const genOverrides = { ...(form.genOverrides || {}) }
    if (value === '') delete genOverrides[npcId]
    else genOverrides[npcId] = Number(value)
    set('genOverrides', genOverrides)
  }

  const members = npcs.filter((n) => n.familyName === form.name)

  const [saveError, setSaveError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveError('')
    try {
      await saveFamily(form)
      onClose()
    } catch (err) {
      console.error('Failed to save family:', err)
      setSaveError(err.message || 'Something went wrong while saving. Check the console for details.')
    }
  }

  async function handleDelete() {
    if (
      family?.id &&
      confirm(
        `Delete "${family.name}"? Residents already assigned to this family will keep the name as text but the family node will be removed from the tree.`
      )
    ) {
      await removeFamily(family.id)
      onClose()
    }
  }

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
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-md p-4 sm:p-6 space-y-4"
      >
        <h2 className="font-display text-xl text-leather-dark uppercase tracking-wide">
          {family ? 'Edit Family' : 'New Family'}
        </h2>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Family Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. The Thickets"
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">
            Description (optional)
          </span>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="House lore, a sigil, standing in town, whatever's useful"
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>

        {members.length > 0 && (
          <div>
            <span className="text-sm font-display uppercase text-ink-soft block mb-1">
              Generations
            </span>
            <p className="text-xs text-ink-soft/60 italic mb-2">
              Row 0 is the eldest generation shown on the tree. Leave blank to let the tree
              figure it out automatically from Parent/Sibling/Spouse relationships — set it
              here only to correct a member who's landing in the wrong row.
            </p>
            <ul className="space-y-1.5 max-h-56 overflow-y-auto">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm">{m.name}</span>
                  <input
                    type="number"
                    min="0"
                    value={form.genOverrides?.[m.id] ?? ''}
                    onChange={(e) => setGen(m.id, e.target.value)}
                    placeholder="auto"
                    className="w-20 rounded-sm border border-leather bg-white/60 px-2 py-1 text-sm text-right"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <div>
            {family && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm text-wax hover:text-wax-dark"
              >
                Delete family
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
