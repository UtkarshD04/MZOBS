import { cn } from '../../lib/utils'

export default function Chip({ selected, onClick, className, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 text-[12.5px] font-medium px-[13px] py-[7px] rounded-full border transition-all duration-150 cursor-pointer',
        selected ? 'bg-navy border-navy text-white' : 'bg-surface border-border-strong text-ink-secondary hover:border-navy hover:text-ink',
        className
      )}
    >
      {children}
    </button>
  )
}
