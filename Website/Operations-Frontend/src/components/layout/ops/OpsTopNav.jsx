import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Sun, Moon, ChevronDown, LogOut, ShieldCheck } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import Avatar from '../../ui/Avatar'
import FloatingPanel from '../../ui/FloatingPanel'
import Badge from '../../ui/Badge'
import { useMeQuery, logout as clearAuth } from '../../../hooks/useAuth'
import { useDashboardQuery } from '../../../hooks/useDashboard'

export default function OpsTopNav() {
  const { isDark, toggleTheme, avatarMenuOpen, setAvatarMenuOpen, setMobileSidebarOpen } = useApp()
  const navigate = useNavigate()
  const avatarRef = useRef(null)
  const { data: me } = useMeQuery()
  const { data: dash } = useDashboardQuery()

  function logout() {
    clearAuth()
    navigate('/login')
  }

  useEffect(() => {
    function onClick(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target) && !e.target.closest('[data-panel="avatar"]')) setAvatarMenuOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [setAvatarMenuOpen])

  const pending = (dash?.kpis?.resumeQueue ?? 0) + (dash?.kpis?.companyQueue ?? 0)

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-[60] flex items-center gap-4 px-5 bg-surface/90 backdrop-blur-xl border-b border-border">
      <button onClick={() => setMobileSidebarOpen((v) => !v)} className="lg:hidden w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover">
        <Menu size={18} />
      </button>
      <div className="flex items-center gap-[9px] font-bold text-base tracking-tight w-60 flex-shrink-0 max-lg:w-auto">
        <img src="/images/logo.png" alt="Mzobs" className="h-12 w-auto object-contain" />
        <span className="max-sm:hidden text-[10px] font-bold tracking-wide uppercase text-gold-strong bg-gold-tint px-1.5 py-[3px] rounded-md">Operations</span>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {pending > 0 && (
          <Badge tone="gold" className="max-md:hidden mr-1">
            {pending} items in queue
          </Badge>
        )}

        <button onClick={toggleTheme} title="Toggle theme" className="w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors">
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="w-px h-6 bg-border mx-1 max-sm:hidden" />

        <div ref={avatarRef} className="relative">
          <button
            onClick={() => setAvatarMenuOpen((v) => !v)}
            className="flex items-center gap-2 pr-2 pl-1 py-1 rounded-full cursor-pointer hover:bg-surface-hover"
          >
            <Avatar initials={me?.initials} />
            <ChevronDown size={14} className="text-ink-tertiary max-sm:hidden" />
          </button>
          <div data-panel="avatar">
            <FloatingPanel open={avatarMenuOpen} width={240}>
              <div className="px-4 py-3.5 border-b border-border">
                <div className="text-[13px] font-semibold">{me?.name}</div>
                <div className="text-xs text-ink-tertiary">{me?.role}</div>
                <div className="flex items-center gap-1 text-[11px] text-green font-semibold mt-1.5">
                  <ShieldCheck size={12} /> Mzobs admin account
                </div>
              </div>
              <div className="p-1.5">
                <div
                  onClick={() => {
                    setAvatarMenuOpen(false)
                    logout()
                  }}
                  className="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg cursor-pointer hover:bg-surface-hover text-[13px] text-red"
                >
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
