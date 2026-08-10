import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info, MoreHorizontal, Trash2, UserCog, UserPlus, Users2 } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import { Field, Input, Select } from '../components/ui/Field'
import { TeamStatusBadge } from '../components/ui/StatusBadge'
import Badge from '../components/ui/Badge'
import { Table, TableWrap, Td, Tr } from '../components/ui/Table'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { TableSkeleton } from '../components/ui/Skeleton'
import Modal from '../components/ui/Modal'
import Dropdown from '../components/ui/Dropdown'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useInviteMember, useRemoveMember, useTeamQuery, useUpdateMemberRole } from '../hooks/useTeam'
import { inviteSchema, type InviteFormValues } from '../schemas/teamSchema'
import type { TeamRole } from '../types'

const ROLE_PERMISSIONS: Record<TeamRole, string> = {
  Admin: 'Full access — manage jobs, candidates, billing and team',
  'Hiring Manager': 'Manage jobs, review candidates, schedule interviews',
  Recruiter: 'Post jobs, review candidates, send offers',
  Interviewer: 'View assigned candidates and submit interview feedback',
}

export default function TeamMembers() {
  const { data: team = [], isLoading, isError, refetch } = useTeamQuery()
  const inviteMember = useInviteMember()
  const updateRole = useUpdateMemberRole()
  const removeMember = useRemoveMember()

  const [inviteOpen, setInviteOpen] = useState(false)
  const [removeId, setRemoveId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormValues>({ resolver: zodResolver(inviteSchema), defaultValues: { name: '', email: '', role: 'Recruiter' } })

  function onInvite(values: InviteFormValues) {
    inviteMember.mutate(values, { onSuccess: () => { setInviteOpen(false); reset() } })
  }

  return (
    <div>
      <PageHeader
        title="Team Members"
        subtitle="Manage who at your company can access hiring on Mzobs."
        actions={
          <Button variant="primary" onClick={() => setInviteOpen(true)}>
            <UserPlus size={16} /> Invite Member
          </Button>
        }
      />

      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : team.length === 0 ? (
        <Card>
          <EmptyState icon={Users2} title="No team members yet" body="Invite your hiring managers and recruiters to collaborate." />
        </Card>
      ) : (
        <TableWrap>
          <Table columns={['Member', 'Role', 'Status', 'Last Active', '']}>
            {team.map((m) => (
              <Tr key={m.id}>
                <Td>
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={m.initials} size="sm" />
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-[12px] text-ink-tertiary">{m.email}</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <Select value={m.role} onChange={(e) => updateRole.mutate({ id: m.id, role: e.target.value as TeamRole })} className="!h-8 !text-[12.5px] w-40">
                    <option value="Admin">Admin</option>
                    <option value="Hiring Manager">Hiring Manager</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Interviewer">Interviewer</option>
                  </Select>
                </Td>
                <Td><TeamStatusBadge status={m.status} /></Td>
                <Td className="text-ink-tertiary">{m.lastActive}</Td>
                <Td className="text-right">
                  <Dropdown
                    trigger={
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-tertiary hover:bg-surface-hover hover:text-ink">
                        <MoreHorizontal size={16} />
                      </button>
                    }
                    items={[
                      { label: 'Resend invite', icon: <UserCog size={14} />, disabled: m.status !== 'invited' },
                      'divider',
                      { label: 'Remove member', icon: <Trash2 size={14} />, danger: true, onClick: () => setRemoveId(m.id) },
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </Table>
        </TableWrap>
      )}

      <Card className="mt-5">
        <CardHead><CardTitle>Roles & Permissions</CardTitle></CardHead>
        <CardBody className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {(Object.keys(ROLE_PERMISSIONS) as TeamRole[]).map((role) => (
            <div key={role} className="flex gap-3 p-3.5 rounded-xl border border-border">
              <span className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center flex-shrink-0"><Info size={15} /></span>
              <div>
                <div className="flex items-center gap-2"><span className="text-[13px] font-semibold">{role}</span><Badge tone="navy" dot={false}>{team.filter((m) => m.role === role).length}</Badge></div>
                <div className="text-[12px] text-ink-secondary mt-1 leading-relaxed">{ROLE_PERMISSIONS[role]}</div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite Team Member"
        subtitle="They'll receive an email invite to join your hiring workspace."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" loading={inviteMember.isPending} onClick={handleSubmit(onInvite)}>Send Invite</Button>
          </>
        }
      >
        <Field label="Full Name" error={errors.name?.message}>
          <Input placeholder="e.g. Nikhil Verma" error={!!errors.name} {...register('name')} />
        </Field>
        <Field label="Work Email" error={errors.email?.message}>
          <Input type="email" placeholder="name@company.com" error={!!errors.email} {...register('email')} />
        </Field>
        <Field label="Role">
          <Select {...register('role')}>
            <option value="Admin">Admin</option>
            <option value="Hiring Manager">Hiring Manager</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Interviewer">Interviewer</option>
          </Select>
        </Field>
      </Modal>

      <ConfirmDialog
        open={!!removeId}
        onClose={() => setRemoveId(null)}
        onConfirm={() => { if (removeId) removeMember.mutate(removeId); setRemoveId(null) }}
        title="Remove this member?"
        body="They will immediately lose access to your company's hiring workspace."
        confirmLabel="Remove Member"
        loading={removeMember.isPending}
      />
    </div>
  )
}
