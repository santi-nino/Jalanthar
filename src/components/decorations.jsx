// Original decorative line-art flourishes, drawn fresh for this project in
// an engraved/vintage-illustration spirit (not derived from any reference
// image) — used to dress up page headers without touching the map.

export function HeaderDivider({ className = '' }) {
  return (
    <svg
      viewBox="0 0 300 24"
      className={`w-full max-w-xs h-5 text-leather ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 12h110" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M300 12H190" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* central rune-like mark */}
      <path
        d="M150 3l8 9-8 9-8-9z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="150" cy="12" r="2" fill="currentColor" />
      <path d="M118 12h20M162 12h20" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

// A small coiled sea-serpent squiggle, original design, for flourish use
// near tavern/menu content.
export function SerpentFlourish({ className = '' }) {
  return (
    <svg viewBox="0 0 48 32" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 26c4 4 10 2 10-3s-6-6-4-11 9-6 11-1-2 8 2 10 9-1 9-6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="33" cy="10" r="1.6" fill="currentColor" />
      <path d="M4 26l-3 2M4 26l1 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
