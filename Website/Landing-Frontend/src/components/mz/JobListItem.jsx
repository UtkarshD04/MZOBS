import { memo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Bookmark, BookmarkCheck } from 'lucide-react'
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
function JobListItem({ job, onOpen, selected = false }) {
  const toast = useToast()
  // Read after mount — localStorage doesn't exist during prerender.
  const [saved, setSaved] = useState(false)
  useEffect(() => setSaved(isJobSaved(job)), [job])

  function toggleSave() {
    const next = toggleJobSaved(job)
    setSaved(next)
    toast(next ? 'Job saved on this device' : 'Removed from saved jobs', { tone: next ? 'success' : 'info' })
  }

  const meta = [job.location?.split(',')[0], job.experience, job.workMode].filter(Boolean)
  const skills = (job.skills ?? []).filter(Boolean).slice(0, 3)
  const salary = salaryText(job)
  const posted = postedLabel(job.postedDaysAgo)

  return (
    <article
      className={`group relative rounded-[8px] border px-4 py-4 transition-colors duration-150 focus-within:border-mz-primary sm:px-5 ${
        selected ? 'border-mz-primary bg-mz-primary-tint/50' : 'border-mz-line bg-white hover:border-mz-line-strong'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <CompanyLogo name={job.company} logo={job.logo} size={40} className="rounded-[6px]" />
        <div className="min-w-0 flex-1">
          <h3 className="pr-9 text-[15.5px] font-semibold leading-snug text-mz-ink">
            <Link
              to={jobPath(job)}
              state={{ job }}
              aria-current={selected ? 'true' : undefined}
              onClick={(e) => {
                if (!onOpen || !opensInline(e)) return
                e.preventDefault()
                onOpen(job)
              }}
              className="decoration-mz-ink/30 underline-offset-[3px] outline-none group-hover:underline after:absolute after:inset-0 after:rounded-[8px] after:content-['']"
            >
              <span className="line-clamp-2">{job.title}</span>
            </Link>
          </h3>
          <p className="mt-0.5 flex min-w-0 items-center gap-1 text-[14px] text-mz-ink-2">
            <span className="truncate">{job.company}</span>
            {job.verified && (
              <span className="inline-flex shrink-0 text-mz-primary" title="Verified employer">
                <BadgeCheck size={15} aria-hidden="true" />
                <span className="sr-only">(verified employer)</span>
              </span>
            )}
            {job.instantHiring && (
              <span className="ml-1.5 shrink-0 rounded-[4px] bg-amber-100 px-1.5 py-px text-[11.5px] font-semibold text-amber-800">Urgent</span>
            )}
          </p>

          <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-[13.5px] text-mz-muted">
            {meta.length > 0 && <span>{meta.join(' · ')}</span>}
            {salary && (
              <span className="font-semibold text-mz-ink">
                <span className="sr-only">Salary: </span>
                {salary}
              </span>
            )}
          </p>

          {(skills.length > 0 || posted) && (
            <div className="mt-3 flex items-end justify-between gap-3">
              <ul className="flex min-w-0 flex-wrap gap-1.5" aria-label="Skills">
                {skills.map((s) => (
                  <li key={s} className="rounded-[4px] bg-mz-bg px-2 py-0.5 text-[12.5px] text-mz-ink-2 ring-1 ring-inset ring-mz-line">
                    {s}
                  </li>
                ))}
              </ul>
              {posted && <span className="shrink-0 text-[12.5px] text-mz-muted">{posted}</span>}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={toggleSave}
        aria-pressed={saved}
        aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
        className={`absolute right-2 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-[6px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-mz-primary ${
          saved ? 'text-mz-primary' : 'text-mz-muted/70 hover:bg-mz-bg hover:text-mz-ink'
        }`}
      >
        {saved ? <BookmarkCheck size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}
      </button>
    </article>
  )
}

export function JobListItemSkeleton() {
  return (
    <div className="rounded-[8px] border border-mz-line bg-white px-4 py-4 sm:px-5" aria-hidden="true">
      <div className="flex items-start gap-3.5">
        <div className="mz-skeleton h-10 w-10 rounded-[6px]" />
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

export default memo(JobListItem)
