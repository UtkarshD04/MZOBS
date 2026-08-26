import { useMemo, useState } from 'react'
import { UserPlus, AlertTriangle, Trash2 } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import { useTeamQuery, useCreateTeammateMutation, useUpdateTeammateMutation, useDeleteTeammateMutation } from '../../hooks/useTeam'
import { useResumeStatsQuery } from '../../hooks/useResumes'
import { useMockInterviewStatsQuery } from '../../hooks/useMockInterviews'
import { useMeQuery } from '../../hooks/useAuth'

const RESUME_STAGES = [
  { key: 'pending', label: 'Pending', tone: 'gold' },
  { key: 'verified', label: 'Verified', tone: 'green' },
  { key: 'changes', label: 'Changes', tone: 'navy' },
  { key: 'rejected', label: 'Rejected', tone: 'red' },
]

const ROLES = ['Operations Manager', 'Resume Verification Lead', 'Interview Panel', 'Employer Success', 'Compliance & KYC']
const ACCESS_LEVELS = [
  { value: 'staff', label: 'HR — assigned resumes only' },
  { value: 'admin', label: 'Admin — full panel access' },
]

function InviteTeammateModal({ app, onDone }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(ROLES[1])
  const [accessLevel, setAccessLevel] = useState('staff')
  const [result, setResult] = useState(null)
  const create = useCreateTeammateMutation()

  function submit() {
    create.mutate(
      { name, email, role, accessLevel },
      {
        onSuccess: (data) => {
          setResult(data)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  if (result) {
    return (
      <>
        <ModalHead title="Teammate added" onClose={app.closeModal} />
        <ModalBody>
          <p className="text-[13px] text-ink-secondary mb-4">
            <b className="text-ink">{result.staff.name}</b> has been added as {result.staff.role}. There's no automated invite email yet — share this
            temporary password with them directly.
          </p>
          <div className="rounded-xl border border-border bg-surface-sunken p-4 text-center">
            <div className="text-xs text-ink-tertiary mb-1">Temporary password</div>
            <div className="text-[17px] font-bold tracking-wide font-mono">{result.tempPassword}</div>
          </div>
        </ModalBody>
        <ModalFoot>
          <Button
            variant="primary"
            onClick={() => {
              navigator.clipboard?.writeText(result.tempPassword)
              app.addToast('success', 'Password copied')
              app.closeModal()
            }}
          >
            Copy & close
          </Button>
        </ModalFoot>
      </>
    )
  }

  return (
    <>
      <ModalHead title="Create staff account" onClose={app.closeModal} />
      <ModalBody>
        <Field label="Full name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Role">
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </Field>
        <Field label="Access level" hint="Admin can create accounts, approve companies, see payments and every resume. HR only see resumes assigned to them.">
          <Select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
            {ACCESS_LEVELS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </Select>
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={create.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={create.isPending || !name || !email}>
          {create.isPending ? 'Adding...' : 'Add teammate'}
        </Button>
      </ModalFoot>
    </>
  )
}

function DeleteTeammateModal({ app, member, onDone }) {
  const del = useDeleteTeammateMutation()

  function submit() {
    del.mutate(member.id, {
      onSuccess: () => {
        app.closeModal()
        app.addToast('error', `${member.name} deleted`)
        onDone?.()
      },
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
    })
  }

  return (
    <>
      <ModalHead title={`Delete ${member.name}?`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-tint text-red">
            <AlertTriangle size={20} />
          </div>
          <p className="text-[13px] text-ink-secondary">This permanently removes {member.name}'s staff account. This cannot be undone.</p>
        </div>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={del.isPending}>
          Cancel
        </Button>
        <Button variant="danger" onClick={submit} disabled={del.isPending}>
          {del.isPending ? 'Deleting...' : 'Delete account'}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function Team() {
  const app = useApp()
  const { data: team = [], isLoading, isError, refetch } = useTeamQuery()
  const { data: resumeStats } = useResumeStatsQuery()
  const { data: mockStats } = useMockInterviewStatsQuery()
  const { data: me } = useMeQuery()
  const updateTeammate = useUpdateTeammateMutation()

  const statsByStaff = useMemo(() => {
    const map = new Map()
    for (const row of resumeStats?.perStaff ?? []) map.set(row.staffId, row)
    return map
  }, [resumeStats])

  const mockStatsByStaff = useMemo(() => {
    const map = new Map()
    for (const row of mockStats?.perStaff ?? []) map.set(row.staffId, row)
    return map
  }, [mockStats])

  const adminCount = useMemo(() => team.filter((m) => m.accessLevel === 'admin').length, [team])
  const hrCount = team.length - adminCount

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  function toggleStatus(m) {
    const nextStatus = m.status === 'disabled' ? 'active' : 'disabled'
    updateTeammate.mutate(
      { id: m.id, status: nextStatus },
      {
        onSuccess: () => app.addToast('success', `${m.name} ${nextStatus === 'disabled' ? 'disabled' : 'reactivated'}`),
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  function toggleAccess(m) {
    const nextAccess = m.accessLevel === 'admin' ? 'staff' : 'admin'
    updateTeammate.mutate(
      { id: m.id, accessLevel: nextAccess },
      {
        onSuccess: () => app.addToast('success', `${m.name} is now ${nextAccess === 'admin' ? 'an admin' : 'HR-only'}`),
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Accounts</h1>
          <p className="text-sm text-ink-secondary mt-1">Create HR and Operations accounts, and control who has admin access.</p>
        </div>
        <Button variant="primary" onClick={() => app.openModal(<InviteTeammateModal app={app} onDone={refetch} />)}>
          <UserPlus size={15} /> Create staff account
        </Button>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Team members</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={team.length} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Admins</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-gold-strong">
            <CountUp value={adminCount} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">HR (resume-only)</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-green">
            <CountUp value={hrCount} />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">{team.length} team members</span>
          </CardHead>
          <TableWrap className="border-none rounded-none">
            <Table columns={['Member', 'Role', 'Access', 'Resumes by stage', 'Mock interviews', 'Status', 'Last active', '']}>
              {team.map((m) => {
                const stat = statsByStaff.get(m.id)
                const mockStat = mockStatsByStaff.get(m.id)
                return (
                  <Tr key={m.id}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={m.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                        <div>
                          <div className="text-[13px] font-semibold">{m.name}</div>
                          <div className="text-[11px] text-ink-tertiary">{m.email}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>{m.role}</Td>
                    <Td>
                      <button onClick={() => toggleAccess(m)} disabled={updateTeammate.isPending} className="cursor-pointer">
                        <Badge tone={m.accessLevel === 'admin' ? 'navy' : 'gray'}>{m.accessLevel === 'admin' ? 'Admin' : 'HR'}</Badge>
                      </button>
                    </Td>
                    <Td>
                      {stat && stat.total > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {RESUME_STAGES.filter((s) => stat[s.key] > 0).map((s) => (
                            <Badge key={s.key} tone={s.tone} dot={false}>
                              {s.label} {stat[s.key]}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-ink-tertiary text-[12.5px]">No resumes assigned</span>
                      )}
                    </Td>
                    <Td>
                      {mockStat && mockStat.total > 0 ? (
                        <span className="text-[12.5px]">
                          <b className="text-green">{mockStat.completed}</b> completed ·{' '}
                          <span className="text-ink-tertiary">{mockStat.scheduled} scheduled</span>
                        </span>
                      ) : (
                        <span className="text-ink-tertiary text-[12.5px]">None yet</span>
                      )}
                    </Td>
                    <Td>
                      <Badge tone={m.status === 'active' ? 'green' : m.status === 'disabled' ? 'red' : 'gold'}>
                        {m.status === 'active' ? 'Active' : m.status === 'disabled' ? 'Disabled' : 'Invited'}
                      </Badge>
                    </Td>
                    <Td className="text-ink-tertiary">{m.lastActiveAt ? new Date(m.lastActiveAt).toLocaleDateString('en-IN') : 'Never'}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => toggleStatus(m)} disabled={updateTeammate.isPending}>
                          {m.status === 'disabled' ? 'Reactivate' : 'Disable'}
                        </Button>
                        {m.id !== me?.id && (
                          <Button variant="danger" size="sm" iconOnly title="Delete account" onClick={() => app.openModal(<DeleteTeammateModal app={app} member={m} onDone={refetch} />)}>
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </Td>
                  </Tr>
                )
              })}
            </Table>
          </TableWrap>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
