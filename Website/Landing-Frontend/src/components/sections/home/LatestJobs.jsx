import { useEffect, useRef, useState } from 'react'
import { MapPin, Briefcase, IndianRupee, Clock, ArrowUpRight, Users, TrendingUp, Share2, Check } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import ApplyPanel from './ApplyPanel'
import { LATEST_JOBS_DATA } from '../../../lib/content'
import { EMPLOYEE_APP_URL } from '../../../lib/config'
import { fetchLatestJobs } from '../../../lib/publicJobs'

// Kept to this page's own --jobs-* palette (not the shared Badge/CompanyLogo
// tone system, which is a separate, differently-shaded color set used
// elsewhere on the site) so every pill and avatar here stays visually
// consistent with the rest of this redesign's blue/teal theme.
const LOGO_TONES = ['bg-(--jobs-blue-tint) text-(--jobs-blue-dark)', 'bg-(--jobs-teal-tint) text-(--jobs-teal-dark)']
const WORK_MODE_STYLE = {
  Remote: 'bg-(--jobs-teal-tint) text-(--jobs-teal-dark)',
  Hybrid: 'bg-(--jobs-blue-tint) text-(--jobs-blue-dark)',
  'On-site': 'bg-(--jobs-bg-subtle) text-(--jobs-ink-soft)',
}
const NEUTRAL_PILL = 'bg-(--jobs-bg-subtle) text-(--jobs-ink-soft)'

