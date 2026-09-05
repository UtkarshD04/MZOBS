import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../../lib/content'

// Sitewide header — same on every route, including Home, so it never
// visibly changes when navigating (e.g. clicking "For Employers").
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setHidden(y > 140 && y > lastY.current)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-19 bg-white border-b border-(--jobs-border) transition-transform duration-300 ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 md:px-10 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center shrink-0">
            <img src="/images/logo.png" alt="Mzobs" className="h-11 w-auto object-contain" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[14px] font-semibold text-(--jobs-navy)/75 hover:text-(--jobs-teal-dark) transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              to="/employees/signin"
              className="text-[13.5px] font-semibold text-(--jobs-navy) hover:text-(--jobs-teal-dark) transition-colors px-3 py-2"
            >
              Sign in
            </Link>
          </div>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-(--jobs-border) text-(--jobs-navy)"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 top-19 bg-black/30 z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed top-19 left-0 right-0 bg-white border-b border-(--jobs-border) shadow-lg z-40"
            >
              <div className="p-5 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="py-3 text-[14px] font-semibold text-(--jobs-navy) border-b border-(--jobs-border)"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4">
                  <Link
                    to="/employees/signin"
                    onClick={() => setOpen(false)}
                    className="h-10 flex items-center justify-center rounded-lg border border-(--jobs-border) text-(--jobs-navy) text-[13.5px] font-bold"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
