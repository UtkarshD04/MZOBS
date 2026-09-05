import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import SpotlightCard from '../../ui/SpotlightCard'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { EMPLOYER_FEATURES } from '../../../lib/content'

const TINTS = ['bg-(--jobs-teal-tint)', 'bg-(--jobs-blue-tint)', 'bg-amber-50', 'bg-(--jobs-gold-soft)']

export default function EmployerWhySection() {
  return (
    <section id="services" className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-(--jobs-navy) tracking-tight leading-tight">
            <SplitText text="Everything Hiring Teams Need, In One Portal" className="justify-center" />
          </h2>
          <p className="mt-4 text-[15px] sm:text-base text-(--jobs-ink-soft) leading-relaxed font-medium">
            From requirement to offer letter, without switching tools.
          </p>
        </Reveal>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EMPLOYER_FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <StaggerItem key={feature.title} className="h-full">
                <SpotlightCard
                  glow="rgba(255,255,255,0.55)"
                  className={`rounded-3xl p-6 h-full flex flex-col border border-(--jobs-border) ${TINTS[i % TINTS.length]} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center mb-6 transition-transform duration-300 group-hover/spotlight:scale-110">
                    <Icon size={22} strokeWidth={1.8} className="text-(--jobs-teal-dark)" />
                  </div>
                  <h3 className="text-lg font-black text-(--jobs-navy) leading-snug mb-2">{feature.title}</h3>
                  <p className="text-[13px] text-(--jobs-ink-soft) leading-relaxed flex-1">{feature.desc}</p>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

        <Reveal direction="up" className="flex justify-center pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-(--jobs-teal-dark) text-white text-sm font-bold border border-(--jobs-teal-dark) hover:bg-(--jobs-navy) hover:border-(--jobs-navy) transition-colors"
          >
            Talk to our team <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
