import { useState } from 'react'
import { Handshake, Briefcase } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Select, Textarea, Input } from '../../components/ui/Field'
import { useApp } from '../../lib/appContext'
import { useShortlistRequestsQuery, useRequestCandidatesQuery, useUpdateShortlistRequestMutation } from '../../hooks/useShortlistRequests'

const STATUSES = [
  ['requested', 'Requested'],
  ['in_review', 'In review'],
  ['shortlisting', 'Shortlisting'],
  ['shortlist_shared', 'Shortlist shared'],
  ['closed', 'Closed'],
]
const LABEL = Object.fromEntries(STATUSES)
const TONE = { requested: 'gold', in_review: 'navy', shortlisting: 'navy', shortlist_shared: 'green', closed: 'gray' }
const URGENCY_TONE = { standard: 'gray', high: 'gold', urgent: 'red' }
const TABS = ['Open', ...STATUSES.map(([, l]) => l)]
const rank = (s) => STATUSES.findIndex(([k]) => k === s)

function DetailModal({ app, item }) {
  const [status, setStatus] = useState(item.status)
  const [assignedTo, setAssignedTo] = useState(item.assignedTo || '')
  const [staffNote, setStaffNote] = useState(item.staffNote || '')
  const [message, setMessage] = useState(item.shortlistMessage || '')
  const [picked, setPicked] = useState(() => new Set(item.sharedCandidateIds))
  const { data: candidates = [], isLoading } = useRequestCandidatesQuery(item.id)
  const update = useUpdateShortlistRequestMutation()
  const locked = item.status === 'closed'

  const toggle = (id) => setPicked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  function save() {
    update.mutate(
      { id: item.id, assignedTo, staffNote, shortlistMessage: message, candidateIds: [...picked], ...(status !== item.status && { status }) },
      { onSuccess: () => { app.closeModal(); app.addToast('success', 'Request updated') }, onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong') }
    )
  }
  return (
    <>
      <ModalHead title={`${item.company} · ${item.job?.title ?? 'Job'}`} onClose={app.closeModal} />
      <ModalBody>
        <div className="rounded-xl bg-surface-sunken p-3.5 mb-4 text-[12.5px] space-y-1.5">
          <div><span className="text-ink-tertiary">Requested by · </span><span className="font-semibold">{item.requestedByName}</span> <span className="text-ink-tertiary">· {new Date(item.createdAt).toLocaleString('en-IN')}</span></div>
          {item.job && <div><span className="text-ink-tertiary">Job · </span>{item.job.location}, {item.job.experienceMin}–{item.job.experienceMax} yrs · {item.job.skills.join(', ') || 'no skills listed'}</div>}
          <div><span className="text-ink-tertiary">Ideal candidate · </span><span className="whitespace-pre-line">{item.idealProfile}</span></div>
          {item.notes && <div><span className="text-ink-tertiary">Notes · </span>{item.notes}</div>}
        </div>

        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} disabled={locked}>
            {STATUSES.map(([k, l]) => <option key={k} value={k} disabled={rank(k) < rank(item.status) && k !== 'closed'}>{l}</option>)}
          </Select>
        </Field>
        <Field label="Handled by" optional><Input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Name shown to the employer" /></Field>

        <Field label={`Shortlist (${picked.size} selected)`} hint="Pick from this job’s applicants. The employer sees these tagged “MZOBS shortlist”.">
          <div className="max-h-52 overflow-y-auto rounded-xl border border-border-strong divide-y divide-border">
            {isLoading ? <p className="p-3 text-xs text-ink-tertiary">Loading applicants…</p> : candidates.length === 0 ? <p className="p-3 text-xs text-ink-tertiary">No applicants for this job yet.</p> : candidates.map((c) => (
              <label key={c.id} className="flex items-start gap-2.5 p-2.5 cursor-pointer hover:bg-surface-sunken">
                <input type="checkbox" checked={picked.has(c.id)} onChange={() => toggle(c.id)} disabled={locked} className="mt-1" />
                <span className="text-[12.5px]"><b className="font-semibold">{c.name}</b> <span className="text-ink-tertiary">· {c.experienceYears} yrs · {c.location || 'location n/a'} · {c.stage}</span><br /><span className="text-ink-tertiary">{(c.skills ?? []).join(', ') || c.headline}</span></span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Message to the employer" hint="Shown with the shortlist. Required to mark it shared."><Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} disabled={locked} /></Field>
        <Field label="Internal notes" optional hint="Never shown to the employer."><Textarea rows={2} value={staffNote} onChange={(e) => setStaffNote(e.target.value)} /></Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={update.isPending}>Cancel</Button>
        <Button variant="primary" onClick={save} disabled={update.isPending || locked}>{update.isPending ? 'Saving...' : 'Save'}</Button>
      </ModalFoot>
    </>
  )
}

export default function ShortlistRequests() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const { data: all = [], isLoading, isError, refetch } = useShortlistRequestsQuery()

  const rows = tab === 0 ? all.filter((r) => r.status !== 'closed') : all.filter((r) => r.status === STATUSES[tab - 1][0])
  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Shortlist requests</h1>
        <p className="text-sm text-ink-secondary mt-1">Employers who asked for help shortlisting. Review the brief, pick candidates from their applicants and share the shortlist.</p>
      </StaggerItem>
      <StaggerItem className="mb-4"><PillTabs items={TABS} active={tab} onChange={setTab} /></StaggerItem>
      <StaggerItem>
        {rows.length === 0 ? (
          <Card><EmptyState icon={Handshake} title="No requests here" body="Nothing matches this filter right now." /></Card>
        ) : (
          <div className="flex flex-col gap-3">
            {rows.map((r) => (
              <Card key={r.id} hover pad>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14.5px] font-semibold">{r.company}</span>
                      <Badge tone={TONE[r.status]}>{LABEL[r.status]}</Badge>
                      <Badge tone={URGENCY_TONE[r.urgency] ?? 'gray'}>{r.urgency}</Badge>
                    </div>
                    <div className="text-xs text-ink-tertiary mt-1.5 inline-flex items-center gap-1.5"><Briefcase size={11} />{r.job?.title ?? 'Job'} · requested {new Date(r.createdAt).toLocaleDateString('en-IN')}{r.assignedTo ? ` · ${r.assignedTo}` : ''}</div>
                    <p className="text-[13px] text-ink-secondary mt-2 line-clamp-2">{r.idealProfile}</p>
                  </div>
                  <Button size="sm" onClick={() => app.openModal(<DetailModal app={app} item={r} />)}>Open</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
