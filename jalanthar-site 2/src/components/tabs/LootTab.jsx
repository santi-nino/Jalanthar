import { useMemo, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { buildItemPool } from '../../utils/itemPool'
import { formatPrice } from '../../utils/price'
import { LOCATION_TYPES, VEHICLE_CATEGORIES } from '../../data/defaultLootTaxonomy'

const POOL_OPTIONS = [
  { id: 'wares', label: 'Wares' },
  { id: 'menu', label: 'Menu' },
  { id: 'services', label: 'Services' },
]

const DEFAULT_POOLS = {
  encounter: ['wares', 'services'],
  shop: ['wares'],
  restaurant: ['menu'],
  tavern: ['menu', 'wares'],
  exploration: ['wares', 'services'],
}

function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomInt(min, max) {
  const lo = Math.min(min, max)
  const hi = Math.max(min, max)
  return Math.round(lo + Math.random() * (hi - lo))
}

// Every place that needs "the available categories for these pools" goes
// through here so the vehicles/mounts default-exclusion is applied
// consistently. Deliberately NOT in utils/itemPool.js -- the building
// catalog editor uses that same buildItemPool() and SHOULD always show
// Mount/Vehicle normally (stocking a livery is a different use case from
// rolling loot).
function categoriesForPools(pools, sources, includeVehicles) {
  const combined = pools.flatMap((p) => buildItemPool(p, sources))
  const filtered = includeVehicles
    ? combined
    : combined.filter((i) => !VEHICLE_CATEGORIES.includes(i.category))
  return [...new Set(filtered.map((i) => i.category))].sort((a, b) => a.localeCompare(b))
}

// Union of every excluded category across whichever attribute values are
// currently selected -- this is the "mage wouldn't have a weapon"
// mechanism: each attribute option can carry its own excludedCategories
// list, and any of them being selected removes that category from what
// can be drawn for this entity/location.
function excludedCategoriesFor(attributes, values) {
  const excluded = new Set()
  ;(attributes || []).forEach((attr) => {
    const selected = values[attr.id]
    const cats = selected && attr.excludedCategories?.[selected]
    if (cats) cats.forEach((c) => excluded.add(c))
  })
  return excluded
}

function drawLoot({
  pools, sources, categories, priceMin, priceMax, count, allowDuplicates, includeVehicles, hardExcludedCategories,
}) {
  let pool = pools.flatMap((p) => buildItemPool(p, sources).map((item) => ({ ...item, pool: p })))
  if (!includeVehicles) pool = pool.filter((i) => !VEHICLE_CATEGORIES.includes(i.category))
  if (hardExcludedCategories && hardExcludedCategories.size > 0) {
    pool = pool.filter((i) => !hardExcludedCategories.has(i.category))
  }
  const filtered = pool.filter((i) => {
    if (categories.length > 0 && !categories.includes(i.category)) return false
    if (priceMin != null && i.priceGp < priceMin) return false
    if (priceMax != null && i.priceGp > priceMax) return false
    return true
  })
  const n = Math.max(0, Math.round(Number(count) || 0))
  if (n === 0 || filtered.length === 0) return []
  if (allowDuplicates) {
    return Array.from({ length: n }, () => filtered[Math.floor(Math.random() * filtered.length)])
  }
  return shuffled(filtered).slice(0, n)
}

// --- Small reusable pieces ---------------------------------------------

function EditableList({ label, items, onChange, onRename, placeholder }) {
  const [input, setInput] = useState('')
  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')

  function add() {
    const v = input.trim()
    if (v && !items.includes(v)) onChange([...items, v])
    setInput('')
  }
  function remove(v) {
    onChange(items.filter((x) => x !== v))
  }
  function startEdit(v) {
    setEditing(v)
    setEditValue(v)
  }
  function commitEdit() {
    const newVal = editValue.trim()
    if (!newVal || newVal === editing || items.includes(newVal)) {
      setEditing(null)
      return
    }
    onChange(items.map((x) => (x === editing ? newVal : x)))
    onRename?.(editing, newVal)
    setEditing(null)
  }

  return (
    <div>
      {label && <span className="text-xs font-display uppercase text-ink-soft block mb-1">{label}</span>}
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {items.map((v) =>
          editing === v ? (
            <input
              key={v}
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  commitEdit()
                }
                if (e.key === 'Escape') setEditing(null)
              }}
              className="rounded-sm border border-leather bg-white px-2 py-0.5 text-xs w-28"
            />
          ) : (
            <span key={v} className="inline-flex items-center gap-1 bg-white/60 border border-leather/40 rounded-sm pl-2 pr-1 py-0.5 text-xs">
              <button type="button" onClick={() => startEdit(v)} title="Click to rename" className="hover:underline">
                {v}
              </button>
              <button
                type="button"
                onClick={() => remove(v)}
                aria-label={`Remove ${v}`}
                className="text-wax-dark hover:text-wax font-bold leading-none px-0.5"
              >
                ×
              </button>
            </span>
          )
        )}
        {items.length === 0 && <span className="text-xs text-ink-soft/50 italic">None yet</span>}
      </div>
      <div className="flex gap-1.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs"
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="px-2 py-1 text-xs font-display uppercase bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </div>
  )
}

