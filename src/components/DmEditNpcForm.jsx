import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { SELECTABLE_TYPES, getRelationshipType, getLabel } from '../data/relationshipTypes'
import { NPC_CLASSES } from '../data/npcClasses'

export default function DmEditNpcForm({ npc, onClose }) {
  const {
    saveNpc,
    removeNpc,
    npcs,
    families,
    saveFamily,
    buildings,
    addResidentToBuilding,
    removeResidentFromBuilding,
  } = useData()
  const [newFamilyName, setNewFamilyName] = useState('')
  const [form, setForm] = useState(
    npc || {
      name: '',
      familyName: families[0]?.name || '',
      homeBuildingId: '',
      visible: false,
      job: '',
      species: '',
      gender: '',
      dndClass: '',
      famousQuote: '',
      age: '',
      eyeColor: '',
      hairColor: '',
      height: '',
      weight: '',
      distinguishingFeatures: '',
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
    set('relationships', [...form.relationships, { targetId: '', type: 'friend' }])
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

  const [saveError, setSaveError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveError('')
    try {
      const savedId = await saveNpc(form)
      const resolvedId = savedId || npc?.id

      const oldBuildingId = npc?.homeBuildingId || ''
      const newBuildingId = form.homeBuildingId || ''
      if (resolvedId && oldBuildingId !== newBuildingId) {
        if (oldBuildingId) {
          await removeResidentFromBuilding(oldBuildingId, resolvedId)
        }
        if (newBuildingId) {
          await addResidentToBuilding(newBuildingId, resolvedId)
        }
      }

      // Keep relationships bidirectional: whatever this NPC's relationship
      // list says, the target's own page must show the reciprocal.
      if (resolvedId) {
        const oldRels = npc?.relationships || []
        const newRels = form.relationships.filter((r) => r.targetId)
        const oldByTarget = Object.fromEntries(oldRels.map((r) => [r.targetId, r.type]))
        const newByTarget = Object.fromEntries(newRels.map((r) => [r.targetId, r.type]))
        const allTargetIds = new Set([...Object.keys(oldByTarget), ...Object.keys(newByTarget)])

        for (const targetId of allTargetIds) {
          const oldType = oldByTarget[targetId]
          const newType = newByTarget[targetId]
          if (oldType === newType) continue
          const target = npcs.find((n) => n.id === targetId)
          if (!target) continue
          const targetRels = (target.relationships || []).filter((r) => r.targetId !== resolvedId)
          if (newType) {
            targetRels.push({ targetId: resolvedId, type: getRelationshipType(newType).reciprocal })
          }
          await saveNpc({ ...target, relationships: targetRels })
        }
      }

      onClose()
    } catch (err) {
      console.error('Failed to save resident:', err)
      setSaveError(err.message || 'Something went wrong while saving. Check the console for details.')
    }
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
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4"
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
        <p className="text-xs text-ink-soft/60 italic -mt-2">
          This unlocks their full detail page. Their NAME can still surface earlier than this,
          on its own, if you mark a building they're a resident of as "Revealed to players" — see
          that building's edit form.
        </p>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Home Building</span>
          <select
            value={form.homeBuildingId || ''}
            onChange={(e) => set('homeBuildingId', e.target.value)}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          >
            <option value="">— none —</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Job / Role</span>
          <input
            value={form.job}
            onChange={(e) => set('job', e.target.value)}
            placeholder="e.g. Blacksmith, Magistrate's clerk, Ranger"
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Species</span>
            <input
              list="species-suggestions"
              value={form.species || ''}
              onChange={(e) => set('species', e.target.value)}
              placeholder="e.g. Human"
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
            <datalist id="species-suggestions">
              {[
                'Human', 'Elf', 'Half-Elf', 'Dwarf', 'Halfling', 'Gnome',
                'Half-Orc', 'Orc', 'Tiefling', 'Dragonborn', 'Goliath',
              ].map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Gender</span>
            <input
              list="gender-suggestions"
              value={form.gender || ''}
              onChange={(e) => set('gender', e.target.value)}
              placeholder="e.g. Woman"
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
            <datalist id="gender-suggestions">
              {['Woman', 'Man', 'Nonbinary'].map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </label>
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Class</span>
            <select
              value={form.dndClass || ''}
              onChange={(e) => set('dndClass', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            >
              <option value="">— none —</option>
              {NPC_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-xs text-ink-soft/60 italic -mt-2">
          Species, Gender, and Class feed the Roster tab's category filters. Like Job, these only
          surface to players once this resident is individually marked visible above — a
          building-driven name-only reveal shows the name alone.
        </p>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">Famous Quote</span>
          <input
            value={form.famousQuote}
            onChange={(e) => set('famousQuote', e.target.value)}
            placeholder="Something they're known for saying"
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2 italic"
          />
        </label>

        <label className="block max-w-[10rem]">
          <span className="text-sm font-display uppercase text-ink-soft">Age</span>
          <input
            type="number"
            min="0"
            value={form.age}
            onChange={(e) => set('age', e.target.value)}
            placeholder="Years"
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Eye Color</span>
            <input
              value={form.eyeColor}
              onChange={(e) => set('eyeColor', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Hair Color</span>
            <input
              value={form.hairColor}
              onChange={(e) => set('hairColor', e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Height</span>
            <input
              value={form.height}
              onChange={(e) => set('height', e.target.value)}
              placeholder={`e.g. 5'8"`}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-sm font-display uppercase text-ink-soft">Weight</span>
            <input
              value={form.weight}
              onChange={(e) => set('weight', e.target.value)}
              placeholder="e.g. 160 lb"
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-display uppercase text-ink-soft">
            Distinguishing Features
          </span>
          <input
            value={form.distinguishingFeatures}
            onChange={(e) => set('distinguishingFeatures', e.target.value)}
            placeholder="Scars, tattoos, a missing finger, anything memorable"
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
          />
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
          <p className="text-xs text-ink-soft/60 italic mb-2">
            Each person can only have one relationship with this resident — adding a new one
            replaces any existing tie to that person, on both pages.
          </p>
          <div className="space-y-2">
            {form.relationships.map((rel, i) => {
              const usedElsewhere = new Set(
                form.relationships.filter((_, idx) => idx !== i).map((r) => r.targetId)
              )
              const availableTargets = otherNpcs.filter(
                (n) => n.id === rel.targetId || !usedElsewhere.has(n.id)
              )
              const isCustomType = rel.type && !SELECTABLE_TYPES.some((t) => t.id === rel.type)
              return (
                <div key={i} className="flex flex-wrap gap-2 items-center">
                  <select
                    value={rel.targetId}
                    onChange={(e) => updateRel(i, 'targetId', e.target.value)}
                    className="flex-1 min-w-[140px] rounded-sm border border-leather bg-white/60 px-2 py-1 text-sm"
                  >
                    <option value="">— select resident —</option>
                    {availableTargets.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={isCustomType ? '__custom__' : rel.type}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') updateRel(i, 'type', '')
                      else updateRel(i, 'type', e.target.value)
                    }}
                    className="rounded-sm border border-leather bg-white/60 px-2 py-1 text-sm"
                  >
                    {SELECTABLE_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                    <option value="__custom__">+ Custom…</option>
                  </select>
                  {isCustomType && (
                    <input
                      value={rel.type}
                      onChange={(e) => updateRel(i, 'type', e.target.value)}
                      placeholder="Custom relationship name"
                      className="rounded-sm border border-leather bg-white/60 px-2 py-1 text-sm w-40"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeRel(i)}
                    aria-label="Remove relationship"
                    className="text-wax text-lg leading-none px-1"
                  >
                    ×
                  </button>
                </div>
              )
            })}
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
        {saveError && (
          <p className="text-sm text-wax bg-wax/10 border border-wax/40 rounded-sm px-3 py-2">
            {saveError}
          </p>
        )}
      </form>
    </div>
  )
}
