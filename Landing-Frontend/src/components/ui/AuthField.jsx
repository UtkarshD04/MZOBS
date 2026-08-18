import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function Field({ label, optional, hint, children, className }) {
  return (
    <div className={cn('flex flex-col gap-[7px] mb-4', className)}>
      {label && (
        <label className="text-[13px] font-bold text-black">
          {label} {optional && <span className="font-medium text-[#9E9E9E] ml-1">(optional)</span>}
        </label>
      )}
      {children}
      {hint && <span className="text-xs text-[#9E9E9E]">{hint}</span>}
    </div>
  )
}

export const inputClass =
  'h-11 px-4 rounded-xl border border-[#C9C9C9] bg-white text-black text-[13.5px] font-medium w-full transition-colors duration-150 outline-none placeholder:text-[#9E9E9E] focus:border-[#333333]'

export function Input(props) {
  return <input className={cn(inputClass, props.className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select className={cn(inputClass, 'appearance-none pr-9', className)} {...props}>
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
        'w-full h-12 inline-flex items-center justify-center gap-2 rounded-full bg-[#333333] text-white text-sm font-bold hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
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
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#333333] text-white text-sm font-bold hover:bg-[#1a1a1a] transition-colors',
        className
      )}
    >
      {children}
    </Link>
  )
}
