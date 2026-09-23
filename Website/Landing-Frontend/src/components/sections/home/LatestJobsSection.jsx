import { useEffect, useState } from 'react'
import { MapPin, ArrowRight, Loader2, RotateCw, SearchX, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { CompanyMark } from './jobCardPrimitives'
import { fetchLatestJobs } from '../../../lib/publicJobs'
import { buildJobsUrl } from '../../../lib/jobsUrl'
import { useInitialHomeData } from '../../../lib/initialHomeDataContext'

// The homepage only ever shows a taste of the marketplace — a real "browse
// everything, filter by anything" experience belongs on the dedicated jobs
// listing (buildJobsUrl → the employee dashboard app's /app/jobs), not
// duplicated here behind a permanent sidebar.
const HOMEPAGE_JOBS_LIMIT = 6

function postedLabel(job) {
  if (job.postedDaysAgo == null) return null
  if (job.postedDaysAgo <= 0) return 'Posted today'
  if (job.postedDaysAgo === 1) return 'Posted yesterday'
  return `Posted ${job.postedDaysAgo} days ago`
}

// Neutral, information-first card — white surface, one border, no per-card
// color rotation. Hierarchy comes from type scale and spacing, not tint.
function JobCard({ job, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative w-full h-full min-w-0 text-left flex flex-col rounded-2xl border border-(--explorer-border) bg-white p-5 motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 hover:border-(--explorer-blue-border) hover:shadow-[0_8px_20px_-12px_rgba(17,24,39,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
    >
      <div className="flex items-start justify-between gap-3">
        <CompanyMark company={job.company} logo={job.logo} size="sm" tone="bg-(--explorer-bg) text-(--explorer-navy)" />
        {job.verified && (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wide text-(--explorer-teal)">
            <ShieldCheck size={12} aria-hidden="true" /> Verified
          </span>
        )}
      </div>

      <p className="mt-3 text-[12px] font-semibold text-(--explorer-muted) truncate">{job.company}</p>
      <h3 className="mt-0.5 text-[16px] font-bold text-(--explorer-navy) leading-snug text-balance">{job.title}</h3>

      <p className="mt-2 flex items-center gap-1 text-[12.5px] text-(--explorer-muted)">
        <MapPin size={12} className="shrink-0" aria-hidden="true" />
        <span className="truncate">{job.location}</span>
        {job.experience && <span className="text-(--explorer-border)">·</span>}
        {job.experience && <span className="truncate">{job.experience}</span>}
      </p>

      <p className="mt-2 text-[15px] font-bold text-(--explorer-navy)">{job.salary || 'Not disclosed'}</p>

      {(job.employmentType || job.workMode) && (
        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-semibold text-(--explorer-muted)">
          {job.employmentType && <span className="px-2 py-0.5 rounded-full bg-(--explorer-bg)">{job.employmentType}</span>}
          {job.workMode && <span className="px-2 py-0.5 rounded-full bg-(--explorer-bg)">{job.workMode}</span>}
        </div>
      )}

      <div className="mt-auto pt-3 flex items-center justify-between">
        <span className="text-[11.5px] text-(--explorer-muted)">{postedLabel(job)}</span>
        <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-(--explorer-blue) opacity-0 group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-200">
          View details
          <ArrowRight size={13} aria-hidden="true" />
        </span>
      </div>
    </button>
  )
}

function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-(--explorer-border) bg-white p-5 animate-pulse flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl bg-(--explorer-bg)" />
        <div className="w-14 h-2.5 rounded bg-(--explorer-bg)" />
      </div>
      <div className="h-2.5 w-1/2 rounded bg-(--explorer-bg)" />
      <div className="h-4 w-3/4 rounded bg-(--explorer-bg)" />
      <div className="h-2.5 w-1/3 rounded bg-(--explorer-bg)" />
      <div className="h-4 w-1/2 rounded bg-(--explorer-bg) mt-1" />
    </div>
  )
}

// Real feed, real jobs — fetchLatestJobs is the exact same Backend GET
// /api/jobs used by the dedicated jobs listing and city pages, just capped
// to 6 and sorted newest-first for the homepage's own restrained preview.
export default function LatestJobsSection() {
  const navigate = useNavigate()

  // Seeded from the build-time prerender fetch (see initialHomeDataContext.js)
  // so the default view never ships as "0 opportunities" — the effect below
  // still re-fetches live data right after mount regardless.
  const initialHomeData = useInitialHomeData()
  const [jobs, setJobs] = useState((initialHomeData?.jobs ?? []).slice(0, HOMEPAGE_JOBS_LIMIT))
  const [loading, setLoading] = useState(!initialHomeData)
  const [loadError, setLoadError] = useState(false)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    setLoadError(false)
    fetchLatestJobs({ sort: 'newest', limit: HOMEPAGE_JOBS_LIMIT, page: 1 }, { signal: controller.signal })
      .then(({ jobs: fetchedJobs }) => {
        if (cancelled) return
        setJobs(fetchedJobs)
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        setJobs([])
        setLoadError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [retryToken])

  function openJob(job) {
    navigate(`/jobs/${job.id ?? encodeURIComponent(job.title)}`, { state: { job } })
  }

  const showInitialLoading = loading && jobs.length === 0 && !loadError
  const showError = !loading && loadError
  const showEmpty = !loading && !loadError && jobs.length === 0

  return (
    <section id="latest-jobs" className="bg-white py-16 md:py-20 px-6 md:px-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.5} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[26px] sm:text-[32px] font-extrabold tracking-tight text-(--explorer-navy)">Latest verified jobs</h2>
            <p className="mt-1.5 text-[14.5px] text-(--explorer-muted)">Fresh roles from companies hiring right now on Mzobs.</p>
          </div>
          <a
            href={buildJobsUrl({})}
            className="group inline-flex items-center gap-1.5 text-[13.5px] font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover) transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) rounded-md"
          >
            View all jobs
            <ArrowRight size={14} className="motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </Reveal>

        {showError ? (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-(--explorer-border) py-16 px-6 text-center">
            <SearchX size={26} className="text-(--explorer-muted)" aria-hidden="true" />
            <p className="text-[15px] font-bold text-(--explorer-navy)">Couldn't load jobs right now</p>
            <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">There was a problem reaching the jobs feed. Check your connection and try again.</p>
            <button
              type="button"
              onClick={() => setRetryToken((n) => n + 1)}
              className="mt-1.5 inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-(--explorer-blue) text-white text-[13px] font-bold hover:bg-(--explorer-blue-hover) transition-colors"
            >
              <RotateCw size={14} aria-hidden="true" /> Retry
            </button>
          </div>
        ) : showInitialLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: HOMEPAGE_JOBS_LIMIT }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : showEmpty ? (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-(--explorer-border) py-16 px-6 text-center">
            <SearchX size={26} className="text-(--explorer-muted)" aria-hidden="true" />
            <p className="text-[15px] font-bold text-(--explorer-navy)">No openings live right now</p>
            <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">New verified roles are added regularly — check back soon.</p>
          </div>
        ) : (
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.06}>
            {jobs.map((job) => (
              <StaggerItem key={job.id ?? `${job.title}-${job.company}`} y={16} scale={1} duration={0.4}>
                <JobCard job={job} onOpen={() => openJob(job)} />
              </StaggerItem>
            ))}
            {loading && jobs.length > 0 && (
              <div className="col-span-full flex justify-center pt-1">
                <Loader2 size={16} className="animate-spin text-(--explorer-muted)" aria-hidden="true" />
              </div>
            )}
          </StaggerGroup>
        )}
      </div>
    </section>
  )
}