function initialsOf(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function Avatar({ initials, tone, size = 'sm' }) {
  const sizeClass = size === 'lg' ? 'w-14 h-14 rounded-2xl text-base' : 'w-[26px] h-[26px] rounded-lg text-[10px]'
  return <div className={`flex items-center justify-center font-bold shrink-0 ${sizeClass} ${tone}`}>{initials}</div>
}

function Pill({ children, className = '', icon }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-0.75 rounded-full ${className}`}>
      {icon}
      {children}
    </span>
  )
}

// Deep-links straight to this job's apply flow in the dashboard app (see
// JobMatching.jsx, which opens the apply modal for a matching `?jobId=`) —
// same "click apply on the listing, land in the apply flow" pattern as
// Indeed/Naukri. Falls back to a title search for the curated sample data,
// which has no real id to link to.
function jobHref(job) {
  if (job.applyUrl) return job.applyUrl
  if (job.id) return `${EMPLOYEE_APP_URL}/app/jobs?jobId=${encodeURIComponent(job.id)}`
  return `${EMPLOYEE_APP_URL}/app/jobs?q=${encodeURIComponent(job.title)}`
}

function BulletList({ title, items }) {
  if (!items?.length) return null
  return (
    <div className="mt-5">
      <h4 className="font-bold text-[13.5px] text-(--jobs-navy)">{title}</h4>
      <ul className="mt-2 flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[13.5px] text-(--jobs-ink-soft) leading-relaxed">
            <span className="mt-1.75 w-1 h-1 rounded-full bg-(--jobs-ink-soft) shrink-0" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Skills read better as scannable tags than prose bullets — kept as a
// separate layout from BulletList rather than forcing one shape on both.
function TagList({ title, items }) {
  if (!items?.length) return null
  return (
    <div className="mt-5">
      <h4 className="font-bold text-[13.5px] text-(--jobs-navy)">{title}</h4>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-(--jobs-bg-subtle) text-(--jobs-ink-soft)">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// Indeed-style "job details" row — an icon, a bold label, and one or more
// value chips underneath it. Skips rendering entirely if every chip inside
// it turned out empty, so a row never shows up as just a bare label.
function DetailRow({ icon, label, children }) {
  const hasContent = Array.isArray(children) ? children.some(Boolean) : Boolean(children)
  if (!hasContent) return null
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex items-center justify-center w-5 h-5 text-(--jobs-ink-soft) shrink-0" aria-hidden="true">{icon}</span>
      <div className="min-w-0">
        <p className="font-bold text-[13.5px] text-(--jobs-navy)">{label}</p>
        <div className="mt-1.5 flex flex-wrap gap-2">{children}</div>
      </div>
    </div>
  )
}

function DetailChip({ children }) {
  return <span className="text-[13px] font-semibold px-3 py-1.5 rounded-lg bg-(--jobs-bg-subtle) text-(--jobs-navy)">{children}</span>
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="mt-6 mb-4">
      <h4 className="font-extrabold text-[16px] text-(--jobs-navy)">{title}</h4>
      {subtitle && <p className="mt-0.5 text-[12.5px] text-(--jobs-ink-soft)">{subtitle}</p>}
    </div>
  )
}

function Divider() {
  return <hr className="mt-6 border-(--jobs-border)" />
}

export default function LatestJobs({ jobs: jobsProp }) {
  // Live jobs are whatever admin/ops have approved and pushed to the public
  // feed. Falls back to the curated LATEST_JOBS_DATA sample while that
  // request is in flight, if it fails, or once it comes back empty — so the
  // section never renders looking broken or blank before real jobs exist.
  const [liveJobs, setLiveJobs] = useState(null)

  useEffect(() => {
    if (jobsProp) return
    let cancelled = false
    fetchLatestJobs({ limit: 8 })
      .then((data) => {
        if (!cancelled) setLiveJobs(data)
      })
      .catch(() => {
        if (!cancelled) setLiveJobs([])
      })
    return () => {
      cancelled = true
    }
  }, [jobsProp])

  const jobs = jobsProp ?? (liveJobs?.length ? liveJobs : LATEST_JOBS_DATA)
  const [selected, setSelected] = useState(0)
  const [copied, setCopied] = useState(false)
  const [applyOpen, setApplyOpen] = useState(false)
  const detailRef = useRef(null)
  const job = jobs[selected]

  function selectJob(i) {
    setSelected(i)
    setCopied(false)
    setApplyOpen(false)
    // On narrow screens the detail panel sits below the list (grid
    // collapses to one column) — jump to it so picking a job doesn't
    // silently update content off-screen.
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  // Native share sheet where supported (mobile browsers), otherwise falls
  // back to copying the apply link so the button still does something useful
  // on desktop.
  async function shareJob() {
    const url = jobHref(job)
    try {
      if (navigator.share) {
        await navigator.share({ title: job.title, text: `${job.title} at ${job.company}`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Share sheet dismissed or clipboard unavailable — nothing to recover.
    }
  }

  return (
    <section id="latest-jobs" className="bg-white py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-(--jobs-navy) tracking-tight">Latest jobs</h2>
            <p className="mt-2 text-[15px] text-(--jobs-ink-soft)">Fresh, screened openings added by verified employers — select a role to see the full description.</p>
          </div>
          <a
            href={`${EMPLOYEE_APP_URL}/app/jobs`}
            className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-[14.5px] font-bold text-(--jobs-blue) hover:text-(--jobs-blue-dark) transition-colors"
          >
            View all jobs <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal direction="up" duration={0.7} delay={0.05} className="grid lg:grid-cols-[380px_1fr] gap-5 items-start">
          <div className="flex flex-col gap-2.5 lg:max-h-184 lg:overflow-y-auto lg:pr-1.5">
            {jobs.map((j, i) => {
              const active = i === selected
              return (
                <button
                  key={j.id ?? `${j.title}-${j.company}`}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectJob(i)}
                  className={`text-left rounded-xl border p-4 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--jobs-blue) ${
                    active
                      ? 'border-(--jobs-blue) bg-(--jobs-blue-tint)'
                      : 'border-(--jobs-border) bg-white hover:border-(--jobs-navy)/30 hover:bg-(--jobs-bg-subtle)'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true">
                      <Avatar initials={initialsOf(j.company)} tone={LOGO_TONES[i % LOGO_TONES.length]} size="sm" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[14px] text-(--jobs-navy) leading-snug truncate">{j.title}</h3>
                      <p className="text-[12.5px] text-(--jobs-ink-soft) truncate">{j.company}</p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-(--jobs-ink-soft)">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="shrink-0" aria-hidden="true" />
                      {j.location.split(',')[0]}
                    </span>
                    {j.salary && (
                      <span className="flex items-center gap-1">
                        <IndianRupee size={11} className="shrink-0" aria-hidden="true" />
                        {j.salary}
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <Pill className={WORK_MODE_STYLE[j.workMode] || NEUTRAL_PILL}>{j.workMode}</Pill>
                    <span className="flex items-center gap-1 text-[11px] text-(--jobs-ink-soft)">
                      <Clock size={11} className="shrink-0" aria-hidden="true" />
                      {j.postedDaysAgo === 0 ? 'Today' : `${j.postedDaysAgo}d ago`}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div ref={detailRef} className="lg:sticky lg:top-24 bg-white border border-(--jobs-border) rounded-xl p-6 sm:p-7 scroll-mt-24">
            {applyOpen ? (
              <ApplyPanel job={job} onClose={() => setApplyOpen(false)} />
            ) : (
              <>
            <div className="flex items-start gap-4">
              <span aria-hidden="true">
                <Avatar initials={initialsOf(job.company)} tone={LOGO_TONES[selected % LOGO_TONES.length]} size="lg" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-xl text-(--jobs-navy) leading-snug">{job.title}</h3>
                <p className="mt-1 text-[13.5px] text-(--jobs-ink-soft) flex flex-wrap items-center gap-x-1.5">
                  <span className="font-semibold text-(--jobs-navy)">{job.company}</span>
                  <span aria-hidden="true">·</span>
                  <span>{job.location}</span>
                  {job.workMode && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{job.workMode}</span>
                    </>
                  )}
                </p>
                {job.salary && <p className="mt-1.5 text-[16px] font-extrabold text-(--jobs-navy)">{job.salary}</p>}
                {job.recruiterOnline && (
                  <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-(--jobs-teal-dark)">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--jobs-teal) opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-(--jobs-teal-dark)" />
                    </span>
                    Recruiter online
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {job.applyUrl ? (
                <a
                  href={job.applyUrl}
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-(--jobs-teal-dark) text-white text-[14.5px] font-bold hover:bg-(--jobs-navy) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--jobs-teal-dark) transition-colors"
                >
                  Apply now <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setApplyOpen(true)}
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-(--jobs-teal-dark) text-white text-[14.5px] font-bold hover:bg-(--jobs-navy) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--jobs-teal-dark) transition-colors"
                >
                  Apply now <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={shareJob}
                aria-label="Share this job"
                className="flex items-center justify-center w-12 h-12 rounded-lg bg-(--jobs-bg-subtle) text-(--jobs-navy) hover:bg-(--jobs-border)/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--jobs-blue) transition-colors"
              >
                {copied ? <Check size={18} aria-hidden="true" /> : <Share2 size={18} aria-hidden="true" />}
              </button>
            </div>
            <span className="mt-2.5 flex items-center gap-1.5 text-[13px] text-(--jobs-ink-soft)">
              <Clock size={13} className="shrink-0" aria-hidden="true" />
              {copied ? 'Link copied' : `Posted ${job.postedDaysAgo === 0 ? 'today' : `${job.postedDaysAgo} days ago`}`}
            </span>

            <Divider />

            <SectionHeading title="Job details" />
            <div className="flex flex-col gap-4">
              <DetailRow icon={<IndianRupee size={16} aria-hidden="true" />} label="Pay">
                {job.salary && <DetailChip>{job.salary}</DetailChip>}
              </DetailRow>
              <DetailRow icon={<Briefcase size={16} aria-hidden="true" />} label="Job type">
                {job.employmentType && <DetailChip>{job.employmentType}</DetailChip>}
              </DetailRow>
              <DetailRow icon={<TrendingUp size={16} aria-hidden="true" />} label="Experience">
                {job.experience && <DetailChip>{job.experience}</DetailChip>}
              </DetailRow>
              <DetailRow icon={<MapPin size={16} aria-hidden="true" />} label="Location">
                {job.location && <DetailChip>{job.location}</DetailChip>}
              </DetailRow>
              <DetailRow icon={<Users size={16} aria-hidden="true" />} label="Openings">
                {job.vacancies > 0 && <DetailChip>{job.vacancies} opening{job.vacancies === 1 ? '' : 's'}</DetailChip>}
              </DetailRow>
            </div>

            {job.benefits?.length > 0 && (
              <>
                <Divider />
                <SectionHeading title="Benefits" subtitle="Pulled from the full job description" />
                <ul className="flex flex-col gap-1.5">
                  {job.benefits.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13.5px] text-(--jobs-ink-soft) leading-relaxed">
                      <span className="mt-1.75 w-1 h-1 rounded-full bg-(--jobs-ink-soft) shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <Divider />

            <SectionHeading title="Full job description" />
            {job.description && <p className="text-[14.5px] text-(--jobs-navy) leading-relaxed">{job.description}</p>}
            <BulletList title="What you'll do" items={job.highlights} />
            <TagList title="Skills" items={job.skills} />
              </>
            )}
          </div>
        </Reveal>

        <div className="mt-8 flex justify-center sm:hidden">
          <a
            href={`${EMPLOYEE_APP_URL}/app/jobs`}
            className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-(--jobs-blue) hover:text-(--jobs-blue-dark) transition-colors"
          >
            View all jobs <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
