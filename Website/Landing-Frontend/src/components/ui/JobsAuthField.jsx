import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

// Form primitives for the redesigned employee signup wizard, styled with
// the --jobs-* palette (matches Navbar/Home) instead of the older
// --careers-* olive-green tokens AuthField.jsx uses. Kept as a separate
// file so other auth forms (signin, employer, forgot-password) that still
// import AuthField.jsx are unaffected.
export function Field({ label, optional, hint, children, className, error }) {
  return (
    <div className={cn('flex flex-col gap-[6px] mb-4', className)}>
      {label && (
        <label className="text-[12.5px] font-bold text-(--jobs-navy) tracking-tight">
          {label} {optional && <span className="font-medium text-(--jobs-ink-soft) ml-1">(optional)</span>}
        </label>
      )}
      {children}
      {error ? <span className="text-xs text-red-600 mt-0.5">{error}</span> : hint ? <span className="text-xs text-(--jobs-ink-soft)">{hint}</span> : null}
    </div>
  )
}

export const inputClass =
  'h-11 px-4 rounded-xl border border-(--jobs-border) bg-white text-(--jobs-navy) text-[13.5px] font-medium w-full transition-all duration-150 outline-none placeholder:text-(--jobs-ink-soft)/60 hover:border-(--jobs-navy)/25 focus:border-(--jobs-blue) focus:ring-[3px] focus:ring-(--jobs-blue)/15'

export function Input({ icon: Icon, className, error, ...props }) {
  const input = (
    <input className={cn(inputClass, Icon && 'pl-10', error && 'border-red-400 focus:border-red-500 focus:ring-red-500/15', className)} {...props} />
  )
  if (!Icon) return input
  return (
    <div className="relative">
      <Icon size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--jobs-ink-soft) pointer-events-none" />
      {input}
    </div>
  )
}

export function Select({ icon: Icon, className, children, error, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--jobs-ink-soft) pointer-events-none" />}
      <select
        className={cn(inputClass, 'appearance-none pr-9', Icon && 'pl-10', error && 'border-red-400 focus:border-red-500 focus:ring-red-500/15', className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--jobs-ink-soft) pointer-events-none" />
    </div>
  )
}

export function PrimaryButton({ children, className, ...props }) {
  return (
    <button
      type="submit"
      className={cn(
        'w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-(--jobs-blue) text-white text-sm font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_20px_-8px_var(--jobs-blue)] hover:bg-(--jobs-blue-dark) hover:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_10px_24px_-8px_var(--jobs-blue-dark)] active:scale-[0.985] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'h-11 px-4 inline-flex items-center justify-center gap-1.5 rounded-xl text-[13px] font-bold border border-(--jobs-border) bg-white text-(--jobs-navy) hover:border-(--jobs-blue) hover:text-(--jobs-blue-dark) transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
