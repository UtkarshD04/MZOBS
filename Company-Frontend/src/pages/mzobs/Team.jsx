import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import { useTeamQuery, useCreateTeammateMutation } from '../../hooks/useTeam'

const ROLES = ['Operations Manager', 'Resume Verification Lead', 'Interview Panel', 'Employer Success', 'Compliance & KYC']

function InviteTeammateModal({ app, onDone }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(ROLES[1])
  const [result, setResult] = useState(null)
  const create = useCreateTeammateMutation()

  function submit() {
    create.mutate(
      { name, email, role },
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
      <ModalHead title="Invite teammate" onClose={app.closeModal} />
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

export default function Team() {
  const app = useApp()
  const { data: team = [], isLoading, isError, refetch } = useTeamQuery()

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mzobs Team</h1>
          <p className="text-sm text-ink-secondary mt-1">Who runs each queue in the operations portal.</p>
        </div>
        <Button variant="primary" onClick={() => app.openModal(<InviteTeammateModal app={app} onDone={refetch} />)}>
          <UserPlus size={15} /> Invite teammate
        </Button>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">{team.length} team members</span>
          </CardHead>
          <TableWrap className="border-none rounded-none">
            <Table columns={['Member', 'Role', 'Status', 'Last active']}>
              {team.map((m) => (
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
                    <Badge tone={m.status === 'active' ? 'green' : 'gold'}>{m.status === 'active' ? 'Active' : 'Invited'}</Badge>
                  </Td>
                  <Td className="text-ink-tertiary">{m.lastActiveAt ? new Date(m.lastActiveAt).toLocaleDateString('en-IN') : 'Never'}</Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
