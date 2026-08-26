import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Field({ label, optional, hint, children, className }) {
  return (
    <div className={cn('flex flex-col gap-[7px] mb-4', className)}>
      {label && (
        <label className="text-[13px] font-semibold">
          {label} {optional && <span className="font-normal text-ink-tertiary ml-1">(optional)</span>}
        </label>
      )}
      {children}
      {hint && <span className="text-xs text-ink-tertiary">{hint}</span>}
    </div>
  )
}

export const inputClass =
  'h-10 px-[13px] rounded-[9px] border border-border-strong bg-surface text-ink text-[13.5px] w-full transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ink-tertiary focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)]'

export function Input(props) {
  return <input className={cn(inputClass, props.className)} {...props} />
}

export function Textarea(props) {
  return <textarea className={cn(inputClass, 'h-auto py-[11px] min-h-[90px] resize-y', props.className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select className={cn(inputClass, 'appearance-none pr-8', className)} {...props}>
        {children}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none" />
    </div>
  )
}

export function IconInput({ icon, children }) {
  return <div className="relative [&>input]:pl-[38px] [&>svg]:absolute [&>svg]:left-3 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:text-ink-tertiary [&>svg]:pointer-events-none">{icon}{children}</div>
}
