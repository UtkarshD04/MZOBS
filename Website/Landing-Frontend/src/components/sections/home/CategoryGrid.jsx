import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, Code2, BarChart3, PenLine, Megaphone, TrendingUp, Landmark,
  Users, SlidersHorizontal, Headphones, Wrench, HeartPulse, Layers,
} from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { CATEGORY_DATA } from '../../../lib/content'
import { useAutoRail } from '../../../lib/useAutoRail'

function paramsFor(cat) {
  if (cat.search) return { q: cat.search }
  if (cat.searchParams) return cat.searchParams
  if (cat.trackKey === 'finance') return { q: cat.title }
  return { track: cat.trackKey }
}

// Fixed display order, same as the design. Counts and growth are placeholder
// (dummy) figures, not live data.
const CATEGORIES = [
  { title: 'Software & Technology', count: 2840, growth: '+14%', icon: Code2, trackKey: 'tech', bg: '#EAF0FE', color: '#2F54D6' },
  { title: 'Data & Analytics', count: 1460, growth: '+21%', icon: BarChart3, search: 'Data', bg: '#E3F3EE', color: '#1E8E6E' },
  { title: 'Design', count: 620, icon: PenLine, trackKey: 'design', bg: '#FDEBF1', color: '#D6336C' },
  { title: 'Marketing', count: 1180, growth: '+8%', icon: Megaphone, trackKey: 'marketing', bg: '#FDEEE3', color: '#C2410C' },
  { title: 'Sales', count: 2310, icon: TrendingUp, trackKey: 'sales', bg: '#E4F4E9', color: '#1E8E4A' },
  { title: 'Finance', count: 970, growth: '+6%', icon: Landmark, trackKey: 'finance', bg: '#E9EBFB', color: '#4650C8' },
  { title: 'Human Resources', count: 540, icon: Users, trackKey: 'hr', bg: '#FEF1DC', color: '#C2620A' },
  { title: 'Operations', count: 1050, icon: SlidersHorizontal, trackKey: 'ops', bg: '#ECEFF3', color: '#475569' },
  { title: 'Customer Support', count: 1720, growth: '+11%', icon: Headphones, trackKey: 'support', bg: '#E1F0FB', color: '#1B78BD' },
  { title: 'Engineering', count: 1390, growth: '+17%', icon: Wrench, search: 'Engineer', bg: '#EFE8FB', color: '#6D3FC9' },
  { title: 'Healthcare', count: 860, growth: '+9%', icon: HeartPulse, search: 'Healthcare', bg: '#FDE9EA', color: '#D62839' },
  { title: 'Product Management', count: 410, icon: Layers, search: 'Product', bg: '#E2F0F5', color: '#137A94' },
]

export default function CategoryGrid({ onSelect }) {
  const sectionRef = useRef(null)
  useAutoRail(sectionRef)
  const reduceMotion = useReducedMotion()
  const categories = CATEGORIES

  function handleSelect(cat) {
    onSelect?.({ q: '', location: '', experience: '', ...paramsFor(cat) })
  }

  return (
    <section ref={sectionRef} id="categories" className="bg-[#f4f6f9] py-14 md:py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header — eyebrow, title, subtitle + "Browse all jobs" link */}
        <Reveal direction="up" duration={0.6} className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.08em] text-(--explorer-blue)">
              <span className="block h-px w-4 bg-(--explorer-blue)" aria-hidden="true" />
              Browse by category
            </span>
            <h2 className="mt-2 text-[32px] sm:text-[40px] font-black leading-[1.08] tracking-tight text-balance text-(--explorer-navy)">
              {CATEGORY_DATA.title}
            </h2>
            <p className="mt-2 text-[15px] text-(--explorer-navy)/70 leading-relaxed">
              {CATEGORY_DATA.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelect?.({ q: '', location: '', experience: '' })}
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-(--explorer-navy) hover:text-(--explorer-blue) motion-safe:transition-colors"
          >
            Browse all jobs <ArrowRight size={15} aria-hidden="true" />
          </button>
        </Reveal>

        {/* Card grid */}
        <motion.div
          data-auto-rail
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 -mx-6 px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {categories.map((cat) => {
                const Icon = cat.icon

                return (
                  <motion.div
                    key={cat.title}
                    className="w-[64%] shrink-0 snap-start sm:w-auto"
                                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(cat)}
                      className="group w-full h-full min-h-[96px] text-left flex items-center gap-4 rounded-xl border border-[#e6eaf0] bg-white px-5 py-4 motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-300 hover:border-(--explorer-blue-border) hover:shadow-[0_14px_30px_-14px_rgba(22,50,79,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
                    >
                      <span
                        className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
                        style={{ backgroundColor: cat.bg, color: cat.color }}
                      >
                        <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14.5px] font-bold text-(--explorer-navy) leading-snug">{cat.title}</span>
                        <span className="block text-[12.5px] mt-0.5 text-(--explorer-muted)">
                          {`${cat.count.toLocaleString('en-IN')} open job${cat.count === 1 ? '' : 's'}`}
                        </span>
                        {cat.growth && (
                          <span className="block text-[11.5px] mt-1 font-semibold text-[#16803c]">{cat.growth} this month</span>
                        )}
                      </span>
                      <ArrowRight
                        size={16}
                        className="shrink-0 text-slate-400 motion-safe:transition-all motion-safe:duration-300 group-hover:translate-x-0.5 group-hover:text-(--explorer-blue)"
                        aria-hidden="true"
                      />
                    </button>
                  </motion.div>
                )
              })}
        </motion.div>
      </div>
    </section>
  )
}
