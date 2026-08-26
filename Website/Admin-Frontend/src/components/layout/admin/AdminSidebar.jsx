import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, FileCheck, Video, Inbox, Contact, Building2, Briefcase, Star, LifeBuoy, LogOut, PanelLeft, IndianRupee, UserCog, Trophy, TrendingUp, Ticket, Send, Users, ClipboardList, Landmark } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import { cn } from '../../../lib/utils'
import { useDashboardQuery } from '../../../hooks/useDashboard'
import { logout as clearAuth } from '../../../hooks/useAuth'

function NavItem({ to, label, icon: Icon, badge, collapsed }) {
  return (
    <NavLink
      to={to}
      end
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
            <motion.div layoutId="admin-nav-pill" className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[3px] bg-gradient-to-b from-navy to-gold-dot" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
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

export default function AdminSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen } = useApp()
  const navigate = useNavigate()
  const { data: dash } = useDashboardQuery()
  const kpis = dash?.kpis ?? {}

  const items = [
    { to: '/app', label: 'Overview', icon: LayoutDashboard },
    { to: '/app/resumes', label: 'Resumes', icon: Inbox, badge: kpis.resumeQueue },
    { to: '/app/resume-stats', label: 'Resume Stats', icon: FileCheck },
    { to: '/app/mock-interviews', label: 'Mock Interviews', icon: Video },
    { to: '/app/hr-contacts', label: 'HR Contacts', icon: Contact },
    { to: '/app/companies', label: 'Companies', icon: Building2, badge: kpis.companyQueue },
    { to: '/app/employees', label: 'Employees', icon: Users },
    { to: '/app/requirements', label: 'Requirements', icon: Briefcase },
    { to: '/app/applications', label: 'Applications', icon: ClipboardList },
    { to: '/app/shortlisted', label: 'Shortlisted', icon: Star },
    { to: '/app/placements', label: 'Placements', icon: Trophy },
    { to: '/app/queries', label: 'Queries', icon: LifeBuoy },
  ]

  const controlItems = [
    { to: '/app/payments', label: 'Payments', icon: IndianRupee },
    { to: '/app/coupons', label: 'Coupons', icon: Ticket },
    { to: '/app/subscriptions', label: 'Subscriptions', icon: TrendingUp },
    { to: '/app/employer-revenue', label: 'Employer Revenue', icon: Landmark },
    { to: '/app/team', label: 'Staff Accounts', icon: UserCog },
    { to: '/app/notifications/send', label: 'Send Notification', icon: Send },
  ]

  function logout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <aside
      className={cn(
        'flex-shrink-0 border-r border-border bg-bg-secondary sticky top-16 h-[calc(100vh-64px)] overflow-y-auto flex flex-col p-3 transition-[width] duration-200 z-40',
        sidebarCollapsed ? 'w-[76px]' : 'w-[264px]',
        'max-lg:fixed max-lg:left-0 max-lg:top-16 max-lg:shadow-lg max-lg:transition-transform',
        mobileSidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'
      )}
    >
      <Group label="Workspace" items={items} collapsed={sidebarCollapsed} />
      <Group label="Controls" items={controlItems} collapsed={sidebarCollapsed} />

      <div className="mt-auto pt-3 border-t border-border">
        <div onClick={logout} className="flex items-center gap-[11px] px-2.5 py-[9px] rounded-[9px] cursor-pointer mb-0.5 text-[13.5px] font-medium text-ink-secondary hover:bg-surface-hover hover:text-ink">
          <LogOut size={18} className="flex-shrink-0" />
          {!sidebarCollapsed && <span>Log out</span>}
        </div>
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
