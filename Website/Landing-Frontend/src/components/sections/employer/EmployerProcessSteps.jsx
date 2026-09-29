import { useRef } from 'react'
import { Briefcase, Search, ListChecks, CalendarCheck, CheckCircle2 } from 'lucide-react'
import { useStoryProgress } from '../../../lib/employerMotionHooks'

const STEPS = [
  { icon: Briefcase, title: 'Post a Job' },
  { icon: Search, title: 'Discover Talent' },
  { icon: ListChecks, title: 'Shortlist' },
  { icon: CalendarCheck, title: 'Interview' },
  { icon: CheckCircle2, title: 'Hire' },
]

export default function EmployerProcessSteps() {
  const storyRef = useRef(null)
  useStoryProgress(storyRef)
  return (
    <section ref={storyRef} id="how-it-works" className="relative overflow-hidden bg-(--explorer-navy-deep) py-20 md:py-28 px-6 md:px-12">
      <div aria-hidden="true" className="absolute -right-28 top-10 h-72 w-72 rounded-full bg-(--explorer-teal) blur-[100px] opacity-15" />
      <div className="max-w-5xl mx-auto text-center">
        <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-(--explorer-teal)">Simple hiring workflow</span>
        <h2 className="mt-3 font-sans text-3xl sm:text-4xl md:text-[44px] font-bold text-white tracking-tight leading-tight">
          From Requirement to Hire.
        </h2>

        <div className="relative mt-16 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-between">
          <span className="hidden sm:block absolute top-[26px] left-[8%] right-[8%] h-px bg-white/15" aria-hidden="true" />
          <span data-story-line className="hidden sm:block absolute origin-left top-[26px] left-[8%] right-[8%] h-px scale-x-0 bg-(--explorer-teal)" aria-hidden="true" />

          {STEPS.map((step) => (
            <div data-story-card key={step.title} className="relative flex flex-col items-center gap-3">
              <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-(--explorer-navy-deep) border border-white/15 text-white">
                <step.icon size={20} strokeWidth={1.8} />
              </span>
              <p className="text-[14px] font-bold text-white">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
