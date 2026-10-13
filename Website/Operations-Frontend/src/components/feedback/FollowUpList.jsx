import { useState } from 'react'
import { BellRing, CheckCheck, MessageSquarePlus, PhoneCall, StickyNote } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { Field, Input, Select, Textarea } from '../ui/Field'
import { useApp } from '../../lib/appContext'
import {
  useAddFollowUpNoteMutation,
  useCompleteFollowUpMutation,
  useNotifyFollowUpMutation,
  useRecordContactMutation,
  useSetNextFollowUpMutation,
} from '../../hooks/useFeedback'
import { FOLLOW_UP_LABEL, dateOnly, dateTime, errorMessage } from './shared'

const ATTEMPT_LABEL = { notification: 'Notification sent', contact: 'Contact' }

function FollowUpCard({ item }) {
  const app = useApp()
  const notify = useNotifyFollowUpMutation()
  const contact = useRecordContactMutation()
  const addNote = useAddFollowUpNoteMutation()
  const setNext = useSetNextFollowUpMutation()
  const complete = useCompleteFollowUpMutation()
  const [panel, setPanel] = useState(null) // 'contact' | 'note' | 'next' | 'complete'
  const [channel, setChannel] = useState('phone')
  const [text, setText] = useState('')
  const [date, setDate] = useState(item.nextFollowUpAt ? item.nextFollowUpAt.slice(0, 10) : '')
  const busy = notify.isPending || contact.isPending || addNote.isPending || setNext.isPending || complete.isPending
  const open = item.status === 'open'

  const done = (message) => () => {
    setPanel(null)
    setText('')
    app.addToast('success', message)
  }
  const failed = (err) => app.addToast('error', errorMessage(err))

  function sendFollowUp() {
    notify.mutate(item.id, { onSuccess: () => app.addToast('success', 'Follow-up sent to the employer.'), onError: failed })
  }

  return (
    <Card pad>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14.5px] font-semibold">{item.candidateName || 'Candidate'}</span>
            <Badge tone={open ? 'gold' : 'green'}>{open ? FOLLOW_UP_LABEL[item.type] : 'Completed'}</Badge>
            {item.applicationStatus && <Badge tone="gray" dot={false}>Application: {item.applicationStatus}</Badge>}
          </div>
          <p className="text-xs text-ink-tertiary mt-1.5">{item.jobTitle || 'Role'} · {item.companyName}</p>
          <p className="text-[13px] mt-2"><span className="font-semibold">Outstanding: </span>{item.outstandingAction}</p>
          <dl className="mt-2 grid gap-x-6 gap-y-1 text-[12.5px] text-ink-secondary sm:grid-cols-2">
            <div><dt className="inline text-ink-tertiary">Employer contact: </dt><dd className="inline">{item.contact.name || '—'}{item.contact.email ? ` · ${item.contact.email}` : ''}</dd></div>
            <div><dt className="inline text-ink-tertiary">Waiting since: </dt><dd className="inline">{dateOnly(item.dueSince)}</dd></div>
            <div><dt className="inline text-ink-tertiary">Last contact: </dt><dd className="inline">{item.lastContactedAt ? dateTime(item.lastContactedAt) : 'Never'}</dd></div>
            <div><dt className="inline text-ink-tertiary">Next follow-up: </dt><dd className="inline">{item.nextFollowUpAt ? dateOnly(item.nextFollowUpAt) : 'Not set'}</dd></div>
          </dl>
        </div>
        {open && (
          <div className="flex flex-wrap gap-2 justify-end">
            <Button size="sm" variant="primary" onClick={sendFollowUp} disabled={busy || !item.canNotify} title={item.canNotify ? undefined : 'The employer was notified in the last 24 hours'}>
              <BellRing size={13} aria-hidden="true" /> {notify.isPending ? 'Sending…' : 'Send follow-up'}
            </Button>
            <Button size="sm" onClick={() => setPanel(panel === 'contact' ? null : 'contact')}><PhoneCall size={13} aria-hidden="true" /> Record contact</Button>
            <Button size="sm" onClick={() => setPanel(panel === 'note' ? null : 'note')}><StickyNote size={13} aria-hidden="true" /> Note</Button>
            <Button size="sm" onClick={() => setPanel(panel === 'next' ? null : 'next')}>Next follow-up</Button>
            <Button size="sm" onClick={() => setPanel(panel === 'complete' ? null : 'complete')}><CheckCheck size={13} aria-hidden="true" /> Mark complete</Button>
          </div>
        )}
      </div>

      {panel === 'contact' && (
        <div className="mt-3 rounded-xl bg-surface-sunken p-3.5" role="group" aria-label="Record a contact attempt">
          <Field label="How did you reach them?"><Select value={channel} onChange={(e) => setChannel(e.target.value)}><option value="phone">Phone</option><option value="email">Email</option><option value="other">Other</option></Select></Field>
          <Field label="What happened?"><Textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} /></Field>
          <Button size="sm" variant="primary" disabled={busy || text.trim().length < 3} onClick={() => contact.mutate({ id: item.id, channel, note: text }, { onSuccess: done('Contact attempt recorded'), onError: failed })}>Save contact attempt</Button>
        </div>
      )}
      {panel === 'note' && (
        <div className="mt-3 rounded-xl bg-surface-sunken p-3.5" role="group" aria-label="Add an internal note">
          <Field label="Internal note" hint="Private to Operations."><Textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} /></Field>
          <Button size="sm" variant="primary" disabled={busy || text.trim().length < 3} onClick={() => addNote.mutate({ id: item.id, text }, { onSuccess: done('Note added'), onError: failed })}><MessageSquarePlus size={13} aria-hidden="true" /> Save note</Button>
        </div>
      )}
      {panel === 'next' && (
        <div className="mt-3 rounded-xl bg-surface-sunken p-3.5" role="group" aria-label="Set the next follow-up date">
          <Field label="Next follow-up date"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <div className="flex gap-2">
            <Button size="sm" variant="primary" disabled={busy || !date} onClick={() => setNext.mutate({ id: item.id, nextFollowUpAt: date }, { onSuccess: done('Next follow-up date saved'), onError: failed })}>Save date</Button>
            {item.nextFollowUpAt && <Button size="sm" disabled={busy} onClick={() => setNext.mutate({ id: item.id, nextFollowUpAt: null }, { onSuccess: done('Next follow-up cleared'), onError: failed })}>Clear</Button>}
          </div>
        </div>
      )}
      {panel === 'complete' && (
        <div className="mt-3 rounded-xl border-2 border-navy bg-navy-tint/40 p-3.5" role="group" aria-label="Confirm completion">
          <p className="text-[13px]">Only complete this once the employer has actually done what is outstanding. We check before closing it.</p>
          <div className="mt-2 flex gap-2">
            <Button size="sm" onClick={() => setPanel(null)} disabled={busy}>Cancel</Button>
            <Button size="sm" variant="primary" disabled={busy} onClick={() => complete.mutate(item.id, { onSuccess: done('Follow-up completed'), onError: failed })}>{complete.isPending ? 'Checking…' : 'Verify and complete'}</Button>
          </div>
        </div>
      )}

      {(item.attempts.length > 0 || item.notes.length > 0) && (
        <details className="mt-3 text-[12.5px]">
          <summary className="cursor-pointer font-semibold">Activity ({item.attempts.length + item.notes.length})</summary>
          <ul className="mt-2 space-y-1 text-ink-secondary">
            {item.attempts.map((a, i) => (
              <li key={`a${i}`}>{dateTime(a.at)} · <span className="font-semibold">{ATTEMPT_LABEL[a.kind]}{a.channel ? ` (${a.channel.replace('_', ' ')})` : ''}</span>{a.ok ? '' : ` · failed${a.error ? `: ${a.error}` : ''}`}{a.note ? ` · ${a.note}` : ''}{a.byName ? ` · ${a.byName}` : ''}</li>
            ))}
            {item.notes.map((n, i) => <li key={`n${i}`}>{dateTime(n.at)} · <span className="font-semibold">Note</span> · {n.text}{n.byName ? ` · ${n.byName}` : ''}</li>)}
          </ul>
        </details>
      )}
    </Card>
  )
}

export default function FollowUpList({ rows }) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((item) => <FollowUpCard key={item.id} item={item} />)}
    </div>
  )
}
