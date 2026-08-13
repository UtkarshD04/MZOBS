import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import PillButton from '../ui/PillButton'
import Reveal from '../ui/Reveal'
import FloatingElement from '../ui/FloatingElement'
import ParallaxImage from '../ui/ParallaxImage'
import { HERO_DATA } from '../../lib/content'

export default function PageHero({
  kicker,
  title,
  subtitle = HERO_DATA.subtitle,
  actions,
  photoIcon: PhotoIcon,
  bgImage,
  sideImage,
  bgFit = 'cover',
  bgPosition = 'center'
}) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Differential parallax movement for text and visual depth
  const textY = useTransform(scrollYProgress, [0, 1], [0, -45])
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80])

  if (sideImage) {
    return (
      <section ref={containerRef} id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0B1220] pt-28 pb-20 px-6 md:px-12">
        {/* Subtle ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-[#0B1220] to-[#0B1220] z-0" />
        
        {/* Floating Ambient Glowing Blobs */}
        <FloatingElement duration={7} distance={20} className="absolute -top-16 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />
        <FloatingElement duration={9} delay={1.5} distance={24} className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & Actions */}
          <motion.div style={{ y: textY }} className="lg:col-span-6 space-y-6">
            <Reveal direction="up" duration={0.9} scale={0.90} blur>
              {kicker && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono font-semibold tracking-widest uppercase mb-4">
                  {PhotoIcon && <PhotoIcon size={14} />}
                  {kicker}
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-white tracking-tight leading-[1.1]">
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
            </Reveal>

            <Reveal direction="up" delay={0.15} duration={0.85} scale={0.94}>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-xl">
                {subtitle}
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.25} duration={0.8} scale={0.96}>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {actions ? actions : (
                  <PillButton href="#contact" variant="white">
                    {HERO_DATA.ctaText}
                  </PillButton>
                )}
              </div>
            </Reveal>
          </motion.div>

          {/* Right Column: Full Uncropped Graphic Card */}
          <motion.div style={{ y: bgY }} className="lg:col-span-6">
            <Reveal direction="right" duration={1.0} delay={0.2} scale={0.85} blur>
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 bg-[#0F172A]/90 p-2 sm:p-3 group">
                <img
                  src={sideImage}
                  alt="Career opportunities and growth steps"
                  className="w-full h-auto object-contain rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out-premium"
                />
              </div>
            </Reveal>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section ref={containerRef} id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0B1220] pt-28 pb-20 px-6 md:px-12">
      {/* Background Image with Dark Gradient Mask & Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <ParallaxImage
          src={bgImage || HERO_DATA.bgImage}
          alt="Mzobs hiring platform"
          offset={60}
          className={`w-full h-full ${bgFit === 'contain' ? 'object-contain' : 'object-cover'} brightness-[0.88] contrast-[1.12] saturate-[1.1] transition-all duration-500`}
          style={{ objectPosition: bgPosition }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-[#0B1220]/25 to-[#0B1220]/35 pointer-events-none" />
      </motion.div>

      {/* Floating Ambient Glows */}
      <FloatingElement duration={8} distance={20} className="absolute top-1/4 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none z-0" />
      <FloatingElement duration={10} delay={2} distance={24} className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Hero Content Grid */}
      <motion.div style={{ y: textY }} className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-8 items-end">
        {/* Left Headline */}
        <div className="md:col-span-7 space-y-3">
          <Reveal direction="up" duration={0.9} scale={0.90} blur>
            {kicker && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono font-semibold tracking-widest uppercase mb-3">
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
          </Reveal>
        </div>

        {/* Right Copy & CTA */}
        <div className="md:col-span-5 space-y-6 md:pl-6 pb-2">
          <Reveal direction="up" delay={0.15} duration={0.85} scale={0.94} blur>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              {subtitle}
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.25} duration={0.8} scale={0.96}>
            <div className="flex flex-wrap items-center gap-3">
              {actions ? actions : (
                <PillButton href="#contact" variant="white">
                  {HERO_DATA.ctaText}
                </PillButton>
              )}
            </div>
          </Reveal>
        </div>
      </motion.div>
    </section>
  )
}

