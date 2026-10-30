import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { Bell, HelpCircle, Sparkles, ChevronDown, Search, Menu, X, CreditCard, Settings, LogOut } from 'lucide-react'
import { IS_DEMO } from '../lib/config'
import { getSession, logout } from '../services/liveApi'
import { getPlanSnapshot, subscribePlan } from '../services/planService'
import { listNotifications } from '../services/accountService'
import { ROUTES, isRouteActive } from '../lib/routes'
import { usePermissions } from '../services/recruiterService'
import { StatusPill } from './ui'
import { useCompany, GST_STATUS_LABEL, GST_STATUS_PILL } from '../services/companyService'

// The company's GST verification status, from the same server record the
// Settings page and the employer app use. Links to Settings to act on it.
function GstStatusLink() {
  const { company } = useCompany()
  const status = company?.gstVerification?.status ?? (company ? 'NOT_SUBMITTED' : null)
  if (!status) return null
  return (
    <Link role="menuitem" to="/settings" className="mt-1.5 inline-block" title="GST verification — open settings">
      <StatusPill status={GST_STATUS_PILL[status] ?? 'none'} label={GST_STATUS_LABEL[status]} />
    </Link>
  )
}

// The source PNG has wide transparent margins, so it is cropped to the mark
// itself (overflow-hidden + offset) to render at a readable size in the nav.
export function Logo({ height = 34, compact = false }) {
  const w = height * 3.22
  const imgH = height * 2.5
  return (
    <Link to="/" aria-label="Mzobs Talent — home" className="flex items-center gap-2.5">
      <span className="relative block shrink-0 overflow-hidden" style={{ width: w, height }}>
        <img src="/images/logo.png" alt="Mzobs" draggable="false" className="absolute max-w-none select-none" style={{ height: imgH, width: imgH * 1.83, left: -imgH * 1.83 * 0.17, top: -imgH * 0.303 }} />
      </span>
      <span className={clsx('hidden border-l border-ink/20 pl-2.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/65', compact ? 'min-[1700px]:inline' : 'sm:inline')}>Talent</span>
    </Link>
  )
}

// Items the signed-in role can use. Until the role has loaded (or in demo mode) everything shows, so the bar doesn't jump.
function useNav() {
  const { loaded, can } = usePermissions()
  const visible = (r) => IS_DEMO || !loaded || !r.perm || r.perm.some(can)
  return { primary: ROUTES.filter((r) => r.nav === 'primary' && visible(r)), more: ROUTES.filter((r) => r.nav === 'more' && visible(r)) }
}

// Bar order: the everyday recruiter links first, then the rest of the routes in their own order.
const BAR_LABEL = { '/shortlists': 'Shortlists', '/feedback': 'Feedback', '/credits': 'Credits', '/team': 'Team' }
const BAR_ORDER = ['/search', '/talent-pool', '/overview', '/jobs', '/applicants', '/messages', '/shortlists', '/unlocked', '/interviews', '/offers', '/reports']
const rank = (r) => { const i = BAR_ORDER.indexOf(r.path); return i < 0 ? BAR_ORDER.length : i }
const PILL_EXTRA = 14 // a pill link is this much wider than its measured plain copy (padding, border, gap)
const LINK = 'whitespace-nowrap rounded-md px-2 py-1.5 text-[13px] font-bold'

/**
 * Splits the links over two rows: row one is the space beside the logo, row two runs the full width below it.
 * Widths are measured from an invisible copy of every link (the last child is the More button), so the split
 * follows the real window size, zoom and fonts. Only if both rows are full do the leftover links go in More.
 */
