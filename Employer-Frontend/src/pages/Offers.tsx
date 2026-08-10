import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileCheck, MoreHorizontal, Plus, Send, XCircle } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Field, Input, Select } from '../components/ui/Field'
import { Table, TableWrap, Td, Tr } from '../components/ui/Table'
import { OfferStatusBadge } from '../components/ui/StatusBadge'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { TableSkeleton } from '../components/ui/Skeleton'
import Modal from '../components/ui/Modal'
import Dropdown from '../components/ui/Dropdown'
import { PillTabs } from '../components/ui/Tabs'
import { useCreateOffer, useOffersQuery, useUpdateOfferStatus } from '../hooks/useOffers'
import { useCandidatesQuery } from '../hooks/useCandidates'
import { fmtDate, fmtINR } from '../lib/utils'
import type { OfferStatus } from '../types'

const TABS: { label: string; value: OfferStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Draft', value: 'draft' },
]

export default function Offers() {
  const navigate = useNavigate()
  const { data: offers = [], isLoading, isError, refetch } = useOffersQuery()
  const { data: interviewing = [] } = useCandidatesQuery({ stage: 'interviewing' })
  const createOffer = useCreateOffer()
  const updateStatus = useUpdateOfferStatus()

  const [tab, setTab] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ candidateId: '', ctc: '', joiningDate: '' })

  const status = TABS[tab]!.value
  const filtered = useMemo(() => (status === 'all' ? offers : offers.filter((o) => o.status === status)), [offers, status])

  const stats = {
    total: offers.length,
    accepted: offers.filter((o) => o.status === 'accepted').length,
    pending: offers.filter((o) => o.status === 'pending').length,
    rate: offers.length ? Math.round((offers.filter((o) => o.status === 'accepted').length / offers.filter((o) => o.status !== 'draft').length) * 100) : 0,
  }

  function submitOffer() {
    const candidate = interviewing.find((c) => c.id === form.candidateId)
    if (!candidate || !form.ctc || !form.joiningDate) return
    createOffer.mutate(
      { candidateId: candidate.id, candidateName: candidate.name, initials: candidate.initials, role: candidate.appliedFor, jobId: candidate.jobId, ctc: Number(form.ctc), joiningDate: form.joiningDate, expiresOn: form.joiningDate },
      { onSuccess: () => { setCreateOpen(false); setForm({ candidateId: '', ctc: '', joiningDate: '' }) } }
    )
  }

  return (
    <div>
      <PageHeader
        title="Offers"
        subtitle="Send and track offer letters for candidates who've cleared interviews."
        actions={
          <Button variant="primary" onClick={() => setCreateOpen(true)} disabled={interviewing.length === 0}>
            <Plus size={16} /> Create Offer
          </Button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-5 max-md:grid-cols-2">
        <StatMini label="Total Offers" value={stats.total} />
        <StatMini label="Pending Response" value={stats.pending} />
        <StatMini label="Accepted" value={stats.accepted} />
        <StatMini label="Acceptance Rate" value={`${stats.rate}%`} />
      </div>

      <Card className="mb-5">
        <CardBody className="!py-4">
          <PillTabs items={TABS.map((t) => t.label)} active={tab} onChange={setTab} />
        </CardBody>
      </Card>

      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={FileCheck} title="No offers here" body="Once a candidate clears interviews, create an offer to move them toward joining." />
        </Card>
      ) : (
        <TableWrap>
          <Table columns={['Candidate', 'Role', 'CTC', 'Joining Date', 'Status', '']}>
            {filtered.map((o) => (
              <Tr key={o.id}>
                <Td>
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={o.initials} size="sm" />
                    <button onClick={() => navigate(`/candidates/${o.candidateId}`)} className="font-semibold hover:text-navy hover:underline">{o.candidateName}</button>
                  </div>
                </Td>
                <Td>{o.role}</Td>
                <Td>{fmtINR(o.ctc)}/yr</Td>
                <Td>{fmtDate(o.joiningDate)}</Td>
                <Td><OfferStatusBadge status={o.status} /></Td>
                <Td className="text-right">
                  <Dropdown
                    trigger={
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-tertiary hover:bg-surface-hover hover:text-ink">
                        <MoreHorizontal size={16} />
                      </button>
                    }
                    items={[
                      o.status === 'draft' ? { label: 'Send Offer', icon: <Send size={14} />, onClick: () => updateStatus.mutate({ id: o.id, status: 'pending' }) } : null,
                      o.status === 'pending' ? { label: 'Mark Accepted', icon: <FileCheck size={14} />, onClick: () => updateStatus.mutate({ id: o.id, status: 'accepted' }) } : null,
                      o.status === 'pending' ? { label: 'Mark Rejected', icon: <XCircle size={14} />, danger: true, onClick: () => updateStatus.mutate({ id: o.id, status: 'rejected' }) } : null,
                      o.status === 'pending' || o.status === 'draft' ? { label: 'Withdraw Offer', icon: <XCircle size={14} />, danger: true, onClick: () => updateStatus.mutate({ id: o.id, status: 'withdrawn' }) } : null,
                    ].filter((x): x is NonNullable<typeof x> => x !== null)}
                  />
                </Td>
              </Tr>
            ))}
          </Table>
        </TableWrap>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Offer"
        subtitle="Only candidates currently interviewing are eligible."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" loading={createOffer.isPending} onClick={submitOffer}>Create Offer</Button>
          </>
        }
      >
        <Field label="Candidate">
          <Select value={form.candidateId} onChange={(e) => setForm((f) => ({ ...f, candidateId: e.target.value }))}>
            <option value="">Select a candidate</option>
            {interviewing.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.appliedFor}</option>
            ))}
          </Select>
        </Field>
        <Field label="Annual CTC (₹)">
          <Input type="number" value={form.ctc} onChange={(e) => setForm((f) => ({ ...f, ctc: e.target.value }))} placeholder="e.g. 2800000" />
        </Field>
        <Field label="Joining Date">
          <Input type="date" value={form.joiningDate} onChange={(e) => setForm((f) => ({ ...f, joiningDate: e.target.value }))} />
        </Field>
      </Modal>
    </div>
  )
}

function StatMini({ label, value }: { label: string; value: number | string }) {
  return (
    <Card pad>
      <div className="text-[11.5px] text-ink-secondary font-medium">{label}</div>
      <div className="text-[21px] font-bold tracking-tight mt-1 tabular-nums">{value}</div>
    </Card>
  )
}
