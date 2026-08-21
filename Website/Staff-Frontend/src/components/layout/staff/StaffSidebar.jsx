import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, FileCheck, LogOut, PanelLeft } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import { cn } from '../../../lib/utils'
import { logout as clearAuth } from '../../../hooks/useAuth'

function NavItem({ to, label, icon: Icon, collapsed }) {
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
            <motion.div layoutId="staff-nav-pill" className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[3px] bg-gradient-to-b from-navy to-gold-dot" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
          )}
          <Icon size={18} className="flex-shrink-0 transition-transform duration-200 ease-out-premium group-hover:scale-110" />
          {!collapsed && <span className="flex-1 overflow-hidden text-ellipsis">{label}</span>}
        </>
      )}
    </NavLink>
  )
}

export default function StaffSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen } = useApp()
  const navigate = useNavigate()

  const items = [
    { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/app/my-resumes', label: 'My Resumes', icon: FileCheck },
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
      <nav className="mb-[18px]">
        {items.map((it) => (
          <NavItem key={it.to} {...it} collapsed={sidebarCollapsed} />
        ))}
      </nav>

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
