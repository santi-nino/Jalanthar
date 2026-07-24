const POSITIONS = {
  'top-right': 'top-0 right-0',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-left': 'top-0 left-0',
}

export default function PageFlourish({ src, position = 'top-right', size = 180, opacity = 0.16 }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none select-none absolute ${POSITIONS[position]} hidden md:block`}
      style={{ width: size, opacity, filter: 'sepia(0.4) contrast(0.9)' }}
    />
  )
}
