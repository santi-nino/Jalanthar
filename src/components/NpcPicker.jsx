import { useState } from 'react'

export default function NpcPicker({ allNpcs, selectedIds, onChange }) {
  const [pendingId, setPendingId] = useState('')

  const selected = selectedIds.map((id) => allNpcs.find((n) => n.id === id)).filter(Boolean)
  const available = allNpcs.filter((n) => !selectedIds.includes(n.id))

  function handleAdd() {
    if (!pendingId) return
    onChange([...selectedIds, pendingId])
    setPendingId('')
  }

  function remove(id) {
    onChange(selectedIds.filter((i) => i !== id))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map((n) => (
          <span
            key={n.id}
            className="inline-flex items-center gap-1 bg-leather/10 border border-leather/40 rounded-sm px-2 py-1 text-sm"
          >
            {n.name}
            <button
              type="button"
              onClick={() => remove(n.id)}
              aria-label={`Remove ${n.name}`}
              className="text-wax hover:text-wax-dark leading-none"
            >
              ×
            </button>
          </span>
        ))}
        {selected.length === 0 && (
          <span className="text-xs text-ink-soft/60 italic">No residents added yet.</span>
        )}
      </div>
      <div className="flex gap-2">
        <select
          value={pendingId}
          onChange={(e) => setPendingId(e.target.value)}
          className="flex-1 rounded-sm border border-leather bg-white/60 px-3 py-2 text-sm"
        >
          <option value="">— select a resident to add —</option>
          {available.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
              {n.familyName ? ` (${n.familyName})` : ''}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!pendingId}
          className="px-3 py-2 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </div>
  )
}
