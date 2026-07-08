import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { FamilyNode, NpcNode, JunctionNode } from '../relationshipNodes'
import NpcDetailPanel from '../NpcDetailPanel'
import { getRelationshipType } from '../../data/relationshipTypes'
import { isNpcNameVisible, isNpcFullyVisible } from '../../utils/visibility'

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

// Sibling/cousin/spouse/partner ties always connect side-to-side, on
// whichever side actually faces the other card — never top/bottom, since
// these are same-generation relationships by definition. Parent/child/
// grandparent/uncle/aunt ties always use fixed top/bottom instead (handled
// separately, at the point each of those edges is built).
function pickLateralHandles(posA, posB) {
  return posB.x >= posA.x
    ? { sourceHandle: 'right', targetHandle: 'left' }
    : { sourceHandle: 'left', targetHandle: 'right' }
}

const NPC_SLOT = 170
const GEN_ROW_HEIGHT = 140
const FAMILY_HEADER_Y = 0
const FAMILY_GAP = 100
// Each family's default horizontal slot is a fixed distance from the last,
// based purely on its sorted position among all families — NOT on the
// rendered width of whichever families happen to be expanded right now.
// That's what stops collapsing/expanding one family from displacing every
// family after it.
const FAMILY_DEFAULT_SPACING = 900

// A DM decluttering a tangled tree by hand nudges a card a modest distance
// from where the graph would otherwise put it — not several family-widths
// away. So instead of comparing a stored offset to some arbitrary global
// cutoff (which either flags legitimate large families as broken or lets
// genuinely stale data through), compare it to THIS member's own current
// auto-computed position. Anything that's drifted further than a few
// card-slots from its natural spot is almost certainly leftover data from
// before positions were switched from absolute canvas coordinates to
// anchor-relative offsets, and gets discarded so the family self-heals back
// under its own header rather than flinging a card off into a neighboring
// family's territory forever.
const MAX_OFFSET_DRIFT_X = NPC_SLOT * 5
const MAX_OFFSET_DRIFT_Y = GEN_ROW_HEIGHT * 3

