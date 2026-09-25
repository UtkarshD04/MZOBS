import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Plus, Check, Sparkles, Copy, Mail, MessageSquare, Smartphone, Video, Phone, Users, Building, Code, FileText } from 'lucide-react'
import { Modal, Button } from './ui'
import { useWorkspace } from '../store/workspace'
import { IS_DEMO } from '../lib/config'
import { Link } from 'react-router-dom'
import { refreshPlan } from '../services/planService'
import { getCredits, unlockCandidate, scheduleInterview, setCandidateStage } from '../services/liveApi'
import { listJobs, getTalentMany } from '../services/talentService'
import { agoDate } from '../lib/format'

const field = 'h-9 w-full rounded-lg border border-line bg-white px-3 text-[13px] outline-none focus:border-accent'

// ---- shortlist picker -------------------------------------------------------

export function ShortlistModal({ ids, onClose }) {
  const { shortlists, createShortlist, addToShortlist, toast } = useWorkspace()
  const [name, setName] = useState('')
  const open = ids.length > 0
  const done = (list, added) => {
    // Live: mirror the shortlist into the backend pipeline, but only lift candidates that are still at 'shared' so nobody already interviewing is moved backwards.
    if (!IS_DEMO) getTalentMany(ids).then((rows) => rows.filter((r) => r._live?.stage === 'shared').forEach((r) => setCandidateStage(r._live.candidateId, 'shortlisted').catch(() => {})))
    toast(added ? `${added} candidate${added === 1 ? '' : 's'} added to “${list.name}”` : `Already in “${list.name}”`)
    onClose(true)
  }
  return (
    <Modal open={open} onClose={() => onClose(false)} title="Add to shortlist" subtitle={`${ids.length} candidate${ids.length === 1 ? '' : 's'}`} width={440}>
      <ul className="space-y-1.5">
        {shortlists.map((l) => {
          const all = ids.every((i) => l.candidateIds.includes(i))
          return (
            <li key={l.id}>
              <button onClick={() => done(l, addToShortlist(l.id, ids))} className="flex w-full items-center justify-between rounded-2xl border border-line px-3.5 py-2.5 text-left hover:border-accent hover:bg-accent-soft/40">
                <span><span className="text-[14px] font-medium">{l.name}</span><span className="ml-2 text-[12px] text-muted">{l.candidateIds.length} candidates</span></span>
                {all && <Check size={15} className="text-ok" />}
              </button>
            </li>
          )
        })}
      </ul>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          const list = createShortlist(name)
          done(list, addToShortlist(list.id, ids))
          setName('')
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New shortlist, e.g. Interview ready" className={field} />
        <Button variant="primary" icon={Plus} disabled={!name.trim()}>Create</Button>
      </form>
    </Modal>
  )
}

// ---- add to job -------------------------------------------------------------

