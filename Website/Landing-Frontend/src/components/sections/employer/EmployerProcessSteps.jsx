import { useRef } from 'react'
import { CalendarCheck, Sparkles } from 'lucide-react'
import { FadeInView, useStoryProgress } from './employerMotion'

// The full Mzobs hiring journey — from describing a role to making the hire.
// Each stage keeps the same small "product state" fragment style the
// original 3-step version used (see git history), just widened to six.
const STEPS = [
  { num: '01', tag: 'Define', title: 'Create your requirement', desc: 'Tell us what the job needs — responsibilities, experience and location — and MZOBS turns it into a live posting.', Fragment: RequirementFragment },
  { num: '02', tag: 'Discover', title: 'Discover relevant talent', desc: "Describe who you're looking for with Talent Lens, and see focused results instead of a pile of unrelated resumes.", Fragment: DiscoverFragment },
  { num: '03', tag: 'Understand', title: 'Understand the match', desc: 'Every recommendation comes with a plain-language reason, so you can see where a candidate fits before you reach out.', Fragment: UnderstandFragment },
  { num: '04', tag: 'Shortlist', title: 'Shortlist with context', desc: 'Save promising people to a Talent Pool or move them forward — with notes and status kept in one place.', Fragment: ShortlistFragment },
  { num: '05', tag: 'Interview', title: 'Move into interviews', desc: 'Schedule and track interview rounds against the shortlist, without losing the thread across chats and calls.', Fragment: InterviewFragment },
  { num: '06', tag: 'Hire', title: 'Make the hire', desc: 'Track the offer through to acceptance, and close the loop on the requirement you opened with.', Fragment: HireFragment },
]

