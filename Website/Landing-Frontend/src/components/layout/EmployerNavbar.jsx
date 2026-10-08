import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import ExplorerButton from '../ui/ExplorerButton'

const EMPLOYER_NAV_LINKS = [
  { label: 'How it works', to: '/employers#how-it-works' },
  { label: 'Find candidates', to: '/employers#discover-talent' },
  { label: 'Pricing', to: '/employers/pricing' },
  { label: 'FAQs', to: '/employers#faq' },
]

// Employer-section header, shared by /employers, /employers/pricing and the
// employer auth pages. Transparent over the hero, then a solid white bar with
// a hairline and the --hero-cta-gradient scroll-progress line once scrolled.
export default function EmployerNavbar({ overHero = false }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useRef(null)
  const toggleRef = useRef(null)
  const { pathname, hash } = useLocation()
  const solid = scrolled || open
  const light = overHero && !solid // white text over the dark hero

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setScrolled(y > 8)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile sheet on Escape and hand focus back to the toggle.
  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isCurrent = (to) => {
    const [path, frag] = to.split('#')
    return frag ? pathname === path && hash === `#${frag}` : pathname === path
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 border-b ${
          solid
            ? 'border-(--explorer-border) bg-white/92 shadow-[0_8px_24px_-18px_rgba(16,42,67,0.35)] backdrop-blur-xl backdrop-saturate-150'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="relative mx-auto flex h-17 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 md:h-19 md:px-10">
          <Link to="/employers" className="flex min-h-11 shrink-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue)" aria-label="Mzobs for employers, home">
            <img src="/images/logo.png" alt="" className={`h-8 w-auto shrink-0 object-contain md:h-9 ${light ? 'brightness-0 invert' : ''}`} />
            <span aria-hidden="true" className={`hidden h-6 w-px sm:block ${light ? 'bg-white/25' : 'bg-(--explorer-border)'}`} />
            <span className={`hidden text-[13px] font-bold tracking-[-0.01em] sm:inline ${light ? 'text-white' : 'text-(--explorer-navy)'}`}>Employers</span>
          </Link>

          <nav aria-label="Employer" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {EMPLOYER_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                aria-current={isCurrent(link.to) ? 'page' : undefined}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${light ? 'text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-white' : 'text-(--explorer-navy)/75 hover:bg-(--explorer-navy)/5 hover:text-(--explorer-navy) aria-[current=page]:text-(--explorer-blue) focus-visible:outline-(--explorer-blue)'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-1 lg:flex">
            <Link
              to="/"
              className={`rounded-md px-3 py-2 text-[13.5px] font-semibold transition-colors focus-visible:outline-2 ${light ? 'text-white/75 hover:text-white focus-visible:outline-white' : 'text-(--explorer-muted) hover:text-(--explorer-navy) focus-visible:outline-(--explorer-blue)'}`}
            >
              Looking for a job?
            </Link>
            <Link
              to="/employers/signin"
              className={`rounded-md px-3 py-2 text-[13.5px] font-bold transition-colors focus-visible:outline-2 ${light ? 'text-white hover:text-[#5fe0b8] focus-visible:outline-white' : 'text-(--explorer-navy) hover:text-(--explorer-blue) focus-visible:outline-(--explorer-blue)'}`}
            >
              Sign in
            </Link>
            <ExplorerButton to="/employers/signup" size="md" className={`ml-2 ${light ? 'bg-white! text-(--explorer-navy)! hover:bg-[#e4f8f1]!' : ''}`}>
              Post a job
            </ExplorerButton>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ExplorerButton to="/employers/signup" size="md" className={`px-4 ${light ? 'bg-white! text-(--explorer-navy)! hover:bg-[#e4f8f1]!' : ''}`}>
              Post a job
            </ExplorerButton>
            <button
              ref={toggleRef}
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-(--explorer-border) bg-white text-(--explorer-navy) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="employer-mobile-menu"
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>

          <span
            ref={progressRef}
            className={`pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left transition-opacity duration-300 ${solid ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: 'var(--hero-cta-gradient)', transform: 'scaleX(0)' }}
            aria-hidden="true"
          />
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-17 z-40 bg-(--explorer-navy)/40 md:top-19 lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="employer-mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-x-0 top-17 z-40 max-h-[calc(100dvh-68px)] overflow-y-auto border-b border-(--explorer-border) bg-white shadow-xl md:top-19 lg:hidden"
            >
              <nav aria-label="Employer mobile" className="px-4 pb-6 pt-2 sm:px-6">
                <ul>
                  {EMPLOYER_NAV_LINKS.map((link) => (
                    <li key={link.label} className="border-b border-(--explorer-border)">
                      <Link
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className="flex min-h-14 items-center justify-between text-[17px] font-bold text-(--explorer-navy) focus-visible:outline-2 focus-visible:outline-(--explorer-blue)"
                      >
                        {link.label}
                        <ArrowRight size={18} className="text-(--explorer-blue)" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <Link
                    to="/employers/signin"
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center justify-center rounded-md border border-(--explorer-border) text-[14px] font-bold text-(--explorer-navy) focus-visible:outline-2 focus-visible:outline-(--explorer-blue)"
                  >
                    Sign in
                  </Link>
                  <ExplorerButton to="/employers/signup" size="xl" onClick={() => setOpen(false)}>
                    Post a job
                  </ExplorerButton>
                </div>
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="mt-4 flex min-h-11 items-center justify-center text-[13.5px] font-semibold text-(--explorer-muted) hover:text-(--explorer-navy)"
                >
                  Looking for a job? Go to Mzobs for candidates
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
