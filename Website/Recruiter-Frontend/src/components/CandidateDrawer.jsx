import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { X, ChevronUp, ChevronDown, MapPin, Briefcase, IndianRupee, Clock, Check, AlertCircle, Bookmark, Mail, FolderPlus, ExternalLink, Sparkles } from 'lucide-react'
import { Avatar, Button, Chip, IconButton, MatchBadge, StatusPill, TrustScore, VerifiedBadge } from './ui'
import ShortlistPicker from './ShortlistPicker'
import { MATCH_LABELS } from '../lib/talent/engine'
import { lpa, years, notice, ago } from '../lib/format'
import { useWorkspace } from '../store/workspace'

function Bar({ value }) {
  const color = value >= 85 ? 'bg-ai' : value >= 65 ? 'bg-blue' : 'bg-[#f59e0b]'
  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-2">
      <div className={clsx('h-full rounded-full transition-[width] duration-500 ease-out', color)} style={{ width: `${value}%` }} />
    </div>
  )
}

/**
 * Right-hand preview that opens on a candidate click. It is part of the page, not
 * a modal: no dimming, the results stay visible and scrollable, ↑/↓ (or the
 * chevrons) step through the result list, Esc closes.
 */
export default function CandidateDrawer({ row, list, onClose, onStep, onAction }) {
  const { shortlists } = useWorkspace()
  const [pick, setPick] = useState(false)
  const [entered, setEntered] = useState(false)
  const bodyRef = useRef(null)
  const why = useRef(null)

  useEffect(() => {
    setEntered(true)
  }, [])
  useEffect(() => {
    setPick(false)
    bodyRef.current?.scrollTo({ top: 0 })
  }, [row?.candidate.id])

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName
      if (e.key === 'Escape') return onClose()
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); onStep(1) }
      if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); onStep(-1) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  if (!row) return null
  const { candidate: c, match: m, trust } = row
  const parts = Object.entries(m.parts).filter(([, v]) => v != null)
  const idx = list ? list.findIndex((r) => r.candidate.id === c.id) : -1
  const inLists = shortlists.filter((l) => l.candidateIds.includes(c.id))
  const v = c.verification

  return (
    <>
      <aside
        role="complementary"
        aria-label={`Preview of ${c.name}`}
        className={clsx('fixed inset-y-0 right-0 z-40 flex w-full flex-col border-l border-line bg-white shadow-pop transition-transform duration-200 ease-out sm:w-[480px]', entered ? 'translate-x-0' : 'translate-x-6')}
      >
        <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <p className="text-[12px] text-muted">{idx >= 0 ? `Candidate ${idx + 1} of ${list.length}` : 'Candidate preview'}</p>
          <div className="flex items-center gap-0.5">
            {idx >= 0 && (
              <>
                <IconButton label="Previous candidate (↑)" icon={ChevronUp} disabled={idx <= 0} onClick={() => onStep(-1)} />
                <IconButton label="Next candidate (↓)" icon={ChevronDown} disabled={idx >= list.length - 1} onClick={() => onStep(1)} />
              </>
            )}
            <IconButton label="Close (Esc)" icon={X} onClick={onClose} />
          </div>
        </header>

        <div ref={bodyRef} key={c.id} className="scroll-thin fade-up flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <div className="flex items-start gap-3.5">
            <Avatar candidate={c} size={52} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[20px] font-bold tracking-tight">{c.name}</h2>
                <VerifiedBadge candidate={c} />
              </div>
              <p className="text-[14px] text-ink-2">{c.designation}{c.currentCompany && <span className="text-muted"> · {c.currentCompany}</span>}</p>
              {inLists.length > 0 && <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-[#1a8f5a]"><Check size={12} /> In {inLists.map((l) => l.name).join(', ')}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <MatchBadge score={m.overall} onClick={() => why.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
            <TrustScore score={trust.score} onClick={() => onAction('trust', row)} />
            {v.phone === 'verified' && <StatusPill status="verified" label="Phone verified" />}
            {v.email === 'verified' && <StatusPill status="verified" label="Email verified" />}
            {v.identity === 'verified' && <StatusPill status="verified" label="Identity verified" />}
            {v.education === 'verified' && <StatusPill status="verified" label="Education verified" />}
            {v.employment === 'verified' && <StatusPill status="verified" label="Employment verified" />}
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-[#f5f9fb] p-3.5 text-[13px]">
            <div className="flex items-center gap-2"><MapPin size={14} className="text-muted" /><dd>{c.location || '—'}</dd></div>
            <div className="flex items-center gap-2"><Briefcase size={14} className="text-muted" /><dd>{years(c.experienceYears)}</dd></div>
            {c.expectedSalaryLPA != null && <div className="flex items-center gap-2"><IndianRupee size={14} className="text-muted" /><dd>{c.currentSalaryLPA != null ? `${lpa(c.currentSalaryLPA)} → ` : 'Expects '}{lpa(c.expectedSalaryLPA)}</dd></div>}
            {c.noticePeriodDays != null && <div className="flex items-center gap-2"><Clock size={14} className="text-muted" /><dd>{notice(c.noticePeriodDays)} notice</dd></div>}
            {c.lastActiveDaysAgo != null ? <p className="col-span-2 text-[12px] text-muted">Active {ago(c.lastActiveDaysAgo)}</p> : c.sharedDaysAgo != null && <p className="col-span-2 text-[12px] text-muted">Shared with you {ago(c.sharedDaysAgo)}</p>}
          </dl>

          <section>
            <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s) => <Chip key={s} tone={m.strong.some((x) => x.toLowerCase() === s.toLowerCase()) ? 'hit' : 'neutral'}>{s}</Chip>)}
              {c.skills.length === 0 && <span className="text-[13px] text-muted">No skills listed.</span>}
            </div>
          </section>

          <section ref={why} className="scroll-mt-4">
            <h3 className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-accent"><Sparkles size={13} /> Why Mzobs matched this candidate</h3>
            {parts.length === 0 ? (
              <p className="rounded-xl bg-line-2 px-3 py-2.5 text-[13px] text-muted">Add skills, a role, experience or location to your search and Mzobs will explain how this candidate fits.</p>
            ) : (
              <div className="space-y-2.5">
                {parts.map(([k, val]) => (
                  <div key={k} className="flex items-center gap-3 text-[13px]">
                    <span className="w-32 text-ink-2">{MATCH_LABELS[k]}</span>
                    <Bar value={val} />
                    <b className="w-10 text-right tabular-nums">{val}%</b>
                  </div>
                ))}
                {m.strong.length > 0 && (
                  <div className="pt-1.5">
                    <p className="mb-1 flex items-center gap-1 text-[12px] font-semibold text-[#1a8f5a]"><Check size={12} /> Strong matches</p>
                    <div className="flex flex-wrap gap-1.5">{m.strong.map((s) => <Chip key={s} tone="ok">{s}</Chip>)}</div>
                  </div>
                )}
                {(m.weak.length > 0 || m.notes.length > 0) && (
                  <div className="pt-1.5">
                    <p className="mb-1 flex items-center gap-1 text-[12px] font-semibold text-warn"><AlertCircle size={12} /> Potential gaps</p>
                    <div className="flex flex-wrap gap-1.5">{m.weak.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                    {m.notes.length > 0 && <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[12.5px] text-ink-2">{m.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
                  </div>
                )}
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted">Experience</h3>
            {c.workHistory.length === 0 ? <p className="text-[13px] text-muted">No work history on this profile.</p> : (
              <ol className="relative ml-1.5 space-y-4 border-l-2 border-line-2 pl-5">
                {c.workHistory.map((w, i) => (
                  <li key={`${w.company}-${i}`} className="relative">
                    <span className={clsx('absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white', i === 0 ? 'bg-accent' : 'bg-[#c5cfd8]')} />
                    <p className="text-[14px] font-semibold">{w.role}</p>
                    <p className="text-[12.5px] text-ink-2">{w.company}</p>
                    <p className="text-[12px] text-muted">{w.duration ?? `${w.startYear ?? '—'} – ${w.endYear ?? 'Present'}`}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <footer className="relative border-t border-line bg-white px-4 py-3">
          {pick && <ShortlistPicker candidate={c} onClose={() => setPick(false)} className="bottom-full left-4 mb-2" />}
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/candidate/${c.id}`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-bold text-[#e8f8f5] transition-colors hover:bg-accent">
              View full profile <ExternalLink size={13} />
            </Link>
            <Button icon={inLists.length ? Check : Bookmark} onClick={() => setPick((x) => !x)} className={inLists.length ? 'border-[#bfe8cf] bg-ok-soft text-[#1a8f5a]' : ''}>{inLists.length ? 'Shortlisted' : 'Shortlist'}</Button>
            <Button icon={Mail} onClick={() => onAction('contact', c)}>Contact</Button>
            <Button icon={FolderPlus} onClick={() => onAction('job', c)}>Add to job</Button>
          </div>
        </footer>
      </aside>
    </>
  )
}
