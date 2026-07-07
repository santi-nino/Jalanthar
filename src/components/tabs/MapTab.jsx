import { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import ScrollLabel, { LABEL_WIDTH, LABEL_HEIGHT } from '../ScrollLabel'
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

// A label shows whenever it's fully visible within the current viewport.
// It only hides once panning would push it off-screen or clip it at an
// edge — not based on how close it is to the exact center.
const EDGE_MARGIN = 12 // px of breathing room from the container edge

export default function MapTab({ onEditBuilding, onEditNpc }) {
  const { buildings } = useData()
  const { isDm } = useAuth()
  const containerRef = useRef(null)
  const [transform, setTransform] = useState({ scale: 1, positionX: 0, positionY: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [selectedId, setSelectedId] = useState(null)
  const [selectedNpcId, setSelectedNpcId] = useState(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setContainerSize({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleTransformed = useCallback((ref) => {
    setTransform(ref.state)
  }, [])

  const labelPositions = useMemo(() => {
    const { scale, positionX, positionY } = transform
    const { width: cw, height: ch } = containerSize
    if (!cw || !ch) return []

    return buildings.map((b) => {
      const screenX = positionX + (b.coords.x / 100) * MAP_WIDTH * scale
      const screenY = positionY + (b.coords.y / 100) * MAP_HEIGHT * scale

      const wouldClip =
        screenX - LABEL_WIDTH / 2 < EDGE_MARGIN ||
        screenX + LABEL_WIDTH / 2 > cw - EDGE_MARGIN ||
        screenY - LABEL_HEIGHT < EDGE_MARGIN ||
        screenY > ch - EDGE_MARGIN

      return {
        building: b,
        screenX,
        screenY,
        visible: !wouldClip,
      }
    })
  }, [buildings, transform, containerSize])

  const selectedBuilding = buildings.find((b) => b.id === selectedId)

  return (
    <div className="relative h-full w-full flex">
      <div ref={containerRef} className="relative flex-1 overflow-hidden bg-ink-soft/10">
        <TransformWrapper
          initialScale={LOCKED_SCALE}
          minScale={LOCKED_SCALE}
          maxScale={LOCKED_SCALE}
          centerOnInit={true}
          onInit={handleTransformed}
          onPanning={handleTransformed}
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
            {!imgError ? (
              <img
                src={`${import.meta.env.BASE_URL}map/jalanthar-map.jpg`}
                alt="Map of Jalanthar"
                width={MAP_WIDTH}
                height={MAP_HEIGHT}
                onError={() => setImgError(true)}
                draggable={false}
                style={{ width: MAP_WIDTH, height: MAP_HEIGHT, userSelect: 'none' }}
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
          </TransformComponent>
        </TransformWrapper>

        {/* Labels rendered in a separate fixed overlay so they don't get
            transformed/scaled themselves — only repositioned. */}
        <div className="pointer-events-none absolute inset-0">
          {labelPositions.map(({ building, screenX, screenY, visible }) =>
            visible ? (
              <div key={building.id} className="pointer-events-auto">
                <ScrollLabel
                  name={building.name}
                  onClick={() => setSelectedId(building.id)}
                  style={{ left: screenX, top: screenY }}
                />
              </div>
            ) : null
          )}
        </div>

        {isDm && (
          <>
            <p className="absolute bottom-3 left-3 text-xs font-mono bg-ink/70 text-parchment px-2 py-1 rounded-sm">
              {buildings.length} buildings · scale {transform.scale.toFixed(2)}
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
        <aside className="w-96 shrink-0 border-l-2 border-leather bg-parchment paper-texture overflow-y-auto p-6 relative">
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
