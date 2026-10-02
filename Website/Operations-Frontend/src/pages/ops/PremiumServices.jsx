import { useMemo, useState } from 'react'
import { Sparkles, Search, User, CalendarClock, ArrowRightLeft } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { useApp } from '../../lib/appContext'
import { usePremiumServicesQuery, usePremiumServiceStatsQuery, usePremiumPlanQuery, useUpdateServiceRequestMutation } from '../../hooks/usePremiumServices'

// Premium services pipeline (Backend: premiumServiceController.js).
//   requested -> scheduled -> in_progress -> delivered   (or -> cancelled)
const STAGES = [
  { key: 'open', label: 'Open' },
  { key: 'requested', label: 'Requested' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]
const STATUS_LABEL = { requested: 'Requested', scheduled: 'Scheduled', in_progress: 'In progress', delivered: 'Delivered', cancelled: 'Cancelled' }
const STATUS_TONE = { requested: 'gold', scheduled: 'navy', in_progress: 'violet', delivered: 'green', cancelled: 'gray' }
// Mirrors the backend's allowed moves so the form only offers valid ones.
const NEXT = {
  requested: ['scheduled', 'in_progress', 'delivered', 'cancelled'],
  scheduled: ['scheduled', 'in_progress', 'delivered', 'cancelled'],
  in_progress: ['scheduled', 'delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
}

const fmtDateTime = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
// <input type="datetime-local"> wants local "YYYY-MM-DDTHH:mm".
function toLocalInput(d) {
  if (!d) return ''
  const date = new Date(d)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function UpdateModal({ app, request, serviceLabel }) {
  const final = NEXT[request.status].length === 0
  const [form, setForm] = useState({
    status: request.status,
    scheduledFor: toLocalInput(request.scheduledFor),
    meetingLink: request.meetingLink ?? '',
    assignedTo: request.assignedTo ?? '',
    candidateMessage: request.candidateMessage ?? '',
    deliverableLink: request.deliverableLink ?? '',
    staffNote: request.staffNote ?? '',
  })
  const update = useUpdateServiceRequestMutation()
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function submit() {
    const input = {
      scheduledFor: form.scheduledFor ? new Date(form.scheduledFor).toISOString() : null,
      meetingLink: form.meetingLink,
      assignedTo: form.assignedTo,
      candidateMessage: form.candidateMessage,
      deliverableLink: form.deliverableLink,
      staffNote: form.staffNote,
    }
    // Re-sending 'scheduled' is a reschedule (and re-notifies), so only when the time changed.
    const rescheduled = form.status === 'scheduled' && form.scheduledFor !== toLocalInput(request.scheduledFor)
    if (form.status !== request.status || rescheduled) input.status = form.status
    update.mutate(
      { id: request.id, ...input },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast('success', 'Request updated — the candidate has been notified of any stage change')
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  const e = request.employee ?? {}
  return (
    <>
      <ModalHead title={serviceLabel} onClose={app.closeModal} />
      <ModalBody>
        <div className="mb-4 space-y-1.5 rounded-xl bg-surface-sunken p-3.5 text-[12.5px]">
          <Row label="Candidate" value={e.name} />
          <Row label="Contact" value={[e.phone, e.email].filter(Boolean).join(' · ')} />
          {(e.preferredRole || e.currentCity) && <Row label="Role / city" value={[e.preferredRole, e.currentCity].filter(Boolean).join(' · ')} />}
          <Row label="Requested" value={fmtDateTime(request.createdAt)} />
          {request.preferredTime && <Row label="Preferred time" value={request.preferredTime} />}
        </div>
        {request.note && <p className="mb-4 whitespace-pre-line text-[13px] text-ink-secondary">“{request.note}”</p>}

        {final ? (
          <p className="mb-4 text-[13px] text-ink-secondary">This request is {STATUS_LABEL[request.status].toLowerCase()} — it can’t move any further.</p>
        ) : (
          <Field label="Stage" hint="The candidate gets a notification when the stage changes">
            <Select value={form.status} onChange={set('status')}>
              <option value={request.status}>{STATUS_LABEL[request.status]} (current)</option>
              {NEXT[request.status]
                .filter((s) => s !== request.status)
                .map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
            </Select>
          </Field>
        )}
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label="Session date & time" optional hint="Required to schedule">
            <Input type="datetime-local" value={form.scheduledFor} onChange={set('scheduledFor')} disabled={final} />
          </Field>
          <Field label="Meeting link" optional>
            <Input type="url" value={form.meetingLink} onChange={set('meetingLink')} placeholder="https://" disabled={final} />
          </Field>
        </div>
        <Field label="Assigned to" optional>
          <Input value={form.assignedTo} onChange={set('assignedTo')} placeholder="Defaults to you on the first stage change" />
        </Field>
        <Field label="Message to the candidate" optional hint="Shown on their Premium services page. Needed (or a link) to mark delivered.">
          <Textarea rows={4} value={form.candidateMessage} onChange={set('candidateMessage')} placeholder="Feedback, scorecard, next steps…" />
        </Field>
        <Field label="Deliverable link" optional hint="e.g. the enhanced CV or roadmap document">
          <Input type="url" value={form.deliverableLink} onChange={set('deliverableLink')} placeholder="https://" />
        </Field>
        <Field label="Internal note" optional hint="Staff only — never shown to the candidate">
          <Textarea rows={2} value={form.staffNote} onChange={set('staffNote')} />
        </Field>

        {request.statusHistory?.length > 0 && (
          <div className="mt-2">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-tertiary">History</p>
            <ul className="space-y-1 text-[12.5px]">
              {[...request.statusHistory].reverse().map((h, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="font-medium">{STATUS_LABEL[h.status] ?? h.status}</span>
                  <span className="text-ink-tertiary">
                    {h.changedBy === 'employee' ? 'Candidate' : h.changedBy} · {fmtDateTime(h.changedOn)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={update.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={update.isPending}>
          {update.isPending ? 'Saving…' : 'Save'}
        </Button>
      </ModalFoot>
    </>
  )
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-ink-tertiary">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  )
}

export default function PremiumServices() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [service, setService] = useState('')
  const [query, setQuery] = useState('')

  const status = STAGES[tab].key
  const { data: rows = [], isLoading, isError, refetch } = usePremiumServicesQuery({ status, ...(service ? { service } : {}) })
  const { data: stats } = usePremiumServiceStatsQuery()
  const { data: plan } = usePremiumPlanQuery()
  const labelOf = useMemo(() => {
    const map = new Map((plan?.services ?? []).map((s) => [s.key, s.label]))
    return (key) => map.get(key) ?? key
  }, [plan])

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter((r) => `${r.employee?.name ?? ''} ${r.employee?.email ?? ''} ${r.employee?.phone ?? ''} ${labelOf(r.service)} ${r.note}`.toLowerCase().includes(q))
  }, [rows, query, labelOf])

  const countOf = (key) => (key === 'open' ? stats?.open : stats?.byStatus?.[key]) ?? 0

  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Premium services</h1>
        <p className="mt-1 text-sm text-ink-secondary">Services Premium candidates have requested. Move each one from request to delivery — the candidate sees every stage.</p>
      </StaggerItem>

      <StaggerItem className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {STAGES.filter((s) => s.key !== 'cancelled').map((s) => (
          <Card key={s.key} hover pad onClick={() => setTab(STAGES.indexOf(s))} className="cursor-pointer">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">{s.label}</span>
            <div className={`mt-2 text-[30px] font-bold tracking-tight ${s.key === 'requested' || s.key === 'open' ? 'text-gold-strong' : s.key === 'delivered' ? 'text-green' : 'text-navy'}`}>
              <CountUp value={countOf(s.key)} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <PillTabs items={STAGES.map((s) => s.label)} active={tab} onChange={setTab} />
        <div className="flex flex-wrap items-center gap-2">
          <Select value={service} onChange={(e) => setService(e.target.value)} className="h-9 w-[240px] max-sm:w-full">
            <option value="">All services</option>
            {(plan?.services ?? []).map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </Select>
          <div className="relative max-sm:w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone"
              className="h-9 w-[240px] rounded-[9px] border border-border-strong bg-surface pl-8 pr-3 text-[12.5px] outline-none transition-[border-color,box-shadow] focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] max-sm:w-full"
            />
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        {isLoading ? (
          <PageSkeleton />
        ) : filtered.length === 0 ? (
          <Card>
            <EmptyState icon={Sparkles} title="No requests here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((r) => (
              <Card key={r.id} hover pad>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14.5px] font-semibold">{labelOf(r.service)}</span>
                      <Badge tone={STATUS_TONE[r.status] ?? 'gray'}>{STATUS_LABEL[r.status] ?? r.status}</Badge>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-ink-tertiary">
                      <User size={11} />
                      {r.employee?.name ?? 'Candidate'}
                      {r.employee?.phone ? ` · ${r.employee.phone}` : ''}
                      <span>· requested {new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                      {r.assignedTo && <span>· {r.assignedTo}</span>}
                    </div>
                    {r.scheduledFor && ['requested', 'scheduled', 'in_progress'].includes(r.status) && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-navy">
                        <CalendarClock size={13} /> {fmtDateTime(r.scheduledFor)}
                      </p>
                    )}
                    {r.note && <p className="mt-2 line-clamp-2 text-[13px] text-ink-secondary">{r.note}</p>}
                  </div>
                  <Button size="sm" onClick={() => app.openModal(<UpdateModal app={app} request={r} serviceLabel={labelOf(r.service)} />)}>
                    <ArrowRightLeft size={14} /> {['delivered', 'cancelled'].includes(r.status) ? 'View' : 'Update'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
