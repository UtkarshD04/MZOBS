import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../../lib/content'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setHidden(y > 140 && y > lastY.current)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `relative py-2 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors duration-200 ${
      isActive ? 'text-[var(--careers-accent)] border-[var(--careers-accent)]' : 'text-[#595959] border-transparent hover:text-[var(--careers-accent)] hover:border-[var(--careers-accent)]'
    }`

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[76px] bg-white/75 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_-14px_rgba(17,24,39,0.18)] border-b border-black/5 transition-transform duration-500 ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 md:px-10 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group shrink-0">
            <motion.img
              src="/images/logo.png"
              alt="Mzobs"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) =>
              link.to ? (
                <NavLink key={link.label} to={link.to} end={link.to === '/'} className={linkClass}>
                  {link.label}
                </NavLink>
              ) : (
                <a
                  key={link.label}
                  href={link.href || '#'}
                  className="py-2 text-sm font-bold uppercase tracking-wide text-[#595959] border-b-2 border-transparent hover:text-[var(--careers-accent)] hover:border-[var(--careers-accent)] transition-colors duration-200"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#e0e0e0] shadow-sm text-[#595959]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Scroll progress indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--careers-accent)] origin-left"
          style={{ scaleX: progress }}
        />
      </header>

      {/* Mobile Drawer Backdrop (sibling of header, so it stays viewport-fixed) */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 top-[76px] bg-black/30 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed top-[76px] left-0 bottom-0 w-[300px] max-w-[80vw] bg-white shadow-2xl overflow-y-auto z-40 transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="py-3 text-[13px] font-bold uppercase tracking-wide text-[#595959] border-b border-[#e0e0e0] hover:text-[var(--careers-accent)]"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href || '#'}
                onClick={() => setOpen(false)}
                className="py-3 text-[13px] font-bold uppercase tracking-wide text-[#595959] border-b border-[#e0e0e0] hover:text-[var(--careers-accent)]"
              >
                {link.label}
              </a>
            )
          )}
        </div>
      </div>
    </>
  )
}
