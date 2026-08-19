import { useNavigate } from 'react-router-dom'
import {
  Users,
  FileCheck,
  Video,
  Building2,
  Briefcase,
  ClipboardList,
  Send,
  IndianRupee,
  ArrowRight,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Bar from '../../components/ui/Bar'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'
import { HBarList } from '../../components/ui/Charts'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useDashboardQuery } from '../../hooks/useDashboard'
import { useResumeQueueQuery } from '../../hooks/useResumes'
import { useCompaniesQuery } from '../../hooks/useCompanies'
import { useJobsQuery } from '../../hooks/useJobs'
import { useBatchesQuery } from '../../hooks/useBatches'
import { fmtINR } from '../../lib/utils'

const KPI_ICONS = { candidates: Users, resumeQueue: FileCheck, mockQueue: Video, companyQueue: Building2, openings: Briefcase, applications: ClipboardList }
const KPI_LABELS = { candidates: 'Candidates', resumeQueue: 'Resumes to verify', mockQueue: 'Mocks scheduled', companyQueue: 'Companies pending', openings: 'Open positions', applications: 'Applications' }

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: dash, isLoading: dashLoading, isError: dashError, refetch: refetchDash } = useDashboardQuery()
  const { data: pendingResumes = [] } = useResumeQueueQuery({ status: 'pending', limit: 3 })
  const { data: pendingCompanies = [] } = useCompaniesQuery({ status: 'pending', limit: 4 })
  const { data: pendingJobs = [] } = useJobsQuery({ status: 'pending_review', limit: 4 })
  const { data: buildingBatches = [] } = useBatchesQuery({ status: 'preparing', limit: 3 })

  if (dashLoading) return <PageSkeleton />
  if (dashError) return <ErrorState onRetry={refetchDash} />

  const kpis = dash.kpis ?? {}
  const revenue = dash.revenue ?? {}

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mzobs Operations</h1>
          <p className="text-sm text-ink-secondary mt-1">Everything moving between candidates and employers passes through this desk.</p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Button onClick={() => navigate('/app/resumes')}>
            <FileCheck size={15} /> Verification queue
          </Button>
          <Button variant="primary" onClick={() => navigate('/app/dispatch')}>
            <Send size={15} /> Dispatch resumes
          </Button>
        </div>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
        {Object.entries(kpis).map(([key, value]) => {
          const Icon = KPI_ICONS[key] ?? Briefcase
          return (
            <Card key={key} hover pad>
              <Icon size={15} className="text-navy" />
              <div className="text-[26px] font-bold tracking-tight mt-2.5">
                <CountUp value={value} />
              </div>
              <div className="text-xs text-ink-tertiary mt-1 leading-snug">{KPI_LABELS[key] ?? key}</div>
            </Card>
          )
        })}
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-4 gap-5 mb-4">
        <QueueCard
          icon={FileCheck}
          tone="gold"
          title="Resumes to verify"
          count={kpis.resumeQueue ?? 0}
          onOpen={() => navigate('/app/resumes')}
          rows={pendingResumes.slice(0, 3).map((c) => ({
            key: c.id,
            initials: c.name?.slice(0, 2)?.toUpperCase(),
            primary: c.name,
            secondary: c.resume?.uploadedOn ? `Uploaded ${new Date(c.resume.uploadedOn).toLocaleDateString('en-IN')}` : '',
          }))}
        />
        <QueueCard
          icon={Building2}
          tone="navy"
          title="Companies to verify"
          count={kpis.companyQueue ?? 0}
          onOpen={() => navigate('/app/companies')}
          rows={pendingCompanies.map((co) => ({ key: co.id, initials: co.logo, primary: co.name, secondary: co.hq }))}
        />
        <QueueCard
          icon={Briefcase}
          tone="violet"
          title="Requirements to review"
          count={pendingJobs.length}
          onOpen={() => navigate('/app/requirements')}
          rows={pendingJobs.map((j) => ({ key: j.id, initials: j.company?.logo, primary: j.title, secondary: `${j.vacancies} opening${j.vacancies > 1 ? 's' : ''}` }))}
        />
        <QueueCard
          icon={Send}
          tone="teal"
          title="Batches in progress"
          count={buildingBatches.length}
          onOpen={() => navigate('/app/dispatch')}
          rows={buildingBatches.map((b) => ({ key: b.id, initials: b.company?.logo, primary: b.jobTitle, secondary: `${b.resumesDelivered}/${b.resumesPromised} delivered` }))}
        />
      </StaggerItem>

      {revenue.outstanding > 0 && (
        <StaggerItem className="mb-4">
          <Card pad className="flex items-start gap-3 border-gold-dot/40 bg-gold-tint">
            <AlertTriangle size={18} className="text-gold-strong mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold">{fmtINR(revenue.outstanding)} outstanding across employer invoices</div>
              <div className="text-[13px] text-ink-secondary mt-0.5">Sourcing stays on hold until the employer pays.</div>
            </div>
            <Button size="sm" onClick={() => navigate('/app/payments')}>
              View payments
            </Button>
          </Card>
        </StaggerItem>
      )}

      <StaggerItem className="grid lg:grid-cols-2 gap-5 mb-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Candidate pipeline</span>
            <span className="text-xs text-ink-tertiary">Registered → Selected</span>
          </CardHead>
          <div className="p-[22px] pt-4">
            <HBarList data={dash.funnel ?? []} />
          </div>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Skill tracks</span>
          </CardHead>
          <div className="p-[22px] pt-4">
            {(dash.tracks ?? []).length === 0 ? (
              <p className="text-[13px] text-ink-secondary">No skill tracks assigned yet.</p>
            ) : (
              <HBarList data={dash.tracks} tone="navy" />
            )}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-3 gap-5 mb-4">
        <Card pad className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-3">
            <IndianRupee size={14} className="text-gold-strong" /> Collected from employers
          </div>
          <div className="text-[30px] font-bold tracking-tight text-gold-strong">
            <CountUp value={revenue.collected ?? 0} prefix="₹" />
          </div>
          <div className="text-[13px] text-ink-secondary mt-2">{fmtINR(revenue.outstanding ?? 0)} still outstanding</div>
          <Bar value={revenue.collected ? Math.round((revenue.collected / (revenue.collected + revenue.outstanding)) * 100) : 0} tone="gold" thin className="mt-3" />
        </Card>
        <Card pad className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-3">
            <Users size={14} className="text-navy" /> Candidate subscriptions
          </div>
          <div className="text-[30px] font-bold tracking-tight text-navy">
            <CountUp value={revenue.subscriptions ?? 0} prefix="₹" />
          </div>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Mock interviews scheduled</span>
            <span className="text-navy font-semibold text-[13px] cursor-pointer hover:underline" onClick={() => navigate('/app/mock-interviews')}>
              View all
            </span>
          </CardHead>
          <div className="p-[22px] pt-3.5 flex flex-col gap-3">
            {(dash.upcomingMockInterviews ?? []).length === 0 && <p className="text-[13px] text-ink-secondary">Nothing scheduled.</p>}
            {(dash.upcomingMockInterviews ?? []).slice(0, 3).map((iv) => (
              <div key={iv.id} className="flex items-center gap-3 p-3 border border-border rounded-xl">
                <Avatar initials={iv.employee?.name?.slice(0, 2)?.toUpperCase()} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold truncate">{iv.employee?.name}</div>
                  <div className="text-xs text-ink-tertiary mt-1 flex items-center gap-1">
                    <Clock size={12} /> {iv.when ? new Date(iv.when).toLocaleString('en-IN') : ''} · Panel {iv.panel}
                  </div>
                </div>
                <Badge tone="gold">Scheduled</Badge>
              </div>
            ))}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="mb-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Recent activity</span>
          </CardHead>
          <div className="p-[22px] pt-4">
            {(dash.activity ?? []).length === 0 ? (
              <p className="text-[13px] text-ink-secondary">No activity yet.</p>
            ) : (
              <div className="relative pl-[26px]">
                <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />
                {dash.activity.map((a, i, arr) => (
                  <div key={i} className={i < arr.length - 1 ? 'pb-5 relative' : 'relative'}>
                    <div
                      className={`absolute -left-[26px] top-0.5 w-[11px] h-[11px] rounded-full bg-surface border-2 ${
                        a.tone === 'green' ? 'border-green-dot' : a.tone === 'gold' ? 'border-gold-dot' : 'border-navy'
                      }`}
                    />
                    <div className="text-[13px]">{a.text}</div>
                    <div className="text-xs text-ink-tertiary mt-0.5">{a.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card pad>
          <div className="text-[15px] font-semibold mb-3">Quick actions</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Button onClick={() => navigate('/app/candidates')}>
              <Users size={15} /> Candidates
            </Button>
            <Button onClick={() => navigate('/app/companies')}>
              <Building2 size={15} /> Companies
            </Button>
            <Button onClick={() => navigate('/app/applications')}>
              <ClipboardList size={15} /> Applications
            </Button>
            <Button onClick={() => navigate('/app/payments')}>
              <ArrowRight size={15} /> Payments
            </Button>
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}

const QUEUE_TONES = {
  gold: 'bg-gold-tint text-gold-strong',
  navy: 'bg-navy-tint text-navy',
  violet: 'bg-violet-tint text-violet',
  teal: 'bg-teal-tint text-teal',
}

function QueueCard({ icon: Icon, tone, title, count, rows, onOpen }) {
  return (
    <Card pad className="flex flex-col">
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${QUEUE_TONES[tone]}`}>
          <Icon size={17} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold truncate">{title}</div>
          <div className="text-xs text-ink-tertiary">{count} waiting</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-3.5 flex-1">
        {rows.length === 0 ? (
          <div className="text-[12.5px] text-ink-tertiary py-2">Queue is clear.</div>
        ) : (
          rows.map((r) => (
            <div key={r.key} className="flex items-center gap-2.5 text-left rounded-lg px-1.5 py-1.5 -mx-1.5">
              <Avatar initials={r.initials} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold truncate">{r.primary}</div>
                <div className="text-[11px] text-ink-tertiary truncate">{r.secondary}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <button onClick={onOpen} className="text-navy font-semibold text-[12.5px] cursor-pointer hover:underline mt-3 text-left">
        Open queue →
      </button>
    </Card>
  )
}
