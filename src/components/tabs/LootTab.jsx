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
  // Broadened to cover restaurants and taverns too, now that those are
  // Shop Types rather than their own top-level location category.
  shop: ['wares', 'menu'],
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
// Mount/Vehicle normally.
function categoriesForPools(pools, sources, includeVehicles) {
  const combined = pools.flatMap((p) => buildItemPool(p, sources))
  const filtered = includeVehicles ? combined : combined.filter((i) => !VEHICLE_CATEGORIES.includes(i.category))
  return [...new Set(filtered.map((i) => i.category))].sort((a, b) => a.localeCompare(b))
}

// Collects every pattern from a given per-option field ('excludedItemPatterns'
// or 'guaranteedItems') across whichever attribute values are currently
// selected. Item-NAME-level, not category-level -- "a mage wouldn't have
// a sword" excludes Longsword/Shortsword/Greatsword by substring match,
// not the entire Weapon category (a dagger or component pouch stays fine).
function patternsFor(attributes, values, field) {
  const result = new Set()
  ;(attributes || []).forEach((attr) => {
    const selected = values[attr.id]
    const patterns = selected && attr[field]?.[selected]
    if (patterns) patterns.forEach((p) => result.add(p))
  })
  return [...result]
}

function matchesAnyPattern(itemName, patterns) {
  if (!patterns || patterns.length === 0) return false
  const lower = itemName.toLowerCase()
  return patterns.some((p) => lower.includes(p.toLowerCase()))
}

// Resolves what the DM explicitly picked in the category chips against
// the coarser type-level restriction, and returns whether the draw
// should be blocked outright. This is the actual enforcement step that
// was missing before: the type-level restriction previously only
// affected which chips were offered in the UI, so an entity whose DM
// never clicked a chip (the common case) fell through to "no
// restriction at all," regardless of what the type restriction said.
function resolveEffectiveCategories(explicitCategories, typeRestriction) {
  if (explicitCategories.length > 0) return { blocked: false, categories: explicitCategories }
  if (typeRestriction !== undefined) {
    if (typeRestriction.length === 0) return { blocked: true, categories: [] }
    return { blocked: false, categories: typeRestriction }
  }
  return { blocked: false, categories: [] }
}

