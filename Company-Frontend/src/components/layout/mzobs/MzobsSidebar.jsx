import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Video,
  Building2,
  Briefcase,
  ClipboardList,
  Send,
  IndianRupee,
  Users2,
  Settings,
  LifeBuoy,
  LogOut,
  PanelLeft,
} from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import { cn } from '../../../lib/utils'
import { QUEUE_COUNTS } from '../../../lib/mzobsData'

const candidateOps = [
  { to: '/app/candidates', label: 'Candidates', icon: Users },
  { to: '/app/resumes', label: 'Resume Verification', icon: FileCheck, badge: QUEUE_COUNTS.resumes },
  { to: '/app/mock-interviews', label: 'Mock Interviews', icon: Video, badge: QUEUE_COUNTS.mocks },
]
const employerOps = [
  { to: '/app/companies', label: 'Companies', icon: Building2, badge: QUEUE_COUNTS.companies },
  { to: '/app/requirements', label: 'Requirements', icon: Briefcase, badge: QUEUE_COUNTS.jobs },
  { to: '/app/applications', label: 'Applications', icon: ClipboardList },
  { to: '/app/dispatch', label: 'Resume Dispatch', icon: Send },
]
const business = [
  { to: '/app/payments', label: 'Payments', icon: IndianRupee },
  { to: '/app/team', label: 'Mzobs Team', icon: Users2 },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

function NavItem({ to, label, icon: Icon, badge, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-[11px] px-2.5 py-[9px] rounded-[9px] cursor-pointer mb-0.5 text-[13.5px] font-medium whitespace-nowrap overflow-hidden transition-all duration-200 ease-out-premium',
          isActive ? 'bg-navy-tint text-navy font-semibold' : 'text-ink-secondary hover:bg-surface-hover hover:text-ink hover:translate-x-0.5'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div layoutId="mzobs-nav-pill" className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[3px] bg-gradient-to-b from-navy to-gold-dot" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
          )}
          <Icon size={18} className="flex-shrink-0 transition-transform duration-200 ease-out-premium group-hover:scale-110" />
          {!collapsed && <span className="flex-1 overflow-hidden text-ellipsis">{label}</span>}
          {!collapsed && !!badge && <span className="ml-auto text-[11px] font-bold bg-gold-tint text-gold-strong rounded-full px-[7px] py-px">{badge}</span>}
        </>
      )}
    </NavLink>
  )
}

function Group({ label, items, collapsed }) {
  return (
    <nav className="mb-[18px]">
      {label && !collapsed && <div className="text-[11px] font-semibold tracking-wider uppercase text-ink-tertiary px-2.5 mb-1.5">{label}</div>}
      {items.map((it) => (
        <NavItem key={it.to} {...it} collapsed={collapsed} />
      ))}
    </nav>
  )
}

export default function MzobsSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen } = useApp()

  return (
    <aside
      className={cn(
        'flex-shrink-0 border-r border-border bg-bg-secondary sticky top-16 h-[calc(100vh-64px)] overflow-y-auto flex flex-col p-3 transition-[width] duration-200 z-40',
        sidebarCollapsed ? 'w-[76px]' : 'w-[264px]',
        'max-lg:fixed max-lg:left-0 max-lg:top-16 max-lg:shadow-lg max-lg:transition-transform',
        mobileSidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'
      )}
    >
      <Group items={[{ to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard }]} collapsed={sidebarCollapsed} />
      <Group label="Candidate Ops" items={candidateOps} collapsed={sidebarCollapsed} />
      <Group label="Employer Ops" items={employerOps} collapsed={sidebarCollapsed} />
      <Group label="Business" items={business} collapsed={sidebarCollapsed} />

      <div className="mt-auto pt-3 border-t border-border">
        <NavItem to="/app/support" label="Support Desk" icon={LifeBuoy} collapsed={sidebarCollapsed} />
        <NavLink to="/login" className="flex items-center gap-[11px] px-2.5 py-[9px] rounded-[9px] cursor-pointer mb-0.5 text-[13.5px] font-medium text-ink-secondary hover:bg-surface-hover hover:text-ink">
          <LogOut size={18} className="flex-shrink-0" />
          {!sidebarCollapsed && <span>Log out</span>}
        </NavLink>
        <button
          onClick={() => setSidebarCollapsed((c) => !c)}
          className="hidden lg:flex items-center gap-2.5 px-2.5 py-2 rounded-[9px] text-ink-tertiary hover:bg-surface-hover hover:text-ink cursor-pointer text-[12.5px] w-full"
        >
          <PanelLeft size={16} />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
