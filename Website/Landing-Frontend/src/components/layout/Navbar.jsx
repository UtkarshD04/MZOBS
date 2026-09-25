import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, LogOut, User } from 'lucide-react'
import { NAV_LINKS } from '../../lib/content'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'
import { getEmployeeSession, clearEmployeeSession, onEmployeeSessionChange } from '../../lib/employeeSession'
import { subscribeToWebPush, unsubscribeFromWebPush } from '../../lib/webPush'
import EmployeeAuthModal from '../forms/EmployeeAuthModal'

// Sitewide header — same on every route, including Home, so it never
// visibly changes when navigating (e.g. clicking "For Employers").
export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // The Mzobs Ally page is for students — the employer call-to-action doesn't belong there.
  const showEmployer = pathname !== CLIENT_ONLY_ROUTES.ally
  const [open, setOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoverLink, setHoverLink] = useState(null)
  const progressRef = useRef(null)
  // Starts null (not read from localStorage here) so the server-rendered/
  // prerendered markup and the client's first paint match — localStorage
  // doesn't exist during SSR. The real value is picked up right after mount
  // in the effect below instead.
  const [session, setSession] = useState(null)
  const floating = scrolled || open

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setScrolled(y > 8)
      // Reading-progress hairline along the bottom of the floating bar.
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Navbar is mounted once for the whole app (see comment above), so it
  // won't naturally re-render when EmployeeSign{in,up}Form saves a session
  // after navigating back to "/" — this picks that change up explicitly.
  useEffect(() => {
    setSession(getEmployeeSession())
    return onEmployeeSessionChange(() => setSession(getEmployeeSession()))
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

  function goToProfile() {
    navigate('/employees/profile')
  }

  return (
    <>
      {/* Transparent at the top of the page; once you scroll it condenses into a
          floating frosted "island" with a reading-progress hairline along its
          bottom edge. */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-19"
      >
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
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/images/logo.png"
              alt="Mzobs"
              className={`w-auto object-contain transition-[height] duration-500 ${floating ? 'h-11' : 'h-14'}`}
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1" onMouseLeave={() => setHoverLink(null)}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onMouseEnter={() => setHoverLink(link.label)}
                onFocus={() => setHoverLink(link.label)}
                onBlur={() => setHoverLink(null)}
                className="relative rounded-full px-3.5 py-2 text-[14px] font-semibold text-(--jobs-navy)/75 transition-colors hover:text-(--jobs-navy)"
              >
                {hoverLink === link.label && (
                  <motion.span
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 rounded-full bg-(--jobs-navy)/[0.07] ring-1 ring-(--jobs-navy)/[0.05]"
                    transition={{ type: 'spring', stiffness: 520, damping: 38 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {session ? (
              <>
                <button
                  onClick={goToProfile}
                  className="flex items-center gap-1.5 text-[13.5px] font-semibold text-(--jobs-navy) hover:text-(--jobs-teal-dark) transition-colors px-3 py-2"
                  title="View profile"
                >
                  <User size={15} /> Hi, {session.employee?.name?.split(' ')[0] ?? 'there'}
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-[13.5px] font-semibold text-(--jobs-navy)/75 hover:text-(--jobs-teal-dark) transition-colors px-3 py-2"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="text-[13.5px] font-semibold text-(--jobs-navy) hover:text-(--jobs-teal-dark) transition-colors px-3 py-2"
              >
                Sign in
              </button>
            )}
            {!session && showEmployer && (
              <Link
                to="/employers"
                className="text-[13.5px] font-bold text-white bg-(--jobs-navy) hover:bg-(--jobs-teal-dark) transition-colors px-4 py-2.5 rounded-lg"
              >
                Employer
              </Link>
            )}
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
                  {session ? (
                    <>
                      <button
                        onClick={() => {
                          setOpen(false)
                          goToProfile()
                        }}
                        className="h-10 flex items-center justify-center gap-1.5 rounded-lg border border-(--jobs-border) text-(--jobs-navy) text-[13.5px] font-bold"
                      >
                        <User size={15} /> Hi, {session.employee?.name?.split(' ')[0] ?? 'there'}
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="h-10 flex items-center justify-center gap-1.5 rounded-lg border border-(--jobs-border) text-(--jobs-navy) text-[13.5px] font-bold"
                      >
                        <LogOut size={15} /> Sign out
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        setAuthModalOpen(true)
                      }}
                      className="h-10 flex items-center justify-center rounded-lg border border-(--jobs-border) text-(--jobs-navy) text-[13.5px] font-bold"
                    >
                      Sign in
                    </button>
                  )}
                  {!session && showEmployer && (
                    <Link
                      to="/employers"
                      onClick={() => setOpen(false)}
                      className="h-10 flex items-center justify-center rounded-lg bg-(--jobs-navy) text-white text-[13.5px] font-bold"
                    >
                      Employer
                    </Link>
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
