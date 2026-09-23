import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Briefcase,
  Package,
  Users,
  Search,
  CalendarCheck,
  FileCheck,
  CreditCard,
  Sparkles,
  Telescope,
  Wallet,
  Building2,
  Users2,
  Bell,
  MessageSquare,
  Settings,
  LifeBuoy,
  PanelLeft,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/utils'
import { useNotificationsQuery } from '../../hooks/useNotifications'
import { useJobsQuery } from '../../hooks/useJobs'
import { useCandidatesQuery } from '../../hooks/useCandidates'

function NavItem({ to, label, icon: Icon, badge, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-[11px] px-2.5 py-[9px] rounded-[7px] cursor-pointer mb-0.5 text-[13.5px] font-medium whitespace-nowrap overflow-hidden transition-colors duration-150',
          isActive ? 'bg-navy-tint text-navy font-semibold' : 'text-ink-secondary hover:bg-surface-hover hover:text-ink'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <motion.div layoutId="employer-nav-pill" className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[3px] bg-navy" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
          <Icon size={18} className="flex-shrink-0" />
          {!collapsed && <span className="flex-1 overflow-hidden text-ellipsis">{label}</span>}
          {!collapsed && !!badge && <span className="ml-auto text-[11px] font-bold bg-navy text-white rounded-full px-[7px] py-px">{badge}</span>}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen } = useApp()
  const [moreOpen, setMoreOpen] = useState(false)
  const { data: notifications } = useNotificationsQuery()
  const { data: jobs } = useJobsQuery()
  const { data: candidates } = useCandidatesQuery()
  const unreadCount = (notifications ?? []).filter((n) => n.unread).length
  const openJobsCount = (jobs ?? []).filter((j) => j.status === 'sourcing' || j.status === 'delivered').length
  const newCandidatesCount = (candidates ?? []).filter((c) => c.stage === 'shared').length

  const primary = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/jobs', label: 'Jobs', icon: Briefcase, badge: openJobsCount },
    { to: '/candidates', label: 'Applications', icon: Users, badge: newCandidatesCount },
    { to: '/resume-search', label: 'Resume Database', icon: Search },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/interviews', label: 'Interviews', icon: CalendarCheck },
    { to: '/cv-credits', label: 'Subscription & Credits', icon: Wallet },
    { to: '/company', label: 'Company Settings', icon: Building2 },
  ]

  const more = [
    { to: '/batches', label: 'Resume Batches', icon: Package },
    { to: '/talent-lens', label: 'Talent Lens', icon: Telescope },
    { to: '/offers', label: 'Offers', icon: FileCheck },
    { to: '/subscription', label: 'Subscription Plan', icon: Sparkles },
    { to: '/billing', label: 'Job Billing', icon: CreditCard },
    { to: '/team', label: 'Team Members', icon: Users2 },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside
      className={cn(
        'flex-shrink-0 border-r border-border bg-surface sticky top-16 h-[calc(100vh-64px)] overflow-y-auto flex flex-col p-3 transition-[width] duration-200 z-40',
        sidebarCollapsed ? 'w-[76px]' : 'w-[224px]',
        'max-lg:fixed max-lg:left-0 max-lg:top-16 max-lg:shadow-lg max-lg:transition-transform',
        mobileSidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'
      )}
    >
      <nav className="mb-1">
        {primary.map((it) => (
          <NavItem key={it.to} {...it} collapsed={sidebarCollapsed} />
        ))}
      </nav>

      <div className="mb-1">
        <button
          onClick={() => setMoreOpen((v) => !v)}
          className="w-full flex items-center gap-[11px] px-2.5 py-[9px] rounded-[7px] cursor-pointer text-[13.5px] font-medium text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors duration-150"
        >
          <MoreHorizontal size={18} className="flex-shrink-0" />
          {!sidebarCollapsed && <span className="flex-1 text-left">More</span>}
          {!sidebarCollapsed && <ChevronDown size={14} className={cn('transition-transform duration-150', moreOpen && 'rotate-180')} />}
        </button>
        {moreOpen && (
          <nav className="mt-0.5">
            {more.map((it) => (
              <NavItem key={it.to} {...it} collapsed={sidebarCollapsed} />
            ))}
          </nav>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-border">
        <NavItem to="/support" label="Help & Support" icon={LifeBuoy} collapsed={sidebarCollapsed} />
        <button onClick={() => setSidebarCollapsed((c) => !c)} className="hidden lg:flex items-center gap-2.5 px-2.5 py-2 rounded-[9px] text-ink-tertiary hover:bg-surface-hover hover:text-ink cursor-pointer text-[12.5px] w-full">
          <PanelLeft size={16} />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
