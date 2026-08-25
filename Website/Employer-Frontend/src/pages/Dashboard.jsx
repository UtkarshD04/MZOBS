import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Users,
  UserCheck,
  CalendarCheck,
  FileCheck,
  UserPlus,
  ArrowUpRight,
  Plus,
  ClipboardList,
  CreditCard,
  Video,
  MapPin,
  Package,
  ShieldAlert,
} from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { PageSkeleton } from '../components/ui/Skeleton'
import Avatar from '../components/ui/Avatar'
import { InterviewStatusBadge } from '../components/ui/StatusBadge'
import FunnelChart from '../components/charts/FunnelChart'
import TrendChart from '../components/charts/TrendChart'
import DepartmentBarChart from '../components/charts/DepartmentBarChart'
import { useDashboardQuery } from '../hooks/useDashboard'
import { useCompanyQuery } from '../hooks/useCompany'
import { useMeQuery } from '../hooks/useMe'
import { PRICING } from '../lib/pricing'
import { cn, fmtDateTime, fmtINR } from '../lib/utils'

export default function Dashboard() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useDashboardQuery()
  const { data: company, isLoading: companyLoading } = useCompanyQuery()
  const { data: me, isLoading: meLoading } = useMeQuery()

  if (isLoading || companyLoading || meLoading) return <PageSkeleton />
  if (isError || !data || !company || !me) return <ErrorState onRetry={() => refetch()} />

  const { stats, funnel, trend, departments, activity, upcomingInterviews } = data

  const cards = [
    { key: 'requirements', label: 'Open Requirements', value: stats.openRequirements, delta: stats.openRequirementsDelta, icon: Briefcase, tone: 'navy' },
    { key: 'openings', label: 'Openings Paid For', value: stats.openingsPaid, delta: stats.openingsPaidDelta, icon: ClipboardList, tone: 'violet' },
    { key: 'resumes', label: 'Resumes from Mzobs', value: stats.resumesReceived, delta: stats.resumesReceivedDelta, icon: Users, tone: 'teal' },
    { key: 'interviews', label: 'Interviews Scheduled', value: stats.interviewsScheduled, delta: stats.interviewsDelta, icon: CalendarCheck, tone: 'gold' },
    { key: 'offers', label: 'Offers Sent', value: stats.offersSent, delta: stats.offersDelta, icon: FileCheck, tone: 'amber' },
    { key: 'joined', label: 'Employees Joined', value: stats.employeesJoined, delta: stats.employeesJoinedDelta, icon: UserPlus, tone: 'green' },
  ]

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${me.name.split(' ')[0]}`}
        subtitle={`Here's how hiring at ${company.name} is progressing this week.`}
        actions={
          <>
            <Button variant="secondary" size="md" onClick={() => navigate('/candidates')}>
              <UserCheck size={16} /> Review Profiles
            </Button>
            <Button variant="primary" size="md" onClick={() => navigate('/jobs/new')}>
              <Plus size={16} /> New Requirement
            </Button>
          </>
        }
      />

      {company.verificationStatus !== 'verified' && (
        <Card pad className="mb-5 flex items-start gap-3 border-amber/40" style={{ background: 'var(--color-amber-tint)' }}>
          <span className="w-9 h-9 rounded-[10px] bg-surface text-amber flex items-center justify-center flex-shrink-0">
            <ShieldAlert size={17} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold">Your company is still being verified by Mzobs</div>
            <p className="text-[13px] text-ink-secondary mt-0.5">
              You can draft requirements, but Mzobs will not publish them to candidates until your GSTIN and PAN checks clear.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/company')}>
            View status
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-6 gap-4 mb-5 max-xl:grid-cols-3 max-md:grid-cols-2">
        {cards.map((c, i) => (
          <motion.div key={c.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <Card hover pad className="h-full">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-3" style={toneStyle(c.tone)}>
                <c.icon size={17} />
              </div>
              <div className="text-[12px] text-ink-secondary font-medium mb-1">{c.label}</div>
              <div className="text-[24px] font-bold tracking-tight tabular-nums">{c.value}</div>
              <div className="text-[11.5px] text-ink-tertiary mt-1">{c.delta}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5 max-xl:grid-cols-1">
        <Card className="col-span-2 max-xl:col-span-1">
          <CardHead>
            <CardTitle>Fulfilment Funnel</CardTitle>
            <span className="text-[12px] text-ink-tertiary">Openings paid → hires made</span>
          </CardHead>
          <CardBody>
            <FunnelChart data={funnel} />
          </CardBody>
        </Card>

        <Card>
          <CardHead>
            <CardTitle>Quick Actions</CardTitle>
          </CardHead>
          <CardBody className="flex flex-col gap-2.5">
            <QuickAction icon={Plus} label="Raise a requirement" sub={`${fmtINR(PRICING.perOpeningFee)} per opening`} onClick={() => navigate('/jobs/new')} />
            <QuickAction icon={Package} label="Track resume batches" sub={`${stats.resumesReceived} profiles delivered`} onClick={() => navigate('/batches')} />
            <QuickAction icon={CalendarCheck} label="Schedule interviews" sub="Coordinate with your panel" onClick={() => navigate('/interviews')} />
            <QuickAction icon={CreditCard} label="Billing & invoices" sub={`${company.openingsPurchased} openings billed`} onClick={() => navigate('/billing')} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5 max-xl:grid-cols-1">
        <Card className="col-span-2 max-xl:col-span-1">
          <CardHead>
            <CardTitle>Hiring Analytics</CardTitle>
            <span className="text-[12px] text-ink-tertiary">Hires per month</span>
          </CardHead>
          <CardBody>
            <TrendChart data={trend} />
          </CardBody>
        </Card>
        <Card>
          <CardHead>
            <CardTitle>Open Roles by Department</CardTitle>
          </CardHead>
          <CardBody>
            <DepartmentBarChart data={departments} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-1">
        <Card className="col-span-2 max-xl:col-span-1">
          <CardHead>
            <CardTitle>Recent Activity</CardTitle>
          </CardHead>
          {activity.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No recent activity" body="Updates about your jobs and candidates will appear here." />
          ) : (
            <div>
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-[22px] py-3.5 border-b border-border last:border-b-0">
                  <span className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', a.tone === 'green' ? 'bg-green-dot' : a.tone === 'gold' ? 'bg-gold-dot' : 'bg-navy')} />
                  <div className="min-w-0">
                    <div className="text-[13px] leading-snug">{a.text}</div>
                    <div className="text-[11.5px] text-ink-tertiary mt-1">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHead>
            <CardTitle>Upcoming Interviews</CardTitle>
            <button onClick={() => navigate('/interviews')} className="text-[12px] font-semibold text-navy flex items-center gap-0.5 hover:underline">
              View all <ArrowUpRight size={12} />
            </button>
          </CardHead>
          {upcomingInterviews.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="No interviews scheduled" body="Interviews you schedule with shared candidates will show up here." />
          ) : (
            <div>
              {upcomingInterviews.map((iv) => (
                <div key={iv.id} className="flex items-center gap-3 px-[22px] py-3.5 border-b border-border last:border-b-0">
                  <Avatar initials={iv.initials} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold truncate">{iv.candidateName}</div>
                    <div className="text-[11.5px] text-ink-tertiary truncate flex items-center gap-1 mt-0.5">
                      {iv.mode === 'On-site' ? <MapPin size={11} /> : <Video size={11} />}
                      {fmtDateTime(iv.startsAt)}
                    </div>
                  </div>
                  <InterviewStatusBadge status={iv.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function toneStyle(tone) {
  const map = {
    navy: { bg: 'var(--color-navy-tint)', fg: 'var(--color-navy)' },
    gold: { bg: 'var(--color-gold-tint)', fg: 'var(--color-gold-strong)' },
    green: { bg: 'var(--color-green-tint)', fg: 'var(--color-green)' },
    violet: { bg: 'var(--color-violet-tint)', fg: 'var(--color-violet)' },
    teal: { bg: 'var(--color-teal-tint)', fg: 'var(--color-teal)' },
    amber: { bg: 'var(--color-amber-tint)', fg: 'var(--color-amber)' },
  }
  return { background: map[tone].bg, color: map[tone].fg }
}

function QuickAction({ icon: Icon, label, sub, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-border hover:border-navy hover:bg-navy-tint/40 transition-colors text-left group">
      <span className="w-9 h-9 rounded-[10px] bg-surface-sunken text-navy flex items-center justify-center flex-shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold truncate">{label}</span>
        <span className="block text-[11.5px] text-ink-tertiary truncate">{sub}</span>
      </span>
    </button>
  )
}
