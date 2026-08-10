import { Send, Package, CheckCircle2, ArrowRight } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Bar from '../../components/ui/Bar'
import CountUp from '../../components/ui/CountUp'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../context/AppContext'
import { openBatchDrawer } from '../../lib/mzobsModals'
import { BATCHES, BATCH_STATUS, PRICING, companyOf, jobOf } from '../../lib/mzobsData'
import { fmtINR } from '../../lib/utils'

export default function Dispatch() {
  const app = useApp()

  const active = BATCHES.filter((b) => b.status !== 'closed')
  const closed = BATCHES.filter((b) => b.status === 'closed')

  const resumesShipped = BATCHES.filter((b) => b.sentOn).reduce((n, b) => n + b.resumeCount, 0)
  const hiresMade = BATCHES.reduce((n, b) => n + b.selected, 0)

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Resume Dispatch</h1>
        <p className="text-sm text-ink-secondary mt-1">
          The hand-off point. For every opening an employer pays for, we ship {PRICING.resumesPerOpening} shortlisted resumes and they pick their hires
          from that set.
        </p>
      </StaggerItem>

      <StaggerItem className="mb-5">
        <Card pad>
          <div className="text-[13.5px] font-semibold mb-3.5">How a batch is built</div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              ['Employer pays', `${fmtINR(PRICING.perOpeningFee)} × openings`],
              ['We shortlist', `${PRICING.resumesPerOpening}× the openings`],
              ['Batch dispatched', 'Employer sees names for the first time'],
              ['Candidate notified', '"Interview scheduled" on their portal'],
              ['Employer selects', 'Final hires confirmed'],
            ].map(([title, sub], i, arr) => (
              <div key={title} className="flex items-center gap-2">
                <div className="rounded-xl border border-border bg-surface-sunken px-3.5 py-2.5 min-w-[150px]">
                  <div className="text-[12.5px] font-semibold">{title}</div>
                  <div className="text-[11px] text-ink-tertiary mt-0.5">{sub}</div>
                </div>
                {i < arr.length - 1 && <ArrowRight size={15} className="text-ink-tertiary flex-shrink-0 max-lg:hidden" />}
              </div>
            ))}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          ['Active batches', active.length, 'text-navy'],
          ['Resumes shipped', resumesShipped, 'text-teal'],
          ['Hires confirmed', hiresMade, 'text-green'],
          ['Batches closed', closed.length, 'text-gold-strong'],
        ].map(([label, val, cls]) => (
          <Card key={label} hover pad>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${cls}`}>
              <CountUp value={val} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="mb-4">
        <div className="text-xl font-bold mb-3">Active batches</div>
        {active.length === 0 ? (
          <Card>
            <EmptyState icon={Package} title="No batches in progress" body="Batches open up once an employer's invoice is marked paid." />
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {active.map((b) => (
              <BatchCard key={b.id} batch={b} app={app} />
            ))}
          </div>
        )}
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Closed batches</span>
          </CardHead>
          <div className="p-[22px] flex flex-col gap-3">
            {closed.map((b) => {
              const job = jobOf(b.jobId)
              const co = companyOf(b.companyId)
              return (
                <div key={b.id} className="flex items-center gap-3 p-3 border border-border rounded-xl flex-wrap">
                  <div className="w-9 h-9 rounded-[10px] bg-green-tint text-green flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={17} />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="text-[13.5px] font-semibold">
                      {job.title} · {co.name}
                    </div>
                    <div className="text-xs text-ink-tertiary mt-0.5">
                      {b.id} · {b.resumeCount} resumes sent {b.sentOn} · {b.selected} of {b.openings} openings filled
                    </div>
                  </div>
                  <Badge tone="green">{Math.round((b.selected / b.openings) * 100)}% filled</Badge>
                </div>
              )
            })}
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}

function BatchCard({ batch: b, app }) {
  const job = jobOf(b.jobId)
  const co = companyOf(b.companyId)
  const st = BATCH_STATUS[b.status]
  const fill = Math.round((b.interviewsScheduled / b.resumeCount) * 100)
  const ready = b.status === 'ready'

  return (
    <Card pad>
      <div className="flex items-start gap-4 flex-wrap">
        <div className="w-11 h-11 rounded-[11px] bg-navy-tint text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">{co.logo}</div>
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-semibold">{job.title}</span>
            <Badge tone={st.tone}>{st.label}</Badge>
          </div>
          <div className="text-[13px] text-ink-secondary mt-1">
            {co.name} · {b.id} · {job.location}
          </div>
          <p className="text-[12.5px] text-ink-tertiary mt-2">{b.note}</p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 min-w-[280px]">
          <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
            <div className="text-[11px] text-ink-tertiary">Openings</div>
            <div className="text-[17px] font-bold tracking-tight mt-0.5">{b.openings}</div>
          </div>
          <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
            <div className="text-[11px] text-ink-tertiary">Resumes owed</div>
            <div className="text-[17px] font-bold tracking-tight mt-0.5">{b.resumeCount}</div>
          </div>
          <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
            <div className="text-[11px] text-ink-tertiary">Locked</div>
            <div className="text-[17px] font-bold tracking-tight mt-0.5">{b.interviewsScheduled}</div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[12px] mb-1.5">
          <span className="text-ink-secondary">Batch fill</span>
          <span className="font-semibold">{fill}%</span>
        </div>
        <Bar value={fill} tone={fill === 100 ? 'green' : 'navy'} thin />
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-border flex-wrap">
        <Button variant={ready ? 'primary' : 'secondary'} size="sm" onClick={() => openBatchDrawer(app, b)}>
          {ready ? (
            <>
              <Send size={14} /> Dispatch to {co.name}
            </>
          ) : (
            'Build batch'
          )}
        </Button>
        <span className="text-[12.5px] text-ink-tertiary">
          {b.resumeCount - b.interviewsScheduled > 0
            ? `${b.resumeCount - b.interviewsScheduled} more profiles needed`
            : 'All profiles locked and ready'}
        </span>
      </div>
    </Card>
  )
}
