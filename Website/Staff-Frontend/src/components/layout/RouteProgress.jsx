import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function RouteProgress() {
  const location = useLocation()
  const [active, setActive] = useState(false)
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setActive(true)
    const t = setTimeout(() => setActive(false), 260)
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <div className="fixed top-16 left-0 right-0 h-[2.5px] z-[70] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {active && (
          <motion.div
            className="h-full bg-gradient-to-r from-navy via-navy-700 to-gold-dot"
            initial={{ width: '0%', opacity: 1 }}
            animate={{ width: '85%' }}
            exit={{ width: '100%', opacity: 0, transition: { width: { duration: 0.12 }, opacity: { duration: 0.25, delay: 0.05 } } }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
