import { useRef } from 'react'
import { FadeInView, useStoryProgress } from './employerMotion'

const STEPS = [
  {
    num: '01',
    title: 'Create your requirement',
    desc: 'Tell us what the job needs — responsibilities, experience and location — and MZOBS turns it into a live posting.',
    Fragment: RequirementFragment,
  },
  {
    num: '02',
    title: 'Receive relevant applications',
    desc: 'Every application is checked against your requirement before it reaches you, so your dashboard fills with people who actually fit.',
    Fragment: ApplicationsFragment,
  },
  {
    num: '03',
    title: 'Review, shortlist, and move forward',
    desc: 'Shortlist, message or reject directly from your workspace the moment an application comes in.',
    Fragment: ShortlistFragment,
  },
]

function RequirementFragment() {
  return (
    <div className="rounded-xl border border-[#20251F]/10 bg-[#FAF7F1] p-4">
      <div className="flex items-center justify-between text-[12.5px]">
        <span className="text-[#526051] font-medium">Role</span>
        <span className="text-[#20251F] font-semibold">Backend Engineer</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[12.5px]">
        <span className="text-[#526051] font-medium">Experience</span>
        <span className="text-[#20251F] font-semibold">3–5 years</span>
      </div>
    </div>
  )
}

function ApplicationsFragment() {
  return (
    <div className="rounded-xl border border-[#20251F]/10 bg-[#FAF7F1] p-4 space-y-2">
      {['RK', 'SP', 'AM'].map((initials) => (
        <div key={initials} className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#F6C16E]/60 text-[#20251F] text-[10px] font-bold flex items-center justify-center shrink-0">
            {initials}
          </span>
          <span className="h-1.5 flex-1 rounded-full bg-[#F1EDE5]" />
        </div>
      ))}
    </div>
  )
}

function ShortlistFragment() {
  const cols = ['Applied', 'Shortlisted', 'Interview']
  return (
    <div className="rounded-xl border border-[#20251F]/10 bg-[#FAF7F1] p-4 grid grid-cols-3 gap-2">
      {cols.map((c, i) => (
        <div key={c} className="rounded-lg bg-[#F1EDE5] p-2">
          <span className="text-[9px] font-bold text-[#526051] uppercase tracking-wide">{c}</span>
          <div className={`mt-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#F36D4C]/25' : i === 1 ? 'bg-[#F36D4C]/55' : 'bg-[#F36D4C]'}`} />
        </div>
      ))}
    </div>
  )
}

export default function EmployerProcessSteps() {
  const storyRef = useRef(null)
  useStoryProgress(storyRef)
  return (
    <section ref={storyRef} id="how-it-works" className="relative overflow-hidden bg-[#20251F] py-20 md:py-28 px-6 md:px-12">
      <div aria-hidden="true" className="absolute -right-28 top-10 h-72 w-72 rounded-full bg-[#1F5A43] blur-[90px] opacity-70" />
      <div className="max-w-7xl mx-auto">
        <FadeInView className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[48px] font-bold text-[#FAF7F1] tracking-tight leading-tight">A clearer path from role to right person.</h2>
        </FadeInView>

        <div className="mt-14 relative grid sm:grid-cols-3 gap-10 sm:gap-8">
          <span className="hidden sm:block absolute top-[22px] left-[8%] right-[8%] h-px bg-white/20" aria-hidden="true" />
          <span data-story-line className="hidden sm:block absolute origin-left top-[22px] left-[8%] right-[8%] h-px scale-x-0 bg-[#B9D6CC]" aria-hidden="true" />
          {STEPS.map((step, i) => (
            <div data-story-card key={step.num} className="relative">
              <span className="text-[15px] font-bold text-[#B9D6CC] bg-[#20251F] pr-3">{step.num}</span>
              <h3 className="mt-4 text-lg font-bold text-[#FAF7F1] leading-snug">{step.title}</h3>
              <p className="mt-2.5 text-sm text-white/60 leading-relaxed">{step.desc}</p>
              <div className="mt-5">
                <step.Fragment />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
