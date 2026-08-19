import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircleQuestion, X } from 'lucide-react'

const LINKS = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'Employee Login', to: '/employees/signin' },
  { label: 'Employer Login', to: '/employers/signin' },
]

export default function FloatingQuickNav() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <motion.div
      ref={ref}
      className="fixed left-5 bottom-6 z-40"
      initial={{ opacity: 0, scale: 0.4, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 1.1 }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="absolute bottom-[calc(100%+10px)] left-0 w-56 bg-white rounded-2xl shadow-[0_0_10px_5px_rgba(221,229,235,0.7)] p-3 origin-bottom-left"
          >
            <ul className="space-y-1">
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-lg text-[12px] font-bold text-[#595959] hover:bg-[#F5F5F5] hover:text-[var(--careers-accent)] hover:translate-x-1 transition-all"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="absolute -bottom-[7px] left-6 w-3.5 h-3.5 bg-white rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[var(--careers-accent)]/50 animate-ping pointer-events-none" />
        )}
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Quick links"
          aria-expanded={open}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
          className="relative w-12 h-12 rounded-full bg-[var(--careers-accent)] text-white shadow-lg flex items-center justify-center hover:bg-[var(--careers-accent-hover)] transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              {open ? <X size={20} /> : <MessageCircleQuestion size={22} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  )
}