function EditableWealthList({ items, onChange }) {
  const [form, setForm] = useState({ label: '', min: '', max: '', minItems: '', maxItems: '' })
  const [editingId, setEditingId] = useState(null)
  const [editLabel, setEditLabel] = useState('')

  function add() {
    const label = form.label.trim()
    if (!label) return
    onChange([
      ...items,
      {
        id: `wealth-${Date.now()}`,
        label,
        min: Number(form.min) || 0,
        max: Number(form.max) || 0,
        minItems: Number(form.minItems) || 0,
        maxItems: Number(form.maxItems) || 0,
      },
    ])
    setForm({ label: '', min: '', max: '', minItems: '', maxItems: '' })
  }
  function remove(id) {
    onChange(items.filter((w) => w.id !== id))
  }
  function updateField(id, key, value) {
    onChange(items.map((w) => (w.id === id ? { ...w, [key]: Number(value) || 0 } : w)))
  }
  function commitLabel(id) {
    const v = editLabel.trim()
    if (v) onChange(items.map((w) => (w.id === id ? { ...w, label: v } : w)))
    setEditingId(null)
  }

  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1">
        Wealth Levels{' '}
        <span className="text-ink-soft/50 normal-case">
          — sets both the gp price range AND how many items get rolled (no separate item-count
          option; it's always driven by wealth)
        </span>
      </span>
      <div className="space-y-1 mb-1.5">
        {items.map((w) => (
          <div key={w.id} className="flex flex-wrap items-center gap-2 bg-white/60 border border-leather/40 rounded-sm px-2 py-1 text-xs">
            {editingId === w.id ? (
              <input
                autoFocus
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onBlur={() => commitLabel(w.id)}
                onKeyDown={(e) => e.key === 'Enter' && commitLabel(w.id)}
                className="w-24 rounded-sm border border-leather bg-white px-1 py-0.5"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditingId(w.id)
                  setEditLabel(w.label)
                }}
                title="Click to rename"
                className="flex-1 text-left hover:underline min-w-[5rem]"
              >
                {w.label}
              </button>
            )}
            <span className="text-ink-soft/50">gp</span>
            <input type="number" min="0" value={w.min} onChange={(e) => updateField(w.id, 'min', e.target.value)} className="w-14 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span>–</span>
            <input type="number" min="0" value={w.max} onChange={(e) => updateField(w.id, 'max', e.target.value)} className="w-14 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span className="text-ink-soft/50 ml-2"># items</span>
            <input type="number" min="0" value={w.minItems} onChange={(e) => updateField(w.id, 'minItems', e.target.value)} className="w-12 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span>–</span>
            <input type="number" min="0" value={w.maxItems} onChange={(e) => updateField(w.id, 'maxItems', e.target.value)} className="w-12 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <button type="button" onClick={() => remove(w.id)} aria-label={`Remove ${w.label}`} className="text-wax-dark hover:text-wax font-bold leading-none px-1">×</button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label" className="rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs w-24" />
        <input type="number" min="0" value={form.min} onChange={(e) => setForm({ ...form, min: e.target.value })} placeholder="Min gp" className="w-16 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.max} onChange={(e) => setForm({ ...form, max: e.target.value })} placeholder="Max gp" className="w-16 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.minItems} onChange={(e) => setForm({ ...form, minItems: e.target.value })} placeholder="Min #" className="w-14 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.maxItems} onChange={(e) => setForm({ ...form, maxItems: e.target.value })} placeholder="Max #" className="w-14 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <button type="button" onClick={add} disabled={!form.label.trim()} className="px-2 py-1 text-xs font-display uppercase bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40">Add</button>
      </div>
    </div>
  )
}