function RequirementFragment() {
  return (
    <div className="rounded-xl border border-[#102a43]/10 bg-[#e8f8f5] p-4">
      <div className="flex items-center justify-between text-[12.5px]">
        <span className="text-[#51697e] font-medium">Role</span>
        <span className="text-[#102a43] font-semibold">Backend Engineer</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[12.5px]">
        <span className="text-[#51697e] font-medium">Experience</span>
        <span className="text-[#102a43] font-semibold">3–5 years</span>
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
    <div className="rounded-xl border border-[#102a43]/10 bg-[#e8f8f5] p-4 space-y-2">
<<<<<<< Updated upstream
      {['RK', 'SP', 'AM'].map((initials) => (
        <div key={initials} className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#12a594]/60 text-[#102a43] text-[10px] font-bold flex items-center justify-center shrink-0">
            {initials}
          </span>
          <span className="h-1.5 flex-1 rounded-full bg-[#f7f9fb]" />
=======
      {rows.map((r) => (
        <div key={r.initials} className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#bfdbfe] text-[#102a43] text-[9.5px] font-bold flex items-center justify-center shrink-0">{r.initials}</span>
          <span className="h-1.5 flex-1 rounded-full bg-white" />
          <span className="text-[9.5px] font-bold text-[#0a6f64] shrink-0">{r.match}</span>
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
    <div className="rounded-xl border border-[#102a43]/10 bg-[#e8f8f5] p-4 space-y-2.5">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-center justify-between text-[10.5px] mb-1">
            <span className="text-[#51697e] font-medium">{r.label}</span>
            <span className="text-[#102a43] font-bold">{r.value}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white overflow-hidden">
            <div className="h-full rounded-full bg-[#0a6f64]" style={{ width: `${r.value}%` }} />
          </div>
>>>>>>> Stashed changes
        </div>
      ))}
    </div>
  )
}

function ShortlistFragment() {
  const cols = ['Applied', 'Shortlisted', 'Interview']
  return (
    <div className="rounded-xl border border-[#102a43]/10 bg-[#e8f8f5] p-4 grid grid-cols-3 gap-2">
      {cols.map((c, i) => (
        <div key={c} className="rounded-lg bg-[#f7f9fb] p-2">
          <span className="text-[9px] font-bold text-[#51697e] uppercase tracking-wide">{c}</span>
          <div className={`mt-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#0a6f64]/25' : i === 1 ? 'bg-[#0a6f64]/55' : 'bg-[#0a6f64]'}`} />
        </div>
      ))}
    </div>
  )
}

function InterviewFragment() {
  return (
    <div className="rounded-xl border border-[#102a43]/10 bg-[#e8f8f5] p-4 flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#bfdbfe] text-[#102a43] shrink-0">
        <CalendarCheck size={16} />
      </span>
      <div>
        <p className="text-[12px] font-semibold text-[#102a43]">Technical round</p>
        <p className="text-[10.5px] text-[#51697e]">Thu, 3:30 PM · Confirmed</p>
      </div>
    </div>
  )
}

function HireFragment() {
  return (
    <div className="rounded-xl border border-[#102a43]/10 bg-[#e8f8f5] p-4 flex items-center justify-between">
      <span className="flex items-center gap-2 text-[12px] font-semibold text-[#102a43]">
        <Sparkles size={14} className="text-[#0a6f64]" /> Offer accepted
      </span>
      <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#0a6f64] bg-[#DCECE3] rounded-full px-2 py-1">Hired</span>
    </div>
  )
}

export default function EmployerProcessSteps() {
  const storyRef = useRef(null)
  useStoryProgress(storyRef)
  return (
    <section ref={storyRef} id="how-it-works" className="relative overflow-hidden bg-[#102a43] py-20 md:py-28 px-6 md:px-12">
      <div aria-hidden="true" className="absolute -right-28 top-10 h-72 w-72 rounded-full bg-[#0a6f64] blur-[90px] opacity-70" />
      <div className="max-w-7xl mx-auto">
        <FadeInView className="max-w-xl">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[48px] font-bold text-[#e8f8f5] tracking-tight leading-tight">A clearer path from role to right person.</h2>
          <p className="mt-3 text-[15px] text-white/60 leading-relaxed">From requirement to right person — one continuous Mzobs experience.</p>
        </FadeInView>

<<<<<<< Updated upstream
        <div className="mt-14 relative grid sm:grid-cols-3 gap-10 sm:gap-8">
          <span className="hidden sm:block absolute top-[22px] left-[8%] right-[8%] h-px bg-white/20" aria-hidden="true" />
          <span data-story-line className="hidden sm:block absolute origin-left top-[22px] left-[8%] right-[8%] h-px scale-x-0 bg-[#12a594]" aria-hidden="true" />
          {STEPS.map((step, i) => (
            <div data-story-card key={step.num} className="relative">
              <span className="text-[15px] font-bold text-[#12a594] bg-[#102a43] pr-3">{step.num}</span>
              <h3 className="mt-4 text-lg font-bold text-[#e8f8f5] leading-snug">{step.title}</h3>
              <p className="mt-2.5 text-sm text-white/60 leading-relaxed">{step.desc}</p>
              <div className="mt-5">
=======
        <div className="mt-14 relative grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-10">
          <span className="hidden xl:block absolute top-[22px] left-[4%] right-[4%] h-px bg-white/20" aria-hidden="true" />
          <span data-story-line className="hidden xl:block absolute origin-left top-[22px] left-[4%] right-[4%] h-px scale-x-0 bg-[#B9D6CC]" aria-hidden="true" />
          {STEPS.map((step) => (
            <div data-story-card key={step.num} className="relative">
              <span className="text-[15px] font-bold text-[#B9D6CC] bg-[#102a43] pr-3">{step.num}</span>
              <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">{step.tag}</span>
              <h3 className="mt-3 text-[15px] font-bold text-[#e8f8f5] leading-snug">{step.title}</h3>
              <p className="mt-2 text-[12.5px] text-white/60 leading-relaxed">{step.desc}</p>
              <div className="mt-4">
>>>>>>> Stashed changes
                <step.Fragment />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
