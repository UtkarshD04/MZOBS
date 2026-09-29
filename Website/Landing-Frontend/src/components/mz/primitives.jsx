import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

// Shared building blocks for the Mzobs v2 public pages. Everything reads the
// tokens in index.css ("MZOBS DESIGN SYSTEM v2") — no colour literals here
// except where a gradient needs them.

export function Container({ className = '', children, ...props }) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function Eyebrow({ children, tone = 'primary', className = '' }) {
  const tones = {
    primary: 'bg-mz-primary-tint text-mz-primary-strong',
    accent: 'bg-mz-accent-tint text-mz-accent-ink',
    dark: 'bg-white/10 text-white/80 ring-1 ring-white/15',
  }
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold tracking-wide ${tones[tone]} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}

export function SectionHead({ eyebrow, title, children, align = 'left', tone = 'light', action, id }) {
  const dark = tone === 'dark'
  return (
    <div className={`flex flex-col gap-6 ${align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      <div className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <Eyebrow tone={dark ? 'dark' : 'primary'}>{eyebrow}</Eyebrow>}
        <h2 id={id} className={`mt-4 text-[30px] font-bold leading-[1.1] tracking-[-0.025em] text-balance sm:text-[38px] lg:text-[44px] ${dark ? 'text-white' : 'text-mz-ink'}`}>
          {title}
        </h2>
        {children && <p className={`mt-4 text-[16px] leading-relaxed sm:text-[17px] ${dark ? 'text-white/70' : 'text-mz-muted'}`}>{children}</p>}
      </div>
      {action}
    </div>
  )
}

const BTN_BASE =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-(--ease-mz) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary motion-safe:active:scale-[0.98]'
const BTN_SIZE = { md: 'h-11 px-5 text-[14.5px]', lg: 'h-12 px-6 text-[15px]', sm: 'h-9 px-4 text-[13.5px]' }
const BTN_VARIANT = {
  primary: 'bg-mz-primary text-white shadow-mz-cta hover:bg-mz-primary-strong motion-safe:hover:-translate-y-0.5',
  quiet: 'bg-mz-ink text-white shadow-[0_1px_2px_rgba(17,24,39,0.12)] hover:bg-mz-primary motion-safe:hover:-translate-y-0.5',
  secondary: 'bg-white text-mz-ink ring-1 ring-mz-line-strong hover:ring-mz-primary hover:text-mz-primary-strong motion-safe:hover:-translate-y-0.5',
  ghost: 'text-mz-ink-2 hover:bg-mz-primary-tint hover:text-mz-primary-strong',
  light: 'bg-white text-mz-ink hover:bg-mz-primary-tint motion-safe:hover:-translate-y-0.5',
  outlineDark: 'text-white ring-1 ring-white/25 hover:bg-white/10 hover:ring-white/50',
}

export function buttonClass({ variant = 'primary', size = 'md', className = '' } = {}) {
  return `${BTN_BASE} ${BTN_SIZE[size]} ${BTN_VARIANT[variant]} ${className}`
}

// `to` renders a router <Link> (or a plain <a> for absolute URLs); without it a <button>.
export function Button({ to, href, variant, size, arrow = false, className, children, ...props }) {
  const cls = buttonClass({ variant, size, className })
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />}
    </>
  )
  if (to) return <Link to={to} className={cls} {...props}>{inner}</Link>
  if (href) return <a href={href} className={cls} {...props}>{inner}</a>
  return <button type="button" className={cls} {...props}>{inner}</button>
}

// Fades/lifts children in once as they scroll into view; skipped entirely
// (rendered static) for visitors who prefer reduced motion.
export function Reveal({ children, delay = 0, y = 18, className = '', as = 'div', ...props }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.div
  if (reduce) return <Tag className={className} {...props}>{children}</Tag>
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </Tag>
  )
}

// First letters of up to two words — the fallback when a company has no logo.
export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const MONOGRAM_TONES = [
  'bg-mz-primary-tint text-mz-primary-strong',
  'bg-mz-accent-tint text-mz-accent-ink',
  'bg-[#fff1e6] text-[#b4530a]',
  'bg-[#e8f3ff] text-[#1a63b8]',
]

export function CompanyLogo({ name = '', logo, size = 44, className = '' }) {
  const code = name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  const box = { width: size, height: size }
  if (logo) {
    return (
      <span style={box} className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-mz-line ${className}`}>
        <img src={logo} alt="" loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
      </span>
    )
  }
  return (
    <span
      style={{ ...box, fontSize: size * 0.34 }}
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-xl font-bold ${MONOGRAM_TONES[code % MONOGRAM_TONES.length]} ${className}`}
    >
      {initials(name)}
    </span>
  )
}
