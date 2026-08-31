import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import SpotlightCard from '../../ui/SpotlightCard'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { SERVICES_DATA } from '../../../lib/content'

const TINTS = ['bg-[var(--careers-tint-blue)]', 'bg-[var(--careers-tint-sage)]', 'bg-[var(--careers-tint-sand)]', 'bg-[var(--careers-tint-rose)]']

const CTA_CLASS =
  'mt-5 inline-flex items-center gap-1 text-[12px] font-black text-black uppercase tracking-wide rounded-full -mx-1 -my-1 px-1 py-1 transition-colors duration-300 hover:text-[var(--careers-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--careers-accent)]/50'

export default function SpotlightGrid() {
  const [expanded, setExpanded] = useState(() => new Set())

  function toggle(title) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }
      return next
    })
  }

  return (
    <section id="services" className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
            <SplitText text={`${SERVICES_DATA.titlePrefix}${SERVICES_DATA.titleItalic}`} />
          </h2>
        </Reveal>

        <StaggerGroup className="grid items-start sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_DATA.services.map((service, i) => {
            const Icon = service.icon
            const isOpen = expanded.has(service.title)
            return (
              <StaggerItem key={service.title}>
                <SpotlightCard
                  glow="rgba(255,255,255,0.55)"
                  className={`rounded-3xl p-6 min-h-[264px] flex flex-col border border-black/[0.04] ${TINTS[i % TINTS.length]} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center mb-6 transition-transform duration-300 group-hover/spotlight:scale-110">
                    <Icon size={22} strokeWidth={1.8} className="text-black" />
                  </div>
                  <h3 className="text-lg font-black text-black leading-snug mb-2">{service.title}</h3>
                  <p className="text-[13px] text-[#444] leading-relaxed flex-1">{service.desc}</p>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="expanded"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 text-[13px] text-[#444] leading-relaxed">{service.expandedText}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={() => toggle(service.title)}
                    aria-expanded={isOpen}
                    className={CTA_CLASS}
                  >
                    {isOpen ? 'Show less' : 'Learn more'}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover/spotlight:translate-y-0.5'}`}
                    />
                  </button>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
