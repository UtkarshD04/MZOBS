import { Inbox } from 'lucide-react'
import Card from '../../components/ui/Card'
import CountUp from '../../components/ui/CountUp'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import { useResumePoolStatsQuery } from '../../hooks/useResumePool'
import { useMeQuery } from '../../hooks/useAuth'

const CARDS = [
  { key: 'total', label: 'Assigned to you' },
  { key: 'pending', label: 'Pending' },
  { key: 'verified', label: 'Verified' },
  { key: 'changes', label: 'Changes requested' },
  { key: 'rejected', label: 'Rejected' },
]

export default function Dashboard() {
  const { data: me } = useMeQuery()
  const { data: stats, isLoading, isError, refetch } = useResumePoolStatsQuery()

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back{me?.name ? `, ${me.name.split(' ')[0]}` : ''}</h1>
        <p className="text-sm text-ink-secondary mt-1">Here's what's assigned to you right now.</p>
      </StaggerItem>

      {stats?.total ? (
        <StaggerItem className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {CARDS.map((c) => (
            <Card key={c.key} pad>
              <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{c.label}</span>
              <div className="text-[28px] font-bold tracking-tight mt-2">
                <CountUp value={stats[c.key] ?? 0} />
              </div>
            </Card>
          ))}
        </StaggerItem>
      ) : (
        <StaggerItem>
          <Card>
            <EmptyState icon={Inbox} tone="navy" title="Nothing assigned yet" body="Once an admin allocates resumes to you, they'll show up here." />
          </Card>
        </StaggerItem>
      )}
    </StaggerGroup>
  )
}
