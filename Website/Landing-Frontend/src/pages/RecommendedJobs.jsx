import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, MapPin, Briefcase, Sparkles } from 'lucide-react'
import Seo from '../components/Seo'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { initialsOf } from '../lib/jobCardHelpers'
import { fetchRecommendedJobs } from '../lib/recommendedJobs'
import { getEmployeeSession, onEmployeeSessionChange } from '../lib/employeeSession'

const EASE = [0.16, 1, 0.3, 1]
const SIGN_IN_TO = `/employees/signin?next=${encodeURIComponent('/employees/recommended')}`

// Same idea as the home deck: strength comes from how many concrete reasons
// the backend gave for a match — never an invented percentage.
function levelFor(n) {
  if (n >= 3) return { label: 'Strong match', cls: 'bg-[#E3F6EF] text-[#0F7A5F]' }
  if (n === 2) return { label: 'Good match', cls: 'bg-[#EAF0FE] text-[#2451C8]' }
  return { label: 'Relevant match', cls: 'bg-[#F1EEFC] text-[#5B3FC4]' }
}

function skillNames(list) {
  return (Array.isArray(list) ? list : []).map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean)
}

function JobCard({ job, index }) {
  const reasons = Array.isArray(job.matchReasons) ? job.matchReasons.filter(Boolean) : []
  const level = levelFor(reasons.length)
  const skills = skillNames(job.skills ?? job.requiredSkills).slice(0, 5)
  const type = job.employmentType ?? job.type

  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.05, ease: EASE }}
      className="flex flex-col rounded-2xl border border-(--explorer-border) bg-white p-5 shadow-[0_1px_2px_rgba(16,42,67,0.04)] motion-safe:transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(22,50,79,0.3)]"
    >
      <div className="flex items-start gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-(--explorer-border) bg-(--explorer-blue-surface)">
          {job.logo ? (
            <img src={job.logo} alt="" className="h-full w-full object-contain p-1.5" />
          ) : (
            <span className="text-[16px] font-extrabold text-(--explorer-blue)">{initialsOf(job.company || job.title)}</span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[16px] font-extrabold leading-tight text-(--explorer-navy)">{job.title}</h2>
          <p className="mt-0.5 truncate text-[13.5px] text-(--explorer-muted)">{job.company}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${level.cls}`}>{level.label}</span>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-(--explorer-muted)">
        {job.location && <span className="inline-flex items-center gap-1"><MapPin size={13} aria-hidden="true" />{job.location}</span>}
        {type && <span className="inline-flex items-center gap-1"><Briefcase size={13} aria-hidden="true" />{type}</span>}
      </div>

      {reasons.length > 0 && (
        <ul className="mt-4 space-y-1.5 rounded-xl bg-(--explorer-bg) p-3.5">
          <li className="text-[10.5px] font-black uppercase tracking-[0.14em] text-(--explorer-muted)">Why this matches you</li>
          {reasons.map((r) => (
            <li key={r} className="flex items-start gap-2 text-[13px] leading-snug text-(--explorer-navy)">
              <Check size={14} className="mt-0.5 shrink-0 text-[#168A72]" aria-hidden="true" />
              {r}
            </li>
          ))}
        </ul>
      )}

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span key={s} className="rounded-full bg-(--explorer-bg) px-2.5 py-1 text-[11.5px] font-semibold text-(--explorer-muted)">{s}</span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-5">
        <Link
          to={`/jobs/${job.id}`}
          className="group inline-flex items-center gap-1.5 text-[13.5px] font-bold text-(--explorer-blue) hover:underline"
        >
          View job
          <ArrowRight size={15} aria-hidden="true" className="motion-safe:transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.li>
  )
}

function SkeletonGrid() {
  return (
    <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <li key={i} className="h-[280px] animate-pulse rounded-2xl border border-(--explorer-border) bg-white" />
      ))}
    </ul>
  )
}

function Notice({ title, body, to, cta }) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-(--explorer-border) bg-white p-8 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue)">
        <Sparkles size={20} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-[20px] font-extrabold text-(--explorer-navy)">{title}</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-(--explorer-muted)">{body}</p>
      {to && (
        <Link
          to={to}
          className="mt-5 inline-flex items-center gap-2 rounded-[11px] px-6 py-3 text-[14px] font-bold text-white transition-[filter] hover:brightness-110"
          style={{ backgroundImage: 'var(--hero-cta-gradient)' }}
        >
          {cta} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export default function RecommendedJobs() {
  const [session, setSession] = useState(() => getEmployeeSession())
  const [jobs, setJobs] = useState(null) // null = loading
  const [failed, setFailed] = useState(false)

  useEffect(() => onEmployeeSessionChange(() => setSession(getEmployeeSession())), [])

  useEffect(() => {
    if (!session?.token) return
    const controller = new AbortController()
    setFailed(false)
    setJobs(null)
    fetchRecommendedJobs({ sort: 'match' }, { signal: controller.signal })
      .then(setJobs)
      .catch((err) => {
        if (err?.name === 'AbortError') return
        setFailed(true)
        setJobs([])
      })
    return () => controller.abort()
  }, [session?.token])

  const signedIn = !!session?.token
  const firstName = session?.employee?.name?.split(' ')[0]

  return (
    <div className="min-h-screen bg-(--explorer-bg) font-sans text-(--explorer-navy) antialiased">
      <Seo path="/employees/recommended" title="Jobs matched to you — Mzobs" noindex />
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32 md:px-10">
        <header className="mb-10 max-w-2xl">
          <p className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-(--explorer-blue)">
            <span className="h-px w-6 bg-(--explorer-blue)" aria-hidden="true" /> Recommended for you
          </p>
          <h1 className="mt-3 text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[44px]">
            {firstName ? `${firstName}, these jobs fit you.` : 'Jobs matched to your profile.'}
          </h1>
          <p className="mt-3 text-[15.5px] leading-relaxed text-(--explorer-muted)">
            Matched against your skills, preferred role and location — with a clear reason for every recommendation.
          </p>
          {signedIn && jobs && jobs.length > 0 && (
            <p className="mt-4 text-[13px] font-semibold text-(--explorer-navy)">
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} matched
            </p>
          )}
        </header>

        {!signedIn ? (
          <Notice title="Sign in to see your matches" body="We match openings to your skills, preferred role and location once you're signed in." to={SIGN_IN_TO} cta="Sign in" />
        ) : failed ? (
          <Notice title="Couldn't load your matches" body="Something went wrong on our side. Please try again in a moment." />
        ) : jobs === null ? (
          <SkeletonGrid />
        ) : jobs.length === 0 ? (
          <Notice title="No matches yet" body="Add your skills, preferred role and location and we'll line up openings that fit — each with a clear reason." to="/employees/profile" cta="Complete your profile" />
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  )
}
