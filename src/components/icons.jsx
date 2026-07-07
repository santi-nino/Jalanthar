// Simple single-weight "etched" line icons, sized for the sidebar.
// All use currentColor so they inherit the sidebar's text color states.

export function IconMap({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M9 3L3 5.5v15L9 18l6 2.5 6-2.5v-15L15 5.5 9 3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 3v15" stroke="currentColor" strokeWidth="1.4" />
      <path d="M15 5.5v15" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M11.2 10.5l1.3-1.3 1.3 1.3-1.3 1.3z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconBuildings({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 20V10.5L12 4l8 6.5V20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 20v-6h4v6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7.5 12.5h1.4M15.1 12.5h1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function IconResidents({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="8.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M3.5 19c.4-3 2.4-5 5-5s4.6 2 5 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14.5 14.5c2 .1 3.6 1.7 4 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconKey({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10.3 10.3L19 19M15.5 15.5l2 2M18 13l2 2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconExit({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13 8l4 4-4 4M9 12h8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
