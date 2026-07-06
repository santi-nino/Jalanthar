export const LABEL_WIDTH = 148
export const LABEL_HEIGHT = 46

export default function ScrollLabel({ name, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={style}
      className="scroll-label absolute -translate-x-1/2 -translate-y-full cursor-pointer group"
      title={name}
    >
      <svg
        width={LABEL_WIDTH}
        height={LABEL_HEIGHT}
        viewBox="0 0 148 46"
        aria-hidden="true"
      >
        {/* scroll body */}
        <rect x="10" y="8" width="128" height="30" rx="2" fill="#E8DCB8" stroke="#6B4226" strokeWidth="1.5" />
        {/* left roll */}
        <rect x="2" y="4" width="10" height="38" rx="5" fill="#D8C79E" stroke="#6B4226" strokeWidth="1.5" />
        {/* right roll */}
        <rect x="136" y="4" width="10" height="38" rx="5" fill="#D8C79E" stroke="#6B4226" strokeWidth="1.5" />
        {/* subtle fold shadow */}
        <line x1="10" y1="8" x2="10" y2="38" stroke="#6B4226" strokeOpacity="0.25" />
        <line x1="138" y1="8" x2="138" y2="38" stroke="#6B4226" strokeOpacity="0.25" />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center px-4 font-display text-ink group-hover:text-wax transition-colors"
        style={{ fontSize: '11px', lineHeight: 1.1 }}
      >
        {name}
      </span>
    </button>
  )
}
