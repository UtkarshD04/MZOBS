import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Bookmark, BookmarkCheck, Briefcase, MapPin, Monitor, Zap } from 'lucide-react'
import { CompanyLogo } from './primitives'
import { jobPath, postedLabel } from './JobCard'
import { isJobSaved, toggleJobSaved } from '../../lib/savedJobs'
import { useToast } from './Toast'

// Real range only — the API sends a "Depends on…" sentence when a job has no
// salary, and that's simply left off here.
function salaryText(job) {
  if (!job.salaryMin || !job.salaryMax) return ''
  const [lo, hi] = (job.salary ?? '').split(/\s*[–-]\s*/)
  return lo && lo === hi ? lo : job.salary
}

// A plain left click on desktop opens the job beside the feed instead of
// navigating; modified clicks (new tab/window) and small screens keep the
// real link to the job page.
function opensInline(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && window.matchMedia('(min-width: 1024px)').matches
}

// One row of the homepage job feed. The whole row links to the job page
// (stretched ::after on the title link); Save sits above that overlay as its
// own control, so nothing interactive is nested. With `onOpen`, desktop opens
// the job in the side panel instead (see opensInline); `selected` marks the
// row that panel is showing.
export default function JobListItem({ job, onOpen, selected = false }) {
  const toast = useToast()
  // Read after mount — localStorage doesn't exist during prerender.
  const [saved, setSaved] = useState(false)
  useEffect(() => setSaved(isJobSaved(job)), [job])

  function toggleSave() {
    const next = toggleJobSaved(job)
    setSaved(next)
    toast(next ? 'Job saved on this device' : 'Removed from saved jobs', { tone: next ? 'success' : 'info' })
  }

  const meta = [
    { icon: MapPin, text: job.location?.split(',')[0] },
    { icon: Briefcase, text: job.experience },
    { icon: Monitor, text: job.workMode },
  ].filter((m) => m.text)
  const skills = (job.skills ?? []).filter(Boolean).slice(0, 2)
  const salary = salaryText(job)

  return (
    <article
      className={`group relative rounded-[12px] border p-4 transition-[border-color,transform,box-shadow,background-color] duration-150 focus-within:border-mz-primary hover:shadow-mz-lift motion-safe:hover:-translate-y-px sm:p-5 ${
        selected ? 'border-mz-primary bg-mz-primary-tint/40' : 'border-mz-line bg-white hover:border-mz-primary/50'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <CompanyLogo name={job.company} logo={job.logo} size={44} className="rounded-[10px]" />
        <div className="min-w-0 flex-1">
          <h3 className="pr-9 text-[16px] font-semibold leading-snug text-mz-ink">
            <Link
              to={jobPath(job)}
              state={{ job }}
              aria-current={selected ? 'true' : undefined}
              onClick={(e) => {
                if (!onOpen || !opensInline(e)) return
                e.preventDefault()
                onOpen(job)
              }}
              className="outline-none after:absolute after:inset-0 after:rounded-[12px] after:content-['']"
            >
              <span className="line-clamp-2">{job.title}</span>
            </Link>
          </h3>
          <p className="mt-0.5 flex min-w-0 items-center gap-1 text-[13.5px] text-mz-ink-2">
            <span className="truncate">{job.company}</span>
            {job.verified && (
              <BadgeCheck size={14} className="shrink-0 text-mz-primary" aria-label="Verified employer" role="img" />
            )}
            {job.instantHiring && (
              <span className="ml-1 inline-flex shrink-0 items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">
                <Zap size={11} strokeWidth={2.6} aria-hidden="true" /> Urgent
              </span>
            )}
          </p>

          <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-mz-muted">
            {meta.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5">
                <Icon size={13.5} aria-hidden="true" />
                {text}
              </li>
            ))}
            {salary && (
              <li className="font-medium text-mz-ink">
                <span className="sr-only">Salary: </span>
                {salary}
              </li>
            )}
          </ul>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {skills.map((s) => (
                <span key={s} className="rounded bg-mz-bg px-2 py-0.5 text-[12px] font-medium text-mz-ink-2 ring-1 ring-mz-line">{s}</span>
              ))}
              {job.postedDaysAgo != null && (
                <span className="text-[12px] text-mz-muted">
                  {skills.length > 0 && <span aria-hidden="true" className="mr-1.5">&middot;</span>}
                  {postedLabel(job.postedDaysAgo)}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-mz-primary" aria-hidden="true">
              View role
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleSave}
        aria-pressed={saved}
        aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
        className={`absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-[8px] transition-colors focus-visible:outline-2 focus-visible:outline-mz-primary ${
          saved ? 'bg-mz-primary-tint text-mz-primary-strong' : 'text-mz-muted hover:bg-mz-bg hover:text-mz-ink'
        }`}
      >
        {saved ? <BookmarkCheck size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}
      </button>
    </article>
  )
}

export function JobListItemSkeleton() {
  return (
    <div className="rounded-[12px] border border-mz-line bg-white p-4 sm:p-5" aria-hidden="true">
      <div className="flex items-start gap-3.5">
        <div className="mz-skeleton h-11 w-11 rounded-[10px]" />
        <div className="flex-1 space-y-2.5 pt-0.5">
          <div className="mz-skeleton h-4 w-2/3 rounded" />
          <div className="mz-skeleton h-3 w-1/3 rounded" />
          <div className="mz-skeleton h-3 w-1/2 rounded" />
          <div className="mz-skeleton h-3 w-1/4 rounded" />
        </div>
      </div>
    </div>
  )
}
