import { useState } from 'react'
import { useData } from '../contexts/DataContext'

export default function DmEditFamilyForm({ family, onClose }) {
  const { saveFamily, removeFamily } = useData()
  const [form, setForm] = useState(family || { name: '', description: '' })

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await saveFamily(form)
    onClose()
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
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-md p-6 space-y-4"
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
      </form>
    </div>
  )
}
