import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import { Gift, Plus } from 'lucide-react'
import { Avatar, Button, EmptyState, Modal } from '../components/ui'
import { ErrorState, Field, ListSkeleton, PageShell, fmtDate, inputCls } from '../components/rc'
import { useWorkspace } from '../store/workspace'
import { apiMessage, createOffer, listApplicants, listOffers, setOfferStatus, usePermissions } from '../services/recruiterService'
import { IS_DEMO } from '../lib/config'

const STATUS = { pending: ['Awaiting response', 'bg-warn-soft text-warn'], draft: ['Draft', 'bg-line-2 text-ink-2'], accepted: ['Accepted', 'bg-ok-soft text-ok'], rejected: ['Declined', 'bg-[#f5e9e7] text-[#9a3a2c]'] }
const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

function NewOffer({ open, presetId, onClose, onCreated }) {
  const { toast } = useWorkspace()
  const [cands, setCands] = useState([])
  const [f, setF] = useState({ candidateId: '', ctc: '', joiningDate: '', expiresOn: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!open) return
    setErrors({})
    setF({ candidateId: presetId ?? '', ctc: '', joiningDate: '', expiresOn: '' })
    // Offers are made to people already shortlisted or interviewed.
    Promise.all([listApplicants({ jobId: 'all', stage: 'shortlisted' }), listApplicants({ jobId: 'all', stage: 'interview' })])
      .then(([a, b]) => setCands([...a.items, ...b.items].filter((c) => c.jobId)))
      .catch(() => setCands([]))
  }, [open, presetId])
  const chosen = cands.find((c) => c.id === f.candidateId)
  const submit = async () => {
    const e = {}
    if (!chosen) e.candidateId = 'Choose a candidate.'
    if (!(Number(f.ctc) > 0)) e.ctc = 'Enter the annual CTC in rupees.'
    if (!f.joiningDate) e.joiningDate = 'Pick a joining date.'
    if (!f.expiresOn) e.expiresOn = 'Pick when the offer expires.'
    else if (f.joiningDate && f.expiresOn > f.joiningDate) e.expiresOn = 'The offer should expire on or before the joining date.'
    setErrors(e)
    if (Object.keys(e).length) return
    setBusy(true)
    try {
      await createOffer({ candidateId: chosen.id, jobId: chosen.jobId, role: chosen.jobTitle || chosen.appliedFor, ctc: Number(f.ctc), joiningDate: f.joiningDate, expiresOn: f.expiresOn })
      toast(`Offer created for ${chosen.name}`)
      onCreated()
      onClose()
    } catch (err) {
      setErrors({ form: apiMessage(err) })
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title="Create an offer" width={520} footer={<><Button onClick={onClose} disabled={busy}>Cancel</Button><Button variant="primary" onClick={submit} disabled={busy}>{busy ? 'Creating…' : 'Create offer'}</Button></>}>
      <div className="space-y-4">
        <Field label="Candidate" error={errors.candidateId} hint={cands.length === 0 ? 'Only shortlisted or interviewed candidates appear here.' : undefined}>
          <select value={f.candidateId} onChange={(e) => setF((x) => ({ ...x, candidateId: e.target.value }))} className={inputCls}>
            <option value="">Choose…</option>
            {cands.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.jobTitle}</option>)}
          </select>
        </Field>
        <Field label="Annual CTC (₹)" error={errors.ctc}><input type="number" min="1" value={f.ctc} onChange={(e) => setF((x) => ({ ...x, ctc: e.target.value }))} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Joining date" error={errors.joiningDate}><input type="date" value={f.joiningDate} onChange={(e) => setF((x) => ({ ...x, joiningDate: e.target.value }))} className={inputCls} /></Field>
          <Field label="Offer expires on" error={errors.expiresOn}><input type="date" value={f.expiresOn} onChange={(e) => setF((x) => ({ ...x, expiresOn: e.target.value }))} className={inputCls} /></Field>
        </div>
        {errors.form && <p role="alert" className="text-[13px] font-medium text-bad">{errors.form}</p>}
      </div>
    </Modal>
  )
}

