import { useMemo, useRef, useState } from 'react'
import { useData } from '../contexts/DataContext'
import MiniMapPicker from './MiniMapPicker'
import NpcPicker from './NpcPicker'
import { DND5E_ITEMS } from '../data/dnd5eItems'
import { formatPrice, effectivePrice } from '../utils/price'
import { ICON_OPTIONS, BuildingMarkerIcon } from './buildingIcons'

const DEFAULT_TYPES = ['Civic', 'Tavern', 'Shrine', 'Garrison', 'Shop', 'Residence', 'Ruin', 'Other']

function QuantityEditor({ value, onChange }) {
  const isInfinite = value === 'infinite'
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={() => onChange(isInfinite ? 1 : Math.max(0, Number(value || 0) - 1))}
        disabled={isInfinite}
        className="w-6 h-6 flex items-center justify-center border border-leather rounded-sm text-xs disabled:opacity-30"
      >
        −
      </button>
      <input
        type="text"
        value={isInfinite ? '∞' : value ?? 1}
        onChange={(e) => {
          const v = e.target.value.trim()
          if (v === '' || v === '∞') return
          const n = Number(v)
          if (!Number.isNaN(n)) onChange(Math.max(0, Math.round(n)))
        }}
        readOnly={isInfinite}
        className="w-10 text-center text-xs rounded-sm border border-leather bg-white/70 py-0.5"
      />
      <button
        type="button"
        onClick={() => onChange(isInfinite ? 1 : Number(value || 0) + 1)}
        disabled={isInfinite}
        className="w-6 h-6 flex items-center justify-center border border-leather rounded-sm text-xs disabled:opacity-30"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => onChange(isInfinite ? 1 : 'infinite')}
        title={isInfinite ? 'Make finite' : 'Set unlimited stock'}
        className={`w-6 h-6 flex items-center justify-center border rounded-sm text-xs ${
          isInfinite ? 'bg-moss-dark text-parchment border-moss-dark' : 'border-leather'
        }`}
      >
        ∞
      </button>
    </div>
  )
}

