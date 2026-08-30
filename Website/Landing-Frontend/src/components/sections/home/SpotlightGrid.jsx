import { ArrowUpRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import SpotlightCard from '../../ui/SpotlightCard'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { SERVICES_DATA } from '../../../lib/content'

const TINTS = ['bg-[var(--careers-tint-blue)]', 'bg-[var(--careers-tint-sage)]', 'bg-[var(--careers-tint-sand)]', 'bg-[var(--careers-tint-rose)]']

export default function SpotlightGrid() {
  return (
    <section id="services" className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
            <SplitText text={`${SERVICES_DATA.titlePrefix}${SERVICES_DATA.titleItalic}`} />
          </h2>
        </Reveal>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_DATA.services.map((service, i) => {
            const Icon = service.icon
            return (
              <StaggerItem key={service.title} className="h-full">
                <SpotlightCard
                  glow="rgba(255,255,255,0.55)"
                  className={`rounded-3xl p-6 h-full flex flex-col border border-black/[0.04] ${TINTS[i % TINTS.length]} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center mb-6 transition-transform duration-300 group-hover/spotlight:scale-110">
                    <Icon size={22} strokeWidth={1.8} className="text-black" />
                  </div>
                  <h3 className="text-lg font-black text-black leading-snug mb-2">{service.title}</h3>
                  <p className="text-[13px] text-[#444] leading-relaxed flex-1">{service.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-[12px] font-black text-black uppercase tracking-wide">
                    Learn more
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/spotlight:translate-x-1 group-hover/spotlight:-translate-y-1" />
                  </span>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
