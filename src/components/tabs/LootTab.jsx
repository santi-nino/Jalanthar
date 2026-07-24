import { useMemo, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { buildItemPool } from '../../utils/itemPool'
import { formatPrice } from '../../utils/price'
import { LOCATION_TYPES } from '../../data/defaultLootTaxonomy'

const POOL_OPTIONS = [
  { id: 'wares', label: 'Wares' },
  { id: 'menu', label: 'Menu' },
  { id: 'services', label: 'Services' },
]

// Sensible default pool selection per top-level choice, so a DM generating
// a tavern's loot isn't stuck unchecking "Wares" and checking "Menu" every
// single time — still fully overridable via the checkboxes underneath.
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

function drawLoot({ pools, sources, categories, priceMin, priceMax, count, allowDuplicates }) {
  const pool = pools.flatMap((p) => buildItemPool(p, sources).map((item) => ({ ...item, pool: p })))
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

function EditableList({ label, items, onChange, placeholder }) {
  const [input, setInput] = useState('')
  function add() {
    const v = input.trim()
    if (v && !items.includes(v)) onChange([...items, v])
    setInput('')
  }
  function remove(v) {
    onChange(items.filter((x) => x !== v))
  }
  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1">{label}</span>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {items.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 bg-white/60 border border-leather/40 rounded-sm pl-2 pr-1 py-0.5 text-xs"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              aria-label={`Remove ${v}`}
              className="text-wax-dark hover:text-wax font-bold leading-none px-0.5"
            >
              ×
            </button>
          </span>
        ))}
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
  const [form, setForm] = useState({ label: '', min: '', max: '' })
  function add() {
    const label = form.label.trim()
    if (!label) return
    onChange([
      ...items,
      { id: `wealth-${Date.now()}`, label, min: Number(form.min) || 0, max: Number(form.max) || 0 },
    ])
    setForm({ label: '', min: '', max: '' })
  }
  function remove(id) {
    onChange(items.filter((w) => w.id !== id))
  }
  function updateRange(id, key, value) {
    onChange(items.map((w) => (w.id === id ? { ...w, [key]: Number(value) || 0 } : w)))
  }
  return (
    <div>
      <span className="text-xs font-display uppercase text-ink-soft block mb-1">
        Wealth Levels{' '}
        <span className="text-ink-soft/50 normal-case">
          (sets the gp price range pulled from your catalog)
        </span>
      </span>
      <ul className="space-y-1 mb-1.5">
        {items.map((w) => (
          <li
            key={w.id}
            className="flex items-center gap-2 bg-white/60 border border-leather/40 rounded-sm px-2 py-1 text-xs"
          >
            <span className="flex-1">{w.label}</span>
            <input
              type="number"
              min="0"
              value={w.min}
              onChange={(e) => updateRange(w.id, 'min', e.target.value)}
              className="w-16 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5"
            />
            <span>–</span>
            <input
              type="number"
              min="0"
              value={w.max}
              onChange={(e) => updateRange(w.id, 'max', e.target.value)}
              className="w-16 rounded-sm border border-leather/60 bg-white/80 px-1 py-0.5"
            />
            <span className="text-ink-soft/50">gp</span>
            <button
              type="button"
              onClick={() => remove(w.id)}
              aria-label={`Remove ${w.label}`}
              className="text-wax-dark hover:text-wax font-bold leading-none px-1"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-1.5">
        <input
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="Label"
          className="flex-1 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs"
        />
        <input
          type="number"
          min="0"
          value={form.min}
          onChange={(e) => setForm({ ...form, min: e.target.value })}
          placeholder="Min"
          className="w-16 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs"
        />
        <input
          type="number"
          min="0"
          value={form.max}
          onChange={(e) => setForm({ ...form, max: e.target.value })}
          placeholder="Max"
          className="w-16 rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs"
        />
        <button
          type="button"
          onClick={add}
          disabled={!form.label.trim()}
          className="px-2 py-1 text-xs font-display uppercase bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </div>
  )
}

function TaxonomyManager({ taxonomy, onSave }) {
  return (
    <div className="border border-leather/50 rounded-sm bg-parchment/60 p-4 space-y-4">
      <p className="text-xs text-ink-soft/60 italic">
        These lists are the Loot tab's own — kept completely separate from any NPC species, job,
        or class list elsewhere on the site. Edit freely; changes save immediately.
      </p>
      <EditableWealthList
        items={taxonomy.wealthLevels}
        onChange={(v) => onSave({ wealthLevels: v })}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EditableList
          label="Classes"
          items={taxonomy.classes}
          onChange={(v) => onSave({ classes: v })}
          placeholder="e.g. Warlock"
        />
        <EditableList
          label="Monster Types"
          items={taxonomy.monsterTypes}
          onChange={(v) => onSave({ monsterTypes: v })}
          placeholder="e.g. Celestial"
        />
        <EditableList
          label="Settings"
          items={taxonomy.settings}
          onChange={(v) => onSave({ settings: v })}
          placeholder="e.g. Volcanic"
        />
        <EditableList
          label="Shop Types"
          items={taxonomy.shopTypes}
          onChange={(v) => onSave({ shopTypes: v })}
          placeholder="e.g. Alchemist"
        />
        <EditableList
          label="Restaurant Types"
          items={taxonomy.restaurantTypes}
          onChange={(v) => onSave({ restaurantTypes: v })}
          placeholder="e.g. Noble Feast Hall"
        />
        <EditableList
          label="Tavern Types"
          items={taxonomy.tavernTypes}
          onChange={(v) => onSave({ tavernTypes: v })}
          placeholder="e.g. Sailor's Dive"
        />
        <EditableList
          label="Exploration Types"
          items={taxonomy.explorationTypes}
          onChange={(v) => onSave({ explorationTypes: v })}
          placeholder="e.g. Sunken Temple"
        />
      </div>
    </div>
  )
}

function PoolAndCategoryPicker({
  pools,
  onPoolsChange,
  categories,
  onCategoriesChange,
  availableCategories,
}) {
  return (
    <div className="space-y-2">
      <div>
        <span className="text-xs font-display uppercase text-ink-soft block mb-1">Draw From</span>
        <div className="flex gap-3 flex-wrap">
          {POOL_OPTIONS.map((p) => (
            <label key={p.id} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={pools.includes(p.id)}
                onChange={() =>
                  onPoolsChange(
                    pools.includes(p.id) ? pools.filter((x) => x !== p.id) : [...pools, p.id]
                  )
                }
              />
              {p.label}
            </label>
          ))}
        </div>
      </div>
      {availableCategories.length > 0 && (
        <div>
          <span className="text-xs font-display uppercase text-ink-soft block mb-1">
            Categories <span className="text-ink-soft/50 normal-case">(none = all)</span>
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  onCategoriesChange(
                    categories.includes(cat)
                      ? categories.filter((c) => c !== cat)
                      : [...categories, cat]
                  )
                }
                className={`text-xs rounded-sm px-2 py-1 border ${
                  categories.includes(cat)
                    ? 'bg-leather text-parchment border-leather'
                    : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'
                }`}
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

function ResultsPanel({ groups, onCopy, copied }) {
  const grandTotal = groups.reduce(
    (sum, g) => sum + g.items.reduce((s, i) => s + (i.priceGp || 0), 0) + (g.gold || 0),
    0
  )
  return (
    <div className="border border-gold rounded-sm bg-parchment paper-texture p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-leather-dark">Results</h3>
        <button type="button" onClick={onCopy} className="text-xs text-moss-dark underline">
          {copied ? 'Copied!' : 'Copy as text'}
        </button>
      </div>
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.label && (
            <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark/80 border-b border-leather/30 pb-1 mb-1.5">
              {g.label}
            </h4>
          )}
          {g.gold != null && (
            <p className="text-sm font-display text-leather-dark mb-1">{g.gold} gp in coin</p>
          )}
          {g.items.length === 0 ? (
            <p className="text-xs text-ink-soft italic">Nothing — widen the filters.</p>
          ) : (
            <ul className="space-y-1">
              {g.items.map((item, i) => (
                <li key={`${item.id}-${i}`} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <span className="font-display text-leather-dark">{item.name}</span>
                    <span className="ml-2 text-xs text-ink-soft/60 italic">{item.category}</span>
                    {item.description && (
                      <p className="text-xs text-ink-soft/70 italic">{item.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-ink-soft shrink-0">{formatPrice(item.priceGp)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <p className="text-sm font-display text-leather-dark text-right pt-1 border-t border-leather/30">
        Grand Total: {formatPrice(grandTotal)}
      </p>
    </div>
  )
}

// --- Encounter flow -------------------------------------------------------

function EntityBuilder({ taxonomy, sources, onAdd }) {
  const [monsterType, setMonsterType] = useState('')
  const [entityClass, setEntityClass] = useState('')
  const [wealthId, setWealthId] = useState(taxonomy.wealthLevels[0]?.id || '')
  const [setting, setSetting] = useState('')
  const [notes, setNotes] = useState('')
  const [pools, setPools] = useState(DEFAULT_POOLS.encounter)
  const [categories, setCategories] = useState([])
  const [itemCount, setItemCount] = useState(2)

  const availableCategories = useMemo(() => {
    const combined = pools.flatMap((p) => buildItemPool(p, sources))
    return [...new Set(combined.map((i) => i.category))].sort((a, b) => a.localeCompare(b))
  }, [pools, sources])

  function handleAdd() {
    onAdd({
      id: `entity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      monsterType,
      class: entityClass,
      wealthId,
      setting,
      notes,
      pools,
      categories,
      itemCount,
    })
    setNotes('')
  }

  return (
    <div className="border border-leather/40 rounded-sm bg-white/40 p-3 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <label className="block">
          <span className="text-xs font-display uppercase text-ink-soft">Monster Type</span>
          <select
            value={monsterType}
            onChange={(e) => setMonsterType(e.target.value)}
            className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
          >
            <option value="">—</option>
            {taxonomy.monsterTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-display uppercase text-ink-soft">Class</span>
          <select
            value={entityClass}
            onChange={(e) => setEntityClass(e.target.value)}
            className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
          >
            <option value="">—</option>
            {taxonomy.classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-display uppercase text-ink-soft">Wealth</span>
          <select
            value={wealthId}
            onChange={(e) => setWealthId(e.target.value)}
            className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
          >
            {taxonomy.wealthLevels.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-display uppercase text-ink-soft">Setting</span>
          <select
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
          >
            <option value="">—</option>
            {taxonomy.settings.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-display uppercase text-ink-soft">
          Notes (optional — anything not covered above)
        </span>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. pack leader, wounded, hoarder"
          className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
        />
      </label>

      <PoolAndCategoryPicker
        pools={pools}
        onPoolsChange={setPools}
        categories={categories}
        onCategoriesChange={setCategories}
        availableCategories={availableCategories}
      />

      <label className="block w-32">
        <span className="text-xs font-display uppercase text-ink-soft"># Items</span>
        <input
          type="number"
          min="0"
          value={itemCount}
          onChange={(e) => setItemCount(e.target.value)}
          className="mt-1 w-full rounded-sm border border-leather bg-white/70 px-2 py-1.5 text-sm"
        />
      </label>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full py-2 text-sm font-display uppercase tracking-wide bg-moss-dark text-parchment rounded-sm hover:opacity-90"
      >
        + Add Entity
      </button>
    </div>
  )
}

// --- Main tab ---------------------------------------------------------

export default function LootTab() {
  const { sources, lootTaxonomy, saveLootTaxonomy } = useData()
  const [showTaxonomy, setShowTaxonomy] = useState(false)

  const [generationType, setGenerationType] = useState(null) // 'location' | 'encounter'

  // Encounter state
  const [entities, setEntities] = useState([])

  // Location state
  const [locationType, setLocationType] = useState(null)
  const [subtype, setSubtype] = useState('')
  const [locWealthId, setLocWealthId] = useState(lootTaxonomy.wealthLevels[0]?.id || '')
  const [locPools, setLocPools] = useState(DEFAULT_POOLS.shop)
  const [locCategories, setLocCategories] = useState([])
  const [locItemCount, setLocItemCount] = useState(5)
  const [locAllowDuplicates, setLocAllowDuplicates] = useState(false)

  const [results, setResults] = useState(null) // array of {label, items, gold}
  const [copied, setCopied] = useState(false)

  const locAvailableCategories = useMemo(() => {
    const combined = locPools.flatMap((p) => buildItemPool(p, sources))
    return [...new Set(combined.map((i) => i.category))].sort((a, b) => a.localeCompare(b))
  }, [locPools, sources])

  function pickLocationType(type) {
    setLocationType(type)
    setSubtype('')
    setLocPools(DEFAULT_POOLS[type] || ['wares'])
    setResults(null)
  }

  function removeEntity(id) {
    setEntities(entities.filter((e) => e.id !== id))
  }

  function wealthRange(wealthId) {
    const w = lootTaxonomy.wealthLevels.find((x) => x.id === wealthId)
    return w ? { min: w.min, max: w.max } : { min: null, max: null }
  }

  function generateEncounter() {
    const groups = entities.map((e) => {
      const { min, max } = wealthRange(e.wealthId)
      const items = drawLoot({
        pools: e.pools,
        sources,
        categories: e.categories,
        priceMin: min,
        priceMax: max,
        count: e.itemCount,
        allowDuplicates: false,
      })
      const wealthLabel = lootTaxonomy.wealthLevels.find((w) => w.id === e.wealthId)?.label || ''
      const tags = [e.monsterType, e.class, wealthLabel, e.setting, e.notes].filter(Boolean)
      return { label: tags.join(' · ') || 'Entity', items, gold: null }
    })
    setResults(groups)
    setCopied(false)
  }

  function generateLocation() {
    const { min, max } = wealthRange(locWealthId)
    const count = Math.max(0, Math.round(Number(locItemCount) || 0))
    const items = drawLoot({
      pools: locPools,
      sources,
      categories: locCategories,
      priceMin: min,
      priceMax: max,
      count,
      allowDuplicates: locAllowDuplicates,
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
    navigator.clipboard
      ?.writeText(lines.join('\n'))
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  const currentLocationType = LOCATION_TYPES.find((t) => t.id === locationType)

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl text-leather-dark">Loot Generator</h2>
          <p className="text-xs text-ink-soft/60 italic mt-1">
            DM-only. Pulls from the same SRD catalog and uploaded sources used across the site.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTaxonomy((s) => !s)}
          className="text-xs text-moss-dark underline shrink-0 whitespace-nowrap"
        >
          {showTaxonomy ? 'Hide categories' : 'Edit categories'}
        </button>
      </div>

      {showTaxonomy && <TaxonomyManager taxonomy={lootTaxonomy} onSave={saveLootTaxonomy} />}

      <div className="border border-leather/50 rounded-sm bg-parchment paper-texture p-4 space-y-4">
        <div>
          <span className="text-sm font-display uppercase text-ink-soft block mb-1.5">
            What are you generating loot for?
          </span>
          <div className="flex gap-3">
            {['location', 'encounter'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setGenerationType(t)
                  setResults(null)
                }}
                className={`flex-1 py-2.5 text-sm font-display uppercase tracking-wide rounded-sm border ${
                  generationType === t
                    ? 'bg-leather text-parchment border-leather'
                    : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'
                }`}
              >
                {t === 'location' ? 'Location' : 'Encounter'}
              </button>
            ))}
          </div>
        </div>

        {generationType === 'encounter' && (
          <div className="space-y-4">
            <EntityBuilder
              taxonomy={lootTaxonomy}
              sources={sources}
              onAdd={(e) => setEntities([...entities, e])}
            />

            {entities.length > 0 && (
              <div>
                <span className="text-xs font-display uppercase text-ink-soft block mb-1.5">
                  Entities ({entities.length})
                </span>
                <ul className="space-y-1">
                  {entities.map((e) => {
                    const wealthLabel = lootTaxonomy.wealthLevels.find(
                      (w) => w.id === e.wealthId
                    )?.label
                    const tags = [e.monsterType, e.class, wealthLabel, e.setting, e.notes].filter(
                      Boolean
                    )
                    return (
                      <li
                        key={e.id}
                        className="flex items-center justify-between gap-2 bg-white/50 border border-leather/30 rounded-sm px-2 py-1.5 text-sm"
                      >
                        <span>{tags.join(' · ') || 'Unnamed entity'}</span>
                        <button
                          type="button"
                          onClick={() => removeEntity(e.id)}
                          aria-label="Remove entity"
                          className="text-wax-dark hover:text-wax font-bold leading-none px-1"
                        >
                          ×
                        </button>
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
              <span className="text-xs font-display uppercase text-ink-soft block mb-1.5">
                What kind of location?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LOCATION_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => pickLocationType(t.id)}
                    className={`py-2 text-xs font-display uppercase tracking-wide rounded-sm border ${
                      locationType === t.id
                        ? 'bg-leather text-parchment border-leather'
                        : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'
                    }`}
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
                    <span className="text-xs font-display uppercase text-ink-soft">
                      {currentLocationType.label} Type
                    </span>
                    <select
                      value={subtype}
                      onChange={(e) => setSubtype(e.target.value)}
                      className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-2 py-1.5 text-sm"
                    >
                      <option value="">—</option>
                      {(lootTaxonomy[currentLocationType.taxonomyKey] || []).map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-display uppercase text-ink-soft">Wealth</span>
                    <select
                      value={locWealthId}
                      onChange={(e) => setLocWealthId(e.target.value)}
                      className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-2 py-1.5 text-sm"
                    >
                      {lootTaxonomy.wealthLevels.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <PoolAndCategoryPicker
                  pools={locPools}
                  onPoolsChange={setLocPools}
                  categories={locCategories}
                  onCategoriesChange={setLocCategories}
                  availableCategories={locAvailableCategories}
                />

                <div className="flex items-end gap-3">
                  <label className="block w-32">
                    <span className="text-xs font-display uppercase text-ink-soft"># Items</span>
                    <input
                      type="number"
                      min="0"
                      value={locItemCount}
                      onChange={(e) => setLocItemCount(e.target.value)}
                      className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="flex items-center gap-1.5 text-xs pb-2">
                    <input
                      type="checkbox"
                      checked={locAllowDuplicates}
                      onChange={(e) => setLocAllowDuplicates(e.target.checked)}
                    />
                    Allow duplicates
                  </label>
                </div>

                <button
                  type="button"
                  onClick={generateLocation}
                  className="w-full py-2.5 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm hover:bg-leather-dark"
                >
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
