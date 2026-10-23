import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Calendar, CalendarClock, Check, ChevronDown, ExternalLink, Loader2, Lock, MapPin, Monitor, RotateCw, SearchX, Video, Building2 } from 'lucide-react'
import Seo from '../components/Seo'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Container, CompanyLogo } from '../components/mz/primitives'
import { useToast } from '../components/mz/Toast'
import ApplicationFeedback from '../components/mz/ApplicationFeedback'
import { ConversionBand, JourneyWorkspace, NextMove, PageIntro, PremiumValue } from '../components/mz/ApplicationCommandCenter'
import { getEmployeeSession } from '../lib/employeeSession'
import { getEmployeeProfile } from '../lib/employeeProfile'
import { fetchApplications, fetchInterviews, fetchMockInterview, withdrawApplication } from '../lib/employeeApi'

const PAGE_SIZE = 50
const SIGN_IN_TO = `/employees/signin?next=${encodeURIComponent('/employees/applications')}`

// Candidate-facing wording for Application.status (Backend's APPLICATION_STATUSES).
const STATUS = {
  new: { label: 'Applied', tone: 'neutral' },
  screening: { label: 'Under review', tone: 'progress' },
  shortlisted: { label: 'Shortlisted', tone: 'progress' },
  shared: { label: 'Shared with employer', tone: 'progress' },
  viewed: { label: 'Viewed by employer', tone: 'progress' },
  interview: { label: 'Interview', tone: 'progress' },
  selected: { label: 'Selected', tone: 'good' },
  rejected: { label: 'Not selected', tone: 'closed' },
  withdrawn: { label: 'Withdrawn', tone: 'closed' },
}
const TONE = {
  neutral: 'bg-mz-bg text-mz-ink-2 ring-1 ring-mz-line',
  progress: 'bg-mz-primary-tint text-mz-primary-strong',
  good: 'bg-[#E6F6EC] text-[#1E7B45]',
  closed: 'bg-[#F3F4F6] text-[#5B6472]',
}
// Same rule as the backend's WITHDRAWABLE_STATUSES.
const WITHDRAWABLE = ['new', 'screening', 'shortlisted', 'shared']

// The progress line under each application. `shared` is set the moment you
// apply (the resume is delivered to the employer straight away), so it sits on
// the second step, which reads "Sent" until the employer opens the profile and
// "Viewed" after — Shortlisted is only reached when the employer shortlists.
const stepLabels = (app) => ['Applied', app.employerViewedOn ? 'Viewed' : 'Sent', 'Shortlisted', 'Interview', 'Decision']
const STEP_OF = { new: 0, screening: 1, shared: 1, shortlisted: 2, interview: 3, selected: 4 }

const TABS = [
  { key: 'all', label: 'All', match: () => true },
  { key: 'active', label: 'In progress', match: (s) => WITHDRAWABLE.includes(s) },
  { key: 'interview', label: 'Interview', match: (s) => s === 'interview' },
  { key: 'selected', label: 'Selected', match: (s) => s === 'selected' },
  { key: 'closed', label: 'Closed', match: (s) => s === 'rejected' || s === 'withdrawn' },
]

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
const dateTimeFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
const fmtDate = (d) => (d ? dateFmt.format(new Date(d)) : '')

