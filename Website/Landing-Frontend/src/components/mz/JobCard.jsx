import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, Briefcase, Clock, MapPin, Monitor } from 'lucide-react'
import { CompanyLogo } from './primitives'
import { isJobSaved, toggleJobSaved } from '../../lib/savedJobs'
import { useToast } from './Toast'

export function postedLabel(days) {
  if (days == null) return ''
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function jobPath(job) {
  return `/jobs/${job.id ?? encodeURIComponent(job.title)}`
}

// Real salary only — the API sends a "Depends on…" sentence when a job has no
// range, which reads better here as a short label.
function salaryText(job) {
  if (!job.salaryMin || !job.salaryMax) return 'Not disclosed'
  // "₹1.2L – ₹1.2L" reads as a typo; a fixed salary shows once.
  const [lo, hi] = (job.salary ?? '').split(/\s*[–-]\s*/)
  return lo && lo === hi ? lo : job.salary
}

// One job listing. The whole card is a link to the job page (title link with
// a stretched ::after); Save and Apply sit above that overlay as their own
// controls, so there are no nested interactive elements.
export default function JobCard({ job }) {
  const toast = useToast()
  // Read after mount — localStorage doesn't exist during prerender, and the
  // first client paint must match the server markup.
  const [saved, setSaved] = useState(false)
  useEffect(() => setSaved(isJobSaved(job)), [job])

  function toggleSave() {
    const next = toggleJobSaved(job)
    setSaved(next)
    toast(next ? 'Job saved on this device' : 'Removed from saved jobs', { tone: next ? 'success' : 'info' })
  }

  const meta = [
    { icon: MapPin, text: job.location?.split(',')[0] },
    { icon: Monitor, text: job.workMode },
    { icon: Briefcase, text: job.experience },
  ].filter((m) => m.text)

  return (
    <article className="group relative flex h-full flex-col rounded-3xl bg-white p-5 ring-1 ring-mz-line shadow-mz-card transition-[transform,box-shadow] duration-300 ease-(--ease-mz) focus-within:ring-2 focus-within:ring-mz-primary motion-safe:hover:-translate-y-1 hover:shadow-mz-lift">
      <div className="flex items-start gap-3">
        <CompanyLogo name={job.company} logo={job.logo} size={46} />
        <div className="min-w-0 flex-1">
          <p className="flex min-w-0 items-center gap-1 text-[13px] font-medium text-mz-muted">
            <span className="truncate">{job.company}</span>
          </p>
          <h3 className="mt-0.5 text-[16.5px] font-semibold leading-snug tracking-[-0.01em] text-mz-ink">
            <Link to={jobPath(job)} state={{ job }} className="outline-none after:absolute after:inset-0 after:rounded-3xl after:content-['']">
              <span className="line-clamp-2">{job.title}</span>
            </Link>
          </h3>
        </div>
        <button
          type="button"
          onClick={toggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
          className={`relative z-10 -mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-mz-primary ${
            saved ? 'bg-mz-primary-tint text-mz-primary-strong' : 'text-mz-muted hover:bg-mz-bg hover:text-mz-ink'
          }`}
        >
          {saved ? <BookmarkCheck size={18} aria-hidden="true" /> : <Bookmark size={18} aria-hidden="true" />}
        </button>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-mz-ink-2">
        {meta.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-1.5">
            <Icon size={14} className="text-mz-muted" aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>

      <p className={`mt-3 text-[15px] font-semibold ${job.salaryMin ? 'text-mz-ink' : 'font-medium text-mz-muted'}`}>
        <span className="sr-only">Salary: </span>
        {salaryText(job)}
      </p>

      <div className="min-h-4 flex-1" aria-hidden="true" />
      <div className="flex items-center justify-between gap-2 border-t border-mz-line pt-4">
        <div className="flex min-w-0 items-center gap-2">
          {job.employmentType && (
            <span className="rounded-full bg-mz-primary-tint px-2 py-0.5 text-[11px] font-semibold text-mz-primary-strong">{job.employmentType}</span>
          )}
          <span className="flex items-center gap-1 whitespace-nowrap text-[12px] text-mz-muted">
            <Clock size={12} aria-hidden="true" />
            {postedLabel(job.postedDaysAgo)}
          </span>
        </div>
        <Link
          to={jobPath(job)}
          state={{ job, apply: true }}
          className="relative z-10 inline-flex h-9 items-center rounded-full bg-mz-ink px-4 text-[13px] font-semibold text-white transition-colors hover:bg-mz-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary"
          aria-label={`Apply for ${job.title} at ${job.company}`}
        >
          Apply
        </Link>
      </div>
    </article>
  )
}

export function JobCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-3xl bg-white p-5 ring-1 ring-mz-line" aria-hidden="true">
      <div className="flex items-start gap-3">
        <div className="mz-skeleton h-[46px] w-[46px] rounded-xl" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="mz-skeleton h-3 w-1/3 rounded" />
          <div className="mz-skeleton h-4 w-3/4 rounded" />
        </div>
      </div>
      <div className="mz-skeleton mt-5 h-3 w-2/3 rounded" />
      <div className="mz-skeleton mt-3 h-4 w-1/3 rounded" />
      <div className="mt-6 flex justify-between border-t border-mz-line pt-4">
        <div className="mz-skeleton h-5 w-24 rounded-full" />
        <div className="mz-skeleton h-9 w-20 rounded-full" />
      </div>
    </div>
  )
}
