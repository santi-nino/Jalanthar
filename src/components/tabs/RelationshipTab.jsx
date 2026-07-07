import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { FamilyNode, NpcNode, JunctionNode } from '../relationshipNodes'
import NpcDetailPanel from '../NpcDetailPanel'
import { getRelationshipType } from '../../data/relationshipTypes'

const nodeTypes = { family: FamilyNode, npc: NpcNode, junction: JunctionNode }

const EDGE_STYLE = {
  lineage: { stroke: '#33352B', strokeWidth: 1.5 },
  crossLineage: { stroke: '#33352B', strokeWidth: 1.3, strokeDasharray: '3 4', opacity: 0.7 },
  spouse: { stroke: '#8C6B2E', strokeWidth: 2 },
  sibling: { stroke: '#5C6B34', strokeWidth: 1.5, strokeDasharray: '5 4' },
  friendly: { stroke: '#5C6B34', strokeWidth: 2 },
  adverse: { stroke: '#6B1F1A', strokeWidth: 2, strokeDasharray: '6 4' },
  root: { stroke: '#33352B', strokeWidth: 1, opacity: 0.5 },
}

const LINEAGE_TYPES = new Set(['parent', 'child', 'grandparent', 'grandchild', 'uncle', 'aunt', 'niece_nephew'])
const PAIR_TYPES = new Set(['spouse', 'partner'])
const CHAIN_TYPES = new Set(['sibling', 'cousin'])
const ADVERSE_TYPES = new Set(['rival', 'enemy'])

function edgeStyleFor(typeId) {
  if (LINEAGE_TYPES.has(typeId)) return EDGE_STYLE.lineage
  if (PAIR_TYPES.has(typeId)) return EDGE_STYLE.spouse
  if (CHAIN_TYPES.has(typeId)) return EDGE_STYLE.sibling
  if (ADVERSE_TYPES.has(typeId)) return EDGE_STYLE.adverse
  return EDGE_STYLE.friendly
}

const NPC_SLOT = 170
const GEN_ROW_HEIGHT = 140
const FAMILY_HEADER_Y = 0
const FAMILY_GAP = 100

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

