// Small, original line-art pictograms for map markers, one per common
// building type, plus a generic fallback for custom DM-entered types.
// Single-weight strokes to match the sidebar icon style.

function IconCivic({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 10L12 4l8 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M5 10v9M9 10v9M15 10v9M19 10v9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 19h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconTavern({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M6 10h9v8a2 2 0 01-2 2H8a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M15 12h2a2 2 0 010 4h-2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7c0-1 .8-1.5 1-2 .2.5 1 1 1 2M12 7c0-1 .8-1.5 1-2 .2.5 1 1 1 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function IconShrine({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v3M12 19v3M22 12h-3M5 12H2M18.4 5.6l-2 2M7.6 16.4l-2 2M18.4 18.4l-2-2M7.6 7.6l-2-2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconGarrison({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M5 21V9h2V7h2v2h2V7h2v2h2V7h2v2h2v12z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 21v-5h6v5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function IconShop({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 9l1-4h14l1 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 9a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 9.5V20h14V9.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function IconResidence({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 11L12 4l8 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 10v10h12V10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function IconRuin({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M5 21V11l2-2 1 2 2-3 1 3 2-2 1 3 2-2 2 2v9z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 21v-4M14 21v-5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

function IconGeneric({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="6" y="6" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9h.01M12 9h.01M15 9h.01M9 12h.01M12 12h.01M15 12h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export const ICON_OPTIONS = [
  { id: 'civic', label: 'Civic', Icon: IconCivic },
  { id: 'tavern', label: 'Tavern', Icon: IconTavern },
  { id: 'shrine', label: 'Shrine', Icon: IconShrine },
  { id: 'garrison', label: 'Garrison', Icon: IconGarrison },
  { id: 'shop', label: 'Shop', Icon: IconShop },
  { id: 'residence', label: 'Residence', Icon: IconResidence },
  { id: 'ruin', label: 'Ruin', Icon: IconRuin },
  { id: 'generic', label: 'Generic', Icon: IconGeneric },
]

const ICON_BY_TYPE = {
  civic: IconCivic,
  tavern: IconTavern,
  shrine: IconShrine,
  garrison: IconGarrison,
  shop: IconShop,
  residence: IconResidence,
  ruin: IconRuin,
}

// A building's `icon` field (chosen explicitly by the DM) always wins over
// guessing from its `type` text, which stays as a sensible fallback for
// buildings nobody's picked an icon for yet.
export function BuildingMarkerIcon({ type, icon, className }) {
  const Icon = ICON_BY_TYPE[(icon || type || '').toLowerCase()] || IconGeneric
  return <Icon className={className} />
}
