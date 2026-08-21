import { useMemo, useRef, useState } from 'react'
import { Upload, FileText, Download, UserPlus, Inbox } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Chip from '../../components/ui/Chip'
import EmptyState from '../../components/ui/EmptyState'
import CountUp from '../../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Select } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import { useTeamQuery } from '../../hooks/useTeam'
import {
  useResumePoolQuery,
  useResumePoolStatsQuery,
  useBulkUploadResumesMutation,
  useAssignResumeMutation,
  useBulkAssignResumesMutation,
} from '../../hooks/useResumePool'
import { FILE_BASE_URL } from '../../lib/config'

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'verified', label: 'Verified' },
  { key: 'changes', label: 'Changes' },
  { key: 'rejected', label: 'Rejected' },
]
const STATUS_TONE = { pending: 'gold', verified: 'green', changes: 'red', rejected: 'red' }

function BulkUploadModal({ app, onDone }) {
  const inputRef = useRef(null)
  const [files, setFiles] = useState([])
  const upload = useBulkUploadResumesMutation()

  function submit() {
    if (!files.length) return
    upload.mutate(files, {
      onSuccess: (data) => {
        app.addToast('success', `${data.count} resume(s) added to the pool`)
        app.closeModal()
        onDone?.()
      },
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
    })
  }

  return (
    <>
      <ModalHead title="Bulk upload resumes" onClose={app.closeModal} />
      <ModalBody>
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border-strong rounded-xl p-8 text-center cursor-pointer hover:border-navy transition-colors"
        >
          <Upload size={26} className="mx-auto text-ink-tertiary mb-2" />
          <div className="text-[13.5px] font-semibold">{files.length ? `${files.length} file(s) selected` : 'Click to choose resumes'}</div>
          <div className="text-xs text-ink-tertiary mt-1">PDF, Word, RTF, TXT, ODT or a scanned photo — up to 50 files, 10MB each</div>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.rtf,.txt,.odt,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        {files.length > 0 && (
          <div className="mt-3 max-h-[180px] overflow-y-auto flex flex-col gap-1.5">
            {files.map((f, i) => (
              <div key={i} className="text-[12.5px] text-ink-secondary flex items-center gap-2">
                <FileText size={13} className="flex-shrink-0" /> <span className="truncate">{f.name}</span>
              </div>
            ))}
          </div>
        )}
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={upload.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={upload.isPending || !files.length}>
          {upload.isPending ? 'Uploading...' : `Upload ${files.length || ''}`.trim()}
        </Button>
      </ModalFoot>
    </>
  )
}

function AssignModal({ app, resumeIds, staff, onDone }) {
  const [staffId, setStaffId] = useState(staff[0]?.id ?? '')
  const assignOne = useAssignResumeMutation()
  const assignMany = useBulkAssignResumesMutation()
  const pending = assignOne.isPending || assignMany.isPending

  function submit() {
    if (!staffId) return
    const onSettled = {
      onSuccess: () => {
        app.addToast('success', `Assigned ${resumeIds.length} resume(s)`)
        app.closeModal()
        onDone?.()
      },
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
    }
    if (resumeIds.length === 1) assignOne.mutate({ id: resumeIds[0], staffId }, onSettled)
    else assignMany.mutate({ resumeIds, staffId }, onSettled)
  }

  return (
    <>
      <ModalHead title={`Assign ${resumeIds.length} resume(s)`} onClose={app.closeModal} />
      <ModalBody>
        <Field label="Assign to">
          <Select value={staffId} onChange={(e) => setStaffId(e.target.value)}>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.accessLevel === 'admin' ? 'Admin' : 'Staff'})
              </option>
            ))}
          </Select>
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={pending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={pending || !staffId}>
          {pending ? 'Assigning...' : 'Assign'}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function ResumePool() {
  const app = useApp()
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(() => new Set())

  const { data: rows = [], isLoading, isError, refetch } = useResumePoolQuery({ status })
  const { data: stats } = useResumePoolStatsQuery()
  const { data: team = [] } = useTeamQuery()

  const staffLookup = useMemo(() => new Map(team.map((s) => [s.id, s])), [team])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  function toggleRow(id) {
    setSelected((cur) => {
      const next = new Set(cur)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function openAssign(ids) {
    app.openModal(
      <AssignModal
        app={app}
        resumeIds={ids}
        staff={team}
        onDone={() => {
          setSelected(new Set())
          refetch()
        }}
      />
    )
  }

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Pool</h1>
          <p className="text-sm text-ink-secondary mt-1">Bulk-intake resumes and allocate them to staff to verify.</p>
        </div>
        <Button variant="primary" onClick={() => app.openModal(<BulkUploadModal app={app} onDone={refetch} />)}>
          <Upload size={15} /> Bulk upload
        </Button>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        {['total', 'pending', 'verified', 'changes', 'rejected'].map((k) => (
          <Card key={k} pad>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{k}</span>
            <div className="text-[28px] font-bold tracking-tight mt-2">
              <CountUp value={stats?.[k] ?? 0} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      {stats?.perStaff?.length > 0 && (
        <StaggerItem className="mb-5">
          <Card>
            <CardHead>
              <span className="text-[15px] font-semibold">Allocation by staff</span>
            </CardHead>
            <TableWrap className="border-none rounded-none">
              <Table columns={['Staff', 'Total', 'Pending', 'Verified', 'Changes', 'Rejected']}>
                {stats.perStaff.map((s) => (
                  <Tr key={s.staffId}>
                    <Td className="font-semibold">{s.name}</Td>
                    <Td>{s.total}</Td>
                    <Td>{s.pending}</Td>
                    <Td>{s.verified}</Td>
                    <Td>{s.changes}</Td>
                    <Td>{s.rejected}</Td>
                  </Tr>
                ))}
              </Table>
            </TableWrap>
          </Card>
        </StaggerItem>
      )}

      <StaggerItem className="flex items-center gap-2 mb-4 flex-wrap justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_TABS.map((t) => (
            <Chip key={t.key} selected={status === t.key} onClick={() => setStatus(t.key)}>
              {t.label}
            </Chip>
          ))}
        </div>
        {selected.size > 0 && (
          <Button variant="primary" size="sm" onClick={() => openAssign([...selected])}>
            <UserPlus size={14} /> Assign {selected.size} selected
          </Button>
        )}
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={Inbox} tone="navy" title="No resumes here" body="Bulk-upload resumes to start allocating them to staff." />
          </Card>
        ) : (
          <Card>
            <TableWrap className="border-none rounded-none">
              <Table columns={['', 'File', 'Status', 'Assigned to', 'Uploaded', '']}>
                {rows.map((r) => (
                  <Tr key={r.id}>
                    <Td>
                      <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleRow(r.id)} className="w-4 h-4 accent-navy" />
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="text-navy flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold truncate max-w-[220px]">{r.name || r.file}</div>
                          {r.email && <div className="text-[11px] text-ink-tertiary truncate max-w-[220px]">{r.email}</div>}
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={STATUS_TONE[r.status] ?? 'gray'}>{r.status}</Badge>
                    </Td>
                    <Td>{r.assignedTo?.name ?? staffLookup.get(r.assignedToId)?.name ?? <span className="text-ink-tertiary">Unassigned</span>}</Td>
                    <Td className="text-ink-tertiary">{new Date(r.uploadedOn).toLocaleDateString('en-IN')}</Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" onClick={() => window.open(`${FILE_BASE_URL}${r.url}`, '_blank')}>
                          <Download size={13} />
                        </Button>
                        <Button size="sm" onClick={() => openAssign([r.id])}>
                          <UserPlus size={13} /> Assign
                        </Button>
                      </div>
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
