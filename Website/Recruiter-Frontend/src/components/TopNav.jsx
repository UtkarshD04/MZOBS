import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import clsx from 'clsx'
import { Bell, HelpCircle, Sparkles, ChevronDown, Search, Menu, X, CreditCard, LogOut } from 'lucide-react'
import { IS_DEMO } from '../lib/config'
import { getSession, logout } from '../services/liveApi'
import { getPlanSnapshot, subscribePlan } from '../services/planService'
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
  const [more, setMore] = useState(false)
  const [mobile, setMobile] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-[#f7f9fb]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 lg:px-6">
        <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-line-2 lg:hidden" onClick={() => setMobile((v) => !v)} aria-label="Menu">
          {mobile ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Logo />
        <nav className="ml-4 hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {PRIMARY.map((r) => <NavItem key={r.path} to={r.path}>{r.label}</NavItem>)}
          <div className="relative">
            <button onClick={() => setMore((v) => !v)} onBlur={() => setTimeout(() => setMore(false), 120)} className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13.5px] font-medium text-muted hover:text-ink">
              More <ChevronDown size={14} />
            </button>
            {more && (
              <div className="fade-up absolute left-0 top-9 w-48 rounded-2xl border border-line bg-white p-1 shadow-lift">
                {MORE.map((r) => (
                  <NavLink key={r.path} to={r.path} className="block rounded-lg px-3 py-2 text-[13px] hover:bg-line-2">{r.label}</NavLink>
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
          <button className="grid h-9 w-9 place-items-center rounded-lg text-ink-2 hover:bg-line-2" aria-label="Notifications"><Bell size={17} /></button>
          <button className="hidden h-9 w-9 place-items-center rounded-lg text-ink-2 hover:bg-line-2 2xl:grid" aria-label="Help"><HelpCircle size={17} /></button>
          <PlanPill />
          <span
            className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[12px] font-semibold text-white"
            title={IS_DEMO ? 'Demo recruiter' : getSession()?.user?.name ?? 'Recruiter'}
          >
            {IS_DEMO ? 'R' : getSession()?.user?.initials ?? 'R'}
          </span>
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
