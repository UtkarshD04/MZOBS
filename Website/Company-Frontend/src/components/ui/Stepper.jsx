import { Check, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Stepper({ steps }) {
  // steps: [{ label, state: 'done'|'current'|'rejected'|'', icon? }]
  return (
    <div className="flex items-start flex-wrap gap-y-4">
      {steps.map((s, i) => (
        <div key={i} className="flex flex-col items-center text-center flex-1 relative min-w-[76px] basis-1/3 md:basis-0">
          {i > 0 && (
            <div
              className={cn(
                'absolute top-[15px] h-0.5 -z-0',
                s.state === 'done' ? 'bg-navy' : 'bg-border-strong',
                'hidden md:block'
              )}
              style={{ left: 'calc(-50% + 15px)', right: 'calc(50% + 15px)' }}
            />
          )}
          <div
            className={cn(
              'w-[30px] h-[30px] rounded-full flex items-center justify-center border-2 text-[12px] font-bold z-10 transition-all duration-300',
              s.state === 'done' && 'bg-navy border-navy text-white',
              s.state === 'current' && 'bg-gold-tint border-gold-dot text-gold-strong shadow-[0_0_0_4px_var(--color-gold-tint)]',
              s.state === 'rejected' && 'bg-red-tint border-red text-red',
              !s.state && 'bg-surface-sunken border-border-strong text-ink-tertiary'
            )}
          >
            {s.state === 'done' ? <Check size={14} /> : s.state === 'rejected' ? <X size={14} /> : s.icon ? <s.icon size={14} /> : i + 1}
          </div>
          <div className={cn('text-[11px] font-semibold mt-2 max-w-[84px] leading-tight', s.state === 'done' || s.state === 'current' ? 'text-ink' : 'text-ink-secondary')}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}
