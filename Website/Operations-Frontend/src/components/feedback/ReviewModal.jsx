import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Building2, CheckCircle2, Lightbulb, RefreshCw, ShieldAlert } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import ErrorState from '../ui/ErrorState'
import { PageSkeleton } from '../ui/Skeleton'
import { ModalHead, ModalBody, ModalFoot } from '../ui/Modal'
import { Field, Select, Textarea, Input } from '../ui/Field'
import {
  useAddFeedbackNoteMutation,
  useFeedbackDetailQuery,
  useFeedbackFiltersQuery,
  useResolveDisputeMutation,
  useRetryNotificationMutation,
  useReviewFeedbackMutation,
} from '../../hooks/useFeedback'
import { DISPUTE_LABEL, NOTIFICATION_LABEL, NOTIFICATION_TONE, STATUS_LABEL, STATUS_TONE, dateTime, errorMessage } from './shared'

function Section({ letter, title, children }) {
  return (
    <section className="mb-5" aria-labelledby={`sec-${letter}`}>
      <h4 id={`sec-${letter}`} className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-tertiary mb-2">
        {letter}. {title}
      </h4>
      {children}
    </section>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-[13px] border-b border-border last:border-0">
      <span className="text-ink-tertiary shrink-0">{label}</span>
      <span className="font-medium text-right break-words min-w-0">{children}</span>
    </div>
  )
}

