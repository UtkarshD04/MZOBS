import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const variants = {
  primary:
    'bg-gradient-to-br from-navy-700 to-navy text-white shadow-navy hover:shadow-[0_12px_26px_-8px_rgba(28,43,78,0.45)] hover:-translate-y-px active:shadow-navy',
  secondary: 'bg-surface text-ink border border-border-strong shadow-xs hover:bg-surface-hover hover:border-ink-tertiary hover:-translate-y-px hover:shadow-sm',
  ghost: 'bg-transparent text-ink-secondary hover:bg-surface-hover hover:text-ink',
  danger: 'bg-red-tint text-red hover:bg-red hover:text-white hover:-translate-y-px',
  gold: 'bg-gold-tint text-gold-strong hover:bg-gold hover:text-white hover:-translate-y-px',
}

const sizes = {
  sm: 'h-8 px-3 text-[12.5px] rounded-md gap-1.5',
  md: 'h-[38px] px-4 text-[13.5px] rounded-md gap-[7px]',
  lg: 'h-11 px-[22px] text-[14.5px] rounded-md gap-2',
}

export default function Button({ variant = 'secondary', size = 'md', className, iconOnly, loading, disabled, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold cursor-pointer border border-transparent transition-all duration-200 ease-out-premium whitespace-nowrap active:translate-y-0 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        variants[variant],
        sizes[size],
        iconOnly && 'px-0 w-[38px]',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  )
}
