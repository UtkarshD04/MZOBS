import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
<<<<<<< Updated upstream
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
=======
import { Menu, X } from 'lucide-react'
import ExplorerButton from '../ui/ExplorerButton'

const EMPLOYER_NAV_LINKS = [
  { label: 'How it works', to: '/employers#how-it-works' },
  { label: 'Find candidates', to: '/employers#discover-talent' },
  { label: 'Pricing', to: '/employers/pricing' },
]

// Employer-section header — same floating/frosted mechanics as the site-wide
// Navbar (condenses into a pill on scroll, --hero-cta-gradient progress
// hairline), so the employer side of the product reads as a continuation of
// the candidate site rather than a separate, dark-branded app.
export default function EmployerNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useRef(null)
  const floating = scrolled || open
>>>>>>> Stashed changes

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
<<<<<<< Updated upstream
      setHidden(y > 140 && y > lastY.current)
      setScrolled(y > 8)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
=======
      setScrolled(y > 8)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
>>>>>>> Stashed changes
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
<<<<<<< Updated upstream
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-19 bg-[#f7f8fc]/95 backdrop-blur-md border-b border-[#111827]/10 transition-[transform,box-shadow] duration-300 ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled ? 'shadow-[0_1px_2px_rgba(16,42,67,0.04),0_8px_24px_-16px_rgba(16,42,67,0.4)]' : 'shadow-none'}`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 md:px-10 flex items-center justify-between gap-6">
          <Link to="/employers" className="flex items-center gap-2 shrink-0">
            <img src="/images/logo.png" alt="Mzobs" className="h-14 w-auto object-contain" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#111827]/65 border-l border-[#111827]/20 pl-2">
=======
      <header className="fixed top-0 left-0 right-0 z-50 h-19">
        <div
          className={`relative mx-auto flex items-center justify-between gap-6 border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            floating
              ? 'mt-2 h-[60px] w-[calc(100%-24px)] max-w-[1080px] rounded-full border-white/70 bg-white/55 px-5 shadow-[0_12px_32px_-14px_rgba(16,42,67,0.3)] backdrop-blur-xl backdrop-saturate-150 md:px-7'
              : 'h-full w-full max-w-7xl border-transparent px-6 md:px-10'
          }`}
        >
          <span
            ref={progressRef}
            className={`pointer-events-none absolute bottom-0 left-8 right-8 h-[2px] origin-left rounded-full transition-opacity duration-300 ${
              floating ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: 'var(--hero-cta-gradient)', transform: 'scaleX(0)' }}
            aria-hidden="true"
          />

          <Link to="/employers" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/images/logo.png"
              alt="Mzobs"
              className={`w-auto object-contain transition-[height] duration-500 ${floating ? 'h-11' : 'h-14'}`}
            />
            <span className="hidden sm:inline text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-(--explorer-blue) bg-(--explorer-blue-surface) border border-(--explorer-blue-border) rounded-full px-2.5 py-1">
>>>>>>> Stashed changes
              For Employers
            </span>
          </Link>

<<<<<<< Updated upstream
          <nav aria-label="Employer" className="hidden lg:flex items-center gap-7">
=======
          <nav aria-label="Employer" className="hidden lg:flex items-center gap-1">
>>>>>>> Stashed changes
            {EMPLOYER_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
<<<<<<< Updated upstream
                className="text-[13px] font-bold text-[#111827]/65 hover:text-[#4a4ed8] transition-colors"
=======
                className="rounded-full px-3.5 py-2 text-[14px] font-semibold text-(--explorer-navy)/75 hover:text-(--explorer-navy) hover:bg-(--explorer-navy)/[0.06] transition-colors"
>>>>>>> Stashed changes
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
<<<<<<< Updated upstream
              to="/employers/pricing"
              className="flex items-center gap-1.5 text-[13px] font-bold text-white bg-[#4a4ed8] hover:bg-[#111827] transition-colors duration-200 px-4 py-2 rounded-full"
            >
              <Crown size={14} className="fill-white/15" />
              Subscription
            </Link>
            <Link
              to="/employers/signin"
              className="text-[13px] font-bold text-[#111827]/75 hover:text-[#4a4ed8] transition-colors px-3 py-2"
            >
              Sign in
            </Link>

          </div>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-[#111827]/20 text-[#111827]"
=======
              to="/"
              className="text-[13.5px] font-semibold text-(--explorer-muted) hover:text-(--explorer-navy) transition-colors px-3 py-2"
            >
              Looking for a job?
            </Link>
            <Link
              to="/employers/signin"
              className="text-[13.5px] font-semibold text-(--explorer-navy) hover:text-(--explorer-blue) transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <ExplorerButton to="/employers/signup" size="md">
              Post a Job
            </ExplorerButton>
          </div>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-(--explorer-border) text-(--explorer-navy)"
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              className="lg:hidden fixed top-19 left-0 right-0 bg-[#f7f8fc] border-b border-[#111827]/10 shadow-lg z-40"
=======
              className="lg:hidden fixed top-19 left-0 right-0 bg-white border-b border-(--explorer-border) shadow-lg z-40"
>>>>>>> Stashed changes
            >
              <div className="p-5 flex flex-col gap-1">
                {EMPLOYER_NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setOpen(false)}
<<<<<<< Updated upstream
                    className="py-3 text-[14px] font-bold text-[#111827] border-b border-[#111827]/10"
=======
                    className="py-3 text-[14px] font-semibold text-(--explorer-navy) border-b border-(--explorer-border)"
>>>>>>> Stashed changes
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4">
                  <Link
<<<<<<< Updated upstream
                    to="/employers/pricing"
                    onClick={() => setOpen(false)}
                    className="h-10 flex items-center justify-center gap-1.5 rounded-full bg-[#4a4ed8] text-white text-[13.5px] font-bold"
                  >
                    <Crown size={14} className="fill-white/15" /> Subscription
=======
                    to="/"
                    onClick={() => setOpen(false)}
                    className="h-10 flex items-center justify-center rounded-md border border-(--explorer-border) text-(--explorer-navy) text-[13.5px] font-bold"
                  >
                    Looking for a job?
>>>>>>> Stashed changes
                  </Link>
                  <Link
                    to="/employers/signin"
                    onClick={() => setOpen(false)}
<<<<<<< Updated upstream
                    className="h-10 flex items-center justify-center rounded-full border border-[#111827]/20 text-[#111827] text-[13.5px] font-bold"
                  >
                    Sign in
                  </Link>
=======
                    className="h-10 flex items-center justify-center rounded-md border border-(--explorer-border) text-(--explorer-navy) text-[13.5px] font-bold"
                  >
                    Sign in
                  </Link>
                  <ExplorerButton to="/employers/signup" size="md" onClick={() => setOpen(false)}>
                    Post a Job
                  </ExplorerButton>
>>>>>>> Stashed changes
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
