import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, UserCheck } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import ExplorerButton, { ExplorerTextLink } from '../../ui/ExplorerButton'
import { CompanyMark, jobHref } from './jobCardPrimitives'
import { fetchRecommendedJobs } from '../../../lib/recommendedJobs'
import { formatSalaryRange } from '../../../lib/formatCurrency'
import { getEmployeeSession, onEmployeeSessionChange } from '../../../lib/employeeSession'
import { EMPLOYEE_APP_URL } from '../../../lib/config'

const RESULT_LIMIT = 4

// Same soft, desaturated tones the redesigned JobMarketplace/CategoryGrid
// sections cycle through — kept consistent site-wide rather than inventing
// a fifth palette for this one section.
const CARD_TONES = [
  { bg: '#EAF2FE', border: '#D3E4FC' }, // soft blue
  { bg: '#E8F7F1', border: '#CBEADD' }, // soft mint
  { bg: '#FDF0E6', border: '#F6DDC3' }, // warm peach
  { bg: '#F1EEFC', border: '#DDD2F7' }, // muted lavender
]

function experienceLabel(min, max) {
  if (min == null || max == null) return ''
  return min === max ? `${min} yrs` : `${min}–${max} yrs`
}

function RecommendedJobCard({ job, tone }) {
  const salary = formatSalaryRange(job.salaryMin, job.salaryMax)
  const experience = experienceLabel(job.experienceMin, job.experienceMax)

  return (
    <a
      href={jobHref(job)}
      className="job-card-sheen group flex flex-col gap-3 h-full p-5 rounded-2xl border motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_rgba(22,50,79,0.22),inset_0_0_0_1px_rgba(22,50,79,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
      style={{ backgroundColor: tone.bg, borderColor: tone.border }}
    >
      <div className="flex items-center gap-3">
        <span className="motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.05]">
          <CompanyMark company={job.company} logo={job.logo} tone="bg-white text-(--explorer-navy)" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-[14.5px] text-(--explorer-navy) leading-snug truncate">{job.title}</p>
          <p className="text-[12px] text-(--explorer-navy)/70 truncate">
            {job.company} · {job.location}
          </p>
        </div>
      </div>

      {(experience || salary) && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-(--explorer-navy)/80">
          {experience && <span className="px-2 py-0.5 rounded-full bg-white/70">{experience}</span>}
          {salary && <span className="px-2 py-0.5 rounded-full bg-white/70">{salary}</span>}
        </div>
      )}

      {job.matchReasons?.[0] && (
        <p className="mt-auto pt-1 flex items-start gap-1.5 text-[11.5px] font-bold text-(--explorer-navy)">
          <Sparkles size={12} className="mt-0.5 shrink-0 text-(--explorer-gold-hover)" aria-hidden="true" />
          <span className="truncate">{job.matchReasons[0]}</span>
        </p>
      )}
    </a>
  )
}

function RecommendedJobCardSkeleton({ tone }) {
  return <div className="animate-pulse rounded-2xl border min-h-[136px]" style={{ backgroundColor: tone.bg, borderColor: tone.border }} />
}

// Guests have no profile to match against, so this stays a single, honest
// CTA rather than a teaser dressed up with sample jobs — same "never a made-
// up match" rule the scoring itself follows (see Backend's jobMatching.js).
function SignedOutPrompt() {
  return (
    <div
      className="job-card-sheen relative flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border p-6 sm:p-7"
      style={{ backgroundColor: CARD_TONES[0].bg, borderColor: CARD_TONES[0].border }}
    >
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-(--explorer-blue) shrink-0" aria-hidden="true">
        <UserCheck size={22} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-black text-[15px] text-(--explorer-navy)">Sign in to see jobs matched to your profile</p>
        <p className="mt-1.5 text-[13.5px] text-(--explorer-navy)/70 leading-relaxed">
          We'll match live openings against your skills, preferred role and location — with a plain-English reason for every match.
        </p>
      </div>
      <ExplorerButton to="/employees/signin" size="md" className="shrink-0">
        Sign in
      </ExplorerButton>
    </div>
  )
}

