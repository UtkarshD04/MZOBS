import { cn } from '../../lib/utils'

export function Tabs({ items, active, onChange, className }) {
  return (
    <div className={cn('flex gap-1 border-b border-border overflow-x-auto', className)}>
      {items.map((t, i) => (
        <div
          key={t}
          onClick={() => onChange(i)}
          className={cn(
            'py-[11px] px-1 mr-[22px] text-[13.5px] font-semibold cursor-pointer border-b-2 whitespace-nowrap transition-colors duration-200',
            i === active ? 'text-navy border-navy' : 'text-ink-tertiary border-transparent hover:text-ink'
          )}
        >
          {t}
        </div>
      ))}
    </div>
  )
}

export function PillTabs({ items, active, onChange, className }) {
  return (
    <div className={cn('inline-flex gap-[3px] bg-surface-sunken p-[3px] rounded-[10px]', className)}>
      {items.map((t, i) => (
        <div
          key={t}
          onClick={() => onChange(i)}
          className={cn(
            'px-[14px] py-[7px] text-[12.5px] font-semibold rounded-[8px] cursor-pointer transition-all duration-150',
            i === active ? 'bg-surface text-navy shadow-xs' : 'text-ink-secondary'
          )}
        >
          {t}
        </div>
      ))}
    </div>
  )
}
