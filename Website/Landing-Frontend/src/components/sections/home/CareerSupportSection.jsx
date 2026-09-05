import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { CAREER_SUPPORT_DATA } from '../../../lib/content'

export default function CareerSupportSection() {
  return (
    <section id="career-support" className="bg-(--jobs-bg-subtle) py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="max-w-xl mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-(--jobs-navy) tracking-tight">{CAREER_SUPPORT_DATA.title}</h2>
          <p className="mt-2 text-[15px] text-(--jobs-ink-soft)">{CAREER_SUPPORT_DATA.subtitle}</p>
        </Reveal>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAREER_SUPPORT_DATA.points.map((point) => {
            const Icon = point.icon
            return (
              <StaggerItem key={point.title} className="flex flex-col items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-white border border-(--jobs-border) flex items-center justify-center text-(--jobs-teal-dark)">
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] text-(--jobs-navy)">{point.title}</h3>
                  <p className="mt-1 text-[13.5px] text-(--jobs-ink-soft) leading-relaxed">{point.desc}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
