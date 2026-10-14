import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Check, Clock, MapPin, RotateCw, SlidersHorizontal, Sparkles, Target, Wallet, Wrench, Zap } from 'lucide-react'
import Seo from '../components/Seo'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Container, CompanyLogo } from '../components/mz/primitives'
import { fetchRecommendedJobs } from '../lib/recommendedJobs'
import { formatSalaryRange } from '../lib/formatCurrency'
import { getEmployeeSession, onEmployeeSessionChange } from '../lib/employeeSession'

const EASE = [0.16, 1, 0.3, 1]
const SIGN_IN_TO = `/employees/signin?next=${encodeURIComponent('/employees/recommended')}`

// Strength comes from how many concrete reasons the backend gave for a match,
// never an invented percentage.
function levelFor(n) {
  if (n >= 3) return { key: 'strong', label: 'Strong match', badge: 'bg-[#E3F6EF] text-[#0F7A5F]', bar: 'bg-[#168A72]' }
  if (n === 2) return { key: 'good', label: 'Good match', badge: 'bg-[#EAF0FE] text-[#2451C8]', bar: 'bg-[#3B6DF0]' }
  return { key: 'relevant', label: 'Relevant match', badge: 'bg-[#F1EEFC] text-[#5B3FC4]', bar: 'bg-[#7C5CE0]' }
}

const SORTS = [
  { id: 'match', label: 'Best match' },
  { id: 'newest', label: 'Newest' },
  { id: 'salary', label: 'Highest pay' },
]

function skillNames(list) {
  return (Array.isArray(list) ? list : []).map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean)
}

function experienceText(job) {
  const { experienceMin: lo, experienceMax: hi } = job
  if (lo == null && hi == null) return ''
  if (lo != null && hi != null && lo !== hi) return `${lo}–${hi} yrs`
  const n = lo ?? hi
  return n === 0 ? 'Fresher' : `${n} yrs`
}

function Meta({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-mz-bg px-2.5 py-1 text-[12.5px] font-medium text-mz-ink-2 ring-1 ring-mz-line">
      <Icon size={13} className="text-mz-muted" aria-hidden="true" />
      {children}
    </span>
  )
}