function drawLoot({ pools, sources, categories, priceMin, priceMax, count, allowDuplicates, includeVehicles, excludedPatterns }) {
  let pool = pools.flatMap((p) => buildItemPool(p, sources).map((item) => ({ ...item, pool: p })))
  if (!includeVehicles) pool = pool.filter((i) => !VEHICLE_CATEGORIES.includes(i.category))
  if (excludedPatterns && excludedPatterns.length > 0) {
    pool = pool.filter((i) => !matchesAnyPattern(i.name, excludedPatterns))
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

// The other half of "make good guesses": baseline items that appear
// REGARDLESS of the random draw ("most people would have shoes"),
// resolved separately from the item-count roll rather than competing
// with it for one of its slots. Tries to find a real catalog match for
// each pattern (so it carries a real price); falls back to a bare,
// price-less placeholder line if nothing in the current catalog matches,
// so the guarantee still shows up honestly rather than silently vanishing.
function resolveGuaranteedItems(patterns, pools, sources, includeVehicles) {
  if (!patterns || patterns.length === 0) return []
  const pool = pools.flatMap((p) => buildItemPool(p, sources))
  const usable = includeVehicles ? pool : pool.filter((i) => !VEHICLE_CATEGORIES.includes(i.category))
  return patterns.map((pattern) => {
    const match = usable.find((i) => i.name.toLowerCase().includes(pattern.toLowerCase()))
    if (match) return { ...match, id: `${match.id}-guaranteed`, guaranteed: true }
    return {
      id: `guaranteed-${pattern}`,
      name: pattern,
      priceGp: null,
      description: '(guaranteed — no exact match in your current catalog)',
      category: 'Guaranteed',
      guaranteed: true,
    }
  })
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
              <button type="button" onClick={() => remove(v)} aria-label={`Remove ${v}`} className="text-wax-dark hover:text-wax font-bold leading-none px-0.5">×</button>
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
        <button type="button" onClick={add} disabled={!input.trim()} className="px-2 py-1 text-xs font-display uppercase bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40">Add</button>
      </div>
    </div>
  )
}

function EditableWealthList({ items, onChange }) {
  const [form, setForm] = useState({ label: '', min: '', max: '', minItems: '', maxItems: '', goldMin: '', goldMax: '' })
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
        goldMin: Number(form.goldMin) || 0,
        goldMax: Number(form.goldMax) || 0,
      },
    ])
    setForm({ label: '', min: '', max: '', minItems: '', maxItems: '', goldMin: '', goldMax: '' })
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
        Wealth Levels <span className="text-ink-soft/50 normal-case">— sets the gp price range, item count, AND coin rolled, all from one pick</span>
      </span>
      <div className="space-y-1 mb-1.5">
        {items.map((w) => (
          <div key={w.id} className="flex flex-wrap items-center gap-2 bg-white/60 border border-leather/40 rounded-sm px-2 py-1 text-xs">
            {editingId === w.id ? (
              <input autoFocus value={editLabel} onChange={(e) => setEditLabel(e.target.value)} onBlur={() => commitLabel(w.id)} onKeyDown={(e) => e.key === 'Enter' && commitLabel(w.id)} className="w-24 rounded-sm border border-leather bg-white px-1 py-0.5" />
            ) : (
              <button type="button" onClick={() => { setEditingId(w.id); setEditLabel(w.label) }} title="Click to rename" className="flex-1 text-left hover:underline min-w-[5rem]">{w.label}</button>
            )}
            <span className="text-ink-soft/50">item gp</span>
            <input type="number" min="0" value={w.min} onChange={(e) => updateField(w.id, 'min', e.target.value)} className="w-14 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span>–</span>
            <input type="number" min="0" value={w.max} onChange={(e) => updateField(w.id, 'max', e.target.value)} className="w-14 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span className="text-ink-soft/50 ml-2"># items</span>
            <input type="number" min="0" value={w.minItems} onChange={(e) => updateField(w.id, 'minItems', e.target.value)} className="w-12 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span>–</span>
            <input type="number" min="0" value={w.maxItems} onChange={(e) => updateField(w.id, 'maxItems', e.target.value)} className="w-12 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span className="text-ink-soft/50 ml-2">coin gp</span>
            <input type="number" min="0" value={w.goldMin ?? 0} onChange={(e) => updateField(w.id, 'goldMin', e.target.value)} className="w-14 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <span>–</span>
            <input type="number" min="0" value={w.goldMax ?? 0} onChange={(e) => updateField(w.id, 'goldMax', e.target.value)} className="w-14 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5" />
            <button type="button" onClick={() => remove(w.id)} aria-label={`Remove ${w.label}`} className="text-wax-dark hover:text-wax font-bold leading-none px-1">×</button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label" className="rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs w-24" />
        <input type="number" min="0" value={form.min} onChange={(e) => setForm({ ...form, min: e.target.value })} placeholder="Min item gp" className="w-20 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.max} onChange={(e) => setForm({ ...form, max: e.target.value })} placeholder="Max item gp" className="w-20 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.minItems} onChange={(e) => setForm({ ...form, minItems: e.target.value })} placeholder="Min #" className="w-14 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.maxItems} onChange={(e) => setForm({ ...form, maxItems: e.target.value })} placeholder="Max #" className="w-14 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.goldMin} onChange={(e) => setForm({ ...form, goldMin: e.target.value })} placeholder="Min coin gp" className="w-20 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <input type="number" min="0" value={form.goldMax} onChange={(e) => setForm({ ...form, goldMax: e.target.value })} placeholder="Max coin gp" className="w-20 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
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
  if (monsterTypes.length === 0) return <p className="text-xs text-ink-soft/50 italic">Add a monster type above first.</p>
  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1">
        Monster Type → Categories <span className="text-ink-soft/50 normal-case">(coarse pass -- which item categories are eligible at all)</span>
      </span>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-xs mb-1.5">
        {monsterTypes.map((t) => <option key={t} value={t}>{t} {mapping[t]?.length ? `(${mapping[t].length} allowed)` : '(all allowed)'}</option>)}
      </select>
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
        {allCategories.map((cat) => (
          <button key={cat} type="button" onClick={() => toggle(cat)} className={`text-xs rounded-sm px-2 py-1 border ${current.includes(cat) ? 'bg-moss-dark text-parchment border-moss-dark' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}>{cat}</button>
        ))}
        {allCategories.length === 0 && <span className="text-xs text-ink-soft/50 italic">No categories available yet.</span>}
      </div>
    </div>
  )
}

// Editor for ONE attribute (e.g. Beast's "Diet"): rename it, manage its
// options, and manage per-option excluded/guaranteed item NAME patterns
// (free text, substring-matched -- "Sword" excludes Longsword etc.
// without touching the whole Weapon category).
function AttributeEditor({ attribute, onChange, onDelete }) {
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(attribute.name)
  const [patternOption, setPatternOption] = useState(attribute.options[0] || '')

  function commitName() {
    const v = nameValue.trim()
    if (v) onChange({ ...attribute, name: v })
    setEditingName(false)
  }
  function setOptions(newOptions) {
    const nextExcluded = { ...attribute.excludedItemPatterns }
    const nextGuaranteed = { ...attribute.guaranteedItems }
    Object.keys(nextExcluded).forEach((k) => { if (!newOptions.includes(k)) delete nextExcluded[k] })
    Object.keys(nextGuaranteed).forEach((k) => { if (!newOptions.includes(k)) delete nextGuaranteed[k] })
    onChange({ ...attribute, options: newOptions, excludedItemPatterns: nextExcluded, guaranteedItems: nextGuaranteed })
    if (!newOptions.includes(patternOption)) setPatternOption(newOptions[0] || '')
  }
  function renameOption(oldName, newName) {
    const nextExcluded = { ...attribute.excludedItemPatterns }
    const nextGuaranteed = { ...attribute.guaranteedItems }
    if (nextExcluded[oldName]) { nextExcluded[newName] = nextExcluded[oldName]; delete nextExcluded[oldName] }
    if (nextGuaranteed[oldName]) { nextGuaranteed[newName] = nextGuaranteed[oldName]; delete nextGuaranteed[oldName] }
    onChange({ ...attribute, excludedItemPatterns: nextExcluded, guaranteedItems: nextGuaranteed })
    if (patternOption === oldName) setPatternOption(newName)
  }
  function setExcludedPatterns(patterns) {
    onChange({ ...attribute, excludedItemPatterns: { ...attribute.excludedItemPatterns, [patternOption]: patterns } })
  }
  function setGuaranteedPatterns(patterns) {
    onChange({ ...attribute, guaranteedItems: { ...attribute.guaranteedItems, [patternOption]: patterns } })
  }

  return (
    <div className="border border-leather/30 rounded-sm bg-white/50 p-2.5 space-y-2">
      <div className="flex items-center gap-2">
        {editingName ? (
          <input autoFocus value={nameValue} onChange={(e) => setNameValue(e.target.value)} onBlur={commitName} onKeyDown={(e) => e.key === 'Enter' && commitName()} className="flex-1 rounded-sm border border-leather bg-white px-2 py-1 text-sm font-display" />
        ) : (
          <button type="button" onClick={() => setEditingName(true)} title="Click to rename" className="flex-1 text-left font-display text-sm text-leather-dark hover:underline">{attribute.name}</button>
        )}
        <button type="button" onClick={onDelete} className="text-xs text-wax-dark hover:text-wax underline shrink-0">Delete field</button>
      </div>
      <EditableList label="Options" items={attribute.options} onChange={setOptions} onRename={renameOption} placeholder="e.g. Herbivore" />
      {attribute.options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-leather/20">
          <div>
            <span className="text-xs font-display uppercase text-ink-soft block mb-1">
              Per-option: never carries <span className="text-ink-soft/50 normal-case">(name text, e.g. "Sword")</span>
            </span>
            <select value={patternOption} onChange={(e) => setPatternOption(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1 text-xs mb-1">
              {attribute.options.map((o) => (
                <option key={o} value={o}>{o} {attribute.excludedItemPatterns?.[o]?.length ? `(${attribute.excludedItemPatterns[o].length})` : ''}</option>
              ))}
            </select>
            <EditableList items={attribute.excludedItemPatterns?.[patternOption] || []} onChange={setExcludedPatterns} placeholder="e.g. Sword" />
          </div>
          <div>
            <span className="text-xs font-display uppercase text-ink-soft block mb-1">
              Per-option: always carries <span className="text-ink-soft/50 normal-case">(baseline, bypasses the roll)</span>
            </span>
            <select value={patternOption} onChange={(e) => setPatternOption(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1 text-xs mb-1">
              {attribute.options.map((o) => (
                <option key={o} value={o}>{o} {attribute.guaranteedItems?.[o]?.length ? `(${attribute.guaranteedItems[o].length})` : ''}</option>
              ))}
            </select>
            <EditableList items={attribute.guaranteedItems?.[patternOption] || []} onChange={setGuaranteedPatterns} placeholder="e.g. Boots" />
          </div>
        </div>
      )}
    </div>
  )
}

function AttributeSetEditor({ attributes, onChange }) {
  const [newName, setNewName] = useState('')
  function addAttribute() {
    const name = newName.trim()
    if (!name) return
    onChange([...attributes, { id: `attr-${Date.now()}`, name, options: [], excludedItemPatterns: {}, guaranteedItems: {} }])
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
        <AttributeEditor key={attr.id} attribute={attr} onChange={(updated) => updateAttribute(attr.id, updated)} onDelete={() => deleteAttribute(attr.id)} />
      ))}
      {attributes.length === 0 && <p className="text-xs text-ink-soft/50 italic">No custom fields yet for this type.</p>}
      <div className="flex gap-1.5">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addAttribute()} placeholder="New field name, e.g. Diet" className="flex-1 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs" />
        <button type="button" onClick={addAttribute} disabled={!newName.trim()} className="px-2 py-1 text-xs font-display uppercase bg-moss-dark text-parchment rounded-sm hover:opacity-90 disabled:opacity-40">+ Add Field</button>
      </div>
    </div>
  )
}

function TypeAttributeManager({ label, types, typeLabels, attributesByType, onChange }) {
  const [selectedType, setSelectedType] = useState(types[0] || '')
  if (types.length === 0) return null
  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1.5">{label}</span>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm mb-2">
        {types.map((t) => <option key={t} value={t}>{typeLabels ? typeLabels[t] : t}</option>)}
      </select>
      <AttributeSetEditor attributes={attributesByType[selectedType] || []} onChange={(v) => onChange({ ...attributesByType, [selectedType]: v })} />
    </div>
  )
}

// Type-level baseline items (e.g. every Humanoid guarantees Boots/Clothes
// regardless of Role) -- simpler than the per-option version, just one
// list per type.
function TypeGuaranteedItemsManager({ label, types, typeLabels, itemsByType, onChange }) {
  const [selectedType, setSelectedType] = useState(types[0] || '')
  if (types.length === 0) return null
  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1.5">{label}</span>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm mb-2">
        {types.map((t) => <option key={t} value={t}>{typeLabels ? typeLabels[t] : t}</option>)}
      </select>
      <EditableList items={itemsByType[selectedType] || []} onChange={(v) => onChange({ ...itemsByType, [selectedType]: v })} placeholder="e.g. Boots" />
    </div>
  )
}

// Which monster types even show a Wealth field. "Wealth" (economic
// status) doesn't apply to a wild beast or an ooze -- only types
// explicitly toggled on here get the field at all.
function WealthApplicabilityEditor({ monsterTypes, usesWealth, onChange }) {
  function toggle(type) {
    onChange({ ...usesWealth, [type]: !usesWealth[type] })
  }
  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1">
        Wealth Applies To <span className="text-ink-soft/50 normal-case">(only these types show a Wealth field at all)</span>
      </span>
      <div className="flex flex-wrap gap-1.5">
        {monsterTypes.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => toggle(t)}
            className={`text-xs rounded-sm px-2 py-1 border ${usesWealth[t] ? 'bg-moss-dark text-parchment border-moss-dark' : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

// Same excluded/guaranteed item-name mechanism as attribute options,
// applied to the shared Setting field -- otherwise Setting is purely
// cosmetic (shows in the label, never actually touches what gets drawn).
function SettingRulesEditor({ settings, rules, onChange }) {
  const [selected, setSelected] = useState(settings[0] || '')
  const current = rules[selected] || { excludedItemPatterns: [], guaranteedItems: [] }

  function updateExcluded(patterns) {
    onChange({ ...rules, [selected]: { ...current, excludedItemPatterns: patterns } })
  }
  function updateGuaranteed(patterns) {
    onChange({ ...rules, [selected]: { ...current, guaranteedItems: patterns } })
  }

  if (settings.length === 0) return <p className="text-xs text-ink-soft/50 italic">Add a setting above first.</p>

  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1">
        Setting Rules <span className="text-ink-soft/50 normal-case">(makes Setting actually affect the draw, not just the label)</span>
      </span>
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm mb-2">
        {settings.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="text-xs font-display uppercase text-ink-soft block mb-1">Never carries here</span>
          <EditableList items={current.excludedItemPatterns || []} onChange={updateExcluded} placeholder="e.g. Heavy Armor" />
        </div>
        <div>
          <span className="text-xs font-display uppercase text-ink-soft block mb-1">Always carries here</span>
          <EditableList items={current.guaranteedItems || []} onChange={updateGuaranteed} placeholder="e.g. Waterskin" />
        </div>
      </div>
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
    if (taxonomy.monsterTypeGuaranteedItems?.[oldName]) {
      const next = { ...taxonomy.monsterTypeGuaranteedItems }
      next[newName] = next[oldName]
      delete next[oldName]
      onSave({ monsterTypeGuaranteedItems: next })
    }
  }

  return (
    <div className="border border-leather/50 rounded-sm bg-parchment/60 p-4 space-y-5">
      <p className="text-xs text-ink-soft/60 italic">
        These lists are the Loot tab's own — kept completely separate from any NPC species, job,
        or class list elsewhere on the site. Click any entry to rename it; changes save
        immediately. The monster catalog is seeded from the official SRD 5.2.1 (CC-BY-4.0) —
        add homebrew entries the same way.
      </p>
      <EditableWealthList items={taxonomy.wealthLevels} onChange={(v) => onSave({ wealthLevels: v })} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EditableList label="Monster Types" items={taxonomy.monsterTypes} onChange={(v) => onSave({ monsterTypes: v })} onRename={renameMonsterType} placeholder="e.g. Custom Type" />
        <EditableList label="Settings" items={taxonomy.settings} onChange={(v) => onSave({ settings: v })} placeholder="e.g. Volcanic" />
        <EditableList
          label="Shop Types (covers general shops, restaurants, and taverns)"
          items={taxonomy.shopTypes}
          onChange={(v) => onSave({ shopTypes: v })}
          placeholder="e.g. Alchemist, or Dive Bar"
        />
        <EditableList label="Exploration Types" items={taxonomy.explorationTypes} onChange={(v) => onSave({ explorationTypes: v })} placeholder="e.g. Sunken Temple" />
      </div>

      <WealthApplicabilityEditor
        monsterTypes={taxonomy.monsterTypes}
        usesWealth={taxonomy.monsterTypeUsesWealth || {}}
        onChange={(v) => onSave({ monsterTypeUsesWealth: v })}
      />

      <SettingRulesEditor settings={taxonomy.settings} rules={taxonomy.settingRules || {}} onChange={(v) => onSave({ settingRules: v })} />

      <MonsterTypeCategoryMapper monsterTypes={taxonomy.monsterTypes} mapping={taxonomy.monsterTypeCategories || {}} allCategories={allCategories} onChange={(v) => onSave({ monsterTypeCategories: v })} />

      <TypeGuaranteedItemsManager
        label="Monster Type → Always Carries (baseline, e.g. Humanoid → Boots)"
        types={taxonomy.monsterTypes}
        itemsByType={taxonomy.monsterTypeGuaranteedItems || {}}
        onChange={(v) => onSave({ monsterTypeGuaranteedItems: v })}
      />

      <TypeAttributeManager
        label="Monster Type Fields (what changes per monster type -- e.g. Beast gets Diet/Size instead of a generic Class)"
        types={taxonomy.monsterTypes}
        attributesByType={taxonomy.monsterTypeAttributes || {}}
        onChange={(v) => onSave({ monsterTypeAttributes: v })}
      />

      <TypeGuaranteedItemsManager
        label="Location Type → Always Carries"
        types={locationTypeIds}
        typeLabels={locationTypeLabels}
        itemsByType={taxonomy.locationTypeGuaranteedItems || {}}
        onChange={(v) => onSave({ locationTypeGuaranteedItems: v })}
      />

      <TypeAttributeManager
        label="Location Type Fields (extra options per Shop/Exploration)"
        types={locationTypeIds}
        typeLabels={locationTypeLabels}
        attributesByType={taxonomy.locationTypeAttributes || {}}
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

function DynamicAttributeFields({ attributes, values, onChange }) {
  if (!attributes || attributes.length === 0) return null
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {attributes.map((attr) => (
        <label key={attr.id} className="block">
          <span className="text-xs font-display uppercase text-ink-soft">{attr.name}</span>
          <select value={values[attr.id] || ''} onChange={(e) => onChange(attr.id, e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm">
            <option value="">—</option>
            {attr.options.map((o) => <option key={o} value={o}>{o}</option>)}
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
                    {item.guaranteed && <span className="ml-1.5 text-xs text-moss-dark italic">(always carries)</span>}
                    <span className="ml-2 text-xs text-ink-soft/60 italic">{item.category}</span>
                    {item.description && <p className="text-xs text-ink-soft/70 italic">{item.description}</p>}
                  </div>
                  <span className="text-xs text-ink-soft shrink-0">{item.priceGp == null ? '—' : formatPrice(item.priceGp)}</span>
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
  const [wealthId, setWealthId] = useState('')
  const [setting, setSetting] = useState('')
  const [notes, setNotes] = useState('')
  const [pools, setPools] = useState(DEFAULT_POOLS.encounter)
  const [categories, setCategories] = useState([])
  const [includeVehicles, setIncludeVehicles] = useState(false)

  const usesWealth = taxonomy.monsterTypeUsesWealth?.[monsterType] === true

  const typeAttributes = useMemo(() => taxonomy.monsterTypeAttributes?.[monsterType] || [], [taxonomy.monsterTypeAttributes, monsterType])
  const settingRule = taxonomy.settingRules?.[setting]

  const excludedPatterns = useMemo(() => {
    const fromAttrs = patternsFor(typeAttributes, attributeValues, 'excludedItemPatterns')
    const fromSetting = settingRule?.excludedItemPatterns || []
    return [...new Set([...fromAttrs, ...fromSetting])]
  }, [typeAttributes, attributeValues, settingRule])

  const guaranteedPatterns = useMemo(() => {
    const typeLevel = taxonomy.monsterTypeGuaranteedItems?.[monsterType] || []
    const optionLevel = patternsFor(typeAttributes, attributeValues, 'guaranteedItems')
    const fromSetting = settingRule?.guaranteedItems || []
    return [...new Set([...typeLevel, ...optionLevel, ...fromSetting])]
  }, [taxonomy.monsterTypeGuaranteedItems, monsterType, typeAttributes, attributeValues, settingRule])

  const availableCategories = useMemo(() => {
    let base = categoriesForPools(pools, sources, includeVehicles)
    const restriction = taxonomy.monsterTypeCategories?.[monsterType]
    // A restriction key that's PRESENT (even as an empty array) means
    // "this type carries nothing" -- only an ABSENT key means
    // unrestricted. `restriction && restriction.length > 0` used to
    // treat both the same way, which is exactly why an unconfigured
    // Beast could pull anything: an explicitly-empty restriction was
    // silently ignored instead of blocking everything.
    if (restriction !== undefined) base = base.filter((c) => restriction.includes(c))
    return base
  }, [pools, sources, includeVehicles, taxonomy.monsterTypeCategories, monsterType])

  function handleMonsterTypeChange(value) {
    setMonsterType(value)
    setAttributeValues({})
    const restriction = taxonomy.monsterTypeCategories?.[value]
    if (restriction !== undefined) {
      setCategories((prev) => prev.filter((c) => restriction.includes(c)))
    }
    // Wealth only shows for types where it's toggled on -- reset it
    // cleanly on type change rather than carrying over a stale pick from
    // a wealth-using type onto one that doesn't use it at all.
    const newUsesWealth = taxonomy.monsterTypeUsesWealth?.[value] === true
    setWealthId(newUsesWealth ? taxonomy.wealthLevels[0]?.id || '' : '')
  }

  function handleMonsterNameChange(value) {
    setMonsterName(value)
    // Auto-fill Monster Type when the typed value exactly matches a
    // catalog entry -- lets a specific pick like "Bandit" drive the
    // right type-specific fields automatically.
    const match = (taxonomy.monsterCatalog || []).find((m) => m.name.toLowerCase() === value.toLowerCase())
    let effectiveType = monsterType
    if (match && taxonomy.monsterTypes.includes(match.type) && match.type !== monsterType) {
      handleMonsterTypeChange(match.type)
      effectiveType = match.type
    }
    // Role hint: if the search text contains a known keyword (e.g.
    // "bandit"), auto-suggest the matching Role on whichever attribute
    // actually offers that option, without clobbering a Role the DM
    // already picked. This is what makes "Specific Monster" actually
    // steer loot rather than just relabeling a generic Humanoid.
    const lower = value.toLowerCase()
    const hint = Object.entries(taxonomy.monsterNameRoleHints || {}).find(([kw]) => lower.includes(kw))
    if (hint) {
      const [, roleValue] = hint
      const attrsForType = taxonomy.monsterTypeAttributes?.[effectiveType] || []
      const roleAttr = attrsForType.find((a) => a.options.includes(roleValue))
      if (roleAttr) {
        setAttributeValues((prev) => (prev[roleAttr.id] ? prev : { ...prev, [roleAttr.id]: roleValue }))
      }
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
      excludedPatterns,
      guaranteedPatterns,
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
          <span className="text-xs font-display uppercase text-ink-soft">Specific Monster (SRD 5.2.1, optional)</span>
          <input
            list="loot-monster-catalog"
            value={monsterName}
            onChange={(e) => handleMonsterNameChange(e.target.value)}
            placeholder="Search or type, e.g. Bandit"
            className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
          />
          <datalist id="loot-monster-catalog">
            {(taxonomy.monsterCatalog || []).map((m) => <option key={m.name} value={m.name}>{m.type} · CR varies</option>)}
          </datalist>
        </label>
        {usesWealth ? (
          <label className="block">
            <span className="text-xs font-display uppercase text-ink-soft">Wealth</span>
            <select value={wealthId} onChange={(e) => setWealthId(e.target.value)} className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm">
              {taxonomy.wealthLevels.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
            </select>
          </label>
        ) : (
          monsterType && (
            <div className="flex items-end pb-1.5">
              <p className="text-xs text-ink-soft/50 italic">
                {monsterType} doesn't use Wealth — no coin, only whatever's guaranteed below.
              </p>
            </div>
          )
        )}
      </div>

      <DynamicAttributeFields attributes={typeAttributes} values={attributeValues} onChange={(attrId, val) => setAttributeValues((prev) => ({ ...prev, [attrId]: val }))} />

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

      {(excludedPatterns.length > 0 || guaranteedPatterns.length > 0) && (
        <div className="text-xs text-ink-soft/60 italic space-y-0.5">
          {excludedPatterns.length > 0 && <p>Never carries: {excludedPatterns.join(', ')}</p>}
          {guaranteedPatterns.length > 0 && <p>Always carries: {guaranteedPatterns.join(', ')}</p>}
        </div>
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

      <button type="button" onClick={handleAdd} className="w-full py-2 text-sm font-display uppercase tracking-wide bg-moss-dark text-parchment rounded-sm hover:opacity-90">+ Add Entity</button>
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
  const locTypeAttributes = useMemo(() => lootTaxonomy.locationTypeAttributes?.[locationType] || [], [lootTaxonomy.locationTypeAttributes, locationType])
  const locExcludedPatterns = useMemo(() => patternsFor(locTypeAttributes, locAttributeValues, 'excludedItemPatterns'), [locTypeAttributes, locAttributeValues])
  const locGuaranteedPatterns = useMemo(() => {
    const typeLevel = lootTaxonomy.locationTypeGuaranteedItems?.[locationType] || []
    const optionLevel = patternsFor(locTypeAttributes, locAttributeValues, 'guaranteedItems')
    return [...new Set([...typeLevel, ...optionLevel])]
  }, [lootTaxonomy.locationTypeGuaranteedItems, locationType, locTypeAttributes, locAttributeValues])

  const locAvailableCategories = useMemo(() => categoriesForPools(locPools, sources, locIncludeVehicles), [locPools, sources, locIncludeVehicles])

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
      const gold = w ? randomInt(w.goldMin ?? 0, w.goldMax ?? 0) : 0
      const guaranteed = resolveGuaranteedItems(e.guaranteedPatterns, e.pools, sources, e.includeVehicles)
      const typeRestriction = lootTaxonomy.monsterTypeCategories?.[e.monsterType]
      const { blocked, categories } = resolveEffectiveCategories(e.categories, typeRestriction)
      const rolled = blocked
        ? []
        : drawLoot({
            pools: e.pools,
            sources,
            categories,
            priceMin: w?.min ?? null,
            priceMax: w?.max ?? null,
            count,
            allowDuplicates: false,
            includeVehicles: e.includeVehicles,
            excludedPatterns: e.excludedPatterns,
          })
      const attrTags = Object.values(e.attributeValues || {}).filter(Boolean)
      const tags = [e.monsterName || e.monsterType, ...attrTags, w?.label, e.setting, e.notes].filter(Boolean)
      return { label: tags.join(' · ') || 'Entity', items: [...guaranteed, ...rolled], gold }
    })
    setResults(groups)
    setCopied(false)
  }

  function generateLocation() {
    const w = wealthLevel(locWealthId)
    const count = w ? randomInt(w.minItems ?? 1, w.maxItems ?? 1) : 0
    const gold = w ? randomInt(w.goldMin ?? 0, w.goldMax ?? 0) : 0
    const guaranteed = resolveGuaranteedItems(locGuaranteedPatterns, locPools, sources, locIncludeVehicles)
    const rolled = drawLoot({
      pools: locPools,
      sources,
      categories: locCategories,
      priceMin: w?.min ?? null,
      priceMax: w?.max ?? null,
      count,
      allowDuplicates: locAllowDuplicates,
      includeVehicles: locIncludeVehicles,
      excludedPatterns: locExcludedPatterns,
    })
    setResults([{ label: '', items: [...guaranteed, ...rolled], gold }])
    setCopied(false)
  }

  function copyToClipboard() {
    if (!results) return
    const lines = []
    results.forEach((g) => {
      if (g.label) lines.push(`— ${g.label} —`)
      if (g.gold != null) lines.push(`${g.gold} gp`)
      g.items.forEach((i) => lines.push(`${i.name}${i.guaranteed ? ' (always carries)' : ''} (${i.priceGp == null ? '—' : formatPrice(i.priceGp)})`))
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
        <button type="button" onClick={() => setShowTaxonomy((s) => !s)} className="text-xs text-moss-dark underline shrink-0 whitespace-nowrap">{showTaxonomy ? 'Hide categories' : 'Edit categories'}</button>
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

            <button type="button" onClick={generateEncounter} disabled={entities.length === 0} className="w-full py-2.5 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40">
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

                <DynamicAttributeFields attributes={locTypeAttributes} values={locAttributeValues} onChange={(attrId, val) => setLocAttributeValues((prev) => ({ ...prev, [attrId]: val }))} />

                {(locExcludedPatterns.length > 0 || locGuaranteedPatterns.length > 0) && (
                  <div className="text-xs text-ink-soft/60 italic space-y-0.5">
                    {locExcludedPatterns.length > 0 && <p>Never carries: {locExcludedPatterns.join(', ')}</p>}
                    {locGuaranteedPatterns.length > 0 && <p>Always carries: {locGuaranteedPatterns.join(', ')}</p>}
                  </div>
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
