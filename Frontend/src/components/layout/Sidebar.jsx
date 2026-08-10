import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  User,
  FileText,
  Video,
  GraduationCap,
  Briefcase,
  ClipboardList,
  CalendarCheck,
  MessageSquare,
  Bell,
  CreditCard,
  Settings,
  LifeBuoy,
  LogOut,
  PanelLeft,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/utils'

const verification = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/profile', label: 'Profile', icon: User },
  { to: '/app/resume', label: 'Resume Center', icon: FileText },
  { to: '/app/interview', label: 'Mock Interview', icon: Video },
  { to: '/app/training', label: 'Training', icon: GraduationCap },
]
const placement = [
  { to: '/app/jobs', label: 'Job Openings', icon: Briefcase },
  { to: '/app/applications', label: 'My Applications', icon: ClipboardList },
  { to: '/app/interview-center', label: 'Interview Center', icon: CalendarCheck },
]
const account = [
  { to: '/app/messages', label: 'Placement Desk', icon: MessageSquare },
  { to: '/app/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { to: '/app/subscription', label: 'Subscription', icon: CreditCard },
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
            <motion.div layoutId="nav-pill" className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[3px] bg-gradient-to-b from-navy to-gold-dot" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
          )}
          <Icon size={18} className="flex-shrink-0 transition-transform duration-200 ease-out-premium group-hover:scale-110" />
          {!collapsed && <span className="flex-1 overflow-hidden text-ellipsis">{label}</span>}
          {!collapsed && badge && <span className="ml-auto text-[11px] font-bold bg-gold-tint text-gold-strong rounded-full px-[7px] py-px">{badge}</span>}
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

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useApp()

  return (
    <aside
      className={cn(
        'flex-shrink-0 border-r border-border bg-bg-secondary sticky top-16 h-[calc(100vh-64px)] overflow-y-auto flex flex-col p-3 transition-[width] duration-200 z-40',
        sidebarCollapsed ? 'w-[76px]' : 'w-[264px]',
        'max-lg:fixed max-lg:left-0 max-lg:top-16 max-lg:shadow-lg max-lg:transition-transform',
        mobileSidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'
      )}
    >
      <Group items={verification} collapsed={sidebarCollapsed} />
      <Group label="Placement" items={placement} collapsed={sidebarCollapsed} />
      <Group label="Account" items={account} collapsed={sidebarCollapsed} />

      <div className="mt-auto pt-3 border-t border-border">
        <NavItem to="/app/support" label="Support" icon={LifeBuoy} collapsed={sidebarCollapsed} />
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
