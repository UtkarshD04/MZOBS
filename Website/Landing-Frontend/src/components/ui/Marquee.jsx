import { motion, useReducedMotion } from 'framer-motion'

// Infinite horizontal scroller — renders the item list twice back-to-back
// and animates the whole track left by exactly one copy's width (-50%), so
// the loop point is invisible.
export default function Marquee({ items, duration = 22, className = '', itemClassName = '' }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <motion.div
        className="flex w-max items-center"
        animate={shouldReduceMotion ? {} : { x: ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className={`shrink-0 whitespace-nowrap ${itemClassName}`}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
