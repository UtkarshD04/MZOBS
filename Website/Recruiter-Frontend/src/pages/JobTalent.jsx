import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Briefcase, Sparkles, ArrowRight, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { Button, CardSkeleton, Chip, EmptyState } from '../components/ui'
import CandidateCard from '../components/CandidateCard'
import { useActions } from '../components/useActions'
import FilterPanel from '../components/FilterPanel'
import { listJobs, searchTalent, getPoolMeta } from '../services/talentService'
import { criteriaFromJob } from '../lib/talent/engine'
import { makeCriteria, SORTS } from '../lib/talent/criteria'
import { IS_DEMO } from '../lib/config'

export default function JobTalent() {
  const nav = useNavigate()
  const location = useLocation()
  const [jobs, setJobs] = useState(null)
  const [jobId, setJobId] = useState('')
  const [rows, setRows] = useState(null)
  const [total, setTotal] = useState(0)
  const job = jobs?.find((j) => j.id === jobId)
  const base = useMemo(() => (job ? makeCriteria(criteriaFromJob(job)) : makeCriteria()), [job])
  // Starts from the job's requirements; every filter in the panel can then be changed on top of it.
  const [criteria, setCriteria] = useState(base)
  const [debounced, setDebounced] = useState(base)
  const [sort, setSort] = useState('match')
  const [meta, setMeta] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { onAction, host } = useActions(criteria, { onUnlocked: () => setCriteria((c) => ({ ...c })) })
  useEffect(() => setCriteria(base), [base])
  useEffect(() => {
    const t = setTimeout(() => setDebounced(criteria), 300)
    return () => clearTimeout(t)
  }, [criteria])
  useEffect(() => {
    getPoolMeta().then(setMeta).catch(() => setMeta(null))
  }, [])

  useEffect(() => {
    listJobs().then((j) => { setJobs(j); const want = location.state?.jobId; setJobId(j.some((x) => x.id === want) ? want : j[0]?.id ?? '') }).catch(() => setJobs([]))
  }, [])
  useEffect(() => {
    if (!job) return
    setRows(null)
    let live = true
    searchTalent(debounced, { sort, pageSize: 20 })
      .then((r) => live && (setRows(r.items), setTotal(r.total)))
      .catch(() => live && (setRows([]), setTotal(0)))
    return () => { live = false }
  }, [job, debounced, sort])

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-6">
      <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink">Talent pool</h1>
      <p className="mt-1 text-[14px] text-muted">Pick a job and Mzobs builds the search from its requirements, then ranks talent for it. Use the filters to narrow it further.</p>

      {jobs && jobs.length === 0 && <EmptyState icon={Briefcase} title="No jobs to match against" body="Post a job and its requirements will drive the search here." />}
      {jobs && jobs.length > 0 && (
        <div className="mt-5 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-20 xl:top-[116px] lg:self-start">
            <button type="button" onClick={() => setFiltersOpen((v) => !v)} aria-expanded={filtersOpen} className="mb-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line bg-white text-[13.5px] font-semibold lg:hidden"><SlidersHorizontal size={15} /> Filters</button>
            <div className={filtersOpen ? 'block' : 'hidden lg:block'}>
              <div className="mb-3 flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-[12.5px]">
                <span className="text-muted">Starts from this job’s requirements</span>
                <button type="button" onClick={() => setCriteria(base)} className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"><RotateCcw size={12} /> Reset</button>
              </div>
              <FilterPanel criteria={criteria} onChange={setCriteria} onSave={() => nav('/search', { state: { criteria } })} onClear={() => setCriteria(makeCriteria())} meta={meta} />
            </div>
          </aside>
          <div>
          <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
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
              <div className="flex items-center gap-2">
                <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by" className="h-9 rounded-lg border border-line bg-white px-2 text-[13px] outline-none focus:border-accent">
                  {SORTS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
                <Button icon={ArrowRight} onClick={() => nav('/search', { state: { criteria } })}>Open in search</Button>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {!rows ? [0, 1, 2].map((i) => <CardSkeleton key={i} />) : rows.length === 0 ? <EmptyState icon={Briefcase} title="No candidates match these filters" body="Loosen a filter or press Reset to go back to the job’s requirements." /> : rows.map((r) => <CandidateCard key={r.candidate.id} row={r} terms={criteria.skills} onAction={onAction} />)}
          </div>
          </div>
        </div>
      )}
      {host}
    </div>
  )
}
