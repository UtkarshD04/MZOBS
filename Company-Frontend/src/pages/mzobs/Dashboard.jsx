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
import AreaLineChart, { HBarList } from '../../components/ui/Charts'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../context/AppContext'
import { openBatchDrawer, openCandidateDrawer, openCompanyDrawer, openReviewJobModal, openVerifyResumeModal } from '../../lib/mzobsModals'
import {
  ACTIVITY,
  BATCHES,
  CANDIDATES,
  COMPANIES,
  JOB_POSTS,
  MOCK_INTERVIEWS,
  MZOBS_USER,
  OPS_KPIS,
  PIPELINE_FUNNEL,
  PRICING,
  REVENUE_TREND,
  TRACK_SPLIT,
  candidateOf,
  companyOf,
  jobOf,
} from '../../lib/mzobsData'
import { fmtINR } from '../../lib/utils'

const KPI_ICONS = {
  candidates: Users,
  resumeQueue: FileCheck,
  mockQueue: Video,
  companyQueue: Building2,
  openings: Briefcase,
  applications: ClipboardList,
}

function renderRich(text) {
  return { __html: text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const app = useApp()

  const pendingResumes = CANDIDATES.filter((c) => c.resume.status === 'pending')
  const pendingCompanies = COMPANIES.filter((c) => c.status === 'pending')
  const pendingJobs = JOB_POSTS.filter((j) => j.status === 'pending_review')
  const unpaidJobs = JOB_POSTS.filter((j) => j.feeStatus === 'unpaid' && j.status !== 'pending_review')
  const readyBatches = BATCHES.filter((b) => b.status === 'ready' || b.status === 'building')

  const collected = JOB_POSTS.filter((j) => j.feeStatus === 'paid').reduce((n, j) => n + j.fee, 0)
  const outstanding = unpaidJobs.reduce((n, j) => n + j.fee, 0)
  const subsRevenue = CANDIDATES.filter((c) => c.subscription.status === 'paid').length * PRICING.candidateFee

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good afternoon, {MZOBS_USER.name.split(' ')[0]}</h1>
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
        {Object.entries(OPS_KPIS).map(([key, k]) => {
          const Icon = KPI_ICONS[key]
          return (
            <Card key={key} hover pad>
              <Icon size={15} className="text-navy" />
              <div className="text-[26px] font-bold tracking-tight mt-2.5">
                <CountUp value={k.value} />
              </div>
              <div className="text-xs text-ink-tertiary mt-1 leading-snug">{k.label}</div>
              <div className="text-[11px] font-semibold text-gold-strong mt-1.5">{k.delta}</div>
            </Card>
          )
        })}
      </StaggerItem>

      {/* Action queues — the whole point of this portal */}
      <StaggerItem className="grid lg:grid-cols-4 gap-5 mb-4">
        <QueueCard
          icon={FileCheck}
          tone="gold"
          title="Resumes to verify"
          count={pendingResumes.length}
          onOpen={() => navigate('/app/resumes')}
          rows={pendingResumes.slice(0, 3).map((c) => ({
            key: c.id,
            initials: c.initials,
            primary: c.name,
            secondary: `Uploaded ${c.resume.uploadedOn}`,
            action: () => openVerifyResumeModal(app, c),
          }))}
        />
        <QueueCard
          icon={Building2}
          tone="navy"
          title="Companies to verify"
          count={pendingCompanies.length}
          onOpen={() => navigate('/app/companies')}
          rows={pendingCompanies.map((co) => ({
            key: co.id,
            initials: co.logo,
            primary: co.name,
            secondary: `Registered ${co.registeredOn}`,
            action: () => openCompanyDrawer(app, co),
          }))}
        />
        <QueueCard
          icon={Briefcase}
          tone="violet"
          title="Requirements to review"
          count={pendingJobs.length}
          onOpen={() => navigate('/app/requirements')}
          rows={pendingJobs.map((j) => ({
            key: j.id,
            initials: companyOf(j.companyId).logo,
            primary: j.title,
            secondary: `${j.openings} openings · ${fmtINR(j.openings * PRICING.perOpeningFee)}`,
            action: () => openReviewJobModal(app, j),
          }))}
        />
        <QueueCard
          icon={Send}
          tone="teal"
          title="Batches in progress"
          count={readyBatches.length}
          onOpen={() => navigate('/app/dispatch')}
          rows={readyBatches.slice(0, 3).map((b) => ({
            key: b.id,
            initials: companyOf(b.companyId).logo,
            primary: jobOf(b.jobId).title,
            secondary: `${b.interviewsScheduled}/${b.resumeCount} resumes locked`,
            action: () => openBatchDrawer(app, b),
          }))}
        />
      </StaggerItem>

      {outstanding > 0 && (
        <StaggerItem className="mb-4">
          <Card pad className="flex items-start gap-3 border-gold-dot/40 bg-gold-tint">
            <AlertTriangle size={18} className="text-gold-strong mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold">{fmtINR(outstanding)} outstanding across {unpaidJobs.length} requirement{unpaidJobs.length > 1 ? 's' : ''}</div>
              <div className="text-[13px] text-ink-secondary mt-0.5">
                Sourcing stays on hold until the employer pays. We ship resumes only after the {fmtINR(PRICING.perOpeningFee)}-per-opening invoice clears.
              </div>
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
            <span className="text-xs text-ink-tertiary">Signup → selected</span>
          </CardHead>
          <div className="p-[22px] pt-4">
            <HBarList data={PIPELINE_FUNNEL} />
            <p className="text-xs text-ink-tertiary mt-4 pt-4 border-t border-border">
              <b className="text-ink">68%</b> of registrations convert to the ₹{PRICING.candidateFee} programme, and <b className="text-ink">65%</b> of those clear resume verification.
            </p>
          </div>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Revenue</span>
            <span className="text-xs text-ink-tertiary">Last 6 months</span>
          </CardHead>
          <div className="px-[10px] pt-4 pb-2">
            <AreaLineChart data={REVENUE_TREND} height={216} formatValue={(v) => fmtINR(v)} />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-3 gap-5 mb-4">
        <Card pad className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-3">
            <IndianRupee size={14} className="text-gold-strong" /> Collected from employers
          </div>
          <div className="text-[30px] font-bold tracking-tight text-gold-strong">
            <CountUp value={collected} prefix="₹" />
          </div>
          <div className="text-[13px] text-ink-secondary mt-2">
            {fmtINR(outstanding)} still outstanding
          </div>
          <Bar value={Math.round((collected / (collected + outstanding)) * 100)} tone="gold" thin className="mt-3" />
        </Card>
        <Card pad className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-3">
            <Users size={14} className="text-navy" /> Candidate subscriptions
          </div>
          <div className="text-[30px] font-bold tracking-tight text-navy">
            <CountUp value={subsRevenue} prefix="₹" />
          </div>
          <div className="text-[13px] text-ink-secondary mt-2">
            {CANDIDATES.filter((c) => c.subscription.status === 'paid').length} paid × ₹{PRICING.candidateFee} · {CANDIDATES.filter((c) => c.subscription.status === 'unpaid').length} still unpaid
          </div>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Skill tracks</span>
          </CardHead>
          <div className="p-[22px] pt-4">
            <HBarList data={TRACK_SPLIT} tone="navy" />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-[1.4fr_1fr] gap-5 mb-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Mock interviews scheduled</span>
            <span className="text-navy font-semibold text-[13px] cursor-pointer hover:underline" onClick={() => navigate('/app/mock-interviews')}>
              View all
            </span>
          </CardHead>
          <div className="p-[22px] pt-3.5 flex flex-col gap-3">
            {MOCK_INTERVIEWS.map((iv) => {
              const c = candidateOf(iv.candidateId)
              return (
                <div key={iv.id} className="flex items-center gap-3 p-3 border border-border rounded-xl">
                  <Avatar initials={c.initials} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[15px] font-semibold truncate">{c.name}</span>
                      <Badge tone={iv.status === 'Confirmed' ? 'gold' : 'gray'}>{iv.status === 'Confirmed' ? iv.when.split(',')[0] : 'Pending'}</Badge>
                    </div>
                    <div className="text-xs text-ink-tertiary mt-1 flex items-center gap-1">
                      <Clock size={12} /> {iv.when} · Panel {iv.panel}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => openCandidateDrawer(app, c)}>
                    Open
                  </Button>
                </div>
              )
            })}
          </div>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Recent activity</span>
          </CardHead>
          <div className="p-[22px] pt-4">
            <div className="relative pl-[26px]">
              <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />
              {ACTIVITY.map((a, i, arr) => (
                <div key={a.text} className={i < arr.length - 1 ? 'pb-5 relative' : 'relative'}>
                  <div
                    className={`absolute -left-[26px] top-0.5 w-[11px] h-[11px] rounded-full bg-surface border-2 ${
                      a.tone === 'green'
                        ? 'border-green-dot'
                        : a.tone === 'gold'
                          ? 'border-gold-dot'
                          : a.tone === 'red'
                            ? 'border-red-dot'
                            : a.tone === 'teal'
                              ? 'border-teal-dot'
                              : 'border-navy'
                    }`}
                  />
                  <div className="text-[13px]" dangerouslySetInnerHTML={renderRich(a.text)} />
                  <div className="text-xs text-ink-tertiary mt-0.5">{a.time}</div>
                </div>
              ))}
            </div>
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
            <button key={r.key} onClick={r.action} className="flex items-center gap-2.5 text-left rounded-lg px-1.5 py-1.5 -mx-1.5 hover:bg-surface-hover cursor-pointer">
              <Avatar initials={r.initials} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold truncate">{r.primary}</div>
                <div className="text-[11px] text-ink-tertiary truncate">{r.secondary}</div>
              </div>
            </button>
          ))
        )}
      </div>

      <button onClick={onOpen} className="text-navy font-semibold text-[12.5px] cursor-pointer hover:underline mt-3 text-left">
        Open queue →
      </button>
    </Card>
  )
}
