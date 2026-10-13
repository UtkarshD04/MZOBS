import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquareWarning } from 'lucide-react'
import { Button, Chip, EmptyState, Skeleton } from '../components/ui'
import RejectionFeedbackModal, { feedbackSubmitError } from '../components/RejectionFeedbackModal'
import { getCandidateFeedback, listFeedbackFollowUps, resubmitFeedback } from '../services/liveApi'
import { useWorkspace } from '../store/workspace'
import { agoDate } from '../lib/format'

// Rejection feedback that a Mzobs reviewer sent back (needs more detail) or flagged (needs changes),
// so the employer can answer it without hunting for the candidate.
export default function FeedbackFollowUps() {
  const { toast } = useWorkspace()
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(false)
  const [editing, setEditing] = useState(null)
  const [opening, setOpening] = useState(null)

  const load = useCallback(() => {
    setError(false)
    return listFeedbackFollowUps().then(setRows).catch(() => setError(true))
  }, [])
  useEffect(() => {
    load()
  }, [load])

  // The form is pre-filled with what the employer sent last time, so they correct it rather than retype it.
  const startEditing = async (row) => {
    setOpening(row.id)
    try {
      const full = await getCandidateFeedback(row.candidateId)
      setEditing({ ...row, remarks: full?.history?.at(-1)?.remarks ?? '' })
    } catch {
      setEditing({ ...row, remarks: '' })
    } finally {
      setOpening(null)
    }
  }

  const submit = async (value) => {
    try {
      await resubmitFeedback(editing.id, value)
      setEditing(null)
      toast('Feedback updated and sent back for review')
      await load()
    } catch (e) {
      throw feedbackSubmitError(e)
    }
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 pb-28 pt-6 lg:px-6">
      <h1 className="text-[28px] font-extrabold tracking-[-0.02em]">Feedback <em className="font-semibold italic text-accent">follow-ups</em></h1>
      <p className="mt-1 text-[14px] text-muted">Mzobs reviews the reasons you give when rejecting a candidate. When we need more detail, it shows up here.</p>

      <div className="mt-5 space-y-3" aria-live="polite">
        {rows === null && !error && [0, 1].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        {error && (
          <div className="rounded-2xl border border-line bg-white p-5 text-[13.5px]">
            Couldn&rsquo;t load your follow-ups. <button type="button" onClick={load} className="font-semibold text-accent hover:underline">Try again</button>
          </div>
        )}
        {rows?.length === 0 && <EmptyState icon={MessageSquareWarning} title="Nothing needs your attention" body="You'll see a request here if Mzobs needs more detail on a rejection." />}
        {rows?.map((row) => (
          <article key={row.id} className="rounded-2xl border border-line bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link to={`/candidate/${row.candidateId}`} className="text-[15px] font-semibold hover:text-accent">{row.candidateName || 'Candidate'}</Link>
                <p className="text-[12.5px] text-muted">{row.appliedFor} · {row.stageLabel} · updated {agoDate(row.updatedAt)}</p>
              </div>
              <Chip tone="accent">{row.status === 'flagged' ? 'Needs changes' : 'Needs more detail'}</Chip>
            </div>
            {row.clarification?.message && <p className="mt-3 rounded-lg bg-warn-soft px-3 py-2 text-[13px] text-warn"><span className="font-semibold">Mzobs asked: </span>{row.clarification.message}</p>}
            <div className="mt-3">
              <Button variant="primary" size="sm" disabled={opening === row.id} onClick={() => startEditing(row)}>{opening === row.id ? 'Opening…' : 'Update feedback'}</Button>
            </div>
          </article>
        ))}
      </div>

      <RejectionFeedbackModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        candidateName={editing?.candidateName}
        initial={editing ? { stage: editing.stage, reasons: editing.reasons, remarks: editing.remarks } : undefined}
        clarification={editing?.clarification?.message}
        submitLabel="Resubmit feedback"
        onSubmit={submit}
      />
    </div>
  )
}
