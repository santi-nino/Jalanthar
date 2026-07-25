import { useState } from 'react'
import { useData } from '../contexts/DataContext'

// Simple list-and-delete view for the sources collection. Upload Source
// only ever CREATES; this is what closes the loop -- an orphaned or
// duplicate source (an old re-seeded ID, a DM-uploaded doc that's been
// superseded) can now actually be removed from here instead of needing
// Firebase Console.
export default function ManageSourcesModal({ onClose }) {
  const { sources, removeSource } = useData()
  const [confirmingId, setConfirmingId] = useState(null)
  const [busyId, setBusyId] = useState(null)

  async function handleDelete(id) {
    setBusyId(id)
    try {
      await removeSource(id)
    } finally {
      setBusyId(null)
      setConfirmingId(null)
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
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        <h2 className="font-display text-xl text-leather-dark uppercase tracking-wide">Manage Sources</h2>
        <p className="text-xs text-ink-soft/70 italic -mt-2">
          Every uploaded/scanned source, in one place. Deleting one removes it (and every item it
          contains) from every building's catalog and the Loot generator immediately — this can't
          be undone.
        </p>

        {sources.length === 0 && <p className="text-sm text-ink-soft italic">No sources yet.</p>}

        <ul className="space-y-2">
          {sources.map((s) => {
            const itemCount = (s.wares?.length || 0) + (s.menu?.length || 0) + (s.services?.length || 0)
            return (
              <li key={s.id} className="border border-leather/40 rounded-sm bg-white/50 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-sm text-leather-dark">{s.name}</p>
                    <p className="text-xs text-ink-soft/60">
                      {itemCount} item{itemCount === 1 ? '' : 's'} · id: {s.id}
                    </p>
                  </div>
                  {confirmingId === s.id ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-wax">Delete?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        disabled={busyId === s.id}
                        className="px-2 py-1 text-xs font-display uppercase bg-wax text-parchment rounded-sm hover:opacity-90 disabled:opacity-40"
                      >
                        {busyId === s.id ? 'Deleting…' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(null)}
                        className="text-xs text-ink-soft underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingId(s.id)}
                      className="text-xs text-wax-dark hover:text-wax underline shrink-0"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-display uppercase text-ink-soft"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
