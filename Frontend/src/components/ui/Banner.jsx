import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

const tones = {
  navy: { wrap: 'bg-navy-tint border-navy-ring/40 text-navy', icon: Info },
  gold: { wrap: 'bg-gold-tint border-gold-dot/30 text-gold-strong', icon: AlertTriangle },
  green: { wrap: 'bg-green-tint border-green-dot/30 text-green', icon: CheckCircle2 },
  red: { wrap: 'bg-red-tint border-red-dot/30 text-red', icon: XCircle },
}

export default function Banner({ tone = 'navy', title, body, action, className }) {
  const t = tones[tone]
  const Icon = t.icon
  return (
    <div className={cn('flex items-start gap-3 rounded-xl border px-4 py-3.5', t.wrap, className)}>
      <Icon size={17} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <div className="text-[13.5px] font-semibold text-ink">{title}</div>}
        {body && <div className="text-[13px] text-ink-secondary mt-0.5">{body}</div>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
