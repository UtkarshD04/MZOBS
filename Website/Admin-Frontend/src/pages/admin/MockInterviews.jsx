import { useMemo } from 'react'
import { Video, CheckCircle2, CalendarClock, XCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'
import EmptyState from '../../components/ui/EmptyState'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useMockInterviewStatsQuery } from '../../hooks/useMockInterviews'

export default function MockInterviews() {
  const { data: stats, isLoading, isError, refetch } = useMockInterviewStatsQuery()
  const perStaff = stats?.perStaff ?? []

  const totals = useMemo(
    () =>
      perStaff.reduce(
        (acc, s) => ({
          completed: acc.completed + (s.completed ?? 0),
          scheduled: acc.scheduled + (s.scheduled ?? 0),
          no_show: acc.no_show + (s.no_show ?? 0),
        }),
        { completed: 0, scheduled: 0, no_show: 0 }
      ),
    [perStaff]
  )

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mock Interviews</h1>
        <p className="text-sm text-ink-secondary mt-1">Which HR conducted how many mock interviews.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">HR conducting interviews</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={perStaff.length} />
          </div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Completed</span>
            <CheckCircle2 size={15} className="text-green" />
          </div>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-green">
            <CountUp value={totals.completed} />
          </div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Scheduled</span>
            <CalendarClock size={15} className="text-gold-strong" />
          </div>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-gold-strong">
            <CountUp value={totals.scheduled} />
          </div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">No-show</span>
            <XCircle size={15} className="text-red" />
          </div>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-red">
            <CountUp value={totals.no_show} />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        {perStaff.length === 0 ? (
          <Card>
            <EmptyState icon={Video} title="No mock interviews yet" body="Once HR schedules mock interviews, their tally shows up here." />
          </Card>
        ) : (
          <Card>
            <TableWrap className="border-none rounded-none">
              <Table columns={['HR', 'Completed', 'Scheduled', 'No-show', 'Total']}>
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
                    <Td>{s.completed > 0 ? <Badge tone="green" dot={false}>{s.completed}</Badge> : <span className="text-ink-tertiary">—</span>}</Td>
                    <Td>{s.scheduled > 0 ? <Badge tone="gold" dot={false}>{s.scheduled}</Badge> : <span className="text-ink-tertiary">—</span>}</Td>
                    <Td>{s.no_show > 0 ? <Badge tone="red" dot={false}>{s.no_show}</Badge> : <span className="text-ink-tertiary">—</span>}</Td>
                    <Td className="font-bold">{s.total}</Td>
                  </Tr>
                ))}
              </Table>
            </TableWrap>
          </Card>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
