import { useMemo, useState } from 'react'
import { Video, Clock, Link2, Plus, CheckCircle2 } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Bar from '../../components/ui/Bar'
import Chip from '../../components/ui/Chip'
import CountUp from '../../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import { useResumeQueueQuery } from '../../hooks/useResumes'
import { useMockInterviewsQuery, useScheduleMockInterviewMutation, useCompleteMockInterviewMutation, useAssignSkillTrackMutation } from '../../hooks/useMockInterviews'

const TRACKS = { analytics: 'Analytics', design: 'Design', sales: 'Sales', marketing: 'Marketing', hr: 'HR', support: 'Support', tech: 'Tech', ops: 'Ops' }

export function ScheduleMockModal({ app, employee, onDone }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('11:00')
  const [panel, setPanel] = useState('')
  const [note, setNote] = useState('')
  const schedule = useScheduleMockInterviewMutation()

  function submit() {
    if (!date || !panel) return
    schedule.mutate(
      { employeeId: employee.id, when: new Date(`${date}T${time}`).toISOString(), panel, mode: 'Video', duration: '30 min', link: '', panelRole: 'Interview Panel' },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast('success', `Mock interview scheduled with ${employee.name}`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title={`Schedule mock interview — ${employee.name}`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex gap-3 items-center mb-4">
          <Avatar initials={employee.name?.slice(0, 2)?.toUpperCase()} />
          <div>
            <div className="text-[15px] font-semibold">{employee.name}</div>
            <div className="text-xs text-ink-tertiary">Resume {employee.resume?.status}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Time">
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </Field>
        </div>
        <Field label="Panel member">
          <Input value={panel} onChange={(e) => setPanel(e.target.value)} placeholder="Panel member name" />
        </Field>
        <Field label="Note for the panel" optional>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={schedule.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={schedule.isPending || !date || !panel}>
          {schedule.isPending ? 'Scheduling...' : 'Schedule & notify candidate'}
        </Button>
      </ModalFoot>
    </>
  )
}

function CompleteMockModal({ app, interview, onDone }) {
  const [comm, setComm] = useState(70)
  const [domain, setDomain] = useState(70)
  const [attitude, setAttitude] = useState(70)
  const complete = useCompleteMockInterviewMutation()
  const overall = Math.round((comm + domain + attitude) / 3)

  function submit() {
    complete.mutate(
      { id: interview.id, scores: { comm, domain, attitude, overall } },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast('success', `Scores saved for ${interview.employee?.name}`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title={`Complete round — ${interview.employee?.name}`} onClose={app.closeModal} />
      <ModalBody>
        {[
          ['Communication', comm, setComm],
          ['Domain knowledge', domain, setDomain],
          ['Attitude & ownership', attitude, setAttitude],
        ].map(([label, val, setter]) => (
          <Field key={label} label={`${label} (${val}/100)`}>
            <input type="range" min={0} max={100} value={val} onChange={(e) => setter(Number(e.target.value))} className="w-full accent-navy" />
          </Field>
        ))}
        <div className="text-[13px] text-ink-secondary">
          Overall: <b className="text-ink">{overall}/100</b>
        </div>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={complete.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={complete.isPending}>
          {complete.isPending ? 'Saving...' : 'Save scores'}
        </Button>
      </ModalFoot>
    </>
  )
}

export function AssignTrackModal({ app, employee, onDone }) {
  const [track, setTrack] = useState(employee.skillTrack?.key || 'analytics')
  const [grade, setGrade] = useState(employee.skillTrack?.grade || 'B')
  const assign = useAssignSkillTrackMutation()

  function submit() {
    assign.mutate(
      { employeeId: employee.id, key: track, label: TRACKS[track], grade },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast('success', `${employee.name} assigned to ${TRACKS[track]} · Grade ${grade}`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title={`Assign skill track — ${employee.name}`} onClose={app.closeModal} />
      <ModalBody>
        <Field label="Skill track">
          <div className="flex flex-wrap gap-2">
            {Object.entries(TRACKS).map(([k, label]) => (
              <Chip key={k} selected={track === k} onClick={() => setTrack(k)}>
                {label}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Grade">
          <div className="flex gap-2">
            {['A', 'B', 'C'].map((g) => (
              <Chip key={g} selected={grade === g} onClick={() => setGrade(g)}>
                Grade {g}
              </Chip>
            ))}
          </div>
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={assign.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={assign.isPending}>
          {assign.isPending ? 'Saving...' : 'Save assignment'}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function MockInterviews() {
  const app = useApp()
  const { data: employees = [], isLoading: empLoading, isError: empError, refetch: refetchEmp } = useResumeQueueQuery({})
  const { data: mockInterviews = [], isLoading: mockLoading, isError: mockError, refetch: refetchMock } = useMockInterviewsQuery({})

  const mockByEmployee = useMemo(() => {
    const map = new Map()
    for (const m of mockInterviews) map.set(m.employeeId ?? m.employee?.id, m)
    return map
  }, [mockInterviews])

  if (empLoading || mockLoading) return <PageSkeleton />
  if (empError || mockError) return <ErrorState onRetry={() => (empError ? refetchEmp() : refetchMock())} />

  const scheduled = mockInterviews.filter((m) => m.status === 'scheduled')
  const completed = mockInterviews.filter((m) => m.status === 'completed')
  const awaitingSchedule = employees.filter((c) => c.resume?.status === 'verified' && !mockByEmployee.has(c.id))
  const awaitingTrack = completed.filter((m) => !employees.find((e) => e.id === (m.employeeId ?? m.employee?.id))?.skillTrack?.key)
  const avg = completed.length ? Math.round(completed.reduce((n, m) => n + (m.scores?.overall ?? 0), 0) / completed.length) : 0

  const refetchAll = () => {
    refetchEmp()
    refetchMock()
  }

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mock Interviews</h1>
          <p className="text-sm text-ink-secondary mt-1">
            The verification round our panel runs after a resume clears. The score decides the candidate's skill track and grade.
          </p>
        </div>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          ['Scheduled', scheduled.length, 'text-gold-strong'],
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
            <span className="text-xs text-ink-tertiary">{scheduled.length} scheduled</span>
          </CardHead>
          <div className="p-[22px] pt-3.5 flex flex-col gap-3">
            {scheduled.length === 0 && <p className="text-[13px] text-ink-secondary">Nothing scheduled.</p>}
            {scheduled.map((iv) => (
              <div key={iv.id} className="flex items-center gap-3 p-3 border border-border rounded-xl flex-wrap">
                <Avatar initials={iv.employee?.name?.slice(0, 2)?.toUpperCase()} />
                <div className="flex-1 min-w-[180px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[15px] font-semibold">{iv.employee?.name}</span>
                    <Badge tone="gold">Scheduled</Badge>
                  </div>
                  <div className="text-xs text-ink-tertiary mt-1 flex items-center gap-1">
                    <Clock size={12} /> {iv.when ? new Date(iv.when).toLocaleString('en-IN') : ''} · Panel {iv.panel}
                  </div>
                  {iv.link && (
                    <div className="text-xs text-navy mt-1 flex items-center gap-1">
                      <Link2 size={12} /> {iv.link}
                    </div>
                  )}
                </div>
                <Button variant="primary" size="sm" onClick={() => app.openModal(<CompleteMockModal app={app} interview={iv} onDone={refetchAll} />)}>
                  Mark completed
                </Button>
              </div>
            ))}
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
                      <Avatar initials={c.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                      <span className="text-[13px] font-medium flex-1 truncate">{c.name}</span>
                      <Button size="sm" onClick={() => app.openModal(<ScheduleMockModal app={app} employee={c} onDone={refetchAll} />)}>
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
                  {awaitingTrack.map((m) => (
                    <div key={m.id} className="flex items-center gap-2.5">
                      <Avatar initials={m.employee?.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                      <span className="text-[13px] font-medium flex-1 truncate">{m.employee?.name}</span>
                      <Button
                        size="sm"
                        onClick={() =>
                          app.openModal(
                            <AssignTrackModal
                              app={app}
                              employee={employees.find((e) => e.id === (m.employeeId ?? m.employee?.id)) ?? { id: m.employeeId ?? m.employee?.id, name: m.employee?.name }}
                              onDone={refetchAll}
                            />
                          )
                        }
                      >
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
          {completed.length === 0 ? (
            <EmptyState icon={Video} title="No completed rounds yet" body="Scores show up here once the panel submits feedback." />
          ) : (
            <TableWrap className="border-none rounded-none">
              <Table columns={['Candidate', 'Panel', 'Communication', 'Domain', 'Overall', 'Track assigned']}>
                {completed.map((m) => {
                  const emp = employees.find((e) => e.id === (m.employeeId ?? m.employee?.id))
                  return (
                    <Tr key={m.id}>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={m.employee?.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                          <span className="text-[13px] font-semibold">{m.employee?.name}</span>
                        </div>
                      </Td>
                      <Td>{m.panel}</Td>
                      <Td className="w-[120px]">
                        <Bar value={m.scores?.comm ?? 0} thin />
                      </Td>
                      <Td className="w-[120px]">
                        <Bar value={m.scores?.domain ?? 0} thin />
                      </Td>
                      <Td className="font-bold">{m.scores?.overall ?? 0}/100</Td>
                      <Td>
                        {emp?.skillTrack?.key ? (
                          <Badge tone="navy" dot={false}>
                            {TRACKS[emp.skillTrack.key] ?? emp.skillTrack.key} · {emp.skillTrack.grade}
                          </Badge>
                        ) : (
                          <span className="text-ink-tertiary text-[12.5px]">Unassigned</span>
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
