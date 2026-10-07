import { useLayoutEffect, useRef, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FadeInView } from './employerMotion'

gsap.registerPlugin(ScrollTrigger)

// Illustrative only — product preview, not real candidates. See the "Product
// preview" label on the mockup itself and each candidate's own note.
const CHIPS = ['Python Developer', '2–4 years', 'FastAPI', 'AWS', 'Bengaluru', '≤30 days']

const CANDIDATES = [
  { initials: 'RS', name: 'Rahul Sharma', role: 'Senior Python Developer', skills: 'Python · FastAPI · AWS', match: 94, availability: 'Available in 18 days' },
  { initials: 'PM', name: 'Priya Mehta', role: 'Backend Engineer', skills: 'Python · Django · AWS', match: 92, availability: 'Available immediately' },
  { initials: 'AG', name: 'Aman Gupta', role: 'Software Engineer', skills: 'Python · FastAPI · Docker', match: 89, availability: 'Available in 24 days' },
]

const BREAKDOWN = [
  { label: 'Skills Match', value: 96 },
  { label: 'Experience Match', value: 91 },
  { label: 'Location Match', value: 100 },
  { label: 'Availability Match', value: 88 },
]

function QueryCard() {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      gsap.set('[data-tl-chip]', { autoAlpha: 0, y: 8, scale: 0.94 })
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true } })
        .from('[data-tl-query]', { autoAlpha: 0, y: 14, duration: 0.6, ease: 'power3.out' })
        .to('[data-tl-chip]', { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.09, ease: 'back.out(1.6)' }, '-=0.15')
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="rounded-[28px] border border-[#111827]/15 bg-white p-6 sm:p-8 shadow-[0_18px_35px_-24px_rgba(32,37,31,0.28)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#667085]">What are you looking for?</p>
      <p data-tl-query className="mt-3 text-[15px] sm:text-[16px] leading-relaxed text-[#111827]">
        "Python developer with 2–4 years of experience, strong FastAPI and AWS skills, based in Bengaluru and available within 30 days."
      </p>
      <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#111827] px-5 h-11 text-[13.5px] font-bold text-[#e7f5f1] transition-transform duration-200 hover:-translate-y-1">
        <Sparkles size={15} /> Find Talent
      </button>

      <div className="mt-6 pt-6 border-t border-[#111827]/10 flex flex-wrap gap-2">
        {CHIPS.map((chip) => (
          <span data-tl-chip key={chip} className="inline-flex items-center rounded-full bg-[#DCECE3] px-3.5 py-1.5 text-[12.5px] font-bold text-[#075f55]">
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

function CandidateRow({ candidate, expanded, onToggle }) {
  return (
    <div className="rounded-2xl border border-[#111827]/12 bg-white overflow-hidden">
      <button type="button" onClick={onToggle} aria-expanded={expanded} className="w-full flex items-center gap-3.5 p-4 text-left">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#b8d6d0] text-[12px] font-extrabold text-[#111827]">{candidate.initials}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13.5px] font-bold text-[#111827] truncate">{candidate.name}</p>
          </div>
          <p className="text-[12px] text-[#667085] truncate">{candidate.role}</p>
          <p className="text-[11.5px] text-[#667085]/80 mt-0.5 truncate">{candidate.skills}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="inline-block rounded-full bg-[#DCECE3] px-2.5 py-1 text-[11px] font-extrabold text-[#075f55]">{candidate.match}% Match</span>
          <p className="text-[10.5px] text-[#667085] mt-1.5">{candidate.availability}</p>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-5 pt-1 border-t border-[#111827]/10">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085] mb-3">Why this match?</p>
          <div className="flex flex-col gap-2.5">
            {BREAKDOWN.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between text-[11.5px] mb-1">
                  <span className="text-[#667085] font-medium">{d.label}</span>
                  <span className="font-bold text-[#111827]">{d.value}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#F1EDE5] overflow-hidden">
                  <div className="h-full rounded-full bg-[#075f55]" style={{ width: `${d.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-1.5 text-[12px] text-[#111827]">
            <span className="flex items-center gap-1.5"><Check size={13} className="text-[#075f55]" /> Strong FastAPI experience</span>
            <span className="flex items-center gap-1.5"><Check size={13} className="text-[#075f55]" /> Relevant backend experience</span>
            <span className="flex items-center gap-1.5"><Check size={13} className="text-[#075f55]" /> Bengaluru based</span>
          </div>
          <p className="mt-3 text-[11.5px] text-[#667085]">Potential gap: notice period slightly above preferred range.</p>
        </div>
      )}
    </div>
  )
}

function ResultsCard() {
  const [expandedIdx, setExpandedIdx] = useState(0)
  return (
    <div className="rounded-[28px] border border-[#111827]/15 bg-[#F1EDE5] p-6 sm:p-7">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#667085]">Matching talent</p>
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#667085]/70 bg-white rounded-full px-2.5 py-1">Product preview</span>
      </div>
      <div className="flex flex-col gap-3">
        {CANDIDATES.map((c, i) => (
          <CandidateRow key={c.name} candidate={c} expanded={expandedIdx === i} onToggle={() => setExpandedIdx(expandedIdx === i ? -1 : i)} />
        ))}
      </div>
      <p className="mt-4 text-[11px] text-[#667085]/80 text-center">Illustrative example, not real candidate data.</p>
    </div>
  )
}

export default function EmployerTalentLensSection() {
  return (
    <section id="talent-lens" className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeInView className="max-w-xl">
          <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#075f55]">Talent Lens</span>
          <h2 className="mt-3 font-sans text-3xl sm:text-4xl md:text-[46px] font-bold text-[#111827] tracking-tight leading-tight">
            Find the right people, beyond the keywords.
          </h2>
          <p className="mt-3 text-[15px] text-[#111827]/70 leading-relaxed">
            Describe the person you're looking for and let Mzobs turn your requirement into a focused talent search.
          </p>
        </FadeInView>

        <div className="mt-12 grid lg:grid-cols-2 gap-6 items-start">
          <FadeInView delay={0.05}>
            <QueryCard />
          </FadeInView>
          <FadeInView delay={0.12}>
            <ResultsCard />
          </FadeInView>
        </div>
      </div>
    </section>
  )
}
