import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import Card, { CardHead, CardTitle } from '../ui/Card'
import { PillTabs } from '../ui/Tabs'
import { Table, Td, Tr } from '../ui/Table'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import { CandidateStageBadge } from '../ui/StatusBadge'
import EmptyState from '../ui/EmptyState'
import { fmtDate } from '../../lib/utils'

// "Unread" is intentionally not offered as a separate filter from "New" —
// the backend has no read/unread flag on candidates, only the `shared`
// stage, so a distinct "Unread" chip would just duplicate "New" under a
// different name rather than reflect real data.
const FILTERS = [
  { label: 'All applications', value: 'all' },
  { label: 'New', value: 'shared' },
  { label: 'Shortlisted', value: 'shortlisted' },
]

export default function CandidateResponseList({ candidates, onView }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState(0)

  const filtered = useMemo(() => {
    const value = FILTERS[filter].value
    const list = value === 'all' ? candidates : candidates.filter((c) => c.stage === value)
    return [...list].sort((a, b) => new Date(b.sharedOn ?? 0) - new Date(a.sharedOn ?? 0)).slice(0, 8)
  }, [candidates, filter])

  return (
    <Card>
      <CardHead>
        <CardTitle>Recent candidate responses</CardTitle>
        <button onClick={() => navigate('/candidates')} className="text-[12px] font-semibold text-navy hover:underline">
          View all
        </button>
      </CardHead>

      <div className="px-[22px] pt-4 pb-1">
        <PillTabs items={FILTERS.map((f) => f.label)} active={filter} onChange={setFilter} />
      </div>

      {candidates.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidate responses yet"
          body="Once Mzobs shares candidate resumes against your live jobs, they'll appear here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="Nothing in this filter" body="Try a different filter to see other responses." />
      ) : (
        <>
          <div className="hidden lg:block overflow-x-auto">
            <Table columns={['Candidate', 'Applied role', 'Experience', 'Location', 'Applied date', 'Status', '']}>
              {filtered.map((c) => (
                <Tr key={c.id}>
                  <Td onClick={() => navigate(`/candidates/${c.id}`)} className="cursor-pointer">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar initials={c.initials} size="sm" />
                      <span className="font-semibold text-ink truncate">{c.name}</span>
                    </div>
                  </Td>
                  <Td className="text-ink-secondary">{c.appliedFor}</Td>
                  <Td className="tabular-nums">{c.experienceYears} yrs</Td>
                  <Td className="text-ink-secondary">{c.location}</Td>
                  <Td className="text-ink-tertiary">{c.sharedOn ? fmtDate(c.sharedOn) : '—'}</Td>
                  <Td><CandidateStageBadge status={c.stage} /></Td>
                  <Td onClick={(e) => e.stopPropagation()} className="text-right">
                    <Button variant="secondary" size="sm" onClick={() => onView(c.id)}>
                      View profile
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Table>
          </div>

          <div className="lg:hidden divide-y divide-border">
            {filtered.map((c) => (
              <div key={c.id} className="px-[18px] py-3.5 flex items-start gap-3">
                <Avatar initials={c.initials} size="sm" />
                <div className="min-w-0 flex-1">
                  <button onClick={() => navigate(`/candidates/${c.id}`)} className="font-semibold text-[13.5px] text-ink text-left truncate">{c.name}</button>
                  <div className="text-[12px] text-ink-tertiary mt-0.5">{c.appliedFor} · {c.experienceYears} yrs · {c.location}</div>
                  <div className="mt-1.5"><CandidateStageBadge status={c.stage} /></div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => onView(c.id)} className="flex-shrink-0">
                  View
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
