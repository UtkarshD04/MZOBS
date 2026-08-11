import PillButton from '../ui/PillButton'
import { CTA_BAND_DATA } from '../../lib/content'

export default function CTABand() {
  return (
    <section id="contact" className="bg-[#EEF3F8] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="relative min-h-[420px] sm:min-h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-slate-300/40 group">
          {/* Background Image */}
          <img
            src={CTA_BAND_DATA.bgImage}
            alt="Ready to Transform Your Business"
            className="w-full h-full absolute inset-0 object-cover object-center brightness-[0.5] group-hover:scale-105 transition-transform duration-700"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/60 to-transparent" />

          {/* Glass Card Overlay Box */}
          <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-14 max-w-3xl space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-white tracking-tight leading-tight">
              {CTA_BAND_DATA.titlePrefix}
              <span className="font-serif italic font-normal text-slate-100">
                {CTA_BAND_DATA.titleItalic}
              </span>
              {CTA_BAND_DATA.titleSuffix}
            </h2>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal max-w-xl">
              {CTA_BAND_DATA.desc}
            </p>

            <div className="pt-2">
              <PillButton href="#contact" variant="white" className="px-8 py-3.5 text-sm font-semibold">
                {CTA_BAND_DATA.ctaText}
              </PillButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
