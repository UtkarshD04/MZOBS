import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react'
import { NAV_LINKS } from '../../lib/content'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'
import { clearEmployeeSession } from '../../lib/employeeSession'
import { useEmployeeSession } from '../../lib/useEmployeeSession'
import { subscribeToWebPush, unsubscribeFromWebPush } from '../../lib/webPush'
import EmployeeAuthModal from '../forms/EmployeeAuthModal'

const linkCls =
  'rounded-[8px] px-3 py-2 text-[14px] font-semibold text-(--jobs-navy)/75 transition-colors hover:bg-(--jobs-navy)/[0.05] hover:text-(--jobs-navy) focus-visible:outline-2 focus-visible:outline-(--jobs-teal-dark)'
const mobileLinkCls = 'block border-b border-(--jobs-border) py-3 text-left text-[14px] font-semibold text-(--jobs-navy)'

// Sitewide header — same on every route, including Home, so it never
// visibly changes when navigating. A plain white bar with a hairline border;
// it only picks up a faint shadow once the page scrolls under it.
export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useRef(null)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  // Read after mount (see useEmployeeSession), so the prerendered markup and
  // the first client paint match.
  const { session } = useEmployeeSession()
  // The employer link is for hiring teams — hide it on the student-facing Ally
  // page and whenever a candidate is signed in.
  const showEmployer = pathname !== CLIENT_ONLY_ROUTES.ally && !session?.token
  // Menu items flagged hideWhenSignedIn (e.g. "Associate with Mzobs", for placement
  // companies) don't belong in a signed-in candidate's menu.
  const navLinks = NAV_LINKS.map((link) =>
    link.children ? { ...link, children: link.children.filter((c) => !(c.hideWhenSignedIn && session?.token)) } : link
  )

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 4)
      // Reading-progress hairline along the bottom of the floating bar.
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Registers this browser for push notifications once there's an account to
  // attach them to — covers both a fresh sign-in/up and an already-signed-in
  // return visit. subscribeToWebPush no-ops quietly if permission is denied
  // or push isn't supported, so this is safe to fire on every session change.
  useEffect(() => {
    if (session?.token) subscribeToWebPush(session.token)
  }, [session?.token])

  function handleSignOut() {
    unsubscribeFromWebPush(session?.token)
    clearEmployeeSession()
    setOpen(false)
    navigate('/')
  }

  const firstName = session?.employee?.name?.split(' ')[0] ?? 'there'

  return (
    <>
      {/* Transparent at the top of the page; once you scroll (or open the mobile
          menu) it condenses into a floating frosted "island". */}
      <header className="fixed inset-x-0 top-0 z-50 h-16">
        <div
          className={`relative mx-auto flex items-center justify-between gap-6 border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled || open
              ? 'mt-1.5 h-[52px] w-[calc(100%-24px)] max-w-[1080px] rounded-full border-white/70 bg-white/55 px-5 shadow-[0_12px_32px_-14px_rgba(16,42,67,0.3)] backdrop-blur-xl backdrop-saturate-150 md:px-7'
              : 'h-full w-full max-w-[1200px] border-transparent px-4 sm:px-6 lg:px-8'
          }`}
        >
          <span
            ref={progressRef}
            className={`pointer-events-none absolute bottom-0 left-8 right-8 h-[2px] origin-left rounded-full transition-opacity duration-300 ${
              scrolled || open ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: 'var(--hero-cta-gradient)', transform: 'scaleX(0)' }}
            aria-hidden="true"
          />
          <Link to="/" className="flex shrink-0 items-center">
            <img src="/images/logo.png" alt="Mzobs" className="h-10 w-auto object-contain" />
          </Link>

          <nav aria-label="Primary" className="hidden flex-1 items-center gap-0.5 lg:flex">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(link.label)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen === link.label}
                    onClick={() => setDropdownOpen((v) => (v === link.label ? null : link.label))}
                    className={`${linkCls} flex items-center gap-1`}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen === link.label ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  {dropdownOpen === link.label && (
                    <div className="absolute left-0 top-full w-48 pt-1.5">
                      <div className="rounded-[10px] border border-(--jobs-border) bg-white py-1.5 shadow-[0_8px_24px_-12px_rgba(22,50,79,0.25)]">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.to}
                            onClick={() => setDropdownOpen(null)}
                            className="block px-4 py-2 text-[13.5px] font-semibold text-(--jobs-navy)/75 transition-colors hover:bg-(--jobs-navy)/[0.05] hover:text-(--jobs-navy)"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.label} to={link.to} className={linkCls}>
                  {link.label}
                </Link>
              )
            )}
            {session && (
              <Link to="/employees/applications" className={linkCls}>
                My applications
              </Link>
            )}
            {showEmployer && (
              <Link to="/employers" className={linkCls}>
                For Employers
              </Link>
            )}
          </nav>

          <div className="hidden shrink-0 items-center gap-1 lg:flex">
            {session ? (
              <>
                <Link to="/employees/profile" className={`${linkCls} flex items-center gap-1.5 text-(--jobs-navy)`} title="View profile">
                  <User size={15} aria-hidden="true" /> Hi, {firstName}
                </Link>
                <button type="button" onClick={handleSignOut} className={`${linkCls} flex items-center gap-1.5`}>
                  <LogOut size={15} aria-hidden="true" /> Sign out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="h-9 rounded-[10px] border border-(--jobs-border) px-4 text-[14px] font-semibold text-(--jobs-navy) transition-colors hover:border-(--jobs-teal-dark) hover:text-(--jobs-teal-dark) focus-visible:outline-2 focus-visible:outline-(--jobs-teal-dark)"
              >
                Sign in
              </button>
            )}
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-(--jobs-border) text-(--jobs-navy) lg:hidden"
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
              className="fixed inset-0 top-16 z-40 bg-black/25 lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-(--jobs-border) bg-white shadow-lg lg:hidden"
            >
              <div className="flex flex-col px-5 pb-5 pt-2">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label} className="border-b border-(--jobs-border)">
                      <span className="block pt-3 text-[14px] font-semibold text-(--jobs-navy)">{link.label}</span>
                      <div className="pb-2">
                        {link.children.map((child) => (
                          <Link key={child.label} to={child.to} onClick={() => setOpen(false)} className="block py-2 pl-3 text-[13.5px] font-semibold text-(--jobs-navy)/70">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link key={link.label} to={link.to} onClick={() => setOpen(false)} className={mobileLinkCls}>
                      {link.label}
                    </Link>
                  )
                )}
                {session && (
                  <Link to="/employees/applications" onClick={() => setOpen(false)} className={mobileLinkCls}>
                    My applications
                  </Link>
                )}
                {showEmployer && (
                  <Link to="/employers" onClick={() => setOpen(false)} className={mobileLinkCls}>
                    For Employers
                  </Link>
                )}
                <div className="flex flex-col gap-2 pt-4">
                  {session ? (
                    <>
                      <Link
                        to="/employees/profile"
                        onClick={() => setOpen(false)}
                        className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] border border-(--jobs-border) text-[13.5px] font-bold text-(--jobs-navy)"
                      >
                        <User size={15} aria-hidden="true" /> Hi, {firstName}
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] border border-(--jobs-border) text-[13.5px] font-bold text-(--jobs-navy)"
                      >
                        <LogOut size={15} aria-hidden="true" /> Sign out
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        setAuthModalOpen(true)
                      }}
                      className="flex h-10 items-center justify-center rounded-[10px] border border-(--jobs-border) text-[13.5px] font-bold text-(--jobs-navy)"
                    >
                      Sign in
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <EmployeeAuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}
