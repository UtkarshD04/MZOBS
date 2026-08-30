import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Inbox, Contact, Building2, Briefcase, ArrowRight, Users, AlertTriangle, UserCog } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import CountUp from '../../components/ui/CountUp'
import { HBarList } from '../../components/ui/Charts'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useDashboardQuery } from '../../hooks/useDashboard'
import { useCompaniesQuery } from '../../hooks/useCompanies'
import { useTeamQuery } from '../../hooks/useTeam'
import { useResumeStatsQuery } from '../../hooks/useResumes'

export default function Overview() {
  const navigate = useNavigate()
  const { data: dash, isLoading: dashLoading, isError: dashError, refetch: refetchDash } = useDashboardQuery()
  const { data: companies = [], isLoading: coLoading, isError: coError, refetch: refetchCo } = useCompaniesQuery({})
  const { data: team = [] } = useTeamQuery({})
  const { data: resumeStats } = useResumeStatsQuery()

  const hrContactCount = useMemo(() => team.filter((m) => m.accessLevel !== 'admin').length, [team])
  const verifiedCompanies = useMemo(() => companies.filter((co) => co.verificationStatus === 'verified').length, [companies])

  if (dashLoading || coLoading) return <PageSkeleton />
  if (dashError || coError) return <ErrorState onRetry={() => (dashError ? refetchDash() : refetchCo())} />

  const kpis = dash?.kpis ?? {}
  const revenue = dash?.revenue ?? {}
  const cards = [
    {
      to: '/app/resumes',
      icon: Inbox,
      label: 'Resumes waiting',
      value: kpis.resumeQueue ?? 0,
      hint: 'Subscribed candidates with a resume pending review',
      cls: 'text-gold-strong',
    },
    {
      to: '/app/hr-contacts',
      icon: Contact,
      label: 'HR contacts',
      value: hrContactCount,
      hint: 'HR staff accounts at MZOBS',
      cls: 'text-navy',
    },
    {
      to: '/app/companies',
      icon: Building2,
      label: 'Companies',
      value: kpis.companies ?? verifiedCompanies,
      hint: `${verifiedCompanies} verified · ${kpis.companyQueue ?? 0} pending your approval`,
      cls: 'text-green',
    },
    {
      to: '/app/requirements',
      icon: Briefcase,
      label: 'Open requirements',
      value: kpis.openings ?? 0,
      hint: 'Openings raised by verified employers',
      cls: 'text-teal',
    },
  ]

  const funnel = dash?.funnel ?? []
  const perStaff = resumeStats?.perStaff ?? []

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-ink-secondary mt-1">Everything Mzobs runs on — companies, payments, HR and candidates — at a glance.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ to, icon: Icon, label, value, hint, cls }) => (
          <Card key={label} hover pad className="cursor-pointer" onClick={() => navigate(to)}>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
              <Icon size={16} className={cls} />
            </div>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${cls}`}>
              <CountUp value={value} />
            </div>
            <p className="text-[12px] text-ink-tertiary mt-1.5">{hint}</p>
            <div className="flex items-center gap-1 text-[12px] font-semibold text-navy mt-3">
              View <ArrowRight size={12} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card hover pad className="cursor-pointer" onClick={() => navigate('/app/payments')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Employer revenue</span>
            <Building2 size={15} className="text-navy" />
          </div>
          <div className="text-[26px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={revenue.collected ?? 0} prefix="₹" />
          </div>
        </Card>
        <Card hover pad className="cursor-pointer" onClick={() => navigate('/app/payments')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Subscription revenue</span>
            <Users size={15} className="text-gold-strong" />
          </div>
          <div className="text-[26px] font-bold tracking-tight mt-2 text-gold-strong">
            <CountUp value={revenue.subscriptions ?? 0} prefix="₹" />
          </div>
          <p className="text-[12px] text-ink-tertiary mt-1.5">{kpis.subscribedCandidates ?? 0} candidates paid</p>
        </Card>
        <Card hover pad className="cursor-pointer" onClick={() => navigate('/app/payments')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Outstanding</span>
            <AlertTriangle size={15} className="text-red" />
          </div>
          <div className="text-[26px] font-bold tracking-tight mt-2 text-red">
            <CountUp value={revenue.outstanding ?? 0} prefix="₹" />
          </div>
        </Card>
        <Card hover pad className="cursor-pointer" onClick={() => navigate('/app/team')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Employers &amp; staff</span>
            <UserCog size={15} className="text-teal" />
          </div>
          <div className="text-[26px] font-bold tracking-tight mt-2">
            <CountUp value={kpis.employers ?? 0} />
          </div>
          <p className="text-[12px] text-ink-tertiary mt-1.5">{kpis.staff ?? 0} operations/HR accounts</p>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-2 gap-5 mt-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Candidate pipeline</span>
            <span className="text-xs text-ink-tertiary">Registered → Selected</span>
          </CardHead>
          <div className="p-[22px] pt-4">
            {funnel.length === 0 ? <p className="text-[13px] text-ink-secondary">No candidates yet.</p> : <HBarList data={funnel} />}
          </div>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Resumes by HR</span>
            <span className="text-navy font-semibold text-[13px] cursor-pointer hover:underline" onClick={() => navigate('/app/team')}>
              Manage team
            </span>
          </CardHead>
          <div className="p-[22px] pt-4 flex flex-col gap-3">
            {perStaff.length === 0 ? (
              <p className="text-[13px] text-ink-secondary">No resumes assigned to HR yet — transfer some from the Resumes queue.</p>
            ) : (
              perStaff.map((s) => (
                <div key={s.staffId} className="flex items-center gap-3 p-3 border border-border rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{s.name}</div>
                    <div className="text-xs text-ink-tertiary mt-0.5">{s.total} resume(s) assigned</div>
                  </div>
                  <div className={`text-[13px] font-bold ${s.pending > 0 ? 'text-gold-strong' : 'text-ink-tertiary'}`}>{s.pending} pending</div>
                </div>
              ))
            )}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="mt-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Recent activity</span>
          </CardHead>
          <div className="p-[22px] pt-4">
            {(dash?.activity ?? []).length === 0 ? (
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
    </StaggerGroup>
  )
}
