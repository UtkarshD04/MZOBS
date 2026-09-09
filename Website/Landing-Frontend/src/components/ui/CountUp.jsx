import { useEffect, useRef, useState } from 'react'

// Animates from whatever is currently on screen to the new `value` — not
// from 0 every time — so switching a filter (e.g. "All Jobs" → "IT & Tech")
// reads as the count settling to its new total, not resetting and
// recounting. The very first render still counts up from 0, which is the
// nice "arriving" effect for a card scrolling into view.
export default function CountUp({ value, prefix = '', suffix = '', duration = 700, className }) {
  const [display, setDisplay] = useState(0)
  const raf = useRef()
  const fromRef = useRef(0)

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const from = fromRef.current

    if (reduceMotion || from === value) {
      setDisplay(value)
      fromRef.current = value
      return
    }

    const start = performance.now()
    function tick(now) {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (p < 1) {
        raf.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = value
      }
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}
