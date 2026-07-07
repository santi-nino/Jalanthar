import { useState } from 'react'

export default function Decoration({ src, alt, className }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null

  return (
    <img
      src={`${import.meta.env.BASE_URL}decorations/${src}`}
      alt={alt}
      onError={() => setFailed(true)}
      draggable={false}
      className={`select-none pointer-events-none opacity-80 mix-blend-multiply ${className || ''}`}
    />
  )
}
