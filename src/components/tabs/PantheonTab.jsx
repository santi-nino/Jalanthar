import { useMemo, useState, useCallback, useEffect } from 'react'
import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { DeityNode, PantheonNode } from '../deityNodes'
import DeityDetailPanel from '../DeityDetailPanel'
import { PANTHEONS } from '../../data/deityRelationshipTypes'

const nodeTypes = { deity: DeityNode, pantheon: PantheonNode }

// Nine distinct edge appearances, one per relationship kind -- see the
// design notes in deityRelationshipTypes.js for what each one means.
// Unlike the NPC tree (a strict genealogy), this graph is meant to show
// real cross-pantheon connections too, so nothing here is scoped to "only
// draws within one cluster" -- an edge renders wherever both its
// endpoints are currently rendered, regardless of which pantheon(s)
// they belong to.
const DEITY_EDGE_STYLE = {
  lineage: { stroke: '#33352B', strokeWidth: 1.5 },
  sibling: { stroke: '#5C6B34', strokeWidth: 1.3, strokeDasharray: '3 5' },
  spouse: { stroke: '#B08F4A', strokeWidth: 2 },
  ally: { stroke: '#3D6B3A', strokeWidth: 1.6, strokeDasharray: '7 4' },
  enemy: { stroke: '#8C2A22', strokeWidth: 1.6, strokeDasharray: '7 4' },
  killed: { stroke: '#8C2A22', strokeWidth: 2 },
  absorbed: { stroke: '#5B3A8C', strokeWidth: 1.5, strokeDasharray: '2 4' },
  patron: { stroke: '#6B6B5C', strokeWidth: 1.5 },
  overlap: { stroke: '#B0731F', strokeWidth: 1.3, strokeDasharray: '2 5' },
  root: { stroke: '#33352B', strokeWidth: 1, opacity: 0.5 },
}

const LEGEND = [
  { key: 'lineage', label: 'Parent / Child' },
  { key: 'sibling', label: 'Sibling' },
  { key: 'spouse', label: 'Spouse / Consort ♥' },
  { key: 'ally', label: 'Ally' },
  { key: 'enemy', label: 'Enemy' },
  { key: 'killed', label: 'Killed 💀' },
  { key: 'absorbed', label: 'Absorbed portfolio' },
  { key: 'patron', label: 'Patron / Subordinate' },
  { key: 'overlap', label: 'Overlapping domain' },
]

function edgeStyleFor(typeId) {
  if (typeId === 'parent' || typeId === 'child') return DEITY_EDGE_STYLE.lineage
  if (typeId === 'sibling') return DEITY_EDGE_STYLE.sibling
  if (typeId === 'spouse') return DEITY_EDGE_STYLE.spouse
  if (typeId === 'ally') return DEITY_EDGE_STYLE.ally
  if (typeId === 'enemy') return DEITY_EDGE_STYLE.enemy
  if (typeId === 'killed' || typeId === 'killed_by') return DEITY_EDGE_STYLE.killed
  if (typeId === 'absorbed' || typeId === 'absorbed_by') return DEITY_EDGE_STYLE.absorbed
  if (typeId === 'subordinate_to' || typeId === 'patron_of') return DEITY_EDGE_STYLE.patron
  if (typeId === 'overlap') return DEITY_EDGE_STYLE.overlap
  return DEITY_EDGE_STYLE.root
}

function edgeLabelFor(rel) {
  if (rel.type === 'killed' || rel.type === 'killed_by') return `💀${rel.note ? ` ${rel.note}` : ''}`
  if (rel.type === 'spouse') return '♥'
  if (rel.type === 'absorbed' || rel.type === 'absorbed_by') return 'absorbed'
  if (rel.type === 'overlap') return 'shared domain'
  if (rel.type === 'subordinate_to' || rel.type === 'patron_of') return 'patron of'
  return undefined
}

// Deities are grouped into one cluster per pantheon and laid out on a
// small, FIXED grid keyed off PANTHEONS' own fixed order -- deliberately
// simpler than the NPC tree's generation-aware layout algorithm
// (layoutFamily in RelationshipTab.jsx). That algorithm exists to solve
// strict genealogical row placement (parents above children) for a
// potentially large, ever-growing number of families; a pantheon list is
// a small, fixed set of ~9 clusters, and deity relationships (ally/enemy/
// absorbed/overlap) aren't fundamentally generational the way a family
// tree is, so a plain grid within each cluster -- with the DM able to
// drag any card to a manually-saved position -- covers this well without
// that added complexity.
const CLUSTER_COLS = 3
const CLUSTER_COL_SPACING = 720
const CLUSTER_ROW_SPACING = 420
const DEITY_COLS_PER_CLUSTER = 4
const DEITY_COL_SPACING = 180
const DEITY_ROW_SPACING = 90