function layoutFamily(members, npcsById, genOverrides = {}) {
  const memberIds = new Set(members.map((m) => m.id))
  const gen = {}

  // DM-assigned generations take priority and seed the BFS directly.
  members.forEach((m) => {
    if (genOverrides[m.id] != null) gen[m.id] = genOverrides[m.id]
  })

  // Remaining unambiguous roots — no parent-type relationship anywhere
  // (in-family or not) AND no spouse/partner within this family. Anyone
  // with a spouse is deliberately excluded here, even if they have no
  // recorded parents themselves (e.g. a minor character married into the
  // family) — their generation should come from their spouse, not default
  // to 0, which was the source of an earlier layout bug.
  members.forEach((m) => {
    if (gen[m.id] != null) return
    const hasParentAnywhere = (m.relationships || []).some(
      (r) => getRelationshipType(r.type).genDelta < 0
    )
    const hasInFamilySpouse = (m.relationships || []).some(
      (r) => PAIR_TYPES.has(r.type) && memberIds.has(r.targetId)
    )
    if (!hasParentAnywhere && !hasInFamilySpouse) gen[m.id] = 0
  })
  if (Object.keys(gen).length === 0 && members.length) gen[members[0].id] = 0

  // Phase 2: BFS out from those roots using every relationship's genDelta
  const queue = Object.keys(gen)
  let iter = 0
  while (queue.length && iter < 4000) {
    iter++
    const id = queue.shift()
    const npc = npcsById[id]
    if (!npc) continue
    ;(npc.relationships || []).forEach((r) => {
      if (!memberIds.has(r.targetId)) return
      const delta = getRelationshipType(r.type).genDelta
      const targetGen = gen[id] + delta
      if (gen[r.targetId] == null) {
        gen[r.targetId] = targetGen
        queue.push(r.targetId)
      }
    })
  }

  // Phase 3: anyone still unresolved (e.g. a spouse whose partner just got
  // assigned) inherits from any already-resolved relation. Loop until no
  // more progress.
  let progressed = true
  let safety = 0
  while (progressed && safety < 50) {
    progressed = false
    safety++
    members.forEach((m) => {
      if (gen[m.id] != null) return
      for (const r of m.relationships || []) {
        if (!memberIds.has(r.targetId)) continue
        if (gen[r.targetId] == null) continue
        gen[m.id] = gen[r.targetId] - getRelationshipType(r.type).genDelta
        progressed = true
        break
      }
    })
  }

  // Phase 4: truly isolated members default to 0
  members.forEach((m) => {
    if (gen[m.id] == null) gen[m.id] = 0
  })

  const minGen = Math.min(...Object.values(gen))
  members.forEach((m) => {
    gen[m.id] -= minGen
  })

  // Group same-generation members: blood siblings/cousins form a contiguous
  // chain, and a spouse/partner who married in is pushed to whichever end
  // of that chain sits nearest their partner, rather than wedged between
  // two blood relatives.
  const byGen = {}
  members.forEach((m) => {
    ;(byGen[gen[m.id]] ||= []).push(m.id)
  })
  const maxGen = Math.max(...Object.keys(byGen).map(Number))

  const clustersByGen = {}
  Object.keys(byGen).forEach((g) => {
    const genIds = byGen[g]
    const genIdSet = new Set(genIds)

    const chainUf = makeUnionFind(genIds)
    genIds.forEach((id) => {
      const npc = npcsById[id]
      ;(npc.relationships || []).forEach((r) => {
        if (CHAIN_TYPES.has(r.type) && genIdSet.has(r.targetId)) {
          chainUf.union(id, r.targetId)
        }
      })
    })
    const chainMap = new Map()
    genIds.forEach((id) => {
      const root = chainUf.find(id)
      if (!chainMap.has(root)) chainMap.set(root, [])
      chainMap.get(root).push(id)
    })

    const pairOf = {}
    genIds.forEach((id) => {
      const npc = npcsById[id]
      const rel = (npc.relationships || []).find(
        (r) => PAIR_TYPES.has(r.type) && genIdSet.has(r.targetId)
      )
      if (rel) pairOf[id] = rel.targetId
    })

    const consumed = new Set()
    const clusters = []
    chainMap.forEach((chain) => {
      if (chain.some((id) => consumed.has(id))) return
      let order = [...chain]

      order.forEach((id) => {
        const sp = pairOf[id]
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
        const sp = pairOf[id]
        const partnerOutside = sp && !order.includes(sp)
        if (i === 0 && partnerOutside) {
          finalOrder.push(sp)
          consumed.add(sp)
        }
        finalOrder.push(id)
        if (i === order.length - 1 && partnerOutside) {
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
          if (getRelationshipType(r.type).genDelta < 0 && positions[r.targetId] != null) {
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
  const { families, npcs, saveFamily } = useData()
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
  // Firestore doesn't guarantee document order, so without sorting explicitly
  // the family left-to-right order could shuffle on any unrelated update,
  // making previously-dragged positions look like they "reset."
  const sortedFamilies = useMemo(
    () => [...families].sort((a, b) => a.id.localeCompare(b.id)),
    [families]
  )

  const computed = useMemo(() => {
    const nodes = []
    const edges = []
    let cursorX = 0
    const familyIdByNpc = {}

    sortedFamilies.forEach((fam) => {
      const collapsed = !expandedFamilyIds.has(fam.id)
      const members = visibleNpcs.filter((n) => n.familyName === fam.name)
      const genOverrides = fam.genOverrides || {}
      const layout = collapsed
        ? { positions: {}, gen: {}, minX: 0, width: NPC_SLOT * 1.2, memberIds: new Set() }
        : layoutFamily(members, npcsById, genOverrides)

      const familyX = cursorX + layout.width / 2
      const famNodeId = `fam-node-${fam.id}`
      const treeLayout = fam.treeLayout || {}
      const headerPos = treeLayout.__self__ || { x: familyX - 70, y: FAMILY_HEADER_Y }

      nodes.push({
        id: famNodeId,
        type: 'family',
        position: headerPos,
        data: {
          label: fam.name,
          collapsed,
          familyId: fam.id,
          onToggleCollapse: () => toggleFamilyCollapse(fam.id),
          onEdit: isDm && onEditFamily ? () => onEditFamily(fam) : undefined,
          onResetLayout:
            isDm && fam.treeLayout && Object.keys(fam.treeLayout).length
              ? () => saveFamily({ ...fam, treeLayout: {} })
              : undefined,
        },
        draggable: true,
      })

      if (!collapsed) {
        const override = treeLayout
        members.forEach((npc) => {
          const auto = {
            x: cursorX + (layout.positions[npc.id] - layout.minX),
            y: FAMILY_HEADER_Y + 90 + layout.gen[npc.id] * GEN_ROW_HEIGHT,
          }
          // A manually-pinned generation always wins over a stale drag
          // position, which would otherwise float in the wrong row.
          const pos = genOverrides[npc.id] != null ? auto : override[npc.id] || auto
          familyIdByNpc[npc.id] = fam.id
          nodes.push({
            id: npc.id,
            type: 'npc',
            position: pos,
            data: {
              label: npc.name,
              job: npc.job,
              age: npc.age,
              familyId: fam.id,
              onClick: () => setSelectedNpcId(npc.id),
            },
          })
        })

        members
          .filter((m) => layout.gen[m.id] === 0 && !override[m.id])
          .forEach((m) => {
            edges.push({
              id: `e-root-${m.id}`,
              source: famNodeId,
              sourceHandle: 'bottom',
              target: m.id,
              targetHandle: 'top',
              type: 'smoothstep',
              style: EDGE_STYLE.root,
            })
          })

        // Parent -> child lineage. Children with two in-family parents route
        // through a small shared junction point below the couple, so both
        // parents visibly connect without drawing two crossing diagonals.
        const childrenByParentPair = new Map()
        const singleParentChildren = new Map()

        members.forEach((npc) => {
          ;(npc.relationships || []).forEach((r) => {
            if (!layout.memberIds.has(r.targetId)) return
            if (r.type !== 'parent') return
            const childId = r.targetId
            const existing = singleParentChildren.get(childId)
            if (existing == null) {
              singleParentChildren.set(childId, npc.id)
            } else if (existing !== npc.id) {
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
          const posA = override[parentAId] || {
            x: cursorX + (layout.positions[parentAId] - layout.minX),
            y: FAMILY_HEADER_Y + 90 + layout.gen[parentAId] * GEN_ROW_HEIGHT,
          }
          const posB = override[parentBId] || {
            x: cursorX + (layout.positions[parentBId] - layout.minX),
            y: FAMILY_HEADER_Y + 90 + layout.gen[parentBId] * GEN_ROW_HEIGHT,
          }
          // The junction sits directly on the marriage line itself (same
          // row, at the midpoint) rather than floating below it — so no
          // separate line is needed connecting each parent to it, matching
          // the standard genogram convention where children drop from the
          // couple's own connecting line, not from two extra diagonals.
          const jx = (posA.x + posB.x) / 2
          const jy = posA.y

          familyIdByNpc[junctionId] = fam.id
          nodes.push({
            id: junctionId,
            type: 'junction',
            position: override[junctionId] || { x: jx, y: jy },
            data: { familyId: fam.id },
            draggable: false,
          })
          childIds.forEach((childId) => {
            edges.push({
              id: `e-lineage-${junctionId}-${childId}`,
              source: junctionId,
              sourceHandle: 'bottom',
              target: childId,
              targetHandle: 'top',
              type: 'smoothstep',
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
            type: 'smoothstep',
            style: EDGE_STYLE.lineage,
          })
        })

        // Every parent-child pair that actually got a rendered line above
        // (via junction or single-parent), used below to detect when a
        // sibling/avuncular/grandparent tie is already visually implied and
        // doesn't need its own separate line.
        const renderedParentOf = new Map() // childId -> Set(parentIds)
        function noteParent(childId, parentId) {
          if (!renderedParentOf.has(childId)) renderedParentOf.set(childId, new Set())
          renderedParentOf.get(childId).add(parentId)
        }
        childrenByParentPair.forEach((childIds, pairKey) => {
          const [a, b] = pairKey.split('|')
          childIds.forEach((c) => {
            noteParent(c, a)
            noteParent(c, b)
          })
        })
        singleParentChildren.forEach((parentId, childId) => noteParent(childId, parentId))

        function sharesRenderedParent(idA, idB) {
          const pa = renderedParentOf.get(idA)
          const pb = renderedParentOf.get(idB)
          if (!pa || !pb) return false
          for (const p of pa) if (pb.has(p)) return true
          return false
        }

        // Grandparent / uncle-aunt ties: skip drawing a direct line when the
        // connection is already fully traceable through lines already on
        // screen (a rendered parent who is themselves a rendered sibling of
        // the target, or a rendered parent whose own rendered parent is the
        // target) — drawing it anyway would just be a redundant extra line
        // crossing through the same two people.
        members.forEach((npc) => {
          ;(npc.relationships || []).forEach((r) => {
            if (!layout.memberIds.has(r.targetId)) return
            if (r.type !== 'grandparent' && r.type !== 'uncle' && r.type !== 'aunt') return

            const myParents = renderedParentOf.get(npc.id) || new Set()
            let inferable = false
            for (const p of myParents) {
              if (r.type === 'grandparent') {
                const grandparentsOfP = renderedParentOf.get(p)
                if (grandparentsOfP && grandparentsOfP.has(r.targetId)) inferable = true
              } else {
                // uncle/aunt: inferable if my parent and the target share a
                // rendered parent (i.e. are rendered siblings)
                if (sharesRenderedParent(p, r.targetId)) inferable = true
              }
              if (inferable) break
            }
            if (inferable) return

            edges.push({
              id: `e-avuncular-${npc.id}-${r.targetId}`,
              source: r.targetId,
              sourceHandle: 'bottom',
              target: npc.id,
              targetHandle: 'top',
              type: 'smoothstep',
              style: EDGE_STYLE.lineage,
            })
          })
        })

        // Spouse/partner edges (one per pair)
        const seenPairs = new Set()
        members.forEach((npc) => {
          ;(npc.relationships || []).forEach((r) => {
            if (!layout.memberIds.has(r.targetId)) return
            if (!PAIR_TYPES.has(r.type)) return
            const key = [npc.id, r.targetId].sort().join('|')
            if (seenPairs.has(key)) return
            seenPairs.add(key)
            const posA = override[npc.id] || { x: layout.positions[npc.id] }
            const posB = override[r.targetId] || { x: layout.positions[r.targetId] }
            const [leftId, rightId] = posA.x <= posB.x ? [npc.id, r.targetId] : [r.targetId, npc.id]
            edges.push({
              id: `e-pair-${key}`,
              source: leftId,
              sourceHandle: 'right',
              target: rightId,
              targetHandle: 'left',
              style: EDGE_STYLE.spouse,
            })
          })
        })

        // Sibling/cousin chains: connect adjacent-by-position only, so a
        // group of N siblings gets N-1 lines rather than every pair.
        const chainUf2 = makeUnionFind(members.map((m) => m.id))
        members.forEach((npc) => {
          ;(npc.relationships || []).forEach((r) => {
            if (!layout.memberIds.has(r.targetId)) return
            if (!CHAIN_TYPES.has(r.type)) return
            if (layout.gen[r.targetId] === layout.gen[npc.id]) chainUf2.union(npc.id, r.targetId)
          })
        })
        const chainGroups = new Map()
        members.forEach((npc) => {
          const inChain = (npc.relationships || []).some(
            (r) => layout.memberIds.has(r.targetId) && CHAIN_TYPES.has(r.type)
          )
          if (!inChain) return
          const root = chainUf2.find(npc.id)
          if (!chainGroups.has(root)) chainGroups.set(root, [])
          chainGroups.get(root).push(npc.id)
        })
        chainGroups.forEach((group) => {
          const sorted = [...group].sort(
            (a, b) => (override[a]?.x ?? layout.positions[a]) - (override[b]?.x ?? layout.positions[b])
          )
          for (let i = 0; i < sorted.length - 1; i++) {
            if (sharesRenderedParent(sorted[i], sorted[i + 1])) continue
            edges.push({
              id: `e-chain-${sorted[i]}-${sorted[i + 1]}`,
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
    // in different rendered family clusters
    const renderedNpcIds = new Set(nodes.filter((n) => n.type === 'npc').map((n) => n.id))
    const seenCross = new Set()
    visibleNpcs.forEach((npc) => {
      if (!renderedNpcIds.has(npc.id)) return
      ;(npc.relationships || []).forEach((r) => {
        if (r.type !== 'parent' && r.type !== 'child') return
        if (!renderedNpcIds.has(r.targetId)) return
        if (familyIdByNpc[r.targetId] === familyIdByNpc[npc.id]) return
        const key = [npc.id, r.targetId].sort().join('|')
        if (seenCross.has(key)) return
        seenCross.add(key)
        const [parentId, childId] = r.type === 'parent' ? [r.targetId, npc.id] : [npc.id, r.targetId]
        edges.push({
          id: `e-cross-${key}`,
          source: parentId,
          sourceHandle: 'bottom',
          target: childId,
          targetHandle: 'top',
          type: 'smoothstep',
          style: EDGE_STYLE.crossLineage,
        })
      })
    })

    // Everything else (Friend, Coworker, Rival, Enemy, custom types) — a
    // simple direct edge, deduped, cross-family included
    const seen = new Set()
    visibleNpcs.forEach((npc) => {
      if (!renderedNpcIds.has(npc.id)) return
      ;(npc.relationships || []).forEach((rel) => {
        if (LINEAGE_TYPES.has(rel.type) || PAIR_TYPES.has(rel.type) || CHAIN_TYPES.has(rel.type)) return
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
          style: edgeStyleFor(rel.type),
          label: getRelationshipType(rel.type).label,
        })
      })
    })

    return { nodes, edges }
  }, [sortedFamilies, visibleNpcs, npcsById, isDm, onEditFamily, expandedFamilyIds, saveFamily])

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

  const handleNodeDragStop = useCallback(
    (_event, node) => {
      const familyId = node.data.familyId
      const fam = families.find((f) => f.id === familyId)
      if (isDm && fam) {
        if (node.type === 'npc' || node.type === 'junction') {
          const treeLayout = { ...(fam.treeLayout || {}), [node.id]: node.position }
          saveFamily({ ...fam, treeLayout })
        } else if (node.type === 'family' && dragState.current) {
          const treeLayout = { ...(fam.treeLayout || {}), __self__: node.position }
          nodes.forEach((n) => {
            if ((n.type === 'npc' || n.type === 'junction') && n.data.familyId === familyId) {
              treeLayout[n.id] = n.position
            }
          })
          saveFamily({ ...fam, treeLayout })
        }
      }
      dragState.current = null
    },
    [families, isDm, saveFamily, nodes]
  )

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
        {isDm && (
          <p className="absolute bottom-3 left-3 z-10 text-xs font-mono bg-ink/70 text-parchment px-2 py-1 rounded-sm max-w-xs">
            Drag any resident to reposition them — it's saved automatically. Drag a family's
            banner to move everyone in it together.
          </p>
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
            defaultEdgeOptions={{ type: 'straight' }}
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
