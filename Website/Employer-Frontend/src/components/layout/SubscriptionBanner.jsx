import { useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { useAccessStatusQuery } from '../../hooks/useSubscription'

// Unobtrusive, dismissible-per-session banner shown app-wide whenever the
// employer plan is inactive/expired/never purchased — nudges toward
// /subscription without blocking read-only use of the rest of the dashboard.
export default function SubscriptionBanner() {
  const { data: access, isLoading } = useAccessStatusQuery()
  const navigate = useNavigate()
  const location = useLocation()
  const [dismissed, setDismissed] = useState(false)

  if (isLoading || !access || access.active || dismissed || location.pathname === '/subscription') return null

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-tint text-ink border border-amber/25 mb-5 flex-wrap">
      <AlertTriangle size={16} className="text-amber flex-shrink-0" />
      <span className="text-[12.5px] font-medium flex-1 min-w-[220px]">
        Your employer plan is inactive. Renew to post jobs and view applicant resumes.
      </span>
      <button onClick={() => navigate('/subscription')} className="text-[12.5px] font-semibold text-navy hover:underline flex-shrink-0">
        Renew now
      </button>
      <button onClick={() => setDismissed(true)} className="w-6 h-6 rounded-md flex items-center justify-center text-ink-tertiary hover:bg-surface-hover hover:text-ink flex-shrink-0">
        <X size={14} />
      </button>
    </div>
  )
}
