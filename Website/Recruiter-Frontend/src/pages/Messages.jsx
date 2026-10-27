import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { MessageSquare, RotateCcw } from 'lucide-react'
import { Button, EmptyState } from '../components/ui'
import { ErrorState, Field, ListSkeleton, PageShell, ago, fmtDateTime, inputCls, textareaCls } from '../components/rc'
import { LocalMessages } from './Workspaces'
import { useWorkspace } from '../store/workspace'
import { apiMessage, listCommLog, listTemplates, resetTemplate, saveTemplate, usePermissions } from '../services/recruiterService'
import { IS_DEMO } from '../lib/config'

const CHANNEL = { email: 'Email', in_app: 'MZOBS inbox' }

function Log() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const load = useCallback(() => { setError(''); listCommLog().then(setRows).catch((e) => setError(apiMessage(e, 'Could not load the message log.'))) }, [])
  useEffect(load, [load])
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!rows) return <ListSkeleton />
  if (rows.length === 0) return <EmptyState icon={MessageSquare} title="No messages sent yet" body="Open an applicant and choose Message to send an interview invite, shortlist update or any other template. Every message is logged here and on the candidate’s history." />
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead className="border-b border-line bg-[#faf9f6] text-[11.5px] font-bold uppercase tracking-[0.04em] text-ink-2"><tr><th className="px-4 py-2">Candidate</th><th className="px-4 py-2">Message</th><th className="px-4 py-2">Channel</th><th className="px-4 py-2">Sent by</th><th className="px-4 py-2">When</th></tr></thead>
        <tbody className="divide-y divide-line-2">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-2 font-semibold">{r.candidateName}</td>
              <td className="px-4 py-2 text-ink-2">{r.subject || r.text}</td>
              <td className="px-4 py-2">{CHANNEL[r.channel] ?? r.channel}</td>
              <td className="px-4 py-2 text-ink-2">{r.sentBy || '—'}</td>
              <td className="whitespace-nowrap px-4 py-2 text-muted" title={fmtDateTime(r.at)}>{ago(r.at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Templates({ canEdit, toast }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [key, setKey] = useState(null)
  const [draft, setDraft] = useState({ subject: '', body: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const load = useCallback(() => { listTemplates().then((r) => { setData(r); setKey((k) => k ?? r.templates[0]?.key) }).catch((e) => setError(apiMessage(e, 'Could not load templates.'))) }, [])
  useEffect(load, [load])
  const current = data?.templates.find((t) => t.key === key)
  useEffect(() => { if (current) { setDraft({ subject: current.subject, body: current.body }); setErrors({}) } }, [current?.key, current?.updatedAt, current?.custom]) // eslint-disable-line react-hooks/exhaustive-deps
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!data) return <ListSkeleton />
  const dirty = current && (draft.subject !== current.subject || draft.body !== current.body)
  const save = async () => {
    setBusy(true)
    setErrors({})
    try {
      await saveTemplate(key, draft)
      toast('Template saved')
      load()
    } catch (e) {
      setErrors(e.response?.data?.errors ?? { form: apiMessage(e) })
    } finally {
      setBusy(false)
    }
  }
  const reset = async () => {
    if (!window.confirm('Go back to the built-in wording for this template?')) return
    try {
      await resetTemplate(key)
      toast('Reset to default')
      load()
    } catch (e) {
      toast(apiMessage(e), { tone: 'warn' })
    }
  }
  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
      <ul className="space-y-1" role="tablist" aria-label="Templates">
        {data.templates.map((t) => (
          <li key={t.key}><button type="button" role="tab" aria-selected={key === t.key} onClick={() => setKey(t.key)} className={clsx('flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13.5px] font-semibold', key === t.key ? 'bg-white text-accent shadow-card' : 'text-ink-2 hover:bg-white/70')}>{t.label}{t.custom && <span className="text-[10.5px] font-bold uppercase text-muted">Edited</span>}</button></li>
        ))}
      </ul>
      {current && (
        <div className="rounded-xl border border-line bg-white p-4">
          <div className="space-y-4">
            <Field label="Subject" error={errors.subject}><input value={draft.subject} onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))} disabled={!canEdit} className={inputCls} /></Field>
            <Field label="Message" error={errors.body}><textarea value={draft.body} onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} disabled={!canEdit} rows={11} className={textareaCls} /></Field>
            <p className="text-[12px] text-muted">Placeholders filled in automatically: {data.variables.map((v) => `{{${v}}}`).join('  ')}</p>
            {errors.form && <p role="alert" className="text-[13px] font-medium text-bad">{errors.form}</p>}
            {canEdit && (
              <div className="flex items-center justify-between">
                <Button size="sm" variant="ghost" icon={RotateCcw} onClick={reset} disabled={!current.custom}>Reset to default</Button>
                <Button variant="primary" onClick={save} disabled={busy || !dirty}>{busy ? 'Saving…' : 'Save template'}</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Messages() {
  const { toast } = useWorkspace()
  const { can } = usePermissions()
  const [tab, setTab] = useState(IS_DEMO ? 'device' : 'log')
  const tabs = IS_DEMO ? [['device', 'Saved on this device']] : [['log', 'Sent messages'], ['templates', 'Templates'], ['device', 'Saved on this device']]
  return (
    <PageShell title="Messages" sub="Message candidates from templates and keep a log of everything sent.">
      <div className="mb-4 flex gap-1 border-b border-line" role="tablist">
        {tabs.map(([k, label]) => <button key={k} role="tab" aria-selected={tab === k} type="button" onClick={() => setTab(k)} className={clsx('-mb-px border-b-2 px-3 py-2 text-[13.5px] font-bold', tab === k ? 'border-accent text-accent' : 'border-transparent text-ink-2 hover:text-ink')}>{label}</button>)}
      </div>
      {tab === 'log' ? <Log /> : tab === 'templates' ? <Templates canEdit={can('templates.manage')} toast={toast} /> : <LocalMessages />}
      {!IS_DEMO && tab !== 'device' && <p className="mt-5 text-[12px] text-muted">Email needs the candidate’s email to be unlocked. MZOBS inbox reaches candidates who applied through MZOBS. Bulk SMS and WhatsApp are not offered: they require recorded consent and DLT-approved templates.</p>}
    </PageShell>
  )
}
