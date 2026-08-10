import { Video, Clock, Link2, Plus, CheckCircle2 } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Bar from '../../components/ui/Bar'
import CountUp from '../../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../context/AppContext'
import { openAssignTrackModal, openCandidateDrawer, openScheduleMockModal } from '../../lib/mzobsModals'
import { CANDIDATES, MOCK_COMPLETED, MOCK_INTERVIEWS, candidateOf, trackOf } from '../../lib/mzobsData'

export default function MockInterviews() {
  const app = useApp()

  const awaitingSchedule = CANDIDATES.filter((c) => c.resume.status === 'verified' && c.mock.status === 'not_scheduled')
  const awaitingTrack = CANDIDATES.filter((c) => c.mock.status === 'completed' && !c.track)
  const completed = CANDIDATES.filter((c) => c.mock.status === 'completed')
  const avg = completed.length ? Math.round(completed.reduce((n, c) => n + c.mock.overall, 0) / completed.length) : 0

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mock Interviews</h1>
          <p className="text-sm text-ink-secondary mt-1">
            The verification round our panel runs after a resume clears. The score decides the candidate's skill track and grade.
          </p>
        </div>
        <Button variant="primary" onClick={() => openScheduleMockModal(app, CANDIDATES[0])}>
          <Plus size={15} /> Schedule a round
        </Button>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          ['Scheduled', MOCK_INTERVIEWS.length, 'text-gold-strong'],
          ['Awaiting scheduling', awaitingSchedule.length, 'text-navy'],
          ['Completed', completed.length, 'text-green'],
          ['Average score', avg, 'text-teal'],
        ].map(([label, val, cls]) => (
          <Card key={label} hover pad>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${cls}`}>
              <CountUp value={val} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-[1.35fr_1fr] gap-5 mb-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Upcoming rounds</span>
            <span className="text-xs text-ink-tertiary">{MOCK_INTERVIEWS.length} scheduled</span>
          </CardHead>
          <div className="p-[22px] pt-3.5 flex flex-col gap-3">
            {MOCK_INTERVIEWS.map((iv) => {
              const c = candidateOf(iv.candidateId)
              return (
                <div key={iv.id} className="flex items-center gap-3 p-3 border border-border rounded-xl flex-wrap">
                  <Avatar initials={c.initials} />
                  <div className="flex-1 min-w-[180px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-semibold">{c.name}</span>
                      <Badge tone={iv.status === 'Confirmed' ? 'green' : 'gold'}>{iv.status}</Badge>
                    </div>
                    <div className="text-xs text-ink-tertiary mt-1 flex items-center gap-1">
                      <Clock size={12} /> {iv.when} · Panel {iv.panel}
                    </div>
                    <div className="text-xs text-navy mt-1 flex items-center gap-1">
                      <Link2 size={12} /> {iv.link}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => openScheduleMockModal(app, c)}>
                      Reschedule
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => app.addToast('success', `Joining round with ${c.name}`)}>
                      Join
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Waiting on us</span>
          </CardHead>
          <div className="p-[22px] pt-3.5 flex flex-col gap-4">
            <div>
              <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Resume cleared, no slot booked</div>
              {awaitingSchedule.length === 0 ? (
                <div className="text-[12.5px] text-ink-tertiary">Nobody waiting.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {awaitingSchedule.map((c) => (
                    <div key={c.id} className="flex items-center gap-2.5">
                      <Avatar initials={c.initials} size="sm" />
                      <span className="text-[13px] font-medium flex-1 truncate">{c.name}</span>
                      <Button size="sm" onClick={() => openScheduleMockModal(app, c)}>
                        Schedule
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Scored, track not assigned</div>
              {awaitingTrack.length === 0 ? (
                <div className="text-[12.5px] text-ink-tertiary">All scored candidates have a track.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {awaitingTrack.map((c) => (
                    <div key={c.id} className="flex items-center gap-2.5">
                      <Avatar initials={c.initials} size="sm" />
                      <span className="text-[13px] font-medium flex-1 truncate">{c.name}</span>
                      <Button size="sm" onClick={() => openAssignTrackModal(app, c)}>
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="mb-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Completed rounds</span>
            <span className="text-xs text-ink-tertiary">Score → track → grade</span>
          </CardHead>
          {MOCK_COMPLETED.length === 0 ? (
            <EmptyState icon={Video} title="No completed rounds yet" body="Scores show up here once the panel submits feedback." />
          ) : (
            <TableWrap className="border-none rounded-none">
              <Table columns={['Candidate', 'Date', 'Panel', 'Communication', 'Domain', 'Overall', 'Track assigned', '']}>
                {MOCK_COMPLETED.map((m) => {
                  const c = candidateOf(m.candidateId)
                  const t = trackOf(m.track)
                  return (
                    <Tr key={m.candidateId + m.date}>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={c.initials} size="sm" />
                          <span className="text-[13px] font-semibold">{c.name}</span>
                        </div>
                      </Td>
                      <Td>{m.date}</Td>
                      <Td>{m.panel}</Td>
                      <Td className="w-[120px]">
                        <Bar value={c.mock.comm} thin />
                      </Td>
                      <Td className="w-[120px]">
                        <Bar value={c.mock.domain} thin />
                      </Td>
                      <Td className="font-bold">{m.overall}/100</Td>
                      <Td>
                        <Badge tone={t.tone} dot={false}>
                          {t.label} · {m.grade}
                        </Badge>
                      </Td>
                      <Td className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openCandidateDrawer(app, c)}>
                          Open
                        </Button>
                      </Td>
                    </Tr>
                  )
                })}
              </Table>
            </TableWrap>
          )}
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card pad className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-green-tint text-green flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={17} />
          </div>
          <div>
            <div className="text-[13.5px] font-semibold">Why the round matters</div>
            <p className="text-[13px] text-ink-secondary mt-1">
              A candidate is only eligible for a dispatch batch once they clear this round. The panel score sets their grade, and grade A profiles ship
              first when we send resumes to an employer.
            </p>
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
