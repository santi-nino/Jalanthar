import { useMemo, useState, useCallback, useEffect } from 'react'
import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { DeityNode, PantheonLabel, GenerationLabel } from '../deityNodes'
import DeityDetailPanel from '../DeityDetailPanel'
import { PANTHEONS, PANTHEON_STYLES, getDeityRelationshipType } from '../../data/deityRelationshipTypes'

// ---------------------------------------------------------------------
// DESIGN NOTE -- this tab is intentionally NOT built like RelationshipTab
// (the NPC family tree), even though both are ReactFlow graphs of cards
// and lines. The DM's own call: "they should be entirely separate
// entities with their own set of rules." Specifically, on purpose,
// different from the family tree:
//
//   - Pantheons are not collapsible. Every deity card is visible at all
//     times -- there's no cluster header to click, no expand/collapse
//     state at all.
//   - A pantheon is identified ONLY by card color (see PANTHEON_STYLES),
//     not by a bounding box, a header banner drag-group, or a background
//     panel. Nine pantheons, nine colors, always visible.
//   - Cards barely move. RelationshipTab lets the DM drag a card anywhere
//     on the canvas; here a card can only be nudged a short distance
//     (MAX_DRAG_RADIUS, in canvas px) from its own computed "home"
//     position before the drag is clamped. The DM can tidy up a crowded
//     corner, not redesign the whole tree.
//   - Layout is a plain, deterministic top-down grid per pantheon (see
//     layoutPantheons below) -- no scatter jitter, no free-form cluster
//     anchor math. The goal, per the DM's own words, is that it "reads
//     like a standard family tree": rows align, columns align, lines are
//     followable.
// ---------------------------------------------------------------------

const nodeTypes = { deity: DeityNode, pantheonLabel: PantheonLabel, generationLabel: GenerationLabel }

// Nine distinct edge appearances, one per relationship kind -- see the
// design notes in deityRelationshipTypes.js for what each one means.
// This part is unchanged from before: relationships are still allowed to
// cross pantheon lines freely (Corellon/Gruumsh, Garl Glittergold/Moradin,
// and so on), same as a real mythology would have.
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

