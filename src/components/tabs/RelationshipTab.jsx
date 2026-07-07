import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { FamilyNode, NpcNode, JunctionNode } from '../relationshipNodes'
import NpcDetailPanel from '../NpcDetailPanel'

const nodeTypes = { family: FamilyNode, npc: NpcNode, junction: JunctionNode }

const EDGE_STYLE = {
  lineage: { stroke: '#33352B', strokeWidth: 1.5 },
  crossLineage: { stroke: '#33352B', strokeWidth: 1.3, strokeDasharray: '3 4', opacity: 0.7 },
  spouse: { stroke: '#8C6B2E', strokeWidth: 2 },
  sibling: { stroke: '#5C6B34', strokeWidth: 1.5, strokeDasharray: '5 4' },
  friend: { stroke: '#5C6B34', strokeWidth: 2 },
  rival: { stroke: '#6B1F1A', strokeWidth: 2, strokeDasharray: '6 4' },
  root: { stroke: '#33352B', strokeWidth: 1, opacity: 0.5 },
}

const NPC_SLOT = 150
const GEN_ROW_HEIGHT = 140
const FAMILY_HEADER_Y = 0
const FAMILY_GAP = 100

// Note-text keywords drive the generational layout, since family relationships
// are stored as free-text notes rather than a fixed subtype. Keep to these
// words ("Parent", "Child", "Spouse", "Sibling"/"Siblings") in a relationship's
// note for it to be read correctly by the tree layout.
function noteType(note) {
  const n = (note || '').toLowerCase()
  if (n.includes('parent')) return 'parent'
  if (n.includes('child')) return 'child'
  if (n.includes('spouse')) return 'spouse'
  if (n.includes('sibling')) return 'sibling'
  return null
}

function makeUnionFind(ids) {
  const parent = {}
  ids.forEach((id) => (parent[id] = id))
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]
      x = parent[x]
    }
    return x
  }
  function union(a, b) {
    const ra = find(a)
    const rb = find(b)
    if (ra !== rb) parent[ra] = rb
  }
  return { find, union }
}

