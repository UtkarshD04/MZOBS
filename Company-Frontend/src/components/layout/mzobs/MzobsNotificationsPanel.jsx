import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { NOTIFS_OPS } from '../../../lib/mzobsData'
import { useApp } from '../../../context/AppContext'

const toneClass = { navy: 'bg-navy-tint text-navy', gold: 'bg-gold-tint text-gold-strong', green: 'bg-green-tint text-green' }

const ROUTE_BY_CAT = {
  resumes: '/app/resumes',
  companies: '/app/companies',
  payments: '/app/payments',
  batches: '/app/dispatch',
  interviews: '/app/mock-interviews',
}

export default function MzobsNotificationsPanel({ onNavigate }) {
  const navigate = useNavigate()
  const { addToast } = useApp()

  return (
    <>
      <div className="flex items-center justify-between px-[18px] py-[15px] border-b border-border flex-shrink-0">
        <span className="text-[15px] font-semibold">Operations alerts</span>
        <span
          onClick={() => {
            addToast('success', 'All alerts marked as read')
            onNavigate?.()
          }}
          className="text-navy font-semibold text-xs cursor-pointer hover:underline"
        >
          Mark all read
        </span>
      </div>
      <div className="overflow-y-auto">
        {NOTIFS_OPS.map((n, i) => {
          const Icon = Icons[n.ic]
          return (
            <div
              key={i}
              onClick={() => {
                navigate(ROUTE_BY_CAT[n.cat] || '/app/dashboard')
                onNavigate?.()
              }}
              className="flex gap-[11px] px-4 py-[13px] border-b border-border last:border-b-0 cursor-pointer hover:bg-surface-hover"
            >
              <div className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${toneClass[n.tone]}`}>
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
        })}
      </div>
      <div className="px-[18px] py-3 border-t border-border flex-shrink-0">
        <span
          onClick={() => {
            navigate('/app/dashboard')
            onNavigate?.()
          }}
          className="text-navy font-semibold text-[12.5px] cursor-pointer hover:underline"
        >
          Go to operations dashboard
        </span>
      </div>
    </>
  )
}
