import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, Building2, Phone, Mail, MessageSquare, CalendarPlus, Bookmark, FolderPlus, Pin, FileText, GitCompareArrows, Share2, ExternalLink, Sparkles, GraduationCap, Award, Languages, Briefcase, Clock, IndianRupee, Activity, StickyNote, Lightbulb, Lock, Database, Eye } from 'lucide-react'
import { useActions } from '../components/useActions'
import { NotesList } from '../components/ActionModals'
import { ResumeFrame, ResumeLinks } from '../components/ResumeViewer'
import { Avatar, Button, Chip, MatchBadge, SectionCard, Skeleton, StatusPill, TrustScore, VerifiedBadge, EmptyState } from '../components/ui'
import { getTalent, findSimilar } from '../services/talentService'
import { setCandidateStage, getResumeLink } from '../services/liveApi'
import { STAGES, STAGE_LABELS } from '../lib/talent/criteria'
import { computeMatch, computeTrust, MATCH_LABELS } from '../lib/talent/engine'
import { loadLastCriteria } from '../lib/lastCriteria'
import { loadLastResults } from '../lib/lastResults'
import { useWorkspace } from '../store/workspace'
import { lpa, years, notice, ago } from '../lib/format'
import { IS_DEMO } from '../lib/config'

// Email and phone stay masked until the company views them: the button opens
// the confirm step, and one credit then opens email, phone and CV together —
// never charged again for the same candidate.
function ContactFact({ candidate: c, onView }) {
  if (c.contact) return <>{c.contact.email || '—'}<br />{c.contact.phone || '—'}</>
  const preview = c._live?.contactPreview
  return (
    <>
      <span className="text-ink-2">{preview?.email ?? '—'}</span>
      <br />
      <span className="text-ink-2">{preview?.phone ?? '—'}</span>
      <button onClick={onView} className="mt-1.5 flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[12px] font-semibold text-accent transition-colors hover:bg-accent-soft">
        <Eye size={12} /> View · 1 credit
      </button>
    </>
  )
}

function Fact({ icon: Icon, label, children }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-wide text-muted"><Icon size={12} /> {label}</p>
      <p className="mt-0.5 text-[14px] font-medium">{children}</p>
    </div>
  )
}

function Timeline({ history }) {
  if (!history.length) return <p className="text-[13px] text-muted">No work history on this profile.</p>
  return (
    <ol className="relative ml-2 space-y-6 border-l-2 border-line-2 pl-6">
      {history.map((w, i) => (
        <li key={`${w.company}-${i}`} className="relative">
          <span className={`absolute -left-[33px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-white ${i === 0 ? 'bg-accent' : 'bg-[#c5c9d8]'}`} />
          <p className="text-[12px] font-medium text-muted">{w.startYear ?? '—'} — {w.endYear ?? 'Present'}</p>
          <p className="text-[15px] font-semibold">{w.role}</p>
          <p className="text-[13.5px] text-ink-2">{w.company}{w.location ? ` · ${w.location}` : ''}</p>
          {w.skills?.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{w.skills.map((s) => <Chip key={s}>{s}</Chip>)}</div>}
        </li>
      ))}
    </ol>
  )
}