function layoutFamily(members, npcsById) {
  const memberIds = new Set(members.map((m) => m.id))
  const gen = {}

  // A member is only a generation-0 "root" if they have NO parent recorded
  // anywhere (in this family or otherwise) — someone who married in from
  // another family (a parent recorded elsewhere) should NOT be treated as a
  // root; their generation comes from their spouse instead, via the BFS below.
  members.forEach((m) => {
    const hasAnyParent = (m.relationships || []).some((r) => noteType(r.note) === 'parent')
    if (!hasAnyParent) gen[m.id] = 0
  })
  if (Object.keys(gen).length === 0 && members.length) gen[members[0].id] = 0

  const queue = Object.keys(gen)
  let iter = 0
  while (queue.length && iter < 2000) {
    iter++
    const id = queue.shift()
    const npc = npcsById[id]
    if (!npc) continue
    ;(npc.relationships || []).forEach((r) => {
      if (!memberIds.has(r.targetId)) return
      const t = noteType(r.note)
      let targetGen = null
      if (t === 'child') targetGen = gen[id] + 1
      else if (t === 'parent') targetGen = gen[id] - 1
      else if (t === 'spouse' || t === 'sibling') targetGen = gen[id]
      if (targetGen == null) return
      if (gen[r.targetId] == null) {
        gen[r.targetId] = targetGen
        queue.push(r.targetId)
      }
    })
  }
  members.forEach((m) => {
    if (gen[m.id] == null) gen[m.id] = 0
  })
  const minGen = Math.min(...Object.values(gen))
  members.forEach((m) => {
    gen[m.id] -= minGen
  })

  // Group same-generation members: blood siblings form a contiguous chain,
  // and a spouse who married in (not a blood relative of this family) is
  // pushed to whichever end of that chain sits nearest their partner, rather
  // than being wedged between two siblings.
  const byGen = {}
  members.forEach((m) => {
    ;(byGen[gen[m.id]] ||= []).push(m.id)
  })
  const maxGen = Math.max(...Object.keys(byGen).map(Number))

  const clustersByGen = {}
  Object.keys(byGen).forEach((g) => {
    const genIds = byGen[g]
    const genIdSet = new Set(genIds)

    // Pure sibling-only union-find (blood relatives at this generation)
    const siblingUf = makeUnionFind(genIds)
    genIds.forEach((id) => {
      const npc = npcsById[id]
      ;(npc.relationships || []).forEach((r) => {
        if (noteType(r.note) === 'sibling' && genIdSet.has(r.targetId)) {
          siblingUf.union(id, r.targetId)
        }
      })
    })
    const chainMap = new Map()
    genIds.forEach((id) => {
      const root = siblingUf.find(id)
      if (!chainMap.has(root)) chainMap.set(root, [])
      chainMap.get(root).push(id)
    })

    // Spouse pairs within this generation
    const spouseOf = {}
    genIds.forEach((id) => {
      const npc = npcsById[id]
      const rel = (npc.relationships || []).find(
        (r) => noteType(r.note) === 'spouse' && genIdSet.has(r.targetId)
      )
      if (rel) spouseOf[id] = rel.targetId
    })

    const consumed = new Set()
    const clusters = []
    chainMap.forEach((chain) => {
      if (chain.some((id) => consumed.has(id))) return
      let order = [...chain]

      // If a spouse belongs to someone in the middle of the chain, move that
      // person to the nearer end so their spouse can attach outside the chain
      order.forEach((id) => {
        const sp = spouseOf[id]
        if (!sp || order.includes(sp)) return
        const i = order.indexOf(id)
        if (i !== 0 && i !== order.length - 1) {
          order.splice(i, 1)
          if (i < order.length / 2) order.unshift(id)
          else order.push(id)
        }
      })

      const finalOrder = []
      order.forEach((id, i) => {
        const sp = spouseOf[id]
        const spouseIsOutsideChain = sp && !order.includes(sp)
        if (i === 0 && spouseIsOutsideChain) {
          finalOrder.push(sp)
          consumed.add(sp)
        }
        finalOrder.push(id)
        if (i === order.length - 1 && spouseIsOutsideChain) {
          finalOrder.push(sp)
          consumed.add(sp)
        }
      })
      order.forEach((id) => consumed.add(id))
      clusters.push(finalOrder)
    })
    genIds.forEach((id) => {
      if (!consumed.has(id)) clusters.push([id])
    })

    clustersByGen[g] = clusters
  })

  const positions = {}
  function clusterWidth(cluster) {
    return cluster.length * NPC_SLOT
  }
  function placeRow(clusters, barycenterFn) {
    let ordered = clusters
    if (barycenterFn) {
      ordered = clusters
        .map((c) => ({ c, key: barycenterFn(c) }))
        .sort((a, b) => a.key - b.key)
        .map((o) => o.c)
    }
    const totalW = ordered.reduce((s, c) => s + clusterWidth(c), 0)
    let cursor = -totalW / 2
    ordered.forEach((cluster) => {
      const w = clusterWidth(cluster)
      cluster.forEach((id, i) => {
        positions[id] = cursor + i * NPC_SLOT + NPC_SLOT / 2
      })
      cursor += w
    })
  }

  placeRow(clustersByGen[0] || [])
  for (let g = 1; g <= maxGen; g++) {
    placeRow(clustersByGen[g] || [], (cluster) => {
      let sum = 0
      let count = 0
      cluster.forEach((id) => {
        const npc = npcsById[id]
        ;(npc.relationships || []).forEach((r) => {
          if (!memberIds.has(r.targetId)) return
          if (noteType(r.note) === 'parent' && positions[r.targetId] != null) {
            sum += positions[r.targetId]
            count++
          }
        })
      })
      return count ? sum / count : 0
    })
  }

  const xs = Object.values(positions)
  const minX = xs.length ? Math.min(...xs) : 0
  const maxX = xs.length ? Math.max(...xs) : 0
  const width = maxX - minX + NPC_SLOT

  return { gen, positions, maxGen, minX, width, memberIds }
}

