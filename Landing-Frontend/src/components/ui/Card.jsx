import { cn } from '../../lib/utils'

export default function Card({ className, hover, pad, children, style, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl shadow-xs transition-all duration-300 ease-out-premium',
        pad && 'p-[22px]',
        hover &&
          'group relative overflow-hidden hover:shadow-xl hover:-translate-y-2.5 hover:scale-[1.03] hover:border-border-strong before:content-[""] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2.5px] before:bg-gradient-to-r before:from-navy before:to-gold-dot before:scale-x-0 before:origin-left before:transition-transform before:duration-400 before:ease-out-premium hover:before:scale-x-100 [&_img]:transition-transform [&_img]:duration-500 hover:[&_img]:scale-108 [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:scale-110',
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

