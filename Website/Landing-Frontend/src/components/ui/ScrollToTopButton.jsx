import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

// Shows once the visitor has scrolled roughly a viewport past the top —
// mounted once in App.jsx (like ScrollToTop/CursorDot) so it's available on
// every route, not just the redesigned home page. Sits bottom-right, mirror
// of FloatingQuickNav's bottom-left "?" bubble, so the two never overlap.
const SHOW_AFTER_PX = 480

export default function ScrollToTopButton() {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 20 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="fixed right-5 bottom-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-(--explorer-blue) text-white shadow-[0_1px_2px_rgba(37,99,235,0.16),0_10px_20px_-10px_rgba(37,99,235,0.55)] hover:bg-(--explorer-blue-hover) transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
        >
          <ArrowUp size={20} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
