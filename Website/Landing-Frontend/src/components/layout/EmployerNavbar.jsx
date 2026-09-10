import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Crown, Menu, X } from 'lucide-react'

const EMPLOYER_NAV_LINKS = [
  { label: 'How it works', to: '/employers#how-it-works' },
  { label: 'Solutions', to: '/employers#solutions' },
]

// Employer-section header — mounted on /employers and its sign-in/signup/
// password pages instead of the main site Navbar, so employers get a
// distinct, employer-branded header while browsing that section.
export default function EmployerNavbar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setHidden(y > 140 && y > lastY.current)
      setScrolled(y > 8)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-19 bg-[#F1EDE5]/95 backdrop-blur-md border-b border-[#20251F]/10 transition-[transform,box-shadow] duration-300 ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled ? 'shadow-[0_1px_2px_rgba(16,42,67,0.04),0_8px_24px_-16px_rgba(16,42,67,0.4)]' : 'shadow-none'}`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 md:px-10 flex items-center justify-between gap-6">
          <Link to="/employers" className="flex items-center gap-2 shrink-0">
            <img src="/images/logo.png" alt="Mzobs" className="h-14 w-auto object-contain" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#20251F]/65 border-l border-[#20251F]/20 pl-2">
              For Employers
            </span>
          </Link>

          <nav aria-label="Employer" className="hidden lg:flex items-center gap-7">
            {EMPLOYER_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[13px] font-bold text-[#20251F]/65 hover:text-[#246B5A] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              to="/employers/pricing"
              className="flex items-center gap-1.5 text-[13px] font-bold text-[#20251F] border border-[#F6C16E] bg-gradient-to-b from-[#FBE3AE] to-[#F6C16E] shadow-[0_2px_10px_-2px_rgba(246,193,110,0.65)] hover:shadow-[0_4px_16px_-2px_rgba(246,193,110,0.85)] hover:-translate-y-px transition-all duration-200 px-4 py-2 rounded-full"
            >
              <Crown size={14} className="fill-[#20251F]/15" />
              Subscription
            </Link>
            <Link
              to="/employers/signin"
              className="text-[13px] font-bold text-[#20251F]/75 hover:text-[#246B5A] transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              to="/employers/signup"
              className="text-[13px] font-bold text-[#FAF7F1] bg-[#20251F] hover:bg-[#246B5A] transition-colors px-5 py-2.5 rounded-full"
            >
              Post a Job
            </Link>
          </div>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-[#20251F]/20 text-[#20251F]"
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
              className="lg:hidden fixed top-19 left-0 right-0 bg-[#F1EDE5] border-b border-[#20251F]/10 shadow-lg z-40"
            >
              <div className="p-5 flex flex-col gap-1">
                {EMPLOYER_NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="py-3 text-[14px] font-bold text-[#20251F] border-b border-[#20251F]/10"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4">
                  <Link
                    to="/employers/pricing"
                    onClick={() => setOpen(false)}
                    className="h-10 flex items-center justify-center gap-1.5 rounded-full border border-[#F6C16E] bg-gradient-to-b from-[#FBE3AE] to-[#F6C16E] text-[#20251F] text-[13.5px] font-bold shadow-[0_2px_10px_-2px_rgba(246,193,110,0.65)]"
                  >
                    <Crown size={14} className="fill-[#20251F]/15" /> Subscription
                  </Link>
                  <Link
                    to="/employers/signin"
                    onClick={() => setOpen(false)}
                    className="h-10 flex items-center justify-center rounded-full border border-[#20251F]/20 text-[#20251F] text-[13.5px] font-bold"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/employers/signup"
                    onClick={() => setOpen(false)}
                    className="h-10 flex items-center justify-center rounded-full bg-[#20251F] text-[#FAF7F1] text-[13.5px] font-bold"
                  >
                    Post a Job
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
