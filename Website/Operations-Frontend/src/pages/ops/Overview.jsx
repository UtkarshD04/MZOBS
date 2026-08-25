import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Inbox, Contact, Building2, Briefcase, ArrowRight } from 'lucide-react'
import Card from '../../components/ui/Card'
import CountUp from '../../components/ui/CountUp'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useDashboardQuery } from '../../hooks/useDashboard'
import { useCompaniesQuery } from '../../hooks/useCompanies'

export default function Overview() {
  const navigate = useNavigate()
  const { data: dash, isLoading: dashLoading, isError: dashError, refetch: refetchDash } = useDashboardQuery()
  const { data: companies = [], isLoading: coLoading, isError: coError, refetch: refetchCo } = useCompaniesQuery({})

  const hrContactCount = useMemo(() => companies.reduce((n, co) => n + (co.hiringContacts?.length ?? 0), 0), [companies])
  const verifiedCompanies = useMemo(() => companies.filter((co) => co.verificationStatus === 'verified').length, [companies])

  if (dashLoading || coLoading) return <PageSkeleton />
  if (dashError || coError) return <ErrorState onRetry={() => (dashError ? refetchDash() : refetchCo())} />

  const kpis = dash?.kpis ?? {}
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
      hint: 'Hiring contacts across every registered company',
      cls: 'text-navy',
    },
    {
      to: '/app/companies',
      icon: Building2,
      label: 'Verified companies',
      value: verifiedCompanies,
      hint: `${kpis.companyQueue ?? 0} pending verification`,
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

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-ink-secondary mt-1">Everything that lands on the operations desk, at a glance.</p>
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
    </StaggerGroup>
  )
}
