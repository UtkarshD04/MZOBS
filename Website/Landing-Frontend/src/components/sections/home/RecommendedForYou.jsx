import { useEffect, useState } from 'react'
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

function experienceLabel(min, max) {
  if (min == null || max == null) return ''
  return min === max ? `${min} yrs` : `${min}–${max} yrs`
}

function RecommendedJobCard({ job }) {
  const salary = formatSalaryRange(job.salaryMin, job.salaryMax)
  const experience = experienceLabel(job.experienceMin, job.experienceMax)

  return (
    <a
      href={jobHref(job)}
      className="explorer-tile-btn group flex flex-col gap-2.5 p-4 rounded-xl border border-(--explorer-border) bg-white motion-safe:hover:-translate-y-px hover:border-(--explorer-blue-border) hover:bg-(--explorer-blue-surface)/40 transition-[background-color,border-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
    >
      <div className="flex items-center gap-3">
        <CompanyMark company={job.company} logo={job.logo} tone="bg-(--explorer-blue-surface) text-(--explorer-blue)" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-[13.5px] text-(--explorer-navy) truncate">{job.title}</p>
          <p className="text-[12px] text-(--explorer-muted) truncate">
            {job.company} · {job.location}
          </p>
        </div>
      </div>

      {(experience || salary) && (
        <div className="flex items-center gap-x-2.5 text-[11.5px] text-(--explorer-muted)">
          {experience && <span className="truncate">{experience}</span>}
          {salary && <span className="font-semibold text-(--explorer-navy) truncate">{salary}</span>}
        </div>
      )}

      {job.matchReasons?.[0] && (
        <p className="flex items-start gap-1.5 text-[11.5px] font-semibold text-(--explorer-blue)">
          <Sparkles size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{job.matchReasons[0]}</span>
        </p>
      )}
    </a>
  )
}

function RecommendedJobCardSkeleton() {
  return <div className="h-[104px] rounded-xl border border-(--explorer-border) bg-(--explorer-bg) animate-pulse" />
}

// Guests have no profile to match against, so this stays a single, honest
// CTA rather than a teaser dressed up with sample jobs — same "never a made-
// up match" rule the scoring itself follows (see Backend's jobMatching.js).
function SignedOutPrompt() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-(--explorer-border) bg-(--explorer-blue-surface)/40 p-6">
      <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-(--explorer-blue) shrink-0" aria-hidden="true">
        <UserCheck size={20} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[14.5px] text-(--explorer-navy)">Sign in to see jobs matched to your profile</p>
        <p className="mt-1 text-[13px] text-(--explorer-muted)">
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
    <section className="bg-white py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <Reveal direction="up" duration={0.7} className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[12.5px] font-bold uppercase tracking-wide text-(--explorer-blue)">For you</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-(--explorer-navy) tracking-tight">Jobs matching your profile</h2>
            <p className="mt-2 text-[15px] text-(--explorer-muted)">
              Matched against your skills, preferred role and location — never a guessed score.
            </p>
          </div>
          {signedIn && jobs?.length > 0 && (
            <ExplorerTextLink href={`${EMPLOYEE_APP_URL}/app/jobs?tab=recommended`} className="text-[13.5px]">
              View all matches
            </ExplorerTextLink>
          )}
        </Reveal>

        {!signedIn ? (
          <Reveal direction="up" duration={0.7} delay={0.05}>
            <SignedOutPrompt />
          </Reveal>
        ) : failed ? (
          <p className="text-[13.5px] text-(--explorer-muted)">Couldn't load your matches right now — check back shortly.</p>
        ) : jobs === null ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: RESULT_LIMIT }).map((_, i) => (
              <RecommendedJobCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <StaggerGroup className="grid sm:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <StaggerItem key={job.id}>
                <RecommendedJobCard job={job} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  )
}
