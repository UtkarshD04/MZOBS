import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Auth pages (signup/signin/etc.) use a focused white/blue/navy job-portal
// look — this olive custom-cursor dot is a sitewide decorative touch for
// the marketing pages and clashes with that palette, so it's hidden there
// rather than changed globally.
const HIDDEN_ON_PREFIXES = ['/employees/signup', '/employees/signin', '/employees/forgot-password', '/employees/reset-password']

export default function CursorDot() {
  const location = useLocation()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })

  useEffect(() => {
    function handleMove(e) {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [x, y])

  if (HIDDEN_ON_PREFIXES.some((prefix) => location.pathname.startsWith(prefix))) return null

  return (
    <motion.div
      aria-hidden="true"
      className="hidden lg:block fixed top-0 left-0 w-2 h-2 rounded-full bg-[#556B2F] pointer-events-none z-[9999] mix-blend-multiply"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    />
  )
}
