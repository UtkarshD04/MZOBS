import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { ArrowRight, CalendarClock, ClipboardCheck, CheckCircle2 } from 'lucide-react'
import { Button, EmptyState } from '../components/ui'
import { ErrorState, ListSkeleton, PageShell, Panel, StatTile, ago, fmtDateTime } from '../components/rc'
import { getOverview, apiMessage } from '../services/recruiterService'
import { IS_DEMO } from '../lib/config'

const SEVERITY_DOT = { high: 'bg-bad', medium: 'bg-warn', low: 'bg-muted' }
const HEALTH_LABEL = { low_applications: 'Low applications', expiring: 'Closing soon', deadline_passed: 'Deadline passed', no_shortlist: 'No shortlist', feedback_pending: 'Feedback pending' }

function Attention({ items }) {
  if (items.length === 0) {
    return (
      <p className="flex items-center gap-2 px-1 py-6 text-[13.5px] text-muted">
        <CheckCircle2 size={16} className="text-ok" /> Nothing needs your attention right now.
      </p>
    )
  }
  return (
    <ul className="divide-y divide-line-2">
      {items.map((a) => (
        <li key={a.id}>
          <Link to={a.href} className="group flex items-center gap-3 px-4 py-3 hover:bg-[#faf9f6]">
            <span aria-hidden className={clsx('h-2 w-2 shrink-0 rounded-full', SEVERITY_DOT[a.severity])} />
            <span className="min-w-0 flex-1 text-[14px] font-medium text-ink">{a.text}</span>
            <ArrowRight size={15} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function Overview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const load = useCallback(() => {
    setError('')
    getOverview().then(setData).catch((e) => setError(apiMessage(e, 'Could not load your overview.')))
  }, [])
  useEffect(() => {
    if (!IS_DEMO) load()
  }, [load])

  if (IS_DEMO) {
    return (
      <PageShell title="Overview">
        <EmptyState icon={ClipboardCheck} title="Overview needs a live workspace" body="This page is built from your jobs, applicants and interviews, so it isn’t available in the demo workspace." />
      </PageShell>
    )
  }
  if (error) return <PageShell title="Overview"><ErrorState message={error} onRetry={load} /></PageShell>
  if (!data) return <PageShell title="Overview"><ListSkeleton rows={5} /></PageShell>

  const s = data.stats
  const limited = data.scope === 'limited'
  return (
    <PageShell title="Overview" sub={limited ? 'Your interviews and feedback.' : 'What needs doing today across your hiring.'} actions={!limited && <Link to="/jobs/new"><Button variant="primary" size="sm">Post a job</Button></Link>}>
      <div className={clsx('grid gap-3', limited ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-6')}>
        {!limited && <StatTile label="Active jobs" value={s.activeJobs} to="/jobs" />}
        {!limited && <StatTile label="New applicants" value={s.newApplicants} hint="Awaiting review" to="/applicants?stage=new" tone={s.newApplicants ? 'warn' : undefined} />}
        <StatTile label="Interviews today" value={s.interviewsToday} hint={`${s.interviewsWeek} this week`} to="/interviews" />
        {s.feedbackPending != null && <StatTile label="Feedback pending" value={s.feedbackPending} to="/interviews?filter=feedback" tone={s.feedbackPending ? 'warn' : undefined} />}
        {!limited && <StatTile label="Offers awaiting" value={s.offersAwaiting} to="/offers" />}
        {s.creditsRemaining != null && <StatTile label="CV credits left" value={s.creditsRemaining} to="/credits" tone={s.creditsRemaining === 0 ? 'warn' : undefined} />}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Panel title="Needs your attention" flush>
            <Attention items={data.attention} />
          </Panel>
          {!limited && (
            <Panel title="Job health" flush>
              {data.jobHealth.length === 0 ? (
                <p className="px-4 py-5 text-[13.5px] text-muted">No issues found on your live jobs.</p>
              ) : (
                <ul className="divide-y divide-line-2">
                  {data.jobHealth.map((h, i) => (
                    <li key={`${h.jobId}-${h.type}-${i}`}>
                      <Link to={`/jobs/${h.jobId}/applicants`} className="flex items-start gap-3 px-4 py-2.5 hover:bg-[#faf9f6]">
                        <span aria-hidden className={clsx('mt-1.5 h-2 w-2 shrink-0 rounded-full', SEVERITY_DOT[h.severity])} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-semibold text-ink">{h.jobTitle}</span>
                          <span className="block text-[12.5px] text-muted">{HEALTH_LABEL[h.type]}: {h.message}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}
        </div>

        <div className="space-y-4">
          {data.upcoming?.length > 0 && (
            <Panel title="Upcoming interviews" action={<Link to="/interviews" className="text-[12.5px] font-semibold text-accent hover:underline">All</Link>} flush>
              <ul className="divide-y divide-line-2">
                {data.upcoming.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 px-4 py-2.5">
                    <CalendarClock size={15} className="shrink-0 text-muted" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold">{i.candidateName}</span>
                      <span className="block truncate text-[12.5px] text-muted">{i.role} · {fmtDateTime(i.startsAt)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          <Panel title="Recent activity" flush>
            {data.activity.length === 0 ? (
              <p className="px-4 py-5 text-[13.5px] text-muted">Activity appears here as your team moves candidates, schedules interviews and sends offers.</p>
            ) : (
              <ol className="relative ml-4 border-l border-line py-2">
                {data.activity.map((a) => (
                  <li key={a.id} className="relative py-1.5 pl-4 pr-4">
                    <span aria-hidden className="absolute -left-[3.5px] top-3 h-1.5 w-1.5 rounded-full bg-[#9db0bd]" />
                    <p className="text-[13px] leading-snug text-ink">{a.text}</p>
                    <p className="text-[11.5px] text-muted">{[a.actor, ago(a.at)].filter(Boolean).join(' · ')}</p>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>
      </div>
    </PageShell>
  )
}
