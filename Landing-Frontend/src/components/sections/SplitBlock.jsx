import Photo from './Photo'
import { cn } from '../../lib/utils'

export default function SplitBlock({ eyebrow, title, text, cta, photoIcon, reverse, tone = 'light' }) {
  return (
    <section className={cn('border-y', tone === 'dark' ? 'bg-navy-950 border-white/10' : 'bg-bg-secondary border-border')}>
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className={cn(reverse && 'lg:order-2')}>
            {eyebrow && (
              <span className={cn('inline-block text-[11.5px] font-bold tracking-[0.14em] uppercase mb-3', tone === 'dark' ? 'text-gold-dot' : 'text-gold-strong')}>
                {eyebrow}
              </span>
            )}
            <h2 className={cn('font-heading text-2xl sm:text-[28px] font-bold tracking-tight leading-[1.15]', tone === 'dark' ? 'text-white' : 'text-ink')}>{title}</h2>
            <p className={cn('text-[14.5px] mt-3.5 leading-relaxed', tone === 'dark' ? 'text-white/65' : 'text-ink-secondary')}>{text}</p>
            {cta && <div className="mt-7">{cta}</div>}
          </div>
          <div className={cn(reverse && 'lg:order-1')}>
            <Photo icon={photoIcon} tone="navy" ratio="video" rounded="xl" className="shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  )
}
