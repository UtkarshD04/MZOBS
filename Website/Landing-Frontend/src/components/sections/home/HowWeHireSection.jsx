import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ArrowRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import TiltCard from '../../ui/TiltCard'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { OUR_GOAL_DATA, APPROACH_DATA } from '../../../lib/content'

export default function HowWeHireSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F5F5] via-[#eef3ea] to-[#F5F5F5] py-16 md:py-24 px-6 md:px-12">
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(61,92,52,.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(circle at 50% 30%, #000 0%, transparent 70%)',
        }}
      />
      <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-[var(--careers-accent)]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-3xl mx-auto text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
            <SplitText text={`${OUR_GOAL_DATA.titlePrefix}${OUR_GOAL_DATA.titleItalic}${OUR_GOAL_DATA.titleSuffix}`} />
          </h2>
          <p className="text-[15px] sm:text-base text-[#595959] leading-relaxed font-medium">{OUR_GOAL_DATA.desc}</p>
        </Reveal>

        <StaggerGroup className="mt-14 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row lg:items-stretch gap-5 lg:gap-3">
          {APPROACH_DATA.steps.map((step, i) => {
            const Icon = step.icon
            return (
              <Fragment key={step.num}>
                <StaggerItem className="lg:flex-1 lg:min-w-0">
                  <TiltCard
                    maxTilt={3}
                    y={-8}
                    className="group relative bg-white rounded-3xl p-6 h-full border border-[#e0e0e0] shadow-sm hover:shadow-xl hover:border-[var(--careers-accent)]/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#eef3ea] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <Icon size={20} strokeWidth={1.8} className="text-[var(--careers-accent)]" />
                      </div>
                      <span className="text-[13px] font-black text-[var(--careers-accent)]/60">{step.num}</span>
                    </div>
                    <h3 className="text-[15px] font-black text-black mb-1.5 leading-snug">{step.title}</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed">{step.desc}</p>
                  </TiltCard>
                </StaggerItem>

                {i < APPROACH_DATA.steps.length - 1 && (
                  <StaggerItem className="hidden lg:flex items-center justify-center flex-shrink-0 text-[var(--careers-accent)]/50">
                    <ChevronRight size={22} strokeWidth={2.5} />
                  </StaggerItem>
                )}
              </Fragment>
            )
          })}
        </StaggerGroup>

        <Reveal direction="up" delay={0.15} duration={0.7} className="mt-10 text-center">
          <Link
            to="/our-story"
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--careers-accent)] hover:text-black transition-colors"
          >
            Our Story <ArrowRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
