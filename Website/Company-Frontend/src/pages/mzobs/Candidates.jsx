import { useMemo, useState } from 'react'
import { Search, Users, ShieldCheck } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Chip from '../../components/ui/Chip'
import { Select } from '../../components/ui/Field'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useApp } from '../../context/AppContext'
import { useResumeQueueQuery } from '../../hooks/useResumes'
import { useMockInterviewsQuery } from '../../hooks/useMockInterviews'
import { VerifyResumeModal } from './ResumeQueue'

const SUB_FILTERS = ['All', 'Subscribed', 'Not subscribed']
const RESUME_FILTERS = ['Any resume state', 'Not uploaded', 'Pending verification', 'Verified', 'Changes requested']
const RESUME_KEYS = { 'Not uploaded': 'none', 'Pending verification': 'pending', Verified: 'verified', 'Changes requested': 'changes' }
const TRACKS = { analytics: 'Analytics', design: 'Design', sales: 'Sales', marketing: 'Marketing', hr: 'HR', support: 'Support', tech: 'Tech', ops: 'Ops' }
const RESUME_STATUS_TONE = { pending: 'gold', changes: 'red', verified: 'green', rejected: 'red', none: 'gray' }
const MOCK_STATUS_TONE = { not_scheduled: 'gray', scheduled: 'gold', completed: 'green', no_show: 'red' }

export default function Candidates() {
  const app = useApp()
  const [query, setQuery] = useState('')
  const [sub, setSub] = useState('All')
  const [resumeState, setResumeState] = useState('Any resume state')
  const [track, setTrack] = useState(null)

  const { data: employees = [], isLoading, isError, refetch } = useResumeQueueQuery({})
  const { data: mockInterviews = [] } = useMockInterviewsQuery({})
  const mockByEmployee = useMemo(() => {
    const map = new Map()
    for (const m of mockInterviews) {
      const empId = m.employeeId ?? m.employee?.id
      const existing = map.get(empId)
      if (!existing || new Date(m.createdAt) > new Date(existing.createdAt)) map.set(empId, m)
    }
    return map
  }, [mockInterviews])

  const rows = useMemo(() => {
    return employees.filter((c) => {
      if (sub === 'Subscribed' && c.subscription?.status !== 'paid') return false
      if (sub === 'Not subscribed' && c.subscription?.status === 'paid') return false
      if (resumeState !== 'Any resume state' && (c.resume?.status ?? 'none') !== RESUME_KEYS[resumeState]) return false
      if (track && c.skillTrack?.key !== track) return false
      if (query && !`${c.name} ${c.email} ${c.currentCity}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [employees, query, sub, resumeState, track])

  function clearFilters() {
    setQuery('')
    setSub('All')
    setResumeState('Any resume state')
    setTrack(null)
  }

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  const subscribed = employees.filter((c) => c.subscription?.status === 'paid').length

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Candidates</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Everyone who signed up on the candidate portal. {subscribed} of {employees.length} have paid the ₹299 programme fee.
        </p>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-[248px_1fr] gap-5 items-start">
        <Card pad className="lg:sticky lg:top-[88px]">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[13.5px] font-semibold">Filters</span>
            <span onClick={clearFilters} className="text-xs text-navy font-semibold cursor-pointer hover:underline">
              Clear
            </span>
          </div>

          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, email, city"
              className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
            />
          </div>

          <div className="text-[11.5px] font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Subscription</div>
          <Select value={sub} onChange={(e) => setSub(e.target.value)} className="mb-4 h-9 text-[12.5px]">
            {SUB_FILTERS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>

          <div className="text-[11.5px] font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Resume</div>
          <Select value={resumeState} onChange={(e) => setResumeState(e.target.value)} className="mb-4 h-9 text-[12.5px]">
            {RESUME_FILTERS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>

          <div className="text-[11.5px] font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Skill track</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(TRACKS).map(([k, label]) => (
              <Chip key={k} selected={track === k} onClick={() => setTrack(track === k ? null : k)}>
                {label}
              </Chip>
            ))}
          </div>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] text-ink-secondary">
              <b className="text-ink">{rows.length}</b> candidate{rows.length === 1 ? '' : 's'}
            </span>
          </div>

          {rows.length === 0 ? (
            <Card>
              <EmptyState
                icon={Users}
                title="No candidates match these filters"
                body="Try clearing the skill track or widening the resume state."
                action={
                  <Button className="mt-2" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            </Card>
          ) : (
            <Card>
              <TableWrap className="border-none rounded-none">
                <Table columns={['Candidate', '₹299', 'Resume', 'Mock interview', 'Track', '']}>
                  {rows.map((c) => {
                    const mock = mockByEmployee.get(c.id)
                    return (
                      <Tr key={c.id}>
                        <Td>
                          <div className="flex items-center gap-2.5">
                            <Avatar initials={c.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                            <div className="min-w-0">
                              <div className="text-[13px] font-semibold">{c.name}</div>
                              <div className="text-[11px] text-ink-tertiary">
                                {c.currentCity || 'No city'} {c.experienceYears ? `· ${c.experienceYears} yrs` : ''}
                              </div>
                            </div>
                          </div>
                        </Td>
                        <Td>
                          <Badge tone={c.subscription?.status === 'paid' ? 'green' : 'red'}>{c.subscription?.status === 'paid' ? 'Paid' : 'Unpaid'}</Badge>
                        </Td>
                        <Td>
                          <Badge tone={RESUME_STATUS_TONE[c.resume?.status ?? 'none']}>{c.resume?.status ?? 'none'}</Badge>
                        </Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <Badge tone={MOCK_STATUS_TONE[mock?.status ?? 'not_scheduled']}>{mock?.status ?? 'not_scheduled'}</Badge>
                            {mock?.scores?.overall != null && <span className="text-[12px] font-bold text-navy">{mock.scores.overall}</span>}
                          </div>
                        </Td>
                        <Td>
                          {c.skillTrack?.key ? (
                            <Badge tone="navy" dot={false}>
                              {TRACKS[c.skillTrack.key] ?? c.skillTrack.key} · {c.skillTrack.grade || '-'}
                            </Badge>
                          ) : (
                            <span className="text-ink-tertiary text-[12.5px]">Unassigned</span>
                          )}
                        </Td>
                        <Td>
                          <div className="flex items-center gap-1.5 justify-end">
                            {c.resume?.status === 'pending' && (
                              <Button size="sm" onClick={() => app.openModal(<VerifyResumeModal app={app} employee={c} onDone={refetch} />)}>
                                <ShieldCheck size={13} /> Verify
                              </Button>
                            )}
                          </div>
                        </Td>
                      </Tr>
                    )
                  })}
                </Table>
              </TableWrap>
            </Card>
          )}
        </div>
      </StaggerItem>
    </StaggerGroup>
  )
}
