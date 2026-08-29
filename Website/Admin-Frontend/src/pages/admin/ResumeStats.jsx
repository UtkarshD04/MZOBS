import { useMemo } from 'react'
import { FileCheck } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'
import EmptyState from '../../components/ui/EmptyState'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useResumeStatsQuery } from '../../hooks/useResumes'

const RESUME_STAGES = [
  { key: 'pending', label: 'Pending', tone: 'gold' },
  { key: 'verified', label: 'Verified', tone: 'green' },
  { key: 'changes', label: 'Changes', tone: 'navy' },
  { key: 'rejected', label: 'Rejected', tone: 'red' },
]

export default function ResumeStats() {
  const { data: stats, isLoading, isError, refetch } = useResumeStatsQuery()
  const perStaff = stats?.perStaff ?? []

  const totalAssigned = useMemo(() => perStaff.reduce((n, s) => n + s.total, 0), [perStaff])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Resume Stats</h1>
        <p className="text-sm text-ink-secondary mt-1">How many resumes each HR has, and at what stage.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Total resumes</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={stats?.total ?? 0} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Pending review</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-gold-strong">
            <CountUp value={stats?.pending ?? 0} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Verified</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-green">
            <CountUp value={stats?.verified ?? 0} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Unassigned</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-red">
            <CountUp value={stats?.unassigned ?? 0} />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        {perStaff.length === 0 ? (
          <Card>
            <EmptyState icon={FileCheck} title="No resumes assigned to HR yet" body="Transfer resumes to HR from the Resumes queue to see the breakdown here." />
          </Card>
        ) : (
          <Card>
            <TableWrap className="border-none rounded-none">
              <Table columns={['HR', 'Pending', 'Verified', 'Changes', 'Rejected', 'Total']}>
                {perStaff.map((s) => (
                  <Tr key={s.staffId}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={s.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                        <div>
                          <div className="text-[13px] font-semibold">{s.name}</div>
                          <div className="text-[11px] text-ink-tertiary">{s.email}</div>
                        </div>
                      </div>
                    </Td>
                    {RESUME_STAGES.map((stage) => (
                      <Td key={stage.key}>
                        {s[stage.key] > 0 ? (
                          <Badge tone={stage.tone} dot={false}>
                            {s[stage.key]}
                          </Badge>
                        ) : (
                          <span className="text-ink-tertiary">—</span>
                        )}
                      </Td>
                    ))}
                    <Td className="font-bold">{s.total}</Td>
                  </Tr>
                ))}
              </Table>
            </TableWrap>
          </Card>
        )}
      </StaggerItem>

      {totalAssigned < (stats?.total ?? 0) && (
        <StaggerItem className="mt-3">
          <p className="text-[12.5px] text-ink-tertiary">{(stats?.total ?? 0) - totalAssigned} resume(s) not yet assigned to any HR.</p>
        </StaggerItem>
      )}
    </StaggerGroup>
  )
}
