import { useMemo, useState } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { FamilyNode, NpcNode } from '../relationshipNodes'
import NpcDetailPanel from '../NpcDetailPanel'

const nodeTypes = { family: FamilyNode, npc: NpcNode }

const REL_EDGE_STYLE = {
  family: { stroke: '#6B4226', strokeWidth: 1.5 },
  friend: { stroke: '#5C6B47', strokeWidth: 2 },
  rival: { stroke: '#8B2E2E', strokeWidth: 2, strokeDasharray: '6 4' },
}

export default function RelationshipTab({ onEditNpc }) {
  // Add-resident affordance lives in the top-right overlay below.
  const { families, npcs } = useData()
  const { isDm } = useAuth()
  const [selectedNpcId, setSelectedNpcId] = useState(null)

  const visibleNpcs = useMemo(
    () => npcs.filter((n) => isDm || n.visible),
    [npcs, isDm]
  )
  const npcsById = useMemo(
    () => Object.fromEntries(npcs.map((n) => [n.id, n])),
    [npcs]
  )

  const { nodes, edges } = useMemo(() => {
    const nodes = []
    const edges = []
    const FAMILY_GAP_X = 240
    const NPC_GAP_X = 150

    families.forEach((fam, famIdx) => {
      const famX = famIdx * FAMILY_GAP_X
      nodes.push({
        id: `fam-node-${fam.id}`,
        type: 'family',
        position: { x: famX, y: 0 },
        data: { label: fam.name },
        draggable: false,
      })

      const members = visibleNpcs.filter((n) => n.familyName === fam.name)
      members.forEach((npc, i) => {
        const npcX = famX + (i - (members.length - 1) / 2) * NPC_GAP_X
        nodes.push({
          id: npc.id,
          type: 'npc',
          position: { x: npcX, y: 150 },
          data: { label: npc.name, onClick: () => setSelectedNpcId(npc.id) },
        })
        edges.push({
          id: `e-fam-${npc.id}`,
          source: `fam-node-${fam.id}`,
          target: npc.id,
          style: REL_EDGE_STYLE.family,
        })
      })
    })

    // Friend/rival edges between visible NPCs (avoid duplicating a<->b twice)
    const seen = new Set()
    visibleNpcs.forEach((npc) => {
      ;(npc.relationships || []).forEach((rel) => {
        if (rel.type === 'family') return
        if (!npcsById[rel.targetId] || !visibleNpcs.find((n) => n.id === rel.targetId)) return
        const key = [npc.id, rel.targetId].sort().join('|') + rel.type
        if (seen.has(key)) return
        seen.add(key)
        edges.push({
          id: `e-${key}`,
          source: npc.id,
          target: rel.targetId,
          style: REL_EDGE_STYLE[rel.type] || REL_EDGE_STYLE.friend,
          label: rel.type,
        })
      })
    })

    return { nodes, edges }
  }, [families, visibleNpcs, npcsById])

  const selectedNpc = selectedNpcId ? npcsById[selectedNpcId] : null

  return (
    <div className="relative h-full w-full flex">
      <div className="flex-1 relative">
        {isDm && onEditNpc && (
          <button
            onClick={() => onEditNpc(null)}
            className="absolute top-3 right-3 z-10 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm px-3 py-2 hover:bg-leather-dark shadow"
          >
            + Add Resident
          </button>
        )}
        {nodes.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="font-display text-leather text-lg italic px-8 text-center max-w-md">
              No families recorded yet. The DM can add family lines from the edit
              panel to begin the tree.
            </p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#6B4226" gap={24} />
            <Controls />
          </ReactFlow>
        )}
      </div>

      {selectedNpc && (
        <aside className="w-96 shrink-0 border-l-2 border-leather bg-parchment paper-texture overflow-y-auto p-6 relative">
          <button
            onClick={() => setSelectedNpcId(null)}
            aria-label="Close resident details"
            className="absolute top-3 right-3 text-leather-dark hover:text-wax text-xl leading-none"
          >
            ×
          </button>
          <NpcDetailPanel
            npc={selectedNpc}
            npcsById={npcsById}
            onSelectRelated={setSelectedNpcId}
            onEdit={isDm && onEditNpc ? () => onEditNpc(selectedNpc) : undefined}
          />
        </aside>
      )}
    </div>
  )
}
