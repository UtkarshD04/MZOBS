import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const variants = {
  primary:
    'bg-navy text-white font-semibold shadow-xs hover:bg-navy-hover active:bg-navy-900',
  secondary:
    'bg-surface text-ink border border-border-strong shadow-xs hover:bg-surface-hover hover:border-navy/40 hover:text-navy',
  ghost: 'bg-transparent text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors',
  danger: 'bg-red-tint text-red border border-red/20 hover:bg-red hover:text-white hover:border-transparent',
  gold: 'bg-gold-tint text-gold-strong border border-gold/20 hover:bg-navy hover:text-white hover:border-transparent',
}

const sizes = {
  sm: 'h-9 px-3.5 text-[12.5px] rounded-md gap-1.5',
  md: 'h-10 px-4 text-[13.5px] rounded-md gap-[7px]',
  lg: 'h-11 px-5 text-[14px] rounded-md gap-2',
}

export default function Button({ variant = 'secondary', size = 'md', className, iconOnly, loading, disabled, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold cursor-pointer border border-transparent transition-colors duration-150 ease-out-premium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        iconOnly && 'px-0 w-10',
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
