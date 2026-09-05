import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { HOW_IT_WORKS_DATA } from '../../../lib/content'

export default function HowItWorksSteps() {
  return (
    <section className="bg-white py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="max-w-xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-(--jobs-navy) tracking-tight">{HOW_IT_WORKS_DATA.title}</h2>
          <p className="mt-2 text-[15px] text-(--jobs-ink-soft)">{HOW_IT_WORKS_DATA.subtitle}</p>
        </Reveal>

        <StaggerGroup className="grid sm:grid-cols-3 gap-8 sm:gap-6 relative">
          {HOW_IT_WORKS_DATA.steps.map((step, i) => {
            const Icon = step.icon
            return (
              <StaggerItem key={step.title} className="relative flex flex-col items-start gap-4">
                {i < HOW_IT_WORKS_DATA.steps.length - 1 && (
                  <span
                    className="hidden sm:block absolute top-7 left-[calc(50%+2.25rem)] w-[calc(100%-4.5rem)] border-t border-dashed border-(--jobs-border)"
                    aria-hidden="true"
                  />
                )}
                <div className="relative w-14 h-14 rounded-2xl bg-(--jobs-teal-tint) flex items-center justify-center text-(--jobs-teal-dark) shrink-0">
                  <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
                  <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-linear-to-br from-(--jobs-teal) to-(--jobs-navy) text-white text-[12px] font-bold flex items-center justify-center ring-[3px] ring-white shadow-[0_2px_8px_rgba(16,42,67,0.35)]">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-(--jobs-navy)">{step.title}</h3>
                  <p className="mt-1.5 text-[13.5px] text-(--jobs-ink-soft) leading-relaxed">{step.desc}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