// Sits right above "Companies hiring through MZOBS" (see Home.jsx) — the
// same transparent, rule-based matching the dashboard app's Recommended tab
// uses (JobMatching.jsx), surfaced here so a signed-in visitor doesn't have
// to leave the marketing site to see it. Renders nothing once we know a
// signed-in candidate genuinely has no matches yet (incomplete profile, or
// the fetch failed) — the point of this section is a real, explainable
// match, never a placeholder.
export default function RecommendedForYou() {
  const reduceMotion = useReducedMotion()
  const [session, setSession] = useState(null)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [jobs, setJobs] = useState(null) // null = loading
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setSession(getEmployeeSession())
    setSessionChecked(true)
    return onEmployeeSessionChange(() => setSession(getEmployeeSession()))
  }, [])

  useEffect(() => {
    if (!session?.token) return
    let cancelled = false
    const controller = new AbortController()
    setFailed(false)
    setJobs(null)
    fetchRecommendedJobs({ sort: 'match', limit: RESULT_LIMIT }, { signal: controller.signal })
      .then((data) => {
        if (!cancelled) setJobs(data)
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        setFailed(true)
        setJobs([])
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [session?.token])

  // Still resolving the session on first paint — skip rendering rather than
  // flashing the signed-out CTA before flipping to real matches.
  if (!sessionChecked) return null
  const signedIn = !!session?.token
  // Signed in, matches loaded, and genuinely none — nothing honest to show.
  if (signedIn && !failed && jobs && jobs.length === 0) return null

  return (
    <section className="hero-afterglow-faint py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex items-end justify-between gap-4 flex-wrap">
          {/* Header — mirrors JobMarketplace/CategoryGrid's editorial style */}
          <Reveal direction="up" duration={0.6} className="max-w-2xl">
            <motion.span
              initial={reduceMotion ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="block w-px h-8 mb-4 origin-top"
              style={{ backgroundImage: 'linear-gradient(180deg, transparent, var(--explorer-blue-border))' }}
              aria-hidden="true"
            />
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-black uppercase tracking-wide text-(--explorer-teal)">
              <span className="relative flex items-center justify-center w-1.5 h-1.5">
                {!reduceMotion && (
                  <span className="absolute inset-0 rounded-full bg-(--explorer-teal) animate-ping opacity-60" aria-hidden="true" />
                )}
                <span className="relative w-1.5 h-1.5 rounded-full bg-(--explorer-teal)" aria-hidden="true" />
              </span>
              For you
            </span>
            <h2 className="mt-2.5 text-[32px] sm:text-[40px] font-black leading-[1.08] tracking-tight text-balance text-(--explorer-navy)">
              Jobs matching your profile
            </h2>
            <p className="mt-3 text-[15px] text-(--explorer-navy)/70 leading-relaxed">
              Matched against your skills, preferred role and location — never a guessed score.
            </p>
          </Reveal>

          {signedIn && jobs?.length > 0 && (
            <Reveal direction="up" duration={0.5} delay={0.1}>
              <ExplorerTextLink href={`${EMPLOYEE_APP_URL}/app/jobs?tab=recommended`} className="text-[13.5px]">
                View all matches
              </ExplorerTextLink>
            </Reveal>
          )}
        </div>

        {!signedIn ? (
          <Reveal direction="up" duration={0.7} delay={0.05}>
            <SignedOutPrompt />
          </Reveal>
        ) : failed ? (
          <p className="text-[13.5px] text-(--explorer-navy)/60">Couldn't load your matches right now — check back shortly.</p>
        ) : jobs === null ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: RESULT_LIMIT }).map((_, i) => (
              <RecommendedJobCardSkeleton key={i} tone={CARD_TONES[i % CARD_TONES.length]} />
            ))}
          </div>
        ) : (
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.08}>
            {jobs.map((job, i) => (
              <StaggerItem key={job.id} y={20} scale={1} duration={0.45}>
                <RecommendedJobCard job={job} tone={CARD_TONES[i % CARD_TONES.length]} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  )
}
