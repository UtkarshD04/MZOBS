import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Field({ label, optional, hint, error, children, className }: { label?: string; optional?: boolean; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-[7px] mb-4', className)}>
      {label && (
        <label className="text-[13px] font-semibold">
          {label} {optional && <span className="font-normal text-ink-tertiary ml-1">(optional)</span>}
        </label>
      )}
      {children}
      {error ? <span className="text-xs text-red font-medium">{error}</span> : hint ? <span className="text-xs text-ink-tertiary">{hint}</span> : null}
    </div>
  )
}

export const inputClass =
  'h-10 px-[13px] rounded-[9px] border border-border-strong bg-surface text-ink text-[13.5px] w-full transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ink-tertiary focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] disabled:opacity-55 disabled:cursor-not-allowed'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, error, ...props }, ref) {
  return <input ref={ref} className={cn(inputClass, error && 'border-red focus:border-red focus:shadow-[0_0_0_3.5px_var(--color-red-tint)]', className)} {...props} />
})

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, error, ...props }, ref) {
  return <textarea ref={ref} className={cn(inputClass, 'h-auto py-[11px] min-h-[90px] resize-y', error && 'border-red', className)} {...props} />
})

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, children, error, ...props }, ref) {
  return (
    <div className="relative">
      <select ref={ref} className={cn(inputClass, 'appearance-none pr-8', error && 'border-red', className)} {...props}>
        {children}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none" />
    </div>
  )
})
