// An original ribbon-banner marker (not derived from any reference image) —
// a flat ribbon with notched, folded ends, styled to match the site's
// stone/bone/verdigris palette.

export const LABEL_WIDTH = 160
export const LABEL_HEIGHT = 40

export default function ScrollLabel({ name, onClick, style, small }) {
  const w = small ? LABEL_WIDTH * 0.7 : LABEL_WIDTH
  const h = small ? LABEL_HEIGHT * 0.7 : LABEL_HEIGHT

  return (
    <button
      onClick={onClick}
      style={style}
      className="scroll-label absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      title={name}
    >
      <svg width={w} height={h} viewBox="0 0 160 40" aria-hidden="true">
        {/* ribbon tails (folded ends, drawn first so the body overlaps them) */}
        <path d="M0 8 L20 20 L0 32 L10 20 Z" fill="#4A5A34" stroke="#14120D" strokeWidth="1" />
        <path d="M160 8 L140 20 L160 32 L150 20 Z" fill="#4A5A34" stroke="#14120D" strokeWidth="1" />
        {/* ribbon body */}
        <path
          d="M14 6 H146 L154 20 L146 34 H14 L22 20 Z"
          fill="#DCD3B4"
          stroke="#14120D"
          strokeWidth="1.5"
        />
        {/* inner rule lines for a bit of engraved detail */}
        <path
          d="M18 10 H142 L148 20 L142 30 H18 L24 20 Z"
          fill="none"
          stroke="#7C8C4A"
          strokeWidth="0.75"
          opacity="0.6"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center px-5 font-display text-ink group-hover:text-wax transition-colors"
        style={{ fontSize: small ? '9px' : '11px', lineHeight: 1.1 }}
      >
        {name}
      </span>
    </button>
  )
}
