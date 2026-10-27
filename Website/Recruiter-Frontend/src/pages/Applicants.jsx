import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import { BarChart3, Download, GitCompareArrows, LayoutGrid, Rows3, Search, Users, X } from 'lucide-react'
import { Button, EmptyState } from '../components/ui'
import { ErrorState, ListSkeleton, PageShell, StagePill, inputCls } from '../components/rc'
import { Board, Table } from '../components/applicants/Views'
import ApplicantDrawer from '../components/applicants/ApplicantDrawer'
import RejectModal from '../components/applicants/RejectModal'
import CompareModal from '../components/applicants/CompareModal'
import JobInsights from '../components/JobInsights'
import ManagedShortlist from '../components/ManagedShortlist'
import { InterviewModal } from '../components/ActionModals'
import { useWorkspace } from '../store/workspace'
import { apiMessage, bulkUpdateApplicants, exportApplicants, getApplicantsSummary, listApplicants, listTeam, moveApplicant, PIPELINE, STAGE_LABEL, usePermissions } from '../services/recruiterService'
import { IS_DEMO } from '../lib/config'

const VIEW_KEY = 'mzt-applicants-view'
const COMPARABLE = ['shortlisted', 'interview', 'offer', 'hired']
const MOVE_TARGETS = PIPELINE.filter((s) => s.key !== 'rejected')
const readView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'table' ? 'table' : 'board'
  } catch {
    return 'board'
  }
}

