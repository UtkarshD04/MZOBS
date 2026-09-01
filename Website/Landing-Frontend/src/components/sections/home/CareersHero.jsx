import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowUpRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import RotatingWord from '../../ui/RotatingWord'
import SplitText from '../../ui/SplitText'
import FloatingElement from '../../ui/FloatingElement'
import { HERO_DATA } from '../../../lib/content'
import { EMPLOYEE_APP_URL } from '../../../lib/config'

const ROTATING_WORD_COLORS = [
  'var(--careers-tint-blue-ink)',
  'var(--careers-tint-sage-ink)',
  'var(--careers-tint-sand-ink)',
  'var(--careers-tint-rose-ink)',
]

export default function CareersHero() {
  const [query, setQuery] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    const url = query ? `${EMPLOYEE_APP_URL}?q=${encodeURIComponent(query)}` : EMPLOYEE_APP_URL
    window.location.href = url
  }

  return (
    <section id="home" className="relative bg-white pt-[76px] overflow-hidden">
      {/* Ambient floating accent */}
      <FloatingElement duration={9} distance={16} className="absolute top-24 right-[8%] w-64 h-64 rounded-full bg-[#F5F5F5] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left: Headline, Search, Copy */}
        <div className="lg:col-span-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[50px] font-black text-black leading-[1.05] tracking-tight">
            <SplitText text={HERO_DATA.rotatingPrefix} />
            <br />
            <RotatingWord words={HERO_DATA.rotatingWords} colors={ROTATING_WORD_COLORS} className="text-[var(--careers-accent)]" />
          </h1>

          <Reveal direction="up" delay={0.35} duration={0.85} scale={0.96}>
            <p className="mt-6 text-base sm:text-lg text-[#595959] max-w-xl leading-relaxed font-medium">
              {HERO_DATA.subtitle}
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.45} duration={0.8} scale={0.97}>
            <motion.form
              onSubmit={handleSearch}
              whileHover={{ boxShadow: '0 8px 24px -8px rgba(0,0,0,0.15)' }}
              className="mt-8 flex items-center gap-2 bg-white border border-[#C9C9C9] rounded-full h-[58px] pl-6 pr-2 max-w-xl transition-shadow"
            >
              <Search size={18} className="text-[#9E9E9E] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={HERO_DATA.searchPlaceholder}
                className="flex-1 min-w-0 h-full bg-transparent outline-none text-[13px] sm:text-sm text-black placeholder:text-[#9E9E9E] font-medium"
              />
              <motion.button
                type="submit"
                aria-label="Search jobs"
                whileHover={{ scale: 1.08, rotate: 45 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                className="w-11 h-11 rounded-full bg-[rgb(61,92,52)] text-white flex items-center justify-center hover:bg-[rgb(49,74,42)] transition-colors shrink-0"
              >
                <ArrowUpRight size={18} />
              </motion.button>
            </motion.form>
          </Reveal>
        </div>

        {/* Right: Hero Banner Image */}
        <div className="lg:col-span-7">
          <Reveal direction="right" duration={1} delay={0.2} scale={0.9} blur>
            <motion.img
              src="/images/hero1.png"
              alt="Verified talent and top companies hiring on Mzobs"
              fetchPriority="high"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
              className="w-full h-auto"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