export default function RelationshipTab({ onEditNpc, onEditFamily }) {
  const { families, npcs } = useData()
  const { isDm } = useAuth()
  const [selectedNpcId, setSelectedNpcId] = useState(null)
  const [expandedFamilyIds, setExpandedFamilyIds] = useState(() => new Set())
  const dragState = useRef(null)

  function toggleFamilyCollapse(famId) {
    setExpandedFamilyIds((prev) => {
      const next = new Set(prev)
      if (next.has(famId)) next.delete(famId)
      else next.add(famId)
      return next
    })
  }

  const visibleNpcs = useMemo(() => npcs.filter((n) => isDm || n.visible), [npcs, isDm])
  const npcsById = useMemo(() => Object.fromEntries(npcs.map((n) => [n.id, n])), [npcs])

  const computed = useMemo(() => {
    const nodes = []
    const edges = []
    let cursorX = 0
    const familyIdByNpc = {}
    const positionByNpc = {}

    families.forEach((fam) => {
      const collapsed = !expandedFamilyIds.has(fam.id)
      const members = visibleNpcs.filter((n) => n.familyName === fam.name)
      const layout = collapsed
        ? { positions: {}, gen: {}, minX: 0, width: NPC_SLOT * 1.2, memberIds: new Set() }
        : layoutFamily(members, npcsById)

      const familyX = cursorX + layout.width / 2
      const famNodeId = `fam-node-${fam.id}`

      nodes.push({
        id: famNodeId,
        type: 'family',
        position: { x: familyX - 70, y: FAMILY_HEADER_Y },
        data: {
          label: fam.name,
          collapsed,
          familyId: fam.id,
          onToggleCollapse: () => toggleFamilyCollapse(fam.id),
          onEdit: isDm && onEditFamily ? () => onEditFamily(fam) : undefined,
        },
        draggable: true,
      })

      if (!collapsed) {
        members.forEach((npc) => {
          const x = cursorX + (layout.positions[npc.id] - layout.minX)
          const y = FAMILY_HEADER_Y + 90 + layout.gen[npc.id] * GEN_ROW_HEIGHT
          familyIdByNpc[npc.id] = fam.id
          positionByNpc[npc.id] = { x, y }
          nodes.push({
            id: npc.id,
            type: 'npc',
            position: { x, y },
            data: {
              label: npc.name,
              familyId: fam.id,
              onClick: () => setSelectedNpcId(npc.id),
            },
          })
        })

        // Root generation gets a thin connector up to the family header
        members
          .filter((m) => layout.gen[m.id] === 0)
          .forEach((m) => {
            edges.push({
              id: `e-root-${m.id}`,
              source: famNodeId,
              sourceHandle: 'bottom',
              target: m.id,
              targetHandle: 'top',
              style: EDGE_STYLE.root,
            })
          })

        // Parent -> child lineage. Children with two in-family parents route
        // through a small shared junction point below the couple, so both
        // parents visibly connect without drawing two crossing diagonals.
        // Children with only one in-family parent connect directly.
        const childrenByParentPair = new Map()
        const singleParentChildren = new Map() // childId -> parentId

        members.forEach((npc) => {
          ;(npc.relationships || []).forEach((r) => {
            if (!layout.memberIds.has(r.targetId)) return
            if (noteType(r.note) !== 'child') return
            const childId = r.targetId
            const existing = singleParentChildren.get(childId)
            if (existing == null) {
              singleParentChildren.set(childId, npc.id)
            } else if (existing !== npc.id) {
              // second in-family parent found — this child has a pair
              const pairKey = [existing, npc.id].sort().join('|')
              if (!childrenByParentPair.has(pairKey)) childrenByParentPair.set(pairKey, [])
              childrenByParentPair.get(pairKey).push(childId)
              singleParentChildren.delete(childId)
            }
          })
        })

        childrenByParentPair.forEach((childIds, pairKey) => {
          const [parentAId, parentBId] = pairKey.split('|')
          const junctionId = `junction-${fam.id}-${pairKey}`
          const jx = (layout.positions[parentAId] + layout.positions[parentBId]) / 2
          const parentY = FAMILY_HEADER_Y + 90 + layout.gen[parentAId] * GEN_ROW_HEIGHT
          const childGen = layout.gen[childIds[0]]
          const jy = parentY + (childGen - layout.gen[parentAId]) * GEN_ROW_HEIGHT * 0.5

          familyIdByNpc[junctionId] = fam.id
          nodes.push({
            id: junctionId,
            type: 'junction',
            position: { x: cursorX + (jx - layout.minX), y: jy },
            data: { familyId: fam.id },
            draggable: false,
          })
          edges.push({
            id: `e-junc-a-${junctionId}`,
            source: parentAId,
            sourceHandle: 'bottom',
            target: junctionId,
            targetHandle: 'top',
            style: EDGE_STYLE.lineage,
          })
          edges.push({
            id: `e-junc-b-${junctionId}`,
            source: parentBId,
            sourceHandle: 'bottom',
            target: junctionId,
            targetHandle: 'top',
            style: EDGE_STYLE.lineage,
          })
          childIds.forEach((childId) => {
            edges.push({
              id: `e-lineage-${junctionId}-${childId}`,
              source: junctionId,
              sourceHandle: 'bottom',
              target: childId,
              targetHandle: 'top',
              style: EDGE_STYLE.lineage,
            })
          })
        })

        singleParentChildren.forEach((parentId, childId) => {
          edges.push({
            id: `e-lineage-${parentId}-${childId}`,
            source: parentId,
            sourceHandle: 'bottom',
            target: childId,
            targetHandle: 'top',
            style: EDGE_STYLE.lineage,
          })
        })

        // Spouse edges (one per pair)
        const seenSpousePairs = new Set()
        members.forEach((npc) => {
          ;(npc.relationships || []).forEach((r) => {
            if (!layout.memberIds.has(r.targetId)) return
            if (noteType(r.note) !== 'spouse') return
            const key = [npc.id, r.targetId].sort().join('|')
            if (seenSpousePairs.has(key)) return
            seenSpousePairs.add(key)
            const aX = layout.positions[npc.id]
            const bX = layout.positions[r.targetId]
            const [leftId, rightId] = aX <= bX ? [npc.id, r.targetId] : [r.targetId, npc.id]
            edges.push({
              id: `e-spouse-${key}`,
              source: leftId,
              sourceHandle: 'right',
              target: rightId,
              targetHandle: 'left',
              style: EDGE_STYLE.spouse,
            })
          })
        })

        // Sibling edges: chain only adjacent-by-position siblings within a
        // sibling-only grouping (ignores any spouse sitting between them),
        // so a group of N siblings gets N-1 connecting lines, not every pair.
        const siblingUf = makeUnionFind(members.map((m) => m.id))
        members.forEach((npc) => {
          ;(npc.relationships || []).forEach((r) => {
            if (!layout.memberIds.has(r.targetId)) return
            if (noteType(r.note) !== 'sibling') return
            if (layout.gen[r.targetId] === layout.gen[npc.id]) siblingUf.union(npc.id, r.targetId)
          })
        })
        const siblingGroups = new Map()
        members.forEach((npc) => {
          const isInAnySiblingRel = (npc.relationships || []).some(
            (r) => layout.memberIds.has(r.targetId) && noteType(r.note) === 'sibling'
          )
          if (!isInAnySiblingRel) return
          const root = siblingUf.find(npc.id)
          if (!siblingGroups.has(root)) siblingGroups.set(root, [])
          siblingGroups.get(root).push(npc.id)
        })
        siblingGroups.forEach((group) => {
          const sorted = [...group].sort((a, b) => layout.positions[a] - layout.positions[b])
          for (let i = 0; i < sorted.length - 1; i++) {
            edges.push({
              id: `e-sibling-${sorted[i]}-${sorted[i + 1]}`,
              source: sorted[i],
              sourceHandle: 'right',
              target: sorted[i + 1],
              targetHandle: 'left',
              style: EDGE_STYLE.sibling,
            })
          }
        })
      }

      cursorX += layout.width + FAMILY_GAP
    })

    // Cross-family lineage: a parent/child link where the two people ended up
    // in different rendered family clusters (e.g. someone married in and their
    // birth parents are shown under a different family name)
    const renderedNpcIds = new Set(nodes.filter((n) => n.type === 'npc').map((n) => n.id))
    const seenCross = new Set()
    visibleNpcs.forEach((npc) => {
      if (!renderedNpcIds.has(npc.id)) return
      ;(npc.relationships || []).forEach((r) => {
        const t = noteType(r.note)
        if (t !== 'parent' && t !== 'child') return
        if (!renderedNpcIds.has(r.targetId)) return
        if (familyIdByNpc[r.targetId] === familyIdByNpc[npc.id]) return
        const key = [npc.id, r.targetId].sort().join('|')
        if (seenCross.has(key)) return
        seenCross.add(key)
        const [parentId, childId] = t === 'parent' ? [r.targetId, npc.id] : [npc.id, r.targetId]
        edges.push({
          id: `e-cross-${key}`,
          source: parentId,
          sourceHandle: 'bottom',
          target: childId,
          targetHandle: 'top',
          style: EDGE_STYLE.crossLineage,
        })
      })
    })

    // Friend/rival edges between visible NPCs (cross-family, dedup)
    const seen = new Set()
    visibleNpcs.forEach((npc) => {
      if (!renderedNpcIds.has(npc.id)) return
      ;(npc.relationships || []).forEach((rel) => {
        if (rel.type === 'family') return
        if (!renderedNpcIds.has(rel.targetId)) return
        const key = [npc.id, rel.targetId].sort().join('|') + rel.type
        if (seen.has(key)) return
        seen.add(key)
        edges.push({
          id: `e-${key}`,
          source: npc.id,
          sourceHandle: 'bottom',
          target: rel.targetId,
          targetHandle: 'bottom',
          style: EDGE_STYLE[rel.type] || EDGE_STYLE.friend,
          label: rel.type,
        })
      })
    })

    return { nodes, edges }
  }, [families, visibleNpcs, npcsById, isDm, onEditFamily, expandedFamilyIds])

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    setNodes(computed.nodes)
    setEdges(computed.edges)
  }, [computed, setNodes, setEdges])

  const handleNodeDragStart = useCallback(
    (_event, node) => {
      if (node.type !== 'family') return
      const familyId = node.data.familyId
      const members = {}
      nodes.forEach((n) => {
        if ((n.type === 'npc' || n.type === 'junction') && n.data.familyId === familyId) {
          members[n.id] = n.position
        }
      })
      dragState.current = { familyId, startFamilyPos: node.position, members }
    },
    [nodes]
  )

  const handleNodeDrag = useCallback(
    (_event, node) => {
      if (node.type !== 'family' || !dragState.current) return
      const { startFamilyPos, members, familyId } = dragState.current
      if (familyId !== node.data.familyId) return
      const dx = node.position.x - startFamilyPos.x
      const dy = node.position.y - startFamilyPos.y
      setNodes((prev) =>
        prev.map((n) => {
          if ((n.type === 'npc' || n.type === 'junction') && n.data.familyId === familyId && members[n.id]) {
            return { ...n, position: { x: members[n.id].x + dx, y: members[n.id].y + dy } }
          }
          return n
        })
      )
    },
    [setNodes]
  )

  const handleNodeDragStop = useCallback(() => {
    dragState.current = null
  }, [])

  const selectedNpc = selectedNpcId ? npcsById[selectedNpcId] : null

  return (
    <div className="relative h-full w-full flex">
      <div className="flex-1 relative">
        {isDm && (onEditNpc || onEditFamily) && (
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            {onEditFamily && (
              <button
                onClick={() => onEditFamily(null)}
                className="text-sm font-display uppercase tracking-wide bg-moss-dark text-parchment rounded-sm px-3 py-2 hover:bg-moss shadow"
              >
                + Add Family
              </button>
            )}
            {onEditNpc && (
              <button
                onClick={() => onEditNpc(null)}
                className="text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm px-3 py-2 hover:bg-leather-dark shadow"
              >
                + Add Resident
              </button>
            )}
          </div>
        )}
        {nodes.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="font-display text-leather text-lg italic px-8 text-center max-w-md">
              {isDm
                ? 'No families recorded yet. Use "+ Add Family" above to begin the tree.'
                : 'No families recorded yet.'}
            </p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStart={handleNodeDragStart}
            onNodeDrag={handleNodeDrag}
            onNodeDragStop={handleNodeDragStop}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#33352B" gap={24} />
            <Controls />
          </ReactFlow>
        )}
      </div>

      {selectedNpc && (
        <aside className="fixed inset-0 z-30 md:static md:z-auto w-full md:w-96 shrink-0 border-l-0 md:border-l-2 border-leather bg-parchment paper-texture overflow-y-auto p-6 relative">
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