function CatalogList({ label, pool, rows, multiplier, onChange, sources }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [pendingId, setPendingId] = useState('')
  const [pendingCategory, setPendingCategory] = useState('')
  const [creating, setCreating] = useState(false)
  const [customForm, setCustomForm] = useState({ name: '', priceGp: '', description: '' })

  // Uploaded sources (see UploadSourceModal) are just another item catalog
  // alongside the built-in SRD one — normalized to the same {id, name,
  // priceGp, description, category} shape so every bit of browsing/search/
  // "add whole category" logic below works over both without a special
  // case. Their category is prefixed "Source:" so they group into their
  // own optgroups rather than colliding with SRD category names.
  const sourceItems = useMemo(() => {
    return (sources || []).flatMap((s) =>
      (s[pool] || []).map((item) => ({
        id: `source-${s.id}-${item.rowId}`,
        name: item.name,
        priceGp: item.basePrice,
        description: item.description,
        category: `Source: ${s.name}${s.category ? ` (${s.category})` : ''}`,
      }))
    )
  }, [sources, pool])

  const poolItems = useMemo(
    () => [...DND5E_ITEMS.filter((i) => i.pool === pool), ...sourceItems],
    [pool, sourceItems]
  )
  const grouped = useMemo(() => {
    const map = {}
    poolItems.forEach((i) => {
      if (!map[i.category]) map[i.category] = []
      map[i.category].push(i)
    })
    return map
  }, [poolItems])

  const suggestions = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    return poolItems
      .filter((i) => !existingNames.has(i.name.trim().toLowerCase()))
      .filter((i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      .slice(0, 20)
  }, [poolItems, query, existingNames])

  // A DM adding an item manually, then later "Add All"-ing a category that
  // happens to contain that same item, should never end up with it twice.
  // Everything below funnels through `isDuplicate`/`addNewOnly`, keyed on a
  // trimmed, case-insensitive name match — the natural identity of a
  // catalog row from the DM's point of view, regardless of which source
  // (SRD, a different source category, manual entry) it came from.
  const existingNames = useMemo(
    () => new Set(rows.map((r) => r.name.trim().toLowerCase())),
    [rows]
  )
  const [notice, setNotice] = useState('')

  function isDuplicate(name) {
    return existingNames.has(name.trim().toLowerCase())
  }

  function makeRow(item) {
    return {
      rowId: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: item.name,
      basePrice: item.priceGp,
      description: item.description,
      priceOverride: '',
      quantity: 1,
    }
  }

  function addItem(item) {
    if (isDuplicate(item.name)) {
      setNotice(`"${item.name}" is already in this list.`)
      return
    }
    setNotice('')
    onChange([...rows, makeRow(item)])
    setQuery('')
    setOpen(false)
    setPendingId('')
  }

  function handleDropdownAdd() {
    const item = poolItems.find((i) => i.id === pendingId)
    if (item) addItem(item)
  }

  function addWholeCategory() {
    if (!pendingCategory) return
    const items = grouped[pendingCategory] || []
    const newItems = items.filter((i) => !isDuplicate(i.name))
    const skipped = items.length - newItems.length
    onChange([...rows, ...newItems.map(makeRow)])
    if (newItems.length === 0) {
      setNotice(`Every item in "${pendingCategory}" is already in this list.`)
    } else if (skipped > 0) {
      setNotice(
        `Added ${newItems.length} new item${newItems.length === 1 ? '' : 's'} (${skipped} already in this list, skipped).`
      )
    } else {
      setNotice('')
    }
    setPendingCategory('')
  }

  function addCustom() {
    const name = customForm.name.trim()
    if (!name) return
    if (isDuplicate(name)) {
      setNotice(`"${name}" is already in this list.`)
      return
    }
    setNotice('')
    onChange([
      ...rows,
      {
        rowId: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        basePrice: Number(customForm.priceGp) || 0,
        description: customForm.description.trim(),
        priceOverride: '',
        quantity: 1,
      },
    ])
    setCustomForm({ name: '', priceGp: '', description: '' })
    setCreating(false)
  }

  function updateRow(rowId, key, value) {
    onChange(rows.map((r) => (r.rowId === rowId ? { ...r, [key]: value } : r)))
  }

  function removeRow(rowId) {
    onChange(rows.filter((r) => r.rowId !== rowId))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark">{label}</h4>
        <button
          type="button"
          onClick={() => setCreating((c) => !c)}
          className="text-xs text-moss-dark underline"
        >
          {creating ? 'Cancel' : `+ Create ${label.replace(/s$/, '')}`}
        </button>
      </div>

      {notice && (
        <p className="text-xs text-wax-dark bg-wax/10 border border-wax/30 rounded-sm px-2 py-1 mb-2">
          {notice}
        </p>
      )}

      {creating && (
        <div className="border border-moss/50 rounded-sm p-3 mb-2 space-y-2 bg-moss/5">
          <input
            value={customForm.name}
            onChange={(e) => setCustomForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Name"
            className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={customForm.priceGp}
              onChange={(e) => setCustomForm((f) => ({ ...f, priceGp: e.target.value }))}
              placeholder="Base price (gp)"
              className="w-32 rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
            />
            <input
              value={customForm.description}
              onChange={(e) => setCustomForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description"
              className="flex-1 rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={addCustom}
            disabled={!customForm.name.trim()}
            className="px-3 py-1.5 text-xs font-display uppercase tracking-wide bg-moss-dark text-parchment rounded-sm hover:bg-moss disabled:opacity-40"
          >
            Add to {label}
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-2">
        <select
          value={pendingId}
          onChange={(e) => {
            setPendingId(e.target.value)
            setNotice('')
          }}
          className="flex-1 rounded-sm border border-leather bg-white/60 px-2 py-2 text-sm"
        >
          <option value="">— browse by category —</option>
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
          onClick={handleDropdownAdd}
          disabled={!pendingId}
          className="px-3 py-2 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40 shrink-0"
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 mb-2">
        <select
          value={pendingCategory}
          onChange={(e) => {
            setPendingCategory(e.target.value)
            setNotice('')
          }}
          className="flex-1 rounded-sm border border-leather bg-white/60 px-2 py-2 text-sm"
        >
          <option value="">— add a whole category at once —</option>
          {Object.keys(grouped).map((cat) => (
            <option key={cat} value={cat}>
              {cat} ({grouped[cat].length} items)
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addWholeCategory}
          disabled={!pendingCategory}
          className="px-3 py-2 text-sm font-display uppercase tracking-wide bg-moss-dark text-parchment rounded-sm hover:bg-moss disabled:opacity-40 shrink-0"
        >
          Add All
        </button>
      </div>

      <div className="relative mb-2">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={`…or search ${label.toLowerCase()} by name or category`}
          className="w-full rounded-sm border border-leather bg-white/60 px-3 py-2 text-sm"
        />
        {open && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-parchment border border-leather rounded-sm shadow-lg max-h-56 overflow-y-auto">
            {suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => addItem(item)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-leather/10"
                >
                  <span>
                    {item.name}
                    <span className="text-xs text-ink-soft/60 italic"> — {item.category}</span>
                  </span>
                  <span className="font-mono text-xs shrink-0">{formatPrice(item.priceGp)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {open && query && suggestions.length === 0 && (
          <p className="absolute z-10 mt-1 w-full bg-parchment border border-leather rounded-sm shadow-lg px-3 py-2 text-xs text-ink-soft/60 italic">
            No matches — try "+ Create {label.replace(/s$/, '')}" above instead.
          </p>
        )}
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
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs text-ink-soft/70 font-mono">
                  base {formatPrice(row.basePrice)} × {multiplier.toFixed(1)} = {formatPrice(price)}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={row.priceOverride}
                  onChange={(e) => updateRow(row.rowId, 'priceOverride', e.target.value)}
                  placeholder="override (gp)"
                  className="w-24 rounded-sm border border-leather bg-white/70 px-2 py-1 text-xs"
                />
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="text-xs text-ink-soft/60 uppercase font-display">Qty</span>
                  <QuantityEditor
                    value={row.quantity ?? 1}
                    onChange={(v) => updateRow(row.rowId, 'quantity', v)}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function DmEditBuildingForm({ building, onClose }) {
  const { saveBuilding, removeBuilding, npcs, buildings, sources } = useData()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(
    building || {
      name: '',
      subheader: '',
      type: 'Other',
      icon: '',
      coords: { x: 50, y: 50 },
      quadrant: 'inhabited',
      interiorLayoutImage: '',
      description: '',
      residents: [],
      revealed: false,
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

  const [customTypeMode, setCustomTypeMode] = useState(
    () => building && building.type && !DEFAULT_TYPES.includes(building.type)
  )

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

  const [saveError, setSaveError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveError('')
    try {
      await saveBuilding(form)
      onClose()
    } catch (err) {
      console.error('Failed to save building:', err)
      setSaveError(err.message || 'Something went wrong while saving. Check the console for details.')
    }
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
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-5"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Type</span>
            {!customTypeMode ? (
              <select
                value={typeOptions.includes(form.type) ? form.type : ''}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCustomTypeMode(true)
                    set('type', '')
                  } else {
                    set('type', e.target.value)
                  }
                }}
                className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="__custom__">+ Custom type…</option>
              </select>
            ) : (
              <div className="flex gap-2 mt-1">
                <input
                  autoFocus
                  value={form.type}
                  onChange={(e) => set('type', e.target.value)}
                  placeholder="Type a new category name"
                  className="flex-1 rounded-sm border border-leather bg-white/60 px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCustomTypeMode(false)
                    set('type', typeOptions[0] || 'Other')
                  }}
                  className="text-xs text-ink-soft underline shrink-0"
                >
                  Use list
                </button>
              </div>
            )}
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

        <div>
          <span className="text-sm font-display uppercase text-ink-soft block mb-1">
            Map Icon
          </span>
          <p className="text-xs text-ink-soft/60 italic mb-2">
            Leave on "Match Type" to pick automatically from the Type field above, or choose one
            explicitly.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => set('icon', '')}
              className={`px-2 py-2 rounded-sm border flex items-center gap-1.5 text-xs ${
                !form.icon ? 'border-wax bg-wax/10' : 'border-leather'
              }`}
            >
              Match Type
            </button>
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => set('icon', opt.id)}
                title={opt.label}
                className={`w-9 h-9 rounded-sm border flex items-center justify-center ${
                  form.icon === opt.id ? 'border-wax bg-wax/10' : 'border-leather'
                }`}
              >
                <BuildingMarkerIcon icon={opt.id} className="w-4.5 h-4.5" />
              </button>
            ))}
          </div>
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
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.revealed}
              onChange={(e) => set('revealed', e.target.checked)}
            />
            <span className="text-sm font-display uppercase text-ink-soft">
              Revealed to players
            </span>
          </label>
          <p className="text-xs text-ink-soft/60 italic mt-1">
            The moment this is checked, every resident listed below has their NAME surfaced on
            the relationship tree — even ones you haven't individually marked visible. Their
            detail page stays hidden until you flip that resident's own "Visible to players"
            checkbox. Since a resident can be added to more than one building, they only need
            ONE of their buildings revealed for their name to show.
          </p>
        </div>

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
          sources={sources}
        />
        <CatalogList
          label="Menu"
          pool="menu"
          rows={form.menu}
          multiplier={form.priceMultiplier}
          onChange={(v) => set('menu', v)}
          sources={sources}
        />
        <CatalogList
          label="Services"
          pool="services"
          rows={form.services}
          multiplier={form.priceMultiplier}
          onChange={(v) => set('services', v)}
          sources={sources}
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
        {saveError && (
          <p className="text-sm text-wax bg-wax/10 border border-wax/40 rounded-sm px-3 py-2">
            {saveError}
          </p>
        )}
      </form>
    </div>
  )
}
