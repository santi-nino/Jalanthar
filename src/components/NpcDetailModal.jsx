import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import NpcDetailPanel from './NpcDetailPanel'
import { isNpcFullyVisible } from '../utils/visibility'

export default function NpcDetailModal({ npcId, onNavigate, onClose, onEditNpc }) {
  const { npcs } = useData()
  const { isDm } = useAuth()
  const npcsById = Object.fromEntries(npcs.map((n) => [n.id, n]))
  const npc = npcsById[npcId]
  if (!npc || !isNpcFullyVisible(npc, isDm)) return null

  return (
    <div
      className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6 relative"
      >
        <button
          onClick={onClose}
          aria-label="Close resident details"
          className="absolute top-3 right-3 text-leather-dark hover:text-wax text-xl leading-none"
        >
          ×
        </button>
        <NpcDetailPanel
          npc={npc}
          npcsById={npcsById}
          onSelectRelated={onNavigate}
          onEdit={isDm && onEditNpc ? () => onEditNpc(npc) : undefined}
        />
      </div>
    </div>
  )
}
