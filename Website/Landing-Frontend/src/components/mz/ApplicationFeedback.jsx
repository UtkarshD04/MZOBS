import { useState } from 'react'
import { ChevronDown, Flag, Loader2, Lightbulb } from 'lucide-react'
import { fetchApplicationFeedback, reportApplicationFeedback } from '../../lib/employeeApi'
import { useToast } from './Toast'

const REPORT_MIN = 10
const REPORT_MAX = 500
const fmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

// Feedback on a rejected application. The list only knows a label (`feedbackStatus`: none | pending |
// available); the text itself is fetched on demand and is, by construction on the API, only ever the version
// a Mzobs reviewer approved — never the employer's own notes.
export default function ApplicationFeedback({ app, token }) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [state, setState] = useState({ status: 'idle', feedback: null })
  const [reporting, setReporting] = useState(false)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reportError, setReportError] = useState('')

  const label = app.feedbackStatus ?? 'none'
  if (label === 'none') return <p className="mt-1 text-[13.5px] leading-relaxed text-mz-ink-2">No feedback was shared with this decision.</p>
  if (label === 'pending') return <p className="mt-1 text-[13.5px] leading-relaxed text-mz-ink-2">Feedback on this decision is being reviewed by Mzobs. We&rsquo;ll notify you when it&rsquo;s ready.</p>

  async function toggle() {
    const next = !open
    setOpen(next)
    if (!next || state.status === 'ready') return
    setState({ status: 'loading', feedback: null })
    try {
      const data = await fetchApplicationFeedback(token, app.id)
      setState({ status: data.status === 'available' ? 'ready' : 'empty', feedback: data.feedback ?? null })
    } catch (err) {
      setState({ status: 'error', feedback: null, message: err.message })
    }
  }

  async function submitReport(e) {
    e.preventDefault()
    const text = reason.trim()
    if (text.length < REPORT_MIN) return setReportError(`Please describe the problem in at least ${REPORT_MIN} characters.`)
    setSubmitting(true)
    setReportError('')
    try {
      await reportApplicationFeedback(token, app.id, text)
      setState((s) => ({ ...s, feedback: { ...s.feedback, dispute: { status: 'open' } } }))
      setReporting(false)
      setReason('')
      toast('Thanks. We’ll review your report.', { tone: 'success' })
    } catch (err) {
      setReportError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const fb = state.feedback
  const underReview = fb?.dispute?.status === 'open'

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded text-[13.5px] font-semibold text-mz-primary-strong hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-mz-primary"
      >
        {open ? 'Hide feedback' : 'View feedback'}
        <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-3 rounded-[10px] border border-mz-line bg-white px-3.5 py-3.5" aria-live="polite">
          {state.status === 'loading' && (
            <p className="flex items-center gap-2 text-[13.5px] text-mz-muted"><Loader2 size={14} className="animate-spin" aria-hidden="true" /> Loading feedback…</p>
          )}
          {state.status === 'error' && <p className="text-[13.5px] text-[#B42318]">{state.message ?? 'Couldn’t load the feedback.'} Please try again.</p>}
          {state.status === 'empty' && <p className="text-[13.5px] text-mz-muted">Feedback isn&rsquo;t available yet.</p>}

          {state.status === 'ready' && fb && (
            <>
              <p className="text-[12.5px] text-mz-muted">
                {fb.stageLabel ? `Stage reached: ${fb.stageLabel} · ` : ''}Shared {fb.deliveredAt ? fmt.format(new Date(fb.deliveredAt)) : ''}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-mz-ink">{fb.summary}</p>

              {fb.improvementAreas.length > 0 && (
                <div className="mt-3">
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold text-mz-ink"><Lightbulb size={14} className="text-mz-primary" aria-hidden="true" /> Where you can grow</p>
                  <ul className="mt-1.5 space-y-2">
                    {fb.improvementAreas.map((area) => (
                      <li key={area.code} className="text-[13.5px] leading-relaxed text-mz-ink-2">
                        <span className="font-medium text-mz-ink">{area.label}.</span> {area.suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 border-t border-mz-line pt-3">
                {underReview ? (
                  <p className="text-[13px] text-mz-muted">You reported a problem with this feedback. We&rsquo;re reviewing it.</p>
                ) : reporting ? (
                  <form onSubmit={submitReport} noValidate>
                    <label htmlFor={`report-${app.id}`} className="block text-[13px] font-medium text-mz-ink">What&rsquo;s wrong with this feedback?</label>
                    <textarea
                      id={`report-${app.id}`}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      maxLength={REPORT_MAX}
                      rows={3}
                      className="mt-1.5 w-full rounded-[10px] border border-mz-line px-3 py-2 text-[13.5px] outline-none focus:border-mz-primary"
                    />
                    <p className="mt-1 text-[12px] text-mz-muted">Only Mzobs reviewers see this, not the employer. {reason.length}/{REPORT_MAX}</p>
                    {reportError && <p className="mt-1 text-[12.5px] text-[#B42318]">{reportError}</p>}
                    <div className="mt-2.5 flex gap-2">
                      <button type="submit" disabled={submitting} className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-mz-primary px-3.5 text-[13px] font-semibold text-white hover:bg-mz-primary-strong disabled:opacity-60">
                        {submitting && <Loader2 size={13} className="animate-spin" aria-hidden="true" />} Send report
                      </button>
                      <button type="button" onClick={() => { setReporting(false); setReportError('') }} className="h-9 rounded-[10px] border border-mz-line px-3.5 text-[13px] font-semibold text-mz-ink-2 hover:bg-mz-bg">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button type="button" onClick={() => setReporting(true)} className="inline-flex items-center gap-1.5 rounded text-[13px] font-medium text-mz-muted hover:text-mz-ink hover:underline underline-offset-4">
                    <Flag size={13} aria-hidden="true" /> Report a problem with this feedback
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
