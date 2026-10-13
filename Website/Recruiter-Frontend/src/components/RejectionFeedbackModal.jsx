import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button, Modal } from './ui'
import { getFeedbackOptions } from '../services/liveApi'

const REMARKS_MAX = 1000
let optionsPromise = null
const loadOptions = () => (optionsPromise ??= getFeedbackOptions().catch((e) => { optionsPromise = null; throw e }))

// Structured rejection feedback: how far the candidate got, at least one reason, and optional remarks.
// Used both to reject a candidate and to answer a reviewer's request for clarification (`clarification`).
// `onSubmit({ stage, reasons, remarks })` may reject with an Error whose `.fieldErrors` maps field -> message.
export default function RejectionFeedbackModal({ open, onClose, onSubmit, candidateName, initial, clarification, submitLabel = 'Reject candidate' }) {
  const [options, setOptions] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [stage, setStage] = useState('')
  const [reasons, setReasons] = useState([])
  const [remarks, setRemarks] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setStage(initial?.stage ?? '')
    setReasons(initial?.reasons ?? [])
    setRemarks('')
    setErrors({})
    setLoadError(false)
    loadOptions().then(setOptions).catch(() => setLoadError(true))
  }, [open, initial])

  const toggle = (code) => setReasons((cur) => (cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code]))

  const submit = async () => {
    const next = {}
    if (!stage) next.stage = 'Choose the stage the candidate reached.'
    if (reasons.length === 0) next.reasons = 'Select at least one reason.'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      await onSubmit({ stage, reasons, remarks: remarks.trim() })
    } catch (e) {
      setErrors(e.fieldErrors ?? { form: e.message || 'Could not save the feedback. Try again.' })
    } finally {
      setBusy(false)
    }
  }

  const group = (category) => (options?.reasons ?? []).filter((r) => r.category === category)

  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onClose}
      title={clarification ? 'Update your feedback' : `Reject ${candidateName || 'this candidate'}?`}
      subtitle="Tell us where the process ended and why. Mzobs reviews this before the candidate sees a summary."
      width={560}
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" onClick={submit} disabled={busy || !options}>{busy ? 'Saving…' : submitLabel}</Button>
        </>
      }
    >
      {clarification && (
        <div role="status" className="mb-4 flex gap-2 rounded-lg border border-[#f3dfb8] bg-warn-soft px-3 py-2.5 text-[13px] text-warn">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span><span className="font-semibold">Mzobs asked: </span>{clarification}</span>
        </div>
      )}
      {loadError && <p className="text-[13px] text-red-600">Couldn&rsquo;t load the feedback options. Close this and try again.</p>}
      {!options && !loadError && <p className="text-[13px] text-muted">Loading…</p>}

      {options && (
        <>
          <fieldset>
            <legend className="text-[13px] font-medium text-ink-2">How far did the candidate get?</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {options.stages.map((s) => (
                <label key={s.code} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[13px] ${stage === s.code ? 'border-accent bg-accent-soft' : 'border-line hover:bg-line-2'}`}>
                  <input type="radio" name="feedback-stage" value={s.code} checked={stage === s.code} onChange={() => setStage(s.code)} />
                  {s.label}
                </label>
              ))}
            </div>
            {errors.stage && <p className="mt-1 text-xs text-red-600">{errors.stage}</p>}
            {stage === 'application_review' && <p className="mt-1.5 text-[12px] text-muted">No call or interview took place, so just pick the reason from the profile review.</p>}
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-[13px] font-medium text-ink-2">Reasons (select at least one)</legend>
            {[['skill', 'About skills and experience'], ['non_skill', 'Not about skills']].map(([category, heading]) => (
              <div key={category} className="mt-3">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">{heading}</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {group(category).map((r) => (
                    <button
                      key={r.code}
                      type="button"
                      aria-pressed={reasons.includes(r.code)}
                      onClick={() => toggle(r.code)}
                      className={`rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors ${reasons.includes(r.code) ? 'border-accent bg-accent-soft text-[#0a6f64]' : 'border-line text-ink-2 hover:bg-line-2'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {errors.reasons && <p className="mt-2 text-xs text-red-600">{errors.reasons}</p>}
          </fieldset>

          <label htmlFor="feedback-remarks" className="mt-5 block text-[13px] font-medium text-ink-2">Remarks (optional)</label>
          <textarea
            id="feedback-remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            maxLength={REMARKS_MAX}
            rows={3}
            placeholder="Only what you observed, e.g. strong communication, but we need 3+ years of React."
            className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-[13.5px] outline-none focus:border-accent"
          />
          <p className="mt-1 text-[12px] text-muted">Private. Seen only by you and Mzobs reviewers, never by the candidate. {remarks.length}/{REMARKS_MAX}</p>
          {errors.remarks && <p className="text-xs text-red-600">{errors.remarks}</p>}
          {errors.form && <p className="mt-2 text-xs text-red-600">{errors.form}</p>}
        </>
      )}
    </Modal>
  )
}

// Turns an API 400 ({ errors: { field: message } }) into the Error shape the modal understands.
export function feedbackSubmitError(e) {
  const fieldErrors = e.response?.data?.errors
  return Object.assign(new Error(e.response?.data?.message ?? 'Could not save the feedback.'), fieldErrors ? { fieldErrors } : {})
}