function scatterJitter(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export default function PantheonTab({ onEditDeity }) {
  const { deities, saveDeity } = useData()
  const { isDm } = useAuth()
  const [selectedId, setSelectedId] = useState(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState(null)
  const [collapsedPantheons, setCollapsedPantheons] = useState(() => new Set())

  const deitiesById = useMemo(() => Object.fromEntries(deities.map((d) => [d.id, d])), [deities])

  const byPantheon = useMemo(() => {
    const map = {}
    PANTHEONS.forEach((p) => (map[p] = []))
    deities.forEach((d) => {
      const p = PANTHEONS.includes(d.pantheon) ? d.pantheon : PANTHEONS[0]
      ;(map[p] ||= []).push(d)
    })
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.name.localeCompare(b.name)))
    return map
  }, [deities])

  function toggleCollapse(pantheon) {
    setCollapsedPantheons((prev) => {
      const next = new Set(prev)
      if (next.has(pantheon)) next.delete(pantheon)
      else next.add(pantheon)
      return next
    })
  }

  const computed = useMemo(() => {
    const nodes = []
    const edges = []

    PANTHEONS.forEach((pantheon, index) => {
      const members = byPantheon[pantheon] || []
      const collapsed = collapsedPantheons.has(pantheon)
      const col = index % CLUSTER_COLS
      const row = Math.floor(index / CLUSTER_COLS)
      const headerPos = {
        x: col * CLUSTER_COL_SPACING + (scatterJitter(index * 2 + 1) - 0.5) * 160,
        y: row * CLUSTER_ROW_SPACING + (scatterJitter(index * 2 + 2) - 0.5) * 120,
      }
      const clusterNodeId = `cluster-${pantheon}`
      nodes.push({
        id: clusterNodeId,
        type: 'pantheon',
        position: headerPos,
        data: { label: pantheon, collapsed, onToggleCollapse: () => toggleCollapse(pantheon) },
        draggable: false,
      })

      if (collapsed || members.length === 0) return

      const anchorX = headerPos.x + 90
      const anchorY = headerPos.y

      members.forEach((deity, i) => {
        const gridX = (i % DEITY_COLS_PER_CLUSTER) * DEITY_COL_SPACING
        const gridY = 90 + Math.floor(i / DEITY_COLS_PER_CLUSTER) * DEITY_ROW_SPACING
        const offset = deity.treePos || { x: gridX, y: gridY }
        nodes.push({
          id: deity.id,
          type: 'deity',
          position: { x: anchorX + offset.x, y: anchorY + offset.y },
          data: {
            label: deity.name,
            title: deity.title,
            status: deity.status,
            creatorPatron: deity.creatorPatron,
            onClick: () => setSelectedId(deity.id),
          },
        })
      })
    })

    const renderedIds = new Set(nodes.filter((n) => n.type === 'deity').map((n) => n.id))
    const seen = new Set()
    deities.forEach((deity) => {
      if (!renderedIds.has(deity.id)) return
      ;(deity.relationships || []).forEach((rel) => {
        if (!renderedIds.has(rel.targetId)) return
        const key = [deity.id, rel.targetId].sort().join('|') + rel.type
        if (seen.has(key)) return
        seen.add(key)
        edges.push({
          id: `e-${key}`,
          source: deity.id,
          target: rel.targetId,
          sourceHandle: 'bottom',
          targetHandle: 'top',
          type: 'straight',
          style: edgeStyleFor(rel.type),
          label: edgeLabelFor(rel),
          data: { sourceId: deity.id, targetId: rel.targetId, type: rel.type },
        })
      })
    })

    return { nodes, edges }
  }, [deities, byPantheon, collapsedPantheons])

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    setNodes(computed.nodes)
    setEdges(computed.edges)
  }, [computed, setNodes, setEdges])

  const handleNodeDragStop = useCallback(
    (_event, node) => {
      if (node.type !== 'deity' || !isDm) return
      const deity = deitiesById[node.id]
      if (!deity) return
      // Find this deity's cluster anchor to store the drag as an offset
      // (same "relative, not absolute" convention the NPC tree uses) so a
      // pantheon's whole cluster can still be repositioned later without
      // scrambling every member's saved position.
      const clusterNode = nodes.find((n) => n.id === `cluster-${deity.pantheon}`)
      const anchorX = (clusterNode?.position.x ?? 0) + 90
      const anchorY = clusterNode?.position.y ?? 0
      saveDeity({ ...deity, treePos: { x: node.position.x - anchorX, y: node.position.y - anchorY } })
    },
    [isDm, deitiesById, nodes, saveDeity]
  )

  const handleEdgeClick = useCallback(
    (_event, edge) => {
      if (!isDm) return
      setSelectedEdgeId((prev) => (prev === edge.id ? null : edge.id))
    },
    [isDm]
  )

  function deleteSelectedEdge() {
    const edge = edges.find((e) => e.id === selectedEdgeId)
    if (!edge) return
    const source = deitiesById[edge.data.sourceId]
    if (!source) return
    const nextRelationships = (source.relationships || []).filter(
      (r) => !(r.targetId === edge.data.targetId && r.type === edge.data.type)
    )
    saveDeity({ ...source, relationships: nextRelationships })
    setSelectedEdgeId(null)
  }

  const displayEdges = useMemo(
    () =>
      edges.map((e) =>
        e.id === selectedEdgeId
          ? { ...e, style: { ...e.style, strokeWidth: (e.style?.strokeWidth || 1.5) + 1.5, stroke: '#B08F4A' } }
          : e
      ),
    [edges, selectedEdgeId]
  )

  const selectedDeity = selectedId ? deitiesById[selectedId] : null

  return (
    <div className="relative h-full w-full flex">
      <div className="flex-1 relative">
        {isDm && onEditDeity && (
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <button
              onClick={() => onEditDeity(null)}
              className="text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm px-3 py-2 hover:bg-leather-dark shadow"
            >
              + Add Deity
            </button>
          </div>
        )}

        <p className="absolute top-3 left-3 z-10 text-xs font-mono bg-ink/70 text-parchment px-2 py-1 rounded-sm max-w-xs">
          {isDm
            ? 'Click a pantheon banner to expand/collapse it. Drag any deity card to reposition — saved automatically. Click a line to select and delete it.'
            : 'Click a pantheon banner to expand/collapse it. Click a deity card to read more.'}
        </p>

        {/* Legend -- a small fixed key, same idea as a map legend, so the
            nine line styles are always readable without memorizing them. */}
        <div className="absolute bottom-3 left-3 z-10 bg-parchment/95 border border-leather/40 rounded-sm shadow px-3 py-2 text-xs space-y-1 max-w-[220px]">
          <p className="font-display uppercase tracking-wide text-ink-soft/70 mb-1">Legend</p>
          {LEGEND.map((l) => (
            <div key={l.key} className="flex items-center gap-2">
              <svg width="20" height="8" className="shrink-0">
                <line
                  x1="0"
                  y1="4"
                  x2="20"
                  y2="4"
                  stroke={DEITY_EDGE_STYLE[l.key].stroke}
                  strokeWidth={DEITY_EDGE_STYLE[l.key].strokeWidth}
                  strokeDasharray={DEITY_EDGE_STYLE[l.key].strokeDasharray}
                />
              </svg>
              <span className="text-ink-soft">{l.label}</span>
            </div>
          ))}
        </div>

        {isDm && selectedEdgeId && (
          <div className="absolute bottom-3 right-3 z-20 bg-parchment paper-texture border-2 border-gold rounded-sm shadow-lg p-3 flex items-center gap-2">
            <button
              onClick={deleteSelectedEdge}
              className="text-xs font-display uppercase text-wax hover:text-wax-dark border border-wax rounded-sm px-2 py-1"
            >
              Delete line
            </button>
            <button
              onClick={() => setSelectedEdgeId(null)}
              className="text-xs text-ink-soft/60 hover:text-ink-soft px-1"
            >
              ✕
            </button>
          </div>
        )}

        {nodes.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="font-display text-leather text-lg italic px-8 text-center max-w-md">
              {isDm ? 'No deities recorded yet. Use "+ Add Deity" above to begin the pantheon.' : 'No deities recorded yet.'}
            </p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={displayEdges}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{ type: 'straight', interactionWidth: 30 }}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={handleNodeDragStop}
            onEdgeClick={handleEdgeClick}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#33352B" gap={24} />
            <Controls />
          </ReactFlow>
        )}
      </div>

      {/* The "half-page info page" -- roughly half the viewport, not a
          real overlay/modal (no fixed positioning, no backdrop) at the
          md breakpoint and up; on mobile it takes the full screen since
          there's no room to show both side by side. */}
      {selectedDeity && (
        <aside className="fixed inset-0 z-30 md:static md:z-auto w-full md:w-1/2 shrink-0 border-l-0 md:border-l-2 border-leather bg-parchment paper-texture overflow-y-auto p-6 relative">
          <button
            onClick={() => setSelectedId(null)}
            aria-label="Close deity details"
            className="absolute top-3 right-3 text-leather-dark hover:text-wax text-xl leading-none"
          >
            ×
          </button>
          <DeityDetailPanel
            deity={selectedDeity}
            deitiesById={deitiesById}
            onSelectRelated={setSelectedId}
            onEdit={isDm && onEditDeity ? () => onEditDeity(selectedDeity) : undefined}
          />
        </aside>
      )}
    </div>
  )
}