function sanitizeOffset(offset, auto) {
  if (!offset) return null
  if (Math.abs(offset.x - auto.x) > MAX_OFFSET_DRIFT_X) return null
  if (Math.abs(offset.y - auto.y) > MAX_OFFSET_DRIFT_Y) return null
  return offset
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

function layoutFamily(members, npcsById, genOverrides = {}) {
  const memberIds = new Set(members.map((m) => m.id))
  const gen = {}

  members.forEach((m) => {
    if (genOverrides[m.id] != null) gen[m.id] = genOverrides[m.id]
  })
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
  members.forEach((m) => {
    if (gen[m.id] == null) gen[m.id] = 0
  })

  const minGen = Math.min(...Object.values(gen))
  members.forEach((m) => {
    gen[m.id] -= minGen
  })

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
  const { families, npcs, buildings, saveFamily } = useData()
  const { isDm } = useAuth()
  const [selectedNpcId, setSelectedNpcId] = useState(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState(null)
  const [expandedFamilyIds, setExpandedFamilyIds] = useState(() => new Set())
  const dragState = useRef(null)

  // Non-DM visitors can still drag cards around to declutter their own
  // view, but that only needs to last until they reload the page — no
  // database write required. Kept in sessionStorage (not localStorage) so
  // it clears on its own once the tab/browser closes, matching "until the
  // page is reloaded."
  const [sessionOverrides, setSessionOverrides] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('jalanthar-tree-session-overrides') || '{}')
    } catch {
      return {}
    }
  })

  function toggleFamilyCollapse(famId) {
    setExpandedFamilyIds((prev) => {
      const next = new Set(prev)
      if (next.has(famId)) next.delete(famId)
      else next.add(famId)
      return next
    })
  }

  // Someone appears on the tree the moment their NAME is knowable — either
  // the DM marked them individually visible, or they're a resident of any
  // building the DM has marked revealed (see utils/visibility.js). Whether
  // their card can actually be opened to the full detail page is a
  // separate, stricter check applied per-node below.
  const visibleNpcs = useMemo(
    () => npcs.filter((n) => isNpcNameVisible(n, buildings, isDm)),
    [npcs, buildings, isDm]
  )
  const npcsById = useMemo(() => Object.fromEntries(npcs.map((n) => [n.id, n])), [npcs])
  const sortedFamilies = useMemo(
    () => [...families].sort((a, b) => a.id.localeCompare(b.id)),
    [families]
  )

  const computed = useMemo(() => {
    // --- Pass 1: each family's own internal layout + its default anchor,
    // which depends only on this family's fixed sorted index, never on any
    // other family's collapsed/expanded width.
    const perFamily = sortedFamilies.map((fam, index) => {
      const collapsed = !expandedFamilyIds.has(fam.id)
      const members = visibleNpcs.filter((n) => n.familyName === fam.name)
      const genOverrides = fam.genOverrides || {}
      const layout = collapsed
        ? { positions: {}, gen: {}, minX: 0, width: NPC_SLOT * 1.2, memberIds: new Set() }
        : layoutFamily(members, npcsById, genOverrides)
      // The DM's saved layout is the shared source of truth for everyone.
      // A non-DM visitor's own local drags (this session only) are layered
      // on top of that, so they see the DM's real arrangement as a
      // starting point but can still nudge things for their own screen.
      const treeLayout = { ...(fam.treeLayout || {}), ...(sessionOverrides[fam.id] || {}) }
      const hasManualHeader = treeLayout.__self__ != null
      const defaultHeaderX = index * FAMILY_DEFAULT_SPACING
      const headerPos = treeLayout.__self__ || { x: defaultHeaderX, y: FAMILY_HEADER_Y }
      return { fam, collapsed, members, layout, treeLayout, hasManualHeader, headerPos }
    })

    // --- Pass 2: collision avoidance. Only nudge families that are still
    // using their default (never manually dragged) position, and only to
    // the right, so a wide expanded family doesn't overlap the next one.
    // Manually-placed families are never moved by this pass.
    //
    // A family's tree never extends left of its own header — every member
    // offset is shifted so the leftmost card sits at x=0 relative to the
    // anchor (see the `anchorX` comment below) — so the tree's right edge
    // is header.x + 70 + layout.width, and its left edge is header.x + 70,
    // not header.x ± width/2. Treating it as centered (width/2 on each
    // side) under-counts how far an expanded family actually reaches and
    // lets the next family's header — and everything hanging off it —
    // overlap the current family's own cards.
    const byX = [...perFamily].sort((a, b) => a.headerPos.x - b.headerPos.x)
    for (let i = 1; i < byX.length; i++) {
      const prev = byX[i - 1]
      const cur = byX[i]
      if (cur.hasManualHeader) continue
      const prevRight = prev.headerPos.x + 70 + prev.layout.width
      const curLeft = cur.headerPos.x + 70
      const overlap = prevRight + FAMILY_GAP - curLeft
      if (overlap > 0) cur.headerPos = { ...cur.headerPos, x: cur.headerPos.x + overlap }
    }

    const nodes = []
    const edges = []
    const familyIdByNpc = {}

    perFamily.forEach(({ fam, collapsed, members, layout, treeLayout, headerPos }) => {
      const famNodeId = `fam-node-${fam.id}`
      const genOverrides = fam.genOverrides || {}

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

      // Everything in this family is positioned as an OFFSET from its own
      // header ("anchor"), not as an absolute canvas coordinate. That's
      // what makes a DM's manual arrangement survive other families
      // collapsing/expanding — when the header gets nudged sideways, every
      // member attached to it moves the same amount, since their stored
      // position is relative to it, not to the canvas.
      const anchorX = headerPos.x + 70
      const anchorY = headerPos.y

      if (!collapsed) {
        const override = treeLayout
        members.forEach((npc) => {
          const autoOffset = {
            x: layout.positions[npc.id] - layout.minX,
            y: 90 + layout.gen[npc.id] * GEN_ROW_HEIGHT,
          }
          const offset =
            genOverrides[npc.id] != null
              ? autoOffset
              : sanitizeOffset(override[npc.id], autoOffset) || autoOffset
          const pos = { x: anchorX + offset.x, y: anchorY + offset.y }
          familyIdByNpc[npc.id] = fam.id
          const fullyVisible = isNpcFullyVisible(npc, isDm)
          nodes.push({
            id: npc.id,
            type: 'npc',
            position: pos,
            data: {
              label: npc.name,
              job: fullyVisible ? npc.job : '',
              age: fullyVisible ? npc.age : '',
              familyId: fam.id,
              fullyVisible,
              onClick: fullyVisible ? () => setSelectedNpcId(npc.id) : undefined,
            },
          })
        })

        members
          .filter((m) => {
            if (layout.gen[m.id] !== 0) return false
            const auto = { x: layout.positions[m.id] - layout.minX, y: 90 }
            return !sanitizeOffset(override[m.id], auto)
          })
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

        function memberPos(id) {
          const auto = {
            x: layout.positions[id] - layout.minX,
            y: 90 + layout.gen[id] * GEN_ROW_HEIGHT,
          }
          const offset = genOverrides[id] != null ? auto : sanitizeOffset(override[id], auto) || auto
          return { x: anchorX + offset.x, y: anchorY + offset.y }
        }

        const childrenByParentPair = new Map()
        const singleParentChildren = new Map()
        members.forEach((npc) => {
          ;(npc.relationships || []).forEach((r) => {
            if (!layout.memberIds.has(r.targetId)) return
            if (r.type !== 'child') return
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
          const posA = memberPos(parentAId)
          const posB = memberPos(parentBId)
          const jx = (posA.x + posB.x) / 2
          const jy = posA.y + GEN_ROW_HEIGHT * 0.55
          const jAuto = { x: jx - anchorX, y: jy - anchorY }
          const jOffset = sanitizeOffset(override[junctionId], jAuto)
          const jPos = jOffset ? { x: anchorX + jOffset.x, y: anchorY + jOffset.y } : { x: jx, y: jy }

          familyIdByNpc[junctionId] = fam.id
          nodes.push({
            id: junctionId,
            type: 'junction',
            position: jPos,
            data: { familyId: fam.id },
            draggable: true,
          })
          edges.push({
            id: `e-junc-a-${junctionId}`,
            source: parentAId,
            sourceHandle: 'bottom',
            target: junctionId,
            targetHandle: 'top',
            type: 'smoothstep',
            style: EDGE_STYLE.lineage,
          })
          edges.push({
            id: `e-junc-b-${junctionId}`,
            source: parentBId,
            sourceHandle: 'bottom',
            target: junctionId,
            targetHandle: 'top',
            type: 'smoothstep',
            style: EDGE_STYLE.lineage,
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

        const renderedParentOf = new Map()
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
              conditionalFor: [npc.id, r.targetId],
            })
          })
        })

        const seenPairs = new Set()
        members.forEach((npc) => {
          ;(npc.relationships || []).forEach((r) => {
            if (!layout.memberIds.has(r.targetId)) return
            if (!PAIR_TYPES.has(r.type)) return
            const key = [npc.id, r.targetId].sort().join('|')
            if (seenPairs.has(key)) return
            seenPairs.add(key)
            const posA = memberPos(npc.id)
            const posB = memberPos(r.targetId)
            const handles = pickLateralHandles(posA, posB)
            edges.push({
              id: `e-pair-${key}`,
              source: npc.id,
              sourceHandle: handles.sourceHandle,
              target: r.targetId,
              targetHandle: handles.targetHandle,
              type: 'straight',
              style: EDGE_STYLE.spouse,
            })
          })
        })

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

        function chainRelType(idA, idB) {
          const npcA = npcsById[idA]
          const rel = (npcA?.relationships || []).find(
            (r) => r.targetId === idB && CHAIN_TYPES.has(r.type)
          )
          return rel?.type || 'sibling'
        }

        chainGroups.forEach((group) => {
          const sorted = [...group].sort(
            (a, b) => layout.positions[a] - layout.positions[b]
          )
          const need = []
          for (let i = 0; i < sorted.length - 1; i++) {
            if (!sharesRenderedParent(sorted[i], sorted[i + 1])) need.push([sorted[i], sorted[i + 1]])
          }
          if (need.length === 0) return

          if (sorted.length > 2) {
            const groupJunctionId = `junction-chain-${fam.id}-${sorted.join('-')}`
            const positions = sorted.map((id) => memberPos(id))
            const jx = positions.reduce((s, p) => s + p.x, 0) / positions.length
            const jy = positions[0].y
            const jAuto = { x: jx - anchorX, y: jy - anchorY }
            const jOffset = sanitizeOffset(override[groupJunctionId], jAuto)
            const jPos = jOffset
              ? { x: anchorX + jOffset.x, y: anchorY + jOffset.y }
              : { x: jx, y: jy }
            familyIdByNpc[groupJunctionId] = fam.id
            nodes.push({
              id: groupJunctionId,
              type: 'junction',
              position: jPos,
              data: { familyId: fam.id },
              draggable: true,
            })
            sorted.forEach((id, i) => {
              const pos = memberPos(id)
              const handles = pickLateralHandles(jPos, pos)
              const neighborId = sorted[i === 0 ? 1 : i - 1]
              const isCousinOnly = chainRelType(id, neighborId) === 'cousin'
              edges.push({
                id: `e-chainjunc-${groupJunctionId}-${id}`,
                source: groupJunctionId,
                sourceHandle: handles.sourceHandle,
                target: id,
                targetHandle: handles.targetHandle,
                type: 'straight',
                style: EDGE_STYLE.sibling,
                conditionalFor: isCousinOnly ? [id] : undefined,
              })
            })
          } else {
            const [a, b] = need[0]
            const posA = memberPos(a)
            const posB = memberPos(b)
            const handles = pickLateralHandles(posA, posB)
            const isCousinOnly = chainRelType(a, b) === 'cousin'
            edges.push({
              id: `e-chain-${a}-${b}`,
              source: a,
              sourceHandle: handles.sourceHandle,
              target: b,
              targetHandle: handles.targetHandle,
              type: 'straight',
              style: EDGE_STYLE.sibling,
              conditionalFor: isCousinOnly ? [a, b] : undefined,
            })
          }
        })
      }
    })

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
          conditionalFor: [npc.id, rel.targetId],
        })
      })
    })

    const allEdgeOverrides = Object.assign({}, ...families.map((f) => f.edgeOverrides || {}))
    const finalEdges = edges
      .filter((e) => !allEdgeOverrides[e.id]?.hidden)
      .filter((e) => !e.conditionalFor || e.conditionalFor.includes(selectedNpcId))
      .map((e) => (allEdgeOverrides[e.id]?.type ? { ...e, type: allEdgeOverrides[e.id].type } : e))

    return { nodes, edges: finalEdges, familyIdByNpc }
  }, [sortedFamilies, visibleNpcs, npcsById, isDm, onEditFamily, expandedFamilyIds, saveFamily, selectedNpcId, families, sessionOverrides])

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    setNodes(computed.nodes)
    setEdges(computed.edges)
  }, [computed, setNodes, setEdges])

  const handleEdgeClick = useCallback(
    (_event, edge) => {
      if (!isDm) return
      setSelectedEdgeId((prev) => (prev === edge.id ? null : edge.id))
    },
    [isDm]
  )

  function deleteSelectedEdge() {
    if (!selectedEdgeId) return
    const famId = computed.familyIdByNpc[edges.find((e) => e.id === selectedEdgeId)?.source]
    const fam = families.find((f) => f.id === famId)
    if (!fam) return
    const edgeOverrides = { ...(fam.edgeOverrides || {}), [selectedEdgeId]: { hidden: true } }
    saveFamily({ ...fam, edgeOverrides })
    setSelectedEdgeId(null)
  }

  function restyleSelectedEdge(type) {
    if (!selectedEdgeId) return
    const famId = computed.familyIdByNpc[edges.find((e) => e.id === selectedEdgeId)?.source]
    const fam = families.find((f) => f.id === famId)
    if (!fam) return
    const existing = fam.edgeOverrides?.[selectedEdgeId] || {}
    const edgeOverrides = { ...(fam.edgeOverrides || {}), [selectedEdgeId]: { ...existing, type } }
    saveFamily({ ...fam, edgeOverrides })
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

  // Anyone can drag cards around to declutter their own view (visual only,
  // via reactflow's own node state). Only the DM's drags are ever written
  // back to Firestore, so a player rearranging things doesn't overwrite the
  // DM's actual saved layout — it just resets next time the page loads.
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
      dragState.current = null
      const familyId = node.data.familyId
      const fam = families.find((f) => f.id === familyId)
      if (!fam) return

      let update = null
      if (node.type === 'npc' || node.type === 'junction') {
        const headerNode = nodes.find((n) => n.id === `fam-node-${familyId}`)
        const anchorX = (headerNode?.position.x ?? 0) + 70
        const anchorY = headerNode?.position.y ?? 0
        update = { [node.id]: { x: node.position.x - anchorX, y: node.position.y - anchorY } }
      } else if (node.type === 'family') {
        // Members are already stored as offsets relative to the header, so
        // they stay correct automatically when the header itself moves —
        // only the header's own anchor position needs saving here.
        update = { __self__: node.position }
      }
      if (!update) return

      if (isDm) {
        const treeLayout = { ...(fam.treeLayout || {}), ...update }
        saveFamily({ ...fam, treeLayout })
      } else {
        setSessionOverrides((prev) => {
          const next = { ...prev, [familyId]: { ...(prev[familyId] || {}), ...update } }
          try {
            sessionStorage.setItem('jalanthar-tree-session-overrides', JSON.stringify(next))
          } catch {
            // Storage can fail quietly (private browsing, quota) — the drag
            // still looks fine for the rest of this render, it just won't
            // survive a reload in that case.
          }
          return next
        })
      }
    },
    [families, isDm, saveFamily, nodes]
  )

  const selectedNpc =
    selectedNpcId && isNpcFullyVisible(npcsById[selectedNpcId] || {}, isDm)
      ? npcsById[selectedNpcId]
      : null

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
        <p className="absolute top-3 left-3 z-10 text-xs font-mono bg-ink/70 text-parchment px-2 py-1 rounded-sm max-w-xs">
          {isDm
            ? "Drag any card to reposition it — saved automatically. Drag a family's banner to move everyone in it together. Click a line to edit or delete it."
            : "Drag any card to rearrange it for your own screen — that lasts until you reload the page."}
        </p>
        {isDm && selectedEdgeId && (
          <div className="absolute bottom-3 right-3 z-20 bg-parchment paper-texture border-2 border-gold rounded-sm shadow-lg p-3 flex items-center gap-2">
            <span className="text-xs font-display uppercase text-ink-soft">Line style</span>
            <select
              defaultValue=""
              onChange={(e) => e.target.value && restyleSelectedEdge(e.target.value)}
              className="text-xs rounded-sm border border-leather bg-white/60 px-2 py-1"
            >
              <option value="" disabled>
                Change to…
              </option>
              <option value="straight">Straight</option>
              <option value="smoothstep">Right-angle</option>
              <option value="step">Right-angle (sharp)</option>
              <option value="bezier">Curved</option>
            </select>
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
              {isDm
                ? 'No families recorded yet. Use "+ Add Family" above to begin the tree.'
                : 'No families recorded yet.'}
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
            onNodeDragStart={handleNodeDragStart}
            onNodeDrag={handleNodeDrag}
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