function JobCard({ job, index }) {
  const reasons = Array.isArray(job.matchReasons) ? job.matchReasons.filter(Boolean) : []
  const level = levelFor(reasons.length)
  const skills = skillNames(job.skills ?? job.requiredSkills)
  const type = job.employmentType ?? job.type
  const salary = formatSalaryRange(job.salaryMin, job.salaryMax)
  const experience = experienceText(job)

  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.05, ease: EASE }}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-mz-line bg-white shadow-[0_1px_2px_rgba(16,42,67,0.04)] motion-safe:transition-[box-shadow,transform] motion-safe:duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-24px_rgba(11,122,109,0.35)]"
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${level.bar}`} aria-hidden="true" />
      <div className="flex flex-1 flex-col p-5 pt-6">
        <div className="flex items-start gap-3.5">
          <CompanyLogo name={job.company || job.title} logo={job.logo} size={50} />
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-extrabold leading-snug text-mz-ink">
              <Link to={`/jobs/${job.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-mz-primary">
                {job.title}
              </Link>
            </h2>
            <p className="mt-0.5 truncate text-[13.5px] text-mz-muted">{job.company}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-bold ${level.badge}`}>
            <Sparkles size={12} aria-hidden="true" /> {level.label}
          </span>
          {job.instantHiring && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF3DB] px-2.5 py-1 text-[11.5px] font-bold text-[#9A6B14]">
              <Zap size={12} aria-hidden="true" /> Urgent hiring
            </span>
          )}
        </div>

        <div className="mt-3.5 flex flex-wrap gap-2">
          {job.location && <Meta icon={MapPin}>{job.location}</Meta>}
          {job.workMode && <Meta icon={Briefcase}>{job.workMode}</Meta>}
          {type && <Meta icon={Clock}>{type}</Meta>}
          {experience && <Meta icon={Target}>{experience}</Meta>}
          {salary && <Meta icon={Wallet}>{salary}</Meta>}
        </div>

        {reasons.length > 0 && (
          <ul className="mt-4 space-y-1.5 rounded-xl bg-mz-primary-tint/60 p-3.5">
            <li className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-mz-primary-strong">Why this matches you</li>
            {reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-[13px] leading-snug text-mz-ink">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-mz-primary text-white"><Check size={10} strokeWidth={3} aria-hidden="true" /></span>
                {r}
              </li>
            ))}
          </ul>
        )}

        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.slice(0, 5).map((s) => (
              <span key={s} className="rounded-full border border-mz-line px-2.5 py-1 text-[11.5px] font-semibold text-mz-ink-2">{s}</span>
            ))}
            {skills.length > 5 && <span className="px-1 py-1 text-[11.5px] font-semibold text-mz-muted">+{skills.length - 5}</span>}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-[12.5px] text-mz-muted">{job.posted ? `Posted ${job.posted}` : ''}</span>
          <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-mz-primary-strong">
            View job
            <ArrowRight size={15} aria-hidden="true" className="motion-safe:transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.li>
  )
}

function SkeletonGrid() {
  return (
    <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <li key={i} className="h-[340px] animate-pulse rounded-[20px] border border-mz-line bg-white" />
      ))}
    </ul>
  )
}

function Notice({ icon: Icon = Sparkles, title, body, to, cta, onClick }) {
  const cls = 'mt-6 inline-flex items-center gap-2 rounded-[11px] px-6 py-3 text-[14px] font-bold text-white transition-[filter] hover:brightness-110'
  return (
    <div className="mx-auto max-w-lg rounded-[24px] border border-mz-line bg-white p-9 text-center shadow-[0_24px_50px_-32px_rgba(11,122,109,0.35)]">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mz-primary-tint text-mz-primary">
        <Icon size={24} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-[21px] font-extrabold text-mz-ink">{title}</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-mz-muted">{body}</p>
      {to && (
        <Link to={to} className={cls} style={{ backgroundImage: 'var(--hero-cta-gradient)' }}>
          {cta} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
      {onClick && (
        <button type="button" onClick={onClick} className={cls} style={{ backgroundImage: 'var(--hero-cta-gradient)' }}>
          <RotateCw size={15} aria-hidden="true" /> {cta}
        </button>
      )}
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-[0_10px_24px_-18px_rgba(11,122,109,0.5)] backdrop-blur">
      <p className="text-[24px] font-extrabold leading-none tabular-nums text-mz-ink">{value}</p>
      <p className="mt-1 text-[12px] font-semibold text-mz-muted">{label}</p>
    </div>
  )
}

export default function RecommendedJobs() {
  const [session, setSession] = useState(() => getEmployeeSession())
  const [jobs, setJobs] = useState(null) // null = loading
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [sort, setSort] = useState('match')
  const [strongOnly, setStrongOnly] = useState(false)

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
  }, [session?.token, attempt])

  const signedIn = !!session?.token
  const firstName = session?.employee?.name?.split(' ')[0]

  const strongCount = useMemo(() => (jobs ?? []).filter((j) => (j.matchReasons?.length ?? 0) >= 3).length, [jobs])
  const visible = useMemo(() => {
    let list = jobs ?? []
    if (strongOnly) list = list.filter((j) => (j.matchReasons?.length ?? 0) >= 3)
    if (sort === 'newest') return [...list].sort((a, b) => new Date(b.postedOn ?? 0) - new Date(a.postedOn ?? 0))
    if (sort === 'salary') return [...list].sort((a, b) => (b.salaryMax ?? 0) - (a.salaryMax ?? 0))
    return list // already ranked by match
  }, [jobs, sort, strongOnly])

  const hasJobs = signedIn && jobs && jobs.length > 0

  return (
    <div className="min-h-screen bg-mz-bg font-sans text-mz-ink antialiased">
      <Seo path="/employees/recommended" title="Jobs matched to you | Mzobs" noindex />
      <Navbar />

      <header className="relative overflow-hidden bg-gradient-to-br from-[#E7F5F1] via-white to-[#FBEBB0]/50 pb-12 pt-32">
        <span className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-mz-primary/10 blur-3xl" aria-hidden="true" />
        <span className="pointer-events-none absolute -right-16 -top-10 h-64 w-64 rounded-full bg-[#3B6DF0]/10 blur-3xl" aria-hidden="true" />
        <Container className="relative">
          <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.14em] text-mz-primary-strong ring-1 ring-mz-primary/15">
                <Sparkles size={13} aria-hidden="true" /> Recommended for you
              </p>
              <h1 className="mt-4 text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[46px]">
                {firstName ? <>{firstName}, these jobs <span className="text-mz-primary">fit you.</span></> : <>Jobs matched to <span className="text-mz-primary">your profile.</span></>}
              </h1>
              <p className="mt-3 text-[15.5px] leading-relaxed text-mz-muted">
                Matched against your skills, preferred role and location, with a clear reason for every recommendation.
              </p>
              <div className="mt-5 flex flex-wrap gap-2" aria-label="What we match on">
                {[[Wrench, 'Your skills'], [Target, 'Preferred role'], [MapPin, 'Location']].map(([Icon, label]) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[12.5px] font-semibold text-mz-ink-2 ring-1 ring-mz-line">
                    <Icon size={13} className="text-mz-primary" aria-hidden="true" /> {label}
                  </span>
                ))}
              </div>
            </div>
            {hasJobs && (
              <div className="mt-8 grid grid-cols-2 gap-3 lg:mt-0 lg:w-[300px]">
                <Stat value={jobs.length} label={jobs.length === 1 ? 'Job matched' : 'Jobs matched'} />
                <Stat value={strongCount} label="Strong matches" />
              </div>
            )}
          </div>
        </Container>
      </header>

      <main className="pb-20 pt-8">
        <Container>
          {!signedIn ? (
            <Notice title="Sign in to see your matches" body="We match openings to your skills, preferred role and location once you're signed in." to={SIGN_IN_TO} cta="Sign in" />
          ) : failed ? (
            <Notice title="Couldn't load your matches" body="Something went wrong on our side. Please try again in a moment." cta="Try again" onClick={() => setAttempt((n) => n + 1)} />
          ) : jobs === null ? (
            <SkeletonGrid />
          ) : jobs.length === 0 ? (
            <Notice title="No matches yet" body="Add your skills, preferred role and location and we'll line up openings that fit, each with a clear reason." to="/employees/profile" cta="Complete your profile" />
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Sort jobs">
                  <span className="mr-1 inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wider text-mz-muted"><SlidersHorizontal size={14} aria-hidden="true" /> Sort</span>
                  {SORTS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={sort === s.id}
                      onClick={() => setSort(s.id)}
                      className={`h-9 rounded-full px-4 text-[13px] font-semibold transition-colors ${sort === s.id ? 'bg-mz-primary text-white' : 'bg-white text-mz-ink-2 ring-1 ring-mz-line hover:bg-mz-primary-tint'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                {strongCount > 0 && (
                  <button
                    type="button"
                    aria-pressed={strongOnly}
                    onClick={() => setStrongOnly((v) => !v)}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors ${strongOnly ? 'bg-[#E3F6EF] text-[#0F7A5F] ring-1 ring-[#168A72]/40' : 'bg-white text-mz-ink-2 ring-1 ring-mz-line hover:bg-mz-primary-tint'}`}
                  >
                    <Sparkles size={13} aria-hidden="true" /> Strong matches only
                  </button>
                )}
              </div>
              <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
              </ul>
            </>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  )
}
