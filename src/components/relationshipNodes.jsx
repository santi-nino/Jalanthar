import { Handle, Position } from 'reactflow'

export function FamilyNode({ data }) {
  return (
    <div className="relative px-4 py-2 rounded-sm bg-leather text-parchment border-2 border-gold shadow-md min-w-[140px]">
      <Handle type="source" position={Position.Bottom} className="!bg-gold" />
      <button
        onClick={data.onToggleCollapse}
        className="w-full flex items-center justify-center gap-1.5 font-display uppercase tracking-wide text-sm text-center hover:text-gold-light transition-colors"
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
      className="px-3 py-2 rounded-sm bg-parchment border-2 border-leather shadow-sm font-body text-sm text-ink hover:border-wax hover:text-wax transition-colors min-w-[120px] text-center"
    >
      <Handle type="target" position={Position.Top} className="!bg-leather" />
      {data.label}
      <Handle type="source" position={Position.Bottom} className="!bg-leather opacity-0" />
    </button>
  )
}
