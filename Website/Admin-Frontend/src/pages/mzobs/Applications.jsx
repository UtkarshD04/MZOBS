import { useMemo, useState } from 'react'
import { ClipboardList, EyeOff, Search, Send } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { useApplicationsQuery } from '../../hooks/useApplications'
import { useMockInterviewsQuery } from '../../hooks/useMockInterviews'
import { useBatchesQuery, useDispatchBatchMutation } from '../../hooks/useBatches'

const TABS = ['New', 'Screening', 'Shortlisted', 'Shared', 'Closed', 'All']
const TAB_FILTER = [['new'], ['screening'], ['shortlisted'], ['shared', 'interview'], ['selected', 'rejected'], null]
const STATUS_TONE = { new: 'navy', screening: 'gold', shortlisted: 'gold', shared: 'teal', interview: 'teal', selected: 'green', rejected: 'red' }

function ShareApplicationModal({ app, application, batch, onDone }) {
  const dispatch = useDispatchBatchMutation()

  function submit() {
    dispatch.mutate(
      { batchId: batch.id, applicationIds: [application.id] },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast('success', `${application.employee?.name} shared with ${application.job?.company?.name ?? 'employer'}`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title="Share profile with employer" onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-center gap-3 mb-4">
          <Avatar initials={application.employee?.name?.slice(0, 2)?.toUpperCase()} size="md" />
          <div className="min-w-0">
            <div className="text-[15px] font-semibold">{application.employee?.name}</div>
            <div className="text-xs text-ink-tertiary truncate">{application.job?.title}</div>
          </div>
        </div>
        <div className="rounded-xl bg-surface-sunken p-3.5 mb-4">
          {[
            ['Resume status', application.employee?.resume?.status],
            ['Skill track', application.employee?.skillTrack?.label || 'Unassigned'],
            ['Fit score', application.fit != null ? `${application.fit}%` : '—'],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between text-[12.5px] py-1.5 border-b border-border last:border-b-0">
              <span className="text-ink-tertiary">{l}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <p className="text-[12.5px] text-ink-secondary">
          Sharing adds {application.employee?.name?.split(' ')[0]} to this employer's dispatch batch.
        </p>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={dispatch.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={dispatch.isPending}>
          {dispatch.isPending ? 'Sharing...' : 'Share profile'}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function Applications() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const status = TAB_FILTER[tab]

  const { data: allApplications = [], isLoading, isError, refetch } = useApplicationsQuery({})
  const { data: mockInterviews = [] } = useMockInterviewsQuery({})
  const { data: batches = [] } = useBatchesQuery({})

  const mockByEmployee = useMemo(() => {
    const map = new Map()
    for (const m of mockInterviews) map.set(m.employeeId ?? m.employee?.id, m)
    return map
  }, [mockInterviews])
  const batchByJob = useMemo(() => new Map(batches.map((b) => [b.jobId, b])), [batches])

  const rows = useMemo(() => {
    let r = allApplications
    if (status) r = r.filter((a) => status.includes(a.status))
    if (query) {
      const q = query.toLowerCase()
      r = r.filter((a) => `${a.employee?.name} ${a.job?.title}`.toLowerCase().includes(q))
    }
    return [...r].sort((a, b) => (b.fit ?? 0) - (a.fit ?? 0))
  }, [allApplications, status, query])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  const counts = {
    total: allApplications.length,
    shared: allApplications.filter((a) => ['shared', 'interview'].includes(a.status)).length,
    selected: allApplications.filter((a) => a.status === 'selected').length,
    pending: allApplications.filter((a) => ['new', 'screening'].includes(a.status)).length,
  }

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-sm text-ink-secondary mt-1">Candidate applications against live requirements. This table is Mzobs-only.</p>
      </StaggerItem>

      <StaggerItem className="mb-5">
        <Card pad className="flex items-start gap-3 border-navy-ring bg-navy-tint">
          <EyeOff size={18} className="text-navy mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-[13.5px] font-semibold">Employers cannot see any of this</div>
            <p className="text-[13px] text-ink-secondary mt-0.5">
              When a candidate applies, the application lands here — not on the employer's portal. The employer meets a candidate only when we hand
              them a dispatch batch, after their invoice clears.
            </p>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          ['Applications held', counts.total, 'text-navy'],
          ['Awaiting screening', counts.pending, 'text-gold-strong'],
          ['Shared with employers', counts.shared, 'text-teal'],
          ['Selected', counts.selected, 'text-green'],
        ].map(([label, val, cls]) => (
          <Card key={label} hover pad>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${cls}`}>
              <CountUp value={val} />
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
            placeholder="Search candidate, role"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">{rows.length} application{rows.length === 1 ? '' : 's'}</span>
            <span className="text-xs text-ink-tertiary">Ranked by fit score</span>
          </CardHead>
          {rows.length === 0 ? (
            <EmptyState icon={ClipboardList} title="Nothing in this bucket" body="Try another tab or clear the search." />
          ) : (
            <TableWrap className="border-none rounded-none">
              <Table columns={['Candidate', 'Applied to', 'Fit', 'Readiness', 'Status', '']}>
                {rows.map((a) => {
                  const mock = mockByEmployee.get(a.employeeId ?? a.employee?.id)
                  const ready = a.employee?.resume?.status === 'verified' && mock?.status === 'completed'
                  const batch = batchByJob.get(a.jobId ?? a.job?.id)

                  return (
                    <Tr key={a.id}>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={a.employee?.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold">{a.employee?.name}</div>
                          </div>
                        </div>
                      </Td>
                      <Td>{a.job?.title}</Td>
                      <Td className="font-bold">{a.fit != null ? `${a.fit}%` : '—'}</Td>
                      <Td>{ready ? <Badge tone="green">Batch ready</Badge> : <Badge tone="gold">{a.employee?.resume?.status === 'verified' ? 'Mock pending' : 'Resume pending'}</Badge>}</Td>
                      <Td>
                        <Badge tone={STATUS_TONE[a.status] ?? 'navy'}>{a.status}</Badge>
                      </Td>
                      <Td className="text-right">
                        {['new', 'screening', 'shortlisted'].includes(a.status) && ready && batch ? (
                          <Button size="sm" onClick={() => app.openModal(<ShareApplicationModal app={app} application={a} batch={batch} onDone={refetch} />)}>
                            <Send size={13} /> Share
                          </Button>
                        ) : null}
                      </Td>
                    </Tr>
                  )
                })}
              </Table>
            </TableWrap>
          )}
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
