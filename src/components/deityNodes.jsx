import { Handle, Position } from 'reactflow'

// Same four-way-handle trick relationshipNodes.jsx uses for NPCs -- every
// side needs to work as both a source and target since the same handle
// might start one edge and end another depending on which deity a given
// relationship is drawn from.
function FourWayHandles() {
  const cls = '!opacity-0'
  return (
    <>
      <Handle type="target" position={Position.Top} id="top" className={cls} isConnectable={false} />
      <Handle type="source" position={Position.Top} id="top" className={cls} isConnectable={false} />
      <Handle type="target" position={Position.Bottom} id="bottom" className={cls} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={cls} isConnectable={false} />
      <Handle type="target" position={Position.Left} id="left" className={cls} isConnectable={false} />
      <Handle type="source" position={Position.Left} id="left" className={cls} isConnectable={false} />
      <Handle type="target" position={Position.Right} id="right" className={cls} isConnectable={false} />
      <Handle type="source" position={Position.Right} id="right" className={cls} isConnectable={false} />
    </>
  )
}

// Every card is the same fixed size regardless of a deity's name length or
// how much prose their detail page holds -- only the half-page panel that
// opens on click shows the full picture. A dead/merged deity renders with
// a dashed, muted border instead of a solid gold one, so the tree reads at
// a glance which gods are still active without opening every card.
export function DeityNode({ data }) {
  const isDead = data.status === 'dead' || data.status === 'merged'
  return (
    <button
      onClick={data.onClick}
      className={`relative px-3 py-2 rounded-sm shadow-sm font-body text-sm w-[160px] h-[64px] text-center cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-colors ${
        isDead
          ? 'bg-parchment/50 border-2 border-dashed border-leather/40 text-ink-soft/70 hover:border-leather/70'
          : 'bg-parchment border-2 border-leather text-ink hover:border-wax hover:text-wax'
      }`}
      title={isDead ? `${data.label} — ${data.status}` : data.label}
    >
      <FourWayHandles />
      {data.creatorPatron && (
        <span className="absolute top-1 left-1 text-[10px] leading-none" title="Creator/Patron of a people" aria-hidden="true">
          ♛
        </span>
      )}
      <span className="block font-display truncate w-full">{data.label}</span>
      {data.title && (
        <span className="block text-[10px] italic leading-tight mt-0.5 truncate w-full opacity-80">
          {data.title}
        </span>
      )}
    </button>
  )
}

// A pantheon cluster's own header banner, same visual role FamilyNode
// plays for the NPC tree -- collapsible, draggable, everything under it
// moves as a unit.
export function PantheonNode({ data }) {
  return (
    <div className="relative px-4 py-2 rounded-sm bg-leather text-parchment border-2 border-gold shadow-md min-w-[160px] cursor-move">
      <FourWayHandles />
      <button
        onClick={data.onToggleCollapse}
        onPointerDown={(e) => e.stopPropagation()}
        className="w-full flex items-center justify-center gap-1.5 font-display uppercase tracking-wide text-sm text-center hover:text-gold-light transition-colors cursor-pointer"
        title={data.collapsed ? 'Expand pantheon' : 'Collapse pantheon'}
      >
        <span className="text-xs leading-none">{data.collapsed ? '▸' : '▾'}</span>
        {data.label}
      </button>
    </div>
  )
}
