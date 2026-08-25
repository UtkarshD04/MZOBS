import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Users } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import ParallaxImage from '../../ui/ParallaxImage'
import FloatingElement from '../../ui/FloatingElement'
import SplitText from '../../ui/SplitText'
import { OUR_VISION_DATA } from '../../../lib/content'

const BADGE_ICONS = { ShieldCheck, Users }

export default function AboutStorySection() {
  return (
    <section id="our-story" className="bg-[#F5F5F5] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[560px] sm:h-[600px] rounded-[32px] overflow-hidden shadow-xl border border-[#e0e0e0] group bg-gradient-to-br from-[#eef3ea] to-[#f7f2e6]"
        >
          {/* Background photo, faded to a texture */}
          <div className="absolute inset-0">
            <ParallaxImage
              src={OUR_VISION_DATA.image}
              alt="Where Mzobs is going"
              offset={50}
              className="w-full h-full object-cover object-center opacity-[0.18] group-hover:scale-105 transition-transform duration-700 ease-out-premium"
            />
          </div>

          {/* Directional scrim so the left-aligned copy stays readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#eef3ea] via-[#eef3ea]/85 sm:via-[#eef3ea]/75 to-[#f7f2e6]/50 pointer-events-none" />

          {/* Ambient glows */}
          <FloatingElement duration={7} distance={22} className="absolute -top-10 right-10 w-72 h-72 bg-[var(--careers-accent)]/10 rounded-full blur-3xl pointer-events-none" />
          <FloatingElement duration={9} distance={16} delay={0.5} className="absolute bottom-0 right-0 w-80 h-80 bg-[#e8a87c]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Oversized decorative quote mark */}
          <span
            aria-hidden="true"
            className="absolute -top-8 left-6 sm:left-10 font-serif italic text-black/[0.06] text-[220px] sm:text-[280px] leading-none pointer-events-none select-none"
          >
            &ldquo;
          </span>

          <Reveal
            direction="left"
            duration={0.9}
            scale={0.95}
            blur
            className="relative z-10 h-full flex flex-col justify-center p-8 sm:p-14 max-w-2xl space-y-7"
          >
            <span className="inline-flex w-fit items-center px-3.5 py-1.5 rounded-full bg-white border border-[#e0e0e0] text-[11px] font-bold uppercase tracking-wider text-black">
              {OUR_VISION_DATA.badge}
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-[46px] font-black text-black tracking-tight leading-tight">
              <SplitText text={OUR_VISION_DATA.titlePrefix} />
              <SplitText
                text={`${OUR_VISION_DATA.titleItalic}${OUR_VISION_DATA.titleSuffix}`}
                delay={OUR_VISION_DATA.titlePrefix.split(' ').length * 0.045}
                className="font-serif italic font-normal text-[var(--careers-accent)]"
              />
            </h2>

            <p className="text-[15px] sm:text-base text-[#595959] leading-relaxed font-medium max-w-lg">
              {OUR_VISION_DATA.desc}
            </p>

            <div className="flex flex-wrap gap-2.5">
              {OUR_VISION_DATA.badges.map((b) => {
                const Icon = BADGE_ICONS[b.icon]
                return (
                  <span
                    key={b.text}
                    className="inline-flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 rounded-full bg-white border border-[#e0e0e0] shadow-sm text-[12.5px] font-bold text-[var(--careers-accent)]"
                  >
                    <Icon size={14} strokeWidth={2.5} />
                    {b.text}
                  </span>
                )
              })}
            </div>

            <a
              href={OUR_VISION_DATA.ctaHref}
              className="inline-flex w-fit items-center gap-2 px-6 py-3 rounded-full bg-[var(--careers-accent)] text-white text-sm font-bold border border-[var(--careers-accent)] hover:bg-white hover:text-[#595959] hover:border-[#666] transition-colors"
            >
              {OUR_VISION_DATA.ctaText} <ArrowRight size={16} />
            </a>
          </Reveal>
        </motion.div>
      </div>
    </section>
  )
}
