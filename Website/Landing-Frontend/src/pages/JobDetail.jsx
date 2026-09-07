import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, SearchX } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import JobDetailPanel from '../components/sections/home/JobDetailPanel'
import { fetchJobById } from '../lib/publicJobs'

// Mobile's standalone job description page — the "Latest jobs" list
// (LatestJobs.jsx) sends a card tap here below the `lg` breakpoint instead
// of showing an inline side panel. The job usually rides along as router
// state (instant, no request), so this only ever fetches on a direct link
// or a page refresh — see Backend's GET /api/jobs/:id.
export default function JobDetail() {
  const { id } = useParams()
  const location = useLocation()
  const stateJob = location.state?.job

  const [job, setJob] = useState(stateJob ?? null)
  const [status, setStatus] = useState(stateJob ? 'ready' : 'loading')

  useEffect(() => {
    if (stateJob) return
    let cancelled = false
    const controller = new AbortController()
    setStatus('loading')

    fetchJobById(id, { signal: controller.signal })
      .then((fetched) => {
        if (cancelled) return
        setJob(fetched)
        setStatus(fetched ? 'ready' : 'not-found')
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        setStatus('not-found')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div className="min-h-screen bg-(--jobs-bg-subtle) flex flex-col">
      <title>{job ? `${job.title} at ${job.company} — Mzobs` : 'Job — Mzobs'}</title>
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto px-6 pt-25 pb-8">
        <Link
          to="/#latest-jobs"
          className="inline-flex items-center gap-1.5 mb-5 h-8 px-1 text-[13.5px] font-bold text-(--jobs-navy) hover:text-(--jobs-blue-dark) transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back to jobs
        </Link>

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--jobs-border) bg-white py-20 px-6 text-center">
            <Loader2 size={26} className="animate-spin text-(--jobs-ink-soft)" aria-hidden="true" />
            <p className="text-[13.5px] text-(--jobs-ink-soft)">Loading job…</p>
          </div>
        )}

        {status === 'not-found' && (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--jobs-border) bg-white py-20 px-6 text-center">
            <SearchX size={26} className="text-(--jobs-ink-soft)" aria-hidden="true" />
            <p className="text-[15px] font-bold text-(--jobs-navy)">This job isn't available anymore</p>
            <p className="text-[13.5px] text-(--jobs-ink-soft) max-w-sm">It may have closed, or the link is out of date.</p>
            <Link
              to="/#latest-jobs"
              className="mt-1.5 inline-flex items-center justify-center h-10 px-5 rounded-lg bg-(--jobs-teal-dark) text-white text-[13.5px] font-bold hover:bg-(--jobs-navy) transition-colors"
            >
              Browse latest jobs
            </Link>
          </div>
        )}

        {status === 'ready' && job && (
          <div className="bg-white border border-(--jobs-border) rounded-xl p-6 sm:p-7">
            <JobDetailPanel job={job} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
