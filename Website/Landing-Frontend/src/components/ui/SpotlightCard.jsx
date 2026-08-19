import { useRef } from 'react'

export default function SpotlightCard({ as: Tag = 'div', children, className = '', glow = 'rgba(255,255,255,0.4)', size = 220, ...props }) {
  const ref = useRef(null)

  function handleMouseMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <Tag ref={ref} onMouseMove={handleMouseMove} className={`relative overflow-hidden group/spotlight ${className}`} {...props}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(${size}px circle at var(--x, 50%) var(--y, 50%), ${glow}, transparent 70%)` }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  )
}
