import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FadeInLoad } from './employerMotion'
<<<<<<< Updated upstream
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
=======
import ExplorerButton from '../../ui/ExplorerButton'

// Small text-based capability labels under the hero CTA — not cards, not a
// dashboard, just a quiet pointer to the four things an employer can do.
const CAPABILITIES = [
  { label: 'Post Jobs', to: '/employers/signup' },
  { label: 'Find Talent', to: '/employers#discover-talent' },
  { label: 'Manage Applications', to: '/employers/signin' },
  { label: 'Schedule Interviews', to: '/employers/signin' },
]

// Abstract "talent meets opportunity" brand form — layered translucent
// organic shapes in the Mzobs indigo/violet/blue/mint range. No literal
// icons, cards or UI — a brand visual, not a product screenshot.
function AbstractBrandForm() {
  const reduceMotion = useReducedMotion()
  const float = (amplitude, duration, delay = 0) =>
    reduceMotion
      ? {}
      : {
          animate: { y: [0, -amplitude, 0], rotate: [0, 1.2, 0] },
          transition: { duration, delay, repeat: Infinity, ease: 'easeInOut' },
        }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-(--color-violet)/12 blur-[90px]"
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-[8%]"
        style={{
          borderRadius: '42% 58% 65% 35% / 48% 42% 58% 52%',
          background: 'linear-gradient(135deg, var(--color-violet) 0%, var(--explorer-blue) 100%)',
          opacity: 0.85,
          filter: 'blur(0.5px)',
        }}
        {...float(14, 9)}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-[18%]"
        style={{
          borderRadius: '58% 42% 38% 62% / 40% 55% 45% 60%',
          background: 'linear-gradient(140deg, var(--explorer-blue) 0%, var(--explorer-teal) 100%)',
          opacity: 0.55,
          mixBlendMode: 'multiply',
        }}
        {...float(10, 11, 0.6)}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-[30%]"
        style={{
          borderRadius: '50% 50% 42% 58% / 55% 45% 55% 45%',
          background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%)',
        }}
        {...float(8, 8, 0.3)}
      />
>>>>>>> Stashed changes
    </div>
  )
}

export default function EmployerHero() {
  return (
<<<<<<< Updated upstream
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
=======
    <section id="home" className="relative overflow-hidden bg-(--explorer-bg) px-6 md:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-(image:--hero-cta-gradient)" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/4 left-0 h-[320px] w-[320px] rounded-full bg-(--color-violet)/5 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-1/4 h-[260px] w-[260px] rounded-full bg-(--explorer-teal)/6 blur-[130px]" />

      <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center py-20 md:py-0">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <FadeInLoad delay={0.05}>
              <span className="inline-flex items-center rounded-full bg-(--explorer-blue-surface) border border-(--explorer-blue-border) px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-(--explorer-blue)">
                Mzobs for Employers
              </span>
            </FadeInLoad>

            <FadeInLoad delay={0.12}>
              <h1 className="mt-6 max-w-lg text-[36px] font-extrabold leading-[1.06] tracking-tight text-(--explorer-navy) sm:text-[46px] lg:text-[54px]">
                Build Your Team
                <br />
                With the{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, var(--color-violet), var(--explorer-blue))' }}
                >
                  Right Talent.
                </span>
              </h1>
            </FadeInLoad>

            <FadeInLoad delay={0.2}>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-(--explorer-muted) sm:text-[16.5px]">
                Post jobs, discover relevant talent, and manage your hiring journey — all in one place.
              </p>
            </FadeInLoad>

            <FadeInLoad delay={0.28}>
              <div className="mt-9 flex flex-wrap items-center gap-3.5">
                <ExplorerButton to="/employers/signup" size="lg">
                  Post a Job →
                </ExplorerButton>
                <ExplorerButton to="/employers#discover-talent" variant="secondary" size="lg">
                  Find Candidates
                </ExplorerButton>
              </div>
            </FadeInLoad>

            <FadeInLoad delay={0.34}>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                {CAPABILITIES.map((c, i) => (
                  <span key={c.label} className="flex items-center gap-5">
                    <Link
                      to={c.to}
                      className="text-[12.5px] font-semibold text-(--explorer-muted) hover:text-(--explorer-blue) transition-colors"
                    >
                      {c.label}
                    </Link>
                    {i < CAPABILITIES.length - 1 && <span className="h-1 w-1 rounded-full bg-(--explorer-border)" aria-hidden="true" />}
                  </span>
                ))}
              </div>
            </FadeInLoad>
          </div>

          <FadeInLoad delay={0.3}>
            <AbstractBrandForm />
>>>>>>> Stashed changes
          </FadeInLoad>
        </div>
      </div>
    </section>
  )
}
