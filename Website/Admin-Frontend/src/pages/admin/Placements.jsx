import { useMemo, useState } from 'react'
import { Trophy, Building2, Search } from 'lucide-react'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'
import EmptyState from '../../components/ui/EmptyState'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useApplicationsQuery } from '../../hooks/useApplications'

export default function Placements() {
  const [query, setQuery] = useState('')
  const { data: rows = [], isLoading, isError, refetch } = useApplicationsQuery({ status: 'selected' })

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter((a) => `${a.employee?.name} ${a.job?.title} ${a.job?.company?.name}`.toLowerCase().includes(q))
  }, [rows, query])

  const uniqueCompanies = useMemo(() => new Set(rows.map((a) => a.job?.company?.id).filter(Boolean)).size, [rows])
  const thisMonth = useMemo(() => {
    const now = new Date()
    return rows.filter((a) => {
      const d = new Date(a.updatedAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
  }, [rows])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Placements</h1>
        <p className="text-sm text-ink-secondary mt-1">Every candidate who got selected — and which company placed them.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Candidates placed</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-green">
            <CountUp value={rows.length} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Companies hiring</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={uniqueCompanies} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Placed this month</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-gold-strong">
            <CountUp value={thisMonth} />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="flex items-center justify-end mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidate, role, company"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={Trophy} tone="green" title="No placements yet" body="Selected candidates will show up here along with the company that hired them." />
          </Card>
        ) : (
          <Card>
            <TableWrap className="border-none rounded-none">
              <Table columns={['Candidate', 'Position', 'Company', 'Track', 'Selected on']}>
                {filtered.map((a) => (
                  <Tr key={a.id}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={a.employee?.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{a.employee?.name ?? 'Unknown'}</div>
                          <div className="text-xs text-ink-tertiary truncate">{a.employee?.email}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>{a.job?.title ?? '—'}</Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        <Building2 size={13} className="text-navy flex-shrink-0" />
                        {a.job?.company?.name ?? 'Unknown company'}
                      </div>
                    </Td>
                    <Td className="text-ink-tertiary">{a.employee?.skillTrack?.key ? `${a.employee.skillTrack.label} · ${a.employee.skillTrack.grade}` : '—'}</Td>
                    <Td className="text-ink-tertiary whitespace-nowrap">{a.updatedAt ? new Date(a.updatedAt).toLocaleDateString('en-IN') : '—'}</Td>
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
