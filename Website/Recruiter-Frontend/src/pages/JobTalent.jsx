import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Briefcase, Sparkles, ArrowRight } from 'lucide-react'
import { Button, CardSkeleton, Chip, EmptyState } from '../components/ui'
import CandidateCard from '../components/CandidateCard'
import { useActions } from '../components/useActions'
import { listJobs, searchTalent } from '../services/talentService'
import { criteriaFromJob } from '../lib/talent/engine'
import { makeCriteria } from '../lib/talent/criteria'
import { IS_DEMO } from '../lib/config'

export default function JobTalent() {
  const nav = useNavigate()
  const location = useLocation()
  const [jobs, setJobs] = useState(null)
  const [jobId, setJobId] = useState('')
  const [rows, setRows] = useState(null)
  const [total, setTotal] = useState(0)
  const job = jobs?.find((j) => j.id === jobId)
  const criteria = useMemo(() => (job ? makeCriteria(criteriaFromJob(job)) : makeCriteria()), [job])
  const { onAction, host } = useActions(criteria)

  useEffect(() => {
    listJobs().then((j) => { setJobs(j); const want = location.state?.jobId; setJobId(j.some((x) => x.id === want) ? want : j[0]?.id ?? '') }).catch(() => setJobs([]))
  }, [])
  useEffect(() => {
    if (!job) return
    setRows(null)
    searchTalent(criteria, { sort: 'match', pageSize: 10 }).then((r) => { setRows(r.items); setTotal(r.total) })
  }, [job, criteria])

  return (
    <div className="mx-auto max-w-[980px] px-4 py-8 lg:px-6">
      <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink">Job talent pool</h1>
      <p className="mt-1 text-[14px] text-muted">Pick a job and Mzobs builds the search from its requirements, then ranks talent for it.</p>

      {jobs && jobs.length === 0 && <EmptyState icon={Briefcase} title="No jobs to match against" body="Post a job and its requirements will drive the search here." />}
      {jobs && jobs.length > 0 && (
        <>
          <div className="mt-5 rounded-2xl border border-line bg-white p-4 shadow-card">
            <label className="text-[12px] font-medium text-muted" htmlFor="job">Find candidates for this job</label>
            <select id="job" value={jobId} onChange={(e) => setJobId(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 text-[14px] font-medium outline-none focus:border-accent">
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
            {job && (
              <div className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
                <p><span className="text-muted">Required skills: </span><span className="inline-flex flex-wrap gap-1 align-middle">{job.requiredSkills.map((s) => <Chip key={s} tone="accent">{s}</Chip>)}</span></p>
                <p><span className="text-muted">Preferred: </span><span className="inline-flex flex-wrap gap-1 align-middle">{(job.preferredSkills ?? []).map((s) => <Chip key={s}>{s}</Chip>)}{!(job.preferredSkills ?? []).length && '—'}</span></p>
                <p><span className="text-muted">Experience: </span>{job.experienceMin}–{job.experienceMax} yrs</p>
                <p><span className="text-muted">Location: </span>{job.locations.join(', ') || '—'}</p>
                <p><span className="text-muted">Salary up to: </span>{job.salaryMaxLPA ? `₹${job.salaryMaxLPA} LPA` : '—'}</p>
                <p><span className="text-muted">Education: </span>{job.education || '—'}</p>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[12.5px] text-[#0a6f64]"><Sparkles size={13} /> {rows ? `${total} AI-ranked candidates` : 'Ranking…'}{IS_DEMO && ' · demo data'}</p>
              <Button icon={ArrowRight} onClick={() => nav('/', { state: { criteria } })}>Refine in search</Button>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {!rows ? [0, 1, 2].map((i) => <CardSkeleton key={i} />) : rows.map((r) => <CandidateCard key={r.candidate.id} row={r} terms={criteria.skills} onAction={onAction} />)}
          </div>
        </>
      )}
      {host}
    </div>
  )
}
