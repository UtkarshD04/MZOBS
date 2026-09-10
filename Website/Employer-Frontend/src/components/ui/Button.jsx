import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const variants = {
  primary:
    'emp-btn-primary relative overflow-hidden isolation-isolate bg-[#20251F] text-[#FAF7F1] font-bold shadow-[0_1px_2px_rgba(32,37,31,0.08),0_6px_18px_-6px_rgba(36,107,90,0.45)] hover:bg-[#1a5247] hover:shadow-[0_1px_2px_rgba(32,37,31,0.08),0_10px_24px_-6px_rgba(36,107,90,0.55)] hover:-translate-y-px active:translate-y-0 active:shadow-[0_1px_2px_rgba(32,37,31,0.08),0_4px_10px_-4px_rgba(36,107,90,0.35)] dark:bg-[#246B5A] dark:text-[#e8f0e5] dark:hover:bg-[#1a5247] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_6px_18px_-6px_rgba(93,184,150,0.35)] dark:hover:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_10px_24px_-6px_rgba(93,184,150,0.45)]',
  secondary:
    'bg-surface text-ink border border-border-strong shadow-xs hover:bg-surface-hover hover:border-navy/40 hover:text-navy hover:-translate-y-px hover:shadow-sm active:translate-y-0',
  ghost: 'bg-transparent text-ink-secondary hover:bg-navy-tint hover:text-navy transition-colors',
  danger: 'bg-red-tint text-red border border-red/20 hover:bg-red hover:text-white hover:border-transparent hover:-translate-y-px active:translate-y-0',
  gold: 'bg-gold-tint text-gold-strong border border-gold/20 hover:bg-[#20251F] hover:text-[#FAF7F1] hover:border-transparent hover:-translate-y-px active:translate-y-0',
}

const sizes = {
  sm: 'h-8 px-3.5 text-[12.5px] rounded-full gap-1.5',
  md: 'h-[38px] px-5 text-[13.5px] rounded-full gap-[7px]',
  lg: 'h-11 px-6 text-[14px] rounded-full gap-2',
}

export default function Button({ variant = 'secondary', size = 'md', className, iconOnly, loading, disabled, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold cursor-pointer border border-transparent transition-all duration-200 ease-out-premium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
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
