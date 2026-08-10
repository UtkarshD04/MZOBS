import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Briefcase, CalendarCheck, CreditCard, FileCheck, Package, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { PillTabs } from '../components/ui/Tabs'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { CardListSkeleton } from '../components/ui/Skeleton'
import { useMarkAllRead, useMarkAsRead, useNotificationsQuery } from '../hooks/useNotifications'
import { cn } from '../lib/utils'
import type { NotificationCategory } from '../types'

const CATEGORY_META: Record<NotificationCategory, { icon: LucideIcon; tone: string }> = {
  candidates: { icon: Users, tone: 'navy' },
  batches: { icon: Package, tone: 'teal' },
  interviews: { icon: CalendarCheck, tone: 'gold' },
  offers: { icon: FileCheck, tone: 'green' },
  billing: { icon: CreditCard, tone: 'amber' },
  jobs: { icon: Briefcase, tone: 'violet' },
  system: { icon: Bell, tone: 'gray' },
}

const ROUTE_BY_CATEGORY: Record<NotificationCategory, string> = {
  candidates: '/candidates',
  batches: '/batches',
  interviews: '/interviews',
  offers: '/offers',
  billing: '/billing',
  jobs: '/jobs',
  system: '/settings',
}

const TABS: { label: string; value: NotificationCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Resume Batches', value: 'batches' },
  { label: 'Requirements', value: 'jobs' },
  { label: 'Interviews', value: 'interviews' },
  { label: 'Offers', value: 'offers' },
  { label: 'Billing', value: 'billing' },
]

export default function Notifications() {
  const navigate = useNavigate()
  const { data: notifications = [], isLoading, isError, refetch } = useNotificationsQuery()
  const markAsRead = useMarkAsRead()
  const markAllRead = useMarkAllRead()
  const [tab, setTab] = useState(0)

  const category = TABS[tab]!.value
  const filtered = useMemo(() => (category === 'all' ? notifications : notifications.filter((n) => n.category === category)), [notifications, category])
  const unreadCount = notifications.filter((n) => n.unread).length

  function targetFor(category: NotificationCategory) {
    return ROUTE_BY_CATEGORY[category]
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.` : "You're all caught up."}
        actions={
          unreadCount > 0 && (
            <Button variant="secondary" onClick={() => markAllRead.mutate()}>
              Mark all as read
            </Button>
          )
        }
      />

      <Card className="mb-5">
        <div className="px-[22px] py-4">
          <PillTabs items={TABS.map((t) => t.label)} active={tab} onChange={setTab} />
        </div>
      </Card>

      {isLoading ? (
        <CardListSkeleton count={5} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Bell} title="Nothing here yet" body="You'll be notified about new candidates, interviews, offers and billing updates." />
        </Card>
      ) : (
        <Card>
          {filtered.map((n) => {
            const meta = CATEGORY_META[n.category]
            return (
              <button
                key={n.id}
                onClick={() => {
                  if (n.unread) markAsRead.mutate(n.id)
                  navigate(targetFor(n.category))
                }}
                className={cn('flex w-full items-start gap-3.5 px-[22px] py-4 border-b border-border last:border-b-0 text-left hover:bg-surface-hover transition-colors', n.unread && 'bg-navy-tint/30')}
              >
                <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `var(--color-${meta.tone}-tint)`, color: `var(--color-${meta.tone === 'gray' ? 'ink-secondary' : meta.tone})` }}>
                  <meta.icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold">{n.title}</span>
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-gold-dot flex-shrink-0" />}
                  </div>
                  <div className="text-[12.5px] text-ink-secondary mt-0.5">{n.body}</div>
                  <div className="text-[11.5px] text-ink-tertiary mt-1">{n.time}</div>
                </div>
              </button>
            )
          })}
        </Card>
      )}
    </div>
  )
}
