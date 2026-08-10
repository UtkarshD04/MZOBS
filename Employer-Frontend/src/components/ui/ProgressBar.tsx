import { cn } from '../../lib/utils'

export default function ProgressBar({ value, max = 100, tone = 'navy', className, trackClassName }: { value: number; max?: number; tone?: 'navy' | 'gold' | 'green'; className?: string; trackClassName?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const toneClass = { navy: 'bg-navy', gold: 'bg-gold-dot', green: 'bg-green-dot' }[tone]
  return (
    <div className={cn('h-1.5 w-full rounded-full bg-surface-sunken overflow-hidden', trackClassName)}>
      <div className={cn('h-full rounded-full transition-[width] duration-500 ease-out-premium', toneClass, className)} style={{ width: `${pct}%` }} />
    </div>
  )
}
