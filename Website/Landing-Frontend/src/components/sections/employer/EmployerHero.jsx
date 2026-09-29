import { useRef } from 'react'
import { ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeInLoad } from './employerMotion'
import { useHeroScene } from '../../../lib/employerMotionHooks'
const candidates = [
  { initials: 'AS', name: 'Aditi Sharma', role: 'Product designer', score: '96% match', tone: 'bg-[#ccceff]' },
  { initials: 'RK', name: 'Rohit Kumar', role: 'Backend engineer', score: '92% match', tone: 'bg-[#eeefff]' },
  { initials: 'NM', name: 'Nisha Mehta', role: 'Growth lead', score: '89% match', tone: 'bg-[#eeefff]' },
]

function CandidateBoard() {
  return <div className="relative mx-auto max-w-[510px] lg:ml-auto">
    <div data-hero-glow className="absolute -top-8 -right-6 h-36 w-36 rounded-full bg-[#4a4ed8]/25 opacity-90 blur-[1px]" />
    <div className="absolute -bottom-8 -left-6 h-28 w-28 rounded-full bg-[#ccceff]" />
    <div data-hero-board className="relative rotate-[2deg] rounded-[30px] border border-[#111827] bg-[#eeefff] p-4 shadow-[10px_12px_0_#111827] sm:p-6">
      <div className="flex items-center justify-between border-b border-[#111827]/12 pb-5"><h2 className="text-xl font-bold text-[#111827]">Your shortlist, ready.</h2><span className="grid h-10 w-10 place-items-center rounded-full bg-[#111827] text-[#eeefff]"><Sparkles size={17} /></span></div>
      <div className="mt-4 space-y-3">{candidates.map((candidate, index) => <div key={candidate.name} className="flex items-center gap-3 rounded-2xl border border-[#111827]/10 bg-white px-3 py-3 transition-transform duration-300 hover:-translate-x-1" style={{ transform: `translateX(${index * 8}px)` }}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${candidate.tone} text-xs font-extrabold text-[#111827]`}>{candidate.initials}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#111827]">{candidate.name}</p><p className="text-xs text-[#667085]">{candidate.role}</p></div><span className="rounded-full bg-[#eeefff] px-2.5 py-1 text-[10px] font-extrabold text-[#4a4ed8]">{candidate.score}</span></div>)}</div>
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#111827] px-4 py-3 text-[#eeefff]"><span className="text-xs font-semibold">Ranked by match score</span><Check size={16} className="text-[#ccceff]" /></div>
    </div>
  </div>
}

export default function EmployerHero() {
  const heroRef = useRef(null)
  useHeroScene(heroRef)
  return (
    <section ref={heroRef} id="home" className="relative overflow-hidden bg-[#f7f8fc] px-6 pb-20 pt-32 md:px-12 md:pb-28 md:pt-40">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#4a4ed8]" />
      <div data-hero-orbit aria-hidden="true" className="absolute left-[45%] top-20 h-[550px] w-[550px] rounded-full border border-[#111827]/10" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.04fr_.96fr] lg:gap-20">
        <div>
          <FadeInLoad delay={0.08}>
            <h1 className="mt-6 max-w-3xl font-sans text-[48px] font-bold leading-[0.96] tracking-[-0.045em] text-[#111827] sm:text-6xl md:text-[76px]">Great teams start with a better first <em className="font-sans font-normal text-[#4a4ed8]">conversation.</em></h1>
          </FadeInLoad>

          <FadeInLoad delay={0.16}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-[#667085] sm:text-lg">Mzobs brings quality candidates and growing employers into one clear hiring flow—so you can spend less time sorting and more time meeting the right people.</p>
          </FadeInLoad>

          <FadeInLoad delay={0.22}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/employers/signup"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#111827] px-6 text-sm font-bold text-[#eeefff] transition-transform duration-200 hover:-translate-y-1"
              >Start hiring <ArrowUpRight size={17} />
              </Link>
              <a
                href="#how-it-works" className="inline-flex min-h-12 items-center text-sm font-bold text-[#111827] underline decoration-[#4a4ed8] decoration-2 underline-offset-6 hover:text-[#4a4ed8]">See the process</a>
            </div>
          </FadeInLoad>
        </div>
        <FadeInLoad delay={0.25}><CandidateBoard /></FadeInLoad>
      </div>
    </section>
  )
}
