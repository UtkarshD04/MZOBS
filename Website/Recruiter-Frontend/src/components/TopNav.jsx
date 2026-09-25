import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { Bell, HelpCircle, Sparkles, ChevronDown, Search, Menu, X, CreditCard, Settings, LogOut } from 'lucide-react'
import { IS_DEMO } from '../lib/config'
import { getSession, logout } from '../services/liveApi'
import { getPlanSnapshot, subscribePlan } from '../services/planService'
import { listNotifications } from '../services/accountService'
import { ROUTES } from '../lib/routes'

// The source PNG has wide transparent margins, so it is cropped to the mark
// itself (overflow-hidden + offset) to render at a readable size in the nav.
export function Logo({ height = 34 }) {
  const w = height * 3.22
  const imgH = height * 2.5
  return (
    <Link to="/" aria-label="Mzobs Talent — home" className="flex items-center gap-2.5">
      <span className="relative block shrink-0 overflow-hidden" style={{ width: w, height }}>
        <img src="/images/logo.png" alt="Mzobs" draggable="false" className="absolute max-w-none select-none" style={{ height: imgH, width: imgH * 1.83, left: -imgH * 1.83 * 0.17, top: -imgH * 0.303 }} />
      </span>
      <span className="hidden border-l border-ink/20 pl-2.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/65 sm:inline">Talent</span>
    </Link>
  )
}

const PRIMARY = ROUTES.filter((r) => r.nav === 'primary')
const MORE = ROUTES.filter((r) => r.nav === 'more')

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        clsx('relative rounded-md px-2.5 py-1.5 text-[13.5px] font-bold transition-colors', isActive ? 'text-accent after:absolute after:inset-x-2.5 after:-bottom-[19px] after:h-0.5 after:rounded after:bg-accent' : 'text-ink/75 hover:text-accent')
      }
    >
      {children}
    </NavLink>
  )
}

// Dropdown behaviour shared by the More and profile menus: closes on outside click,
// Esc, and — the part that used to be missing — whenever the route changes, so
// choosing an item never leaves the menu hanging open.
function useMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  return { open, setOpen, ref }
}

/** Bell: goes to /notifications and shows the unread count from the API. */
function BellLink() {
  const [unread, setUnread] = useState(0)
  useEffect(() => {
    if (IS_DEMO) return
    const load = () => listNotifications().then((r) => setUnread(r.filter((n) => n.unread).length)).catch(() => {})
    load()
    const t = setInterval(load, 60000)
    window.addEventListener('mzt-notifications-changed', load)
    return () => {
      clearInterval(t)
      window.removeEventListener('mzt-notifications-changed', load)
    }
  }, [])
  return (
    <NavLink to="/notifications" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} title="Notifications" className={({ isActive }) => `relative grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-line-2 ${isActive ? 'bg-accent-soft text-accent' : 'text-ink-2'}`}>
      <Bell size={17} />
      {unread > 0 && <span className="pop absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9.5px] font-bold text-white">{unread > 9 ? '9+' : unread}</span>}
    </NavLink>
  )
}

function ProfileMenu() {
  const { open, setOpen, ref } = useMenu()
  const s = IS_DEMO ? null : getSession()
  const item = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] hover:bg-line-2'
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu" className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[12px] font-semibold text-white transition-colors hover:bg-accent">
        {IS_DEMO ? 'R' : s?.user?.initials ?? 'R'}
      </button>
      {open && (
        <div role="menu" className="fade-up absolute right-0 top-11 z-50 w-56 rounded-2xl border border-line bg-white p-1 shadow-pop">
          <div className="border-b border-line-2 px-3 pb-2 pt-1.5">
            <p className="truncate text-[13px] font-semibold">{IS_DEMO ? 'Demo recruiter' : s?.user?.name ?? 'Recruiter'}</p>
            <p className="truncate text-[12px] text-muted">{IS_DEMO ? 'Sample workspace' : s?.user?.email ?? s?.company?.name}</p>
          </div>
          <Link role="menuitem" to="/settings" className={item}><Settings size={14} className="text-muted" /> Recruiter settings</Link>
          <Link role="menuitem" to="/credits" className={item}><CreditCard size={14} className="text-muted" /> Plan & credits</Link>
          <Link role="menuitem" to="/help" className={item}><HelpCircle size={14} className="text-muted" /> Help & support</Link>
          {!IS_DEMO && (
            <button role="menuitem" onClick={() => { if (window.confirm('Sign out of Mzobs Talent?')) { logout(); window.dispatchEvent(new Event('mzt-signed-out')) } }} className={`${item} text-bad`}><LogOut size={14} /> Sign out</button>
          )}
        </div>
      )}
    </div>
  )
}

