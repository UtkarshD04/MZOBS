import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Menu as MenuIcon, Search, Sun, Moon, MessageSquare, Bell, ChevronDown, Building2, Settings, CreditCard, LifeBuoy, Plus, Check, ShieldCheck, MailOpen, LogOut } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import CommandPalette from './CommandPalette'
import { useNotificationsQuery, useMarkAllRead } from '../../hooks/useNotifications'
import { useCompanyQuery } from '../../hooks/useCompany'
import { useMeQuery } from '../../hooks/useMe'
import { logout } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

export default function TopNavbar() {
  const { isDark, toggleTheme, setMobileSidebarOpen, cmdkOpen, setCmdkOpen } = useApp()
  const navigate = useNavigate()
  const { data: notifications = [] } = useNotificationsQuery()
  const markAllRead = useMarkAllRead()
  const unread = notifications.filter((n) => n.unread).length
  const { data: company } = useCompanyQuery()
  const { data: me } = useMeQuery()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-[60] flex items-center gap-4 px-5 bg-surface/90 backdrop-blur-xl border-b border-border">
      <button onClick={() => setMobileSidebarOpen((v) => !v)} className="lg:hidden w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover">
        <MenuIcon size={18} />
      </button>
      <div className="flex items-center gap-[9px] font-bold text-base tracking-tight w-60 flex-shrink-0 max-lg:w-auto">
        <img src="/images/logo.png" alt="Mzobs" className="h-12 w-auto object-contain" />
        <span className="max-sm:hidden text-[10px] font-bold tracking-wide uppercase text-navy bg-navy-tint px-1.5 py-[3px] rounded-md">for Business</span>
      </div>

      <button
        onClick={() => setCmdkOpen(true)}
        className="flex-1 max-w-[420px] flex items-center gap-2.5 h-[38px] px-3 bg-surface-sunken border border-transparent rounded-[10px] text-ink-tertiary cursor-pointer hover:border-border-strong transition-colors max-sm:flex-none max-sm:w-9 max-sm:justify-center max-sm:px-0"
      >
        <Search size={16} />
        <span className="text-[13px] flex-1 text-left max-sm:hidden">Search candidates, jobs, requisitions…</span>
        <span className="text-[11px] font-semibold text-ink-tertiary bg-surface border border-border rounded-md px-1.5 py-0.5 max-sm:hidden">⌘K</span>
      </button>
      <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} />

      <div className="flex items-center gap-1.5 ml-auto">
        <Button variant="primary" size="sm" className="max-sm:hidden" onClick={() => navigate('/jobs/new')}>
          <Plus size={15} /> New Requirement
        </Button>

        <button onClick={toggleTheme} title="Toggle theme" className="w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors">
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          onClick={() => toast('No new messages yet — candidate conversations will appear here.', { icon: '💬' })}
          title="Messages"
          className="relative w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors"
        >
          <MessageSquare size={18} />
        </button>

        <button onClick={() => navigate('/support')} title="Help & Support" className="w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors max-sm:hidden">
          <LifeBuoy size={18} />
        </button>

        <Popover className="relative">
          <PopoverButton title="Notifications" className="relative w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors">
            <Bell size={18} />
            {unread > 0 && <span className="notif-dot absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-dot border-2 border-surface" />}
          </PopoverButton>
          <PopoverPanel
            transition
            anchor="bottom end"
            className="z-[80] w-[380px] rounded-2xl border border-border bg-surface shadow-lg overflow-hidden transition duration-150 ease-out-premium data-[closed]:opacity-0 data-[closed]:translate-y-1 [--anchor-gap:10px]"
          >
            {({ close }) => (
              <>
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                  <span className="text-[13.5px] font-semibold">Notifications</span>
                  {unread > 0 && (
                    <button onClick={() => markAllRead.mutate()} className="text-[12px] font-semibold text-navy hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <EmptyState icon={Bell} title="You're all caught up" body="New candidate and interview updates will show up here." />
                ) : (
                  <div className="max-h-[380px] overflow-y-auto">
                    {notifications.slice(0, 5).map((n) => (
                      <div key={n.id} className={cn('flex gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-surface-hover', n.unread && 'bg-navy-tint/40')}>
                        <span className="w-8 h-8 rounded-lg bg-navy-tint text-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MailOpen size={14} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold truncate">{n.title}</div>
                          <div className="text-[12px] text-ink-secondary line-clamp-2 mt-0.5">{n.body}</div>
                          <div className="text-[11px] text-ink-tertiary mt-1">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => {
                    navigate('/notifications')
                    close()
                  }}
                  className="w-full text-center text-[12.5px] font-semibold text-navy py-3 border-t border-border hover:bg-surface-hover"
                >
                  View all notifications
                </button>
              </>
            )}
          </PopoverPanel>
        </Popover>

        <div className="w-px h-6 bg-border mx-1 max-sm:hidden" />

        <div className="relative max-sm:hidden">
          <Popover>
            <PopoverButton className="flex items-center gap-2 pl-1.5 pr-2 h-9 rounded-[10px] cursor-pointer hover:bg-surface-hover">
              <div className="w-6 h-6 rounded-md bg-navy-tint text-navy flex items-center justify-center text-[10px] font-bold flex-shrink-0">{company?.logo}</div>
              <span className="text-[13px] font-semibold max-w-[130px] truncate">{company?.name}</span>
              <ChevronDown size={13} className="text-ink-tertiary" />
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom end"
              className="z-[80] w-[260px] rounded-2xl border border-border bg-surface shadow-lg overflow-hidden transition duration-150 ease-out-premium data-[closed]:opacity-0 data-[closed]:translate-y-1 [--anchor-gap:10px]"
            >
              <div className="px-4 py-3 border-b border-border text-[11px] font-semibold tracking-wide uppercase text-ink-tertiary">Your companies</div>
              <div className="p-1.5">
                <div className="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg bg-navy-tint text-navy text-[13px] font-semibold">
                  <div className="w-7 h-7 rounded-md bg-surface text-navy flex items-center justify-center text-[11px] font-bold flex-shrink-0">{company?.logo}</div>
                  <span className="flex-1 truncate">{company?.name}</span>
                  <Check size={15} />
                </div>
                <button onClick={() => toast.success('You only have one company workspace right now.')} className="flex w-full items-center gap-2.5 px-2.5 py-[9px] rounded-lg cursor-pointer hover:bg-surface-hover text-[13px] text-navy font-semibold">
                  <Plus size={16} />
                  <span>Add another company</span>
                </button>
              </div>
            </PopoverPanel>
          </Popover>
        </div>

        <Popover className="relative">
          <PopoverButton className="flex items-center gap-2 pr-2 pl-1 py-1 rounded-full cursor-pointer hover:bg-surface-hover">
            <Avatar initials={me?.initials} />
            <ChevronDown size={14} className="text-ink-tertiary max-sm:hidden" />
          </PopoverButton>
          <PopoverPanel
            transition
            anchor="bottom end"
            className="z-[80] w-60 rounded-2xl border border-border bg-surface shadow-lg overflow-hidden transition duration-150 ease-out-premium data-[closed]:opacity-0 data-[closed]:translate-y-1 [--anchor-gap:10px]"
          >
            {({ close }) => (
              <>
                <div className="px-4 py-3.5 border-b border-border">
                  <div className="text-[13px] font-semibold">{me?.name}</div>
                  <div className="text-xs text-ink-tertiary">{me?.role}</div>
                  {company?.verificationStatus === 'verified' && (
                    <div className="flex items-center gap-1 text-[11px] text-green font-semibold mt-1.5">
                      <ShieldCheck size={12} /> Company verified
                    </div>
                  )}
                </div>
                <div className="p-1.5">
                  {[
                    ['/company', Building2, 'Company Profile'],
                    ['/settings', Settings, 'Settings'],
                    ['/billing', CreditCard, 'Billing'],
                    ['/support', LifeBuoy, 'Support'],
                  ].map(([to, Icon, label]) => (
                    <button
                      key={to}
                      onClick={() => {
                        navigate(to)
                        close()
                      }}
                      className="flex w-full items-center gap-2.5 px-2.5 py-[9px] rounded-lg cursor-pointer hover:bg-surface-hover text-[13px]"
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <div className="p-1.5 border-t border-border">
                  <button
                    onClick={() => {
                      logout()
                      navigate('/')
                      close()
                    }}
                    className="flex w-full items-center gap-2.5 px-2.5 py-[9px] rounded-lg cursor-pointer hover:bg-surface-hover text-[13px] text-red"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            )}
          </PopoverPanel>
        </Popover>
      </div>
    </header>
  )
}
