import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

export default function Ring({ value, size = 64, thick = 7, hero = false, label, valueClassName }) {
  const [pct, setPct] = useState(0)
  const raf = useRef()

  useEffect(() => {
    // Deliberate: reset to 0 then double-rAF to `value` so the ring's CSS
    // transition actually plays on every value change (including from one
    // non-zero value straight to another) instead of jumping instantly —
    // not state that's meant to "derive during render".
    // oxlint-disable-next-line react/set-state-in-effect
    setPct(0)
    raf.current = requestAnimationFrame(() => {
      raf.current = requestAnimationFrame(() => setPct(value))
    })
    return () => cancelAnimationFrame(raf.current)
  }, [value])

  return (
    <div
      className={cn('ring-progress', hero && 'hero')}
      style={{ '--pct': pct, '--size': size + 'px', '--thick': thick + 'px' }}
    >
      <div className={cn('absolute inset-0 flex items-center justify-center font-bold', valueClassName)} style={{ fontSize: Math.max(11, size * 0.22) }}>
        {label !== undefined ? label : `${Math.round(pct)}%`}
      </div>
    </div>
  )
}
