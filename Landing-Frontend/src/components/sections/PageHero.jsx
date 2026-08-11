import { motion } from 'framer-motion'
import Photo from './Photo'
import { cn } from '../../lib/utils'

export default function PageHero({ size = 'md', kicker, title, subtitle, actions, photoIcon, photoTone = 'mixed' }) {
  const isLg = size === 'lg'

  return (
    <section className={cn('relative overflow-hidden bg-navy-950 text-white flex items-center', isLg ? 'min-h-[620px]' : 'min-h-[320px]')}>
      <Photo icon={photoIcon} tone={photoTone} fill rounded="none" className="opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/55" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(circle at 20% 30%, #000 0%, transparent 65%)',
        }}
      />

      <div className={cn('relative max-w-6xl mx-auto px-6 w-full', isLg ? 'py-24' : 'py-16')}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-xl">
          {kicker && <span className="inline-block text-[11.5px] font-bold tracking-[0.14em] uppercase text-gold-dot mb-4">{kicker}</span>}
          <h1 className={cn('font-heading font-bold tracking-tight leading-[1.1]', isLg ? 'text-[clamp(2rem,5vw,3.25rem)]' : 'text-[clamp(1.75rem,4vw,2.5rem)]')}>{title}</h1>
          {subtitle && <p className="text-white/70 text-[15.5px] mt-5 leading-relaxed">{subtitle}</p>}
          {actions && <div className="flex items-center gap-3 mt-8 flex-wrap">{actions}</div>}
        </motion.div>
      </div>
    </section>
  )
}
