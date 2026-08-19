import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import SectionLabel from '../../ui/SectionLabel'
import { WHAT_MAKES_US_DIFFERENT_DATA } from '../../../lib/content'

const { badge, titlePrefix, titleItalic, titleSuffix, desc, columnLeft, columnRight, rows } =
  WHAT_MAKES_US_DIFFERENT_DATA

export default function AboutDifferenceSection() {
  const [active, setActive] = useState('mzobs') // 'traditional' | 'mzobs'
  const isMzobs = active === 'mzobs'

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="text-center mb-12">
          <SectionLabel className="mx-auto">{badge}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-tight mt-1">
            <SplitText text={`${titlePrefix}${titleItalic}${titleSuffix}`} className="justify-center" />
          </h2>
          <p className="mt-3 text-[15px] sm:text-base text-[#595959] font-medium max-w-2xl mx-auto">
            {desc}
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.1} className="flex justify-center mb-6 md:mb-8">
          <button
            type="button"
            onClick={() => setActive((a) => (a === 'mzobs' ? 'traditional' : 'mzobs'))}
            aria-pressed={isMzobs}
            aria-label="Toggle between traditional hiring and the Mzobs way"
            className="relative flex w-[260px] sm:w-[300px] h-12 md:h-13 rounded-full bg-[#F5F5F5] border border-[#e0e0e0] p-1 cursor-pointer select-none"
          >
            <motion.span
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full shadow-md"
              style={{ backgroundColor: isMzobs ? 'var(--careers-accent)' : '#000000' }}
              animate={{ left: isMzobs ? 'calc(50% + 0px)' : 4 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
            <span
              className={`relative z-10 flex-1 flex items-center justify-center text-[11.5px] md:text-[13px] font-black uppercase tracking-wide transition-colors duration-200 ${
                !isMzobs ? 'text-white' : 'text-[#999]'
              }`}
            >
              {columnLeft}
            </span>
            <span
              className={`relative z-10 flex-1 flex items-center justify-center text-[11.5px] md:text-[13px] font-black uppercase tracking-wide transition-colors duration-200 ${
                isMzobs ? 'text-white' : 'text-[#999]'
              }`}
            >
              {columnRight}
            </span>
          </button>
        </Reveal>

        <div className="rounded-3xl border border-[#e0e0e0] overflow-hidden divide-y divide-[#e0e0e0] shadow-sm">
          {rows.map((row, i) => {
            const Icon = row.icon
            return (
              <Reveal
                key={row.traditional}
                direction={i % 2 === 0 ? 'left' : 'right'}
                delay={0.05 * i}
                duration={0.7}
                className="grid grid-cols-2"
              >
                <div
                  className={`relative flex items-start gap-2.5 md:gap-3 p-4 sm:p-5 md:p-6 border-r border-[#e0e0e0] transition-all duration-300 ${
                    isMzobs ? 'opacity-35 scale-[0.98]' : 'opacity-100 scale-100'
                  }`}
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(135deg, #fafafa, #fafafa 11px, #f1f1ef 11px, #f1f1ef 12px)',
                  }}
                >
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#fdf0ee] border border-dashed border-[#e5a39b] flex items-center justify-center shrink-0 mt-0.5">
                    <X size={11} strokeWidth={3} className="text-[#b42318]" />
                  </div>
                  <p className="text-[12px] sm:text-[13.5px] md:text-[14.5px] text-[#7a7a75] font-serif italic font-medium leading-snug">
                    {row.traditional}
                  </p>
                </div>
                <div
                  className={`flex items-start gap-2.5 md:gap-3 p-4 sm:p-5 md:p-6 transition-all duration-300 ${
                    isMzobs ? 'opacity-100 scale-100' : 'opacity-35 scale-[0.98]'
                  }`}
                  style={{ backgroundColor: row.bg }}
                >
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/70 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={12} strokeWidth={2.5} style={{ color: row.ink }} />
                  </div>
                  <p
                    className="text-[12px] sm:text-[13.5px] md:text-[14.5px] font-bold leading-snug"
                    style={{ color: row.ink }}
                  >
                    {row.mzobs}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