// Exactly what the candidate will receive — built from the same fields the API publishes.
function CandidatePreview({ stageLabel, reasons, summary, areas }) {
  return (
    <div className="rounded-xl border border-border-strong bg-surface p-4" aria-label="Candidate-facing preview">
      <p className="text-[12px] text-ink-tertiary">{stageLabel ? `Stage reached: ${stageLabel}` : ''}</p>
      {reasons.length > 0 && (
        <p className="mt-1 text-[13px]"><span className="font-semibold">Reason: </span>{reasons.map((r) => r.label).join('; ')}</p>
      )}
      <p className="mt-2 text-[13.5px] leading-relaxed whitespace-pre-wrap">{summary || <span className="text-ink-tertiary">Write the explanation the candidate will read.</span>}</p>
      {areas.length > 0 && (
        <div className="mt-3">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold"><Lightbulb size={13} aria-hidden="true" /> Suggested next steps</p>
          <ul className="mt-1 space-y-1.5">
            {areas.map((a) => (
              <li key={a.code} className="text-[12.5px] text-ink-secondary"><span className="font-medium text-ink">{a.label}.</span> {a.suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const ACTION_COPY = {
  approve: { title: 'Approve and publish to the candidate?', confirm: 'Approve and notify candidate', note: 'The explanation below goes to the candidate and they are notified. The employer’s original wording stays private.' },
  return: { title: 'Return to the employer?', confirm: 'Return to employer', note: 'The employer is asked to correct and resubmit. Nothing is shown to the candidate.' },
  flag: { title: 'Flag this feedback?', confirm: 'Flag feedback', note: 'The flag is internal. The employer is not told, and the candidate sees nothing.' },
  clear_flag: { title: 'Clear the flag?', confirm: 'Clear flag', note: 'The record goes back to Pending review.' },
  resolve: { title: 'Resolve the dispute and keep the feedback?', confirm: 'Resolve dispute', note: 'The delivered feedback stands and the dispute is closed.' },
  revise: { title: 'Publish revised feedback?', confirm: 'Publish revised feedback', note: 'A new version is published and the candidate is notified. The earlier version is kept.' },
  investigate: { title: 'Keep investigating?', confirm: 'Keep open for investigation', note: 'The case stays open and the delivered feedback stays visible.' },
  return_dispute: { title: 'Return the dispute to the employer?', confirm: 'Return to employer', note: 'The employer is asked to respond. The candidate’s report stays open.' },
}

export default function ReviewModal({ app, id, intent }) {
  const { data, isLoading, isError, refetch } = useFeedbackDetailQuery(id)
  const { data: filters } = useFeedbackFiltersQuery()
  const review = useReviewFeedbackMutation()
  const resolve = useResolveDisputeMutation()
  const addNote = useAddFeedbackNoteMutation()
  const retry = useRetryNotificationMutation()

  // `chosen` is what the reviewer picked; until they pick, an action clicked in the queue opens its confirm step.
  const [chosen, setChosen] = useState(undefined)
  const [summary, setSummary] = useState(null)
  const [returnReason, setReturnReason] = useState('')
  const [message, setMessage] = useState('')
  const [internalReason, setInternalReason] = useState('')
  const [resolutionSummary, setResolutionSummary] = useState('')
  const [note, setNote] = useState('')
  const [newNote, setNewNote] = useState('')
  const [formError, setFormError] = useState('')
  const confirmRef = useRef(null)
  const busy = review.isPending || resolve.isPending || addNote.isPending || retry.isPending

  const fromIntent = data?.status === 'pending_review' && ['approve', 'return', 'flag'].includes(intent) ? intent : null
  const action = chosen === undefined ? fromIntent : chosen
  const setAction = setChosen

  useEffect(() => {
    if (action) confirmRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [action])

  if (isLoading) return <ModalBody><PageSkeleton /></ModalBody>
  if (isError || !data) {
    return (
      <>
        <ModalHead title="Rejection feedback" onClose={app.closeModal} />
        <ModalBody><ErrorState onRetry={refetch} /></ModalBody>
      </>
    )
  }

  const status = data.status
  const disputed = status === 'disputed'
  const delivered = data.delivered
  const text = summary ?? delivered?.summary ?? data.draft.summary
  const areas = delivered && disputed ? delivered.improvementAreas : data.draft.improvementAreas
  const reasonsForPreview = delivered && disputed ? delivered.reasons : data.draft.reasons
  const canDecide = status === 'pending_review' || disputed
  const returnReasons = filters?.returnReasons ?? []

  function reset() {
    setAction(null)
    setFormError('')
  }

  function finish(done) {
    app.closeModal()
    app.addToast('success', done)
  }

  function fail(err) {
    const message = errorMessage(err)
    setFormError(message)
    app.addToast('error', message)
  }

  function confirm() {
    setFormError('')
    const base = { id, rev: data.rev }
    const handlers = {
      approve: () => review.mutate({ ...base, action: 'approve', summary: text }, { onSuccess: (r) => finish(r.notification === 'failed' ? 'Approved, but the candidate could not be notified. Use Retry notification.' : 'Approved. The candidate has been notified.'), onError: fail }),
      return: () => review.mutate({ ...base, action: 'return', returnReason, message }, { onSuccess: () => finish('Returned to the employer.'), onError: fail }),
      flag: () => review.mutate({ ...base, action: 'flag', internalReason }, { onSuccess: () => finish('Feedback flagged.'), onError: fail }),
      clear_flag: () => review.mutate({ ...base, action: 'clear_flag', note }, { onSuccess: () => finish('Flag cleared.'), onError: fail }),
      resolve: () => resolve.mutate({ ...base, action: 'resolve', resolutionSummary }, { onSuccess: () => finish('Dispute resolved. The original feedback stands.'), onError: fail }),
      revise: () => resolve.mutate({ ...base, action: 'revise', summary: text, resolutionSummary }, { onSuccess: () => finish('Revised feedback published.'), onError: fail }),
      investigate: () => resolve.mutate({ ...base, action: 'investigate', note }, { onSuccess: () => finish('Marked as under investigation.'), onError: fail }),
      return_dispute: () => resolve.mutate({ ...base, action: 'return', returnReason, message }, { onSuccess: () => finish('Returned to the employer.'), onError: fail }),
    }
    handlers[action]()
  }

  function submitNote() {
    if (newNote.trim().length < 3) return
    addNote.mutate({ id, text: newNote }, { onSuccess: () => { setNewNote(''); app.addToast('success', 'Note added') }, onError: fail })
  }

  function retryNotification() {
    retry.mutate(id, {
      onSuccess: () => app.addToast('success', 'Candidate notified.'),
      onError: (err) => app.addToast('error', errorMessage(err, 'Could not notify the candidate. Try again.')),
    })
  }

  const needsReturnFields = action === 'return' || action === 'return_dispute'
  const needsSummary = action === 'approve' || action === 'revise'

  return (
    <>
      <ModalHead title={`${data.candidateName || 'Candidate'} · ${data.jobTitle || 'Role'}`} onClose={app.closeModal} />
      <ModalBody className="max-h-[70vh]">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <Badge tone={STATUS_TONE[status] ?? 'gray'}>{STATUS_LABEL[status] ?? status}</Badge>
          {data.dispute && <Badge tone={data.dispute.status === 'resolved' ? 'gray' : 'red'} dot={false}>Candidate report: {DISPUTE_LABEL[data.dispute.status]}</Badge>}
          <span className="text-xs text-ink-tertiary flex items-center gap-1"><Building2 size={11} aria-hidden="true" /> {data.companyName}</span>
        </div>

        <Section letter="A" title="Application details">
          <div className="rounded-xl bg-surface-sunken px-3.5 py-1.5">
            <Row label="Candidate">{data.candidateName}</Row>
            <Row label="Company">{data.companyName}</Row>
            <Row label="Job title">{data.jobTitle}</Row>
            <Row label="Application ID"><code className="text-[12px]">{data.applicationId}</code></Row>
            <Row label="Stage reached">{data.stageLabel}</Row>
            <Row label="Application outcome">{data.application?.status ?? '—'}</Row>
            {data.application?.timeline?.length > 0 && (
              <Row label="Timeline">{data.application.timeline.map((t) => `${t.status} (${dateTime(t.at)})`).join(' → ')}</Row>
            )}
          </div>
        </Section>

        <Section letter="B" title="Employer submission">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {data.reasonDetails.map((r) => <Badge key={r.code} tone={r.category === 'skill' ? 'navy' : 'gray'} dot={false}>{r.label}</Badge>)}
          </div>
          <p className="rounded-xl bg-surface-sunken p-3 text-[13px] whitespace-pre-wrap">{data.employerRemarks || 'No additional feedback.'}</p>
          <p className="mt-1.5 text-xs text-ink-tertiary">
            Submitted {dateTime(data.submittedAt)}{data.submittedBy ? ` by ${data.submittedBy.name}${data.submittedBy.role ? ` (${data.submittedBy.role})` : ''}` : ''} · private, never shown to the candidate
          </p>
          {data.submissions.length > 1 && (
            <details className="mt-2 text-[12.5px]">
              <summary className="cursor-pointer font-semibold">Resubmission history ({data.submissions.length} versions)</summary>
              <ol className="mt-2 space-y-2">
                {data.submissions.map((s) => (
                  <li key={s.revision} className="rounded-lg border border-border p-2.5">
                    <span className="font-semibold">Version {s.revision}</span> · {dateTime(s.at)} · {s.stageLabel} · {s.reasons.map((r) => r.label).join('; ')}
                    <p className="mt-1 text-ink-secondary whitespace-pre-wrap">{s.remarks}</p>
                  </li>
                ))}
              </ol>
            </details>
          )}
        </Section>

        <Section letter="C" title="Candidate-facing feedback preview">
          {canDecide ? (
            <>
              <Field label="Explanation the candidate will read" hint={disputed ? 'The delivered text is pre-filled. Editing it publishes a revised version; the earlier one is kept.' : 'Pre-filled from the structured reasons. The employer’s own wording is not included. You can edit it; the employer’s original is preserved separately.'}>
                <Textarea rows={4} value={text} onChange={(e) => setSummary(e.target.value)} maxLength={1200} aria-label="Candidate-facing explanation" />
              </Field>
              <CandidatePreview stageLabel={data.stageLabel} reasons={reasonsForPreview} summary={text} areas={areas} />
            </>
          ) : delivered ? (
            <>
              <CandidatePreview stageLabel={data.stageLabel} reasons={delivered.reasons ?? []} summary={delivered.summary} areas={delivered.improvementAreas ?? []} />
              <p className="mt-1.5 text-xs text-ink-tertiary">Version {delivered.version} · approved {dateTime(delivered.approvedAt)} by {delivered.approvedByName || 'a reviewer'}</p>
            </>
          ) : (
            <p className="text-[13px] text-ink-tertiary">Nothing has been published to the candidate. Waiting on the employer.</p>
          )}
          {data.notification && (
            <div className="mt-3 flex items-center gap-2 flex-wrap text-[12.5px]">
              <Badge tone={NOTIFICATION_TONE[data.notification.status] ?? 'gray'}>{NOTIFICATION_LABEL[data.notification.status] ?? data.notification.status}</Badge>
              <span className="text-ink-tertiary">{data.notification.attempts} attempt{data.notification.attempts === 1 ? '' : 's'}{data.notification.sentAt ? ` · delivered ${dateTime(data.notification.sentAt)}` : ''}</span>
              {data.notification.error && <span className="text-red">{data.notification.error}</span>}
              {(data.notification.status === 'failed' || data.notification.status === 'pending') && (
                <Button size="sm" onClick={retryNotification} disabled={busy}><RefreshCw size={13} aria-hidden="true" /> {retry.isPending ? 'Retrying…' : 'Retry notification'}</Button>
              )}
            </div>
          )}
        </Section>

        <Section letter="D" title="Internal review (private to staff)">
          {data.flag && <p className="mb-2 rounded-xl bg-red-tint p-3 text-[13px]"><span className="font-semibold">Flagged by {data.flag.by || 'a reviewer'} · {dateTime(data.flag.at)}: </span>{data.flag.reason}</p>}
          {data.clarification && <p className="mb-2 rounded-xl bg-surface-sunken p-3 text-[13px]"><span className="font-semibold">Last request to the employer ({dateTime(data.clarification.requestedAt)}): </span>{data.clarification.message}</p>}
          {data.dispute && (
            <div className="mb-2 rounded-xl bg-red-tint p-3 text-[13px]">
              <p><span className="font-semibold">Candidate report ({DISPUTE_LABEL[data.dispute.status]}, {dateTime(data.dispute.raisedAt)}): </span>{data.dispute.reason}</p>
              {data.dispute.resolutionSummary && <p className="mt-1"><span className="font-semibold">Resolution{data.dispute.resolvedBy ? ` by ${data.dispute.resolvedBy}` : ''}: </span>{data.dispute.resolutionSummary}</p>}
            </div>
          )}
          {data.notes.length > 0 && (
            <ul className="mb-2 space-y-1.5">
              {data.notes.map((n, i) => <li key={i} className="rounded-lg border border-border px-3 py-2 text-[12.5px]"><span className="font-semibold">{n.by || 'Reviewer'}</span> · {dateTime(n.at)}<p className="mt-0.5 whitespace-pre-wrap">{n.text}</p></li>)}
            </ul>
          )}
          <div className="flex gap-2 items-start">
            <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} maxLength={1000} placeholder="Add a private note" aria-label="Private note" />
            <Button onClick={submitNote} disabled={busy || newNote.trim().length < 3}>Add note</Button>
          </div>
          <details className="mt-3 text-[12.5px]">
            <summary className="cursor-pointer font-semibold">Review history ({data.audit.length})</summary>
            <ol className="mt-2 space-y-1 text-ink-secondary">
              {data.audit.map((a, i) => (
                <li key={i}>{dateTime(a.at)} · <span className="font-semibold">{a.action.replaceAll('_', ' ')}</span> by {a.actor || a.actorType}{a.note ? ` · ${a.note}` : ''}</li>
              ))}
            </ol>
          </details>
        </Section>

        {action && (
          <section ref={confirmRef} role="group" aria-label={ACTION_COPY[action].title} className="rounded-xl border-2 border-navy bg-navy-tint/40 p-4 mb-2">
            <h4 className="flex items-center gap-2 text-[14px] font-semibold"><ShieldAlert size={16} aria-hidden="true" /> {ACTION_COPY[action].title}</h4>
            <p className="mt-1 text-[12.5px] text-ink-secondary">{ACTION_COPY[action].note}</p>
            {needsSummary && <p className="mt-2 text-[12.5px]">Publishing: <span className="italic">{text.slice(0, 160)}{text.length > 160 ? '…' : ''}</span></p>}
            {needsReturnFields && (
              <div className="mt-3">
                <Field label="Why is this being returned?">
                  <Select value={returnReason} onChange={(e) => setReturnReason(e.target.value)} aria-label="Return reason">
                    <option value="">Choose a reason…</option>
                    {returnReasons.map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
                  </Select>
                </Field>
                <Field label="Instructions for the employer" optional={returnReason !== 'other'}>
                  <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} />
                </Field>
              </div>
            )}
            {action === 'flag' && (
              <Field label="Internal flag reason" className="mt-3" hint="Private to Operations. Not shown to the employer or the candidate.">
                <Textarea rows={3} value={internalReason} onChange={(e) => setInternalReason(e.target.value)} maxLength={500} />
              </Field>
            )}
            {(action === 'resolve' || action === 'revise') && (
              <Field label="Resolution summary" className="mt-3" hint="Recorded in the case history. Private to Operations.">
                <Textarea rows={3} value={resolutionSummary} onChange={(e) => setResolutionSummary(e.target.value)} maxLength={500} />
              </Field>
            )}
            {(action === 'investigate' || action === 'clear_flag') && (
              <Field label={action === 'investigate' ? 'Investigation note' : 'Note'} optional={action === 'clear_flag'} className="mt-3">
                <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
              </Field>
            )}
            {formError && <p role="alert" className="mt-2 flex items-center gap-1.5 text-[12.5px] text-red"><AlertTriangle size={13} aria-hidden="true" /> {formError}</p>}
            <div className="mt-3 flex gap-2 justify-end">
              <Button onClick={reset} disabled={busy}>Cancel</Button>
              <Button variant="primary" onClick={confirm} disabled={busy || (needsReturnFields && !returnReason)}>{busy ? 'Saving…' : ACTION_COPY[action].confirm}</Button>
            </div>
          </section>
        )}
      </ModalBody>

      <ModalFoot>
        <Button onClick={app.closeModal} disabled={busy}>Close</Button>
        {status === 'pending_review' && !action && (
          <>
            <Button onClick={() => setAction('flag')} disabled={busy}>Flag / dispute</Button>
            <Button onClick={() => setAction('return')} disabled={busy}>Return to employer</Button>
            <Button variant="primary" onClick={() => setAction('approve')} disabled={busy || !data.viewedByYou}><CheckCircle2 size={14} aria-hidden="true" /> Approve feedback</Button>
          </>
        )}
        {status === 'flagged' && !action && (
          <>
            <Button onClick={() => setAction('return')} disabled={busy}>Return to employer</Button>
            <Button variant="primary" onClick={() => setAction('clear_flag')} disabled={busy}>Clear flag</Button>
          </>
        )}
        {disputed && !action && (
          <>
            <Button onClick={() => setAction('investigate')} disabled={busy || data.dispute?.status === 'investigating'}>Keep investigating</Button>
            <Button onClick={() => setAction('return_dispute')} disabled={busy}>Return to employer</Button>
            <Button onClick={() => setAction('resolve')} disabled={busy}>Resolve (keep original)</Button>
            <Button variant="primary" onClick={() => setAction('revise')} disabled={busy}>Publish revised</Button>
          </>
        )}
      </ModalFoot>
    </>
  )
}
