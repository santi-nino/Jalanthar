import { Handle, Position } from 'reactflow'

export function FamilyNode({ data }) {
  const Tag = data.onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={data.onClick}
      className={`px-4 py-2 rounded-sm bg-leather text-parchment border-2 border-gold shadow-md font-display uppercase tracking-wide text-sm text-center min-w-[140px] ${
        data.onClick ? 'cursor-pointer hover:border-gold-light hover:text-gold-light transition-colors' : ''
      }`}
    >
      <Handle type="source" position={Position.Bottom} className="!bg-gold" />
      {data.label}
    </Tag>
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
