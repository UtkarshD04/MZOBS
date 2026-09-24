import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Eye, EyeOff, ExternalLink, Plus, MapPin, Clock, IndianRupee, Users, Pencil, Copy, Trash2, Search, Power, Rocket, Briefcase, CheckCircle2 } from 'lucide-react'
import { Button, CardSkeleton, EmptyState, Modal } from '../components/ui'
import { useWorkspace } from '../store/workspace'
import { listMyJobs, listPublicJobIds, publicJobUrl, setJobStatus, duplicateJob, deleteJob, STATUS_META, rupeesToLpa, jobError } from '../services/jobsService'
import { agoDate } from '../lib/format'
import { IS_DEMO } from '../lib/config'

// Statuses the backend lists on the candidate-facing job feed.
const PUBLIC = ['sourcing', 'delivered']

const TABS = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'live', label: 'Live', match: (j) => PUBLIC.includes(j.status) },
  { id: 'draft', label: 'Drafts', match: (j) => j.status === 'draft' },
  { id: 'done', label: 'Closed', match: (j) => ['closed', 'archived'].includes(j.status) },
]

function StatusPill({ status }) {
  const m = STATUS_META[status] ?? { label: status, cls: 'bg-line-2 text-ink-2' }
  return <span className={clsx('rounded-md px-2 py-0.5 text-[11.5px] font-semibold', m.cls)}>{m.label}</span>
}

