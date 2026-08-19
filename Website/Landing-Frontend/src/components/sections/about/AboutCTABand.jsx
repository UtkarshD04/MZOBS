import { ArrowRight, Briefcase, Sparkles, Users2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../../ui/Reveal'
import ParallaxImage from '../../ui/ParallaxImage'
import FloatingElement from '../../ui/FloatingElement'
import { CTA_BAND_DATA } from '../../../lib/content'

const EMOTIONAL_LINES = [
  { text: 'The right opportunity can change a', em: 'career.' },
  { text: 'The right person can change a', em: 'company.' },
]

const AUDIENCE_CARDS = [
  {
    to: '/employees',
    icon: Briefcase,
    label: 'For Job Seekers',
    cta: "I'm Looking for a Job",
    tone: 'solid',
  },
  {
    to: '/employers',
    icon: Users2,
    label: 'For Employers',
    cta: "I'm Hiring",
    tone: 'outline',
  },
]

export default function AboutCTABand() {
  return (
    <section id="contact" className="bg-[#F5F5F5] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[460px] sm:min-h-[500px] rounded-[32px] overflow-hidden shadow-xl border border-[#e0e0e0] group bg-gradient-to-br from-[#eef3ea] to-[#f7f2e6]"
        >
          <ParallaxImage
            src={CTA_BAND_DATA.bgImage}
            alt="Ready to get started with Mzobs"
            offset={50}
            className="w-full h-full absolute inset-0 object-cover object-center opacity-[0.16] group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#eef3ea] via-[#eef3ea]/85 to-[#f7f2e6]/60 pointer-events-none" />
          <FloatingElement duration={7} distance={24} className="absolute top-10 right-10 w-72 h-72 bg-[var(--careers-accent)]/10 rounded-full blur-3xl pointer-events-none" />
          <FloatingElement duration={9} distance={18} className="absolute bottom-16 left-10 w-56 h-56 bg-[#e8a87c]/20 rounded-full blur-3xl pointer-events-none" />

          <Reveal
            direction="up"
            delay={0.15}
            duration={0.9}
            scale={0.94}
            blur
            className="relative z-10 h-full flex flex-col justify-end items-center text-center p-8 sm:p-14 gap-8"
          >
            <div className="flex flex-col items-center gap-5 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#e0e0e0] shadow-sm text-[11px] font-bold uppercase tracking-wider text-[#3d3d3d]">
                <Sparkles size={12} className="text-[var(--careers-accent)]" /> Two sides. One platform.
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-tight">
                {EMOTIONAL_LINES.map((line) => (
                  <span key={line.em} className="block">
                    {line.text} <em className="italic font-normal text-[var(--careers-accent)]">{line.em}</em>
                  </span>
                ))}
              </h2>
            </div>

            <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AUDIENCE_CARDS.map(({ to, icon: Icon, label, cta, tone }) => (
                <motion.div key={to} whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                  <Link
                    to={to}
                    className={`group/card flex flex-col items-center gap-2.5 h-full px-6 py-6 rounded-2xl border transition-colors ${
                      tone === 'solid'
                        ? 'bg-[var(--careers-accent)] text-white border-[var(--careers-accent)] hover:bg-[var(--careers-accent-hover)]'
                        : 'bg-white text-[#111827] border-[#e0e0e0] shadow-sm hover:border-[var(--careers-accent)]'
                    }`}
                  >
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tone === 'solid' ? 'bg-white/15 text-white' : 'bg-[#f5f5f5] text-[var(--careers-accent)]'
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${tone === 'solid' ? 'text-white/70' : 'text-[#9ca3af]'}`}>
                      {label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold">
                      {cta}
                      <ArrowRight size={15} className="transition-transform duration-200 group-hover/card:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  )
}
