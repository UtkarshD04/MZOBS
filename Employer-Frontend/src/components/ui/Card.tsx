import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  pad?: boolean
  children?: ReactNode
}

export default function Card({ className, hover, pad, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl shadow-xs',
        pad && 'p-[22px]',
        hover &&
          'relative overflow-hidden transition-all duration-300 ease-out-premium hover:shadow-md hover:-translate-y-1 hover:border-border-strong before:content-[""] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2.5px] before:bg-gradient-to-r before:from-navy before:to-gold-dot before:scale-x-0 before:origin-left before:transition-transform before:duration-400 before:ease-out-premium hover:before:scale-x-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHead({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn('flex items-center justify-between px-[22px] py-[18px] border-b border-border', className)}>{children}</div>
}

export function CardBody({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn('p-[22px]', className)}>{children}</div>
}

export function CardTitle({ className, children }: { className?: string; children?: ReactNode }) {
  return <h3 className={cn('text-[14.5px] font-semibold tracking-tight', className)}>{children}</h3>
}
