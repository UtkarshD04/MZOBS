import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

const variants = {
  primary:
    'bg-gradient-to-br from-navy-700 to-navy text-white shadow-navy hover:shadow-[0_12px_26px_-8px_rgba(28,43,78,0.45)] hover:-translate-y-px active:shadow-navy',
  secondary: 'bg-surface text-ink border border-border-strong shadow-xs hover:bg-surface-hover hover:border-ink-tertiary hover:-translate-y-px hover:shadow-sm',
  ghost: 'bg-transparent text-ink-secondary hover:bg-surface-hover hover:text-ink',
  danger: 'bg-red-tint text-red hover:bg-red hover:text-white hover:-translate-y-px',
  gold: 'bg-gold-tint text-gold-strong hover:bg-gold hover:text-white hover:-translate-y-px',
}

// Solid gold CTA treatment used throughout the reference design (hero buttons,
// nav "Contact Us", CTA bands) — same override Frontend/Employer-Frontend's
// Home pages already apply on top of variant="primary".
export const goldSolidClass = 'bg-gradient-to-br from-gold-dot to-gold-strong shadow-none hover:brightness-110'

const sizes = {
  sm: 'h-8 px-3 text-[12.5px] rounded-md gap-1.5',
  md: 'h-[38px] px-4 text-[13.5px] rounded-md gap-[7px]',
  lg: 'h-11 px-[22px] text-[14.5px] rounded-md gap-2',
}

export default function Button({ variant = 'secondary', size = 'md', pill, className, iconOnly, children, to, href, ...props }) {
  const classes = cn(
    'inline-flex items-center justify-center font-semibold cursor-pointer border border-transparent transition-all duration-200 ease-out-premium whitespace-nowrap active:translate-y-0 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
    variants[variant],
    sizes[size],
    pill && 'rounded-full',
    iconOnly && 'px-0 w-[38px]',
    className
  )

  // `to` (internal route) and `href` (external/mailto) render as a Link/anchor
  // instead of a <button> — this site is link-heavy (nav, footer, CTAs into
  // the other apps) and a <button> nested inside an <a> is invalid HTML.
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
