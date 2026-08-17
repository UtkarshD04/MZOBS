import Reveal from '../../ui/Reveal'
import SectionLabel from '../../ui/SectionLabel'
import SplitText from '../../ui/SplitText'
import TiltCard from '../../ui/TiltCard'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { OUR_GOAL_DATA, APPROACH_DATA } from '../../../lib/content'

export default function HowWeHireSection() {
  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-3xl mx-auto text-center space-y-5">
          <SectionLabel>{OUR_GOAL_DATA.badge}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
            <SplitText text={`${OUR_GOAL_DATA.titlePrefix}${OUR_GOAL_DATA.titleItalic}${OUR_GOAL_DATA.titleSuffix}`} />
          </h2>
          <p className="text-[15px] sm:text-base text-[#595959] leading-relaxed font-medium">{OUR_GOAL_DATA.desc}</p>
        </Reveal>

        <StaggerGroup className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {APPROACH_DATA.steps.map((step) => {
            const Icon = step.icon
            return (
              <StaggerItem key={step.num}>
                <TiltCard maxTilt={3} y={-6} className="bg-white rounded-3xl p-6 h-full border border-[#e0e0e0] hover:shadow-lg">
                  <span className="text-[13px] font-black text-[#333333]">{step.num}</span>
                  <div className="w-11 h-11 rounded-xl bg-[#F5F5F5] flex items-center justify-center my-4 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={20} strokeWidth={1.8} className="text-black" />
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
