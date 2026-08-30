import { useMemo, useState } from 'react'
import { ClipboardList, Search, Building2, StickyNote } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Select, Textarea } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import { useApplicationsQuery, useUpdateApplicationMutation } from '../../hooks/useApplications'
import { useJobsQuery } from '../../hooks/useJobs'

const STATUS_TABS = ['All', 'New', 'Screening', 'Shortlisted', 'Shared', 'Interview', 'Selected', 'Rejected']
const STATUS_KEYS = [null, 'new', 'screening', 'shortlisted', 'shared', 'interview', 'selected', 'rejected']

function NoteModal({ app, application, onDone }) {
  const [note, setNote] = useState(application.note ?? '')
  const update = useUpdateApplicationMutation()

  function submit() {
    update.mutate(
      { id: application.id, note },
      {
        onSuccess: () => {
          app.addToast('success', 'Note saved')
          app.closeModal()
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title={`Note — ${application.employee?.name ?? 'candidate'}`} onClose={app.closeModal} />
      <ModalBody>
        <Textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note, visible to the Mzobs team only" />
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={update.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={update.isPending}>
          {update.isPending ? 'Saving...' : 'Save note'}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function Applications() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [jobId, setJobId] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkStatus, setBulkStatus] = useState('screening')
  const [bulkPending, setBulkPending] = useState(false)

  const status = STATUS_KEYS[tab]
  const { data: rows = [], isLoading, isError, refetch } = useApplicationsQuery({ ...(status ? { status } : {}), ...(jobId !== 'all' ? { jobId } : {}) })
  const { data: jobs = [] } = useJobsQuery()
  const update = useUpdateApplicationMutation()

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter((a) => `${a.employee?.name ?? ''} ${a.employee?.email ?? ''}`.toLowerCase().includes(q))
  }, [rows, query])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  function changeStatus(a, newStatus) {
    if (newStatus === a.status) return
    update.mutate(
      { id: a.id, status: newStatus },
      {
        onSuccess: () => app.addToast('success', `${a.employee?.name ?? 'Candidate'} moved to ${newStatus}`),
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  function toggleSelected(id) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  async function applyBulk() {
    setBulkPending(true)
    const results = await Promise.allSettled(selectedIds.map((id) => update.mutateAsync({ id, status: bulkStatus })))
    const failedIds = selectedIds.filter((_, i) => results[i].status === 'rejected')
    const succeededCount = selectedIds.length - failedIds.length

    if (succeededCount > 0) {
      app.addToast('success', `${succeededCount} application${succeededCount === 1 ? '' : 's'} moved to ${bulkStatus}`)
    }
    if (failedIds.length > 0) {
      app.addToast('error', `${failedIds.length} application${failedIds.length === 1 ? '' : 's'} failed to update`)
    }
    setSelectedIds(failedIds)
    setBulkPending(false)
  }

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-sm text-ink-secondary mt-1">Move candidates through the pipeline — each status change notifies the candidate.</p>
      </StaggerItem>

      <StaggerItem className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <PillTabs items={STATUS_TABS} active={tab} onChange={setTab} />
        <div className="flex items-center gap-2">
          <Select value={jobId} onChange={(e) => setJobId(e.target.value)} className="w-56">
            <option value="all">All jobs</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </Select>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search candidate"
              className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[220px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
            />
          </div>
        </div>
      </StaggerItem>

      {selectedIds.length > 0 && (
        <StaggerItem className="mb-4">
          <Card pad className="flex items-center gap-3 flex-wrap">
            <span className="text-[13px] font-semibold">{selectedIds.length} selected</span>
            <Select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} className="w-48">
              {STATUS_KEYS.slice(1).map((s, i) => (
                <option key={s} value={s}>
                  Move to {STATUS_TABS[i + 1]}
                </option>
              ))}
            </Select>
            <Button variant="primary" size="sm" onClick={applyBulk} disabled={bulkPending}>
              {bulkPending ? 'Applying...' : 'Apply'}
            </Button>
            <Button size="sm" onClick={() => setSelectedIds([])} disabled={bulkPending}>
              Clear
            </Button>
          </Card>
        </StaggerItem>
      )}

      <StaggerItem>
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={ClipboardList} title="No applications here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <Card>
            <CardHead>
              <span className="text-[15px] font-semibold">{filtered.length} applications</span>
            </CardHead>
            <TableWrap className="border-none rounded-none">
              <Table columns={['', 'Candidate', 'Job', 'Fit', 'Status', 'Applied', '']}>
                {filtered.map((a) => (
                  <Tr key={a.id}>
                    <Td>
                      <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => toggleSelected(a.id)} className="accent-navy w-[15px] h-[15px]" />
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={a.employee?.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{a.employee?.name ?? 'Unknown'}</div>
                          <div className="text-xs text-ink-tertiary truncate">{a.employee?.email}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        <Building2 size={13} className="text-navy flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="truncate">{a.job?.title ?? '—'}</div>
                          <div className="text-xs text-ink-tertiary truncate">{a.job?.company?.name ?? ''}</div>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-ink-tertiary">{a.fit != null ? `${a.fit}%` : '—'}</Td>
                    <Td>
                      <Select value={a.status} onChange={(e) => changeStatus(a, e.target.value)} className="w-[150px]">
                        {STATUS_KEYS.slice(1).map((s, i) => (
                          <option key={s} value={s}>
                            {STATUS_TABS[i + 1]}
                          </option>
                        ))}
                      </Select>
                    </Td>
                    <Td className="text-ink-tertiary whitespace-nowrap">{a.appliedOn ? new Date(a.appliedOn).toLocaleDateString('en-IN') : '—'}</Td>
                    <Td>
                      <Button size="sm" iconOnly title="Note" onClick={() => app.openModal(<NoteModal app={app} application={a} onDone={refetch} />)}>
                        <StickyNote size={14} className={a.note ? 'text-gold-strong' : ''} />
                      </Button>
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
