import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Copy, CreditCard, Edit3, Eye, MoreHorizontal, Plus, Search, Send, Trash2, XCircle } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Input, Select } from '../components/ui/Field'
import { PillTabs } from '../components/ui/Tabs'
import { Table, TableWrap, Td, Tr } from '../components/ui/Table'
import { JobStatusBadge } from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { TableSkeleton } from '../components/ui/Skeleton'
import Pagination from '../components/ui/Pagination'
import Dropdown from '../components/ui/Dropdown'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useJobsQuery, useSetJobStatus, useDuplicateJob, useDeleteJob, usePayJobInvoice } from '../hooks/useJobs'
import { PRICING } from '../data/mock'
import { fmtCompactINR, fmtINR } from '../lib/utils'

const STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'In review', value: 'pending_review' },
  { label: 'Awaiting payment', value: 'awaiting_payment' },
  { label: 'Sourcing', value: 'sourcing' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Closed', value: 'closed' },
]

const PAGE_SIZE = 6

export default function Jobs() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState(0)
  const [department, setDepartment] = useState('all')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)

  const status = STATUS_TABS[tab].value
  const { data: jobs = [], isLoading, isError, refetch } = useJobsQuery({ search, status, department })
  const setJobStatus = useSetJobStatus()
  const duplicateJob = useDuplicateJob()
  const deleteJob = useDeleteJob()
  const payInvoice = usePayJobInvoice()

  const departments = useMemo(() => Array.from(new Set(['Engineering', 'Design', 'Sales', 'Product', 'Operations', 'People'])), [])

  const pageCount = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE))
  const paged = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totals = {
    total: jobs.length,
    openings: jobs.reduce((s, j) => s + j.vacancies, 0),
    owed: jobs.filter((j) => j.feeStatus === 'paid').reduce((s, j) => s + j.resumesPromised, 0),
    delivered: jobs.reduce((s, j) => s + j.candidatesShared, 0),
  }

  return (
    <div>
      <PageHeader
        title="Requirements"
        subtitle={`Raise a requirement, Mzobs reviews it, you pay ${fmtINR(PRICING.perOpeningFee)} per opening, and Mzobs ships ${PRICING.resumesPerOpening} screened resumes for each one.`}
        actions={
          <Button variant="primary" onClick={() => navigate('/jobs/new')}>
            <Plus size={16} /> New Requirement
          </Button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-5 max-md:grid-cols-2">
        <StatMini label="Requirements" value={totals.total} />
        <StatMini label="Openings" value={totals.openings} />
        <StatMini label="Resumes Owed" value={totals.owed} />
        <StatMini label="Resumes Delivered" value={totals.delivered} />
      </div>

      <Card className="mb-5">
        <CardBody className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search jobs by title, department or location…"
              className="pl-9"
            />
          </div>
          <Select value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1) }} className="w-44">
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>
        </CardBody>
        <div className="px-[22px] pb-[18px]">
          <PillTabs items={STATUS_TABS.map((t) => t.label)} active={tab} onChange={(i) => { setTab(i); setPage(1) }} />
        </div>
      </Card>

      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : jobs.length === 0 ? (
        <Card>
          <EmptyState
            icon={Briefcase}
            title="No requirements found"
            body="Try adjusting your filters, or raise a new requirement to start receiving screened resumes from Mzobs."
            action={
              <Button variant="primary" size="sm" onClick={() => navigate('/jobs/new')}>
                <Plus size={15} /> New Requirement
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <TableWrap>
            <Table columns={['Requirement', 'Status', 'Openings', 'Fee', 'Resumes', 'Salary Range', '']}>
              {paged.map((job) => (
                <Tr key={job.id} onClick={() => navigate(`/jobs/${job.id}/edit`)}>
                  <Td>
                    <div className="font-semibold">{job.title}</div>
                    <div className="text-[12px] text-ink-tertiary mt-0.5">
                      {job.department} · {job.location} · {job.workMode}
                    </div>
                  </Td>
                  <Td><JobStatusBadge status={job.status} /></Td>
                  <Td className="tabular-nums">{job.vacancies}</Td>
                  <Td>
                    <div className="tabular-nums">{fmtINR(job.feeTotal)}</div>
                    <div className={`text-[11.5px] font-semibold mt-0.5 ${job.feeStatus === 'paid' ? 'text-green' : 'text-amber'}`}>
                      {job.feeStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </div>
                  </Td>
                  <Td className="tabular-nums">
                    {job.candidatesShared}
                    <span className="text-ink-tertiary">/{job.resumesPromised}</span>
                  </Td>
                  <Td>{fmtCompactINR(job.salaryMin)} – {fmtCompactINR(job.salaryMax)}</Td>
                  <Td onClick={(e) => e.stopPropagation()} className="text-right">
                    <Dropdown
                      trigger={
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-tertiary hover:bg-surface-hover hover:text-ink">
                          <MoreHorizontal size={16} />
                        </button>
                      }
                      items={[
                        { label: 'View / Edit', icon: <Edit3 size={14} />, onClick: () => navigate(`/jobs/${job.id}/edit`) },
                        { label: 'Duplicate', icon: <Copy size={14} />, onClick: () => duplicateJob.mutate(job.id) },
                        'divider',
                        job.status === 'draft'
                          ? { label: 'Submit to Mzobs', icon: <Send size={14} />, onClick: () => setJobStatus.mutate({ id: job.id, status: 'pending_review' }) }
                          : job.status === 'awaiting_payment'
                          ? { label: `Pay ${fmtINR(job.feeTotal)}`, icon: <CreditCard size={14} />, onClick: () => payInvoice.mutate(job.id) }
                          : { label: 'View resume batch', icon: <Eye size={14} />, onClick: () => navigate('/batches') },
                        job.status !== 'closed' && job.status !== 'archived'
                          ? { label: 'Close Requirement', icon: <XCircle size={14} />, onClick: () => setJobStatus.mutate({ id: job.id, status: 'closed' }) }
                          : { label: 'Archive Requirement', icon: <XCircle size={14} />, onClick: () => setJobStatus.mutate({ id: job.id, status: 'archived' }) },
                        'divider',
                        { label: 'Delete Requirement', icon: <Trash2 size={14} />, danger: true, onClick: () => setDeleteId(job.id) },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} total={jobs.length} pageSize={PAGE_SIZE} />
        </>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteJob.mutate(deleteId)
          setDeleteId(null)
        }}
        title="Delete this requirement?"
        body="This permanently removes the requirement. Resumes Mzobs has already delivered for it stay in Shared Profiles, and paid fees are not refunded automatically."
        confirmLabel="Delete Requirement"
        loading={deleteJob.isPending}
      />
    </div>
  )
}

function StatMini({ label, value }) {
  return (
    <Card pad>
      <div className="text-[11.5px] text-ink-secondary font-medium">{label}</div>
      <div className="text-[21px] font-bold tracking-tight mt-1 tabular-nums">{value}</div>
    </Card>
  )
}
