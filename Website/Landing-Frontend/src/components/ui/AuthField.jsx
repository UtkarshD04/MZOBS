import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function Field({ label, optional, hint, children, className }) {
  return (
    <div className={cn('flex flex-col gap-[7px] mb-4', className)}>
      {label && (
        <label className="text-[12.5px] font-bold text-black tracking-tight">
          {label} {optional && <span className="font-medium text-[#9E9E9E] ml-1">(optional)</span>}
        </label>
      )}
      {children}
      {hint && <span className="text-xs text-[#9E9E9E]">{hint}</span>}
    </div>
  )
}

export const inputClass =
  'h-11 px-4 rounded-xl border border-[#C9C9C9] bg-white text-black text-[13.5px] font-medium w-full transition-all duration-150 outline-none placeholder:text-[#9E9E9E] hover:border-[#a8a8a8] focus:border-[var(--careers-accent)] focus:ring-[3px] focus:ring-[var(--careers-accent)]/12'

// `icon` renders a leading glyph (a lucide-react component) inside the
// field — the common "icon + input" look most premium SaaS forms use
// instead of a bare text box.
export function Input({ icon: Icon, className, ...props }) {
  const input = <input className={cn(inputClass, Icon && 'pl-10', className)} {...props} />
  if (!Icon) return input
  return (
    <div className="relative">
      <Icon size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9E9E] pointer-events-none" />
      {input}
    </div>
  )
}

export function Select({ icon: Icon, className, children, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9E9E] pointer-events-none" />}
      <select className={cn(inputClass, 'appearance-none pr-9', Icon && 'pl-10', className)} {...props}>
        {children}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] pointer-events-none" />
    </div>
  )
}

export function SubmitButton({ children, className, ...props }) {
  return (
    <button
      type="submit"
      className={cn(
        'w-full h-12 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--careers-accent)] text-white text-sm font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_20px_-8px_var(--careers-accent)] hover:bg-[var(--careers-accent-hover)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_10px_24px_-8px_var(--careers-accent)] active:scale-[0.985] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function LinkButton({ to, children, className }) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--careers-accent)] text-white text-sm font-bold hover:bg-[var(--careers-accent-hover)] transition-colors',
        className
      )}
    >
      {children}
    </Link>
  )
}