function Visibility({ job, publicIds }) {
  if (IS_DEMO || !publicIds || !PUBLIC.includes(job.status)) return null
  const on = publicIds.has(job.id)
  return on ? (
    <a href={publicJobUrl(job.id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md bg-ok-soft px-2 py-0.5 text-[11.5px] font-semibold text-[#1a8f5a] hover:underline" title="Open the candidate-facing page"><Eye size={11} /> Visible to candidates <ExternalLink size={10} /></a>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-md bg-warn-soft px-2 py-0.5 text-[11.5px] font-semibold text-warn" title="Live, but not in the candidate job feed yet"><EyeOff size={11} /> Not in candidate feed yet</span>
  )
}

function JobRow({ job, onChanged, onAsk, publicIds }) {
  const nav = useNavigate()
  const { toast } = useWorkspace()
  const [busy, setBusy] = useState(false)
  const run = async (fn, ok) => {
    setBusy(true)
    try {
      await fn()
      if (ok) toast(ok)
      await onChanged()
    } catch (e) {
      toast(jobError(e).message, { tone: 'warn' })
    } finally {
      setBusy(false)
    }
  }
  const salary = job.salaryMin != null ? `₹${rupeesToLpa(job.salaryMin)}–${rupeesToLpa(job.salaryMax)} LPA` : null
  const canFind = job.status === 'sourcing' || job.status === 'delivered' || job.status === 'draft'
  return (
    <li className="rounded-2xl border border-line bg-white p-4 shadow-card transition-shadow hover:shadow-lift sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/jobs/${job.id}/edit`} className="text-[16px] font-semibold hover:text-accent">{job.title}</Link>
            <StatusPill status={job.status} />
            <Visibility job={job} publicIds={publicIds} />
          </div>
          <p className="mt-0.5 text-[13px] text-muted">{job.department} · {job.employmentType}</p>
        </div>
        <div className="flex gap-6 text-right">
          <div><p className="text-[11px] uppercase tracking-wide text-muted">Openings</p><p className="text-[18px] font-bold tabular-nums">{job.vacancies}</p></div>
          <div title="Candidates Mzobs has shared so far / promised"><p className="text-[11px] uppercase tracking-wide text-muted">Shared</p><p className="text-[18px] font-bold tabular-nums">{job.candidatesShared ?? 0}<span className="text-[13px] font-medium text-muted">/{job.resumesPromised ?? '—'}</span></p></div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-ink-2">
        <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-[#7d93a6]" /> {job.location} · {job.workMode}</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-[#7d93a6]" /> {job.experienceMin}–{job.experienceMax} yrs</span>
        {salary && <span className="inline-flex items-center gap-1.5"><IndianRupee size={13} className="text-[#7d93a6]" /> {salary}</span>}
        <span className="inline-flex items-center gap-1.5"><Users size={13} className="text-[#7d93a6]" /> Apply by {job.deadline}</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line-2 pt-3">
        <span className="text-[12px] text-muted">{job.postedOn ? `Posted ${agoDate(job.postedOn)}` : `Updated ${agoDate(job.updatedOn ?? job.updatedAt ?? new Date().toISOString())}`}{job.feeTotal ? ` · Fee ₹${job.feeTotal.toLocaleString('en-IN')} (${job.feeStatus})` : ''}</span>
        <div className="flex flex-wrap gap-1.5">
          {canFind && <Button size="sm" variant="ai" icon={Search} onClick={() => nav('/talent-pool', { state: { jobId: job.id } })}>Find talent</Button>}
          {job.status === 'draft' && <Button size="sm" variant="primary" icon={Rocket} disabled={busy} onClick={() => run(() => setJobStatus(job.id, 'pending_review'), `“${job.title}” is live`)}>Publish</Button>}
          {job.status === 'sourcing' && <Button size="sm" icon={Power} disabled={busy} onClick={() => run(() => setJobStatus(job.id, 'closed'), 'Job closed')}>Close</Button>}
          {job.status === 'closed' && <Button size="sm" icon={Rocket} disabled={busy} onClick={() => run(() => setJobStatus(job.id, 'pending_review'), 'Job reopened')}>Reopen</Button>}
          <Button size="sm" icon={Pencil} onClick={() => nav(`/jobs/${job.id}/edit`)}>Edit</Button>
          <Button size="sm" variant="ghost" icon={Copy} disabled={busy} onClick={() => run(() => duplicateJob(job.id), 'Job duplicated as a draft')} aria-label="Duplicate" title="Duplicate" />
          <Button size="sm" variant="ghost" icon={Trash2} disabled={busy} onClick={() => onAsk(job)} aria-label="Delete" title="Delete" />
        </div>
      </div>
    </li>
  )
}

export default function Jobs() {
  const nav = useNavigate()
  const location = useLocation()
  const { toast } = useWorkspace()
  const [jobs, setJobs] = useState(null)
  const [error, setError] = useState(false)
  const [publicIds, setPublicIds] = useState(null)
  const [tab, setTab] = useState('all')
  const [toDelete, setToDelete] = useState(null)
  const justPosted = location.state?.justPosted

  const load = useCallback(() => {
    listPublicJobIds().then(setPublicIds).catch(() => setPublicIds(null))
    return listMyJobs().then((j) => { setJobs(j); setError(false) }).catch(() => setError(true))
  }, [])
  useEffect(() => { load() }, [load])

  const shown = useMemo(() => (jobs ?? []).filter(TABS.find((t) => t.id === tab).match), [jobs, tab])
  const posted = jobs?.find((j) => j.id === justPosted)

  const confirmDelete = async () => {
    try {
      await deleteJob(toDelete.id)
      toast('Job deleted')
      setToDelete(null)
      load()
    } catch (e) {
      toast(jobError(e).message, { tone: 'warn' })
    }
  }

  return (
    <div className="mx-auto max-w-[980px] px-4 py-8 lg:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink">Jobs</h1>
          <p className="mt-1 text-[14px] text-muted">Post requirements, then search talent for each one.{IS_DEMO && ' (Demo: saved on this device.)'}</p>
        </div>
        <Button variant="primary" size="lg" icon={Plus} onClick={() => nav('/jobs/new')}>Post a job</Button>
      </div>

      {posted && (
        <div className="fade-up mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#bfe8cf] bg-ok-soft px-4 py-3">
          <p className="flex items-center gap-2 text-[14px] font-medium text-[#1a8f5a]"><CheckCircle2 size={16} /> “{posted.title}” is live{!IS_DEMO && publicIds?.has(posted.id) ? ' and visible to candidates' : ''}. Want to see who fits it right now?</p>
          <Button variant="ai" icon={Search} onClick={() => nav('/talent-pool', { state: { jobId: posted.id } })}>Find candidates for this job</Button>
        </div>
      )}

      <div className="mt-5 flex gap-1 border-b border-line" role="tablist">
        {TABS.map((t) => {
          const n = (jobs ?? []).filter(t.match).length
          return (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={clsx('-mb-px border-b-2 px-3.5 py-2 text-[13.5px] font-medium', tab === t.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink')}>
              {t.label} <span className="ml-1 text-[12px] text-muted">{jobs ? n : ''}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-5">
        {error ? (
          <EmptyState icon={Briefcase} title="Couldn't load your jobs" action={<Button onClick={load}>Retry</Button>} />
        ) : !jobs ? (
          <div className="space-y-3">{[0, 1, 2].map((i) => <CardSkeleton key={i} />)}</div>
        ) : shown.length === 0 ? (
          <EmptyState icon={Briefcase} title={tab === 'all' ? 'No jobs yet' : 'Nothing here'} body={tab === 'all' ? 'Post your first requirement and Mzobs will start sourcing verified candidates.' : undefined} action={tab === 'all' && <Button variant="primary" icon={Plus} onClick={() => nav('/jobs/new')}>Post a job</Button>} />
        ) : (
          <ul className="space-y-3">{shown.map((j) => <JobRow key={j.id} job={j} onChanged={load} onAsk={setToDelete} publicIds={publicIds} />)}</ul>
        )}
      </div>

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete this job?" width={440} footer={<><Button onClick={() => setToDelete(null)}>Keep it</Button><Button variant="primary" className="!bg-bad hover:!bg-[#b91c1c]" onClick={confirmDelete}>Delete job</Button></>}>
        <p className="text-[14px] text-ink-2">“{toDelete?.title}” will be removed permanently. This can’t be undone.</p>
      </Modal>
    </div>
  )
}
