import { useState } from 'react'
import { MessageSquareText, Building2, User } from 'lucide-react'
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
import { Field, Textarea } from '../../components/ui/Field'
import { useApp } from '../../lib/appContext'
import { useFeedbackCountsQuery, useFeedbackDetailQuery, useFeedbackListQuery, useResolveDisputeMutation, useReviewFeedbackMutation } from '../../hooks/useFeedback'

const TABS = [
  { label: 'Pending review', status: 'pending_review', count: 'pending_review' },
  { label: 'Approved', status: 'approved', count: 'approved' },
  { label: 'Returned', status: 'returned', count: 'returned' },
  { label: 'Flagged / disputed', status: 'attention', count: 'attention' },
  { label: 'Employer follow-up', status: 'followUp', count: 'followUp' },
]

const STATUS_LABEL = { pending_review: 'Pending review', approved: 'Approved', returned: 'Returned to employer', flagged: 'Flagged', disputed: 'Disputed by candidate' }
const STATUS_TONE = { pending_review: 'gold', approved: 'green', returned: 'navy', flagged: 'red', disputed: 'red' }
const when = (iso) => (iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '')

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h4 className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-tertiary mb-1.5">{title}</h4>
      {children}
    </div>
  )
}

function ReviewModal({ app, id }) {
  const { data, isLoading, isError, refetch } = useFeedbackDetailQuery(id)
  const review = useReviewFeedbackMutation()
  const resolve = useResolveDisputeMutation()
  const [summary, setSummary] = useState(null)
  const [message, setMessage] = useState('')
  const busy = review.isPending || resolve.isPending

  if (isLoading) return <ModalBody><PageSkeleton /></ModalBody>
  if (isError || !data) return <ModalBody><ErrorState onRetry={refetch} /></ModalBody>

  const latest = data.versions.at(-1)
  const text = summary ?? latest?.summary ?? data.draft.summary
  const disputed = data.status === 'disputed'
  const reviewable = data.status === 'pending_review' || disputed

  const done = (note) => ({
    onSuccess: () => {
      app.closeModal()
      app.addToast('success', note)
    },
    onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
  })

  return (
    <>
      <ModalHead title={`${data.candidateName || 'Candidate'} · ${data.jobTitle || 'Role'}`} onClose={app.closeModal} />
      <ModalBody className="max-h-[68vh]">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <Badge tone={STATUS_TONE[data.status] ?? 'gray'}>{STATUS_LABEL[data.status] ?? data.status}</Badge>
          <span className="text-xs text-ink-tertiary flex items-center gap-1"><Building2 size={11} /> {data.companyName}</span>
          <span className="text-xs text-ink-tertiary">· Reached: {data.stageLabel}</span>
        </div>

        <Section title="Reasons the employer gave">
          <div className="flex flex-wrap gap-1.5">
            {data.reasonDetails.map((r) => <Badge key={r.code} tone={r.category === 'skill' ? 'navy' : 'gray'} dot={false}>{r.label}</Badge>)}
          </div>
        </Section>

        <Section title="Employer remarks (private, never shown to the candidate)">
          <p className="rounded-xl bg-surface-sunken p-3 text-[13px] text-ink-secondary whitespace-pre-wrap">{data.employerRemarks || 'No remarks.'}</p>
        </Section>

        {data.dispute && (
          <Section title={`Candidate report (${data.dispute.status})`}>
            <p className="rounded-xl bg-red-tint p-3 text-[13px] whitespace-pre-wrap">{data.dispute.reason}</p>
          </Section>
        )}

        {data.clarification && (
          <Section title={`Last request sent to the employer (${when(data.clarification.requestedAt)})`}>
            <p className="rounded-xl bg-surface-sunken p-3 text-[13px] text-ink-secondary">{data.clarification.message}</p>
          </Section>
        )}

        {reviewable && (
          <>
            <Field label="Candidate-facing summary" hint={disputed ? 'The delivered text is pre-filled. Edit it to publish a revised version.' : 'Pre-filled from the structured reasons. The employer’s remarks are not included. Edit as needed.'}>
              <Textarea rows={5} value={text} onChange={(e) => setSummary(e.target.value)} maxLength={1200} />
            </Field>
            {!disputed && data.draft.improvementAreas.length > 0 && (
              <p className="text-xs text-ink-tertiary -mt-1 mb-3">Improvement areas shown to the candidate: {data.draft.improvementAreas.map((a) => a.label).join(', ')}.</p>
            )}
            <Field label="Message to the employer" optional hint="Required to return, flag, or send a disputed item back. The employer sees this.">
              <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} placeholder="e.g. Please say which skills the candidate lacked." />
            </Field>
          </>
        )}

        {data.versions.length > 0 && (
          <Section title="Delivered versions">
            {data.versions.map((v) => (
              <p key={v.number} className="text-[12.5px] text-ink-secondary mb-1.5"><span className="font-semibold">v{v.number}</span> · {when(v.approvedAt)} · {v.summary}</p>
            ))}
          </Section>
        )}

        <Section title="Audit trail">
          <ol className="text-[12.5px] text-ink-secondary space-y-1">
            {data.audit.map((a, i) => (
              <li key={i}>{when(a.at)} · <span className="font-semibold">{a.action.replaceAll('_', ' ')}</span> by {a.actorType}{a.note ? ` · ${a.note}` : ''}</li>
            ))}
          </ol>
        </Section>
      </ModalBody>

      <ModalFoot>
        <Button onClick={app.closeModal} disabled={busy}>Close</Button>
        {reviewable && !disputed && (
          <>
            <Button disabled={busy} onClick={() => review.mutate({ id, action: 'flag', message }, done('Feedback flagged'))}>Flag</Button>
            <Button disabled={busy} onClick={() => review.mutate({ id, action: 'return', message }, done('Returned to the employer'))}>Ask employer</Button>
            <Button variant="primary" disabled={busy} onClick={() => review.mutate({ id, action: 'approve', summary: text }, done('Approved. The candidate has been notified.'))}>Approve</Button>
          </>
        )}
        {disputed && (
          <>
            <Button disabled={busy} onClick={() => resolve.mutate({ id, action: 'return', message }, done('Returned to the employer'))}>Ask employer</Button>
            <Button disabled={busy} onClick={() => resolve.mutate({ id, action: 'uphold' }, done('Original feedback upheld'))}>Uphold original</Button>
            <Button variant="primary" disabled={busy} onClick={() => resolve.mutate({ id, action: 'revise', summary: text }, done('Revised feedback published'))}>Publish revised</Button>
          </>
        )}
      </ModalFoot>
    </>
  )
}

