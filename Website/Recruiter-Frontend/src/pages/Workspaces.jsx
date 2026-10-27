import { Sparkles, MessageSquare, CalendarDays, CalendarPlus, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Avatar, Button, Chip, EmptyState, Modal } from '../components/ui'
import { useActions } from '../components/useActions'
import InterviewCard, { isOverdue, isUpcoming, normalizeInterview } from '../components/InterviewCard'
import { makeCriteria, STAGE_LABELS } from '../lib/talent/criteria'
import { listInterviewable } from '../services/talentService'
import { cancelInterview, completeInterview, listInterviews, rescheduleInterview } from '../services/liveApi'
import ScorecardModal from '../components/ScorecardModal'
import { usePermissions } from '../services/recruiterService'
import { useSearchParams } from 'react-router-dom'
import { useWorkspace } from '../store/workspace'
import { IS_DEMO } from '../lib/config'
import { agoDate } from '../lib/format'
import { AI_PROMPTS } from '../components/AskAI'

function Page({ title, sub, action, children }) {
  return (
    <div className="mx-auto max-w-[980px] px-4 py-8 lg:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink">{title}</h1>
        {action}
      </div>
      {sub && <p className="mt-1 text-[14px] text-muted">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

// Drafts and sends logged on this device from candidate profiles (kept for the older Contact flow).
export function LocalMessages() {
  const { messages } = useWorkspace()
  return (
    <>
      {messages.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages saved on this device" body="Use Contact on a candidate to email or text them — once you have viewed their email or phone number." />
      ) : (
        <ul className="space-y-2">
          {messages.map((m) => (
            <li key={m.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[14px] font-semibold">{m.candidateName} <span className="ml-1 rounded bg-line-2 px-1.5 py-0.5 text-[11px] font-medium uppercase text-muted">{m.channel}</span></p>
                <span className={m.state === 'sent' ? 'text-[12px] font-medium text-[#1a8f5a]' : 'text-[12px] text-muted'}>{m.state === 'sent' ? 'Sent' : 'Draft'} · {agoDate(m.at)}</span>
              </div>
              {m.subject && <p className="mt-1 text-[13px] font-medium">{m.subject}</p>}
              <p className="mt-1 line-clamp-3 whitespace-pre-line text-[13px] text-ink-2">{m.body}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-5 text-[12px] text-muted">This list is stored on this device. Drafts are not delivered until you send them from the candidate&apos;s Contact window.</p>
    </>
  )
}

// Pick who to interview, then hand over to the usual scheduling form.
function SchedulePicker({ open, onClose, onPick }) {
  const [rows, setRows] = useState(null)
  const [q, setQ] = useState('')
  useEffect(() => {
    if (!open) return
    setRows(null)
    setQ('')
    listInterviewable().then(setRows).catch(() => setRows([]))
  }, [open])
  const order = { shortlisted: 0, interviewing: 1, offered: 2, shared: 3 }
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase()
    const list = (rows ?? []).filter((c) => !t || [c.name, c.designation, c.jobTitle, c.appliedFor].some((v) => v?.toLowerCase().includes(t)))
    return list.sort((a, b) => (order[a._live?.stage] ?? 9) - (order[b._live?.stage] ?? 9))
  }, [rows, q])
  return (
    <Modal open={open} onClose={onClose} title="Schedule an interview" subtitle="Choose a candidate from your pipeline" width={520}>
      <div className="relative">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or role" aria-label="Search candidates" className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-[14px] outline-none focus:border-accent" />
      </div>
      {rows === null && <p className="mt-4 text-[13px] text-muted">Loading your pipeline…</p>}
      {rows && shown.length === 0 && <EmptyState icon={CalendarDays} title={rows.length ? 'No match' : 'No one to interview yet'} body={rows.length ? 'Try a different name or role.' : 'Candidates you shortlist or receive for a job show up here.'} />}
      <ul className="mt-3 max-h-[52vh] space-y-1.5 overflow-y-auto">
        {shown.map((c) => (
          <li key={c.id}>
            <button onClick={() => onPick(c)} className="flex w-full items-center gap-3 rounded-2xl border border-line px-3 py-2.5 text-left hover:border-accent hover:bg-accent-soft/40">
              <Avatar candidate={c} size={34} />
              <span className="min-w-0 flex-1"><span className="block truncate text-[14px] font-medium">{c.name}</span><span className="block truncate text-[12.5px] text-muted">{c.designation || c.appliedFor}{c.jobTitle ? ` · ${c.jobTitle}` : ''}</span></span>
              {c._live?.stage && <Chip tone={c._live.stage === 'shortlisted' ? 'accent' : 'neutral'}>{STAGE_LABELS[c._live.stage] ?? c._live.stage}</Chip>}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

export function Interviews() {
  const { interviews: local } = useWorkspace()
  const [live, setLive] = useState(null)
  const [picking, setPicking] = useState(false)
  const load = useCallback(() => {
    if (!IS_DEMO) listInterviews().then(setLive).catch(() => setLive([]))
  }, [])
  useEffect(() => {
    load()
  }, [load])
  const { onAction, host } = useActions(makeCriteria(), { onInterviewScheduled: load })
  const rows = useMemo(() => (IS_DEMO ? local : live ?? []).map(normalizeInterview), [local, live])
  const { upcoming, pending, overdue, past } = useMemo(() => {
    const now = new Date()
    // Interviews still owed feedback come first and are not repeated under "Needs update".
    const pending = rows.filter((i) => i.feedbackState?.pending).sort((a, b) => a.startsAt - b.startsAt)
    const owed = new Set(pending.map((i) => i.id))
    return {
      pending,
      upcoming: rows.filter((i) => isUpcoming(i, now) && !owed.has(i.id)).sort((a, b) => a.startsAt - b.startsAt),
      overdue: rows.filter((i) => isOverdue(i, now) && !owed.has(i.id)).sort((a, b) => b.startsAt - a.startsAt),
      past: rows.filter((i) => !isUpcoming(i, now) && !isOverdue(i, now) && !owed.has(i.id)).sort((a, b) => b.startsAt - a.startsAt),
    }
  }, [rows])
  const [sp] = useSearchParams()
  const feedbackOnly = sp.get('filter') === 'feedback'
  const { me, can } = usePermissions()
  const [scoring, setScoring] = useState(null)

  // Reschedule / cancel / mark completed (live only). One dialog at a time: { kind, interview }.
  const { toast } = useWorkspace()
  const [dialog, setDialog] = useState(null)
  const [when, setWhen] = useState({ date: '', time: '' })
  const [note, setNote] = useState('')
  const [email, setEmail] = useState(true)
  const [busy, setBusy] = useState(false)
  const openDialog = (kind) => (interview) => {
    const d = interview.startsAt
    const pad = (n) => String(n).padStart(2, '0')
    setWhen({ date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` })
    setNote('')
    setEmail(true)
    setDialog({ kind, interview })
  }
  const confirmDialog = async () => {
    if (busy || !dialog) return
    const { kind, interview } = dialog
    setBusy(true)
    try {
      if (kind === 'reschedule') await rescheduleInterview(interview.id, { startsAt: new Date(`${when.date}T${when.time}`).toISOString(), notifyByEmail: email })
      else if (kind === 'cancel') await cancelInterview(interview.id, { notifyByEmail: email })
      else await completeInterview(interview.id, note.trim())
      toast(kind === 'reschedule' ? 'Interview rescheduled' : kind === 'cancel' ? 'Interview cancelled' : 'Interview marked completed')
      setDialog(null)
      load()
    } catch (e) {
      toast(e.response?.data?.message ?? 'Could not update the interview', { tone: 'warn' })
    } finally {
      setBusy(false)
    }
  }
  const actions = IS_DEMO ? {} : { ...(can('interviews.manage') && { onReschedule: openDialog('reschedule'), onCancel: openDialog('cancel'), onComplete: openDialog('complete') }), ...(can('interviews.feedback') && { onScorecard: setScoring }) }
  const dialogTitle = { reschedule: 'Reschedule interview', cancel: 'Cancel this interview?', complete: 'Mark interview completed' }[dialog?.kind]
  const dialogValid = dialog?.kind === 'reschedule' ? when.date && when.time : dialog?.kind === 'complete' ? note.trim().length > 0 : true

  return (
    <Page
      title="Interviews"
      sub="Interviews you've scheduled with candidates."
      action={can('interviews.manage') && <Button variant="primary" icon={CalendarPlus} onClick={() => setPicking(true)}>Schedule interview</Button>}
    >
      {rows.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No interviews scheduled" body="Choose Schedule interview to pick a candidate from your pipeline, or open a candidate and schedule from their profile." />
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <section aria-label="Interviews waiting for feedback">
              <h2 className="mb-1 text-[13px] font-bold uppercase tracking-wider text-muted">Feedback pending <span className="ml-1 rounded-full bg-warn-soft px-2 py-0.5 text-[11.5px] text-warn">{pending.length}</span></h2>
              <p className="mb-3 text-[12.5px] text-muted">Each interviewer submits a scorecard; the interview is marked completed once everyone on the panel has.</p>
              <ul className="space-y-3">{pending.map((i) => <InterviewCard key={i.id} interview={i} past {...actions} />)}</ul>
            </section>
          )}
          {feedbackOnly && pending.length === 0 && <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-[13.5px] text-muted">No interviews are waiting for feedback.</p>}
          {!feedbackOnly && <section aria-label="Upcoming interviews">
            <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-muted">Upcoming <span className="ml-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11.5px] text-[#0a6f64]">{upcoming.length}</span></h2>
            {upcoming.length === 0 ? <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-[13.5px] text-muted">Nothing coming up. Schedule one with the button above.</p> : <ul className="space-y-3">{upcoming.map((i) => <InterviewCard key={i.id} interview={i} {...actions} />)}</ul>}
          </section>}
          {!feedbackOnly && overdue.length > 0 && (
            <section aria-label="Interviews that need an update">
              <h2 className="mb-1 text-[13px] font-bold uppercase tracking-wider text-muted">Needs update <span className="ml-1 rounded-full bg-warn-soft px-2 py-0.5 text-[11.5px] text-warn">{overdue.length}</span></h2>
              <p className="mb-3 text-[12.5px] text-muted">The time has passed and these aren&rsquo;t marked completed or cancelled yet.</p>
              <ul className="space-y-3">{overdue.map((i) => <InterviewCard key={i.id} interview={i} past {...actions} />)}</ul>
            </section>
          )}
          {!feedbackOnly && past.length > 0 && (
            <section aria-label="Past and cancelled interviews">
              <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-muted">Past &amp; cancelled <span className="ml-1 rounded-full bg-line-2 px-2 py-0.5 text-[11.5px]">{past.length}</span></h2>
              <ul className="space-y-3">{past.map((i) => <InterviewCard key={i.id} interview={i} past onScorecard={actions.onScorecard} />)}</ul>
            </section>
          )}
        </div>
      )}
      <ScorecardModal interview={scoring} myId={me?.id} onClose={() => setScoring(null)} onSaved={load} toast={toast} />
      <SchedulePicker open={picking} onClose={() => setPicking(false)} onPick={(c) => { setPicking(false); onAction('interview', c) }} />
      {host}
      <Modal
        open={!!dialog}
        onClose={busy ? () => {} : () => setDialog(null)}
        title={dialogTitle}
        subtitle={dialog?.interview.candidateName}
        width={460}
        footer={
          <>
            <Button onClick={() => setDialog(null)} disabled={busy}>{dialog?.kind === 'cancel' ? 'Keep' : 'Close'}</Button>
            <Button variant="primary" onClick={confirmDialog} disabled={busy || !dialogValid}>{busy ? 'Saving…' : dialog?.kind === 'reschedule' ? 'Confirm new time' : dialog?.kind === 'cancel' ? 'Cancel interview' : 'Mark completed'}</Button>
          </>
        }
      >
        {dialog?.kind === 'reschedule' && (
          <div className="grid grid-cols-2 gap-3">
            <label className="text-[12px] text-muted">Date<input type="date" value={when.date} onChange={(e) => setWhen((w) => ({ ...w, date: e.target.value }))} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-[13.5px] outline-none focus:border-accent" /></label>
            <label className="text-[12px] text-muted">Time<input type="time" value={when.time} onChange={(e) => setWhen((w) => ({ ...w, time: e.target.value }))} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-[13.5px] outline-none focus:border-accent" /></label>
          </div>
        )}
        {dialog?.kind === 'complete' && (
          <label className="block text-[12px] text-muted">How did it go? (private note)
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-[13.5px] outline-none focus:border-accent" />
          </label>
        )}
        {dialog?.kind === 'cancel' && <p className="text-[13.5px] text-ink-2">The candidate is notified in Mzobs.</p>}
        {dialog && dialog.kind !== 'complete' && (
          <label className="mt-4 flex cursor-pointer items-center gap-2 text-[13px]"><input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} className="h-4 w-4 accent-[#0b7a6d]" /> Also email the candidate</label>
        )}
      </Modal>
    </Page>
  )
}

export function AITalent({ onAskAI }) {
  return (
    <Page title="AI Talent" sub="Ask Mzobs AI to do the legwork. Press Ctrl+K anywhere.">
      <div className="grid gap-3 sm:grid-cols-2">
        {AI_PROMPTS.map((p) => (
          <div key={p.label} className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <p className="flex items-center gap-2 text-[14px] font-semibold"><Sparkles size={14} className="text-ai" /> {p.label}</p>
            <p className="mt-1 text-[13px] text-muted">{p.hint}</p>
            {p.ready ? <Button className="mt-3" size="sm" variant="ai" onClick={onAskAI}>Try it</Button> : <span className="mt-3 inline-block rounded-md bg-line-2 px-2 py-0.5 text-[11.5px] font-medium text-muted">Needs the Mzobs AI service</span>}
          </div>
        ))}
      </div>
    </Page>
  )
}
