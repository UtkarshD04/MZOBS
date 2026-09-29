import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

// Counts up to `value` the first time it scrolls into view. Only ever used
// with numbers that came from the database. The server/first paint renders
// the final number (so prerendered HTML and no-JS readers see the real
// figure); the count-up then writes straight to the DOM node, not React state.
export default function AnimatedNumber({ value, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView || reduce || !ref.current) return undefined
    const node = ref.current
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = Math.round(v).toLocaleString('en-IN')
      },
    })
    return () => controls.stop()
  }, [inView, reduce, value])

  return (
    <span ref={ref} className={className}>
      {Number(value).toLocaleString('en-IN')}
    </span>
  )
}
