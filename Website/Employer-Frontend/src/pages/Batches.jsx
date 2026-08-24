import { useNavigate } from 'react-router-dom'
import { ArrowRight, FileStack, Info, Package, Users } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useBatchesQuery } from '../hooks/useBatches'
import { PRICING } from '../lib/pricing'
import { fmtDate, fmtINR } from '../lib/utils'

const STATUS = {
  preparing: { label: 'Mzobs preparing', tone: 'gold' },
  delivered: { label: 'Delivered', tone: 'green' },
  closed: { label: 'Closed', tone: 'navy' },
}

const FLOW = [
  ['You raise a requirement', 'Openings + role brief'],
  ['Mzobs reviews & invoices', `${fmtINR(PRICING.perOpeningFee)} per opening`],
  ['You pay upfront', 'Sourcing begins'],
  ['Mzobs ships resumes', `${PRICING.resumesPerOpening} per opening`],
  ['You interview & select', 'Your hires, your call'],
]

export default function Batches() {
  const navigate = useNavigate()
  const { data: batches = [], isLoading, isError, refetch } = useBatchesQuery()

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  const promised = batches.reduce((n, b) => n + b.resumesPromised, 0)
  const delivered = batches.reduce((n, b) => n + b.resumesDelivered, 0)
  const selected = batches.reduce((n, b) => n + b.selected, 0)

  return (
    <div>
      <PageHeader
        title="Resume Batches"
        subtitle={`Every batch Mzobs has shipped against a paid requirement — ${PRICING.resumesPerOpening} screened profiles per opening.`}
      />

      <Card className="mb-5">
        <CardBody className="flex items-start gap-3">
          <span className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center flex-shrink-0">
            <Info size={17} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold">You never see raw applications — only screened batches</div>
            <p className="text-[13px] text-ink-secondary mt-0.5">
              Candidates apply through Mzobs, and Mzobs verifies their resume, runs a mock interview and shortlists against your brief. What lands here is
              the finished shortlist. Hiring the right number out of it is your decision.
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-3.5">
              {FLOW.map(([title, sub], i) => (
                <div key={title} className="flex items-center gap-2">
                  <div className="rounded-xl border border-border bg-surface-sunken px-3 py-2 min-w-[140px]">
                    <div className="text-[12px] font-semibold">{title}</div>
                    <div className="text-[11px] text-ink-tertiary mt-0.5">{sub}</div>
                  </div>
                  {i < FLOW.length - 1 && <ArrowRight size={14} className="text-ink-tertiary flex-shrink-0 max-xl:hidden" />}
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-3 gap-4 mb-5 max-md:grid-cols-1">
        <StatMini icon={Package} label="Resumes owed" value={promised} />
        <StatMini icon={FileStack} label="Resumes delivered" value={delivered} />
        <StatMini icon={Users} label="Candidates selected" value={selected} />
      </div>

      {batches.length === 0 ? (
        <Card>
          <EmptyState
            icon={Package}
            title="No batches yet"
            body="Once you pay for a requirement, Mzobs starts building your resume batch and it shows up here."
            action={
              <Button variant="primary" size="sm" onClick={() => navigate('/jobs/new')}>
                Raise a requirement
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {batches.map((b) => {
            const st = STATUS[b.status]
            return (
              <Card key={b.id}>
                <CardHead>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <CardTitle>{b.jobTitle}</CardTitle>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>
                  <span className="text-[12px] text-ink-tertiary">
                    {b.id} · {b.deliveredOn ? `Delivered ${fmtDate(b.deliveredOn)}` : 'In progress'}
                  </span>
                </CardHead>
                <CardBody>
                  <div className="grid grid-cols-4 gap-3 mb-4 max-md:grid-cols-2">
                    {[
                      ['Openings', b.openings],
                      ['Fee paid', fmtINR(b.openings * PRICING.perOpeningFee)],
                      ['Resumes owed', b.resumesPromised],
                      ['Selected', `${b.selected} / ${b.openings}`],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-surface-sunken px-3.5 py-3">
                        <div className="text-[11.5px] text-ink-tertiary">{label}</div>
                        <div className="text-[17px] font-bold tracking-tight tabular-nums mt-0.5">{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[13px] mb-2">
                    <span className="font-medium">Resumes delivered</span>
                    <span className="text-ink-secondary tabular-nums">
                      {b.resumesDelivered} / {b.resumesPromised}
                    </span>
                  </div>
                  <ProgressBar value={b.resumesDelivered} max={b.resumesPromised} tone={b.resumesDelivered === b.resumesPromised ? 'green' : 'gold'} />
                  <p className="text-[12.5px] text-ink-secondary mt-3">{b.note}</p>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <Button variant="primary" size="sm" onClick={() => navigate('/candidates')}>
                      Review profiles
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/jobs/${b.jobId}/edit`)}>
                      Open requirement
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatMini({ icon: Icon, label, value }) {
  return (
    <Card pad className="flex items-center gap-3.5">
      <span className="w-10 h-10 rounded-xl bg-navy-tint text-navy flex items-center justify-center flex-shrink-0">
        <Icon size={18} />
      </span>
      <div>
        <div className="text-[11.5px] text-ink-secondary font-medium">{label}</div>
        <div className="text-[21px] font-bold tracking-tight tabular-nums">{value}</div>
      </div>
    </Card>
  )
}
