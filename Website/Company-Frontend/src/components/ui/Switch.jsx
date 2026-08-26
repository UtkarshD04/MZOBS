import { cn } from '../../lib/utils'

export default function Switch({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!on)}
      className={cn(
        'w-[38px] h-[22px] rounded-full relative flex-shrink-0 transition-colors duration-200 border-0 cursor-pointer',
        on ? 'bg-navy' : 'bg-border-strong'
      )}
    >
      <span
        className={cn(
          'absolute w-[18px] h-[18px] rounded-full bg-white top-0.5 left-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200',
          on && 'translate-x-4'
        )}
      />
    </button>
  )
}
