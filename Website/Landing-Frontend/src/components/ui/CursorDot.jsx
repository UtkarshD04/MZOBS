import { useEffect, useState } from 'react'
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

  // There's no cursor during SSR/prerendering, and framer-motion applies the
  // x/y transform imperatively on the client after mount — rendering this on
  // the server leaves that transform style off the prerendered markup, which
  // React then flags as a hydration mismatch on every page and force-remounts
  // the surrounding tree (resetting any scroll-reveal animation, like
  // CategoryGrid's, that had already fired). Skipping the render until after
  // mount keeps the server and first client paint identical.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function handleMove(e) {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [x, y])

  if (!mounted) return null
  if (HIDDEN_ON_PREFIXES.some((prefix) => location.pathname.startsWith(prefix))) return null

  return (
    <motion.div
      aria-hidden="true"
      className="hidden lg:block fixed top-0 left-0 w-2 h-2 rounded-full bg-[#556B2F] pointer-events-none z-[9999] mix-blend-multiply"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    />
  )
}
