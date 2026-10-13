import { useState } from 'react'
import { ChevronDown, Flag, HelpCircle, Loader2, Lightbulb } from 'lucide-react'
import { askAboutApplicationFeedback, fetchApplicationFeedback, reportApplicationFeedback } from '../../lib/employeeApi'
import { useToast } from './Toast'

const REPORT_MIN = 10
const REPORT_MAX = 500
const fmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const field = 'mt-1.5 w-full rounded-[10px] border border-mz-line px-3 py-2 text-[13.5px] outline-none focus:border-mz-primary'
const primaryBtn = 'inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-mz-primary px-3.5 text-[13px] font-semibold text-white hover:bg-mz-primary-strong disabled:opacity-60'
const ghostBtn = 'h-9 rounded-[10px] border border-mz-line px-3.5 text-[13px] font-semibold text-mz-ink-2 hover:bg-mz-bg'
const linkBtn = 'inline-flex items-center gap-1.5 rounded text-[13px] font-medium text-mz-muted hover:text-mz-ink hover:underline underline-offset-4'

// A short free-text form that posts to one of the two candidate endpoints (report a problem / ask a question).
function MessageForm({ id, label, help, submitLabel, onSubmit, onCancel }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    if (text.trim().length < REPORT_MIN) return setError(`Please write at least ${REPORT_MIN} characters.`)
    setBusy(true)
    setError('')
    try {
      await onSubmit(text.trim())
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={id} className="block text-[13px] font-medium text-mz-ink">{label}</label>
      <textarea id={id} value={text} onChange={(e) => setText(e.target.value)} maxLength={REPORT_MAX} rows={3} className={field} />
      <p className="mt-1 text-[12px] text-mz-muted">{help} {text.length}/{REPORT_MAX}</p>
      {error && <p role="alert" className="mt-1 text-[12.5px] text-[#B42318]">{error}</p>}
      <div className="mt-2.5 flex gap-2">
        <button type="submit" disabled={busy} className={primaryBtn}>{busy && <Loader2 size={13} className="animate-spin" aria-hidden="true" />} {submitLabel}</button>
        <button type="button" onClick={onCancel} disabled={busy} className={ghostBtn}>Cancel</button>
      </div>
    </form>
  )
}

// Feedback on a rejected application. The list only knows a label (`feedbackStatus`: none | pending |
// available); the text itself is fetched on demand and is, by construction on the API, only ever the version
// a Mzobs reviewer approved — never the employer's own notes.
export default function ApplicationFeedback({ app, token }) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [state, setState] = useState({ status: 'idle', feedback: null })
  const [mode, setMode] = useState(null) // 'report' | 'question'
  const [asked, setAsked] = useState(false)

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

  async function report(text) {
    await reportApplicationFeedback(token, app.id, text)
    setState((s) => ({ ...s, feedback: { ...s.feedback, dispute: { status: 'open' } } }))
    setMode(null)
    toast('Thanks. We’ll review your report.', { tone: 'success' })
  }

  async function ask(text) {
    await askAboutApplicationFeedback(token, app.id, text)
    setAsked(true)
    setMode(null)
    toast('Question sent. Our team will reply.', { tone: 'success' })
  }

  const fb = state.feedback
  const underReview = fb?.dispute && fb.dispute.status !== 'resolved'

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
                {fb.stageLabel ? `Stage reached: ${fb.stageLabel} · ` : ''}Published {fb.deliveredAt ? fmt.format(new Date(fb.deliveredAt)) : ''}
              </p>
              {fb.reasons?.length > 0 && (
                <p className="mt-2 text-[13.5px] text-mz-ink"><span className="font-semibold">Reason: </span>{fb.reasons.map((r) => r.label).join('; ')}</p>
              )}
              <p className="mt-2 text-[14px] leading-relaxed text-mz-ink"><span className="font-semibold">Feedback: </span>{fb.summary}</p>

              {fb.improvementAreas.length > 0 && (
                <div className="mt-3">
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold text-mz-ink"><Lightbulb size={14} className="text-mz-primary" aria-hidden="true" /> Suggested next steps</p>
                  <ul className="mt-1.5 space-y-2">
                    {fb.improvementAreas.map((area) => (
                      <li key={area.code} className="text-[13.5px] leading-relaxed text-mz-ink-2">
                        <span className="font-medium text-mz-ink">{area.label}.</span> {area.suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 border-t border-mz-line pt-3 space-y-2">
                {mode === 'report' ? (
                  <MessageForm id={`report-${app.id}`} label="What’s wrong with this feedback?" help="Only Mzobs reviewers see this, not the employer." submitLabel="Send report" onSubmit={report} onCancel={() => setMode(null)} />
                ) : mode === 'question' ? (
                  <MessageForm id={`ask-${app.id}`} label="What would you like to ask?" help="Our support team will reply to you." submitLabel="Send question" onSubmit={ask} onCancel={() => setMode(null)} />
                ) : (
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {underReview ? (
                      <p className="text-[13px] text-mz-muted">You reported a problem with this feedback. We&rsquo;re reviewing it.</p>
                    ) : (
                      <button type="button" onClick={() => setMode('report')} className={linkBtn}><Flag size={13} aria-hidden="true" /> Report a problem with this feedback</button>
                    )}
                    {asked ? (
                      <p className="text-[13px] text-mz-muted">Your question is with our support team.</p>
                    ) : (
                      <button type="button" onClick={() => setMode('question')} className={linkBtn}><HelpCircle size={13} aria-hidden="true" /> Ask a question about it</button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
