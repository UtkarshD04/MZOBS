import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function Field({ label, optional, hint, children, className }) {
  return (
    <div className={cn('flex flex-col gap-[7px] mb-4', className)}>
      {label && (
        <label className="text-[12.5px] font-semibold text-[#111827] tracking-tight">
          {label} {optional && <span className="font-medium text-[#9E9E9E] ml-1">(optional)</span>}
        </label>
      )}
      {children}
      {hint && <span className="text-xs text-[#9E9E9E]">{hint}</span>}
    </div>
  )
}

export const inputClass =
  'h-12 px-4 rounded-xl border border-[#111827]/15 bg-white text-[#111827] text-[14px] font-medium w-full transition-all duration-150 outline-none placeholder:text-[#9aa0b4] hover:border-[#4a4ed8]/50 focus:border-[#4a4ed8] focus:ring-[3px] focus:ring-[#4a4ed8]/15'

// `icon` renders a leading glyph (a lucide-react component) inside the
// field — the common "icon + input" look most premium SaaS forms use
// instead of a bare text box.
export function Input({ icon: Icon, className, ...props }) {
  const input = <input className={cn(inputClass, Icon && 'pl-10', className)} {...props} />
  if (!Icon) return input
  return (
    <div className="relative">
      <Icon size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a90a8] pointer-events-none" />
      {input}
    </div>
  )
}

export function Select({ icon: Icon, className, children, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a90a8] pointer-events-none" />}
      <select className={cn(inputClass, 'appearance-none pr-9', Icon && 'pl-10', className)} {...props}>
        {children}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a90a8] pointer-events-none" />
    </div>
  )
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn(inputClass, 'h-auto min-h-[110px] py-2.5 resize-none', className)} {...props} />
}

export function SubmitButton({ children, className, ...props }) {
  return (
    <button
      type="submit"
      className={cn(
        'w-full py-3.5 inline-flex items-center justify-center gap-2 rounded-full border border-[#111827] bg-[#4a4ed8] text-white text-[15px] font-bold shadow-[4px_5px_0_#111827] hover:bg-[#5b5fef] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_6px_0_#111827] active:translate-x-[3px] active:translate-y-[4px] active:shadow-[1px_1px_0_#111827] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0',
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
