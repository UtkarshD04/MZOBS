import { useMemo } from 'react'
import { Star } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useShortlistQuery } from '../../hooks/useShortlist'

export default function Shortlisted() {
  const { data: rows = [], isLoading, isError, refetch } = useShortlistQuery({ status: 'sent_to_ops' })

  const avgTrustScore = useMemo(() => {
    if (rows.length === 0) return 0
    return Math.round(rows.reduce((n, c) => n + (c.shortlist?.trustScore ?? 0), 0) / rows.length)
  }, [rows])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Shortlisted</h1>
        <p className="text-sm text-ink-secondary mt-1">Candidates HR has verified, interviewed and sent back — ready to match against a requirement.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 gap-4 mb-5">
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">From HR</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={rows.length} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Average trust score</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-green">
            <CountUp value={avgTrustScore} />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={Star} tone="green" title="Nothing here yet" body="Candidates HR sends back after shortlisting will show up here." />
          </Card>
        ) : (
          <Card>
            <TableWrap className="border-none rounded-none">
              <Table columns={['Candidate', 'Trust score', 'Track', 'Sent by', 'Sent on']}>
                {rows.map((c) => (
                  <Tr key={c.id}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={c.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{c.name}</div>
                          <div className="text-xs text-ink-tertiary truncate">{c.currentCity || 'City not set'}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={c.shortlist?.trustScore >= 85 ? 'green' : 'gold'} dot={false}>
                        {c.shortlist?.trustScore}/100
                      </Badge>
                    </Td>
                    <Td className="text-ink-tertiary">{c.skillTrack?.key ? `${c.skillTrack.label} · ${c.skillTrack.grade}` : '—'}</Td>
                    <Td className="text-ink-tertiary">{c.shortlist?.sentToOpsBy?.name ?? '—'}</Td>
                    <Td className="text-ink-tertiary whitespace-nowrap">
                      {c.shortlist?.sentToOpsOn ? new Date(c.shortlist.sentToOpsOn).toLocaleDateString('en-IN') : '—'}
                    </Td>
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
