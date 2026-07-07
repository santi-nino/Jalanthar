import { Handle, Position } from 'reactflow'

export function FamilyNode({ data }) {
  return (
    <div className="relative px-4 py-2 rounded-sm bg-leather text-parchment border-2 border-gold shadow-md min-w-[140px] cursor-move">
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-gold" isConnectable={false} />
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
    </div>
  )
}

export function NpcNode({ data }) {
  return (
    <button
      onClick={data.onClick}
      className="relative px-3 py-2 rounded-sm bg-parchment border-2 border-leather shadow-sm font-body text-sm text-ink hover:border-wax hover:text-wax transition-colors min-w-[120px] text-center cursor-pointer"
    >
      <Handle type="target" position={Position.Top} id="top" className="!bg-leather" isConnectable={false} />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-leather opacity-0" isConnectable={false} />
      <Handle type="source" position={Position.Left} id="left" className="!bg-gold opacity-0" isConnectable={false} />
      <Handle type="source" position={Position.Right} id="right" className="!bg-gold opacity-0" isConnectable={false} />
      {data.label}
    </button>
  )
}
