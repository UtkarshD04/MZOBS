import Photo from './Photo'

export default function CTABand({ title, subtitle, actions, photoIcon }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-2xl text-center py-16 px-8">
        <Photo icon={photoIcon} tone="mixed" fill rounded="none" />
        <div className="absolute inset-0 bg-navy-950/85" />
        <div className="relative">
          <h2 className="font-heading text-2xl sm:text-[28px] font-bold tracking-tight text-white">{title}</h2>
          {subtitle && <p className="text-white/65 text-[14.5px] mt-2.5 max-w-md mx-auto leading-relaxed">{subtitle}</p>}
          {actions && <div className="flex items-center justify-center gap-3 mt-7 flex-wrap">{actions}</div>}
        </div>
      </div>
    </section>
  )
}
