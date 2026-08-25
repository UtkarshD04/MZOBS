import { useMemo, useState } from 'react'
import { Inbox, FileText, Send, Download, UserCheck, Check } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import EmptyState from '../../components/ui/EmptyState'
import CountUp from '../../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { cn } from '../../lib/utils'
import { useApp } from '../../context/AppContext'
import { useResumeQueueQuery, useBulkAssignResumesMutation } from '../../hooks/useResumes'
import { useTeamQuery } from '../../hooks/useTeam'
import { FILE_BASE_URL } from '../../lib/config'

function TransferModal({ app, selected, team, pendingByStaff, onDone }) {
  const [staffId, setStaffId] = useState('')
  const bulkAssign = useBulkAssignResumesMutation()

  function submit() {
    if (!staffId) return
    bulkAssign.mutate(
      { employeeIds: selected.map((c) => c.id), staffId },
      {
        onSuccess: () => {
          app.closeModal()
          const staff = team.find((s) => s.id === staffId)
          app.addToast('success', `${selected.length} resume(s) transferred to ${staff?.name ?? 'HR'}`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title={`Transfer ${selected.length} resume(s) to HR`} onClose={app.closeModal} />
      <ModalBody>
        <p className="text-[12.5px] text-ink-secondary mb-3">Pick who takes these — the count shows resumes already sitting with them, unactioned.</p>
        <div className="flex flex-col gap-1.5">
          {team.map((s) => (
            <div
              key={s.id}
              onClick={() => setStaffId(s.id)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors',
                staffId === s.id ? 'border-navy bg-navy-tint' : 'border-border hover:bg-surface-hover'
              )}
            >
              <Avatar initials={s.name?.slice(0, 2)?.toUpperCase()} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate">{s.name}</div>
                <div className="text-xs text-ink-tertiary truncate">{s.role}</div>
              </div>
              <Badge tone={pendingByStaff.get(s.id) > 0 ? 'gold' : 'gray'} dot={false}>
                {pendingByStaff.get(s.id) ?? 0} pending
              </Badge>
              {staffId === s.id && <Check size={16} className="text-navy flex-shrink-0" />}
            </div>
          ))}
        </div>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={bulkAssign.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={bulkAssign.isPending || !staffId}>
          {bulkAssign.isPending ? 'Transferring...' : `Transfer ${selected.length} resume(s)`}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function Resumes() {
  const app = useApp()
  const { data: rawRows = [], isLoading, isError, refetch } = useResumeQueueQuery({})
  const { data: team = [] } = useTeamQuery()
  const [selectedIds, setSelectedIds] = useState(new Set())

  const rows = useMemo(() => rawRows.filter((c) => c.subscription?.status === 'paid' && c.resume?.file), [rawRows])
  const assignedCount = useMemo(() => rows.filter((c) => c.resume?.assignedTo).length, [rows])
  const pendingByStaff = useMemo(() => {
    const map = new Map()
    for (const c of rows) {
      if (c.resume?.assignedTo && c.resume.status === 'pending') {
        const id = c.resume.assignedTo.id
        map.set(id, (map.get(id) ?? 0) + 1)
      }
    }
    return map
  }, [rows])

  const allSelected = rows.length > 0 && selectedIds.size === rows.length
  const selected = useMemo(() => rows.filter((c) => selectedIds.has(c.id)), [rows, selectedIds])

  function toggleAll() {
    setSelectedIds(allSelected ? new Set() : new Set(rows.map((c) => c.id)))
  }
  function toggleOne(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resumes</h1>
          <p className="text-sm text-ink-secondary mt-1">The moment a candidate takes a subscription, their resume lands here — transfer it to HR from here.</p>
        </div>
        <Button
          variant="primary"
          disabled={selected.length === 0}
          onClick={() => app.openModal(<TransferModal app={app} selected={selected} team={team} pendingByStaff={pendingByStaff} onDone={() => setSelectedIds(new Set())} />)}
        >
          <Send size={14} /> Transfer to HR {selected.length > 0 && `(${selected.length})`}
        </Button>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 gap-4 mb-5">
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Resumes received</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={rows.length} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Assigned to HR</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-green">
            <CountUp value={assignedCount} />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={Inbox} tone="green" title="No resumes yet" body="Resumes show up here as soon as a candidate subscribes and uploads one." />
          </Card>
        ) : (
          <TableWrap>
            <Table columns={[<input key="all" type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-[var(--color-navy)]" />, 'Candidate', 'Resume', 'Uploaded', 'Assigned to']}>
              {rows.map((c) => (
                <Tr key={c.id}>
                  <Td>
                    <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleOne(c.id)} className="accent-[var(--color-navy)]" />
                  </Td>
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
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={15} className="text-navy flex-shrink-0" />
                      <span className="truncate max-w-[220px]">{c.resume.file}</span>
                      {c.resume.url && (
                        <button onClick={() => window.open(`${FILE_BASE_URL}${c.resume.url}`, '_blank')} title="Open" className="text-ink-tertiary hover:text-navy flex-shrink-0">
                          <Download size={14} />
                        </button>
                      )}
                    </div>
                  </Td>
                  <Td className="text-ink-tertiary whitespace-nowrap">{c.resume.uploadedOn ? new Date(c.resume.uploadedOn).toLocaleDateString('en-IN') : '—'}</Td>
                  <Td>
                    {c.resume?.assignedTo ? (
                      <Badge tone="navy" dot={false} icon={<UserCheck size={12} />}>
                        {c.resume.assignedTo.name}
                      </Badge>
                    ) : (
                      <Badge tone="gold">Unassigned</Badge>
                    )}
                  </Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
