import { Handle, Position } from 'reactflow'

// Medieval-flavored developmental stages for children; adults just show
// their years.
function ageLabel(age) {
  const n = Number(age)
  if (age === '' || age == null || Number.isNaN(n)) return ''
  if (n < 1) return 'Babe in Arms'
  if (n < 4) return 'Toddling Child'
  if (n < 8) return 'Young Child'
  if (n < 13) return 'Child'
  if (n < 18) return 'Stripling'
  return `Age ${n}`
}

// Every connection point needs to work as BOTH a source and a target,
// since the same "left" or "top" handle might be the starting point for
// one edge and the ending point for another depending on which side of a
// given relationship this particular person falls on. A single Handle can
// only declare one type, so each position gets two stacked handles (same
// id, one source and one target) rather than one handle doing double duty
// — that mismatch was the actual cause of lines collapsing onto whichever
// handle happened to be correctly typed.
function FourWayHandles({ hidden = true }) {
  const cls = hidden ? '!opacity-0' : ''
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

export function FamilyNode({ data }) {
  return (
    <div className="relative px-4 py-2 rounded-sm bg-leather text-parchment border-2 border-gold shadow-md min-w-[140px] cursor-move">
      <FourWayHandles />
      <button
        onClick={data.onToggleCollapse}
        onPointerDown={(e) => e.stopPropagation()}
        className="w-full flex items-center justify-center gap-1.5 font-display uppercase tracking-wide text-sm text-center hover:text-gold-light transition-colors cursor-pointer"
        title={data.collapsed ? 'Expand family' : 'Collapse family'}
      >
        <span className="text-xs leading-none">{data.collapsed ? '▸' : '▾'}</span>
        {data.label}
      </button>
      {data.onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            data.onEdit()
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`Edit ${data.label}`}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-wax border border-gold text-parchment text-xs leading-none flex items-center justify-center hover:bg-wax-dark"
        >
          ✎
        </button>
      )}
      {data.onResetLayout && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            data.onResetLayout()
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`Reset ${data.label} layout`}
          title="Reset to automatic layout"
          className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-moss-dark border border-gold text-parchment text-xs leading-none flex items-center justify-center hover:bg-moss"
        >
          ↺
        </button>
      )}
    </div>
  )
}

export function JunctionNode() {
  return (
    <div className="w-6 h-6 flex items-center justify-center cursor-move" style={{ pointerEvents: 'all' }}>
      <FourWayHandles />
      <div className="w-1.5 h-1.5 rounded-full bg-leather/50" style={{ pointerEvents: 'none' }} />
    </div>
  )
}

export function NpcNode({ data }) {
  const age = ageLabel(data.age)
  return (
    <button
      onClick={data.onClick}
      className="relative px-3 py-2 rounded-sm bg-parchment border-2 border-leather shadow-sm font-body text-sm text-ink hover:border-wax hover:text-wax transition-colors w-[150px] text-center cursor-pointer overflow-hidden"
    >
      <FourWayHandles />
      <span className="block truncate">{data.label}</span>
      {(data.job || age) && (
        <span className="block text-[10px] text-ink-soft/70 font-body italic leading-tight mt-0.5 truncate">
          {data.job}
          {data.job && age && ' · '}
          {age}
        </span>
      )}
    </button>
  )
}
