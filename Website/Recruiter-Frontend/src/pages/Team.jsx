import { useCallback, useEffect, useState } from 'react'
import { Check, Minus, UserPlus, Users } from 'lucide-react'
import { Button, EmptyState, Modal } from '../components/ui'
import { ErrorState, Field, ListSkeleton, PageShell, ago, fmtDateTime, inputCls } from '../components/rc'
import { useWorkspace } from '../store/workspace'
import { apiMessage, inviteMember, listAudit, listTeam, getRoleMatrix, removeMember, setMemberRole, usePermissions } from '../services/recruiterService'
import { IS_DEMO } from '../lib/config'

const ROLE_BLURB = {
  Owner: 'Full control, including other Owners.',
  Admin: 'Everything except changing Owner access.',
  Recruiter: 'Jobs, applicants, interviews, offers, unlocks.',
  Interviewer: 'Only candidates they interview; submits scorecards.',
  Finance: 'Credits, invoices and billing.',
}

function Members({ can, role: myRole, toast }) {
  const [members, setMembers] = useState(null)
  const [roles, setRoles] = useState([])
  const [error, setError] = useState('')
  const [inviting, setInviting] = useState(false)
  const [f, setF] = useState({ name: '', email: '', role: 'Recruiter' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const manage = can('team.manage')

  const load = useCallback(() => {
    listTeam().then(setMembers).catch((e) => setError(apiMessage(e, 'Could not load the team.')))
  }, [])
  useEffect(() => {
    load()
    getRoleMatrix().then((m) => setRoles(m.roles)).catch(() => {})
  }, [load])

  const assignable = roles.filter((r) => r !== 'Owner' || myRole === 'Owner')
  const act = async (fn, ok) => {
    try {
      await fn()
      toast(ok)
      load()
    } catch (e) {
      toast(apiMessage(e), { tone: 'warn' })
    }
  }
  const invite = async () => {
    setBusy(true)
    setErr('')
    try {
      await inviteMember(f)
      toast(`${f.name} added to the team`)
      setInviting(false)
      setF({ name: '', email: '', role: 'Recruiter' })
      load()
    } catch (e) {
      setErr(apiMessage(e))
    } finally {
      setBusy(false)
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />
  if (!members) return <ListSkeleton />
  return (
    <>
      <div className="mb-3 flex justify-end">{manage && <Button variant="primary" size="sm" icon={UserPlus} onClick={() => setInviting(true)}>Add team member</Button>}</div>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead className="border-b border-line bg-[#faf9f6] text-[11.5px] font-bold uppercase tracking-[0.04em] text-ink-2"><tr><th className="px-4 py-2">Member</th><th className="px-4 py-2">Role</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Last active</th><th /></tr></thead>
          <tbody className="divide-y divide-line-2">
            {members.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-2.5"><b className="block font-semibold">{m.name}</b>{m.email && <span className="text-[12px] text-muted">{m.email}</span>}</td>
                <td className="px-4 py-2.5">
                  {manage ? (
                    <select aria-label={`Role for ${m.name}`} value={m.role} onChange={(e) => act(() => setMemberRole(m.id, e.target.value), `${m.name} is now ${e.target.value}`)} className={`${inputCls} w-40`}>
                      {[...new Set([m.role, ...assignable])].map((r) => <option key={r} value={r} disabled={r === 'Hiring Manager'}>{r}</option>)}
                    </select>
                  ) : m.role}
                </td>
                <td className="px-4 py-2.5 capitalize text-ink-2">{m.status}</td>
                <td className="px-4 py-2.5 text-muted">{m.lastActive || '—'}</td>
                <td className="px-4 py-2.5 text-right">{manage && <button type="button" onClick={() => window.confirm(`Remove ${m.name} from the team?`) && act(() => removeMember(m.id), `${m.name} removed`)} className="text-[12.5px] font-semibold text-bad hover:underline">Remove</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={inviting} onClose={busy ? () => {} : () => setInviting(false)} title="Add team member" width={460} footer={<><Button onClick={() => setInviting(false)} disabled={busy}>Cancel</Button><Button variant="primary" onClick={invite} disabled={busy || !f.name.trim() || !f.email.trim()}>{busy ? 'Adding…' : 'Add member'}</Button></>}>
        <div className="space-y-4">
          <Field label="Name"><input value={f.name} onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))} className={inputCls} /></Field>
          <Field label="Work email"><input type="email" value={f.email} onChange={(e) => setF((x) => ({ ...x, email: e.target.value }))} className={inputCls} /></Field>
          <Field label="Role" hint={ROLE_BLURB[f.role]}><select value={f.role} onChange={(e) => setF((x) => ({ ...x, role: e.target.value }))} className={inputCls}>{assignable.map((r) => <option key={r}>{r}</option>)}</select></Field>
          {err && <p role="alert" className="text-[13px] font-medium text-bad">{err}</p>}
        </div>
      </Modal>
    </>
  )
}

function Matrix() {
  const [m, setM] = useState(null)
  useEffect(() => { getRoleMatrix().then(setM).catch(() => setM({ roles: [], permissions: [] })) }, [])
  if (!m) return <ListSkeleton rows={3} />
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead className="border-b border-line bg-[#faf9f6] text-[11.5px] font-bold uppercase tracking-[0.04em] text-ink-2">
          <tr><th className="px-4 py-2">Permission</th>{m.roles.map((r) => <th key={r} className="px-3 py-2 text-center">{r}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line-2">
          {m.permissions.map((p) => (
            <tr key={p.key}>
              <td className="px-4 py-2">{p.label}</td>
              {m.roles.map((r) => <td key={r} className="px-3 py-2 text-center">{p.roles.includes(r) ? <Check size={15} className="mx-auto text-accent" aria-label="Allowed" /> : <Minus size={15} className="mx-auto text-[#c5d0d8]" aria-label="Not allowed" />}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Audit() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [action, setAction] = useState('')
  const [page, setPage] = useState(1)
  useEffect(() => {
    setError('')
    listAudit({ page, ...(action && { action }) }).then(setData).catch((e) => setError(apiMessage(e, 'Could not load the audit trail.')))
  }, [action, page])
  if (error) return <ErrorState message={error} />
  if (!data) return <ListSkeleton />
  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <select aria-label="Filter by action" value={action} onChange={(e) => { setAction(e.target.value); setPage(1) }} className={`${inputCls} w-64`}>
          <option value="">All actions</option>
          {Object.entries(data.actions).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
        </select>
        <span className="text-[12.5px] text-muted">{data.total} entr{data.total === 1 ? 'y' : 'ies'}</span>
      </div>
      {data.items.length === 0 ? <EmptyState icon={Users} title="Nothing recorded yet" body="Unlocks, stage moves, rejections, job publishing and billing changes appear here with who did them." /> : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[700px] text-left text-[13px]">
            <thead className="border-b border-line bg-[#faf9f6] text-[11.5px] font-bold uppercase tracking-[0.04em] text-ink-2"><tr><th className="px-4 py-2">When</th><th className="px-4 py-2">Who</th><th className="px-4 py-2">Action</th><th className="px-4 py-2">Details</th></tr></thead>
            <tbody className="divide-y divide-line-2">
              {data.items.map((a) => (
                <tr key={a.id}>
                  <td className="whitespace-nowrap px-4 py-2 text-muted" title={fmtDateTime(a.at)}>{ago(a.at)}</td>
                  <td className="px-4 py-2"><b className="font-semibold">{a.actorName || 'System'}</b>{a.actorRole && <span className="ml-1.5 text-[11.5px] text-muted">{a.actorRole}</span>}</td>
                  <td className="px-4 py-2">{a.label}</td>
                  <td className="px-4 py-2 text-ink-2">{[a.targetLabel, a.detail].filter(Boolean).join(' · ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data.pages > 1 && (
        <div className="mt-3 flex items-center justify-end gap-2 text-[13px]">
          <Button size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-muted">Page {page} of {data.pages}</span>
          <Button size="sm" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </>
  )
}

export default function Team() {
  const { toast } = useWorkspace()
  const { can, role, loaded } = usePermissions()
  const [tab, setTab] = useState('members')
  if (IS_DEMO) return <PageShell title="Team & Permissions"><EmptyState icon={Users} title="Team needs a live workspace" /></PageShell>
  const tabs = [['members', 'Members'], ['permissions', 'Role permissions'], ...(can('audit.view') ? [['audit', 'Audit trail']] : [])]
  return (
    <PageShell title="Team & Permissions" sub="Who can do what in your hiring workspace.">
      <div className="mb-4 flex gap-1 border-b border-line" role="tablist">
        {tabs.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} type="button" onClick={() => setTab(k)} className={`-mb-px border-b-2 px-3 py-2 text-[13.5px] font-bold ${tab === k ? 'border-accent text-accent' : 'border-transparent text-ink-2 hover:text-ink'}`}>{label}</button>
        ))}
      </div>
      {!loaded ? <ListSkeleton rows={3} /> : tab === 'members' ? <Members can={can} role={role} toast={toast} /> : tab === 'permissions' ? <Matrix /> : <Audit />}
    </PageShell>
  )
}
