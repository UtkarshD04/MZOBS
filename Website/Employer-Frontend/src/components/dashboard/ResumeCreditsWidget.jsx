import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Wallet } from 'lucide-react'
import Card, { CardBody, CardHead, CardTitle } from '../ui/Card'
import Button from '../ui/Button'
import { fmtDate } from '../../lib/utils'

export const LOW_CREDIT_THRESHOLD = 5

export default function ResumeCreditsWidget({ wallet, subscription }) {
  const navigate = useNavigate()
  const remaining = wallet?.remainingCredits ?? 0
  const total = wallet?.totalCredits ?? 0
  const used = wallet?.usedCredits ?? 0
  const usedPct = total > 0 ? Math.round((used / total) * 100) : 0
  const low = remaining <= LOW_CREDIT_THRESHOLD

  return (
    <Card>
      <CardHead>
        <CardTitle>Resume credits</CardTitle>
        <span className="w-8 h-8 rounded-lg bg-navy-tint text-navy flex items-center justify-center">
          <Wallet size={15} />
        </span>
      </CardHead>
      <CardBody>
        <div className="flex items-end gap-2">
          <span className="text-[32px] font-bold tracking-tight tabular-nums text-ink">{remaining}</span>
          <span className="pb-1 text-[13px] text-ink-secondary">credit{remaining === 1 ? '' : 's'} available</span>
        </div>

        {total > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-[11.5px] text-ink-tertiary">
              <span>{used} used</span>
              <span>{total} purchased</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-surface-sunken overflow-hidden" role="progressbar" aria-valuenow={usedPct} aria-valuemin={0} aria-valuemax={100} aria-label="Resume credits used">
              <div className={low ? 'h-full rounded-full bg-amber' : 'h-full rounded-full bg-navy'} style={{ width: `${usedPct}%` }} />
            </div>
          </div>
        )}

        <p className="text-[12px] text-ink-tertiary mt-3 leading-relaxed">Unlock one candidate's email and phone details with one credit.</p>

        {low && (
          <div className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-lg bg-amber-tint text-amber text-[12px] font-medium">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            {remaining === 0 ? 'You are out of resume credits.' : `Running low — only ${remaining} credit${remaining === 1 ? '' : 's'} left.`}
          </div>
        )}

        {subscription?.planName && (
          <div className="text-[12px] text-ink-secondary mt-3 pt-3 border-t border-border">
            Plan: <span className="font-semibold text-ink">{subscription.planName}</span>
            {subscription.expiresAt && <span> · expires {fmtDate(subscription.expiresAt)}</span>}
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <Button variant="primary" size="sm" onClick={() => navigate('/cv-credits')}>
            Buy credits
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/cv-credits')}>
            View history
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
