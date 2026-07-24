import { BuildingMarkerIcon } from './buildingIcons'

// The popover is a fixed 208px wide (w-52) card anchored off a marker whose
// position is a percentage of the map's width/height — a marker near an
// edge would otherwise center (or drop below) the popover straight off the
// visible map. Flipping the anchor direction based on which edge a marker
// is close to is a simple, effective fix without needing to measure the
// map container's actual rendered size (ResizeObservers, refs, etc.) for
// what's a fairly coarse, good-enough-in-practice adjustment.
const EDGE_MARGIN = 20 // percent

function popoverPositionClasses(coords) {
  const nearRight = coords.x > 100 - EDGE_MARGIN
  const nearLeft = coords.x < EDGE_MARGIN
  const nearBottom = coords.y > 100 - EDGE_MARGIN

  const horizontal = nearRight
    ? 'right-0'
    : nearLeft
      ? 'left-0'
      : 'left-1/2 -translate-x-1/2'
  const vertical = nearBottom ? 'bottom-full mb-2' : 'top-full mt-2'

  return `${horizontal} ${vertical}`
}

export default function MapMarker({ building, expanded, onToggle, onSeeMore }) {
  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${expanded ? 'z-20' : 'z-0'}`}
      style={{ left: `${building.coords.x}%`, top: `${building.coords.y}%` }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        title={building.name}
        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-md transition-colors ${
          expanded
            ? 'bg-wax border-wax-dark text-parchment'
            : 'bg-parchment border-leather text-ink hover:border-wax hover:text-wax'
        }`}
      >
        <BuildingMarkerIcon type={building.type} icon={building.icon} className="w-4 h-4" />
      </button>

      {expanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute w-52 bg-parchment paper-texture border-2 border-gold rounded-sm shadow-xl p-3 z-10 ${popoverPositionClasses(building.coords)}`}
        >
          <p className="font-display text-base text-leather-dark leading-tight">{building.name}</p>
          {building.subheader && (
            <p className="text-xs uppercase tracking-wide text-ink-soft/70 font-display mt-0.5">
              {building.subheader}
            </p>
          )}
          <button
            onClick={onSeeMore}
            className="mt-2 w-full text-xs font-display uppercase tracking-wide bg-leather text-parchment rounded-sm px-2 py-1.5 hover:bg-leather-dark"
          >
            See More
          </button>
        </div>
      )}
    </div>
  )
}
