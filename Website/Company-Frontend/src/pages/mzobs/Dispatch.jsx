import { useState } from 'react'
import { Send, Package, CheckCircle2, ArrowRight } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Bar from '../../components/ui/Bar'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { DrawerHead, DrawerBody, DrawerFoot } from '../../components/ui/Drawer'
import { useApp } from '../../context/AppContext'
import { useBatchesQuery, useEligibleApplicationsQuery, useDispatchBatchMutation } from '../../hooks/useBatches'
import { fmtINR } from '../../lib/utils'

const PER_OPENING_FEE = 2000
const RESUMES_PER_OPENING = 5
const BATCH_STATUS = { preparing: { label: 'Preparing', tone: 'gold' }, delivered: { label: 'Delivered', tone: 'green' }, closed: { label: 'Closed', tone: 'gray' } }

function BatchDrawer({ app, batch, onDone }) {
  const { data: eligible = [], isLoading } = useEligibleApplicationsQuery(batch.id)
  const [picked, setPicked] = useState(() => new Set())
  const dispatch = useDispatchBatchMutation()

  function toggle(id) {
    setPicked((cur) => {
      const next = new Set(cur)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function submit() {
    dispatch.mutate(
      { batchId: batch.id, applicationIds: [...picked] },
      {
        onSuccess: () => {
          app.closeSidePanel()
          app.addToast('success', `${picked.size} resumes dispatched to ${batch.company?.name}`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <DrawerHead title={`Dispatch batch — ${batch.jobTitle}`} subtitle={batch.company?.name} onClose={app.closeSidePanel} />
      <DrawerBody>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-surface-sunken rounded-xl p-3.5">
            <div className="text-xs text-ink-tertiary">Openings</div>
            <div className="text-[19px] font-bold mt-0.5">{batch.openings}</div>
          </div>
          <div className="bg-surface-sunken rounded-xl p-3.5">
            <div className="text-xs text-ink-tertiary">Resumes owed</div>
            <div className="text-[19px] font-bold mt-0.5">{batch.resumesPromised}</div>
          </div>
          <div className="bg-surface-sunken rounded-xl p-3.5">
            <div className="text-xs text-ink-tertiary">Delivered</div>
            <div className="text-[19px] font-bold mt-0.5">{batch.resumesDelivered}</div>
          </div>
        </div>

        <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-3">Eligible pool — verified resume + cleared mock</div>
        {isLoading ? (
          <p className="text-[13px] text-ink-secondary">Loading eligible candidates...</p>
        ) : eligible.length === 0 ? (
          <p className="text-[13px] text-ink-secondary">No eligible applications for this job yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {eligible.map((a) => (
              <label key={a.id} className="flex items-center gap-3 p-2.5 border border-border rounded-xl cursor-pointer hover:bg-surface-hover">
                <input type="checkbox" checked={picked.has(a.id)} onChange={() => toggle(a.id)} className="accent-navy w-[15px] h-[15px] flex-shrink-0" />
                <Avatar initials={a.employee?.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">{a.employee?.name}</div>
                  <div className="text-xs text-ink-tertiary truncate">{a.employee?.location || a.employee?.currentCity}</div>
                </div>
                <Badge tone="gold" dot={false}>
                  Fit {a.fit ?? '—'}%
                </Badge>
              </label>
            ))}
          </div>
        )}
      </DrawerBody>
      <DrawerFoot>
        <Button variant="primary" onClick={submit} disabled={dispatch.isPending || picked.size === 0}>
          <Send size={15} /> {dispatch.isPending ? 'Dispatching...' : `Dispatch ${picked.size} resumes`}
        </Button>
      </DrawerFoot>
    </>
  )
}

function BatchCard({ batch: b, app, onDone }) {
  const st = BATCH_STATUS[b.status] ?? { label: b.status, tone: 'gray' }
  const fill = b.resumesPromised ? Math.round((b.resumesDelivered / b.resumesPromised) * 100) : 0

  return (
    <Card pad>
      <div className="flex items-start gap-4 flex-wrap">
        <div className="w-11 h-11 rounded-[11px] bg-navy-tint text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">{b.company?.logo}</div>
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-semibold">{b.jobTitle}</span>
            <Badge tone={st.tone}>{st.label}</Badge>
          </div>
          <div className="text-[13px] text-ink-secondary mt-1">{b.company?.name}</div>
          {b.note && <p className="text-[12.5px] text-ink-tertiary mt-2">{b.note}</p>}
        </div>

        <div className="grid grid-cols-3 gap-2.5 min-w-[280px]">
          <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
            <div className="text-[11px] text-ink-tertiary">Openings</div>
            <div className="text-[17px] font-bold tracking-tight mt-0.5">{b.openings}</div>
          </div>
          <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
            <div className="text-[11px] text-ink-tertiary">Resumes owed</div>
            <div className="text-[17px] font-bold tracking-tight mt-0.5">{b.resumesPromised}</div>
          </div>
          <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
            <div className="text-[11px] text-ink-tertiary">Delivered</div>
            <div className="text-[17px] font-bold tracking-tight mt-0.5">{b.resumesDelivered}</div>
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
        <Button variant="primary" size="sm" onClick={() => app.openSidePanel(<BatchDrawer app={app} batch={b} onDone={onDone} />, 640)}>
          <Send size={14} /> Build & dispatch
        </Button>
        <span className="text-[12.5px] text-ink-tertiary">
          {b.resumesPromised - b.resumesDelivered > 0 ? `${b.resumesPromised - b.resumesDelivered} more profiles needed` : 'All profiles delivered'}
        </span>
      </div>
    </Card>
  )
}

export default function Dispatch() {
  const app = useApp()
  const { data: batches = [], isLoading, isError, refetch } = useBatchesQuery({})

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  const active = batches.filter((b) => b.status !== 'closed')
  const closed = batches.filter((b) => b.status === 'closed')
  const resumesShipped = batches.reduce((n, b) => n + (b.resumesDelivered ?? 0), 0)
  const hiresMade = batches.reduce((n, b) => n + (b.selected ?? 0), 0)

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Resume Dispatch</h1>
        <p className="text-sm text-ink-secondary mt-1">
          The hand-off point. For every opening an employer pays for, we ship {RESUMES_PER_OPENING} shortlisted resumes and they pick their hires from
          that set.
        </p>
      </StaggerItem>

      <StaggerItem className="mb-5">
        <Card pad>
          <div className="text-[13.5px] font-semibold mb-3.5">How a batch is built</div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              ['Employer pays', `${fmtINR(PER_OPENING_FEE)} × openings`],
              ['We shortlist', `${RESUMES_PER_OPENING}× the openings`],
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
              <BatchCard key={b.id} batch={b} app={app} onDone={refetch} />
            ))}
          </div>
        )}
      </StaggerItem>

      {closed.length > 0 && (
        <StaggerItem>
          <Card>
            <CardHead>
              <span className="text-[15px] font-semibold">Closed batches</span>
            </CardHead>
            <div className="p-[22px] flex flex-col gap-3">
              {closed.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 border border-border rounded-xl flex-wrap">
                  <div className="w-9 h-9 rounded-[10px] bg-green-tint text-green flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={17} />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="text-[13.5px] font-semibold">
                      {b.jobTitle} · {b.company?.name}
                    </div>
                    <div className="text-xs text-ink-tertiary mt-0.5">
                      {b.resumesDelivered} resumes sent · {b.selected ?? 0} of {b.openings} openings filled
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </StaggerItem>
      )}
    </StaggerGroup>
  )
}
