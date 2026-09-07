import { Fragment } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

// Three-step progress indicator for the employee signup wizard. Full
// labelled row on tablet/desktop, a compact "Step X of N" line on mobile
// where a 3-node row would be cramped next to real labels.
export default function StepProgress({ steps, current }) {
  return (
    <div className="mb-7">
      <div className="hidden sm:flex items-center overflow-x-hidden">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const done = stepNum < current
          const active = stepNum === current
          return (
            <Fragment key={label}>
              <div className="flex items-center gap-1.5 shrink-0">
                <div
                  className={cn(
                    'flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 transition-colors duration-200',
                    done && 'bg-(--jobs-teal-dark) text-white',
                    active && 'bg-(--jobs-blue) text-white',
                    !done && !active && 'bg-(--jobs-bg-subtle) text-(--jobs-ink-soft) border border-(--jobs-border)'
                  )}
                >
                  {done ? <Check size={11} strokeWidth={2.5} /> : stepNum}
                </div>
                <span
                  className={cn(
                    'text-[11px] font-semibold whitespace-nowrap',
                    active ? 'text-(--jobs-navy)' : done ? 'text-(--jobs-teal-dark)' : 'text-(--jobs-ink-soft)'
                  )}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('h-px flex-1 min-w-3 mx-1.5 transition-colors duration-200', done ? 'bg-(--jobs-teal-dark)' : 'bg-(--jobs-border)')} />
              )}
            </Fragment>
          )
        })}
      </div>

      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12.5px] font-bold text-(--jobs-navy)">{steps[current - 1]}</span>
          <span className="text-[11.5px] font-semibold text-(--jobs-ink-soft)">
            Step {current} of {steps.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-(--jobs-bg-subtle) overflow-hidden">
          <div
            className="h-full rounded-full bg-(--jobs-blue) transition-all duration-300"
            style={{ width: `${(current / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
