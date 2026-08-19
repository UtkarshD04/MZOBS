import Reveal from '../../ui/Reveal'
import SectionLabel from '../../ui/SectionLabel'
import SplitText from '../../ui/SplitText'
import TiltCard from '../../ui/TiltCard'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { APPROACH_DATA } from '../../../lib/content'

export default function AboutApproachSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f1eefc] to-white py-16 md:py-24 px-6 md:px-12">
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(124,95,214,.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(circle at 50% 40%, #000 0%, transparent 70%)',
        }}
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[520px] h-[300px] bg-[#a594ff]/12 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-3xl mx-auto text-center space-y-5">
          <SectionLabel className="mx-auto">HOW WE WORK</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
            <SplitText text="Verification, Not Just Listings" className="justify-center" />
          </h2>
          <p className="text-[15px] sm:text-base text-[#595959] leading-relaxed font-medium">
            The same four steps power every profile and every requirement on Mzobs.
          </p>
        </Reveal>

        <StaggerGroup className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {APPROACH_DATA.steps.map((step) => {
            const Icon = step.icon
            return (
              <StaggerItem key={step.num}>
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
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
