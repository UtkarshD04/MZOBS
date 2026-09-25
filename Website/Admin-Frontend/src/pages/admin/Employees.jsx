import { useMemo, useState } from 'react'
import { Users, Search, Plus, Ban, Trash2, AlertTriangle, GraduationCap, Mail, Phone, Copy, Download, ExternalLink, FileText, MapPin, Briefcase } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton, Skeleton } from '../../components/ui/Skeleton'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { downloadFile, resumeViewerSrc } from '../../components/ResumeViewerModal'
import { FILE_BASE_URL } from '../../lib/config'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Field'
import { useApp } from '../../lib/appContext'
import { useEmployeesQuery, useEmployeeQuery, useCreateEmployeeMutation, useSetEmployeeStatusMutation, useDeleteEmployeeMutation } from '../../hooks/useEmployees'

const TABS = ['All', 'Active', 'Suspended']
const TAB_KEYS = [null, 'active', 'suspended']

const CV_STATUS = {
  none: ['gray', 'Not uploaded'],
  pending: ['amber', 'Pending review'],
  verified: ['green', 'Verified'],
  changes: ['gold', 'Changes requested'],
  rejected: ['red', 'Rejected'],
}

function CvBadge({ status }) {
  const [tone, label] = CV_STATUS[status] ?? CV_STATUS.none
  return <Badge tone={tone} className="whitespace-nowrap">{label}</Badge>
}

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')

function ContactField({ icon: Icon, label, value, href, app }) {
  return (
    <div className="rounded-xl border border-border px-3.5 py-3 min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-ink-tertiary">
        <Icon size={11} /> {label}
      </div>
      <div className="flex items-center justify-between gap-2 mt-1">
        {value ? (
          <a href={href} className="text-[14px] font-semibold truncate hover:text-navy">{value}</a>
        ) : (
          <span className="text-[14px] text-ink-tertiary">Not added</span>
        )}
        {value && (
          <button
            onClick={() => navigator.clipboard?.writeText(value).then(() => app.addToast('success', `${label} copied`))}
            title={`Copy ${label.toLowerCase()}`}
            className="text-ink-tertiary hover:text-navy flex-shrink-0"
          >
            <Copy size={13} />
          </button>
        )}
      </div>
    </div>
  )
}

// Name, email and mobile up top, the resume inline underneath — what an
// admin needs to reach a candidate without opening another screen.
function EmployeeDetailModal({ id, app }) {
  const { data: e, isLoading, isError, refetch } = useEmployeeQuery(id)
  const resumeUrl = e?.resume?.url ? `${FILE_BASE_URL}${e.resume.url}` : null

  return (
    <>
      <ModalHead title={e?.name ?? 'Candidate'} onClose={app.closeModal} />
      <ModalBody>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-[50vh] w-full" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-3">
              <ContactField icon={Users} label="Name" value={e.name} app={app} />
              <ContactField icon={Mail} label="Email" value={e.email} href={`mailto:${e.email}`} app={app} />
              <ContactField icon={Phone} label="Mobile" value={e.phone} href={`tel:${e.phone}`} app={app} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-ink-tertiary">
              <span className="flex items-center gap-1"><GraduationCap size={11} /> {e.graduation || 'Graduation not set'} · {e.experience === 'experienced' ? `Experienced${e.experienceYears ? ` (${e.experienceYears} yrs)` : ''}` : 'Fresher'}</span>
              {e.currentCity && <span className="flex items-center gap-1"><MapPin size={11} /> {e.currentCity}</span>}
              {e.designation && <span className="flex items-center gap-1"><Briefcase size={11} /> {e.designation}{e.currentCompany ? ` at ${e.currentCompany}` : ''}</span>}
              <span>Joined {fmtDate(e.createdAt)}</span>
              <span>Last login {fmtDate(e.lastActiveAt)}</span>
            </div>

            <div className="flex items-center justify-between gap-3 mt-5 mb-2">
              <span className="flex items-center gap-1.5 text-[14px] font-semibold"><FileText size={14} /> Resume</span>
              <CvBadge status={e.resume?.status} />
            </div>
            {resumeUrl ? (
              <iframe src={resumeViewerSrc(resumeUrl, e.resume.file)} title={`${e.name} — resume`} className="w-full h-[55vh] block rounded-xl border border-border bg-surface-sunken" />
            ) : (
              <div className="rounded-xl border border-dashed border-border-strong py-10">
                <EmptyState icon={FileText} title="No resume uploaded" body={`${e.name.split(' ')[0]} hasn't uploaded a resume yet.`} />
              </div>
            )}
          </>
        )}
      </ModalBody>
      {resumeUrl && (
        <ModalFoot>
          <Button variant="secondary" size="sm" onClick={() => window.open(resumeUrl, '_blank', 'noopener')}>
            <ExternalLink size={14} /> Open in new tab
          </Button>
          <Button variant="secondary" size="sm" onClick={() => downloadFile(resumeUrl)}>
            <Download size={14} /> Download
          </Button>
        </ModalFoot>
      )}
    </>
  )
}

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
          <p className="text-sm text-ink-secondary mt-1">Candidate accounts on the platform — click a row for contact details and the resume.</p>
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
          <Card className="overflow-hidden">
            <TableWrap className="border-none rounded-none">
              <Table columns={['Candidate', 'Contact', 'Resume', 'Subscription', 'Last login', 'Status', '']}>
                {filtered.map((e) => (
                  <Tr key={e.id} onClick={() => app.openModal(<EmployeeDetailModal id={e.id} app={app} />, true)}>
                    <Td>
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {e.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{e.name}</div>
                          <div className="text-xs text-ink-tertiary">{e.graduation || 'Not set'} · {e.experience === 'experienced' ? 'Experienced' : 'Fresher'}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div className="text-ink-secondary">{e.email}</div>
                      <div className="text-xs text-ink-tertiary whitespace-nowrap mt-0.5">{e.phone || 'No mobile'}</div>
                    </Td>
                    <Td><CvBadge status={e.resume?.status} /></Td>
                    <Td className="whitespace-nowrap">{e.subscription?.status === 'paid' ? <b>Paid ₹{e.subscription.amount}</b> : <span className="text-ink-tertiary">Unpaid</span>}</Td>
                    <Td className="text-ink-secondary whitespace-nowrap">{fmtDate(e.lastActiveAt)}</Td>
                    <Td><Badge className="whitespace-nowrap" tone={e.status === 'active' ? 'green' : 'red'}>{e.status === 'active' ? 'Active' : 'Suspended'}</Badge></Td>
                    <Td>
                      {/* The row opens the detail view; these buttons act on the account without opening it. */}
                      <div className="flex justify-end gap-1.5" onClick={(ev) => ev.stopPropagation()}>
                        <Button size="sm" iconOnly onClick={() => toggleStatus(e)} disabled={setStatus.isPending} title={e.status === 'suspended' ? 'Reactivate' : 'Suspend'} aria-label={`${e.status === 'suspended' ? 'Reactivate' : 'Suspend'} ${e.name}`}>
                          <Ban size={14} />
                        </Button>
                        <Button variant="danger" size="sm" iconOnly title="Delete" aria-label={`Delete ${e.name}`} onClick={() => app.openModal(<DeleteEmployeeModal app={app} employee={e} onDone={refetch} />)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Table>
            </TableWrap>
          </Card>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
