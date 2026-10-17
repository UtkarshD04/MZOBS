import { useMemo, useState } from 'react'
import { Users, Search, Mail, Phone } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useEmployersQuery } from '../../hooks/useEmployers'

const TABS = ['Active', 'Invited', 'Disabled', 'All']
const TAB_KEYS = ['active', 'invited', 'disabled', null]
const STATUS_TONE = { active: 'green', invited: 'gold', disabled: 'red' }

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Employers() {
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const { data: allRows = [], isLoading, isError, refetch } = useEmployersQuery({})

  const counts = TAB_KEYS.map((k) => (k ? allRows.filter((u) => u.status === k).length : allRows.length))

  const filtered = useMemo(() => {
    const status = TAB_KEYS[tab]
    const q = query.toLowerCase()
    return allRows.filter((u) => {
      if (status && u.status !== status) return false
      if (!q) return true
      return `${u.name} ${u.email} ${u.phone} ${u.company?.name ?? ''}`.toLowerCase().includes(q)
    })
  }, [allRows, tab, query])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Employers</h1>
        <p className="text-sm text-ink-secondary mt-1">Every employer login on Mzobs, across all companies. {allRows.length} in total.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {TABS.map((label, i) => (
          <Card key={label} hover pad onClick={() => setTab(i)} className="cursor-pointer">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${i === 0 ? 'text-green' : i === 1 ? 'text-gold-strong' : i === 2 ? 'text-red' : 'text-navy'}`}>
              <CountUp value={counts[i]} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <PillTabs items={TABS} active={tab} onChange={setTab} />
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, company"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={Users} title="No employers here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <Card className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[11px] font-semibold tracking-wide uppercase text-ink-tertiary border-b border-border">
                  <th className="px-4 py-3">Employer</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Last active</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-xs text-ink-tertiary mt-0.5 flex items-center gap-1">
                        <Mail size={11} /> {u.email}
                      </div>
                      {u.phone && (
                        <div className="text-xs text-ink-tertiary mt-0.5 flex items-center gap-1">
                          <Phone size={11} /> {u.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.company ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{u.company.name}</span>
                          {u.company.blocked && <Badge tone="red">blocked</Badge>}
                        </div>
                      ) : (
                        <span className="text-ink-tertiary">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{u.role}</td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[u.status] ?? 'gray'}>{u.status}</Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(u.lastActiveAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
