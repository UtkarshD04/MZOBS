import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const variants = {
  primary:
    'bg-gradient-to-br from-navy-700 to-navy text-white shadow-navy hover:shadow-[0_14px_28px_-8px_rgba(28,43,78,0.45)] hover:-translate-y-0.5 active:shadow-navy',
  secondary:
    'bg-surface text-ink border border-border-strong shadow-xs hover:bg-surface-hover hover:border-ink-tertiary hover:-translate-y-0.5 hover:shadow-sm',
  ghost: 'bg-transparent text-ink-secondary hover:bg-surface-hover hover:text-ink',
  danger: 'bg-red-tint text-red hover:bg-red hover:text-white hover:-translate-y-0.5',
  gold: 'bg-gold-tint text-gold-strong hover:bg-gold hover:text-white hover:-translate-y-0.5',
}

// Solid gold CTA treatment used throughout the reference design
export const goldSolidClass = 'bg-gradient-to-br from-gold-dot to-gold-strong shadow-none hover:brightness-110'

const sizes = {
  sm: 'h-8 px-3 text-[12.5px] rounded-md gap-1.5',
  md: 'h-[38px] px-4 text-[13.5px] rounded-md gap-[7px]',
  lg: 'h-11 px-[22px] text-[14.5px] rounded-md gap-2',
}

const MotionLink = motion.create(Link)

export default function Button({
  variant = 'secondary',
  size = 'md',
  pill,
  className,
  iconOnly,
  children,
  to,
  href,
  ...props
}) {
  const classes = cn(
    'group inline-flex items-center justify-center font-semibold cursor-pointer border border-transparent transition-all duration-200 ease-out-premium whitespace-nowrap active:translate-y-0 active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 [&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:translate-x-2',
    variants[variant],
    sizes[size],
    pill && 'rounded-full',
    iconOnly && 'px-0 w-[38px]',
    className
  )

  if (to) {
    return (
      <MotionLink
        to={to}
        className={classes}
        whileHover={{ y: -3, scale: 1.025 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        {...props}
      >
        {children}
      </MotionLink>
    )
  }
  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ y: -3, scale: 1.025 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        {...props}
      >
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button
      className={classes}
      whileHover={{ y: -3, scale: 1.025 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

