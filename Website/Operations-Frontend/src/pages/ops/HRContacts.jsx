import { useMemo, useState } from 'react'
import { Contact, Search, Mail, FileText } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useTeamQuery } from '../../hooks/useTeam'
import { useResumeStatsQuery } from '../../hooks/useResumes'

const RESUME_STAGES = [
  { key: 'pending', label: 'Pending', tone: 'gold' },
  { key: 'verified', label: 'Verified', tone: 'green' },
  { key: 'changes', label: 'Changes', tone: 'navy' },
  { key: 'rejected', label: 'Rejected', tone: 'red' },
]

export default function HRContacts() {
  const [query, setQuery] = useState('')
  const { data: team = [], isLoading, isError, refetch } = useTeamQuery()
  const { data: resumeStats } = useResumeStatsQuery()

  const hrList = useMemo(() => team.filter((m) => m.accessLevel !== 'admin'), [team])

  const statsByStaff = useMemo(() => {
    const map = new Map()
    for (const row of resumeStats?.perStaff ?? []) map.set(row.staffId, row)
    return map
  }, [resumeStats])

  const filtered = useMemo(() => {
    if (!query) return hrList
    const q = query.toLowerCase()
    return hrList.filter((m) => `${m.name} ${m.email} ${m.role}`.toLowerCase().includes(q))
  }, [hrList, query])

  const totalResumesAssigned = useMemo(
    () => hrList.reduce((sum, m) => sum + (statsByStaff.get(m.id)?.total ?? 0), 0),
    [hrList, statsByStaff]
  )

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">HR Contacts</h1>
        <p className="text-sm text-ink-secondary mt-1">Every HR in MZOBS, with their resume workload.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 gap-4 mb-5">
        {[
          ['HR contacts', hrList.length, 'text-navy'],
          ['Resumes assigned', totalResumesAssigned, 'text-green'],
        ].map(([label, val, cls]) => (
          <Card key={label} hover pad>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${cls}`}>
              <CountUp value={val} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="flex items-center justify-end mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, role"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={Contact} title="No HR contacts here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((m) => {
              const stat = statsByStaff.get(m.id)
              return (
                <Card key={m.id} hover pad>
                  <div className="flex items-start gap-3">
                    <Avatar initials={m.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-semibold truncate">{m.name}</div>
                      <div className="text-[13px] text-ink-secondary mt-0.5">{m.role}</div>
                    </div>
                    <Badge tone={m.status === 'active' ? 'green' : m.status === 'disabled' ? 'red' : 'gold'}>
                      {m.status === 'active' ? 'Active' : m.status === 'disabled' ? 'Disabled' : 'Invited'}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-3.5 text-xs text-ink-tertiary">
                    {m.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={12} /> {m.email}
                      </span>
                    )}
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-[12.5px] font-semibold mb-1.5">
                      <FileText size={13} className="text-ink-tertiary" />
                      Resumes {stat?.total ? `(${stat.total})` : ''}
                    </div>
                    {stat && stat.total > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {RESUME_STAGES.filter((s) => stat[s.key] > 0).map((s) => (
                          <Badge key={s.key} tone={s.tone} dot={false}>
                            {s.label} {stat[s.key]}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-ink-tertiary text-[12.5px]">No resumes assigned</span>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
