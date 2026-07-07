import { useMemo, useRef, useState } from 'react'
import { useData } from '../contexts/DataContext'
import MiniMapPicker from './MiniMapPicker'
import NpcPicker from './NpcPicker'
import { DND5E_ITEMS } from '../data/dnd5eItems'
import { formatPrice, effectivePrice } from '../utils/price'

const DEFAULT_TYPES = ['Civic', 'Tavern', 'Shrine', 'Garrison', 'Shop', 'Residence', 'Ruin', 'Other']

function CatalogList({ label, pool, rows, multiplier, onChange }) {
  const [pendingId, setPendingId] = useState('')

  const poolItems = useMemo(() => DND5E_ITEMS.filter((i) => i.pool === pool), [pool])
  const grouped = useMemo(() => {
    const map = {}
    poolItems.forEach((i) => {
      if (!map[i.category]) map[i.category] = []
      map[i.category].push(i)
    })
    return map
  }, [poolItems])

  function handleAdd() {
    const item = poolItems.find((i) => i.id === pendingId)
    if (!item) return
    onChange([
      ...rows,
      {
        rowId: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: item.name,
        basePrice: item.priceGp,
        description: item.description,
        priceOverride: '',
      },
    ])
    setPendingId('')
  }

  function updateOverride(rowId, value) {
    onChange(rows.map((r) => (r.rowId === rowId ? { ...r, priceOverride: value } : r)))
  }

  function removeRow(rowId) {
    onChange(rows.filter((r) => r.rowId !== rowId))
  }

  return (
    <div>
      <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">{label}</h4>
      <div className="flex gap-2 mb-2">
        <select
          value={pendingId}
          onChange={(e) => setPendingId(e.target.value)}
          className="flex-1 rounded-sm border border-leather bg-white/60 px-2 py-2 text-sm"
        >
          <option value="">— select an item to add —</option>
          {Object.entries(grouped).map(([cat, items]) => (
            <optgroup key={cat} label={cat}>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} — {formatPrice(i.priceGp)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!pendingId}
          className="px-3 py-2 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40 shrink-0"
        >
          Add
        </button>
      </div>
      {rows.length === 0 && (
        <p className="text-xs text-ink-soft/60 italic mb-2">Nothing added yet.</p>
      )}
      <ul className="space-y-2">
        {rows.map((row) => {
          const price = effectivePrice(row, multiplier)
          return (
            <li
              key={row.rowId}
              className="border border-leather/30 rounded-sm px-3 py-2 bg-white/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{row.name}</p>
                  {row.description && (
                    <p className="text-xs text-ink-soft/70 italic">{row.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(row.rowId)}
                  aria-label={`Remove ${row.name}`}
                  className="text-wax text-lg leading-none px-1 shrink-0"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-ink-soft/70 font-mono">
                  base {formatPrice(row.basePrice)} × {multiplier.toFixed(1)} = {formatPrice(price)}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={row.priceOverride}
                  onChange={(e) => updateOverride(row.rowId, e.target.value)}
                  placeholder="override (gp)"
                  className="ml-auto w-28 rounded-sm border border-leather bg-white/70 px-2 py-1 text-xs"
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function DmEditBuildingForm({ building, onClose }) {
  const { saveBuilding, removeBuilding, npcs, buildings } = useData()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(
    building || {
      name: '',
      subheader: '',
      type: 'Other',
      coords: { x: 50, y: 50 },
      quadrant: 'inhabited',
      interiorLayoutImage: '',
      description: '',
      residents: [],
      priceMultiplier: 1.5,
      wares: [],
      menu: [],
      services: [],
    }
  )

  const typeOptions = useMemo(() => {
    const fromData = buildings.map((b) => b.type).filter(Boolean)
    return [...new Set([...DEFAULT_TYPES, ...fromData])]
  }, [buildings])

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1.5 * 1024 * 1024) {
      alert(
        'That image is a bit large for the database (over 1.5MB). Try a smaller or more compressed image.'
      )
      return
    }
    const reader = new FileReader()
    reader.onload = () => set('interiorLayoutImage', reader.result)
    reader.readAsDataURL(file)
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
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5"
      >
        <h2 className="font-display text-xl text-leather-dark uppercase tracking-wide">
          {building ? 'Edit Building' : 'New Building'}
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
          <span className="text-sm font-display uppercase text-ink-soft">Sub-header</span>
          <input
            value={form.subheader}
            onChange={(e) => set('subheader', e.target.value)}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>

        {/* Interior layout image, moved up under subheader per request */}
        <div>
          <span className="text-sm font-display uppercase text-ink-soft block mb-1">
            Interior Layout
          </span>
          {form.interiorLayoutImage ? (
            <div className="relative">
              <img
                src={form.interiorLayoutImage}
                alt="Interior layout"
                className="w-full max-h-64 object-contain rounded-sm border border-leather bg-white/40"
              />
              <button
                type="button"
                onClick={() => set('interiorLayoutImage', '')}
                className="absolute top-2 right-2 bg-ink/70 text-parchment text-xs px-2 py-1 rounded-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 border-2 border-dashed border-leather/50 rounded-sm text-ink-soft/70 text-sm hover:bg-leather/5"
            >
              Click to upload a floorplan or interior image
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Type</span>
            <input
              list="building-type-options"
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
              placeholder="Type or choose…"
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
            <datalist id="building-type-options">
              {typeOptions.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
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
        </div>

        {/* Pin-drop map location picker, replacing raw X/Y inputs */}
        <div>
          <span className="text-sm font-display uppercase text-ink-soft block mb-1">
            Location on the Map
          </span>
          <MiniMapPicker coords={form.coords} onChange={(c) => set('coords', c)} />
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

        <div>
          <span className="text-sm font-display uppercase text-ink-soft block mb-1">Residents</span>
          <NpcPicker
            allNpcs={npcs}
            selectedIds={form.residents}
            onChange={(ids) => set('residents', ids)}
          />
        </div>

        <div>
          <label className="flex items-center gap-3">
            <span className="text-sm font-display uppercase text-ink-soft shrink-0">
              Price Multiplier
            </span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={form.priceMultiplier}
              onChange={(e) => set('priceMultiplier', Number(e.target.value))}
              className="flex-1"
            />
            <span className="font-mono text-sm w-12 text-right">
              {form.priceMultiplier.toFixed(1)}×
            </span>
          </label>
          <p className="text-xs text-ink-soft/60 italic mt-1">
            Applies to wares, menu, and service prices below — Jalanthar's remoteness and danger
            justify a markup over standard prices. Individual items can still be overridden.
          </p>
        </div>

        <CatalogList
          label="Wares"
          pool="wares"
          rows={form.wares}
          multiplier={form.priceMultiplier}
          onChange={(v) => set('wares', v)}
        />
        <CatalogList
          label="Menu"
          pool="menu"
          rows={form.menu}
          multiplier={form.priceMultiplier}
          onChange={(v) => set('menu', v)}
        />
        <CatalogList
          label="Services"
          pool="services"
          rows={form.services}
          multiplier={form.priceMultiplier}
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
