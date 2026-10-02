import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, X } from 'lucide-react'
import JobDetailPanel from '../../sections/home/JobDetailPanel'
import { jobPath } from '../JobCard'

// The selected job's full description beside the homepage feed (desktop
// only — smaller screens open /jobs/:id instead). Sticky, with its own scroll,
// so the feed stays where it was while you read. Escape or ✕ closes it.
export default function JobSidePanel({ job, nextJob, onNext, onClose }) {
  const scrollRef = useRef(null)
  const headingRef = useRef(null)

  // New job: back to the top of the panel, and move focus there so keyboard
  // and screen-reader users land on what just opened.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [job.id])

  useEffect(() => {
    const onKey = (e) => {
      // Leave Escape to an open dialog (e.g. the filter sheet) first.
      if (e.key === 'Escape' && !document.querySelector('[role="dialog"][aria-modal="true"]')) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <aside aria-labelledby="job-panel-title" className="sticky top-20 flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-[12px] border border-mz-line bg-white">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-mz-line px-4 py-2.5">
        <h2 id="job-panel-title" ref={headingRef} tabIndex={-1} className="text-[13px] font-semibold uppercase tracking-[0.06em] text-mz-muted outline-none">
          Job details
        </h2>
        <div className="flex items-center gap-1">
          <Link
            to={jobPath(job)}
            state={{ job }}
            className="inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1.5 text-[13px] font-semibold text-mz-primary-strong hover:bg-mz-primary-tint"
          >
            Open full page <ExternalLink size={13} aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close job details"
            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-mz-ink hover:bg-mz-bg focus-visible:outline-2 focus-visible:outline-mz-primary"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 sm:p-7">
        <JobDetailPanel key={job.id} job={job} nextJob={nextJob} onNext={onNext} />
      </div>
    </aside>
  )
}
