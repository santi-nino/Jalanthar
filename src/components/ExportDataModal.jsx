import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'

const TABS = [
  { id: 'world', label: 'World Data' },
  { id: 'items', label: 'Item Data' },
]

export default function ExportDataModal({ onClose }) {
  const { buildings, families, npcs, sources } = useData()
  const { isDm } = useAuth()
  const [activeTab, setActiveTab] = useState('world')
  const [copied, setCopied] = useState(false)

  if (!isDm) return null

  const worldJson = JSON.stringify({ exportedAt: new Date().toISOString(), buildings, families, npcs }, null, 2)

  // Every item, from every source, with every field intact -- including
  // the invisible loot-generation ones (monsterTypeTags, lootTags,
  // generic cross-cutting tags) that never show up anywhere else in the
  // UI. This is specifically for keeping Claude in sync on item data
  // without relying on a separate document upload, since that's proven
  // unreliable twice now -- this tab uses the exact same copy-paste
  // mechanism that already works for World Data.
  const itemsJson = JSON.stringify({ exportedAt: new Date().toISOString(), sources }, null, 2)
  const totalItems = (sources || []).reduce(
    (sum, s) => sum + (s.wares?.length || 0) + (s.menu?.length || 0) + (s.services?.length || 0),
    0
  )

  const json = activeTab === 'world' ? worldJson : itemsJson

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can fail quietly (permissions, older browsers) -- the
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
          Since this site is a live web app, Claude can't just fetch the URL and read it -- the
          content only exists after your browser loads it from the database. Copy the block below
          and paste it into a chat with Claude to bring it fully up to date, exactly as things
          currently stand.
        </p>

        <div className="flex gap-2 mb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 text-xs font-display uppercase tracking-wide rounded-sm border ${
                activeTab === t.id
                  ? 'bg-leather text-parchment border-leather'
                  : 'bg-white/50 border-leather/40 text-ink-soft hover:border-leather'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'items' && (
          <p className="text-xs text-ink-soft/60 italic mb-2">
            Every item from every source (both the ones Claude built for you and anything you've
            uploaded yourself), with every field intact -- names, prices, descriptions, and the
            invisible loot-generation tags (which monster type it belongs to, which loot
            "kind"/origin/diet it's restricted to, and generic cross-cutting tags like martial or
            junk). This is the reliable way to get item data to Claude -- document uploads haven't
            been going through.
          </p>
        )}

        <textarea
          readOnly
          value={json}
          onClick={(e) => e.target.select()}
          className="flex-1 min-h-[300px] w-full rounded-sm border border-leather bg-white/60 px-3 py-2 font-mono text-xs"
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-ink-soft/60">
            {activeTab === 'world'
              ? `${buildings.length} buildings \u00b7 ${families.length} families \u00b7 ${npcs.length} residents`
              : `${(sources || []).length} source${(sources || []).length === 1 ? '' : 's'} \u00b7 ${totalItems} items total`}
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
