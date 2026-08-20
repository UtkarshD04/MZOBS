import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { CATEGORY_META, NOTIFICATION_TONE_CLASS as toneClass } from '../../lib/notificationMeta'
import { useNotificationsQuery, useMarkAllNotificationsReadMutation } from '../../hooks/useNotifications'
import { useApp } from '../../context/AppContext'

export default function NotificationsPanel({ onNavigate }) {
  const navigate = useNavigate()
  const { addToast } = useApp()
  const { data: notifications = [] } = useNotificationsQuery()
  const markAllRead = useMarkAllNotificationsReadMutation()

  return (
    <>
      <div className="flex items-center justify-between px-[18px] py-[15px] border-b border-border flex-shrink-0">
        <span className="text-[15px] font-semibold">Notifications</span>
        <span
          onClick={() => {
            markAllRead.mutate(undefined, { onSuccess: () => addToast('success', 'All notifications marked as read') })
            onNavigate?.()
          }}
          className="text-navy font-semibold text-xs cursor-pointer hover:underline"
        >
          Mark all read
        </span>
      </div>
      <div className="overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-ink-tertiary">You're all caught up.</div>
        ) : (
          notifications.slice(0, 5).map((n) => {
            const meta = CATEGORY_META[n.category] ?? CATEGORY_META.system
            const Icon = Icons[meta.ic]
            return (
              <div key={n.id} className="flex gap-[11px] px-4 py-[13px] border-b border-border last:border-b-0 cursor-pointer hover:bg-surface-hover">
                <div className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${toneClass[meta.tone]}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold">{n.title}</span>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-gold-dot flex-shrink-0" />}
                  </div>
                  <div className="text-xs text-ink-tertiary mt-1">{n.body}</div>
                  <div className="text-xs text-ink-tertiary mt-1">{n.time}</div>
                </div>
              </div>
            )
          })
        )}
      </div>
      <div className="px-[18px] py-3 border-t border-border flex-shrink-0">
        <span
          onClick={() => {
            navigate('/app/notifications')
            onNavigate?.()
          }}
          className="text-navy font-semibold text-[12.5px] cursor-pointer hover:underline"
        >
          View all notifications
        </span>
      </div>
    </>
  )
}