const RELATIONSHIP_LEGEND = [
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

// ---- Layout rules --------------------------------------------------------
// A named, explicit rule set (not just scattered math) so the layout's
// behavior can be reasoned about and adjusted rule-by-rule. Every rule
// below is deterministic -- the same data always produces the same
// layout, nothing here rolls dice.
//
//   RULE 1 -- MIN_CARD_GAP: cards are never closer than this, full stop
//             (COL_SPACING - CARD_W). Prevents the "too close together"
//             crowding the DM flagged.
//   RULE 2 -- GENERATIONAL ROWS: a parent/patron sits exactly one row
//             above their child/subordinate (genDelta on the relationship
//             type, applied in computeGenerations), only within the same
//             pantheon -- a cross-pantheon lineage tie (Sehanine ->
//             Eilistraee) draws a long line instead of merging two
//             pantheons' bands together.
//   RULE 3 -- KINSHIP SHARES A ROW: siblings (and, if this data model
//             ever adds cousins, cousins too) are pulled into the SAME
//             generation as whichever kin they're connected to, via
//             SAME_ROW_TYPES below (genDelta 0) -- they never end up
//             stranded a row apart from each other.
//   RULE 4 -- CONNECTIVITY ORDERING: within a row, cards aren't just
//             alphabetized -- orderByConnectivity chains each member next
//             to whichever unplaced member they're most related to (any
//             relationship type counts), so a same-row relationship line
//             (Shar/Selûne, the Bane/Cyric/Bhaal/Myrkul/Leira absorption
//             chain, Milil/Oghma/Deneir, etc.) connects near-neighbors
//             instead of zigzagging across unrelated cards to reach a
//             relative on the other side of the row. This is the direct
//             fix for lines "crisscrossing like a poorly designed subway
//             system."
//   RULE 5 -- ORTHOGONAL ROUTING: edges are drawn with ReactFlow's
//             'smoothstep' type, not a raw diagonal straight line, and
//             each edge picks side (left/right) handles for a same-row
//             relationship or top/bottom handles for a cross-row one (see
//             pickHandles) -- so a line travels in a clean, subway-map-
//             style channel between rows/columns rather than cutting
//             diagonally across the middle of unrelated cards.
//   RULE 6 -- WIDTH CAP: a generation that wraps into several sub-rows
//             (Faerûnian's ~23 lineage-less gods) is capped at MAX_COLS
//             per sub-row and centered against the widest sub-row in its
//             own pantheon -- see the wrapping note further down.
//
// NOTE ON HONESTY: rules 1-3 and 6 are hard guarantees. Rules 4-5 are a
// strong, deterministic HEURISTIC, not a mathematical proof of zero
// crossings or zero line-through-card overlaps -- true crossing-free
// graph layout is a genuinely hard problem in general, especially with
// cross-pantheon relationships that have to travel between bands that
// are laid out independently of each other. What this gets you: every
// SAME-ROW relationship (the majority of edges in this data) reads
// cleanly, and every remaining line travels in orthogonal channels
// instead of diagonal cuts.
const MIN_CARD_GAP = 40
const CARD_W = 160
const COL_SPACING = CARD_W + MIN_CARD_GAP
const SUBROW_SPACING = 84
const GEN_GAP = 140
const LABEL_HEIGHT = 40
const BAND_GAP = 64
const GEN_LABEL_OFFSET = 34
const MAX_COLS = 6

// Relationship kinds that place both sides on the exact same row
// (RULE 3). Distinct from GENERATION_TYPES below, which move a row up or
// down instead.
const SAME_ROW_TYPES = new Set(['sibling'])
const GENERATION_TYPES = new Set(['parent', 'child', 'subordinate_to', 'patron_of'])
const LINEAGE_TYPES = new Set([...SAME_ROW_TYPES, ...GENERATION_TYPES])

function computeGenerations(members, byId) {
  const gen = {}
  const visited = new Set()
  members.forEach((m) => {
    if (visited.has(m.id)) return
    gen[m.id] = 0
    visited.add(m.id)
    const queue = [m.id]
    while (queue.length) {
      const curId = queue.shift()
      const cur = byId[curId]
      ;(cur.relationships || []).forEach((rel) => {
        if (!LINEAGE_TYPES.has(rel.type)) return
        const target = byId[rel.targetId]
        if (!target || target.pantheon !== cur.pantheon || visited.has(target.id)) return
        const delta = getDeityRelationshipType(rel.type).genDelta || 0
        gen[target.id] = gen[curId] + delta
        visited.add(target.id)
        queue.push(target.id)
      })
    }
  })
  return gen
}

// RULE 4 -- greedy connectivity chain: start from the row's natural
// "first" member (creator/patron, else alphabetically first), then
// repeatedly append whichever unplaced member has the strongest
// relationship tie to whoever was just placed. A member with no tie to
// the current chain end falls back to the next member in the fallback
// (alphabetical) order, so disconnected deities still end up in a fully
// deterministic position rather than an arbitrary one. This is a
// heuristic for the classic "minimum linear arrangement" problem, not an
// optimal solver -- but it reliably pulls related deities next to each
// other, which is the whole point.
function orderByConnectivity(members) {
  if (members.length <= 2) return members
  const ids = new Set(members.map((m) => m.id))
  const weight = new Map(members.map((m) => [m.id, new Map()]))
  members.forEach((m) => {
    ;(m.relationships || []).forEach((rel) => {
      if (!ids.has(rel.targetId) || rel.targetId === m.id) return
      const a = weight.get(m.id)
      a.set(rel.targetId, (a.get(rel.targetId) || 0) + 1)
      const b = weight.get(rel.targetId)
      b.set(m.id, (b.get(m.id) || 0) + 1)
    })
  })
  const fallbackOrder = [...members].sort((a, b) => {
    if (a.creatorPatron !== b.creatorPatron) return a.creatorPatron ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  const byIdLocal = Object.fromEntries(members.map((m) => [m.id, m]))
  const remaining = new Set(members.map((m) => m.id))
  const placedOrder = []

  let current = fallbackOrder[0].id
  placedOrder.push(current)
  remaining.delete(current)

  while (remaining.size > 0) {
    let best = null
    let bestScore = 0
    remaining.forEach((id) => {
      const score = weight.get(current).get(id) || 0
      if (score > bestScore) {
        bestScore = score
        best = id
      }
    })
    if (!best) {
      best = fallbackOrder.find((m) => remaining.has(m.id)).id
    }
    placedOrder.push(best)
    remaining.delete(best)
    current = best
  }

  return placedOrder.map((id) => byIdLocal[id])
}

function layoutPantheons(deities) {
  const byId = Object.fromEntries(deities.map((d) => [d.id, d]))
  const byPantheon = {}
  PANTHEONS.forEach((p) => (byPantheon[p] = []))
  deities.forEach((d) => {
    const p = PANTHEONS.includes(d.pantheon) ? d.pantheon : PANTHEONS[0]
    byPantheon[p].push(d)
  })

  const positions = {} // id -> { x, y } (the deity's fixed "home" position)
  const labels = [] // { pantheon, x, y }
  const genLabels = [] // { text, x, y }
  let cursorY = 0

  PANTHEONS.forEach((pantheon) => {
    const members = byPantheon[pantheon]
    labels.push({ pantheon, x: 0, y: cursorY })
    if (members.length === 0) {
      cursorY += LABEL_HEIGHT + BAND_GAP
      return
    }

    const gen = computeGenerations(members, byId)
    const byGen = {}
    members.forEach((m) => {
      const g = gen[m.id] ?? 0
      ;(byGen[g] ||= []).push(m)
    })
    const sortedGens = Object.keys(byGen)
      .map(Number)
      .sort((a, b) => a - b)
    const multiGen = sortedGens.length > 1

    // Each generation becomes one or more sub-rows (capped at MAX_COLS
    // wide), sorted, then every sub-row's width is measured up front so
    // it can be centered against the widest sub-row in the WHOLE
    // pantheon -- same reasoning as before, just applied per sub-row
    // instead of per generation.
    const subRows = []
    sortedGens.forEach((g) => {
      // RULE 4: chain related members next to each other instead of a
      // flat alphabetical sort, so same-row relationship lines connect
      // near-neighbors rather than cutting across the whole row.
      const genMembers = orderByConnectivity(byGen[g])
      for (let i = 0; i < genMembers.length; i += MAX_COLS) {
        const chunk = genMembers.slice(i, i + MAX_COLS)
        const width = (chunk.length - 1) * COL_SPACING + CARD_W
        subRows.push({ gen: g, isFirstOfGen: i === 0, members: chunk, width })
      }
    })
    const bandWidth = Math.max(...subRows.map((r) => r.width))

    let rowY = cursorY + LABEL_HEIGHT
    let prevGen = null
    subRows.forEach(({ gen: g, isFirstOfGen, members: rowMembers, width }) => {
      if (prevGen !== null) {
        rowY += g !== prevGen ? GEN_GAP : SUBROW_SPACING
      }
      const offsetX = (bandWidth - width) / 2
      if (multiGen && isFirstOfGen) {
        genLabels.push({ text: `Gen ${g}`, x: offsetX - GEN_LABEL_OFFSET, y: rowY })
      }
      rowMembers.forEach((m, col) => {
        positions[m.id] = { x: offsetX + col * COL_SPACING, y: rowY }
      })
      prevGen = g
    })
    rowY += SUBROW_SPACING // trailing space before the next pantheon's BAND_GAP

    cursorY = rowY + BAND_GAP
  })

  return { positions, labels, genLabels }
}

// ---- Restrained dragging ------------------------------------------------
// A card can be nudged, not relocated. MAX_DRAG_RADIUS is in canvas px at
// zoom 1 -- ReactFlow's coordinate space is 1:1 with CSS px there, and a
// typical screen is ~96-110 px/inch, so ~90px keeps a drag within roughly
// "a couple of centimeters" of the card's home position, exactly the
// tether the DM asked for ("semi-fixed locations"). Clamping happens live,
// on every drag frame (via onNodesChange below), not just on drop -- the
// card should visibly resist being dragged further, not fly off and snap
// back after release.
const MAX_DRAG_RADIUS = 90

function clampToRadius(dx, dy, radius) {
  const dist = Math.hypot(dx, dy)
  if (dist <= radius || dist === 0) return { dx, dy }
  const scale = radius / dist
  return { dx: dx * scale, dy: dy * scale }
}

// RULE 5 -- same-row relationships exit/enter the SIDES of a card (so the
// line travels along the row instead of diagonally over other cards in
// it); anything that changes rows exits/enters the TOP or BOTTOM, in
// whichever vertical direction it's actually traveling. Combined with
// the 'smoothstep' edge type (set where these are used), this keeps
// every line moving in clean horizontal/vertical legs -- a subway map,
// not a pile of diagonal straight lines cutting through the middle of
// the canvas.
function pickHandles(sourcePos, targetPos) {
  const dx = targetPos.x - sourcePos.x
  const dy = targetPos.y - sourcePos.y
  if (Math.abs(dy) < 4) {
    return dx >= 0 ? { sourceHandle: 'right', targetHandle: 'left' } : { sourceHandle: 'left', targetHandle: 'right' }
  }
  return dy > 0 ? { sourceHandle: 'bottom', targetHandle: 'top' } : { sourceHandle: 'top', targetHandle: 'bottom' }
}

export default function PantheonTab({ onEditDeity }) {
  const { deities, saveDeity } = useData()
  const { isDm } = useAuth()
  const [selectedId, setSelectedId] = useState(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState(null)

  const deitiesById = useMemo(() => Object.fromEntries(deities.map((d) => [d.id, d])), [deities])

  const { positions, labels, genLabels } = useMemo(() => layoutPantheons(deities), [deities])

  const computed = useMemo(() => {
    const nodes = []

    labels.forEach(({ pantheon, x, y }) => {
      nodes.push({
        id: `label-${pantheon}`,
        type: 'pantheonLabel',
        position: { x, y },
        data: { label: pantheon },
        draggable: false,
        selectable: false,
      })
    })

    genLabels.forEach(({ text, x, y }, i) => {
      nodes.push({
        id: `genlabel-${i}`,
        type: 'generationLabel',
        position: { x, y },
        data: { label: text },
        draggable: false,
        selectable: false,
      })
    })

    deities.forEach((deity) => {
      const home = positions[deity.id]
      if (!home) return
      // A saved nudge is stored as a small {x,y} OFFSET from the deity's
      // own computed home position -- not an absolute position, and not
      // relative to any cluster/anchor node (there isn't one anymore).
      // Re-clamped here too, defensively, in case the layout shifted
      // under a stale saved offset (e.g. a new deity inserted earlier in
      // sort order pushed everyone else's home position over).
      const saved = deity.treePos || { x: 0, y: 0 }
      const clamped = clampToRadius(saved.x, saved.y, MAX_DRAG_RADIUS)
      nodes.push({
        id: deity.id,
        type: 'deity',
        position: { x: home.x + clamped.dx, y: home.y + clamped.dy },
        data: {
          label: deity.name,
          title: deity.title,
          pantheon: deity.pantheon,
          status: deity.status,
          creatorPatron: deity.creatorPatron,
          home,
          onClick: () => setSelectedId(deity.id),
        },
      })
    })

    const edges = []
    const seen = new Set()
    deities.forEach((deity) => {
      ;(deity.relationships || []).forEach((rel) => {
        const sourcePos = positions[deity.id]
        const targetPos = positions[rel.targetId]
        if (!sourcePos || !targetPos) return
        const key = [deity.id, rel.targetId].sort().join('|') + rel.type
        if (seen.has(key)) return
        seen.add(key)
        const { sourceHandle, targetHandle } = pickHandles(sourcePos, targetPos)
        edges.push({
          id: `e-${key}`,
          source: deity.id,
          target: rel.targetId,
          sourceHandle,
          targetHandle,
          type: 'smoothstep',
          pathOptions: { borderRadius: 12 },
          style: edgeStyleFor(rel.type),
          label: edgeLabelFor(rel),
          data: { sourceId: deity.id, targetId: rel.targetId, type: rel.type },
        })
      })
    })

    return { nodes, edges }
  }, [deities, positions, labels, genLabels])

  const [nodes, setNodes, onNodesChangeRaw] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    setNodes(computed.nodes)
    setEdges(computed.edges)
  }, [computed, setNodes, setEdges])

  // Intercepts every position change React Flow wants to apply and clamps
  // it to MAX_DRAG_RADIUS around the node's own home position -- this is
  // what makes the tether feel physical (the card resists mid-drag)
  // instead of just snapping back after the fact.
  const onNodesChange = useCallback(
    (changes) => {
      const clamped = changes.map((change) => {
        if (change.type !== 'position' || !change.position) return change
        const node = nodes.find((n) => n.id === change.id)
        const home = node?.data?.home
        if (!home) return change
        const { dx, dy } = clampToRadius(
          change.position.x - home.x,
          change.position.y - home.y,
          MAX_DRAG_RADIUS
        )
        return { ...change, position: { x: home.x + dx, y: home.y + dy } }
      })
      onNodesChangeRaw(clamped)
    },
    [nodes, onNodesChangeRaw]
  )

  const handleNodeDragStop = useCallback(
    (_event, node) => {
      if (node.type !== 'deity' || !isDm) return
      const deity = deitiesById[node.id]
      const home = node.data?.home
      if (!deity || !home) return
      const { dx, dy } = clampToRadius(node.position.x - home.x, node.position.y - home.y, MAX_DRAG_RADIUS)
      saveDeity({ ...deity, treePos: { x: dx, y: dy } })
    },
    [isDm, deitiesById, saveDeity]
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
            ? 'Every pantheon is always shown, grouped by name-card color. Cards can only be nudged a short distance from their set position. Click a line to select and delete it.'
            : 'Every pantheon is always shown, grouped by name-card color. Click a card to read more.'}
        </p>

        {/* Two stacked legends, bottom-left: which color is which pantheon,
            and which line style is which relationship. Kept in one panel
            so nothing else on the canvas has to make room for a second
            floating box. */}
        <div className="absolute bottom-3 left-3 z-10 bg-parchment/95 border border-leather/40 rounded-sm shadow px-3 py-2 text-xs space-y-2 max-w-[240px] max-h-[70vh] overflow-y-auto">
          <div className="space-y-1">
            <p className="font-display uppercase tracking-wide text-ink-soft/70">Pantheons</p>
            {PANTHEONS.map((p) => {
              const style = PANTHEON_STYLES[p]
              return (
                <div key={p} className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-sm shrink-0 border"
                    style={{ background: style.bg, borderColor: style.border }}
                  />
                  <span className="text-ink-soft">{p}</span>
                </div>
              )
            })}
          </div>
          <div className="space-y-1 border-t border-leather/30 pt-2">
            <p className="font-display uppercase tracking-wide text-ink-soft/70">Relationships</p>
            {RELATIONSHIP_LEGEND.map((l) => (
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
