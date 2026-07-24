import { useRef } from 'react'

export default function MiniMapPicker({ coords, onChange }) {
  const imgRef = useRef(null)

  function handleClick(e) {
    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    onChange({
      x: Math.max(0, Math.min(100, Math.round(x * 10) / 10)),
      y: Math.max(0, Math.min(100, Math.round(y * 10) / 10)),
    })
  }

  return (
    <div>
      <p className="text-xs text-ink-soft/70 italic mb-2">
        Click anywhere on the map to plant the banner there.
      </p>
      <div
        ref={imgRef}
        onClick={handleClick}
        className="relative w-full aspect-square rounded-sm border border-leather overflow-hidden cursor-crosshair bg-parchment-dark"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}map/jalanthar-map.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-full pointer-events-none"
          style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
        >
          <svg viewBox="0 0 16 22" className="w-4 h-5" fill="none">
            <path
              d="M8 0C3.6 0 0 3.4 0 7.6 0 13 8 22 8 22s8-9 8-14.4C16 3.4 12.4 0 8 0z"
              fill="#6B1F1A"
              stroke="#14120D"
              strokeWidth="0.5"
            />
            <circle cx="8" cy="7.5" r="2.6" fill="#DCD3B4" />
          </svg>
        </div>
      </div>
      <p className="text-xs font-mono text-ink-soft/70 mt-1">
        x: {coords.x}% · y: {coords.y}%
      </p>
    </div>
  )
}
