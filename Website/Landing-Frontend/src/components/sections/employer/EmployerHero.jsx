import { useRef } from 'react'
import { ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeInLoad, useHeroScene } from './employerMotion'
const candidates = [
  { initials: 'AS', name: 'Aditi Sharma', role: 'Product designer', score: '96% match', tone: 'bg-[#DDE6DF]' },
  { initials: 'RK', name: 'Rohit Kumar', role: 'Backend engineer', score: '92% match', tone: 'bg-[#B4D5CA]' },
  { initials: 'NM', name: 'Nisha Mehta', role: 'Growth lead', score: '89% match', tone: 'bg-[#E9B0A4]' },
]

function CandidateBoard() {
  return <div className="relative mx-auto max-w-[510px] lg:ml-auto">
    <div data-hero-glow className="absolute -top-8 -right-6 h-36 w-36 rounded-full bg-[#246B5A]/25 opacity-90 blur-[1px]" />
    <div className="absolute -bottom-8 -left-6 h-28 w-28 rounded-full bg-[#DDE6DF]" />
    <div data-hero-board className="relative rotate-[2deg] rounded-[30px] border border-[#20251F] bg-[#FAF7F1] p-4 shadow-[10px_12px_0_#20251F] sm:p-6">
      <div className="flex items-center justify-between border-b border-[#20251F]/12 pb-5"><h2 className="text-xl font-bold text-[#20251F]">Your shortlist, ready.</h2><span className="grid h-10 w-10 place-items-center rounded-full bg-[#20251F] text-[#FAF7F1]"><Sparkles size={17} /></span></div>
      <div className="mt-4 space-y-3">{candidates.map((candidate, index) => <div key={candidate.name} className="flex items-center gap-3 rounded-2xl border border-[#20251F]/10 bg-white px-3 py-3 transition-transform duration-300 hover:-translate-x-1" style={{ transform: `translateX(${index * 8}px)` }}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${candidate.tone} text-xs font-extrabold text-[#20251F]`}>{candidate.initials}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#20251F]">{candidate.name}</p><p className="text-xs text-[#526051]">{candidate.role}</p></div><span className="rounded-full bg-[#DCECE3] px-2.5 py-1 text-[10px] font-extrabold text-[#1F5A43]">{candidate.score}</span></div>)}</div>
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#20251F] px-4 py-3 text-[#FAF7F1]"><span className="text-xs font-semibold">Verified profiles only</span><Check size={16} className="text-[#DDE6DF]" /></div>
    </div>
  </div>
}

export default function EmployerHero() {
  const heroRef = useRef(null)
  useHeroScene(heroRef)
  return (
    <section ref={heroRef} id="home" className="relative overflow-hidden bg-[#F5F6F4] px-6 pb-20 pt-32 md:px-12 md:pb-28 md:pt-40">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#246B5A]" />
      <div data-hero-orbit aria-hidden="true" className="absolute left-[45%] top-20 h-[550px] w-[550px] rounded-full border border-[#20251F]/10" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.04fr_.96fr] lg:gap-20">
        <div>
          <FadeInLoad delay={0.08}>
            <h1 className="mt-6 max-w-3xl font-serif text-[48px] font-bold leading-[0.96] tracking-[-0.045em] text-[#20251F] sm:text-6xl md:text-[76px]">Great teams start with a better first <em className="font-serif font-normal text-[#246B5A]">conversation.</em></h1>
          </FadeInLoad>

          <FadeInLoad delay={0.16}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-[#526051] sm:text-lg">Mzobs brings verified candidates and serious employers into one clear hiring flow—so you can spend less time sorting and more time meeting the right people.</p>
          </FadeInLoad>

          <FadeInLoad delay={0.22}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/employers/signup"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#20251F] px-6 text-sm font-bold text-[#FAF7F1] transition-transform duration-200 hover:-translate-y-1"
              >Start hiring <ArrowUpRight size={17} />
              </Link>
              <a
                href="#how-it-works" className="inline-flex min-h-12 items-center text-sm font-bold text-[#20251F] underline decoration-[#246B5A] decoration-2 underline-offset-6 hover:text-[#246B5A]">See the process</a>
            </div>
          </FadeInLoad>
        </div>
        <FadeInLoad delay={0.25}><CandidateBoard /></FadeInLoad>
      </div>
    </section>
  )
}
