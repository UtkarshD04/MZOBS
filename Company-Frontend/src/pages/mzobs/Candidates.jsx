import { useMemo, useState } from 'react'
import { Search, Users, ShieldCheck, Video } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Chip from '../../components/ui/Chip'
import { Select } from '../../components/ui/Field'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../context/AppContext'
import { openCandidateDrawer, openScheduleMockModal, openVerifyResumeModal } from '../../lib/mzobsModals'
import { CANDIDATES, MOCK_STATUS, PRICING, RESUME_STATUS, SKILL_TRACKS, trackOf } from '../../lib/mzobsData'

const SUB_FILTERS = ['All', 'Subscribed', 'Not subscribed']
const RESUME_FILTERS = ['Any resume state', 'Not uploaded', 'Pending verification', 'Verified', 'Changes requested']
const RESUME_KEYS = { 'Not uploaded': 'none', 'Pending verification': 'pending', Verified: 'verified', 'Changes requested': 'changes' }

export default function Candidates() {
  const app = useApp()
  const [query, setQuery] = useState('')
  const [sub, setSub] = useState('All')
  const [resumeState, setResumeState] = useState('Any resume state')
  const [track, setTrack] = useState(null)

  const rows = useMemo(() => {
    return CANDIDATES.filter((c) => {
      if (sub === 'Subscribed' && c.subscription.status !== 'paid') return false
      if (sub === 'Not subscribed' && c.subscription.status === 'paid') return false
      if (resumeState !== 'Any resume state' && c.resume.status !== RESUME_KEYS[resumeState]) return false
      if (track && c.track !== track) return false
      if (query && !`${c.name} ${c.id} ${c.email} ${c.city}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [query, sub, resumeState, track])

  function clearFilters() {
    setQuery('')
    setSub('All')
    setResumeState('Any resume state')
    setTrack(null)
  }

  const subscribed = CANDIDATES.filter((c) => c.subscription.status === 'paid').length

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Candidates</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Everyone who signed up on the candidate portal. {subscribed} of {CANDIDATES.length} have paid the ₹{PRICING.candidateFee} programme fee.
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
              placeholder="Name, id, email, city"
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
            {Object.entries(SKILL_TRACKS).map(([k, t]) => (
              <Chip key={k} selected={track === k} onClick={() => setTrack(track === k ? null : k)}>
                {t.label}
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
                <Table columns={['Candidate', '₹99', 'Resume', 'Mock interview', 'Track', 'Applications', '']}>
                  {rows.map((c) => {
                    const r = RESUME_STATUS[c.resume.status]
                    const m = MOCK_STATUS[c.mock.status]
                    const t = trackOf(c.track)
                    return (
                      <Tr key={c.id}>
                        <Td>
                          <button onClick={() => openCandidateDrawer(app, c)} className="flex items-center gap-2.5 text-left cursor-pointer">
                            <Avatar initials={c.initials} size="sm" />
                            <div className="min-w-0">
                              <div className="text-[13px] font-semibold">{c.name}</div>
                              <div className="text-[11px] text-ink-tertiary">
                                {c.id} · {c.city} · {c.exp} yrs
                              </div>
                            </div>
                          </button>
                        </Td>
                        <Td>
                          <Badge tone={c.subscription.status === 'paid' ? 'green' : 'red'}>{c.subscription.status === 'paid' ? 'Paid' : 'Unpaid'}</Badge>
                        </Td>
                        <Td>
                          <Badge tone={r.tone}>{r.label}</Badge>
                        </Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <Badge tone={m.tone}>{m.label}</Badge>
                            {c.mock.overall && <span className="text-[12px] font-bold text-navy">{c.mock.overall}</span>}
                          </div>
                        </Td>
                        <Td>{c.track ? <Badge tone={t.tone} dot={false}>{t.label} · {c.grade}</Badge> : <span className="text-ink-tertiary text-[12.5px]">Unassigned</span>}</Td>
                        <Td className="tabular-nums">{c.applications}</Td>
                        <Td>
                          <div className="flex items-center gap-1.5 justify-end">
                            {c.resume.status === 'pending' && (
                              <Button size="sm" onClick={() => openVerifyResumeModal(app, c)}>
                                <ShieldCheck size={13} /> Verify
                              </Button>
                            )}
                            {c.resume.status === 'verified' && c.mock.status === 'not_scheduled' && (
                              <Button size="sm" onClick={() => openScheduleMockModal(app, c)}>
                                <Video size={13} /> Schedule
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => openCandidateDrawer(app, c)}>
                              Open
                            </Button>
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
