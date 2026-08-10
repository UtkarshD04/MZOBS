import { UserPlus } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../context/AppContext'
import { CANDIDATES, COMPANIES, OPS_TEAM } from '../../lib/mzobsData'

const LOAD = {
  'Resume Verification Lead': () => `${CANDIDATES.filter((c) => c.resume.status === 'pending').length} resumes queued`,
  'Interview Panel': () => `${CANDIDATES.filter((c) => c.mock.status === 'scheduled').length} rounds scheduled`,
  'Compliance & KYC': () => `${COMPANIES.filter((c) => c.status === 'pending').length} companies pending`,
  'Employer Success': () => `${COMPANIES.filter((c) => c.status === 'verified').length} accounts owned`,
  'Operations Manager': () => 'All queues',
}

export default function Team() {
  const app = useApp()

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mzobs Team</h1>
          <p className="text-sm text-ink-secondary mt-1">Who runs each queue in the operations portal.</p>
        </div>
        <Button variant="primary" onClick={() => app.addToast('success', 'Invite link copied')}>
          <UserPlus size={15} /> Invite teammate
        </Button>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">{OPS_TEAM.length} team members</span>
          </CardHead>
          <TableWrap className="border-none rounded-none">
            <Table columns={['Member', 'Role', 'Current load', 'Status', 'Last active']}>
              {OPS_TEAM.map((m) => (
                <Tr key={m.email}>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={m.initials} size="sm" />
                      <div>
                        <div className="text-[13px] font-semibold">{m.name}</div>
                        <div className="text-[11px] text-ink-tertiary">{m.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{m.role}</Td>
                  <Td className="text-ink-secondary">{LOAD[m.role]?.() ?? '—'}</Td>
                  <Td>
                    <Badge tone={m.status === 'active' ? 'green' : 'gold'}>{m.status === 'active' ? 'Active' : 'Invited'}</Badge>
                  </Td>
                  <Td className="text-ink-tertiary">{m.lastActive}</Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
