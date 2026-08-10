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
import { useApp } from '../../context/AppContext'
import { openCandidateDrawer, openShareApplicationModal } from '../../lib/mzobsModals'
import { APPLICATIONS, APPLICATION_STATUS, RESUME_STATUS, candidateOf, companyOf, jobOf } from '../../lib/mzobsData'

const TABS = ['New', 'Screening', 'Shortlisted', 'Shared', 'Closed', 'All']
const TAB_FILTER = [['new'], ['screening'], ['shortlisted'], ['shared', 'interview'], ['selected', 'rejected'], null]

export default function Applications() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const allowed = TAB_FILTER[tab]
    return APPLICATIONS.filter((a) => {
      if (allowed && !allowed.includes(a.status)) return false
      if (query) {
        const c = candidateOf(a.candidateId)
        const j = jobOf(a.jobId)
        const co = companyOf(j.companyId)
        if (!`${c.name} ${j.title} ${co.name} ${a.id}`.toLowerCase().includes(query.toLowerCase())) return false
      }
      return true
    }).sort((a, b) => b.fit - a.fit)
  }, [tab, query])

  const counts = {
    total: APPLICATIONS.length,
    shared: APPLICATIONS.filter((a) => ['shared', 'interview'].includes(a.status)).length,
    selected: APPLICATIONS.filter((a) => a.status === 'selected').length,
    pending: APPLICATIONS.filter((a) => ['new', 'screening'].includes(a.status)).length,
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
              When a candidate applies, the application lands here — not on the employer's portal. The employer meets a candidate only when we hand them
              a dispatch batch, after their invoice clears.
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
            placeholder="Search candidate, role, company"
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
              <Table columns={['Candidate', 'Applied to', 'Company', 'Applied on', 'Fit', 'Readiness', 'Status', '']}>
                {rows.map((a) => {
                  const c = candidateOf(a.candidateId)
                  const j = jobOf(a.jobId)
                  const co = companyOf(j.companyId)
                  const st = APPLICATION_STATUS[a.status]
                  const ready = c.resume.status === 'verified' && c.mock.status === 'completed'

                  return (
                    <Tr key={a.id}>
                      <Td>
                        <button onClick={() => openCandidateDrawer(app, c)} className="flex items-center gap-2.5 text-left cursor-pointer">
                          <Avatar initials={c.initials} size="sm" />
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold">{c.name}</div>
                            <div className="text-[11px] text-ink-tertiary">{c.city}</div>
                          </div>
                        </button>
                      </Td>
                      <Td>{j.title}</Td>
                      <Td>{co.name}</Td>
                      <Td>{a.appliedOn}</Td>
                      <Td className="font-bold">{a.fit}%</Td>
                      <Td>
                        {ready ? (
                          <Badge tone="green">Batch ready</Badge>
                        ) : (
                          <Badge tone="gold">{c.resume.status === 'verified' ? 'Mock pending' : RESUME_STATUS[c.resume.status].label}</Badge>
                        )}
                      </Td>
                      <Td>
                        <Badge tone={st.tone}>{st.label}</Badge>
                      </Td>
                      <Td className="text-right">
                        {['new', 'screening', 'shortlisted'].includes(a.status) && ready ? (
                          <Button size="sm" onClick={() => openShareApplicationModal(app, a)}>
                            <Send size={13} /> Share
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => openCandidateDrawer(app, c)}>
                            Open
                          </Button>
                        )}
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
