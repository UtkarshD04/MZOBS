import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

// Shared primary/secondary button + text-link treatment for the job-discovery
// home page redesign (see index.css's "MZOBS BUTTON SYSTEM" block for the
// shine-sweep/reduced-motion mechanics). Deliberately scoped to this page's
// own --explorer-* palette — deep blue for key actions (Find jobs, View
// role, Apply now, Post a requirement), white/navy/bordered for everything
// less important. Blue (not the old teal) so every one of these buttons
// reads as a continuation of the Hero's own blue/purple CTA identity
// (--hero-cta-gradient) rather than a different, unrelated accent. Polymorphic
// the same way the rest of this codebase's link-like controls are: pass `to`
// for a react-router route, `href` for a plain link, or neither for a real
// `<button>`.

const SIZE_CLASSES = {
  sm: 'h-8 px-3.5 text-[12.5px] gap-1.5',
  md: 'h-10 px-5 text-[13.5px] gap-1.5',
  lg: 'h-11 px-6 text-[14px] gap-2',
  xl: 'h-12 px-7 text-[14.5px] gap-2',
}

const VARIANT_CLASSES = {
  primary:
    'explorer-btn-primary bg-(--explorer-blue) text-white shadow-[0_1px_2px_rgba(37,99,235,0.16),0_10px_20px_-10px_rgba(37,99,235,0.55)] hover:bg-(--explorer-blue-hover) hover:shadow-[0_1px_2px_rgba(37,99,235,0.2),0_14px_26px_-10px_rgba(29,78,216,0.55)]',
  secondary:
    'bg-white text-(--explorer-navy) border border-(--explorer-border) hover:bg-(--explorer-blue-surface) hover:border-(--explorer-blue-border) hover:text-(--explorer-blue)',
}

const BASE_CLASSES =
  'relative inline-flex items-center justify-center rounded-md font-bold whitespace-nowrap cursor-pointer select-none ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out ' +
  'motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) ' +
  'disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0'

export default function ExplorerButton({ variant = 'primary', size = 'md', className = '', to, href, ...props }) {
  const classes = `${BASE_CLASSES} ${SIZE_CLASSES[size] ?? SIZE_CLASSES.md} ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary} ${className}`

  if (to) return <Link to={to} className={classes} {...props} />
  if (href) return <a href={href} className={classes} {...props} />
  return <button type="button" className={classes} {...props} />
}

// Plain-text action (View all jobs, View company jobs...) — deep blue text,
// no filled box, with a small arrow that nudges 3px right on hover. Pass
// `arrow={false}` for actions that already carry their own leading icon
// (e.g. a "Clear filters" X) instead of a trailing forward-arrow.
export function ExplorerTextLink({ className = '', children, to, href, arrow = true, ...props }) {
  const classes = `group/link relative inline-flex items-center gap-1 font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover) transition-colors duration-150 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) ${className}`
  const arrowEl = arrow ? (
    <ArrowRight
      size={14}
      aria-hidden="true"
      className="shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/link:translate-x-[3px]"
    />
  ) : null

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
        {arrowEl}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
        {arrowEl}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
      {arrowEl}
    </button>
  )
}
