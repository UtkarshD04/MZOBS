import PillButton from '../ui/PillButton'
import { HERO_DATA } from '../../lib/content'

export default function PageHero({
  kicker,
  title,
  subtitle = HERO_DATA.subtitle,
  actions,
  photoIcon: PhotoIcon,
  bgImage
}) {
  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0B1220] pt-28 pb-20 px-6 md:px-12">
      {/* Background Image with Dark Gradient Mask */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage || HERO_DATA.bgImage}
          alt="Mzobs hiring platform"
          className="w-full h-full object-cover object-center brightness-[0.88] contrast-[1.12] saturate-[1.1] transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-[#0B1220]/25 to-[#0B1220]/35" />
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-8 items-end">
        {/* Left Headline */}
        <div className="md:col-span-7 space-y-3">
          {kicker && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono font-semibold tracking-widest uppercase">
              {PhotoIcon && <PhotoIcon size={14} />}
              {kicker}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-white tracking-tight leading-[1.1]">
            {title ? title : (
              <>
                {HERO_DATA.titleLine1} <br />
                <span className="font-serif italic font-normal text-white/90">
                  {HERO_DATA.titleItalic}
                </span> <br />
                {HERO_DATA.titleLine2}
              </>
            )}
          </h1>
        </div>

        {/* Right Copy & CTA */}
        <div className="md:col-span-5 space-y-6 md:pl-6 pb-2">
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            {subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {actions ? actions : (
              <PillButton href="#contact" variant="white">
                {HERO_DATA.ctaText}
              </PillButton>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
