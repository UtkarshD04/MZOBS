import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button, Modal } from './ui'
import { Field, inputCls, textareaCls } from './rc'
import { apiMessage, listTemplates, previewMessage, sendMessage } from '../services/recruiterService'

// Sends one of the company's message templates to one candidate. Email goes through the compliant outreach path (the
// candidate's email must be unlocked); in-app goes to the candidate's MZOBS inbox. No bulk SMS/WhatsApp here by design.
export default function SendMessageModal({ candidate, onClose, onSent, toast, defaultKey = 'shortlist_update' }) {
  const [templates, setTemplates] = useState([])
  const [key, setKey] = useState(defaultKey)
  const [channel, setChannel] = useState('in_app')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [vars, setVars] = useState({})
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const candidateId = candidate?.id

  useEffect(() => {
    if (!candidateId) return
    listTemplates().then((r) => setTemplates(r.templates)).catch(() => setTemplates([]))
    setKey(defaultKey)
    setVars({})
    setError('')
  }, [candidateId, defaultKey])

  // Refresh the rendered preview whenever the template or the filled-in values change (short debounce while typing).
  useEffect(() => {
    if (!candidateId || !templates.length) return
    const t = setTimeout(() => {
      previewMessage({ candidateId, templateKey: key, variables: vars })
        .then((p) => {
          setPreview(p)
          setSubject(p.subject)
          setBody(p.body)
          setChannel((ch) => (p.channels[ch]?.available ? ch : p.channels.in_app.available ? 'in_app' : p.channels.email.available ? 'email' : ch))
        })
        .catch((e) => setError(apiMessage(e)))
    }, 250)
    return () => clearTimeout(t)
  }, [candidateId, key, vars, templates.length])

  const missing = preview?.missing ?? []
  const send = async () => {
    setBusy(true)
    setError('')
    try {
      await sendMessage({ candidateId, templateKey: key, channel, subject, body, variables: vars })
      toast(`Message sent to ${candidate.name}`)
      onSent?.()
      onClose()
    } catch (e) {
      setError(apiMessage(e))
    } finally {
      setBusy(false)
    }
  }
  const ch = preview?.channels?.[channel]
  return (
    <Modal
      open={!!candidate}
      onClose={busy ? () => {} : onClose}
      title="Send a message"
      subtitle={candidate?.name}
      width={600}
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" onClick={send} disabled={busy || !preview || missing.length > 0 || ch?.available === false}>{busy ? 'Sending…' : 'Send message'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Template">
            <select value={key} onChange={(e) => setKey(e.target.value)} className={inputCls}>{templates.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}</select>
          </Field>
          <Field label="Send by">
            <select value={channel} onChange={(e) => setChannel(e.target.value)} className={inputCls}>
              <option value="in_app">MZOBS inbox{preview?.channels.in_app.available === false ? ' (unavailable)' : ''}</option>
              <option value="email">Email{preview?.channels.email.available === false ? ' (email not unlocked)' : ''}</option>
            </select>
          </Field>
        </div>
        {ch?.available === false && <p className="flex items-start gap-2 rounded-lg bg-[#f6efdc] px-3 py-2 text-[12.5px] text-[#7a5a14]"><AlertTriangle size={14} className="mt-0.5 shrink-0" />{ch.reason}</p>}
        {missing.length > 0 && (
          <div className="rounded-lg border border-line p-3">
            <p className="mb-2 text-[12.5px] font-semibold text-ink-2">Fill in the missing details before sending</p>
            <div className="grid grid-cols-2 gap-3">
              {missing.map((m) => <Field key={m} label={m.replace(/_/g, ' ')}><input value={vars[m] ?? ''} onChange={(e) => setVars((v) => ({ ...v, [m]: e.target.value }))} className={inputCls} /></Field>)}
            </div>
          </div>
        )}
        <Field label="Subject"><input value={subject} readOnly className={`${inputCls} bg-[#faf9f6]`} /></Field>
        <Field label="Message" hint="Edit the wording of a template under Messages → Templates."><textarea value={body} readOnly rows={9} className={`${textareaCls} bg-[#faf9f6]`} /></Field>
        {error && <p role="alert" className="text-[13px] font-medium text-bad">{error}</p>}
      </div>
    </Modal>
  )
}
