import { motion } from 'framer-motion'
import Reveal from '../../ui/Reveal'
import SectionLabel from '../../ui/SectionLabel'
import FloatingElement from '../../ui/FloatingElement'
import { WHO_WE_ARE_DATA } from '../../../lib/content'

export default function AboutHero() {
  return (
    <section id="home" className="relative bg-white pt-[76px] overflow-hidden">
      <FloatingElement duration={9} distance={16} className="absolute top-24 right-[8%] w-64 h-64 rounded-full bg-[#F5F5F5] blur-3xl pointer-events-none" />
      <FloatingElement duration={11} delay={1.5} distance={20} className="absolute bottom-10 left-[4%] w-72 h-72 rounded-full bg-[var(--careers-cyan-soft)]/40 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left: Headline & Copy */}
        <div className="lg:col-span-7">
          <Reveal direction="up" duration={0.7} scale={0.95} blur>
            <SectionLabel>{WHO_WE_ARE_DATA.badge}</SectionLabel>
          </Reveal>

          <Reveal direction="up" delay={0.1} duration={0.9} scale={0.94} blur>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black text-black leading-[1.15] tracking-tight">
              {WHO_WE_ARE_DATA.statement.map((item, i) =>
                item.italic ? (
                  <em key={i} className="italic font-black text-[#333333]">{item.text}</em>
                ) : (
                  <span key={i}>{item.text}</span>
                )
              )}
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.3} duration={0.8} scale={0.97}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#our-story"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#333333] text-white text-sm font-bold border border-[#333333] hover:bg-white hover:text-[#595959] hover:border-[#666] transition-colors"
              >
                Our Story
              </a>
              <a
                href="#team"
                className="inline-flex items-center px-6 py-3 rounded-full bg-white text-[#595959] text-sm font-bold border border-[#666] hover:bg-[#333333] hover:text-white hover:border-[#333333] transition-colors"
              >
                Meet the Team
              </a>
            </div>
          </Reveal>
        </div>

        {/* Right: Hero Banner Image */}
        <div className="lg:col-span-5">
          <Reveal direction="right" duration={1} delay={0.2} scale={0.9} blur>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
              className="relative rounded-[32px] overflow-hidden shadow-2xl border border-[#e0e0e0] aspect-[4/5] bg-[#F5F5F5] group"
            >
              <img
                src="/images/new_images/our_goal.jpg"
                alt="The team behind Mzobs"
                fetchPriority="high"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-lg text-xs font-bold text-black flex items-center justify-between">
                <div>
                  <span className="text-[#333333] font-extrabold block text-sm">People-First Hiring</span>
                  <span className="text-[#666] font-medium text-[11px]">Every profile reviewed by a real person</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
