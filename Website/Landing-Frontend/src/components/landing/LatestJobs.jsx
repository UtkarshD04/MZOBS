import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { jobPath } from '../mz/JobCard'
import { fetchLatestJobs } from '../../lib/publicJobs'
import { VerifiedBadge, salaryText } from './shared'

const STEP = 6
// The section is left out when the site is opened from localhost (checked after
// mount so the prerendered markup still matches on the real site).
const isLocalhost = () => ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)

const ALL = { key: 'all', label: 'All', params: {} }
const CHIPS = [
  ALL,
  { key: 'tech', label: 'Engineering', params: { track: 'tech' } },
  { key: 'sales', label: 'Sales & BD', params: { track: 'sales' } },
  { key: 'marketing', label: 'Marketing', params: { track: 'marketing' } },
  { key: 'hr', label: 'HR & Recruitment', params: { track: 'hr' } },
]

function JobRow({ job }) {
  const salary = salaryText(job)
  const tags = [job.location?.split(',')[0], job.experience, job.workMode].filter(Boolean)
  const skills = (job.skills ?? []).filter(Boolean).slice(0, 2).join(' · ')
  return (
    <Link to={jobPath(job)} state={{ job }} className="job">
      <span style={{ flex: 'none', width: 52, height: 52, borderRadius: 14, background: '#e7f5f1', color: '#0b7a6d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, overflow: 'hidden' }}>
        {job.logo ? <img src={job.logo} alt="" loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : (job.company || 'M')[0].toUpperCase()}
      </span>
      <span style={{ flex: '1 1 360px', minWidth: 0 }}>
        <strong style={{ display: 'block', fontSize: 19, letterSpacing: '-0.02em' }}>{job.title}</strong>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 14, color: '#344054' }}>
          {job.company}
          {job.verified && (
            <>
              <VerifiedBadge />
              <span style={{ color: '#0b7a6d', fontWeight: 700 }}>Verified</span>
            </>
          )}
        </span>
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {tags.map((t) => <span key={t} className="tag">{t}</span>)}
          {salary && <span className="tag">Salary: {salary}</span>}
        </span>
      </span>
      {skills && <span style={{ flex: '0 1 auto', fontSize: 13, color: '#667085' }}>{skills}</span>}
      <span className="job-go" style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', minHeight: 42, padding: '0 18px', borderRadius: 10, border: '1px solid #0b7a6d', color: '#0b7a6d', fontSize: 14, fontWeight: 700 }}>View role</span>
    </Link>
  )
}

// `pick` is a search chosen elsewhere on the page (a category tile, a company
// logo): { id, label, params }. A new id replaces the active filter.
export default function LatestJobs({ initialJobs, initialTotal, pick }) {
  const [active, setActive] = useState(ALL)
  const [limit, setLimit] = useState(STEP)
  const [data, setData] = useState({ jobs: null, total: 0 })
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [local, setLocal] = useState(false)
  useEffect(() => setLocal(isLocalhost()), [])

  useEffect(() => {
    if (!pick) return
    setActive({ key: `pick:${pick.id}`, label: pick.label, params: pick.params })
    setLimit(STEP)
  }, [pick])

  // The unfiltered first page is supplied by the page (prerender + live fetch);
  // anything else — a chip, a pick, "show more" — is fetched here.
  const isDefault = active.key === 'all' && limit === STEP
  useEffect(() => {
    if (isDefault) return undefined
    const controller = new AbortController()
    setLoading(true)
    setFailed(false)
    fetchLatestJobs({ ...active.params, urgent: 'exclude', sort: 'newest', limit }, { signal: controller.signal })
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        setFailed(true)
        setLoading(false)
      })
    return () => controller.abort()
  }, [active, limit, isDefault])

  const jobs = isDefault ? initialJobs : data.jobs
  const total = isDefault ? initialTotal : data.total
  const customPick = active.key.startsWith('pick:')

  if (local) return null

  return (
    <section id="latest-jobs" style={{ background: '#f7f8fc', scrollMarginTop: 52 }}>
      <div className="sec">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div data-r=""><p className="eyebrow">Live on Mzobs</p><h2 className="h2">Latest opportunities.</h2></div>
          <p data-r="" style={{ margin: 0, maxWidth: 380, fontSize: 16, lineHeight: 1.6, color: '#667085' }}>Live openings from employers hiring on Mzobs. Verified companies are marked on every listing.</p>
        </div>
        <div data-r="" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '40px 0 20px' }}>
          {CHIPS.map((c) => (
            <button key={c.key} type="button" className={`chip${active.key === c.key ? ' on' : ''}`} onClick={() => { setActive(c); setLimit(STEP) }}>{c.label}</button>
          ))}
          {customPick && (
            <button type="button" className="chip on" onClick={() => { setActive(ALL); setLimit(STEP) }} aria-label={`Clear filter: ${active.label}`}>{active.label} ✕</button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: loading ? 0.55 : 1, transition: 'opacity .2s' }} aria-busy={loading || undefined}>
          {(jobs ?? []).map((j) => <JobRow key={j.id ?? j.title} job={j} />)}
        </div>

        {failed && <p style={{ margin: '20px 0 0', fontSize: 15, color: '#667085' }}>Couldn’t load jobs right now. Please try again in a moment.</p>}
        {!failed && jobs && jobs.length === 0 && !loading && (
          <p style={{ margin: '20px 0 0', fontSize: 15, color: '#667085' }}>No openings in this category yet — check back soon.</p>
        )}
        {jobs && total > jobs.length && (
          <div style={{ marginTop: 28 }}>
            <button type="button" className="chip" disabled={loading} onClick={() => setLimit((l) => l + STEP)}>
              Show more roles ({(total - jobs.length).toLocaleString('en-IN')} more)
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
