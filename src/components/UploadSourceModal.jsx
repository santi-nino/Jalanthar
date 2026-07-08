import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { parseSourceDocument, SOURCE_AI_UNCONFIGURED } from '../utils/sourceAi'
import { formatPrice } from '../utils/price'

const ACCEPTED = '.pdf,.jpg,.jpeg,.png,.webp'

function makeRow() {
  return {
    rowId: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    basePrice: 0,
    description: '',
    priceOverride: '',
    quantity: 1,
  }
}

function ItemRows({ label, rows, onChange }) {
  function update(rowId, key, value) {
    onChange(rows.map((r) => (r.rowId === rowId ? { ...r, [key]: value } : r)))
  }
  function remove(rowId) {
    onChange(rows.filter((r) => r.rowId !== rowId))
  }
  function add() {
    onChange([...rows, makeRow()])
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark">
          {label} <span className="text-ink-soft/50 font-body normal-case">({rows.length})</span>
        </h4>
        <button type="button" onClick={add} className="text-xs text-moss-dark underline">
          + Add row
        </button>
      </div>
      {rows.length === 0 && <p className="text-xs text-ink-soft/60 italic mb-2">Nothing here.</p>}
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.rowId} className="border border-leather/30 rounded-sm px-3 py-2 bg-white/40">
            <div className="flex items-start gap-2">
              <input
                value={row.name}
                onChange={(e) => update(row.rowId, 'name', e.target.value)}
                placeholder="Item name"
                className="flex-1 rounded-sm border border-leather bg-white/70 px-2 py-1 text-sm font-semibold"
              />
              <button
                type="button"
                onClick={() => remove(row.rowId)}
                aria-label={`Remove ${row.name || 'row'}`}
                className="text-wax text-lg leading-none px-1 shrink-0"
              >
                ×
              </button>
            </div>
            <input
              value={row.description}
              onChange={(e) => update(row.rowId, 'description', e.target.value)}
              placeholder="Description"
              className="mt-1.5 w-full rounded-sm border border-leather/60 bg-white/70 px-2 py-1 text-xs italic"
            />
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <label className="flex items-center gap-1 text-xs text-ink-soft/70">
                gp
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={row.basePrice}
                  onChange={(e) => update(row.rowId, 'basePrice', Number(e.target.value) || 0)}
                  className="w-20 rounded-sm border border-leather bg-white/70 px-2 py-1 text-xs"
                />
              </label>
              <span className="text-xs text-ink-soft/50">{formatPrice(row.basePrice)}</span>
              <label className="flex items-center gap-1 text-xs text-ink-soft/70 ml-auto">
                Qty
                <input
                  type="number"
                  min="0"
                  value={row.quantity}
                  onChange={(e) =>
                    update(row.rowId, 'quantity', Math.max(0, Math.round(Number(e.target.value) || 0)))
                  }
                  className="w-16 rounded-sm border border-leather bg-white/70 px-2 py-1 text-xs"
                />
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function UploadSourceModal({ onClose }) {
  const { saveSource } = useData()
  const { isDm } = useAuth()
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | scanning | review | saving | error
  const [error, setError] = useState('')
  const [result, setResult] = useState(null) // { sourceName, category, wares, menu, services }

  if (!isDm) return null

  async function handleFileChange(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setStatus('scanning')
    setError('')
    try {
      const parsed = await parseSourceDocument(f)
      setResult(parsed)
      setStatus('review')
    } catch (err) {
      setStatus('error')
      if (err.message === SOURCE_AI_UNCONFIGURED) {
        setError(
          'No AI backend is configured yet. Add a free VITE_GEMINI_API_KEY (Google AI Studio, no card required) to your build secrets, or set VITE_ANTHROPIC_API_KEY as a paid fallback. See the README.'
        )
      } else {
        setError(err.message || 'Something went wrong while scanning that file.')
      }
    }
  }

  function updateField(key, value) {
    setResult((r) => ({ ...r, [key]: value }))
  }

  async function handleSave() {
    setStatus('saving')
    try {
      await saveSource({
        name: result.sourceName,
        category: result.category,
        wares: result.wares,
        menu: result.menu,
        services: result.services,
        createdAt: Date.now(),
      })
      onClose()
    } catch (err) {
      setStatus('review')
      setError(err.message || 'Failed to save this source.')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        <h2 className="font-display text-xl text-leather-dark uppercase tracking-wide">
          Upload Source
        </h2>
        <p className="text-xs text-ink-soft/70 italic -mt-2">
          Upload a price list, menu, or equipment sheet (PDF or image). It gets scanned into a
          named, categorized set of wares/menu/services you can pull into any building's edit
          form afterward — nothing is attached to a building automatically.
        </p>

        {status === 'idle' && (
          <label className="block w-full py-8 border-2 border-dashed border-leather/50 rounded-sm text-center text-ink-soft/70 text-sm hover:bg-leather/5 cursor-pointer">
            Click to choose a PDF or image
            <input type="file" accept={ACCEPTED} onChange={handleFileChange} className="hidden" />
          </label>
        )}

        {status === 'scanning' && (
          <div className="py-8 text-center text-ink-soft italic">
            Scanning {file?.name}… this can take a few seconds.
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-3">
            <p className="text-sm text-wax bg-wax/10 border border-wax/40 rounded-sm px-3 py-2">
              {error}
            </p>
            <label className="block w-full py-6 border-2 border-dashed border-leather/50 rounded-sm text-center text-ink-soft/70 text-sm hover:bg-leather/5 cursor-pointer">
              Try a different file
              <input type="file" accept={ACCEPTED} onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        )}

        {(status === 'review' || status === 'saving') && result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-display uppercase text-ink-soft">Source Name</span>
                <input
                  value={result.sourceName}
                  onChange={(e) => updateField('sourceName', e.target.value)}
                  className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-display uppercase text-ink-soft">Category</span>
                <input
                  value={result.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  placeholder="e.g. Outfitter, Tavern Menu, Blacksmith"
                  className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2"
                />
              </label>
            </div>

            <ItemRows label="Wares" rows={result.wares} onChange={(v) => updateField('wares', v)} />
            <ItemRows label="Menu" rows={result.menu} onChange={(v) => updateField('menu', v)} />
            <ItemRows
              label="Services"
              rows={result.services}
              onChange={(v) => updateField('services', v)}
            />

            {error && (
              <p className="text-sm text-wax bg-wax/10 border border-wax/40 rounded-sm px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setStatus('idle')
                  setResult(null)
                  setFile(null)
                }}
                className="text-sm text-ink-soft underline"
              >
                Start over
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-display uppercase text-ink-soft"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={status === 'saving' || !result.sourceName.trim()}
                  className="px-4 py-2 text-sm font-display uppercase bg-leather text-parchment rounded-sm hover:bg-leather-dark disabled:opacity-40"
                >
                  {status === 'saving' ? 'Saving…' : 'Save Source'}
                </button>
              </div>
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-display uppercase text-ink-soft"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