export function AddToJobModal({ ids, onClose }) {
  const { toast } = useWorkspace()
  const [jobs, setJobs] = useState(null)
  const [err, setErr] = useState(false)
  const open = ids.length > 0
  useEffect(() => {
    if (open && !jobs) listJobs().then(setJobs).catch(() => setErr(true))
  }, [open, jobs])
  return (
    <Modal open={open} onClose={onClose} title="Add to job" subtitle={`${ids.length} candidate${ids.length === 1 ? '' : 's'}`} width={440}>
      {err && <p className="text-[13px] text-bad">Couldn't load your jobs.</p>}
      {!jobs && !err && <p className="text-[13px] text-muted">Loading jobs…</p>}
      {jobs?.length === 0 && <p className="text-[13px] text-muted">You have no jobs yet. Post a job first.</p>}
      <ul className="space-y-1.5">
        {jobs?.map((j) => (
          <li key={j.id}>
            <button onClick={() => { toast(IS_DEMO ? `Added to “${j.title}” (demo — not saved)` : 'Candidates are attached to jobs by Mzobs when profiles are shared with you, so this is not editable from here yet.', { tone: IS_DEMO ? 'ok' : 'warn' }); onClose() }} className="w-full rounded-2xl border border-line px-3.5 py-2.5 text-left text-[14px] font-medium hover:border-accent hover:bg-accent-soft/40">{j.title}</button>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

// ---- outreach ---------------------------------------------------------------

const TEMPLATES = {
  intro: { label: 'Personalised intro', body: (c, me) => `Hi ${c.name.split(' ')[0]},\n\nI came across your profile on Mzobs — your ${c.experienceYears} years as a ${c.designation}${c.skills.length ? ` working with ${c.skills.slice(0, 3).join(', ')}` : ''} stood out for a role we're hiring for.\n\nWould you be open to a short conversation this week to hear more?\n\nBest,\n${me}` },
  followup: { label: 'Follow-up', body: (c, me) => `Hi ${c.name.split(' ')[0]},\n\nFollowing up on my earlier note about an opening that fits your ${c.designation} background. If the timing isn't right, no problem — happy to reconnect later.\n\nBest,\n${me}` },
  invite: { label: 'Interview invitation', body: (c, me) => `Hi ${c.name.split(' ')[0]},\n\nThanks for your interest. We'd like to invite you to an interview. Please reply with two or three time slots that work for you this week.\n\nBest,\n${me}` },
  reminder: { label: 'Reminder', body: (c, me) => `Hi ${c.name.split(' ')[0]},\n\nA quick reminder about your upcoming conversation with us. Let me know if you need to reschedule.\n\nBest,\n${me}` },
  reject: { label: 'Rejection', body: (c, me) => `Hi ${c.name.split(' ')[0]},\n\nThank you for your time and interest. After careful consideration we won't be moving forward for this role, but we'll keep your profile in mind for future openings.\n\nWishing you the best,\n${me}` },
}
const CHANNELS = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'message', label: 'Message', icon: MessageSquare },
  { id: 'sms', label: 'SMS', icon: Smartphone },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, disabled: true },
]

export function OutreachModal({ candidates, channel: initial = 'email', onClose }) {
  const { addMessage, toast } = useWorkspace()
  const [channel, setChannel] = useState(initial)
  const [tpl, setTpl] = useState('intro')
  const [subject, setSubject] = useState('An opportunity that fits your background')
  const [body, setBody] = useState('')
  const open = candidates.length > 0
  const first = candidates[0]
  const draft = (key) => TEMPLATES[key].body(first ?? { name: 'there', experienceYears: '', designation: 'professional', skills: [] }, 'The Hiring Team')
  useEffect(() => {
    if (open) { setChannel(initial); setTpl('intro'); setBody(draft('intro')) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, first?.id, initial])
  const many = candidates.length > 1

  const save = () => {
    candidates.forEach((c) => addMessage({ candidateId: c.id, candidateName: c.name, channel, subject: channel === 'email' ? subject : null, body: body.replace(/^Hi [^,]+,/, `Hi ${c.name.split(' ')[0]},`), state: 'draft' }))
    toast(`Saved ${candidates.length > 1 ? `${candidates.length} drafts` : 'draft'} to Messages`)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={many ? `Message ${candidates.length} candidates` : `Contact ${first?.name ?? ''}`}
      width={640}
      footer={
        <>
          {first?.contact?.email && candidates.length === 1 && <a className="inline-flex h-9 items-center rounded-lg border border-line px-3.5 text-[13px] font-medium hover:bg-line-2" href={`mailto:${first.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>Open in mail app</a>}
          <Button icon={Copy} onClick={() => { navigator.clipboard?.writeText(body); toast('Copied to clipboard') }}>Copy</Button>
          <Button variant="primary" onClick={save}>Save draft to Messages</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((ch) => (
            <button key={ch.id} disabled={ch.disabled} title={ch.disabled ? 'WhatsApp isn’t supported by the Mzobs backend yet' : undefined} onClick={() => setChannel(ch.id)} className={clsx('flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium disabled:opacity-40', channel === ch.id ? 'border-accent bg-accent-soft text-[#0a6f64]' : 'border-line hover:bg-line-2')}>
              <ch.icon size={14} /> {ch.label}
            </button>
          ))}
        </div>
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[#0a6f64]"><Sparkles size={12} /> Generate a draft — you can edit everything before it goes anywhere</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(TEMPLATES).map(([k, t]) => (
              <button key={k} onClick={() => { setTpl(k); setBody(draft(k)) }} className={clsx('rounded-md border px-2.5 py-1 text-[12.5px]', tpl === k ? 'border-[#a9dcd3] bg-ai-soft text-[#0a6f64]' : 'border-line hover:bg-line-2')}>{t.label}</button>
            ))}
          </div>
        </div>
        {channel === 'email' && <input value={subject} onChange={(e) => setSubject(e.target.value)} className={field} aria-label="Subject" />}
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className="w-full rounded-lg border border-line p-3 text-[13.5px] leading-6 outline-none focus:border-accent" aria-label="Message" />
        <p className="text-[12px] text-muted">Drafts are stored in Messages on this device. Delivery needs a connected messaging service, and contact details stay masked until you unlock a candidate with a CV credit.</p>
      </div>
    </Modal>
  )
}

// ---- interview --------------------------------------------------------------

const TYPES = [
  { id: 'Phone', icon: Phone },
  { id: 'Video', icon: Video },
  { id: 'Technical', icon: Code },
  { id: 'HR', icon: Users },
  { id: 'On-site', icon: Building },
]

export function InterviewModal({ candidate, onClose }) {
  const { addInterview, toast } = useWorkspace()
  const [f, setF] = useState({ type: 'Video', date: '', time: '', interviewers: '', link: '', reminder: '1 hour before' })
  const set = (p) => setF((x) => ({ ...x, ...p }))
  const valid = f.date && f.time
  const [busy, setBusy] = useState(false)
  const submit = async () => {
    if (!IS_DEMO) {
      setBusy(true)
      try {
        await scheduleInterview({
          candidateId: candidate._live?.candidateId ?? candidate.id,
          role: candidate.designation || 'Interview',
          round: f.type,
          startsAt: new Date(`${f.date}T${f.time}`).toISOString(),
          durationMins: 45,
          mode: f.type === 'On-site' ? 'On-site' : 'Video Call',
          meetingLink: f.link || undefined,
          location: f.type === 'On-site' ? 'Office' : undefined,
          panel: f.interviewers.split(',').map((x) => x.trim()).filter(Boolean),
        })
        toast(`Interview scheduled with ${candidate.name}`)
        onClose()
      } catch (e) {
        toast(e.response?.data?.message ?? 'Could not schedule the interview', { tone: 'warn' })
      } finally {
        setBusy(false)
      }
      return
    }
    addInterview({ candidateId: candidate.id, candidateName: candidate.name, ...f })
    toast(`Interview planned with ${candidate.name}`)
    onClose()
  }
  return (
    <Modal
      open={!!candidate}
      onClose={onClose}
      title="Schedule interview"
      subtitle={candidate?.name}
      width={520}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!valid || busy} onClick={submit}>Schedule</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button key={t.id} onClick={() => set({ type: t.id })} className={clsx('flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium', f.type === t.id ? 'border-accent bg-accent-soft text-[#0a6f64]' : 'border-line hover:bg-line-2')}><t.icon size={14} /> {t.id}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-[12px] text-muted">Date<input type="date" value={f.date} onChange={(e) => set({ date: e.target.value })} className={clsx(field, 'mt-1')} /></label>
          <label className="text-[12px] text-muted">Time<input type="time" value={f.time} onChange={(e) => set({ time: e.target.value })} className={clsx(field, 'mt-1')} /></label>
        </div>
        <label className="block text-[12px] text-muted">Interviewers<input value={f.interviewers} onChange={(e) => set({ interviewers: e.target.value })} placeholder="Names, comma separated" className={clsx(field, 'mt-1')} /></label>
        {(f.type === 'Video' || f.type === 'Technical') && <label className="block text-[12px] text-muted">Meeting link<input value={f.link} onChange={(e) => set({ link: e.target.value })} placeholder="https://meet…" className={clsx(field, 'mt-1')} /></label>}
        <label className="block text-[12px] text-muted">Reminder
          <select value={f.reminder} onChange={(e) => set({ reminder: e.target.value })} className={clsx(field, 'mt-1')}>{['None', '15 minutes before', '1 hour before', '1 day before'].map((r) => <option key={r}>{r}</option>)}</select>
        </label>
        <p className="text-[12px] text-muted">{IS_DEMO ? 'Demo: interviews are stored on this device only.' : 'Saved to your Mzobs account. Phone, Technical and HR rounds are booked as a video call with the round name recorded.'}</p>
      </div>
    </Modal>
  )
}

// ---- note / reminder --------------------------------------------------------

export function NoteModal({ candidate, kind = 'note', onClose }) {
  const { addNote, toast } = useWorkspace()
  const [text, setText] = useState('')
  useEffect(() => setText(''), [candidate?.id, kind])
  const label = kind === 'reminder' ? 'Reminder' : 'Note'
  return (
    <Modal
      open={!!candidate}
      onClose={onClose}
      title={`Add ${label.toLowerCase()}`}
      subtitle={candidate?.name}
      width={480}
      footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!text.trim()} onClick={() => { addNote(candidate.id, kind === 'reminder' ? `⏰ Reminder: ${text.trim()}` : text.trim()); toast(`${label} saved`); onClose() }}>Save</Button></>}
    >
      <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder={kind === 'reminder' ? 'Follow up on notice period…' : 'Private note for your team…'} className="w-full rounded-lg border border-line p-3 text-[13.5px] outline-none focus:border-accent" />
    </Modal>
  )
}

export function NotesList({ notes }) {
  if (!notes?.length) return <p className="text-[13px] text-muted">No notes yet.</p>
  return (
    <ul className="space-y-2">
      {notes.map((n) => (
        <li key={n.id} className="rounded-lg bg-line-2 px-3 py-2 text-[13px]">
          {n.text}
          <span className="mt-0.5 block text-[11px] text-muted">{agoDate(n.at)}</span>
        </li>
      ))}
    </ul>
  )
}


// ---- unlock (live) ----------------------------------------------------------

export function UnlockModal({ candidate, onClose, onCompose, onUnlocked, onViewResume }) {
  const { toast } = useWorkspace()
  const [wallet, setWallet] = useState(null)
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [jobs, setJobs] = useState(null)
  const [jobId, setJobId] = useState('')
  // A resume-database profile can join one of the company's jobs when it is first
  // unlocked — optional: with no job (or "No specific job") it is simply unlocked.
  const needsJob = candidate?._live?.kind === 'resdex' && !candidate._live.candidateId
  useEffect(() => {
    setResult(null)
    setErr('')
    setJobs(null)
    setJobId('')
    if (!candidate) return
    getCredits().then((r) => setWallet(r.wallet)).catch(() => setWallet(null))
    // Already unlocked earlier → the backend returns the details again without charging.
    if (candidate._live?.unlocked) unlockCandidate(candidate).then(setResult).catch(() => {})
    else if (candidate._live?.kind === 'resdex' && !candidate._live.candidateId) {
      listJobs()
        .then((list) => {
          setJobs(list)
          setJobId(list[0]?.id ?? '')
        })
        .catch(() => setJobs([]))
    }
  }, [candidate])

  const preview = candidate?._live?.contactPreview
  const unlock = async () => {
    setBusy(true)
    setErr('')
    try {
      const r = await unlockCandidate(candidate, { jobId: needsJob ? jobId : undefined })
      setResult(r)
      setWallet(r.wallet)
      refreshPlan()
      onUnlocked?.(r)
      toast(r.alreadyUnlocked ? 'Already unlocked — no credit used' : 'CV and contact details unlocked (1 CV credit)')
    } catch (e) {
      setErr(e.response?.status === 402 ? 'No CV credits left. Buy more in the employer portal.' : e.response?.data?.message ?? 'Could not unlock this candidate.')
    } finally {
      setBusy(false)
    }
  }
  const c = result?.candidate
  const credits = wallet?.remainingCredits
  return (
    <Modal open={!!candidate} onClose={onClose} title={c ? 'Contact details' : 'View contact details & CV'} subtitle={candidate?.name} width={460}
      footer={c ? <><Button onClick={onClose}>Done</Button>{onCompose && <Button variant="primary" icon={Mail} onClick={() => onCompose(candidate, { email: c.email, phone: c.phone })}>Write to candidate</Button>}</> : <><Button onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy || credits === 0 || (needsJob && jobs === null)} onClick={unlock}>{busy ? 'Opening…' : 'View · uses 1 credit'}</Button></>}>
      {c ? (
        <dl className="space-y-3 text-[14px]">
          <div><dt className="text-[12px] text-muted">Email</dt><dd className="font-medium">{c.email || '—'}</dd></div>
          <div><dt className="text-[12px] text-muted">Phone</dt><dd className="font-medium">{c.phone || '—'}</dd></div>
          {c.resumeUrl ? (
            <Button icon={FileText} onClick={() => onViewResume?.(candidate, { url: c.resumeUrl, fileName: c.resumeFileName })}>View CV</Button>
          ) : (
            <p className="text-[12.5px] text-muted">No verified CV on this profile yet.</p>
          )}
        </dl>
      ) : (
        <div className="space-y-3 text-[13.5px]">
          <p>Email, phone and CV stay hidden. Viewing any of them uses <b>1 CV credit</b> — only once for this candidate. After that all three stay open and you are never charged again for {candidate?.name?.split(' ')[0]}.</p>
          <p className="rounded-lg bg-line-2 px-3 py-2 text-ink-2">Email {preview?.email ?? '—'} · Phone {preview?.phone ?? '—'}</p>
          {needsJob && jobs === null && <p className="text-muted">Loading your jobs…</p>}
          {needsJob && jobs?.length === 0 && (
            <p className="text-[12.5px] text-muted">You have no jobs yet, so this CV is unlocked on its own. <Link to="/jobs/new" onClick={onClose} className="font-medium text-accent hover:underline">Post a job</Link> to build a pipeline.</p>
          )}
          {needsJob && jobs?.length > 0 && (
            <label className="block text-[12px] text-muted">
              Add to job (optional)
              <select value={jobId} onChange={(e) => setJobId(e.target.value)} className={clsx(field, 'mt-1')}>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                <option value="">No specific job</option>
              </select>
              <span className="mt-1 block">{jobId ? `${candidate.name.split(' ')[0]} joins this job's pipeline, so you can shortlist and schedule interviews.` : 'Unlocked on its own, not added to any job pipeline.'}</span>
            </label>
          )}
          {credits != null && <p className="text-muted">Credits available: <b className="text-ink">{credits}</b>{credits === 0 && <> · <Link to="/credits" onClick={onClose} className="font-medium text-accent hover:underline">Buy credits</Link></>}</p>}
        </div>
      )}
      {err && <p role="alert" className="mt-3 rounded-lg bg-[#fdecec] px-3 py-2 text-[13px] text-bad">{err}</p>}
    </Modal>
  )
}