function PlanPill() {
  const [plan, setPlan] = useState(getPlanSnapshot())
  useEffect(() => subscribePlan(setPlan), [])
  const needsPlan = !IS_DEMO && plan && !plan.active
  const warn = !IS_DEMO && plan && plan.active && plan.credits === 0
  return (
    <Link to="/credits" title={IS_DEMO ? 'Demo workspace' : plan ? (plan.active ? `Plan active${plan.expiresAt ? ` until ${new Date(plan.expiresAt).toLocaleDateString('en-IN')}` : ''}` : 'No active plan') : 'Plan & credits'} className={`hidden items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold transition-colors duration-200 md:flex ${needsPlan ? 'bg-accent text-white hover:bg-ink' : warn ? 'border border-[#f3dfb8] bg-warn-soft text-warn' : 'border border-ink/15 text-ink hover:bg-accent-soft'}`}>
      <CreditCard size={14} className={needsPlan || warn ? '' : 'text-accent'} />
      {IS_DEMO ? 'Demo plan' : plan ? (plan.active ? `${plan.credits} credits` : 'Subscribe') : 'Credits'}
    </Link>
  )
}

// Same event App.jsx and lib/api.js already use to drop the signed-in state
// (an expired token fires it too), so signing out from here lands on the
// same login screen.
function signOut() {
  if (!window.confirm('Sign out of Mzobs Talent?')) return
  logout()
  window.dispatchEvent(new Event('mzt-signed-out'))
}

export default function TopNav({ onAskAI }) {
  const more = useMenu()
  const [mobile, setMobile] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setMobile(false), [pathname])
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-[#f7f9fb]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 lg:px-6">
        <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-line-2 lg:hidden" onClick={() => setMobile((v) => !v)} aria-label="Menu">
          {mobile ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Logo />
        <nav className="ml-4 hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {PRIMARY.map((r) => <NavItem key={r.path} to={r.path}>{r.label}</NavItem>)}
          <div ref={more.ref} className="relative">
            <button onClick={() => more.setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={more.open} className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13.5px] font-bold transition-colors ${MORE.some((r) => pathname.startsWith(r.path)) ? 'text-accent' : 'text-ink/75 hover:text-accent'}`}>
              More <ChevronDown size={14} className={`transition-transform ${more.open ? 'rotate-180' : ''}`} />
            </button>
            {more.open && (
              <div role="menu" className="fade-up absolute left-0 top-10 z-50 w-52 rounded-2xl border border-line bg-white p-1 shadow-lift">
                {MORE.map((r) => (
                  <NavLink key={r.path} to={r.path} role="menuitem" className={({ isActive }) => `block rounded-lg px-3 py-2 text-[13px] font-medium hover:bg-line-2 ${isActive ? 'text-accent' : ''}`}>{r.label}</NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={onAskAI} className="hidden items-center gap-2 rounded-full border border-[#bfe6df] bg-accent-soft px-3.5 py-1.5 text-[13px] font-bold text-accent transition-colors hover:bg-[#d5f2ec] md:flex">
            <Sparkles size={14} /> Ask Mzobs AI <kbd className="rounded bg-white/70 px-1 text-[10px] text-muted">Ctrl K</kbd>
          </button>
          <Link to="/" className="grid h-9 w-9 place-items-center rounded-lg text-ink-2 hover:bg-line-2 md:hidden" aria-label="Search candidates"><Search size={17} /></Link>
          <BellLink />
          <NavLink to="/help" aria-label="Help & support" title="Help & support" className={({ isActive }) => `hidden h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-line-2 2xl:grid ${isActive ? 'bg-accent-soft text-accent' : 'text-ink-2'}`}><HelpCircle size={17} /></NavLink>
          <PlanPill />
          <ProfileMenu />
          {!IS_DEMO && (
            <button
              onClick={signOut}
              className="ml-0.5 flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/15 px-2.5 text-[13px] font-bold text-ink transition-colors hover:border-[#f0c4c4] hover:bg-[#fdf1f1] hover:text-[#c0392b] 2xl:px-3.5"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={15} />
              <span className="hidden 2xl:inline">Log out</span>
            </button>
          )}
        </div>
      </div>
      {mobile && (
        <nav className="fade-up grid grid-cols-2 gap-1 border-t border-line bg-white p-3 lg:hidden">
          {[...PRIMARY, ...MORE].map((r) => <NavItem key={r.path} to={r.path} onClick={() => setMobile(false)}>{r.label}</NavItem>)}
          {!IS_DEMO && (
            <button onClick={signOut} className="col-span-2 mt-1 flex items-center justify-center gap-2 rounded-lg border border-line px-2.5 py-2 text-[13.5px] font-bold text-[#c0392b] hover:bg-[#fdf1f1]">
              <LogOut size={15} /> Log out
            </button>
          )}
        </nav>
      )}
    </header>
  )
}