export default function FeedbackReview() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const { data: counts } = useFeedbackCountsQuery()
  const { data: rows = [], isLoading, isError, refetch } = useFeedbackListQuery(TABS[tab].status)

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Rejection feedback</h1>
        <p className="text-sm text-ink-secondary mt-1">Review what employers say when they reject a candidate. Only what you approve reaches the candidate.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        {TABS.map((t, i) => (
          <Card key={t.label} hover pad onClick={() => setTab(i)} className="cursor-pointer">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{t.label}</span>
            <div className={`text-[28px] font-bold tracking-tight mt-2 ${i === 0 ? 'text-gold-strong' : i === 1 ? 'text-green' : 'text-ink'}`}>
              <CountUp value={counts?.[t.count] ?? 0} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="mb-4">
        <PillTabs items={TABS.map((t) => t.label)} active={tab} onChange={setTab} />
      </StaggerItem>

      <StaggerItem>
        {isLoading ? (
          <PageSkeleton />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : rows.length === 0 ? (
          <Card>
            <EmptyState icon={MessageSquareText} title="Nothing in this queue" body="Feedback shows up here when an employer rejects a candidate." />
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {rows.map((row) => (
              <Card key={row.id} hover pad>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14.5px] font-semibold">{row.candidateName || 'Candidate'}</span>
                      <Badge tone={STATUS_TONE[row.status] ?? 'gray'}>{STATUS_LABEL[row.status] ?? row.status}</Badge>
                      {row.disputeOpen && <Badge tone="red" dot={false}>Candidate report open</Badge>}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-tertiary mt-1.5 flex-wrap">
                      <User size={11} /> {row.jobTitle || 'Role'}
                      <span>· {row.companyName}</span>
                      <span>· {row.stageLabel}</span>
                      <span>· {when(row.updatedAt)}</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => app.openModal(<ReviewModal app={app} id={row.id} />, true)}>
                    {row.status === 'pending_review' || row.status === 'disputed' ? 'Review' : 'View'}
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
