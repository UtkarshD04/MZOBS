import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

// A floating glass panel rather than a centered rectangle: an asymmetric
// corner radius, a thin illuminated top edge, and a layered glow so it
// reads as a physical surface hovering inside the Trust Constellation
// rather than a flat card dropped on a gradient.
export default function AuthCard({ children, className, successOverlay }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 26, scale: reduceMotion ? 1 : 0.96, rotate: reduceMotion ? 0 : -0.6 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* ambient glow cast behind the panel */}
      <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-[var(--auth-mist)] blur-2xl" />

      <div
        className={cn(
          'relative overflow-hidden rounded-[28px] rounded-tr-[56px]',
          'border border-white/80',
          'bg-white/78 backdrop-blur-2xl',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_0_0_0_1px_rgba(255,255,255,0.4),0_30px_70px_-24px_rgba(6,10,8,0.55),0_10px_28px_-10px_rgba(6,10,8,0.35)]',
          'p-7 sm:p-9',
          className
        )}
      >
        {/* top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />
        {/* corner glow tying back to the constellation's accent */}
        <div className="pointer-events-none absolute -top-16 -right-10 w-48 h-48 rounded-full bg-[var(--auth-accent-glow)]/18 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 w-44 h-44 rounded-full bg-[var(--careers-cyan-soft)]/25 blur-3xl" />

        <div className="relative">{children}</div>

        <AnimatePresence>
          {successOverlay && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white/92 backdrop-blur-sm text-center px-8"
            >
              {successOverlay}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
