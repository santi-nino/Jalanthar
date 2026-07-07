import { useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import MapMarker from '../MapMarker'
import BuildingDetailPanel from '../BuildingDetailPanel'
import NpcDetailModal from '../NpcDetailModal'

// Author your map image at this resolution (or update these constants to match).
// Building `coords` are stored as {x, y} percentages (0-100) of this frame.
const MAP_WIDTH = 886
const MAP_HEIGHT = 886

// The map is intentionally locked at this zoom level rather than allowing
// pinch/scroll zoom — this is the sweet spot where the art stays crisp
// (not upscaled into blur) while still reading as "zoomed in." Panning
// (click-drag / touch-drag) is still enabled at this fixed scale.
const LOCKED_SCALE = 1.6

export default function MapTab({ onEditBuilding, onEditNpc }) {
  const { buildings } = useData()
  const { isDm } = useAuth()
  const [selectedId, setSelectedId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [selectedNpcId, setSelectedNpcId] = useState(null)
  const [imgError, setImgError] = useState(false)

  const selectedBuilding = buildings.find((b) => b.id === selectedId)

  return (
    <div className="relative h-full w-full flex">
      <div className="relative flex-1 overflow-hidden bg-ink-soft/10">
        <TransformWrapper
          initialScale={LOCKED_SCALE}
          minScale={LOCKED_SCALE}
          maxScale={LOCKED_SCALE}
          centerOnInit={true}
          limitToBounds={true}
          wheel={{ disabled: true }}
          pinch={{ disabled: true }}
          doubleClick={{ disabled: true }}
          panning={{ disabled: false }}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
          >
            {/* Everything below shares one coordinate space (the map image's
                own MAP_WIDTH x MAP_HEIGHT frame) and pans together as a
                single transformed block — no separate position-tracking
                logic needed to keep labels aligned with the map. */}
            <div
              style={{ position: 'relative', width: MAP_WIDTH, height: MAP_HEIGHT }}
              onClick={() => setExpandedId(null)}
            >
              {!imgError ? (
                <img
                  src={`${import.meta.env.BASE_URL}map/jalanthar-map.jpg`}
                  alt="Map of Jalanthar"
                  width={MAP_WIDTH}
                  height={MAP_HEIGHT}
                  onError={() => setImgError(true)}
                  draggable={false}
                  style={{ width: MAP_WIDTH, height: MAP_HEIGHT, userSelect: 'none', display: 'block' }}
                />
              ) : (
                <div
                  style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
                  className="flex items-center justify-center bg-parchment-dark paper-texture"
                >
                  <p className="font-display text-leather text-xl max-w-md text-center px-8">
                    Map image not found. Add your chosen map to
                    <code className="block mt-2 font-mono text-sm">
                      /public/map/jalanthar-map.jpg
                    </code>
                  </p>
                </div>
              )}

              {buildings.map((b) => (
                <MapMarker
                  key={b.id}
                  building={b}
                  expanded={expandedId === b.id}
                  onToggle={() => setExpandedId(expandedId === b.id ? null : b.id)}
                  onSeeMore={() => {
                    setSelectedId(b.id)
                    setExpandedId(null)
                  }}
                />
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>

        {isDm && (
          <>
            <p className="absolute bottom-3 left-3 text-xs font-mono bg-ink/70 text-parchment px-2 py-1 rounded-sm pointer-events-none">
              {buildings.length} building{buildings.length === 1 ? '' : 's'}
            </p>
            {onEditBuilding && (
              <button
                onClick={() => onEditBuilding(null)}
                className="absolute top-3 right-3 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm px-3 py-2 hover:bg-leather-dark shadow"
              >
                + Add Building
              </button>
            )}
          </>
        )}
      </div>

      {selectedBuilding && (
        <aside className="fixed inset-0 z-30 md:static md:z-auto w-full md:w-96 shrink-0 border-l-0 md:border-l-2 border-leather bg-parchment paper-texture overflow-y-auto p-6 relative">
          <button
            onClick={() => setSelectedId(null)}
            aria-label="Close building details"
            className="absolute top-3 right-3 text-leather-dark hover:text-wax text-xl leading-none"
          >
            ×
          </button>
          <BuildingDetailPanel
            building={selectedBuilding}
            onEdit={onEditBuilding ? () => onEditBuilding(selectedBuilding) : undefined}
            onSelectResident={setSelectedNpcId}
          />
        </aside>
      )}

      {selectedNpcId && (
        <NpcDetailModal
          npcId={selectedNpcId}
          onNavigate={setSelectedNpcId}
          onClose={() => setSelectedNpcId(null)}
          onEditNpc={onEditNpc}
        />
      )}
    </div>
  )
}