function useBarFit(rowRef, boxRef, measureRef, sig) {
  const [fit, setFit] = useState({ a: 6, b: 6 })
  useLayoutEffect(() => {
    const row = rowRef.current
    const box = boxRef.current
    const m = measureRef.current
    if (!row || !box || !m) return
    const calc = () => {
      const avail1 = row.clientWidth
      if (!avail1) return // bar is hidden (mobile menu in use)
      const cs = getComputedStyle(box)
      const avail2 = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const kids = [...m.children]
      const moreW = kids.pop()?.offsetWidth ?? 0
      const w = kids.map((k) => k.offsetWidth + 2)
      let a = 0
      for (let used = 0; a < w.length && used + w[a] <= avail1; a += 1) used += w[a]
      const rest = w.slice(a).map((x) => x + PILL_EXTRA)
      let b = 0
      if (rest.reduce((t, x) => t + x, 0) <= avail2) b = rest.length
      else for (let used = moreW + 10; b < rest.length && used + rest[b] <= avail2; b += 1) used += rest[b]
      setFit((f) => (f.a === a && f.b === b ? f : { a, b }))
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(row)
    ro.observe(box)
    document.fonts?.ready.then(calc)
    return () => ro.disconnect()
  }, [sig]) // eslint-disable-line react-hooks/exhaustive-deps
  return fit
}

function NavItem({ route, onClick, className, label, top, pill }) {
  const { pathname } = useLocation()
  const active = isRouteActive(route, pathname)
  return (
    <Link
      to={route.path}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={pill ? clsx('whitespace-nowrap rounded-full border px-3 py-1 text-[13px] font-bold transition-colors', active ? 'border-accent bg-accent-soft text-accent' : 'border-line bg-white text-ink/75 hover:border-accent hover:text-accent') : clsx('relative transition-colors', LINK, className, top ? 'after:-bottom-[19px]' : 'after:-bottom-[5px]', active ? 'text-accent after:absolute after:inset-x-2 after:h-0.5 after:rounded after:bg-accent' : 'text-ink/75 hover:text-accent')}
    >
      {label ?? route.label}
    </Link>
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
      <button onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu" className="grid h-9 w-9 place-items-center rounded-full text-[12px] font-semibold text-white shadow-[0_1px_1px_rgba(14,34,55,0.25)] transition-transform hover:-translate-y-px [background-image:var(--grad-primary)]">
        {IS_DEMO ? 'R' : s?.user?.initials ?? 'R'}
      </button>
      {open && (
        <div role="menu" className="fade-up absolute right-0 top-11 z-50 w-56 rounded-2xl border border-line bg-white p-1 shadow-pop">
          <div className="border-b border-line-2 px-3 pb-2 pt-1.5">
            <p className="truncate text-[13px] font-semibold">{IS_DEMO ? 'Demo recruiter' : s?.user?.name ?? 'Recruiter'}</p>
            <p className="truncate text-[12px] text-muted">{IS_DEMO ? 'Sample workspace' : s?.user?.email ?? s?.company?.name}</p>
            {!IS_DEMO && <GstStatusLink />}
          </div>
          <Link role="menuitem" to="/settings" className={item}><Settings size={14} className="text-muted" /> Settings</Link>
          <Link role="menuitem" to="/credits" className={item}><CreditCard size={14} className="text-muted" /> CV credits & billing</Link>
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
    <Link to="/credits" title={IS_DEMO ? 'Demo workspace' : plan ? (plan.active ? `Plan active${plan.expiresAt ? ` until ${new Date(plan.expiresAt).toLocaleDateString('en-IN')}` : ''}` : 'No active plan') : 'Plan & credits'} className={`hidden items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold transition-all duration-200 hover:-translate-y-px md:flex ${needsPlan ? 'border-transparent text-white shadow-[0_1px_1px_rgba(8,104,94,0.3)] [background-image:var(--grad-accent)]' : warn ? 'border border-[#f3dfb8] bg-warn-soft text-warn' : 'border border-ink/15 text-ink hover:bg-accent-soft'}`}>
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
  const { primary: PRIMARY, more: MORE } = useNav()
  const [mobile, setMobile] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setMobile(false), [pathname])
  const rowRef = useRef(null)
  const boxRef = useRef(null)
  const measureRef = useRef(null)
  const items = [...PRIMARY, ...MORE].sort((a, b) => rank(a) - rank(b))
  const fit = useBarFit(rowRef, boxRef, measureRef, items.map((r) => r.path).join('|'))
  const rowOne = items.slice(0, fit.a)
  const rowTwo = items.slice(fit.a, fit.a + fit.b)
  const menuItems = items.slice(fit.a + fit.b)
  const barLabel = (r) => BAR_LABEL[r.path] ?? r.label
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-bg/90 shadow-[0_1px_0_rgba(14,34,55,0.03)] backdrop-blur-md">
      <div ref={boxRef} className="relative mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 lg:px-6">
        <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-line-2 xl:hidden" onClick={() => setMobile((v) => !v)} aria-label="Menu">
          {mobile ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Logo />
        <nav ref={rowRef} className="ml-2 hidden min-w-0 flex-1 items-center gap-0.5 xl:flex" aria-label="Primary">
          {rowOne.map((r) => <NavItem key={r.path} route={r} label={barLabel(r)} top />)}
        </nav>
        <div ref={measureRef} aria-hidden className="pointer-events-none invisible absolute left-0 top-0 -z-10 flex h-0 w-max gap-0.5 overflow-hidden">
          {items.map((r) => <span key={r.path} className={clsx(LINK, 'shrink-0')}>{barLabel(r)}</span>)}
          <span className={clsx(LINK, 'flex shrink-0 items-center gap-1')}>More <ChevronDown size={14} /></span>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <button onClick={onAskAI} title="Ask Mzobs AI (Ctrl K)" aria-label="Ask Mzobs AI" className="hidden items-center gap-2 rounded-full border border-[#bfe6df] bg-accent-soft px-2.5 py-1.5 text-[13px] font-bold text-accent transition-colors hover:bg-[#d5f2ec] md:flex 2xl:px-3.5">
            <Sparkles size={14} /> <span className="hidden 2xl:inline">Ask Mzobs AI</span> <kbd className="hidden rounded bg-white/70 px-1 text-[10px] text-muted 2xl:inline">Ctrl K</kbd>
          </button>
          <Link to="/search" className="grid h-9 w-9 place-items-center rounded-lg text-ink-2 hover:bg-line-2 md:hidden" aria-label="Search candidates"><Search size={17} /></Link>
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
      {(rowTwo.length > 0 || menuItems.length > 0) && (
        <div className="mx-auto hidden max-w-[1600px] border-t border-ink/5 px-4 lg:px-6 xl:block">
          <nav className="flex h-11 min-w-0 items-center gap-0.5" aria-label="More links">
            {rowTwo.map((r) => <NavItem key={r.path} route={r} label={barLabel(r)} />)}
            {menuItems.length > 0 && (
              <div ref={more.ref} className="relative">
                <button onClick={() => more.setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={more.open} className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-[13px] font-bold transition-colors ${menuItems.some((r) => isRouteActive(r, pathname)) ? 'text-accent' : 'text-ink/75 hover:text-accent'}`}>
                  More <ChevronDown size={14} className={`transition-transform ${more.open ? 'rotate-180' : ''}`} />
                </button>
                {more.open && (
                  <div role="menu" className="fade-up absolute left-0 top-10 z-50 w-60 rounded-xl border border-line bg-white p-1 shadow-lift">
                    {menuItems.map((r) => (
                      <Link key={r.path} to={r.path} role="menuitem" className={`block rounded-lg px-3 py-2 text-[13px] font-medium hover:bg-line-2 ${isRouteActive(r, pathname) ? 'text-accent' : ''}`}>{r.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
      {mobile && (
        <nav className="fade-up grid max-h-[75vh] grid-cols-2 gap-1 overflow-y-auto border-t border-line bg-white p-3 xl:hidden">
          {[...PRIMARY, ...MORE].map((r) => <NavItem key={r.path} route={r} onClick={() => setMobile(false)} />)}
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
