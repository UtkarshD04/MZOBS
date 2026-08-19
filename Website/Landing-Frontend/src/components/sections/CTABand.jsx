import { motion } from 'framer-motion'
import PillButton from '../ui/PillButton'
import Reveal from '../ui/Reveal'
import ParallaxImage from '../ui/ParallaxImage'
import FloatingElement from '../ui/FloatingElement'
import { CTA_BAND_DATA } from '../../lib/content'

export default function CTABand({
  title,
  subtitle,
  actions,
  photoIcon: PhotoIcon
}) {
  return (
    <section id="contact" className="bg-[#EEF3F8] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.90 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[420px] sm:min-h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-slate-300/40 group bg-[#0B1220]"
        >
          {/* Background Image with Parallax */}
          <ParallaxImage
            src={CTA_BAND_DATA.bgImage}
            alt="Ready to get hired or hire faster"
            offset={60}
            className="w-full h-full absolute inset-0 object-cover object-center brightness-[0.5] group-hover:scale-108 transition-transform duration-700 ease-out-premium"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/60 to-transparent pointer-events-none" />

          {/* Floating Ambient Glowing Shape */}
          <FloatingElement duration={7} distance={24} className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />

          {/* Glass Card Overlay Box */}
          <Reveal direction="up" delay={0.15} duration={0.9} scale={0.92} blur className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-14 max-w-3xl space-y-6">
            {title ? (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-white tracking-tight leading-tight">
                {title}
              </h2>
            ) : (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-white tracking-tight leading-tight">
                {CTA_BAND_DATA.titlePrefix}
                <span className="font-serif italic font-normal text-slate-100">
                  {CTA_BAND_DATA.titleItalic}
                </span>
                {CTA_BAND_DATA.titleSuffix}
              </h2>
            )}

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal max-w-xl">
              {subtitle || CTA_BAND_DATA.desc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {actions ? actions : (
                <PillButton href="#contact" variant="white" className="px-8 py-3.5 text-sm font-semibold">
                  {CTA_BAND_DATA.ctaText}
                </PillButton>
              )}
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  )
}

