import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Briefcase, Search, ListChecks, CalendarCheck, CheckCircle2, IndianRupee, Sparkles, Check } from 'lucide-react'
import { FadeInLoad } from './employerMotion'
import ExplorerButton from '../../ui/ExplorerButton'
import { TRUSTED_LOGOS_DATA } from '../../../lib/content'
import { PLANS, fmtINR } from '../../../lib/employerPricingPlan'

const STARTING_PRICE = Math.min(...PLANS.map((p) => p.baseAmount))

// Real plan facts only (see EmployerPlanCards' CORE_FEATURES) — no invented
// candidate counts or hiring stats.
const FACTS = ['Unlimited job posts', 'No per-job fee', 'GST invoice included']

const STAGES = [
  { icon: Briefcase, label: 'Post' },
  { icon: Search, label: 'Discover' },
  { icon: ListChecks, label: 'Shortlist' },
  { icon: CalendarCheck, label: 'Interview' },
  { icon: CheckCircle2, label: 'Hire' },
]

// Status chip each placeholder row shows once the pipeline reaches a stage.
const ROW_STATUS = ['New posting', 'Applied', 'Shortlisted', 'Interview', 'Hired']

// Product-shaped visual: the real hiring workflow cycling through its five
// stages, with skeleton rows instead of candidate data — none exists until an
// employer actually posts a job.
function PipelineVisual() {
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState(2)

  useEffect(() => {
    if (reduceMotion) return undefined
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 1900)
    return () => clearInterval(id)
  }, [reduceMotion])

  const float = (amplitude, duration, delay = 0) =>
    reduceMotion ? {} : { animate: { y: [0, -amplitude, 0] }, transition: { duration, delay, repeat: Infinity, ease: 'easeInOut' } }

  return (
    <div className="relative mx-auto w-full max-w-[500px] pt-10 pb-12 sm:pt-12 sm:pb-14">
      <div aria-hidden="true" className="absolute inset-[6%] rounded-full bg-(--explorer-blue)/20 blur-[90px]" />

      {/* Main workspace card */}
      <div className="relative rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-mz-float backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-(--explorer-blue) text-white">
              <Briefcase size={16} strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[13.5px] font-bold text-(--explorer-navy)">Hiring pipeline</p>
              <p className="text-[11px] font-medium text-(--explorer-muted)">Your open role</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-(--explorer-teal-surface) px-2.5 py-1 text-[10.5px] font-bold text-(--explorer-teal)">
            <span className="h-1.5 w-1.5 rounded-full bg-current motion-safe:animate-pulse" aria-hidden="true" />
            Accepting applications
          </span>
        </div>

        {/* Stage tracker */}
        <div className="relative mt-6">
          <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-[17px] h-[2px] rounded-full bg-(--explorer-border)" />
          <motion.span
            aria-hidden="true"
            className="absolute left-[10%] top-[17px] h-[2px] rounded-full"
            style={{ backgroundImage: 'linear-gradient(90deg, #0b7a6d, #20c997)' }}
            animate={{ width: `${(stage / (STAGES.length - 1)) * 80}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <ol className="relative grid grid-cols-5">
            {STAGES.map((s, i) => {
              const done = i < stage
              const active = i === stage
              return (
                <li key={s.label} className="flex flex-col items-center gap-2">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full border-2 transition-all duration-500 ${
                      active
                        ? 'scale-110 border-(--explorer-blue) bg-(--explorer-blue) text-white shadow-[0_8px_18px_-6px_rgba(11,122,109,0.7)]'
                        : done
                          ? 'border-(--explorer-blue) bg-(--explorer-blue-surface) text-(--explorer-blue)'
                          : 'border-(--explorer-border) bg-white text-(--explorer-muted)'
                    }`}
                  >
                    {done ? <Check size={15} strokeWidth={2.6} aria-hidden="true" /> : <s.icon size={15} strokeWidth={2} aria-hidden="true" />}
                  </span>
                  <span className={`text-[10.5px] font-bold transition-colors duration-300 sm:text-[11px] ${active ? 'text-(--explorer-navy)' : 'text-(--explorer-muted)'}`}>
                    {s.label}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Skeleton candidate rows */}
        <div className="mt-6 space-y-2.5">
          {[0, 1, 2].map((row) => {
            const rowStage = Math.max(0, stage - row)
            return (
              <div key={row} className="flex items-center gap-3 rounded-2xl border border-(--explorer-border) bg-(--explorer-bg)/70 px-3.5 py-3">
                <span className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-(--explorer-blue-surface) to-(--explorer-blue-border)" aria-hidden="true" />
                <div className="flex-1 space-y-1.5" aria-hidden="true">
                  <span className="block h-2.5 rounded-full bg-(--explorer-navy)/12" style={{ width: `${[62, 48, 56][row]}%` }} />
                  <span className="block h-2 rounded-full bg-(--explorer-navy)/7" style={{ width: `${[38, 52, 30][row]}%` }} />
                </div>
                <motion.span
                  key={rowStage}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold ${
                    rowStage >= 4
                      ? 'bg-(--explorer-blue) text-white'
                      : rowStage >= 2
                        ? 'bg-(--explorer-teal-surface) text-(--explorer-teal)'
                        : 'bg-white text-(--explorer-muted) border border-(--explorer-border)'
                  }`}
                >
                  {ROW_STATUS[rowStage]}
                </motion.span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating: candidate search */}
      <motion.div
        className="absolute left-0 top-0 flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-mz-card backdrop-blur-xl sm:-left-10"
        {...float(6, 5)}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue)">
          <Search size={13} strokeWidth={2.4} aria-hidden="true" />
        </span>
        <span className="text-[12px] font-semibold text-(--explorer-navy)/70">
          Search by skill, role or city
          <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-(--explorer-blue) motion-safe:animate-pulse" aria-hidden="true" />
        </span>
      </motion.div>

      {/* Floating: real starting price */}
      <motion.div
        className="absolute bottom-0 right-0 flex items-center gap-3 rounded-2xl bg-(--explorer-navy) px-4 py-3 text-white shadow-mz-float sm:-right-8"
        {...float(7, 6, 0.8)}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-(--color-mz-accent)">
          <IndianRupee size={15} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/55">Plans from</p>
          <p className="text-[15px] font-extrabold leading-tight">
            {fmtINR(STARTING_PRICE)}
            <span className="text-[11px] font-semibold text-white/60"> / year</span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function LogoMarquee() {
  const { logos } = TRUSTED_LOGOS_DATA
  const loop = [...logos, ...logos]
  return (
    <div className="relative mt-14 md:mt-16">
      <p className="text-center text-[11.5px] font-bold uppercase tracking-[0.18em] text-(--explorer-muted)">
        Companies already hiring on Mzobs
      </p>
      <div className="employer-hero-marquee relative mt-6 overflow-hidden">
        <div className="careers-marquee-track flex w-max items-center gap-4 motion-reduce:animate-none">
          {loop.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              aria-hidden={i >= logos.length ? 'true' : undefined}
              className="flex h-14 w-36 shrink-0 sm:h-16 sm:w-44 items-center justify-center rounded-2xl border border-white/80 bg-white/80 px-5 shadow-mz-card backdrop-blur"
            >
              <img src={logo.logo} alt={i >= logos.length ? '' : logo.name} loading="lazy" className="max-h-8 max-w-full object-contain sm:max-h-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function EmployerHero() {
  return (
    <section id="home" className="employer-hero relative overflow-hidden px-6 md:px-12">
      <div aria-hidden="true" className="employer-hero-lattice" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] h-[620px] w-[620px] rounded-full bg-[#20c997]/25 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 -left-40 h-[460px] w-[460px] rounded-full bg-(--explorer-blue)/15 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl pt-28 pb-14 md:pt-36 md:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_1fr] lg:gap-10">
          <div className="text-center lg:text-left">
            <FadeInLoad delay={0.05}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-(--explorer-blue-border) bg-white/75 py-1.5 pr-4 pl-1.5 text-[12px] font-bold text-(--explorer-navy) shadow-mz-card backdrop-blur">
                <span className="inline-flex items-center gap-1 rounded-full bg-(--explorer-blue) px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-white">
                  <Sparkles size={11} aria-hidden="true" /> For employers
                </span>
                Hire smarter across India
              </span>
            </FadeInLoad>

            <FadeInLoad delay={0.12}>
              <h1 className="mx-auto mt-7 max-w-2xl text-[40px] font-extrabold leading-[1.04] tracking-[-0.03em] text-(--explorer-navy) sm:text-[54px] lg:mx-0 lg:text-[64px]">
                Build your team with the{' '}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="employer-hero-accent">right talent.</span>
                  <svg className="employer-hero-swoosh" viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M3 13 C 70 3, 190 2, 297 9" fill="none" stroke="#20c997" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </FadeInLoad>

            <FadeInLoad delay={0.2}>
              <p className="mx-auto mt-6 max-w-lg text-[16px] leading-relaxed text-(--explorer-muted) sm:text-[17.5px] lg:mx-0">
                Post jobs, search candidates by skill and location, and move every applicant from shortlist to offer, all from one simple dashboard.
              </p>
            </FadeInLoad>

            <FadeInLoad delay={0.28}>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <ExplorerButton to="/employers/signup" size="xl" className="w-full shadow-mz-cta sm:w-auto">
                  Post a Job →
                </ExplorerButton>
                <ExplorerButton to="/employers#discover-talent" variant="secondary" size="xl" className="w-full sm:w-auto">
                  <Search size={16} aria-hidden="true" /> Find Candidates
                </ExplorerButton>
              </div>
            </FadeInLoad>

            <FadeInLoad delay={0.34}>
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 lg:justify-start">
                {FACTS.map((fact) => (
                  <li key={fact} className="flex items-center gap-2 text-[13.5px] font-semibold text-(--explorer-navy)/80">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue)">
                      <Check size={12} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {fact}
                  </li>
                ))}
              </ul>
            </FadeInLoad>
          </div>

          <FadeInLoad delay={0.3}>
            <PipelineVisual />
          </FadeInLoad>
        </div>

        <FadeInLoad delay={0.45}>
          <LogoMarquee />
        </FadeInLoad>
      </div>
    </section>
  )
}