// The attached CV, shown inline like a job board's resume view. It loads as
// soon as the plan or an unlock allows; until then it's a locked placeholder.
function CvSection({ candidate: c, onUnlock }) {
  const [cv, setCv] = useState({ status: 'loading' })
  useEffect(() => {
    if (IS_DEMO) return setCv({ status: 'demo' })
    // A database profile nobody at this company unlocked can't have a CV link — skip the request.
    if (c._live?.kind === 'resdex' && !c._live.unlocked) return setCv({ status: 'locked' })
    let live = true
    setCv({ status: 'loading' })
    getResumeLink(c)
      .then((f) => live && setCv({ status: 'ready', ...f }))
      .catch((e) => live && setCv({ status: e.code === 'LOCKED' ? 'locked' : e.code === 'NO_RESUME' ? 'none' : 'error' }))
    return () => {
      live = false
    }
  }, [c])

  return (
    <SectionCard title="CV" action={cv.status === 'ready' && <ResumeLinks url={cv.url} />}>
      {cv.status === 'loading' && <Skeleton className="h-[420px] w-full" />}
      {cv.status === 'ready' && <ResumeFrame url={cv.url} fileName={cv.fileName} title={`${c.name} — CV`} className="h-[760px]" />}
      {cv.status === 'locked' && (
        <div className="relative overflow-hidden rounded-xl border border-line">
          <div aria-hidden className="space-y-2.5 p-6 blur-[3px]">
            {[70, 45, 90, 80, 60, 85, 40, 75].map((w, i) => <div key={i} className="h-2.5 rounded bg-line-2" style={{ width: `${w}%` }} />)}
          </div>
          <div className="absolute inset-0 grid place-items-center bg-white/60 p-4 text-center">
            <div>
              <p className="flex items-center justify-center gap-1.5 text-[14px] font-semibold"><Lock size={14} /> CV is locked</p>
              <p className="mt-1 text-[13px] text-muted">Viewing {c.name.split(' ')[0]}'s CV, email or phone uses 1 credit — once. After that all three stay open.</p>
              <Button variant="primary" size="sm" icon={Eye} className="mt-3" onClick={onUnlock}>View CV · 1 credit</Button>
            </div>
          </div>
        </div>
      )}
      {cv.status === 'none' && <p className="text-[13px] text-muted">No verified CV on this profile yet.</p>}
      {cv.status === 'error' && <p className="text-[13px] text-muted">Couldn't load the CV. Refresh the page to try again.</p>}
      {cv.status === 'demo' && <p className="text-[13px] text-muted">Demo profiles have no CV.</p>}
    </SectionCard>
  )
}

export default function CandidateProfile() {
  const { id } = useParams()
  const nav = useNavigate()
  const criteria = useMemo(() => loadLastCriteria(), [])
  const results = useMemo(() => loadLastResults(), [])
  const { notes, shortlists, savedIds, toggleSaved, compare, toggleCompare, markViewed } = useWorkspace()
  const [c, setC] = useState(undefined)
  const [similar, setSimilar] = useState(null)
  const [stageBusy, setStageBusy] = useState(false)
  const { toast } = useWorkspace()

  const reload = () => getTalent(id).then((x) => setC(x ?? null))
  const { onAction, host } = useActions(criteria, { onUnlocked: reload })
  const moveStage = async (stage) => {
    let reason
    if (stage === 'rejected') {
      reason = window.prompt('Reason for rejecting (optional)') ?? undefined
    }
    setStageBusy(true)
    try {
      await setCandidateStage(c._live.candidateId, stage, reason)
      toast(`Moved to ${STAGE_LABELS[stage]}`)
      await reload()
    } catch (e) {
      toast(e.response?.data?.message ?? 'Could not update the stage', { tone: 'warn' })
    } finally {
      setStageBusy(false)
    }
  }

  useEffect(() => {
    setC(undefined)
    setSimilar(null)
    window.scrollTo({ top: 0 })
    getTalent(id).then((x) => setC(x ?? null))
    findSimilar(id).then(setSimilar)
  }, [id])

  // markViewed changes identity whenever `viewed` does, so depending on it would re-mark forever.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (c) markViewed(c.id)
  }, [c?.id])

  const match = useMemo(() => (c ? computeMatch(c, criteria) : null), [c, criteria])
  const trust = useMemo(() => (c ? computeTrust(c) : null), [c])

  if (c === undefined) {
    return (
      <div className="mx-auto max-w-[1280px] space-y-4 px-4 py-6 lg:px-6">
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }
  if (c === null) return <EmptyState title="Candidate not found" body="They may have been removed from the pool." action={<Button onClick={() => nav('/')}>Back to search</Button>} />

  const row = { candidate: c, match, trust }
  const pos = results.indexOf(c.id)
  const prevId = pos > 0 ? results[pos - 1] : null
  const nextId = pos >= 0 && pos < results.length - 1 ? results[pos + 1] : null
  // replace: stepping through results shouldn't stack history, so Back still returns to the list.
  const step = (to) => nav(`/candidate/${to}`, { replace: true })
  const inList = shortlists.some((l) => l.candidateIds.includes(c.id))
  const bookmarked = savedIds.includes(c.id)
  const scoredParts = Object.entries(match.parts).filter(([, v]) => v != null)

  const recommended = [
    c.noticePeriodDays != null && c.noticePeriodDays <= 30 && { text: `Available within ${notice(c.noticePeriodDays)} — reach out early.`, act: ['Contact', () => onAction('contact', c)] },
    trust.rows.find((r) => r.key === 'employment')?.status !== 'verified' && { text: 'Employment history is not verified yet — confirm during screening.', act: ['Add note', () => onAction('note', c)] },
    !inList && { text: 'Not in any shortlist yet.', act: ['Shortlist', () => onAction('shortlist', c)] },
  ].filter(Boolean)

  const actions = [
    { label: 'Contact', icon: Mail, primary: true, run: () => onAction('contact', c) },
    { label: 'Call', icon: Phone, run: () => onAction('call', c) },
    { label: 'Message', icon: MessageSquare, run: () => onAction('message', c) },
    { label: 'Schedule interview', icon: CalendarPlus, run: () => onAction('interview', c) },
    { label: inList ? 'Shortlisted' : 'Shortlist', icon: Bookmark, run: () => onAction('shortlist', c), on: inList },
    { label: 'Add to job', icon: FolderPlus, run: () => onAction('job', c) },
    { label: bookmarked ? 'Saved' : 'Save', icon: Pin, run: () => toggleSaved(c.id), on: bookmarked },
  ]

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-28 pt-5 lg:px-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <button onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink"><ArrowLeft size={14} /> Back to results</button>
        {pos >= 0 && results.length > 1 && (
          <nav aria-label="Search results" className="flex items-center gap-1">
            <Button size="sm" variant="ghost" icon={ChevronLeft} disabled={!prevId} onClick={() => step(prevId)}>Previous</Button>
            <span className="px-1 text-[12.5px] tabular-nums text-muted">{(pos + 1).toLocaleString('en-IN')} of {results.length.toLocaleString('en-IN')}</span>
            <Button size="sm" variant="ghost" disabled={!nextId} onClick={() => step(nextId)}>Next <ChevronRight size={14} /></Button>
          </nav>
        )}
      </div>

      <header className="rounded-2xl border border-line bg-white p-5 shadow-card md:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar candidate={c} size={68} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[24px] font-bold tracking-tight">{c.name}</h1>
              <VerifiedBadge candidate={c} />
              {IS_DEMO && <span className="rounded-md bg-warn-soft px-1.5 py-0.5 text-[11px] font-semibold text-warn">Demo profile</span>}
              {c._live?.kind === 'resdex' && <span className="inline-flex items-center gap-1 rounded-md bg-line-2 px-1.5 py-0.5 text-[11px] font-semibold text-ink-2" title="Found in the Mzobs resume database — not in your pipeline yet"><Database size={11} /> Resume database</span>}
            </div>
            <p className="mt-0.5 text-[15px] text-ink-2">{c.designation}{c.currentCompany && <> <span className="text-muted">at</span> {c.currentCompany}</>}</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
              <span className="inline-flex items-center gap-1"><MapPin size={13} /> {c.location || '—'}</span>
              {c.companyType && <span className="inline-flex items-center gap-1"><Building2 size={13} /> {c.companyType}</span>}
              {c.lastActiveDaysAgo != null ? <span>Active {ago(c.lastActiveDaysAgo)}</span> : c.sharedDaysAgo != null && <span>Shared with you {ago(c.sharedDaysAgo)}</span>}
              {c.resumeUpdatedDaysAgo != null && <span>Resume updated {ago(c.resumeUpdatedDaysAgo)}</span>}
              {!IS_DEMO && c.jobTitle && <span>For {c.jobTitle}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <MatchBadge score={match.overall} onClick={() => onAction('why', row)} />
            <TrustScore score={trust.score} onClick={() => onAction('trust', row)} />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-line-2 pt-4">
          {actions.map((a) => (
            <Button key={a.label} variant={a.primary ? 'primary' : 'outline'} icon={a.icon} onClick={a.run} className={a.on ? 'border-[#bfe8cf] bg-ok-soft text-[#1a8f5a]' : ''}>{a.label}</Button>
          ))}
          <Button icon={GitCompareArrows} onClick={() => toggleCompare(c.id)}>{compare.includes(c.id) ? 'In compare' : 'Compare'}</Button>
          <Button icon={FileText} onClick={() => onAction('resume', c)}>View CV</Button>
          <Button variant="ghost" icon={Share2} onClick={() => onAction('share', c)}>Share</Button>
        </div>
        {!IS_DEMO && c._live?.candidateId && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line-2 pt-4">
            <span className="text-[12px] font-medium uppercase tracking-wide text-muted">Pipeline</span>
            {STAGES.map((st) => (
              <button key={st} disabled={stageBusy || c.stage === st} onClick={() => moveStage(st)} className={`rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors ${c.stage === st ? 'border-accent bg-accent-soft text-[#0a6f64]' : 'border-line text-ink-2 hover:bg-line-2 disabled:opacity-50'}`}>{STAGE_LABELS[st]}</button>
            ))}
            {c.stage === 'rejected' && c.rejectionReason && <span className="text-[12.5px] text-muted">Reason: {c.rejectionReason}</span>}
          </div>
        )}
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <SectionCard title="Professional summary">
            <p className="text-[14px] leading-6 text-ink-2">{c.summary || 'No summary provided.'}</p>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              <Fact icon={Briefcase} label="Experience">{years(c.experienceYears)}</Fact>
              {!IS_DEMO && <Fact icon={Mail} label="Contact"><ContactFact candidate={c} onView={() => onAction('unlock', c)} /></Fact>}
              {c.currentSalaryLPA != null && <Fact icon={IndianRupee} label="Current CTC">{lpa(c.currentSalaryLPA)}</Fact>}
              <Fact icon={IndianRupee} label="Expected CTC">{lpa(c.expectedSalaryLPA)}</Fact>
              {c.noticePeriodDays != null && <Fact icon={Clock} label="Notice period">{notice(c.noticePeriodDays)}</Fact>}
            </div>
            {c.links?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {c.links.map((l) => <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-[12.5px] font-medium text-blue hover:bg-line-2"><ExternalLink size={12} /> {l.label}</a>)}
              </div>
            )}
          </SectionCard>

          <CvSection candidate={c} onUnlock={() => onAction('unlock', c)} />

          <SectionCard title="Experience">
            <Timeline history={c.workHistory} />
          </SectionCard>

          <SectionCard title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s) => <Chip key={s} tone={match.strong.some((m) => m.toLowerCase() === s.toLowerCase()) ? 'hit' : 'neutral'}>{s}</Chip>)}
            </div>
            {match.weak.length > 0 && <p className="mt-3 text-[12.5px] text-muted">Not listed for your search: {match.weak.join(', ')}</p>}
          </SectionCard>

          {c.projects.length > 0 && (
            <SectionCard title="Projects">
              <ul className="space-y-4">{c.projects.map((p) => <li key={p.name}><p className="text-[14px] font-semibold">{p.name}</p><p className="text-[13.5px] text-ink-2">{p.description}</p>{p.tech?.length > 0 && <div className="mt-1.5 flex flex-wrap gap-1.5">{p.tech.map((t) => <Chip key={t}>{t}</Chip>)}</div>}</li>)}</ul>
            </SectionCard>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <SectionCard title="Education">
              <ul className="space-y-3">{c.education.length ? c.education.map((e, i) => <li key={i} className="flex gap-3"><GraduationCap size={16} className="mt-0.5 text-muted" /><div><p className="text-[14px] font-medium">{e.degree}</p><p className="text-[13px] text-muted">{e.institute}{e.year ? ` · ${e.year}` : ''}</p></div></li>) : <li className="text-[13px] text-muted">Not provided.</li>}</ul>
            </SectionCard>
            <SectionCard title="Certifications & languages">
              <ul className="space-y-2">
                {c.certifications.map((x) => <li key={x} className="flex items-center gap-2 text-[13.5px]"><Award size={15} className="text-muted" /> {x}</li>)}
                {c.certifications.length === 0 && <li className="text-[13px] text-muted">No certifications listed.</li>}
                {c.languages.length > 0 && <li className="flex items-center gap-2 pt-1 text-[13.5px]"><Languages size={15} className="text-muted" /> {c.languages.join(', ')}</li>}
              </ul>
            </SectionCard>
          </div>

          <SectionCard title="Preferences & availability">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <Fact icon={MapPin} label="Preferred locations">{c.preferredLocations.join(', ') || '—'}</Fact>
              <Fact icon={Building2} label="Work mode">{c.workMode || '—'}</Fact>
              <Fact icon={Briefcase} label="Employment">{c.employmentType || '—'}</Fact>
            </div>
          </SectionCard>

          <SectionCard title="Verification">
            <ul className="divide-y divide-line-2">
              {trust.rows.map((r) => (
                <li key={r.key} className="flex items-center justify-between py-2.5">
                  <div><p className="text-[13.5px] font-medium">{r.label}</p>{r.detail && <p className="text-[12px] text-muted">{r.detail}</p>}</div>
                  <StatusPill status={r.status} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-[72px] lg:self-start">
          <SectionCard title="AI match analysis" action={<Sparkles size={15} className="text-ai" />}>
            {scoredParts.length === 0 ? (
              <p className="text-[13px] text-muted">Run a search with skills, role or location and this panel will explain how {c.name.split(' ')[0]} fits.</p>
            ) : (
              <div className="space-y-2.5">
                {scoredParts.map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2.5 text-[12.5px]">
                    <span className="w-28 text-ink-2">{MATCH_LABELS[k]}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-2"><div className={`h-full rounded-full ${v >= 85 ? 'bg-ai' : v >= 65 ? 'bg-blue' : 'bg-[#f59e0b]'}`} style={{ width: `${v}%` }} /></div>
                    <b className="w-9 text-right tabular-nums">{v}%</b>
                  </div>
                ))}
                <Button size="sm" className="mt-2 w-full" onClick={() => onAction('why', row)}>Full explanation</Button>
              </div>
            )}
          </SectionCard>

          <SectionCard title={`Candidates similar to ${c.name.split(' ')[0]}`}>
            {similar === null ? <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div> : (
              <ol className="space-y-1">
                {similar.map((s, i) => (
                  <li key={s.candidate.id}>
                    <Link to={`/candidate/${s.candidate.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-line-2">
                      <span className="w-4 text-[12px] text-muted">{i + 1}</span>
                      <Avatar candidate={s.candidate} size={32} />
                      <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-medium">{s.candidate.name}</span><span className="block truncate text-[12px] text-muted">{s.candidate.designation} · {years(s.candidate.experienceYears)}</span></span>
                      <span className="text-[12.5px] font-semibold text-[#0a6f64]">{s.score}%</span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-2 text-[11.5px] text-muted">Based on skills, role, experience, industry, location and salary.</p>
          </SectionCard>

          <SectionCard title="Recommended actions" action={<Lightbulb size={15} className="text-warn" />}>
            {recommended.length === 0 ? <p className="text-[13px] text-muted">Nothing pending for this candidate.</p> : (
              <ul className="space-y-3">{recommended.map((r) => <li key={r.text} className="flex items-start justify-between gap-3 text-[13px]"><span className="text-ink-2">{r.text}</span><Button size="sm" onClick={r.act[1]}>{r.act[0]}</Button></li>)}</ul>
            )}
          </SectionCard>

          <SectionCard title="Recruiter notes" action={<button onClick={() => onAction('note', c)} className="flex items-center gap-1 text-[12.5px] font-medium text-accent"><StickyNote size={13} /> Add</button>}>
            <NotesList notes={notes[c.id]} />
          </SectionCard>

          <SectionCard title="Candidate activity" action={<Activity size={15} className="text-muted" />}>
            <ul className="space-y-2 text-[13px] text-ink-2">
              {c.lastActiveDaysAgo != null ? <li>Last active {ago(c.lastActiveDaysAgo)}</li> : c.sharedDaysAgo != null && <li>Shared with you {ago(c.sharedDaysAgo)}</li>}
              {c.resumeUpdatedDaysAgo != null && <li>Resume updated {ago(c.resumeUpdatedDaysAgo)}</li>}
              <li>Profile {c.profileCompleteness}% complete</li>
              <li className="flex items-center gap-1 text-muted"><ExternalLink size={12} /> Source: {c.source}</li>
            </ul>
          </SectionCard>
        </aside>
      </div>
      {host}
    </div>
  )
}
