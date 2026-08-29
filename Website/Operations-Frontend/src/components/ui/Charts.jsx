import { cn } from '../../lib/utils'

export function HBarList({ data, tone = 'navy', className }) {
  const max = Math.max(...data.map((d) => d.value))
  const fillTone = { navy: 'bg-navy', gold: 'bg-gold-dot' }[tone]
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {data.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-[12.5px] text-ink-secondary w-[104px] flex-shrink-0 truncate">{d.label}</span>
          <div className="flex-1 h-2 rounded-full bg-surface-sunken overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-[width] duration-700 ease-out', i === 0 ? 'bg-gold-dot' : fillTone)}
              style={{ width: `${max ? (d.value / max) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[12.5px] font-semibold w-7 text-right flex-shrink-0 tabular-nums">{d.value}</span>
        </div>
      ))}
    </div>
  )
}
