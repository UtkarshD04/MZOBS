import { useMemo, useState } from 'react'
import { Users, Search, Plus, Ban, Trash2, AlertTriangle, GraduationCap, Mail, Phone } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import { useEmployeesQuery, useCreateEmployeeMutation, useSetEmployeeStatusMutation, useDeleteEmployeeMutation } from '../../hooks/useEmployees'

const TABS = ['All', 'Active', 'Suspended']
const TAB_KEYS = [null, 'active', 'suspended']

function CreateEmployeeModal({ app, onDone }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [graduation, setGraduation] = useState('')
  const [experience, setExperience] = useState('fresher')
  const [result, setResult] = useState(null)
  const create = useCreateEmployeeMutation()

  function submit() {
    create.mutate(
      { name, email, phone, graduation, experience },
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
        <ModalHead title="Employee account created" onClose={app.closeModal} />
        <ModalBody>
          <p className="text-[13px] text-ink-secondary mb-4">
            <b className="text-ink">{result.employee.name}</b>'s account has been created. There's no automated invite email yet — share this temporary
            password with them directly.
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
      <ModalHead title="Add an employee account" onClose={app.closeModal} />
      <ModalBody>
        <Field label="Full name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Phone" optional>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label="Graduation">
          <Input value={graduation} onChange={(e) => setGraduation(e.target.value)} placeholder="e.g. B.Tech Computer Science, 2023" />
        </Field>
        <Field label="Experience">
          <Select value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option value="fresher">Fresher</option>
            <option value="experienced">Experienced</option>
          </Select>
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={create.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={create.isPending || !name || !email || !graduation}>
          {create.isPending ? 'Creating...' : 'Create account'}
        </Button>
      </ModalFoot>
    </>
  )
}

function DeleteEmployeeModal({ app, employee, onDone }) {
  const del = useDeleteEmployeeMutation()

  function submit() {
    del.mutate(employee.id, {
      onSuccess: () => {
        app.closeModal()
        app.addToast('error', `${employee.name} deleted`)
        onDone?.()
      },
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
    })
  }

  return (
    <>
      <ModalHead title={`Delete ${employee.name}?`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-tint text-red">
            <AlertTriangle size={20} />
          </div>
          <p className="text-[13px] text-ink-secondary">
            This permanently removes {employee.name}'s account, applications, mock interviews and in-app notifications. This cannot be undone. Payment
            records are kept as history.
          </p>
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

export default function Employees() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const status = TAB_KEYS[tab]
  const { data: rows = [], isLoading, isError, refetch } = useEmployeesQuery(status ? { status } : {})
  const { data: allRows = [] } = useEmployeesQuery({})
  const setStatus = useSetEmployeeStatusMutation()

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter((e) => `${e.name} ${e.email}`.toLowerCase().includes(q))
  }, [rows, query])

  const counts = TAB_KEYS.map((k) => (k ? allRows.filter((e) => e.status === k).length : allRows.length))

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  function toggleStatus(e) {
    const nextStatus = e.status === 'suspended' ? 'active' : 'suspended'
    setStatus.mutate(
      { id: e.id, status: nextStatus },
      {
        onSuccess: () => app.addToast(nextStatus === 'suspended' ? 'error' : 'success', `${e.name} ${nextStatus === 'suspended' ? 'suspended' : 'reactivated'}`),
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-sm text-ink-secondary mt-1">Candidate accounts on the platform — suspend or delete access directly.</p>
        </div>
        <Button variant="primary" onClick={() => app.openModal(<CreateEmployeeModal app={app} onDone={refetch} />)}>
          <Plus size={15} /> Add employee
        </Button>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-3 gap-4 mb-5">
        {TABS.map((label, i) => (
          <Card key={label} hover pad onClick={() => setTab(i)} className="cursor-pointer">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${i === 0 ? 'text-navy' : i === 1 ? 'text-green' : 'text-red'}`}>
              <CountUp value={counts[i]} />
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
            placeholder="Search name or email"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={Users} title="No employees here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((e) => (
              <Card key={e.id} hover pad className="flex flex-col">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-[11px] bg-navy-tint text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {e.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[15px] font-semibold">{e.name}</span>
                    <div className="text-xs text-ink-tertiary mt-1 flex items-center gap-1">
                      <Mail size={11} /> {e.email}
                    </div>
                    {e.phone && (
                      <div className="text-xs text-ink-tertiary mt-0.5 flex items-center gap-1">
                        <Phone size={11} /> {e.phone}
                      </div>
                    )}
                  </div>
                  <Badge tone={e.status === 'active' ? 'green' : 'red'}>{e.status === 'active' ? 'Active' : 'Suspended'}</Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-ink-tertiary mt-3">
                  <GraduationCap size={11} /> {e.graduation || 'Not set'} · {e.experience === 'experienced' ? 'Experienced' : 'Fresher'}
                </div>

                <div className="flex items-center gap-4 mt-3 text-[12.5px]">
                  <span className="text-ink-secondary">
                    Subscription: <b className="text-ink">{e.subscription?.status === 'paid' ? 'Active' : 'Unpaid'}</b>
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <Button size="sm" onClick={() => toggleStatus(e)} disabled={setStatus.isPending}>
                    <Ban size={14} /> {e.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => app.openModal(<DeleteEmployeeModal app={app} employee={e} onDone={refetch} />)}>
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
