import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Sun, Moon, MessageSquare, Bell, ChevronDown, User, Settings, CreditCard, LifeBuoy, LogOut } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Avatar from '../ui/Avatar'
import FloatingPanel from '../ui/FloatingPanel'
import NotificationsPanel from './NotificationsPanel'
import { useProfileQuery } from '../../hooks/useProfile'
import { EMPLOYEE_SIGNIN_URL } from '../../lib/config'

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function TopNav() {
  const { isDark, toggleTheme, setCmdkOpen, drawerOpen, setDrawerOpen, avatarMenuOpen, setAvatarMenuOpen, setMobileSidebarOpen } = useApp()
  const navigate = useNavigate()
  const bellRef = useRef(null)
  const avatarRef = useRef(null)
  const { data: profile } = useProfileQuery()

  function logout() {
    localStorage.removeItem('mzobs-employee-token')
    window.location.href = EMPLOYEE_SIGNIN_URL
  }

  useEffect(() => {
    function onClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target) && !e.target.closest('[data-panel="notif"]')) setDrawerOpen(false)
      if (avatarRef.current && !avatarRef.current.contains(e.target) && !e.target.closest('[data-panel="avatar"]')) setAvatarMenuOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [setDrawerOpen, setAvatarMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-[60] flex items-center gap-4 px-5 bg-surface/90 backdrop-blur-xl border-b border-border">
      <button onClick={() => setMobileSidebarOpen((v) => !v)} className="lg:hidden w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover">
        <Menu size={18} />
      </button>
      <div className="flex items-center gap-[9px] font-bold text-base tracking-tight w-60 flex-shrink-0 max-lg:w-auto">
        <img src="/images/logo.png" alt="Mzobs" className="h-12 w-auto object-contain" />
      </div>

      <button
        onClick={() => setCmdkOpen(true)}
        className="flex-1 max-w-[420px] flex items-center gap-2.5 h-[38px] px-3 bg-surface-sunken border border-transparent rounded-[10px] text-ink-tertiary cursor-pointer hover:border-border-strong transition-colors max-sm:flex-none max-sm:w-9 max-sm:justify-center max-sm:px-0"
      >
        <Search size={16} />
        <span className="text-[13px] flex-1 text-left max-sm:hidden">Search jobs, companies, courses…</span>
        <span className="text-[11px] font-semibold text-ink-tertiary bg-surface border border-border rounded-md px-1.5 py-0.5 max-sm:hidden">⌘K</span>
      </button>

      <div className="flex items-center gap-1.5 ml-auto">
        <button onClick={toggleTheme} title="Toggle theme" className="w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors">
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button onClick={() => navigate('/app/messages')} title="Messages" className="relative w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors">
          <MessageSquare size={18} />
          <span className="notif-dot absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-dot border-2 border-surface" />
        </button>
        <div ref={bellRef} className="relative">
          <button
            onClick={() => {
              setDrawerOpen((v) => !v)
              setAvatarMenuOpen(false)
            }}
            title="Notifications"
            className="relative w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors"
          >
            <Bell size={18} />
            <span className="notif-dot absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-dot border-2 border-surface" />
          </button>
          <div data-panel="notif">
            <FloatingPanel open={drawerOpen} width={380}>
              <NotificationsPanel onNavigate={() => setDrawerOpen(false)} />
            </FloatingPanel>
          </div>
        </div>
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => {
              setAvatarMenuOpen((v) => !v)
              setDrawerOpen(false)
            }}
            className="flex items-center gap-2 pr-2 pl-1 py-1 rounded-full cursor-pointer hover:bg-surface-hover"
          >
            <Avatar initials={initialsOf(profile?.name)} />
            <ChevronDown size={14} className="text-ink-tertiary" />
          </button>
          <div data-panel="avatar">
            <FloatingPanel open={avatarMenuOpen} width={230}>
              <div className="px-4 py-3.5 border-b border-border">
                <div className="text-[13px] font-semibold">{profile?.name}</div>
                <div className="text-xs text-ink-tertiary">{profile?.email}</div>
              </div>
              <div className="p-1.5">
                {[
                  ['/app/profile', User, 'View Profile'],
                  ['/app/settings', Settings, 'Settings'],
                  ['/app/subscription', CreditCard, 'Subscription'],
                  ['/app/support', LifeBuoy, 'Support'],
                ].map(([to, Icon, label]) => (
                  <div
                    key={to}
                    onClick={() => {
                      navigate(to)
                      setAvatarMenuOpen(false)
                    }}
                    className="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg cursor-pointer hover:bg-surface-hover text-[13px]"
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </div>
                ))}
                <div className="h-px bg-border my-1.5" />
                <div onClick={logout} className="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg cursor-pointer hover:bg-surface-hover text-[13px] text-red">
                  <LogOut size={16} />
                  <span>Log out</span>
                </div>
              </div>
            </FloatingPanel>
          </div>
        </div>
      </div>
    </header>
  )
}
