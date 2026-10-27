import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Lock, Eye } from 'lucide-react'
import { Button, Modal } from '../ui'
import { Field, textareaCls } from '../rc'
import { apiMessage, getRejectionOptions, rejectApplicant } from '../../services/recruiterService'

const MAX_REASONS = 3

// Rejecting separates two things on purpose: the internal reason (private to your team and MZOBS reviewers) and, only if
// you switch it on, a choice of respectful reasons the candidate may see — after an MZOBS reviewer has approved the wording.
export default function RejectModal({ candidate, onClose, onDone, toast }) {
  const [options, setOptions] = useState([])
  const [internal, setInternal] = useState('')
  const [share, setShare] = useState(false)
  const [reasons, setReasons] = useState([])
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!candidate) return
    setInternal('')
    setShare(false)
    setReasons([])
    setErrors({})
    getRejectionOptions().then(setOptions).catch(() => setOptions([]))
  }, [candidate])

  const toggle = (code) => {
    setErrors((x) => ({ ...x, candidateReasons: undefined }))
    setReasons((r) => (r.includes(code) ? r.filter((x) => x !== code) : r.length >= MAX_REASONS ? r : [...r, code]))
  }

  const submit = async () => {
    const e = {}
    if (internal.trim().length < 10) e.internalReason = 'Record a brief internal reason (at least 10 characters).'
    if (share && reasons.length === 0) e.candidateReasons = 'Select at least one reason the candidate may see.'
    setErrors(e)
    if (Object.keys(e).length) return
    setBusy(true)
    try {
      const res = await rejectApplicant(candidate.id, { internalReason: internal.trim(), shareFeedback: share, candidateReasons: share ? reasons : [] })
      toast(res.message ?? (res.feedbackShared ? `${candidate.name} rejected. Feedback sent to MZOBS for review.` : `${candidate.name} rejected.`), res.message ? { tone: 'warn' } : undefined)
      onDone()
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { form: apiMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={!!candidate}
      onClose={busy ? () => {} : onClose}
      title="Reject candidate"
      subtitle={candidate?.name}
      width={560}
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" onClick={submit} disabled={busy}>{busy ? 'Rejecting…' : 'Reject candidate'}</Button>
        </>
      }
    >
      <div className="space-y-5">
        <section>
          <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.04em] text-ink-2"><Lock size={12} /> Internal reason · private</p>
          <Field label="Why are you rejecting this candidate?" error={errors.internalReason} hint="Only your team and MZOBS reviewers can read this. The candidate never sees it.">
            <textarea value={internal} onChange={(e) => { setInternal(e.target.value); setErrors((x) => ({ ...x, internalReason: undefined })) }} rows={3} maxLength={1000} className={textareaCls} />
          </Field>
        </section>

        <section>
          <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.04em] text-ink-2"><Eye size={12} /> Candidate-visible feedback</p>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-3">
            <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#08685e]" />
            <span>
              <span className="block text-[13.5px] font-semibold">Share feedback with the candidate</span>
              <span className="block text-[12.5px] text-muted">Off by default. When on, MZOBS reviews it and shows the candidate a respectful “Application Insights” update. Nothing is shown until a reviewer approves it.</span>
            </span>
          </label>
          {share && (
            <div className="mt-3">
              <fieldset>
                <legend className="mb-1.5 text-[12px] font-semibold text-ink-2">Reasons the candidate may see (up to {MAX_REASONS})</legend>
                <div className="space-y-1.5">
                  {options.map((o) => {
                    const on = reasons.includes(o.code)
                    return (
                      <label key={o.code} className={clsx('flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-[13.5px]', on ? 'border-accent bg-accent-soft/40' : 'border-line hover:bg-[#faf9f6]', !on && reasons.length >= MAX_REASONS && 'opacity-50')}>
                        <input type="checkbox" checked={on} disabled={!on && reasons.length >= MAX_REASONS} onChange={() => toggle(o.code)} className="h-4 w-4 accent-[#08685e]" />
                        {o.label}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
              {errors.candidateReasons && <p className="mt-1.5 text-[12px] font-medium text-bad">{errors.candidateReasons}</p>}
            </div>
          )}
        </section>
        {(errors.form || errors.shareFeedback) && <p role="alert" className="text-[13px] font-medium text-bad">{errors.form ?? errors.shareFeedback}</p>}
      </div>
    </Modal>
  )
}
