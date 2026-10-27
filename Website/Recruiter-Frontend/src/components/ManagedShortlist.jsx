import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { Check, Handshake } from 'lucide-react'
import { Button, Modal } from './ui'
import { Field, fmtDate, textareaCls } from './rc'
import { apiMessage, closeManagedRequest, createManagedRequest, listManagedRequests, MANAGED_STEPS } from '../services/recruiterService'

const URGENCY = [
  { id: 'standard', label: 'Standard', hint: 'Within a few working days' },
  { id: 'high', label: 'High', hint: 'Within 1–2 working days' },
  { id: 'urgent', label: 'Urgent', hint: 'As soon as possible' },
]

function StepTrack({ status }) {
  const at = MANAGED_STEPS.findIndex((s) => s.key === status)
  return (
    <ol className="flex items-center gap-1" aria-label={`Status: ${MANAGED_STEPS[at]?.label}`}>
      {MANAGED_STEPS.map((s, i) => (
        <li key={s.key} className="flex flex-1 items-center gap-1">
          <span className={clsx('grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full text-[10px] font-bold', i < at ? 'bg-accent text-white' : i === at ? 'border-2 border-accent bg-white text-accent' : 'border border-line bg-white text-muted')}>
            {i < at ? <Check size={11} strokeWidth={3} /> : i + 1}
          </span>
          <span className={clsx('hidden text-[11.5px] sm:block', i === at ? 'font-bold text-ink' : 'text-muted')}>{s.label}</span>
          {i < MANAGED_STEPS.length - 1 && <span aria-hidden className={clsx('h-px flex-1', i < at ? 'bg-accent' : 'bg-line')} />}
        </li>
      ))}
    </ol>
  )
}

// "Need help shortlisting?" — the MZOBS differentiator. Shows the open request's progress, or the call to action.
export default function ManagedShortlist({ job, canRequest, toast, onShortlistShared }) {
  const [rows, setRows] = useState(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ urgency: 'standard', idealProfile: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const jobId = job?.id

  const load = useCallback(() => {
    if (jobId) listManagedRequests(jobId).then(setRows).catch(() => setRows([]))
  }, [jobId])
  useEffect(() => {
    setRows(null)
    load()
  }, [load])

  const current = rows?.find((r) => r.status !== 'closed') ?? null
  const live = job && !['draft', 'archived'].includes(job.status)

  const submit = async () => {
    setBusy(true)
    setErrors({})
    try {
      await createManagedRequest({ jobId, ...form })
      toast('Request sent to the MZOBS team')
      setOpen(false)
      setForm({ urgency: 'standard', idealProfile: '', notes: '' })
      load()
    } catch (e) {
      setErrors(e.response?.data?.errors ?? { form: apiMessage(e) })
    } finally {
      setBusy(false)
    }
  }
  const close = async () => {
    try {
      await closeManagedRequest(current.id)
      toast('Request closed')
      load()
    } catch (e) {
      toast(apiMessage(e), { tone: 'warn' })
    }
  }

  if (!job || rows === null) return null
  return (
    <>
      {current ? (
        <div className="rounded-xl border border-[#cfe3dd] bg-[#f1f8f6] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-[13.5px] font-bold text-ink"><Handshake size={16} className="text-accent" /> MZOBS managed shortlisting</p>
            <span className="text-[12px] text-muted">Requested {fmtDate(current.createdAt)} · {current.urgency} priority{current.assignedTo ? ` · handled by ${current.assignedTo}` : ''}</span>
          </div>
          <div className="mt-3"><StepTrack status={current.status} /></div>
          {current.status === 'shortlist_shared' && (
            <div className="mt-3 rounded-lg bg-white p-3">
              <p className="text-[13px] font-semibold">Shortlist ready · {current.sharedCandidates.length} candidate{current.sharedCandidates.length === 1 ? '' : 's'}</p>
              {current.shortlistMessage && <p className="mt-1 whitespace-pre-line text-[13px] text-ink-2">{current.shortlistMessage}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" variant="primary" onClick={() => onShortlistShared?.()}>Show MZOBS shortlist</Button>
                <Button size="sm" onClick={close}>Close request</Button>
              </div>
            </div>
          )}
          {current.status !== 'shortlist_shared' && canRequest && <button type="button" onClick={close} className="mt-2 text-[12px] font-semibold text-muted hover:text-ink hover:underline">Cancel request</button>}
        </div>
      ) : (
        live && canRequest && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#cfe3dd] bg-[#f1f8f6] px-4 py-3">
            <div className="flex items-center gap-3">
              <Handshake size={20} className="shrink-0 text-accent" />
              <div><p className="text-[14px] font-bold text-ink">Need help shortlisting?</p><p className="text-[12.5px] text-ink-2">Tell us who you are looking for and the MZOBS team will send you a curated shortlist.</p></div>
            </div>
            <Button variant="ai" size="sm" onClick={() => setOpen(true)}>Request a shortlist</Button>
          </div>
        )
      )}
      <Modal
        open={open}
        onClose={busy ? () => {} : () => setOpen(false)}
        title="Need help shortlisting?"
        subtitle={job.title}
        width={560}
        footer={<><Button onClick={() => setOpen(false)} disabled={busy}>Cancel</Button><Button variant="ai" onClick={submit} disabled={busy}>{busy ? 'Sending…' : 'Send request'}</Button></>}
      >
        <div className="space-y-4">
          <fieldset>
            <legend className="mb-1.5 text-[12px] font-semibold text-ink-2">How urgent is this?</legend>
            <div className="grid grid-cols-3 gap-2">
              {URGENCY.map((u) => (
                <label key={u.id} className={clsx('cursor-pointer rounded-lg border px-3 py-2', form.urgency === u.id ? 'border-accent bg-accent-soft/40' : 'border-line hover:bg-[#faf9f6]')}>
                  <input type="radio" name="urgency" value={u.id} checked={form.urgency === u.id} onChange={() => setForm((f) => ({ ...f, urgency: u.id }))} className="sr-only" />
                  <span className="block text-[13px] font-bold">{u.label}</span><span className="block text-[11.5px] text-muted">{u.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <Field label="Ideal candidate profile" error={errors.idealProfile} hint="Skills, experience, domain, seniority, anything that makes someone a clear yes.">
            <textarea value={form.idealProfile} onChange={(e) => setForm((f) => ({ ...f, idealProfile: e.target.value }))} rows={5} maxLength={2000} className={textareaCls} />
          </Field>
          <Field label="Notes (optional)" error={errors.notes}>
            <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} maxLength={1000} className={textareaCls} />
          </Field>
          {errors.form && <p role="alert" className="text-[13px] font-medium text-bad">{errors.form}</p>}
        </div>
      </Modal>
    </>
  )
}