function StatusBadge({ status, viewed }) {
  const s = STATUS[status === 'shared' && viewed ? 'viewed' : status] ?? { label: status, tone: 'neutral' }
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${TONE[s.tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />
      {s.label}
    </span>
  )
}

// Furthest step this application has actually reached, from its history.
function reachedStep(app) {
  const seen = [app.status, ...(app.statusHistory ?? []).map((h) => h.status)]
  return Math.max(0, ...seen.map((s) => STEP_OF[s] ?? 0))
}

function Progress({ app }) {
  const reached = reachedStep(app)
  const closed = app.status === 'rejected' || app.status === 'withdrawn'
  return (
    <ol className="mt-4 flex items-center" aria-label="Application progress">
      {stepLabels(app).map((label, i, steps) => {
        const current = !closed && i === reached
        const done = i < reached || (closed && i === reached)
        return (
          <li key={label} className="flex min-w-0 flex-1 items-center last:flex-none">
            <span className="flex flex-col items-center gap-1">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${
                  done ? (closed ? 'bg-[#9AA3AF]' : 'bg-mz-primary') : current ? 'bg-white ring-2 ring-mz-primary' : 'bg-white ring-2 ring-mz-line'
                }`}
                aria-hidden="true"
              >
                {done && <Check size={11} strokeWidth={3.5} />}
                {current && <span className="h-2 w-2 rounded-full bg-mz-primary" />}
              </span>
              <span className={`whitespace-nowrap text-[11px] ${current ? 'font-bold text-mz-primary-strong' : done ? 'font-medium text-mz-ink-2' : 'text-mz-muted'}`}>
                {label}
                <span className="sr-only">{current ? ' (current stage)' : done ? ' (reached)' : ' (not reached yet)'}</span>
              </span>
            </span>
            {i < steps.length - 1 && <span className={`mx-1 mb-4 h-0.5 flex-1 rounded ${i < reached ? (closed ? 'bg-[#C9CED6]' : 'bg-mz-primary') : 'bg-mz-line'}`} aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

// The plan check failed, so we can't tell which tracking features to show.
function PlanCheckError({ onRetry }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[12px] border border-dashed border-mz-line-strong bg-white px-6 py-12 text-center">
      <SearchX size={24} className="text-mz-muted" aria-hidden="true" />
      <p className="text-[15px] font-semibold text-mz-ink">Couldn’t load this page</p>
      <p className="max-w-sm text-[14px] text-mz-muted">Check your connection and try again.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mz-btn-teal mt-2 inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-mz-primary px-4 text-[13.5px] font-semibold text-white hover:bg-mz-primary-strong"
      >
        <RotateCw size={14} aria-hidden="true" /> Retry
      </button>
    </div>
  )
}

// Shown on a rejected application: the decision, then feedback if a Mzobs reviewer has approved any.
function RejectionNote({ app, token }) {
  return (
    <div role="note" className="mt-4 rounded-[10px] border border-[#FDE2DF] bg-[#FEF6F5] px-3.5 py-3">
      <p className="text-[13px] font-semibold text-[#B42318]">Not selected</p>
      <ApplicationFeedback app={app} token={token} />
    </div>
  )
}

function ApplicationCard({ app, token, onWithdraw, withdrawing }) {
  const [showHistory, setShowHistory] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const job = app.job
  const company = job?.company?.name ?? ''
  const history = [...(app.statusHistory ?? []), ...(app.employerViewedOn ? [{ status: 'viewed', changedOn: app.employerViewedOn }] : [])].sort(
    (a, b) => new Date(b.changedOn) - new Date(a.changedOn)
  )
  const meta = [
    { icon: MapPin, text: job?.location?.split(',')[0] },
    { icon: Monitor, text: job?.workMode },
  ].filter((m) => m.text)

  return (
    <li className="rounded-[14px] border border-mz-line bg-white p-4 shadow-[0_1px_2px_rgba(22,50,79,0.05)] transition-[border-color,box-shadow] duration-200 focus-within:border-mz-primary/40 hover:border-mz-line-strong hover:shadow-[0_6px_18px_-10px_rgba(22,50,79,0.28)] motion-reduce:transition-none sm:p-5">
      <div className="flex items-start gap-3.5">
        <CompanyLogo name={company || job?.title || '?'} logo={job?.company?.logo} size={44} className="rounded-[10px]" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
            <div className="min-w-0">
              <h3 className="text-[16px] font-semibold leading-snug text-mz-ink">
                {job ? (
                  <Link to={`/jobs/${job.id}`} className="rounded-[4px] hover:text-mz-primary-strong hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary">
                    {job.title}
                  </Link>
                ) : (
                  'This job is no longer listed'
                )}
              </h3>
              {company && <p className="mt-0.5 text-[13.5px] text-mz-ink-2">{company}</p>}
            </div>
            <StatusBadge status={app.status} viewed={!!app.employerViewedOn} />
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-mz-muted">
            {meta.map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5">
                <Icon size={13.5} aria-hidden="true" />
                {text}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13.5} aria-hidden="true" />
              Applied {fmtDate(app.appliedOn)}
            </span>
          </p>
        </div>
      </div>

      <Progress app={app} />

      {app.status === 'rejected' && <RejectionNote app={app} token={token} />}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-mz-line pt-3">
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          aria-expanded={showHistory}
          className="inline-flex items-center gap-1 rounded-[8px] text-[13px] font-semibold text-mz-ink-2 hover:text-mz-ink focus-visible:outline-2 focus-visible:outline-mz-primary"
        >
          Status history
          <ChevronDown size={14} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>

        {WITHDRAWABLE.includes(app.status) &&
          (confirming ? (
            <span className="flex items-center gap-2 text-[13px]">
              <span className="text-mz-muted">Withdraw this application?</span>
              <button type="button" onClick={() => setConfirming(false)} className="rounded-[8px] px-2.5 py-1.5 font-semibold text-mz-ink-2 hover:bg-mz-bg">
                Keep
              </button>
              <button
                type="button"
                disabled={withdrawing}
                onClick={() => onWithdraw(app.id)}
                className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#B42318] px-3 py-1.5 font-semibold text-white hover:bg-[#912018] disabled:opacity-60"
              >
                {withdrawing && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
                Withdraw
              </button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="rounded-[8px] px-2 py-1 text-[13px] font-semibold text-mz-muted hover:text-[#B42318]">
              Withdraw
            </button>
          ))}
      </div>

      {showHistory && (
        <ul className="mt-3 space-y-2 rounded-[10px] bg-mz-bg p-3">
          {history.length === 0 ? (
            <li className="text-[13px] text-mz-muted">Applied on {fmtDate(app.appliedOn)}. No updates yet.</li>
          ) : (
            history.map((h, i) => (
              <li key={`${h.status}-${h.changedOn}-${i}`} className="flex items-center justify-between gap-3 text-[13px]">
                <span className="font-medium text-mz-ink">{STATUS[h.status]?.label ?? h.status}</span>
                {app.historyLocked ? (
                  <span className="inline-flex items-center gap-1 text-mz-muted">
                    <Lock size={11} aria-hidden="true" /> Date with Premium
                  </span>
                ) : (
                  <span className="text-mz-muted">{fmtDate(h.changedOn)}</span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </li>
  )
}

// Employer-scheduled interviews (upcoming first) plus the latest MZOBS mock
// interview, both straight from the API — the section says so plainly when
// there's nothing scheduled.
function InterviewsSection({ interviews, mock, status }) {
  const now = Date.now()
  const upcoming = (interviews ?? []).filter((iv) => new Date(iv.when).getTime() >= now && !['Cancelled', 'Completed'].includes(iv.status))
  const past = (interviews ?? []).filter((iv) => !upcoming.includes(iv)).reverse().slice(0, 3)
  const mockShown = mock && mock.status && mock.status !== 'not_scheduled'

  return (
    <section id="interviews" aria-labelledby="interviews-title" className="scroll-mt-24 rounded-[14px] border border-mz-line bg-white p-4 shadow-[0_1px_2px_rgba(22,50,79,0.05)] sm:p-5">
      <h2 id="interviews-title" className="flex items-center gap-2.5 text-[17px] font-bold tracking-[-0.01em] text-mz-ink">
        <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-mz-primary-tint text-mz-primary-strong">
          <CalendarClock size={16} aria-hidden="true" />
        </span>
        Interviews
      </h2>
      {status === 'loading' ? (
        <div className="mt-3 space-y-2" aria-hidden="true">
          <div className="mz-skeleton h-4 w-2/3 rounded" />
          <div className="mz-skeleton h-4 w-1/2 rounded" />
        </div>
      ) : status === 'error' ? (
        <p className="mt-2 text-[13.5px] text-mz-muted">Interviews couldn’t be loaded right now.</p>
      ) : (
        <>
          {upcoming.length === 0 && past.length === 0 && !mockShown && (
            <p className="mt-3 rounded-[10px] bg-mz-bg px-4 py-3 text-[13.5px] leading-relaxed text-mz-muted ring-1 ring-mz-line">
              Nothing scheduled yet. When an employer or the Mzobs team schedules an interview with you, the time, mode and joining details show up here.
            </p>
          )}
          {(upcoming.length > 0 || past.length > 0) && (
            <ul className="mt-3 divide-y divide-mz-line rounded-[10px] border border-mz-line px-3.5">
              {[...upcoming, ...past].map((iv) => {
                const isUpcoming = upcoming.includes(iv)
                return (
                  <li key={iv.id} className="flex items-start gap-3 py-3.5">
                    <CompanyLogo name={iv.company || iv.role} logo={iv.logo} size={36} className="rounded-[8px]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14.5px] font-semibold text-mz-ink">
                        {iv.role}
                        {iv.round && <span className="font-normal text-mz-muted"> · {iv.round}</span>}
                      </p>
                      <p className="text-[13px] text-mz-ink-2">{iv.company}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-mz-muted">
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock size={13} aria-hidden="true" />
                          {dateTimeFmt.format(new Date(iv.when))}
                          {iv.duration ? ` · ${iv.duration} min` : ''}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          {iv.mode === 'Video Call' ? <Video size={13} aria-hidden="true" /> : <Building2 size={13} aria-hidden="true" />}
                          {iv.mode === 'On-site' && iv.location ? iv.location : iv.mode}
                        </span>
                        <span>{iv.status}</span>
                      </p>
                    </div>
                    {isUpcoming && iv.mode === 'Video Call' && iv.link && (
                      <a
                        href={iv.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mz-btn-teal inline-flex shrink-0 items-center gap-1 rounded-[8px] bg-mz-primary px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-mz-primary-strong"
                      >
                        Join <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
          {mockShown && <MockInterview mock={mock} />}
        </>
      )}
    </section>
  )
}

const MOCK_STATUS = { scheduled: 'Scheduled', completed: 'Completed', no_show: 'Missed' }
const SCORE_LABELS = { comm: 'Communication', domain: 'Domain knowledge', attitude: 'Attitude', overall: 'Overall' }

function MockInterview({ mock }) {
  const scores = Object.entries(SCORE_LABELS).filter(([k]) => mock.scores?.[k] != null)
  return (
    <div className="mt-4 rounded-[10px] bg-mz-bg p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[14px] font-semibold text-mz-ink">Mzobs mock interview</p>
        <span className="text-[12.5px] font-semibold text-mz-primary-strong">{MOCK_STATUS[mock.status] ?? mock.status}</span>
      </div>
      {mock.status === 'scheduled' && mock.when && (
        <p className="mt-1 text-[13px] text-mz-ink-2">
          {dateTimeFmt.format(new Date(mock.when))}
          {mock.mode ? ` · ${mock.mode}` : ''}
          {mock.panel ? ` · with ${mock.panel}${mock.panelRole ? ` (${mock.panelRole})` : ''}` : ''}
          {mock.link && (
            <>
              {' · '}
              <a href={mock.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-mz-primary-strong hover:underline">
                Joining link
              </a>
            </>
          )}
        </p>
      )}
      {scores.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {scores.map(([k, label]) => (
            <div key={k} className="rounded-[8px] bg-white px-3 py-2 ring-1 ring-mz-line">
              <dt className="text-[11.5px] text-mz-muted">{label}</dt>
              <dd className="text-[15px] font-bold text-mz-ink tabular-nums">
                {mock.scores[k]}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {mock.feedback?.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {mock.feedback.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] leading-snug text-mz-ink-2">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${f.tone === 'good' ? 'bg-[#1E7B45]' : 'bg-[#B54708]'}`} aria-hidden="true" />
              {f.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// /employees/applications — the signed-in candidate's applications and
// interviews, all live from the employee API. Replaces the old dashboard
// app's /app/applications and Interview Center, which no longer exist.
export default function EmployeeApplications() {
  const navigate = useNavigate()
  const toast = useToast()
  const [token, setToken] = useState(null)
  const [apps, setApps] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('loading')
  const [loadingMore, setLoadingMore] = useState(false)
  const [retry, setRetry] = useState(0)
  const [tab, setTab] = useState('all')
  const [withdrawingId, setWithdrawingId] = useState(null)
  // null = still checking the plan, 'error' = couldn't check. Only the dated timeline is Premium; the server enforces that.
  const [paid, setPaid] = useState(null)
  const [stage, setStage] = useState(2)
  const [interviews, setInterviews] = useState({ status: 'loading', list: null, mock: null })

  useEffect(() => {
    const session = getEmployeeSession()
    if (!session?.token) {
      navigate(SIGN_IN_TO, { replace: true })
      return
    }
    setToken(session.token)
  }, [navigate])

  const signInAgainIfExpired = useCallback(
    (err) => {
      if (err?.status === 401) navigate(SIGN_IN_TO, { replace: true })
    },
    [navigate]
  )

  useEffect(() => {
    if (!token) return
    let cancelled = false
    setPaid(null)
    getEmployeeProfile(token)
      .then((profile) => !cancelled && setPaid(profile?.subscription?.status === 'paid'))
      .catch((err) => {
        if (cancelled) return
        signInAgainIfExpired(err)
        setPaid('error')
      })
    return () => {
      cancelled = true
    }
  }, [token, retry, signInAgainIfExpired])

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()
    setStatus('loading')
    fetchApplications(token, { page: 1, limit: PAGE_SIZE }, { signal: controller.signal })
      .then(({ applications, total: t }) => {
        setApps(applications)
        setTotal(t)
        setPage(1)
        setStatus('ready')
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        signInAgainIfExpired(err)
        setStatus('error')
      })
    return () => controller.abort()
  }, [token, retry, signInAgainIfExpired])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    Promise.allSettled([fetchInterviews(token), fetchMockInterview(token)]).then(([iv, mock]) => {
      if (cancelled) return
      if (iv.status === 'rejected' && mock.status === 'rejected') return setInterviews({ status: 'error', list: null, mock: null })
      setInterviews({ status: 'ready', list: iv.status === 'fulfilled' ? iv.value : [], mock: mock.status === 'fulfilled' ? mock.value : null })
    })
    return () => {
      cancelled = true
    }
  }, [token, retry])

  async function loadMore() {
    setLoadingMore(true)
    try {
      const { applications } = await fetchApplications(token, { page: page + 1, limit: PAGE_SIZE })
      setApps((prev) => [...prev, ...applications.filter((a) => !prev.some((p) => p.id === a.id))])
      setPage((p) => p + 1)
    } catch {
      toast('Couldn’t load more applications. Please try again.', { tone: 'info' })
    } finally {
      setLoadingMore(false)
    }
  }

  async function handleWithdraw(id) {
    setWithdrawingId(id)
    try {
      const updated = await withdrawApplication(token, id)
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: updated.status, statusHistory: updated.statusHistory } : a)))
      toast('Application withdrawn', { tone: 'success' })
    } catch (err) {
      toast(err.message, { tone: 'info' })
    } finally {
      setWithdrawingId(null)
    }
  }

  const counts = useMemo(() => Object.fromEntries(TABS.map((t) => [t.key, apps.filter((a) => t.match(a.status)).length])), [apps])
  const visible = apps.filter((a) => TABS.find((t) => t.key === tab).match(a.status))

  return (
    <div className="mz-home min-h-screen bg-mz-bg font-sans text-mz-ink antialiased">
      <Seo path="/employees/applications" title="My applications | Mzobs" noindex />
      <Navbar />
      <main className="pb-14 pt-[88px] sm:pt-[96px]">
        <Container className="max-w-[1040px]">
          {paid === null ? (
            <div className="space-y-3" aria-busy="true" aria-label="Loading">
              <div className="mz-skeleton h-8 w-72 rounded" />
              <div className="mz-skeleton h-72 w-full rounded-[14px]" />
            </div>
          ) : paid === 'error' ? (
            <PlanCheckError onRetry={() => setRetry((n) => n + 1)} />
          ) : (
            <div className="space-y-6">
              <PageIntro paid={paid} />
              <div id="journey" className="scroll-mt-24 space-y-4">
                <JourneyWorkspace apps={apps} paid={paid} selected={stage} onSelect={setStage} />
                <NextMove selected={stage} onSelect={setStage} paid={paid} />
              </div>

              <InterviewsSection interviews={interviews.list} mock={interviews.mock} status={interviews.status} />

              <section id="applications" aria-labelledby="applications-title" className="scroll-mt-24">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 id="applications-title" className="text-[17px] font-bold tracking-[-0.01em] text-mz-ink">Your applications</h2>
                    <p className="mt-0.5 text-[13.5px] text-mz-muted">
                      {status === 'ready' ? `${total} ${total === 1 ? 'application' : 'applications'} · live from your account` : 'Live from your account'}
                    </p>
                  </div>
                  <Link to="/#latest-jobs" className="group inline-flex items-center gap-1 text-[14px] font-semibold text-mz-primary-strong hover:underline underline-offset-4">
                    Browse jobs <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
            {status === 'ready' && apps.length > 0 && (
              <div className="mz-scroll-x mz-fade-end -mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <div className="flex min-w-max gap-1.5 border-b border-mz-line" role="group" aria-label="Filter applications by status">
                  {TABS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTab(t.key)}
                      aria-pressed={tab === t.key}
                      className={`-mb-px shrink-0 border-b-2 px-2.5 pb-2.5 pt-1 text-[13.5px] font-medium transition-colors ${
                        tab === t.key ? 'border-mz-primary text-mz-primary-strong' : 'border-transparent text-mz-muted hover:text-mz-ink'
                      }`}
                    >
                      {t.label} <span className="text-[12px] tabular-nums text-mz-muted">{counts[t.key]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              {status === 'loading' ? (
                <ul className="space-y-3" aria-busy="true" aria-label="Loading applications">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <li key={i} className="rounded-[12px] border border-mz-line bg-white p-5" aria-hidden="true">
                      <div className="flex gap-3.5">
                        <div className="mz-skeleton h-11 w-11 rounded-[10px]" />
                        <div className="flex-1 space-y-2.5">
                          <div className="mz-skeleton h-4 w-1/2 rounded" />
                          <div className="mz-skeleton h-3 w-1/3 rounded" />
                        </div>
                      </div>
                      <div className="mz-skeleton mt-5 h-5 w-full rounded" />
                    </li>
                  ))}
                </ul>
              ) : status === 'error' ? (
                <div className="flex flex-col items-center gap-2 rounded-[12px] border border-dashed border-mz-line-strong bg-white px-6 py-12 text-center">
                  <SearchX size={24} className="text-mz-muted" aria-hidden="true" />
                  <p className="text-[15px] font-semibold text-mz-ink">Couldn’t load your applications</p>
                  <p className="max-w-sm text-[14px] text-mz-muted">Check your connection and try again.</p>
                  <button
                    type="button"
                    onClick={() => setRetry((n) => n + 1)}
                    className="mz-btn-teal mt-2 inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-mz-primary px-4 text-[13.5px] font-semibold text-white hover:bg-mz-primary-strong"
                  >
                    <RotateCw size={14} aria-hidden="true" /> Retry
                  </button>
                </div>
              ) : apps.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-[12px] border border-dashed border-mz-line-strong bg-white px-6 py-12 text-center">
                  <p className="text-[15px] font-semibold text-mz-ink">You haven’t applied to any jobs yet</p>
                  <p className="max-w-sm text-[14px] text-mz-muted">When you apply, each application and its progress show up here.</p>
                  <Link
                    to="/#latest-jobs"
                    className="mz-btn-teal mt-2 inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-mz-primary px-4 text-[13.5px] font-semibold text-white hover:bg-mz-primary-strong"
                  >
                    Find jobs <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              ) : visible.length === 0 ? (
                <p className="rounded-[12px] border border-mz-line bg-white px-5 py-8 text-center text-[14px] text-mz-muted">No applications in this group.</p>
              ) : (
                <ul className="space-y-3">
                  {visible.map((app) => (
                    <ApplicationCard key={app.id} app={app} token={token} onWithdraw={handleWithdraw} withdrawing={withdrawingId === app.id} />
                  ))}
                </ul>
              )}

              {status === 'ready' && apps.length < total && (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-mz-line-strong bg-white px-5 text-[14px] font-semibold text-mz-ink hover:border-mz-primary hover:text-mz-primary-strong disabled:opacity-60"
                  >
                    {loadingMore && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
                    {loadingMore ? 'Loading…' : `Show ${total - apps.length} more`}
                  </button>
                </div>
              )}
            </div>
              </section>

              <PremiumValue paid={paid} hasApps={apps.length > 0} />
              {!paid && (
                <ConversionBand
                  onContinue={() => document.getElementById('journey')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })}
                />
              )}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  )
}