export default function Applicants() {
  const { id: routeJobId } = useParams()
  const jobId = routeJobId ?? 'all'
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()
  const { toast } = useWorkspace()
  const { can, loaded } = usePermissions()
  const manage = loaded && can('candidates.manage')

  const [view, setView] = useState(readView)
  const [q, setQ] = useState('')
  const [owner, setOwner] = useState('')
  const [tag, setTag] = useState('')
  const [sort, setSort] = useState('recent')
  const stageFilter = sp.get('stage') ?? ''
  const followUp = sp.get('followUp') === 'due'

  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [jobs, setJobs] = useState([])
  const [team, setTeam] = useState([])
  const [selected, setSelected] = useState(() => new Set())
  const [openId, setOpenId] = useState(null)
  const [rejecting, setRejecting] = useState(null)
  const [comparing, setComparing] = useState(null)
  const [scheduling, setScheduling] = useState(null)
  const [insights, setInsights] = useState(false)
  const [busy, setBusy] = useState(false)
  const req = useRef(0)

  const setParam = (key, value) => setSp((p) => { const n = new URLSearchParams(p); if (value) n.set(key, value); else n.delete(key); return n }, { replace: true })
  const setStageFilter = (s) => setParam('stage', s)
  const setFollowUp = (on) => setParam('followUp', on ? 'due' : '')

  useEffect(() => {
    if (IS_DEMO) return
    getApplicantsSummary().then(setJobs).catch(() => setJobs([]))
    listTeam().then(setTeam).catch(() => setTeam([]))
  }, [])

  const load = useCallback(
    ({ silent = false } = {}) => {
      if (IS_DEMO) return
      const mine = ++req.current
      if (!silent) setData(null)
      setError('')
      const params = { jobId, sort, ...(q.trim() && { q: q.trim() }), ...(owner && { owner }), ...(tag && { tag }), ...(followUp && { followUp: 'due' }) }
      listApplicants(params)
        .then((r) => mine === req.current && setData(r))
        .catch((e) => mine === req.current && setError(apiMessage(e, 'Could not load applicants.')))
    },
    [jobId, q, owner, tag, sort, followUp]
  )
  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0)
    return () => clearTimeout(t)
  }, [load, q])
  useEffect(() => setSelected(new Set()), [jobId])

  const job = jobs.find((j) => j.id === jobId) ?? null
  const items = data?.items ?? []
  const shown = useMemo(() => (view === 'table' && stageFilter ? items.filter((c) => c.stage === stageFilter) : items), [items, view, stageFilter])
  const allTags = useMemo(() => [...new Set(items.flatMap((c) => c.tags))].sort(), [items])
  const selectedItems = items.filter((c) => selected.has(c.id))

  const switchView = (v) => {
    setView(v)
    try {
      localStorage.setItem(VIEW_KEY, v)
    } catch {
      /* storage unavailable */
    }
  }
  const toggle = (id) => setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const selectAll = (on) => setSelected(on ? new Set(shown.map((c) => c.id)) : new Set())
  const refresh = () => { load({ silent: true }); getApplicantsSummary().then(setJobs).catch(() => {}) }

  const move = async (id, stage) => {
    const c = items.find((x) => x.id === id)
    if (!c || c.stage === stage) return
    if (stage === 'rejected') return setRejecting(c)
    if (c.stage === 'rejected' && !window.confirm(`${c.name} was rejected. Move them back to ${STAGE_LABEL[stage]}?`)) return
    const before = data
    setData((d) => ({ ...d, items: d.items.map((x) => (x.id === id ? { ...x, stage } : x)), counts: { ...d.counts, [c.stage]: d.counts[c.stage] - 1, [stage]: d.counts[stage] + 1 } }))
    try {
      await moveApplicant(id, stage)
      toast(`${c.name} moved to ${STAGE_LABEL[stage]}`)
      refresh()
    } catch (e) {
      setData(before)
      toast(apiMessage(e), { tone: 'warn' })
    }
  }

  const bulk = async (body, ok) => {
    setBusy(true)
    try {
      await bulkUpdateApplicants({ ids: [...selected], ...body })
      toast(ok)
      setSelected(new Set())
      refresh()
    } catch (e) {
      toast(apiMessage(e), { tone: 'warn' })
    } finally {
      setBusy(false)
    }
  }

  const canCompare = selectedItems.length >= 2 && selectedItems.length <= 4 && selectedItems.every((c) => COMPARABLE.includes(c.stage)) && new Set(selectedItems.map((c) => c.jobId)).size === 1
  const compareHint = selectedItems.length < 2 ? 'Select 2–4 shortlisted candidates to compare' : selectedItems.length > 4 ? 'Compare up to 4 candidates' : !selectedItems.every((c) => COMPARABLE.includes(c.stage)) ? 'Only shortlisted (or later) candidates can be compared' : 'Compare candidates from the same job'

  const doExport = async () => {
    try {
      await exportApplicants(jobId)
      toast('Export downloaded')
    } catch (e) {
      toast(apiMessage(e), { tone: 'warn' })
    }
  }

  if (IS_DEMO) {
    return <PageShell title="Applicants"><EmptyState icon={Users} title="Applicants need a live workspace" body="The pipeline is built from candidates who applied to your jobs, so it isn’t available in the demo workspace." /></PageShell>
  }

  const counts = data?.counts ?? {}
  return (
    <PageShell
      wide
      title={job ? job.title : 'Applicants'}
      sub={job ? `${job.location ?? ''}${job.department ? ` · ${job.department}` : ''}` : 'Every candidate across your jobs, by stage.'}
      actions={
        <>
          <select aria-label="Choose job" value={jobId} onChange={(e) => nav(e.target.value === 'all' ? '/applicants' : `/jobs/${e.target.value}/applicants`)} className={clsx(inputCls, 'w-56')}>
            <option value="all">All jobs</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title} ({j.total})</option>)}
          </select>
          {job && <Button size="sm" icon={BarChart3} onClick={() => setInsights((v) => !v)} aria-pressed={insights}>Insights</Button>}
          {loaded && can('exports.run') && <Button size="sm" icon={Download} onClick={doExport}>Export</Button>}
          <div className="flex rounded-full border border-line bg-white p-0.5" role="group" aria-label="View">
            {[['board', LayoutGrid, 'Board'], ['table', Rows3, 'Table']].map(([v, Icon, label]) => (
              <button key={v} type="button" onClick={() => switchView(v)} aria-pressed={view === v} className={clsx('inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-bold', view === v ? 'bg-ink text-white' : 'text-ink-2 hover:bg-line-2')}><Icon size={14} />{label}</button>
            ))}
          </div>
        </>
      }
    >
      <div className="space-y-4">
        {job && <ManagedShortlist job={job} canRequest={loaded && can('support.request')} toast={toast} onShortlistShared={() => { setTag('MZOBS shortlist'); }} />}
        {job && insights && <JobInsights jobId={job.id} />}

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, role or skill" aria-label="Search applicants" className={clsx(inputCls, 'w-full pl-8')} />
          </div>
          <select aria-label="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} className={clsx(inputCls, 'w-40')}>
            <option value="">Any owner</option><option value="me">Assigned to me</option><option value="unassigned">Unassigned</option>
            {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select aria-label="Tag" value={tag} onChange={(e) => setTag(e.target.value)} className={clsx(inputCls, 'w-40')}>
            <option value="">Any tag</option>
            {tag && !allTags.includes(tag) && <option value={tag}>{tag}</option>}
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {view === 'table' && (
            <select aria-label="Stage" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className={clsx(inputCls, 'w-36')}>
              <option value="">All stages</option>{PIPELINE.map((s) => <option key={s.key} value={s.key}>{s.label} ({counts[s.key] ?? 0})</option>)}
            </select>
          )}
          <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className={clsx(inputCls, 'w-44')}>
            <option value="recent">Newest first</option><option value="oldest">Oldest first</option><option value="experience">Most experience</option><option value="name">Name A–Z</option><option value="followUp">Follow-up date</option>
          </select>
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] text-ink-2"><input type="checkbox" checked={followUp} onChange={(e) => setFollowUp(e.target.checked)} className="h-3.5 w-3.5 accent-[#08685e]" /> Follow-up due</label>
          {(q || owner || tag || followUp || stageFilter) && <button type="button" onClick={() => { setQ(''); setOwner(''); setTag(''); setFollowUp(false); setStageFilter('') }} className="text-[12.5px] font-semibold text-accent hover:underline">Clear filters</button>}
        </div>

        {selected.size > 0 && manage && (
          <div role="region" aria-label="Bulk actions" className="sticky top-[72px] z-20 flex flex-wrap items-center gap-2 rounded-xl border border-accent bg-white px-3 py-2 shadow-card">
            <span className="text-[13px] font-bold">{selected.size} selected</span>
            <select aria-label="Move selected to stage" disabled={busy} value="" onChange={(e) => e.target.value && bulk({ stage: e.target.value }, `Moved ${selected.size} to ${STAGE_LABEL[e.target.value]}`)} className={clsx(inputCls, 'w-40')}>
              <option value="">Move to…</option>{MOVE_TARGETS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <select aria-label="Assign selected to" disabled={busy} value="" onChange={(e) => e.target.value && bulk({ ownerId: e.target.value === 'none' ? null : e.target.value }, 'Owner updated')} className={clsx(inputCls, 'w-40')}>
              <option value="">Assign to…</option><option value="none">Unassigned</option>{team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <Button size="sm" icon={GitCompareArrows} disabled={!canCompare} title={canCompare ? undefined : compareHint} onClick={() => setComparing(selectedItems.map((c) => c.id))}>Compare</Button>
            <span className="text-[12px] text-muted">Rejecting is done one at a time, so each gets a recorded reason.</span>
            <button type="button" onClick={() => setSelected(new Set())} aria-label="Clear selection" className="ml-auto grid h-7 w-7 place-items-center rounded-lg hover:bg-line-2"><X size={15} /></button>
          </div>
        )}

        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : !data ? (
          <ListSkeleton rows={5} />
        ) : items.length === 0 ? (
          <EmptyState icon={Users} title={q || owner || tag || followUp ? 'No applicants match these filters' : job ? 'No applicants yet' : 'No applicants yet'} body={q || owner || tag || followUp ? 'Try clearing a filter.' : 'Candidates appear here as they apply to your live jobs or MZOBS shares profiles with you.'} />
        ) : view === 'board' ? (
          <Board items={items} counts={counts} selected={selected} onSelect={toggle} onOpen={setOpenId} canManage={manage} showJob={jobId === 'all'} onDropTo={move} />
        ) : (
          <Table items={shown} selected={selected} onSelect={toggle} onSelectAll={selectAll} onOpen={setOpenId} canManage={manage} showJob={jobId === 'all'} />
        )}
        {data?.truncated && <p className="text-[12.5px] text-muted">Showing the first {items.length} of {data.total}. Use filters to narrow the list.</p>}
        {data && view === 'board' && Object.keys(counts).length > 0 && (
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted">{PIPELINE.map((s) => <span key={s.key} className="inline-flex items-center gap-1.5"><StagePill stage={s.key} label={s.label} /> <b className="num text-ink-2">{counts[s.key] ?? 0}</b></span>)}</p>
        )}
      </div>

      <ApplicantDrawer id={openId} onClose={() => setOpenId(null)} onChanged={refresh} onReject={(c) => { setRejecting(c) }} onSchedule={setScheduling} can={can} toast={toast} />
      <RejectModal candidate={rejecting} onClose={() => setRejecting(null)} onDone={() => { setRejecting(null); setOpenId(null); refresh() }} toast={toast} />
      <CompareModal ids={comparing} onClose={() => setComparing(null)} />
      {scheduling && <InterviewModal candidate={scheduling} onClose={() => setScheduling(null)} onScheduled={() => { setScheduling(null); refresh() }} />}
    </PageShell>
  )
}
