import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { MapPin, Briefcase, IndianRupee, Clock, GraduationCap, Building2, MoreHorizontal, Eye, Unlock, Bookmark, Mail, MessageSquare, Phone, CalendarPlus, BellRing, StickyNote, FileText, Share2, GitCompareArrows, FolderPlus, Send, Check, Pin, Lock } from 'lucide-react'
import { Avatar, Button, Chip, Highlight, MatchBadge, TrustScore, VerifiedBadge, IconButton } from './ui'
import { lpa, years, notice, ago, agoDate } from '../lib/format'
import { STAGE_LABELS } from '../lib/talent/criteria'
import { IS_DEMO } from '../lib/config'
import { isRevealed, creditSpent } from '../lib/reveal'
import { useWorkspace } from '../store/workspace'

const MORE_ACTIONS = [
  { id: 'job', label: 'Add to job', icon: FolderPlus },
  { id: 'message', label: 'Send message', icon: MessageSquare },
  { id: 'email', label: 'Send email', icon: Mail },
  { id: 'sms', label: 'Send SMS', icon: Send },
  { id: 'call', label: 'Call', icon: Phone },
  { id: 'interview', label: 'Schedule interview', icon: CalendarPlus },
  { id: 'reminder', label: 'Set reminder', icon: BellRing },
  { id: 'note', label: 'Add note', icon: StickyNote },
  { id: 'resume', label: 'View CV', icon: FileText },
  { id: 'share', label: 'Share profile', icon: Share2 },
]

function Meta({ icon: Icon, children, title }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-2" title={title}>
      <Icon size={13} className="text-[#7d93a6]" /> {children}
    </span>
  )
}

function ShortlistButton({ candidate, onAction }) {
  const { shortlists } = useWorkspace()
  const inList = shortlists.some((l) => l.candidateIds.includes(candidate.id))
  return (
    <Button size="sm" variant={inList ? 'outline' : 'outline'} onClick={() => onAction('shortlist', candidate)} className={clsx(inList && 'border-[#bfe8cf] bg-ok-soft text-[#1a8f5a]')}>
      {inList ? <Check size={14} className="pop" /> : <Bookmark size={14} />} {inList ? 'Shortlisted' : 'Shortlist'}
    </Button>
  )
}

