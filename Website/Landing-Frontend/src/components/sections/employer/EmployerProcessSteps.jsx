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

<<<<<<< Updated upstream
function RequirementFragment() {
  return (
    <div className="rounded-xl border border-[#111827]/10 bg-[#eeefff] p-4">
      <div className="flex items-center justify-between text-[12.5px]">
        <span className="text-[#667085] font-medium">Role</span>
        <span className="text-[#111827] font-semibold">Backend Engineer</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[12.5px]">
        <span className="text-[#667085] font-medium">Experience</span>
        <span className="text-[#111827] font-semibold">3–5 years</span>
      </div>
    </div>
  )
}

function DiscoverFragment() {
  const rows = [
    { initials: 'RS', match: '94%' },
    { initials: 'PM', match: '92%' },
    { initials: 'AG', match: '89%' },
  ]
  return (
    <div className="rounded-xl border border-[#111827]/10 bg-[#eeefff] p-4 space-y-2">
      {rows.map((r) => (
        <div key={r.initials} className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#ccceff] text-[#111827] text-[9.5px] font-bold flex items-center justify-center shrink-0">{r.initials}</span>
          <span className="h-1.5 flex-1 rounded-full bg-white" />
          <span className="text-[9.5px] font-bold text-[#4a4ed8] shrink-0">{r.match}</span>
        </div>
      ))}
    </div>
  )
}

function UnderstandFragment() {
  const rows = [
    { label: 'Skills', value: 96 },
    { label: 'Location', value: 100 },
  ]
  return (
    <div className="rounded-xl border border-[#111827]/10 bg-[#eeefff] p-4 space-y-2.5">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-center justify-between text-[10.5px] mb-1">
            <span className="text-[#667085] font-medium">{r.label}</span>
            <span className="text-[#111827] font-bold">{r.value}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white overflow-hidden">
            <div className="h-full rounded-full bg-[#4a4ed8]" style={{ width: `${r.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function ShortlistFragment() {
  const cols = ['Applied', 'Shortlisted', 'Interview']
  return (
    <div className="rounded-xl border border-[#111827]/10 bg-[#eeefff] p-4 grid grid-cols-3 gap-2">
      {cols.map((c, i) => (
        <div key={c} className="rounded-lg bg-[#F1EDE5] p-2">
          <span className="text-[9px] font-bold text-[#667085] uppercase tracking-wide">{c}</span>
          <div className={`mt-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#F36D4C]/25' : i === 1 ? 'bg-[#F36D4C]/55' : 'bg-[#F36D4C]'}`} />
        </div>
      ))}
    </div>
  )
}

function InterviewFragment() {
  return (
    <div className="rounded-xl border border-[#111827]/10 bg-[#eeefff] p-4 flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#ccceff] text-[#111827] shrink-0">
        <CalendarCheck size={16} />
      </span>
      <div>
        <p className="text-[12px] font-semibold text-[#111827]">Technical round</p>
        <p className="text-[10.5px] text-[#667085]">Thu, 3:30 PM · Confirmed</p>
      </div>
    </div>
  )
}

function HireFragment() {
  return (
    <div className="rounded-xl border border-[#111827]/10 bg-[#eeefff] p-4 flex items-center justify-between">
      <span className="flex items-center gap-2 text-[12px] font-semibold text-[#111827]">
        <Sparkles size={14} className="text-[#4a4ed8]" /> Offer accepted
      </span>
      <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#4a4ed8] bg-[#DCECE3] rounded-full px-2 py-1">Hired</span>
    </div>
  )
}

=======
>>>>>>> Stashed changes
export default function EmployerProcessSteps() {
  const storyRef = useRef(null)
  useStoryProgress(storyRef)
  return (
<<<<<<< Updated upstream
    <section ref={storyRef} id="how-it-works" className="relative overflow-hidden bg-[#111827] py-20 md:py-28 px-6 md:px-12">
      <div aria-hidden="true" className="absolute -right-28 top-10 h-72 w-72 rounded-full bg-[#4a4ed8] blur-[90px] opacity-70" />
      <div className="max-w-7xl mx-auto">
        <FadeInView className="max-w-xl">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[48px] font-bold text-[#eeefff] tracking-tight leading-tight">A clearer path from role to right person.</h2>
          <p className="mt-3 text-[15px] text-white/60 leading-relaxed">From requirement to right person — one continuous Mzobs experience.</p>
        </FadeInView>
=======
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
>>>>>>> Stashed changes

          {STEPS.map((step) => (
<<<<<<< Updated upstream
            <div data-story-card key={step.num} className="relative">
              <span className="text-[15px] font-bold text-[#B9D6CC] bg-[#111827] pr-3">{step.num}</span>
              <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">{step.tag}</span>
              <h3 className="mt-3 text-[15px] font-bold text-[#eeefff] leading-snug">{step.title}</h3>
              <p className="mt-2 text-[12.5px] text-white/60 leading-relaxed">{step.desc}</p>
              <div className="mt-4">
                <step.Fragment />
              </div>
=======
            <div data-story-card key={step.title} className="relative flex flex-col items-center gap-3">
              <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-(--explorer-navy-deep) border border-white/15 text-white">
                <step.icon size={20} strokeWidth={1.8} />
              </span>
              <p className="text-[14px] font-bold text-white">{step.title}</p>
>>>>>>> Stashed changes
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
