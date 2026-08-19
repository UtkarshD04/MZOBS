import { cn } from '../../lib/utils'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', tone = 'light', maxWidth = 'max-w-xl', className }) {
  return (
    <div className={cn(align === 'center' ? cn('text-center mx-auto', maxWidth) : 'text-left', className)}>
      {eyebrow && (
        <span className={cn('inline-block text-[11.5px] font-bold tracking-[0.14em] uppercase mb-3', tone === 'dark' ? 'text-gold-dot' : 'text-gold-strong')}>
          {eyebrow}
        </span>
      )}
      <h2 className={cn('font-heading text-2xl sm:text-[28px] font-bold tracking-tight leading-[1.15]', tone === 'dark' ? 'text-white' : 'text-ink')}>{title}</h2>
      {subtitle && <p className={cn('text-[14.5px] mt-2.5 leading-relaxed', tone === 'dark' ? 'text-white/65' : 'text-ink-secondary')}>{subtitle}</p>}
    </div>
  )
}
