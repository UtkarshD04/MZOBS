import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { Container } from '../primitives'
import JobListItem, { JobListItemSkeleton } from '../JobListItem'
import { fetchLatestJobs } from '../../../lib/publicJobs'

const LIMIT = 6

// Roles Mzobs staff flagged as urgent-to-fill (Job.instantHiring), kept out of
// the "Latest opportunities" feed (which asks for urgent=exclude) and listed
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
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-amber-100 text-amber-700" aria-hidden="true">
            <Zap size={17} strokeWidth={2.4} />
          </span>
          <div>
            <h2 id="urgent-title" className="text-[20px] font-bold tracking-[-0.015em] text-mz-ink sm:text-[22px]">Urgent hiring</h2>
            <p className="mt-0.5 text-[13.5px] text-mz-muted">Companies that need to fill these roles fast</p>
          </div>
        </div>

        <ul className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2" aria-busy={!jobs || undefined}>
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
      </Container>
    </section>
  )
}
