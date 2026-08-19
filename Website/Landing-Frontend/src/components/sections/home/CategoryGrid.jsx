import { ArrowUpRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SectionLabel from '../../ui/SectionLabel'
import SplitText from '../../ui/SplitText'
import SpotlightCard from '../../ui/SpotlightCard'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { CATEGORY_DATA } from '../../../lib/content'
import { EMPLOYEE_APP_URL } from '../../../lib/config'

// Brighter, more saturated than the site's default muted tint tokens —
// this grid reads too monochrome at the softer shade, so it uses its own
// punchier palette instead of the shared `--careers-tint-*` vars.
const TINTS = ['bg-[#cfe8fb]', 'bg-[#cdeec5]', 'bg-[#ffe2b0]', 'bg-[#ffd0de]']

export default function CategoryGrid() {
  return (
    <section className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl">
          <SectionLabel>{CATEGORY_DATA.badge}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
            <SplitText text={`${CATEGORY_DATA.titlePrefix}${CATEGORY_DATA.titleItalic}${CATEGORY_DATA.titleSuffix}`} />
          </h2>
          <p className="mt-2 text-[15px] text-[#595959] leading-relaxed font-medium">{CATEGORY_DATA.subtitle}</p>
        </Reveal>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORY_DATA.categories.map((cat, i) => {
            return (
              <StaggerItem key={cat.title}>
                <SpotlightCard
                  as="a"
                  href={`${EMPLOYEE_APP_URL}?category=${encodeURIComponent(cat.title)}`}
                  glow="rgba(255,255,255,0.35)"
                  className={`flex items-center gap-4 rounded-2xl p-4 border border-black/[0.04] hover:bg-[var(--careers-accent)] transition-colors duration-300 ${TINTS[i % TINTS.length]}`}
                >
                  {cat.image && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/60 shadow-sm">
                      <img src={cat.image} alt={cat.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover/spotlight:scale-110" />
                    </div>
                  )}
                  <span className="font-black text-[15px] text-black group-hover/spotlight:text-white transition-colors duration-300">
                    {cat.title}
                  </span>
                  <ArrowUpRight size={18} className="ml-auto text-black/40 group-hover/spotlight:text-white group-hover/spotlight:translate-x-1 group-hover/spotlight:-translate-y-1 transition-all duration-300" />
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
