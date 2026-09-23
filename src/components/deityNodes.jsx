import { Handle, Position } from 'reactflow'
import { getPantheonStyle } from '../data/deityRelationshipTypes'

// Same four-way-handle trick relationshipNodes.jsx uses for NPCs -- every
// side needs to work as both a source and target since the same handle
// might start one edge and end another depending on which deity a given
// relationship is drawn from.
function FourWayHandles() {
  const cls = '!opacity-0'
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

// Every card is the same fixed size regardless of a deity's name length or
// how much prose their detail page holds -- only the half-page panel that
// opens on click shows the full picture. Color is the ONLY thing that
// marks which pantheon a card belongs to (see PANTHEON_STYLES) -- there's
// no surrounding box or cluster anymore, so the color has to carry that
// signal entirely on its own, on every single card, all the time. A dead/
// merged deity keeps its pantheon color but renders with a dashed,
// see-through border and faded text instead of a solid one, so the tree
// reads at a glance which gods are still active without opening every card.
export function DeityNode({ data }) {
  const isDead = data.status === 'dead' || data.status === 'merged'
  const style = getPantheonStyle(data.pantheon)
  return (
    <button
      onClick={data.onClick}
      className="relative px-3 py-2 rounded-sm shadow-sm font-body text-sm w-[160px] h-[64px] text-center cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-transform hover:scale-[1.03]"
      style={{
        background: style.bg,
        borderWidth: 2,
        borderStyle: isDead ? 'dashed' : 'solid',
        borderColor: style.border,
        color: style.text,
        opacity: isDead ? 0.6 : 1,
      }}
      title={isDead ? `${data.label} — ${data.status}` : data.label}
    >
      <FourWayHandles />
      {data.creatorPatron && (
        <span className="absolute top-1 left-1 text-[10px] leading-none" title="Creator/Patron of a people" aria-hidden="true">
          ♛
        </span>
      )}
      <span className="block font-display truncate w-full">{data.label}</span>
      {data.title && (
        <span className="block text-[10px] italic leading-tight mt-0.5 truncate w-full opacity-80">
          {data.title}
        </span>
      )}
    </button>
  )
}

// A tiny, muted marker used only on pantheons with more than one
// generation, so a lineage that had to wrap into several sub-rows (a wide
// generation 0 with 20+ unrelated gods, say) still reads unambiguously as
// ONE generation, distinct from the actual next generation below it --
// the row spacing alone (tight within a generation, loose between them)
// carries most of that signal, this is just the explicit backup.
export function GenerationLabel({ data }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-wide text-ink-soft/50 pointer-events-none select-none whitespace-nowrap">
      {data.label}
    </div>
  )
}

// A plain section label, NOT a draggable/collapsible cluster header the
// way FamilyNode is on the NPC tree -- the Pantheon tab intentionally
// doesn't work that way anymore (see the design note at the top of
// PantheonTab.jsx). This is inert: no handles, no click target, no drag.
// It exists only so the label pans and zooms together with its band of
// cards instead of being a fixed HTML overlay that would drift out of
// alignment the moment the DM pans the canvas.
export function PantheonLabel({ data }) {
  const style = getPantheonStyle(data.label)
  return (
    <div
      className="font-display uppercase tracking-wide text-base whitespace-nowrap pointer-events-none select-none"
      style={{ color: style.dark ? style.bg : style.border }}
    >
      {data.label}
    </div>
  )
}
