import { cn } from '../../lib/utils'

export default function Card({ className, hover, pad, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl shadow-xs',
        pad && 'p-[22px]',
        hover && 'transition-[box-shadow,border-color] duration-200 ease-out-premium hover:shadow-sm hover:border-border-strong',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHead({ className, children }) {
  return <div className={cn('flex items-center justify-between px-[22px] py-[18px] border-b border-border', className)}>{children}</div>
}

export function CardBody({ className, children }) {
  return <div className={cn('p-[22px]', className)}>{children}</div>
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-[14.5px] font-semibold tracking-tight', className)}>{children}</h3>
}