function CandidateCard({ row, terms, compact, onAction }) {
  const { candidate: c, match, trust } = row
  const { selected, toggleSelect, compare, toggleCompare, savedIds, toggleSaved, viewed } = useWorkspace()
  const [menu, setMenu] = useState(false)
  const isSel = selected.includes(c.id)
  const inCompare = compare.includes(c.id)
  const strong = new Set(match.strong.map((s) => s.toLowerCase()))
  const skills = [...c.skills].sort((a, b) => Number(strong.has(b.toLowerCase())) - Number(strong.has(a.toLowerCase())))
  const shown = compact ? skills.slice(0, 5) : skills.slice(0, 8)
  const bookmarked = savedIds.includes(c.id)

  return (
    <article
      className={clsx(
        'group relative rounded-2xl border bg-white p-4 shadow-card transition-all duration-150 [content-visibility:auto] [contain-intrinsic-size:auto_220px] hover:-translate-y-px hover:border-[#9fd5cc] hover:shadow-lift sm:p-5',
        isSel ? 'border-accent bg-[#f3fbf9]' : 'border-line'
      )}
    >
      <div className="flex gap-3 sm:gap-4">
        <input type="checkbox" checked={isSel} onChange={() => toggleSelect(c.id)} aria-label={`Select ${c.name}`} className="mt-3 h-4 w-4 shrink-0 accent-[#0a6f64]" />
        <Avatar candidate={c} size={compact ? 38 : 46} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link to={`/candidate/${c.id}`} className="truncate text-[16px] font-semibold text-ink hover:text-accent"><Highlight text={c.name} terms={terms} /></Link>
                <VerifiedBadge candidate={c} />
                {creditSpent(c) && <span className="inline-flex items-center gap-1 rounded-md bg-ok-soft px-1.5 py-0.5 text-[11px] font-semibold text-[#1a8f5a]" title={isRevealed(c, 'resume') ? 'Your company has opened this CV' : 'Credit used for this candidate — email, phone and CV each open free'}><Unlock size={11} /> {isRevealed(c, 'resume') ? 'CV unlocked' : 'Credit used'}</span>}
                {viewed[c.id] && <span className="inline-flex items-center gap-1 rounded-md bg-line-2 px-1.5 py-0.5 text-[11px] font-medium text-muted" title={`You opened this profile ${agoDate(viewed[c.id])}`}><Eye size={11} /> Viewed</span>}
                <button onClick={() => toggleSaved(c.id)} aria-label={bookmarked ? 'Unsave candidate' : 'Save candidate'} className={clsx('opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100', bookmarked && 'opacity-100')}>
                  <Pin size={14} className={bookmarked ? 'fill-accent text-accent' : 'text-muted'} />
                </button>
              </div>
              <p className="mt-0.5 text-[14px] text-ink-2"><Highlight text={c.designation} terms={terms} />{c.currentCompany && <> <span className="text-muted">at</span> <Highlight text={c.currentCompany} terms={terms} /></>}</p>
            </div>
            <MatchBadge score={match.overall} onClick={() => onAction('why', row)} />
          </div>

          <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
            <Meta icon={Briefcase}>{years(c.experienceYears)}</Meta>
            {c.expectedSalaryLPA != null && <Meta icon={IndianRupee} title="Current → expected salary">{c.currentSalaryLPA != null ? `${lpa(c.currentSalaryLPA)} → ` : 'Expects '}{lpa(c.expectedSalaryLPA)}</Meta>}
            <Meta icon={MapPin}>{c.location || '—'}</Meta>
            {c.noticePeriodDays != null && <Meta icon={Clock} title="Notice period">{notice(c.noticePeriodDays)} notice</Meta>}
            {c.contact?.phone ? (
              <Meta icon={Phone} title="Unlocked contact">{c.contact.phone}</Meta>
            ) : (
              !IS_DEMO && c._live?.contactPreview?.phone && (
                <button onClick={() => onAction('unlock', c, 'phone')} title={creditSpent(c) ? 'View the phone number — free, the credit is already used' : 'View the phone number — uses 1 credit, once per candidate'} className="inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-accent">
                  <Phone size={13} className="text-[#7d93a6]" /> {c._live.contactPreview.phone}
                  <span className="inline-flex items-center gap-0.5 font-semibold text-accent"><Eye size={12} /> View</span>
                </button>
              )
            )}
            {!compact && c.education[0] && <Meta icon={GraduationCap}>{c.education[0].degree}{c.education[0].institute ? `, ${c.education[0].institute}` : ''}</Meta>}
          </div>

          {!compact && c.preferredLocations.length > 0 && (
            <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-muted"><Building2 size={12} /> Prefers: {c.preferredLocations.join(' · ')}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {shown.map((s) => <Chip key={s} tone={strong.has(s.toLowerCase()) ? 'hit' : 'neutral'}>{s}</Chip>)}
            {skills.length > shown.length && <span className="self-center text-[12px] text-muted">+{skills.length - shown.length} more</span>}
          </div>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line-2 pt-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <TrustScore score={trust.score} onClick={() => onAction('trust', row)} />
              {c.resumeUpdatedDaysAgo != null && <span className="text-[12px] text-muted">Resume updated {ago(c.resumeUpdatedDaysAgo)}</span>}
              {c.lastActiveDaysAgo != null ? <span className="text-[12px] text-muted">Active {ago(c.lastActiveDaysAgo)}</span> : c.sharedDaysAgo != null && <span className="text-[12px] text-muted">Shared {ago(c.sharedDaysAgo)}</span>}
              {!IS_DEMO && c.stage && <span className="rounded-md bg-line-2 px-1.5 py-0.5 text-[11px] font-medium text-ink-2">{STAGE_LABELS[c.stage] ?? c.stage}</span>}
              {!IS_DEMO && c.jobTitle && <span className="max-w-[180px] truncate text-[12px] text-muted" title={c.jobTitle}>for {c.jobTitle}</span>}
              {!compact && <span className="text-[12px] text-muted">{c.profileCompleteness}% complete</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="sm" onClick={() => onAction('open', c)} className="hidden sm:inline-flex">View profile</Button>
              {/* Always visible (not just md+): it's the way to the CV, and it opens the credit step when the CV is still locked. */}
              <Button
                size="sm"
                icon={IS_DEMO || isRevealed(c, 'resume') ? FileText : Lock}
                onClick={() => onAction('resume', c)}
                title={IS_DEMO || isRevealed(c, 'resume') ? 'Open the CV' : creditSpent(c) ? 'View the CV — free, the credit is already used' : 'View the CV — uses 1 credit, once per candidate'}
              >
                View CV
              </Button>
              <ShortlistButton candidate={c} onAction={onAction} />
              <Button size="sm" variant="primary" onClick={() => onAction('contact', c)}>Contact</Button>
              <div className="relative">
                <IconButton label="More actions" icon={MoreHorizontal} onClick={() => setMenu((v) => !v)} onBlur={() => setTimeout(() => setMenu(false), 140)} active={menu} />
                {menu && (
                  <div className="fade-up absolute bottom-9 right-0 z-30 w-52 rounded-2xl border border-line bg-white p-1 shadow-pop">
                    {MORE_ACTIONS.map((a) => (
                      <button key={a.id} onMouseDown={(e) => { e.preventDefault(); setMenu(false); onAction(a.id, c) }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] hover:bg-line-2">
                        <a.icon size={14} className="text-muted" /> {a.label}
                      </button>
                    ))}
                    <div className="my-1 h-px bg-line-2" />
                    <button onMouseDown={(e) => { e.preventDefault(); setMenu(false); toggleCompare(c.id) }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] hover:bg-line-2">
                      <GitCompareArrows size={14} className="text-muted" /> {inCompare ? 'Remove from compare' : 'Compare'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default memo(CandidateCard)
