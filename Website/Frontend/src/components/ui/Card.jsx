import { cn } from '../../lib/utils'

export default function Card({ className, hover, pad, children, style, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl shadow-xs',
        pad && 'p-[22px]',
        hover &&
          'relative overflow-hidden transition-all duration-300 ease-out-premium hover:shadow-md hover:-translate-y-1 hover:border-border-strong before:content-[""] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2.5px] before:bg-gradient-to-r before:from-navy before:to-gold-dot before:scale-x-0 before:origin-left before:transition-transform before:duration-400 before:ease-out-premium hover:before:scale-x-100',
        className
      )}
      style={style}
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
