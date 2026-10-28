import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { Container } from '../primitives'
import JobListItem, { JobListItemSkeleton } from '../JobListItem'
import { fetchLatestJobs } from '../../../lib/publicJobs'

const LIMIT = 6

// Roles Mzobs staff flagged as urgent-to-fill (Job.instantHiring), kept out of
// the "Latest jobs" feed (which asks for urgent=exclude) and listed
// here instead. Renders nothing while there are none, and if the request
// fails, rather than showing an empty or broken block.
export default function UrgentHiringSection() {
  const [jobs, setJobs] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchLatestJobs({ urgent: 'only', sort: 'newest', limit: LIMIT }, { signal: controller.signal })
      .then(({ jobs: list }) => setJobs(list))
      .catch((err) => {
        if (err?.name !== 'AbortError') setJobs([])
      })
    return () => controller.abort()
  }, [])

  if (jobs && jobs.length === 0) return null

  return (
    <section aria-labelledby="urgent-title" className="pb-8 lg:pb-10">
      <Container>
        <div className="rounded-[8px] border border-amber-200 bg-amber-50/50 p-4 sm:p-5">
        <div className="flex items-start gap-2.5">
          <Zap size={18} strokeWidth={2.2} className="mt-1.5 shrink-0 text-amber-600" aria-hidden="true" />
          <div>
            <h2 id="urgent-title" className="text-mz-ink text-[22px] sm:text-[24px] font-bold leading-tight tracking-tight">Urgent hiring</h2>
            <p className="mt-0.5 text-mz-muted text-[14px] leading-relaxed">Companies that need to fill these roles fast</p>
          </div>
        </div>

        {/* Two columns only when there's a second card to fill them. */}
        <ul className={`mt-4 grid grid-cols-1 gap-2.5 ${jobs?.length === 1 ? '' : 'lg:grid-cols-2'}`} aria-busy={!jobs || undefined}>
          {jobs
            ? jobs.map((job) => (
                <li key={job.id}>
                  <JobListItem job={job} />
                </li>
              ))
            : Array.from({ length: 2 }).map((_, i) => (
                <li key={i}>
                  <JobListItemSkeleton />
                </li>
              ))}
        </ul>
        </div>
      </Container>
    </section>
  )
}