function MonsterTypeCategoryMapper({ monsterTypes, mapping, allCategories, onChange }) {
  const [selectedType, setSelectedType] = useState(monsterTypes[0] || '')
  const current = mapping[selectedType] || []

  function toggle(cat) {
    const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat]
    onChange({ ...mapping, [selectedType]: next })
  }

  if (monsterTypes.length === 0) {
    return <p className="text-xs text-ink-soft/50 italic">Add a monster type above first.</p>
  }

  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1">
        Monster Type → Categories{' '}
        <span className="text-ink-soft/50 normal-case">(coarse filter: which item categories are eligible at all for a type -- leave untouched to allow everything)</span>
      </span>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-xs mb-1.5">
        {monsterTypes.map((t) => (
          <option key={t} value={t}>{t} {mapping[t]?.length ? `(${mapping[t].length} allowed)` : '(all allowed)'}</option>
        ))}
      </select>
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
        {allCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => toggle(cat)}
            className={`text-xs rounded-sm px-2 py-1 border ${current.includes(cat) ? 'bg-moss-dark text-parchment border-moss-dark' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}
          >
            {cat}
          </button>
        ))}
        {allCategories.length === 0 && <span className="text-xs text-ink-soft/50 italic">No categories available yet.</span>}
      </div>
    </div>
  )
}

// Editor for ONE attribute (e.g. Beast's "Diet"): rename the attribute
// itself, manage its option list, and manage which categories each
// individual option excludes.
function AttributeEditor({ attribute, allCategories, onChange, onDelete }) {
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(attribute.name)
  const [exclusionOption, setExclusionOption] = useState(attribute.options[0] || '')

  function commitName() {
    const v = nameValue.trim()
    if (v) onChange({ ...attribute, name: v })
    setEditingName(false)
  }
  function setOptions(newOptions) {
    // Dropping an option should also drop its exclusion entry so it
    // doesn't linger invisibly.
    const nextExcluded = { ...attribute.excludedCategories }
    Object.keys(nextExcluded).forEach((k) => {
      if (!newOptions.includes(k)) delete nextExcluded[k]
    })
    onChange({ ...attribute, options: newOptions, excludedCategories: nextExcluded })
    if (!newOptions.includes(exclusionOption)) setExclusionOption(newOptions[0] || '')
  }
  function renameOption(oldName, newName) {
    const nextExcluded = { ...attribute.excludedCategories }
    if (nextExcluded[oldName]) {
      nextExcluded[newName] = nextExcluded[oldName]
      delete nextExcluded[oldName]
    }
    onChange({ ...attribute, excludedCategories: nextExcluded })
    if (exclusionOption === oldName) setExclusionOption(newName)
  }
  function toggleExclusion(cat) {
    const current = attribute.excludedCategories?.[exclusionOption] || []
    const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat]
    onChange({ ...attribute, excludedCategories: { ...attribute.excludedCategories, [exclusionOption]: next } })
  }

  const currentExclusions = attribute.excludedCategories?.[exclusionOption] || []

  return (
    <div className="border border-leather/30 rounded-sm bg-white/50 p-2.5 space-y-2">
      <div className="flex items-center gap-2">
        {editingName ? (
          <input
            autoFocus
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => e.key === 'Enter' && commitName()}
            className="flex-1 rounded-sm border border-leather bg-white px-2 py-1 text-sm font-display"
          />
        ) : (
          <button type="button" onClick={() => setEditingName(true)} title="Click to rename" className="flex-1 text-left font-display text-sm text-leather-dark hover:underline">
            {attribute.name}
          </button>
        )}
        <button type="button" onClick={onDelete} className="text-xs text-wax-dark hover:text-wax underline shrink-0">
          Delete attribute
        </button>
      </div>
      <EditableList label="Options" items={attribute.options} onChange={setOptions} onRename={renameOption} placeholder="e.g. Herbivore" />
      {attribute.options.length > 0 && allCategories.length > 0 && (
        <div>
          <span className="text-xs font-display uppercase text-ink-soft block mb-1">
            Excluded categories per option <span className="text-ink-soft/50 normal-case">(this option never pulls these)</span>
          </span>
          <select value={exclusionOption} onChange={(e) => setExclusionOption(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1 text-xs mb-1">
            {attribute.options.map((o) => (
              <option key={o} value={o}>
                {o} {attribute.excludedCategories?.[o]?.length ? `(${attribute.excludedCategories[o].length} excluded)` : ''}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-1.5">
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleExclusion(cat)}
                className={`text-xs rounded-sm px-2 py-1 border ${currentExclusions.includes(cat) ? 'bg-wax text-parchment border-wax' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Full attribute SET editor for one type (e.g. all of Beast's attributes:
// Diet, Size, Animal Kingdom).
function AttributeSetEditor({ attributes, allCategories, onChange }) {
  const [newName, setNewName] = useState('')

  function addAttribute() {
    const name = newName.trim()
    if (!name) return
    onChange([...attributes, { id: `attr-${Date.now()}`, name, options: [], excludedCategories: {} }])
    setNewName('')
  }
  function updateAttribute(id, updated) {
    onChange(attributes.map((a) => (a.id === id ? updated : a)))
  }
  function deleteAttribute(id) {
    onChange(attributes.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-2">
      {attributes.map((attr) => (
        <AttributeEditor
          key={attr.id}
          attribute={attr}
          allCategories={allCategories}
          onChange={(updated) => updateAttribute(attr.id, updated)}
          onDelete={() => deleteAttribute(attr.id)}
        />
      ))}
      {attributes.length === 0 && <p className="text-xs text-ink-soft/50 italic">No custom fields yet for this type.</p>}
      <div className="flex gap-1.5">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addAttribute()}
          placeholder="New field name, e.g. Diet"
          className="flex-1 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs"
        />
        <button type="button" onClick={addAttribute} disabled={!newName.trim()} className="px-2 py-1 text-xs font-display uppercase bg-moss-dark text-parchment rounded-sm hover:opacity-90 disabled:opacity-40">
          + Add Field
        </button>
      </div>
    </div>
  )
}

// Generic wrapper: pick which type (monster type OR location type) to
// configure, then edit that type's attribute set. Used for both.
function TypeAttributeManager({ label, types, typeLabels, attributesByType, allCategories, onChange }) {
  const [selectedType, setSelectedType] = useState(types[0] || '')
  if (types.length === 0) return null
  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1.5">{label}</span>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm mb-2">
        {types.map((t) => (
          <option key={t} value={t}>{typeLabels ? typeLabels[t] : t}</option>
        ))}
      </select>
      <AttributeSetEditor
        attributes={attributesByType[selectedType] || []}
        allCategories={allCategories}
        onChange={(v) => onChange({ ...attributesByType, [selectedType]: v })}
      />
    </div>
  )
}

function TaxonomyManager({ taxonomy, onSave, sources }) {
  const allCategories = useMemo(() => categoriesForPools(['wares', 'menu', 'services'], sources, true), [sources])
  const locationTypeIds = LOCATION_TYPES.map((t) => t.id)
  const locationTypeLabels = Object.fromEntries(LOCATION_TYPES.map((t) => [t.id, t.label]))

  function renameMonsterType(oldName, newName) {
    if (taxonomy.monsterTypeCategories?.[oldName]) {
      const next = { ...taxonomy.monsterTypeCategories }
      next[newName] = next[oldName]
      delete next[oldName]
      onSave({ monsterTypeCategories: next })
    }
    if (taxonomy.monsterTypeAttributes?.[oldName]) {
      const next = { ...taxonomy.monsterTypeAttributes }
      next[newName] = next[oldName]
      delete next[oldName]
      onSave({ monsterTypeAttributes: next })
    }
  }

  return (
    <div className="border border-leather/50 rounded-sm bg-parchment/60 p-4 space-y-5">
      <p className="text-xs text-ink-soft/60 italic">
        These lists are the Loot tab's own — kept completely separate from any NPC species, job,
        or class list elsewhere on the site. Click any entry to rename it; changes save
        immediately.
      </p>
      <EditableWealthList items={taxonomy.wealthLevels} onChange={(v) => onSave({ wealthLevels: v })} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EditableList
          label="Monster Types"
          items={taxonomy.monsterTypes}
          onChange={(v) => onSave({ monsterTypes: v })}
          onRename={renameMonsterType}
          placeholder="e.g. Celestial"
        />
        <EditableList label="Settings" items={taxonomy.settings} onChange={(v) => onSave({ settings: v })} placeholder="e.g. Volcanic" />
        <EditableList label="Monster Catalog (searchable)" items={taxonomy.monsterCatalog || []} onChange={(v) => onSave({ monsterCatalog: v })} placeholder="e.g. Owlbear" />
        <EditableList label="Shop Types" items={taxonomy.shopTypes} onChange={(v) => onSave({ shopTypes: v })} placeholder="e.g. Alchemist" />
        <EditableList label="Restaurant Types" items={taxonomy.restaurantTypes} onChange={(v) => onSave({ restaurantTypes: v })} placeholder="e.g. Noble Feast Hall" />
        <EditableList label="Tavern Types" items={taxonomy.tavernTypes} onChange={(v) => onSave({ tavernTypes: v })} placeholder="e.g. Sailor's Dive" />
        <EditableList label="Exploration Types" items={taxonomy.explorationTypes} onChange={(v) => onSave({ explorationTypes: v })} placeholder="e.g. Sunken Temple" />
      </div>

      <MonsterTypeCategoryMapper
        monsterTypes={taxonomy.monsterTypes}
        mapping={taxonomy.monsterTypeCategories || {}}
        allCategories={allCategories}
        onChange={(v) => onSave({ monsterTypeCategories: v })}
      />

      <TypeAttributeManager
        label="Monster Type Fields (this is what changes per monster type -- e.g. Beast gets Diet/Size instead of a generic Class)"
        types={taxonomy.monsterTypes}
        attributesByType={taxonomy.monsterTypeAttributes || {}}
        allCategories={allCategories}
        onChange={(v) => onSave({ monsterTypeAttributes: v })}
      />

      <TypeAttributeManager
        label="Location Type Fields (extra options per Shop/Restaurant/Tavern/Exploration)"
        types={locationTypeIds}
        typeLabels={locationTypeLabels}
        attributesByType={taxonomy.locationTypeAttributes || {}}
        allCategories={allCategories}
        onChange={(v) => onSave({ locationTypeAttributes: v })}
      />
    </div>
  )
}

function PoolAndCategoryPicker({ pools, onPoolsChange, categories, onCategoriesChange, availableCategories, includeVehicles, onIncludeVehiclesChange }) {
  return (
    <div className="space-y-2">
      <div>
        <span className="text-xs font-display uppercase text-ink-soft block mb-1">Draw From</span>
        <div className="flex gap-3 flex-wrap items-center">
          {POOL_OPTIONS.map((p) => (
            <label key={p.id} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={pools.includes(p.id)} onChange={() => onPoolsChange(pools.includes(p.id) ? pools.filter((x) => x !== p.id) : [...pools, p.id])} />
              {p.label}
            </label>
          ))}
          <label className="flex items-center gap-1.5 text-sm ml-2 pl-2 border-l border-leather/30">
            <input type="checkbox" checked={includeVehicles} onChange={(e) => onIncludeVehiclesChange(e.target.checked)} />
            Include vehicles &amp; mounts
          </label>
        </div>
      </div>
      {availableCategories.length > 0 && (
        <div>
          <span className="text-xs font-display uppercase text-ink-soft block mb-1">Categories <span className="text-ink-soft/50 normal-case">(none = all)</span></span>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoriesChange(categories.includes(cat) ? categories.filter((c) => c !== cat) : [...categories, cat])}
                className={`text-xs rounded-sm px-2 py-1 border ${categories.includes(cat) ? 'bg-leather text-parchment border-leather' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Renders one <select> per configured attribute for the current type --
// this is what actually swaps in "Diet / Size / Animal Kingdom" when
// Beast is picked instead of a fixed Class field.
function DynamicAttributeFields({ attributes, values, onChange }) {
  if (!attributes || attributes.length === 0) return null
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {attributes.map((attr) => (
        <label key={attr.id} className="block">
          <span className="text-xs font-display uppercase text-ink-soft">{attr.name}</span>
          <select
            value={values[attr.id] || ''}
            onChange={(e) => onChange(attr.id, e.target.value)}
            className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
          >
            <option value="">—</option>
            {attr.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
      ))}
    </div>
  )
}

function ResultsPanel({ groups, onCopy, copied }) {
  const grandTotal = groups.reduce((sum, g) => sum + g.items.reduce((s, i) => s + (i.priceGp || 0), 0) + (g.gold || 0), 0)
  return (
    <div className="border border-gold rounded-sm bg-parchment paper-texture p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-leather-dark">Results</h3>
        <button type="button" onClick={onCopy} className="text-xs text-moss-dark underline">{copied ? 'Copied!' : 'Copy as text'}</button>
      </div>
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.label && <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark/80 border-b border-leather/30 pb-1 mb-1.5">{g.label}</h4>}
          {g.gold != null && <p className="text-sm font-display text-leather-dark mb-1">{g.gold} gp in coin</p>}
          {g.items.length === 0 ? (
            <p className="text-xs text-ink-soft italic">Nothing — widen the filters.</p>
          ) : (
            <ul className="space-y-1">
              {g.items.map((item, i) => (
                <li key={`${item.id}-${i}`} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <span className="font-display text-leather-dark">{item.name}</span>
                    <span className="ml-2 text-xs text-ink-soft/60 italic">{item.category}</span>
                    {item.description && <p className="text-xs text-ink-soft/70 italic">{item.description}</p>}
                  </div>
                  <span className="text-xs text-ink-soft shrink-0">{formatPrice(item.priceGp)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <p className="text-sm font-display text-leather-dark text-right pt-1 border-t border-leather/30">Grand Total: {formatPrice(grandTotal)}</p>
    </div>
  )
}

// --- Encounter flow -------------------------------------------------------

function EntityBuilder({ taxonomy, sources, onAdd }) {
  const [monsterType, setMonsterType] = useState('')
  const [monsterName, setMonsterName] = useState('')
  const [attributeValues, setAttributeValues] = useState({})
  const [wealthId, setWealthId] = useState(taxonomy.wealthLevels[0]?.id || '')
  const [setting, setSetting] = useState('')
  const [notes, setNotes] = useState('')
  const [pools, setPools] = useState(DEFAULT_POOLS.encounter)
  const [categories, setCategories] = useState([])
  const [includeVehicles, setIncludeVehicles] = useState(false)

  const typeAttributes = useMemo(
    () => taxonomy.monsterTypeAttributes?.[monsterType] || [],
    [taxonomy.monsterTypeAttributes, monsterType]
  )
  const hardExcluded = useMemo(() => excludedCategoriesFor(typeAttributes, attributeValues), [typeAttributes, attributeValues])

  const availableCategories = useMemo(() => {
    let base = categoriesForPools(pools, sources, includeVehicles)
    const restriction = taxonomy.monsterTypeCategories?.[monsterType]
    if (restriction && restriction.length > 0) base = base.filter((c) => restriction.includes(c))
    return base.filter((c) => !hardExcluded.has(c))
  }, [pools, sources, includeVehicles, taxonomy.monsterTypeCategories, monsterType, hardExcluded])

  function handleMonsterTypeChange(value) {
    setMonsterType(value)
    setAttributeValues({})
    const restriction = taxonomy.monsterTypeCategories?.[value]
    if (restriction && restriction.length > 0) {
      setCategories((prev) => prev.filter((c) => restriction.includes(c)))
    }
  }

  function handleAdd() {
    onAdd({
      id: `entity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      monsterType,
      monsterName,
      attributeValues,
      wealthId,
      setting,
      notes,
      pools,
      categories,
      includeVehicles,
      hardExcludedList: [...hardExcluded],
    })
    setNotes('')
  }

  return (
    <div className="border border-leather/40 rounded-sm bg-white/40 p-3 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <label className="block">
          <span className="text-xs font-display uppercase text-ink-soft">Monster Type</span>
          <select value={monsterType} onChange={(e) => handleMonsterTypeChange(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm">
            <option value="">—</option>
            {taxonomy.monsterTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-display uppercase text-ink-soft">Specific Monster (5e/5.5e, optional)</span>
          <input
            list="loot-monster-catalog"
            value={monsterName}
            onChange={(e) => setMonsterName(e.target.value)}
            placeholder="Search or type, e.g. Bandit"
            className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
          />
          <datalist id="loot-monster-catalog">
            {(taxonomy.monsterCatalog || []).map((m) => <option key={m} value={m} />)}
          </datalist>
        </label>
        <label className="block">
          <span className="text-xs font-display uppercase text-ink-soft">Wealth</span>
          <select value={wealthId} onChange={(e) => setWealthId(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm">
            {taxonomy.wealthLevels.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
          </select>
        </label>
      </div>

      <DynamicAttributeFields
        attributes={typeAttributes}
        values={attributeValues}
        onChange={(attrId, val) => setAttributeValues((prev) => ({ ...prev, [attrId]: val }))}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className="block">
          <span className="text-xs font-display uppercase text-ink-soft">Setting</span>
          <select value={setting} onChange={(e) => setSetting(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm">
            <option value="">—</option>
            {taxonomy.settings.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-display uppercase text-ink-soft">Notes (optional)</span>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. pack leader, wounded" className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm" />
        </label>
      </div>

      {hardExcluded.size > 0 && (
        <p className="text-xs text-ink-soft/60 italic">
          Auto-excluded for this entity: {[...hardExcluded].join(', ')}
        </p>
      )}

      <PoolAndCategoryPicker
        pools={pools}
        onPoolsChange={setPools}
        categories={categories}
        onCategoriesChange={setCategories}
        availableCategories={availableCategories}
        includeVehicles={includeVehicles}
        onIncludeVehiclesChange={setIncludeVehicles}
      />

      <button type="button" onClick={handleAdd} className="w-full py-2 text-sm font-display uppercase tracking-wide bg-moss-dark text-parchment rounded-sm hover:opacity-90">
        + Add Entity
      </button>
    </div>
  )
}

// --- Main tab ---------------------------------------------------------

export default function LootTab() {
  const { sources, lootTaxonomy, saveLootTaxonomy } = useData()
  const [showTaxonomy, setShowTaxonomy] = useState(false)

  const [generationType, setGenerationType] = useState(null)

  const [entities, setEntities] = useState([])

  const [locationType, setLocationType] = useState(null)
  const [subtype, setSubtype] = useState('')
  const [locAttributeValues, setLocAttributeValues] = useState({})
  const [locWealthId, setLocWealthId] = useState(lootTaxonomy.wealthLevels[0]?.id || '')
  const [locPools, setLocPools] = useState(DEFAULT_POOLS.shop)
  const [locCategories, setLocCategories] = useState([])
  const [locAllowDuplicates, setLocAllowDuplicates] = useState(false)
  const [locIncludeVehicles, setLocIncludeVehicles] = useState(false)

  const [results, setResults] = useState(null)
  const [copied, setCopied] = useState(false)

  const currentLocationType = LOCATION_TYPES.find((t) => t.id === locationType)
  const locTypeAttributes = useMemo(
    () => lootTaxonomy.locationTypeAttributes?.[locationType] || [],
    [lootTaxonomy.locationTypeAttributes, locationType]
  )
  const locHardExcluded = useMemo(() => excludedCategoriesFor(locTypeAttributes, locAttributeValues), [locTypeAttributes, locAttributeValues])

  const locAvailableCategories = useMemo(() => {
    const base = categoriesForPools(locPools, sources, locIncludeVehicles)
    return base.filter((c) => !locHardExcluded.has(c))
  }, [locPools, sources, locIncludeVehicles, locHardExcluded])

  function pickLocationType(type) {
    setLocationType(type)
    setSubtype('')
    setLocAttributeValues({})
    setLocPools(DEFAULT_POOLS[type] || ['wares'])
    setResults(null)
  }

  function removeEntity(id) {
    setEntities(entities.filter((e) => e.id !== id))
  }

  function wealthLevel(wealthId) {
    return lootTaxonomy.wealthLevels.find((x) => x.id === wealthId)
  }

  function generateEncounter() {
    const groups = entities.map((e) => {
      const w = wealthLevel(e.wealthId)
      const count = w ? randomInt(w.minItems ?? 1, w.maxItems ?? 1) : 0
      const items = drawLoot({
        pools: e.pools,
        sources,
        categories: e.categories,
        priceMin: w?.min ?? null,
        priceMax: w?.max ?? null,
        count,
        allowDuplicates: false,
        includeVehicles: e.includeVehicles,
        hardExcludedCategories: new Set(e.hardExcludedList || []),
      })
      const attrTags = Object.values(e.attributeValues || {}).filter(Boolean)
      const tags = [e.monsterName || e.monsterType, ...attrTags, w?.label, e.setting, e.notes].filter(Boolean)
      return { label: tags.join(' · ') || 'Entity', items, gold: null }
    })
    setResults(groups)
    setCopied(false)
  }

  function generateLocation() {
    const w = wealthLevel(locWealthId)
    const count = w ? randomInt(w.minItems ?? 1, w.maxItems ?? 1) : 0
    const items = drawLoot({
      pools: locPools,
      sources,
      categories: locCategories,
      priceMin: w?.min ?? null,
      priceMax: w?.max ?? null,
      count,
      allowDuplicates: locAllowDuplicates,
      includeVehicles: locIncludeVehicles,
      hardExcludedCategories: locHardExcluded,
    })
    setResults([{ label: '', items, gold: null }])
    setCopied(false)
  }

  function copyToClipboard() {
    if (!results) return
    const lines = []
    results.forEach((g) => {
      if (g.label) lines.push(`— ${g.label} —`)
      if (g.gold != null) lines.push(`${g.gold} gp`)
      g.items.forEach((i) => lines.push(`${i.name} (${formatPrice(i.priceGp)})`))
    })
    navigator.clipboard?.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl text-leather-dark">Loot Generator</h2>
          <p className="text-xs text-ink-soft/60 italic mt-1">
            DM-only. Pulls from the same SRD catalog and uploaded sources used across the site.
            Vehicles &amp; mounts are excluded unless you say otherwise.
          </p>
        </div>
        <button type="button" onClick={() => setShowTaxonomy((s) => !s)} className="text-xs text-moss-dark underline shrink-0 whitespace-nowrap">
          {showTaxonomy ? 'Hide categories' : 'Edit categories'}
        </button>
      </div>

      {showTaxonomy && <TaxonomyManager taxonomy={lootTaxonomy} onSave={saveLootTaxonomy} sources={sources} />}

      <div className="border border-leather/50 rounded-sm bg-parchment paper-texture p-4 space-y-4">
        <div>
          <span className="text-sm font-display uppercase text-ink-soft block mb-1.5">What are you generating loot for?</span>
          <div className="flex gap-3">
            {['location', 'encounter'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setGenerationType(t); setResults(null) }}
                className={`flex-1 py-2.5 text-sm font-display uppercase tracking-wide rounded-sm border ${generationType === t ? 'bg-leather text-parchment border-leather' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}
              >
                {t === 'location' ? 'Location' : 'Encounter'}
              </button>
            ))}
          </div>
        </div>

        {generationType === 'encounter' && (
          <div className="space-y-4">
            <EntityBuilder taxonomy={lootTaxonomy} sources={sources} onAdd={(e) => setEntities([...entities, e])} />

            {entities.length > 0 && (
              <div>
                <span className="text-xs font-display uppercase text-ink-soft block mb-1.5">Entities ({entities.length})</span>
                <ul className="space-y-1">
                  {entities.map((e) => {
                    const wealthLabel = lootTaxonomy.wealthLevels.find((w) => w.id === e.wealthId)?.label
                    const attrTags = Object.values(e.attributeValues || {}).filter(Boolean)
                    const tags = [e.monsterName || e.monsterType, ...attrTags, wealthLabel, e.setting, e.notes].filter(Boolean)
                    return (
                      <li key={e.id} className="flex items-center justify-between gap-2 bg-white/50 border border-leather/30 rounded-sm px-2 py-1.5 text-sm">
                        <span>{tags.join(' · ') || 'Unnamed entity'}</span>
                        <button type="button" onClick={() => removeEntity(e.id)} aria-label="Remove entity" className="text-wax-dark hover:text-wax font-bold leading-none px-1">×</button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={generateEncounter}
              disabled={entities.length === 0}
              className="w-full py-2.5 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40"
            >
              {results ? 'Reroll' : 'Generate Loot'}
            </button>
          </div>
        )}

        {generationType === 'location' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-display uppercase text-ink-soft block mb-1.5">What kind of location?</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LOCATION_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => pickLocationType(t.id)}
                    className={`py-2 text-xs font-display uppercase tracking-wide rounded-sm border ${locationType === t.id ? 'bg-leather text-parchment border-leather' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {currentLocationType && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-display uppercase text-ink-soft">{currentLocationType.label} Type</span>
                    <select value={subtype} onChange={(e) => setSubtype(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-2 py-1.5 text-sm">
                      <option value="">—</option>
                      {(lootTaxonomy[currentLocationType.taxonomyKey] || []).map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-display uppercase text-ink-soft">Wealth</span>
                    <select value={locWealthId} onChange={(e) => setLocWealthId(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-2 py-1.5 text-sm">
                      {lootTaxonomy.wealthLevels.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
                    </select>
                  </label>
                </div>

                <DynamicAttributeFields
                  attributes={locTypeAttributes}
                  values={locAttributeValues}
                  onChange={(attrId, val) => setLocAttributeValues((prev) => ({ ...prev, [attrId]: val }))}
                />

                {locHardExcluded.size > 0 && (
                  <p className="text-xs text-ink-soft/60 italic">Auto-excluded: {[...locHardExcluded].join(', ')}</p>
                )}

                <PoolAndCategoryPicker
                  pools={locPools}
                  onPoolsChange={setLocPools}
                  categories={locCategories}
                  onCategoriesChange={setLocCategories}
                  availableCategories={locAvailableCategories}
                  includeVehicles={locIncludeVehicles}
                  onIncludeVehiclesChange={setLocIncludeVehicles}
                />

                <label className="flex items-center gap-1.5 text-xs">
                  <input type="checkbox" checked={locAllowDuplicates} onChange={(e) => setLocAllowDuplicates(e.target.checked)} />
                  Allow duplicates
                </label>

                <button type="button" onClick={generateLocation} className="w-full py-2.5 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm hover:bg-leather-dark">
                  {results ? 'Reroll' : 'Generate Loot'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {results && <ResultsPanel groups={results} onCopy={copyToClipboard} copied={copied} />}
    </div>
  )
}
