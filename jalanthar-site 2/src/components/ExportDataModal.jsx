import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'

export default function ExportDataModal({ onClose }) {
  const { buildings, families, npcs } = useData()
  const { isDm } = useAuth()
  const [copied, setCopied] = useState(false)

  if (!isDm) return null

  const json = JSON.stringify({ exportedAt: new Date().toISOString(), buildings, families, npcs }, null, 2)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can fail quietly (permissions, older browsers) — the
      // textarea below is already selectable/copyable by hand as a fallback.
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
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col p-6"
      >
        <h2 className="font-display text-xl text-leather-dark uppercase tracking-wide mb-2">
          Export Campaign Data
        </h2>
        <p className="text-sm text-ink-soft mb-3">
          Since this site is a live web app, Claude can't just fetch the URL and read it — the
          content only exists after your browser loads it from the database. Copy the block
          below and paste it into a chat with Claude to bring it fully up to date on every
          building and resident, exactly as they currently are.
        </p>
        <textarea
          readOnly
          value={json}
          onClick={(e) => e.target.select()}
          className="flex-1 min-h-[300px] w-full rounded-sm border border-leather bg-white/60 px-3 py-2 font-mono text-xs"
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-ink-soft/60">
            {buildings.length} buildings · {families.length} families · {npcs.length} residents
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-display uppercase text-ink-soft"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-sm font-display uppercase bg-leather text-parchment rounded-sm hover:bg-leather-dark"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
