import { useState } from 'react'
import { useData } from '../contexts/DataContext'

const TYPES = ['civic', 'tavern', 'shrine', 'garrison', 'shop', 'residence', 'ruin', 'other']

function ListEditor({ label, fields, items, onChange }) {
  function update(i, key, value) {
    const next = items.slice()
    next[i] = { ...next[i], [key]: value }
    onChange(next)
  }
  function add() {
    onChange([...items, Object.fromEntries(fields.map((f) => [f.key, '']))])
  }
  function remove(i) {
    onChange(items.filter((_, idx) => idx !== i))
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark">{label}</h4>
        <button type="button" onClick={add} className="text-xs text-moss-dark underline">
          + Add row
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            {fields.map((f) => (
              <input
                key={f.key}
                value={item[f.key] || ''}
                onChange={(e) => update(i, f.key, e.target.value)}
                placeholder={f.label}
                className="flex-1 rounded-sm border border-leather bg-white/60 px-2 py-1 text-sm"
              />
            ))}
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove row"
              className="text-wax text-lg leading-none px-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DmEditBuildingForm({ building, onClose }) {
  const { saveBuilding, removeBuilding, npcs } = useData()
  const [form, setForm] = useState(
    building || {
      name: '',
      subheader: '',
      type: 'other',
      coords: { x: 50, y: 50 },
      quadrant: 'inhabited',
      description: '',
      interiorLayout: '',
      residents: [],
      wares: [],
      menu: [],
      services: [],
    }
  )

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await saveBuilding(form)
    onClose()
  }

  async function handleDelete() {
    if (building?.id && confirm(`Delete "${building.name}"? This cannot be undone.`)) {
      await removeBuilding(building.id)
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
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4"
      >
        <h2 className="font-display text-xl text-leather-dark uppercase tracking-wide">
          {building ? 'Edit Building' : 'New Building'}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2">
            <span className="text-sm font-display uppercase text-ink-soft">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
          <label className="col-span-2">
            <span className="text-sm font-display uppercase text-ink-soft">Sub-header</span>
            <input
              value={form.subheader}
              onChange={(e) => set('subheader', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Type</span>
            <select
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Quadrant</span>
            <select
              value={form.quadrant}
              onChange={(e) => set('quadrant', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            >
              <option value="inhabited">Inhabited</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </label>
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Map X (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={form.coords.x}
              onChange={(e) => set('coords', { ...form.coords, x: Number(e.target.value) })}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Map Y (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={form.coords.y}
              onChange={(e) => set('coords', { ...form.coords, y: Number(e.target.value) })}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Interior Layout</span>
          <textarea
            value={form.interiorLayout}
            onChange={(e) => set('interiorLayout', e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>

        <div>
          <span className="text-sm font-display uppercase text-ink-soft block mb-1">Residents</span>
          <select
            multiple
            value={form.residents}
            onChange={(e) =>
              set(
                'residents',
                Array.from(e.target.selectedOptions).map((o) => o.value)
              )
            }
            className="w-full rounded-sm border border-leather bg-white/60 px-3 py-2 h-24"
          >
            {npcs.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </div>

        <ListEditor
          label="Wares"
          fields={[{ key: 'item', label: 'Item' }, { key: 'price', label: 'Price' }]}
          items={form.wares}
          onChange={(v) => set('wares', v)}
        />
        <ListEditor
          label="Menu"
          fields={[
            { key: 'item', label: 'Item' },
            { key: 'price', label: 'Price' },
            { key: 'notes', label: 'Notes' },
          ]}
          items={form.menu}
          onChange={(v) => set('menu', v)}
        />
        <ListEditor
          label="Services"
          fields={[{ key: 'service', label: 'Service' }, { key: 'notes', label: 'Notes' }]}
          items={form.services}
          onChange={(v) => set('services', v)}
        />

        <div className="flex justify-between pt-2">
          <div>
            {building && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm text-wax hover:text-wax-dark"
              >
                Delete building
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
