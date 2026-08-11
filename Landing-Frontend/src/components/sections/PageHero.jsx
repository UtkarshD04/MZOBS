import PillButton from '../ui/PillButton'
import { HERO_DATA } from '../../lib/content'

export default function PageHero() {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0B1220] pt-28 pb-20 px-6 md:px-12">
      {/* Background Image with Dark Gradient Mask */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_DATA.bgImage}
          alt="Mzobs hiring platform"
          className="w-full h-full object-cover object-center brightness-[0.55] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/40 to-[#0B1220]/60" />
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-8 items-end">
        {/* Left Headline */}
        <div className="md:col-span-7 space-y-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-white tracking-tight leading-[1.1]">
            {HERO_DATA.titleLine1} <br />
            <span className="font-serif italic font-normal text-white/90">
              {HERO_DATA.titleItalic}
            </span> <br />
            {HERO_DATA.titleLine2}
          </h1>
        </div>

        {/* Right Copy & CTA */}
        <div className="md:col-span-5 space-y-6 md:pl-6 pb-2">
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            {HERO_DATA.subtitle}
          </p>
          <div>
            <PillButton href="#contact" variant="white">
              {HERO_DATA.ctaText}
            </PillButton>
          </div>
        </div>
      </div>
    </section>
  )
}
