import { CalendarClock, Clock, Mail, MapPin, Users, Video } from 'lucide-react'
import clsx from 'clsx'
import { safeHref } from '../lib/safeUrl'

// One scheduled interview, laid out so the date and time read at a glance: a calendar tile on the left,
// who/what in the middle, status on the right. Works with the API's interview shape (see normalizeInterview).

const MON = new Intl.DateTimeFormat('en-IN', { month: 'short' })
const WEEKDAY = new Intl.DateTimeFormat('en-IN', { weekday: 'short' })
const TIME = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
const timeText = (d) => TIME.format(d).replace(/\s/g, ' ').toLowerCase()

const STATUS_STYLE = {
  Confirmed: 'bg-ok-soft text-[#1a8f5a]',
  'Awaiting confirmation': 'bg-warn-soft text-warn',
  Rescheduled: 'bg-[#f1eefc] text-[#6d4fc7]',
  Completed: 'bg-blue-soft text-[#1f6fb2]',
  Cancelled: 'bg-line-2 text-muted',
  Planned: 'bg-blue-soft text-[#1f6fb2]',
}

// "Today", "Tomorrow", "In 3 days", "2 days ago" — relative to calendar days, not hours.
export function relativeDay(date, now = new Date()) {
  const day = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diff = Math.round((day(date) - day(now)) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return diff > 0 ? `In ${diff} days` : `${-diff} days ago`
}

// API rows and the demo's locally-stored plans share one shape here.
export function normalizeInterview(r) {
  if (r.startsAt) {
    return { id: r.id, candidateName: r.candidateName, role: r.role, round: r.round, startsAt: new Date(r.startsAt), durationMins: r.durationMins, mode: r.mode, meetingLink: r.meetingLink, location: r.location, panel: r.panel ?? [], status: r.status, email: r.email, interviewers: r.interviewers ?? [], scorecards: r.scorecards ?? [], feedbackState: r.feedbackState ?? null, feedbackDueOn: r.feedbackDueOn ? new Date(r.feedbackDueOn) : null, overallRating: r.overallRating ?? null }
  }
  return {
    id: r.id,
    candidateName: r.candidateName,
    role: '',
    round: r.type,
    startsAt: new Date(`${r.date}T${r.time}`),
    durationMins: 45,
    mode: r.type === 'On-site' ? 'On-site' : 'Video Call',
    meetingLink: r.link,
    location: null,
    panel: String(r.interviewers ?? '').split(',').map((x) => x.trim()).filter(Boolean),
    status: r.status ?? 'Planned',
  }
}

export const isUpcoming = (i, now = new Date()) => !['Cancelled', 'Completed'].includes(i.status) && i.startsAt.getTime() + (i.durationMins ?? 30) * 60000 >= now.getTime()

// Time has passed but nobody marked it completed or cancelled, so it still needs the recruiter's attention.
export const isOverdue = (i, now = new Date()) => !['Cancelled', 'Completed'].includes(i.status) && !isUpcoming(i, now)

function EmailNote({ email }) {
  if (!email?.status) return null
  const sent = email.status === 'sent'
  const text = { sent: `Email sent to ${email.to}`, failed: 'Email could not be sent', not_configured: 'Email not sent (mail isn’t set up)', no_email: 'Email not sent (no address on file)', not_allowed: 'Email not sent (address not unlocked)' }[email.status]
  return (
    <span className={clsx('inline-flex items-center gap-1 text-[12px]', sent ? 'text-[#1a8f5a]' : 'text-muted')}>
      <Mail size={12} aria-hidden="true" /> {text}
    </span>
  )
}

export default function InterviewCard({ interview: i, past = false, onReschedule, onCancel, onComplete, onScorecard }) {
  const fb = i.feedbackState
  const end = i.durationMins ? new Date(i.startsAt.getTime() + i.durationMins * 60000) : null
  const cancelled = i.status === 'Cancelled'
  const video = i.mode !== 'On-site'
  return (
    <li className={clsx('flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5', (past || cancelled) && 'opacity-80')}>
      <div className={clsx('flex h-[78px] w-[68px] shrink-0 flex-col items-center justify-center rounded-2xl', cancelled ? 'bg-line-2 text-muted' : 'bg-accent-soft text-[#0a6f64]')} aria-hidden="true">
        <span className="text-[11px] font-bold uppercase tracking-wider">{MON.format(i.startsAt)}</span>
        <span className="text-[28px] font-extrabold leading-none tabular-nums">{i.startsAt.getDate()}</span>
        <span className="mt-0.5 text-[11px] font-semibold opacity-80">{WEEKDAY.format(i.startsAt)}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <div className="min-w-0">
            <p className={clsx('truncate text-[16px] font-bold', cancelled && 'line-through')}>{i.candidateName}</p>
            <p className="truncate text-[13px] text-muted">{[i.role, i.round].filter(Boolean).join(' · ') || 'Interview'}</p>
          </div>
          <span className={clsx('rounded-full px-2.5 py-0.5 text-[12px] font-semibold', STATUS_STYLE[i.status] ?? STATUS_STYLE.Planned)}>{i.status ?? 'Planned'}</span>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-ink-2">
          <span className="inline-flex items-center gap-1.5 font-semibold text-ink"><Clock size={14} className="text-accent" aria-hidden="true" /> {timeText(i.startsAt)}{end ? ` – ${timeText(end)}` : ''}</span>
          <span className="inline-flex items-center gap-1.5">{video ? <Video size={14} className="text-muted" aria-hidden="true" /> : <MapPin size={14} className="text-muted" aria-hidden="true" />}{video ? 'Video call' : i.location || 'On-site'}</span>
          {!past && !cancelled && <span className="inline-flex items-center gap-1.5 text-[#0a6f64]"><CalendarClock size={14} aria-hidden="true" /> {relativeDay(i.startsAt)}</span>}
        </div>

        {fb?.pending && (
          <p className={clsx('mt-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold', fb.overdue ? 'bg-[#f5e9e7] text-[#9a3a2c]' : 'bg-warn-soft text-warn')}>
            {fb.overdue ? 'Feedback overdue' : 'Feedback pending'}
            {fb.awaiting.length > 0 && <span className="font-normal"> · waiting on {fb.awaiting.map((a) => a.name).join(', ')}</span>}
            {i.feedbackDueOn && <span className="font-normal"> · due {i.feedbackDueOn.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
          </p>
        )}
        {i.scorecards.length > 0 && (
          <div className="mt-2.5 rounded-lg border border-line-2 bg-[#faf9f6] px-3 py-2">
            <p className="text-[12px] font-bold uppercase tracking-[0.04em] text-ink-2">Scorecards{i.overallRating != null && <span className="ml-1.5 normal-case tracking-normal text-ink">· <b className="num">{i.overallRating}</b>/5 average</span>}</p>
            <ul className="mt-1 space-y-0.5 text-[12.5px]">{i.scorecards.map((s) => <li key={s.interviewer} className="flex justify-between gap-3"><span>{s.interviewerName}</span><span className="font-semibold">{s.recommendation}</span></li>)}</ul>
          </div>
        )}
        {i.panel.length > 0 && (
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted">
            <Users size={13} aria-hidden="true" />
            {i.panel.map((p) => <span key={p} className="rounded-full bg-line-2 px-2 py-0.5 font-medium text-ink-2">{p}</span>)}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {i.meetingLink && !past && !cancelled && (
            <a href={safeHref(i.meetingLink)} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#075f55]">
              <Video size={14} aria-hidden="true" /> Join interview
            </a>
          )}
          {i.status !== 'Cancelled' && ((onScorecard && i.startsAt <= new Date()) || (i.status !== 'Completed' && (onReschedule || onCancel || onComplete))) && (
            <span className="inline-flex flex-wrap items-center gap-2">
              {i.status !== 'Completed' && onReschedule && <button type="button" onClick={() => onReschedule(i)} className="h-8 rounded-full border border-line px-3 text-[12.5px] font-semibold text-ink-2 hover:bg-line-2">Reschedule</button>}
              {onScorecard && i.startsAt <= new Date() && i.status !== 'Cancelled' && <button type="button" onClick={() => onScorecard(i)} className="h-8 rounded-full border border-accent px-3 text-[12.5px] font-semibold text-accent hover:bg-accent-soft">Scorecard</button>}
              {onComplete && past && <button type="button" onClick={() => onComplete(i)} className="h-8 rounded-full border border-line px-3 text-[12.5px] font-semibold text-ink-2 hover:bg-line-2">Mark completed</button>}
              {i.status !== 'Completed' && onCancel && <button type="button" onClick={() => onCancel(i)} className="h-8 rounded-full px-3 text-[12.5px] font-semibold text-red-600 hover:bg-red-50">Cancel</button>}
            </span>
          )}
          <EmailNote email={i.email} />
        </div>
      </div>
    </li>
  )
}
