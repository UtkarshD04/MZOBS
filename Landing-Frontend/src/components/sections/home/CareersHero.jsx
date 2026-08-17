import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowUpRight, MapPin } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import RotatingWord from '../../ui/RotatingWord'
import SplitText from '../../ui/SplitText'
import FloatingElement from '../../ui/FloatingElement'
import { HERO_DATA, WHO_WE_ARE_DATA } from '../../../lib/content'
import { EMPLOYEE_APP_URL } from '../../../lib/config'

export default function CareersHero() {
  const [query, setQuery] = useState('')
  const companyStat = WHO_WE_ARE_DATA.stats[1]

  function handleSearch(e) {
    e.preventDefault()
    const url = query ? `${EMPLOYEE_APP_URL}?q=${encodeURIComponent(query)}` : EMPLOYEE_APP_URL
    window.location.href = url
  }

  return (
    <section id="home" className="relative bg-white pt-[76px] overflow-hidden">
      {/* Ambient floating accents */}
      <FloatingElement duration={9} distance={16} className="absolute top-24 right-[8%] w-64 h-64 rounded-full bg-[#F5F5F5] blur-3xl pointer-events-none" />
      <FloatingElement duration={11} delay={1.5} distance={20} className="absolute bottom-10 left-[4%] w-72 h-72 rounded-full bg-[#FFD1E6]/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left: Headline, Search, Copy */}
        <div className="lg:col-span-7">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black text-black leading-[1.05] tracking-tight">
            <SplitText text={HERO_DATA.rotatingPrefix} />
            <br />
            <RotatingWord words={HERO_DATA.rotatingWords} className="text-[#333333]" />
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
                className="w-11 h-11 rounded-full bg-[#333333] text-white flex items-center justify-center hover:bg-[#1a1a1a] transition-colors shrink-0"
              >
                <ArrowUpRight size={18} />
              </motion.button>
            </motion.form>
          </Reveal>

          <Reveal direction="up" delay={0.55} duration={0.75}>
            <div className="mt-5 flex items-center gap-2 text-[13px] font-bold text-[#595959]">
              <MapPin size={15} className="text-[#333333]" />
              Hiring across India — {companyStat.number} companies actively recruiting on Mzobs
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
                src="/images/new_images/hero_banner.jpg"
                alt="Mzobs Hiring Platform Overview"
                fetchPriority="high"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-lg text-xs font-bold text-black flex items-center justify-between">
                <div>
                  <span className="text-[#333333] font-extrabold block text-sm">100% Verified Profiles</span>
                  <span className="text-[#666] font-medium text-[11px]">Real people, pre-screened roles</span>
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
