import { useEffect, useState } from 'react'
import { ErrorState, ListSkeleton, Panel, fmtDate } from './rc'
import { apiMessage, getJobInsights } from '../services/recruiterService'

function Metric({ label, value, sub, title }) {
  return (
    <div title={title}>
      <p className="text-[11.5px] font-semibold text-muted">{label}</p>
      <p className="num text-[22px] font-extrabold leading-tight tracking-[-0.02em]">{value ?? '—'}</p>
      {sub && <p className="text-[11.5px] text-muted">{sub}</p>}
    </div>
  )
}

const conv = (c) => (c.percent == null ? { value: '—', sub: 'Not enough data yet' } : { value: `${c.percent}%`, sub: `${c.numerator} of ${c.denominator}` })

// Only stored figures. A number that cannot be known (no views tracked, no moves recorded) is shown as "—" with the reason.
export default function JobInsights({ jobId }) {
  const [d, setD] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    setD(null)
    setError('')
    getJobInsights(jobId).then(setD).catch((e) => setError(apiMessage(e, 'Could not load insights.')))
  }, [jobId])
  if (error) return <ErrorState message={error} />
  if (!d) return <ListSkeleton rows={2} />
  const ic = conv(d.interviewConversion)
  const oc = conv(d.offerConversion)
  const maxDays = Math.max(1, ...d.timeInStage.map((t) => t.avgDays ?? 0))
  const staged = d.timeInStage.filter((t) => !['hired', 'rejected'].includes(t.stage))
  return (
    <Panel title="Job insights">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
        <Metric label="Page views" value={d.views.count} sub={d.views.since ? `Counted since ${fmtDate(d.views.since)}` : 'Not tracked yet'} />
        <Metric label="Applications" value={d.applications} />
        <Metric label="Qualified" value={d.qualified.count} sub={d.qualified.count == null ? 'Needs skills on the job' : 'Meets skills + experience'} title={d.qualified.rule} />
        <Metric label="Shortlisted" value={d.shortlisted} />
        <Metric label="Interview conversion" value={ic.value} sub={ic.sub} title="Interviewed ÷ shortlisted" />
        <Metric label="Offer conversion" value={oc.value} sub={oc.sub} title="Offered ÷ interviewed" />
      </div>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.04em] text-ink-2">Average time in each stage</p>
          <ul className="space-y-1.5">
            {staged.map((t) => (
              <li key={t.stage} className="grid grid-cols-[88px_1fr_96px] items-center gap-2 text-[12.5px]">
                <span className="text-ink-2">{t.label}</span>
                <span className="h-2 rounded-sm bg-line-2">{t.avgDays != null && <span className="block h-2 rounded-sm bg-accent" style={{ width: `${Math.max(3, (t.avgDays / maxDays) * 100)}%` }} />}</span>
                <span className="num text-right text-muted">{t.avgDays != null ? `${t.avgDays} d · n=${t.samples}` : 'no data'}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11.5px] text-muted">From recorded stage moves only; earlier moves weren’t timed.</p>
        </div>
        <div>
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.04em] text-ink-2">Where applicants came from</p>
          {d.sources.length === 0 ? <p className="text-[12.5px] text-muted">No applicants yet.</p> : (
            <ul className="space-y-1 text-[13px]">{d.sources.map((s) => <li key={s.source} className="flex justify-between"><span>{s.source}</span><span className="num font-semibold">{s.count}</span></li>)}</ul>
          )}
        </div>
      </div>
    </Panel>
  )
}
