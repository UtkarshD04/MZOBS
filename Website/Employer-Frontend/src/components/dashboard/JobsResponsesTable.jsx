import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Copy, Edit3, MoreHorizontal, Plus, Search, Users, XCircle } from 'lucide-react'
import Card, { CardHead, CardTitle } from '../ui/Card'
import { Input } from '../ui/Field'
import { PillTabs } from '../ui/Tabs'
import { Table, Td, Tr } from '../ui/Table'
import { JobStatusBadge } from '../ui/StatusBadge'
import Button from '../ui/Button'
import Dropdown from '../ui/Dropdown'
import EmptyState from '../ui/EmptyState'
import { fmtDate } from '../../lib/utils'

const TABS = [
  { label: 'All jobs', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Drafts', value: 'draft' },
  { label: 'Closed', value: 'closed' },
]

const ACTIVE_STATUSES = ['sourcing', 'delivered']
const CLOSED_STATUSES = ['closed', 'archived']

export default function JobsResponsesTable({ jobs, onDuplicate, onClose }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState(0)

  const filtered = useMemo(() => {
    let list = jobs
    const status = TABS[tab].value
    if (status === 'active') list = list.filter((j) => ACTIVE_STATUSES.includes(j.status))
    else if (status === 'draft') list = list.filter((j) => j.status === 'draft')
    else if (status === 'closed') list = list.filter((j) => CLOSED_STATUSES.includes(j.status))

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((j) => j.title.toLowerCase().includes(q) || j.department?.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
  }, [jobs, search, tab])

  return (
    <Card>
      <CardHead className="flex-wrap gap-3">
        <CardTitle>Jobs and responses</CardTitle>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs…" className="pl-8 h-9 w-[200px] text-[12.5px]" />
        </div>
      </CardHead>

      <div className="px-[22px] pt-4 pb-1">
        <PillTabs items={TABS.map((t) => t.label)} active={tab} onChange={setTab} />
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="You have not posted any jobs yet."
          body="Post a verified requirement to start receiving applications."
          action={
            <Button variant="primary" size="sm" onClick={() => navigate('/jobs/new')}>
              <Plus size={15} /> Post your first job
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No jobs in this view" body="Try a different tab or search term." />
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <Table columns={['Job title', 'Status', 'Posted on', 'Total responses', 'New responses', 'Shortlisted', 'Job expiry', '']}>
              {filtered.slice(0, 8).map((job) => (
                <Tr key={job.id} onClick={() => navigate(`/candidates?job=${job.id}`)}>
                  <Td>
                    <div className="font-semibold text-ink">{job.title}</div>
                    <div className="text-[12px] text-ink-tertiary mt-0.5">{job.department} · {job.location}</div>
                  </Td>
                  <Td><JobStatusBadge status={job.status} /></Td>
                  <Td className="text-ink-secondary">{job.postedOn ? fmtDate(job.postedOn) : fmtDate(job.createdAt)}</Td>
                  <Td className="tabular-nums">{job.candidatesShared ?? 0}</Td>
                  <Td>
                    {job.newCount > 0 ? (
                      <span className="inline-flex items-center justify-center min-w-[22px] h-[20px] px-1.5 rounded-full text-[11px] font-bold bg-navy-tint text-navy tabular-nums">{job.newCount}</span>
                    ) : (
                      <span className="text-ink-tertiary tabular-nums">0</span>
                    )}
                  </Td>
                  <Td className="tabular-nums">{job.shortlistedCount ?? 0}</Td>
                  <Td className="text-ink-secondary">{job.deadline ? fmtDate(job.deadline) : '—'}</Td>
                  <Td onClick={(e) => e.stopPropagation()} className="text-right">
                    <Dropdown
                      trigger={
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-tertiary hover:bg-surface-hover hover:text-ink">
                          <MoreHorizontal size={16} />
                        </button>
                      }
                      items={[
                        { label: 'View responses', icon: <Users size={14} />, onClick: () => navigate(`/candidates?job=${job.id}`) },
                        { label: 'Edit job', icon: <Edit3 size={14} />, onClick: () => navigate(`/jobs/${job.id}/edit`) },
                        { label: 'Duplicate job', icon: <Copy size={14} />, onClick: () => onDuplicate(job.id) },
                        ...(!CLOSED_STATUSES.includes(job.status)
                          ? [{ label: 'Close job', icon: <XCircle size={14} />, onClick: () => onClose(job.id) }]
                          : []),
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Table>
          </div>

          <div className="md:hidden divide-y divide-border">
            {filtered.slice(0, 8).map((job) => (
              <button key={job.id} onClick={() => navigate(`/candidates?job=${job.id}`)} className="w-full text-left px-[18px] py-3.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[13.5px] text-ink truncate">{job.title}</span>
                  <JobStatusBadge status={job.status} />
                </div>
                <div className="text-[12px] text-ink-tertiary">{job.department} · {job.location}</div>
                <div className="text-[12px] text-ink-secondary tabular-nums">
                  {job.candidatesShared ?? 0} responses · {job.newCount ?? 0} new · {job.shortlistedCount ?? 0} shortlisted
                </div>
              </button>
            ))}
          </div>

          {filtered.length > 8 && (
            <div className="px-[22px] py-3 border-t border-border text-center">
              <button onClick={() => navigate('/jobs')} className="text-[12.5px] font-semibold text-navy hover:underline">
                View all {filtered.length} jobs
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
