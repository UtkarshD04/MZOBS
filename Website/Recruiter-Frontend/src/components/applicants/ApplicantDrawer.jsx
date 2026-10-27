import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarPlus, ExternalLink, Gift, Lock, Mail, UserX } from 'lucide-react'
import { Avatar, Button, Sheet } from '../ui'
import { ErrorState, Field, ListSkeleton, StagePill, Tag, ago, fmtDate, fmtDateTime, inputCls, textareaCls } from '../rc'
import SendMessageModal from '../SendMessageModal'
import { addApplicantNote, apiMessage, getApplicant, listTeam, moveApplicant, PIPELINE, STAGE_LABEL, updateApplicant } from '../../services/recruiterService'

const EVENT_LABEL = { stage: 'Stage', note: 'Note', assign: 'Owner', tags: 'Tags', followup: 'Follow-up', interview: 'Interview', offer: 'Offer', comm: 'Message', reject: 'Rejected' }

function Section({ title, children, aside }) {
  return (
    <section className="border-t border-line-2 py-4 first:border-t-0 first:pt-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-ink-2">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  )
}

export default function ApplicantDrawer({ id, onClose, onChanged, onReject, onSchedule, can, toast }) {
  const [c, setC] = useState(null)
  const [error, setError] = useState('')
  const [team, setTeam] = useState([])
  const [note, setNote] = useState('')
  const [tag, setTag] = useState('')
  const [busy, setBusy] = useState(false)
  const [messaging, setMessaging] = useState(false)
  const nav = useNavigate()
  const manage = can('candidates.manage')

  const load = useCallback(() => {
    if (!id) return
    setError('')
    getApplicant(id).then(setC).catch((e) => setError(apiMessage(e, 'Could not load this candidate.')))
  }, [id])
  useEffect(() => {
    setC(null)
    setNote('')
    load()
  }, [load])
  useEffect(() => {
    if (id) listTeam().then(setTeam).catch(() => setTeam([]))
  }, [id])

  const run = async (fn, ok) => {
    setBusy(true)
    try {
      await fn()
      if (ok) toast(ok)
      await load()
      onChanged()
    } catch (e) {
      toast(apiMessage(e), { tone: 'warn' })
    } finally {
      setBusy(false)
    }
  }

  const addTag = () => {
    const t = tag.trim()
    if (!t) return
    setTag('')
    run(() => updateApplicant(id, { tags: [...c.tags, t] }))
  }

  const profileLink = c && (
    <Link to={`/candidate/${c.id}`} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-accent hover:underline">Full profile <ExternalLink size={12} /></Link>
  )
  const asCandidate = c && { id: c.id, name: c.name, designation: c.currentRole || c.appliedFor, _live: { candidateId: c.id } }
  const terminal = c && c.stage === 'rejected'

  return (
    <Sheet open={!!id} onClose={onClose} title={c?.name ?? 'Candidate'} subtitle={c ? [c.currentRole, c.jobTitle].filter(Boolean).join(' · ') : undefined} width={500}>
      {error ? <ErrorState message={error} onRetry={load} /> : !c ? <ListSkeleton rows={6} /> : (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Avatar candidate={c} size={44} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><StagePill stage={c.stage} label={STAGE_LABEL[c.stage]} />{c.unlocked && <span className="text-[11.5px] font-semibold text-ok">CV unlocked</span>}</div>
              <p className="mt-0.5 text-[12.5px] text-muted">{c.experienceYears} yrs · {c.location || 'Location not stated'} · applied {fmtDate(c.appliedAt)}</p>
            </div>
            {profileLink}
          </div>

          {manage && (
            <div className="mb-4 flex flex-wrap gap-2">
              <Button size="sm" icon={CalendarPlus} onClick={() => onSchedule(asCandidate)} disabled={!can('interviews.manage')}>Schedule interview</Button>
              <Button size="sm" icon={Gift} onClick={() => nav(`/offers?candidate=${c.id}`)} disabled={!can('offers.manage')}>Create offer</Button>
              <Button size="sm" icon={Mail} onClick={() => setMessaging(true)} disabled={!can('templates.manage')}>Message</Button>
              {!terminal && can('candidates.reject') && <Button size="sm" icon={UserX} onClick={() => onReject(c)}>Reject</Button>}
            </div>
          )}

          <Section title="Pipeline">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Stage">
                <select value={c.stage === 'rejected' ? 'rejected' : c.stage} disabled={!manage || busy} onChange={(e) => (e.target.value === 'rejected' ? onReject(c) : run(() => moveApplicant(id, e.target.value), `Moved to ${STAGE_LABEL[e.target.value]}`))} className={inputCls}>
                  {PIPELINE.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </Field>
              <Field label="Owner">
                <select value={c.owner?.id ?? ''} disabled={!manage || busy} onChange={(e) => run(() => updateApplicant(id, { ownerId: e.target.value || null }), 'Owner updated')} className={inputCls}>
                  <option value="">Unassigned</option>
                  {team.filter((m) => m.status !== 'disabled').map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </Field>
              <Field label="Follow-up date">
                <input type="date" value={c.followUpOn ? c.followUpOn.slice(0, 10) : ''} disabled={!manage || busy} onChange={(e) => run(() => updateApplicant(id, { followUpOn: e.target.value || null }), 'Follow-up saved')} className={inputCls} />
              </Field>
            </div>
            <div className="mt-3">
              <p className="mb-1 text-[12px] font-semibold text-ink-2">Internal tags</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {c.tags.map((t) => <Tag key={t} onRemove={manage ? () => run(() => updateApplicant(id, { tags: c.tags.filter((x) => x !== t) })) : undefined}>{t}</Tag>)}
                {c.tags.length === 0 && <span className="text-[12.5px] text-muted">No tags</span>}
              </div>
              {manage && (
                <form onSubmit={(e) => { e.preventDefault(); addTag() }} className="mt-2 flex gap-2">
                  <input value={tag} onChange={(e) => setTag(e.target.value)} maxLength={30} placeholder="Add a tag, e.g. Strong referral" aria-label="New tag" className={`${inputCls} flex-1`} />
                  <Button type="submit" size="sm" disabled={busy || !tag.trim()}>Add</Button>
                </form>
              )}
            </div>
          </Section>

          <Section title="Private notes" aside={<span className="inline-flex items-center gap-1 text-[11.5px] text-muted"><Lock size={11} /> Your team only</span>}>
            {manage && (
              <form onSubmit={(e) => { e.preventDefault(); if (note.trim().length >= 2) run(async () => { await addApplicantNote(id, note.trim()); setNote('') }, 'Note added') }}>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={2000} placeholder="Add a note about this candidate" aria-label="New note" className={textareaCls} />
                <div className="mt-1.5 flex justify-end"><Button type="submit" size="sm" variant="primary" disabled={busy || note.trim().length < 2}>Add note</Button></div>
              </form>
            )}
            <ul className="mt-2 space-y-2">
              {c.notes.length === 0 && <li className="text-[12.5px] text-muted">No notes yet.</li>}
              {c.notes.map((n) => (
                <li key={n.id} className="rounded-lg bg-[#faf9f6] px-3 py-2">
                  <p className="whitespace-pre-line text-[13px]">{n.kind === 'rejection' ? <><b className="text-[#9a3a2c]">Internal rejection reason: </b>{n.text}</> : n.text}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted">{n.byName} · {fmtDateTime(n.at)}</p>
                </li>
              ))}
            </ul>
          </Section>

          {c.interviews.length > 0 && (
            <Section title="Interviews" aside={<Link to="/interviews" className="text-[12px] font-semibold text-accent hover:underline">Open</Link>}>
              <ul className="space-y-1.5 text-[13px]">
                {c.interviews.map((i) => <li key={i.id} className="flex justify-between gap-3"><span>{i.round || 'Interview'} · {fmtDateTime(i.startsAt)}</span><span className="text-muted">{i.status} · {i.scorecards} scorecard{i.scorecards === 1 ? '' : 's'}</span></li>)}
              </ul>
            </Section>
          )}

          <Section title="Activity history">
            <ol className="relative ml-1.5 border-l border-line">
              {c.events.length === 0 && <li className="pl-4 text-[12.5px] text-muted">Nothing recorded yet.</li>}
              {c.events.map((e) => (
                <li key={e.id} className="relative pb-3 pl-4 last:pb-0">
                  <span aria-hidden className="absolute -left-[3.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-[#9db0bd]" />
                  <p className="text-[13px] leading-snug"><span className="mr-1.5 text-[11px] font-bold uppercase tracking-wide text-muted">{EVENT_LABEL[e.type] ?? e.type}</span>{e.text}</p>
                  <p className="text-[11.5px] text-muted">{[e.actorName, ago(e.at)].filter(Boolean).join(' · ')}</p>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      )}
      <SendMessageModal candidate={messaging ? asCandidate : null} onClose={() => setMessaging(false)} onSent={() => { load(); onChanged() }} toast={toast} />
    </Sheet>
  )
}