export default function Offers() {
  const { toast } = useWorkspace()
  const { can } = usePermissions()
  const [sp, setSp] = useSearchParams()
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(!!sp.get('candidate'))
  const preset = sp.get('candidate')
  const load = useCallback(() => {
    setError('')
    listOffers().then(setRows).catch((e) => setError(apiMessage(e, 'Could not load offers.')))
  }, [])
  useEffect(() => {
    if (!IS_DEMO) load()
  }, [load])

  const sorted = useMemo(() => (rows ?? []).slice().sort((a, b) => (a.status === 'pending' ? 0 : 1) - (b.status === 'pending' ? 0 : 1) || new Date(a.expiresOn) - new Date(b.expiresOn)), [rows])
  const respond = async (o, status) => {
    if (!window.confirm(`Mark ${o.candidateName}’s offer as ${status === 'accepted' ? 'accepted' : 'declined'}?`)) return
    try {
      await setOfferStatus(o.id, status)
      toast('Offer updated')
      load()
    } catch (e) {
      toast(apiMessage(e), { tone: 'warn' })
    }
  }
  const closeNew = () => {
    setCreating(false)
    if (preset) setSp({}, { replace: true })
  }

  if (IS_DEMO) return <PageShell title="Offers"><EmptyState icon={Gift} title="Offers need a live workspace" body="Offers are created from your real shortlisted candidates." /></PageShell>
  return (
    <PageShell title="Offers" sub="Offers you have made and where each one stands." actions={can('offers.manage') && <Button variant="primary" icon={Plus} onClick={() => setCreating(true)}>Create offer</Button>}>
      {error ? <ErrorState message={error} onRetry={load} /> : !rows ? <ListSkeleton /> : sorted.length === 0 ? (
        <EmptyState icon={Gift} title="No offers yet" body="When a candidate is shortlisted or interviewed, create an offer here. They are notified and you can track their response." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead className="border-b border-line bg-[#faf9f6] text-[11.5px] font-bold uppercase tracking-[0.04em] text-ink-2"><tr><th className="px-4 py-2">Candidate</th><th className="px-4 py-2">Role</th><th className="px-4 py-2">CTC</th><th className="px-4 py-2">Joining</th><th className="px-4 py-2">Expires</th><th className="px-4 py-2">Status</th><th /></tr></thead>
            <tbody className="divide-y divide-line-2">
              {sorted.map((o) => {
                const [label, cls] = STATUS[o.status] ?? STATUS.draft
                const soon = o.status === 'pending' && new Date(o.expiresOn) - Date.now() < 3 * 86400000
                return (
                  <tr key={o.id} className="hover:bg-[#faf9f6]">
                    <td className="px-4 py-2.5"><span className="flex items-center gap-2"><Avatar candidate={{ id: o.id, initials: o.initials }} size={28} /><b className="font-semibold">{o.candidateName}</b></span></td>
                    <td className="px-4 py-2.5 text-ink-2">{o.role}</td>
                    <td className="num px-4 py-2.5">{inr(o.ctc)}</td>
                    <td className="px-4 py-2.5 text-ink-2">{fmtDate(o.joiningDate)}</td>
                    <td className={clsx('px-4 py-2.5', soon ? 'font-semibold text-warn' : 'text-ink-2')}>{fmtDate(o.expiresOn)}{soon && new Date(o.expiresOn) < new Date() ? ' (expired)' : ''}</td>
                    <td className="px-4 py-2.5"><span className={clsx('rounded px-1.5 py-0.5 text-[11.5px] font-semibold', cls)}>{label}</span></td>
                    <td className="px-4 py-2.5 text-right">{o.status === 'pending' && can('offers.manage') && <span className="inline-flex gap-1.5"><Button size="sm" onClick={() => respond(o, 'accepted')}>Accepted</Button><Button size="sm" variant="ghost" onClick={() => respond(o, 'rejected')}>Declined</Button></span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <NewOffer open={creating} presetId={preset} onClose={closeNew} onCreated={load} />
    </PageShell>
  )
}
