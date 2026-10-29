import { useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, CalendarClock, Check, Eye, FileText, Info, Lock, Send, Sparkles, Star, Trophy, UserCheck } from 'lucide-react'
import { CompanyLogo } from './primitives'

// The five-stage journey shown on /employees/applications. Real applications
// are mapped onto it with `stageOf`; the demo opportunity sits on a fixed stage.
const STAGES = [
  {
    key: 'applied',
    label: 'Applied',
    icon: Send,
    short: 'Your application reaches the employer.',
    meaning: 'Your profile and resume have been submitted for the role. Nothing more is implied about the employer’s decision at this point.',
    info: 'The role you applied to and the date you applied.',
    next: 'Keep your profile and resume up to date, and apply to a few more roles that fit.',
    locked: 'A dated, stage-by-stage record of every change to this application.',
    move: { text: 'Keep your profile and resume updated while you wait.', label: 'Review your profile', to: '/employees/profile#resume' },
  },
  {
    key: 'viewed',
    label: 'Profile Viewed',
    icon: Eye,
    short: 'The employer opens your profile.',
    meaning: 'An employer has opened your profile for this role. It is a sign of attention, not a promise of a follow-up.',
    info: 'A “Viewed” marker once the employer has opened your profile, where the platform records it.',
    next: 'Re-read the role requirements and prepare for a possible follow-up.',
    locked: 'The date your profile was opened and the full dated history.',
    move: { text: 'Review the role requirements and prepare for a possible follow-up.', label: 'Open your applications', to: '#applications' },
  },
  {
    key: 'shortlisted',
    label: 'Shortlisted',
    icon: UserCheck,
    short: 'You move onto the employer’s shortlist.',
    meaning: 'The employer has put you on the shortlist for this role. It usually means more conversations may follow, but it is not an offer.',
    info: 'Your status changes to Shortlisted on this application.',
    next: 'Prepare for role-specific interview questions and keep your availability handy.',
    locked: 'When you were shortlisted, shown in the dated timeline.',
    move: { text: 'Prepare for role-specific interview questions.', label: 'See interview preparation', to: 'premium-services' },
  },
  {
    key: 'interview',
    label: 'Interview',
    icon: CalendarClock,
    short: 'An interview is scheduled with you.',
    meaning: 'An interview has been arranged for this role. The employer or the Mzobs team sets the time and mode.',
    info: 'Time, mode and joining details appear in the Interviews section when one is scheduled.',
    next: 'Organise your preparation and note the interview details in one place.',
    locked: 'The dated moment your application moved to the interview stage.',
    move: { text: 'Organise your preparation and interview details.', label: 'Go to Interviews', to: '#interviews' },
  },
  {
    key: 'offer',
    label: 'Offer',
    icon: Trophy,
    short: 'The employer makes a decision.',
    meaning: 'The employer has selected you for the role. Terms are agreed directly with the employer.',
    info: 'Your status changes to Selected on this application.',
    next: 'Review the offered role and the employment terms carefully before you decide.',
    locked: 'The date of the decision in the dated timeline.',
    move: { text: 'Review the offered role and employment terms carefully.', label: 'Get offer guidance', to: 'premium-services' },
  },
]

// Furthest stage an application has reached (0–4), from status + history + the viewed marker.
const STATUS_STAGE = { new: 0, screening: 0, shared: 0, viewed: 1, shortlisted: 2, interview: 3, selected: 4 }
function stageOf(app) {
  const seen = [app.status, ...(app.statusHistory ?? []).map((h) => h.status)]
  const fromStatus = Math.max(0, ...seen.map((s) => STATUS_STAGE[s] ?? 0))
  return app.employerViewedOn ? Math.max(fromStatus, 1) : fromStatus
}

const DEMO = { role: 'Sample role title', company: 'Sample company', stage: 2, statusLabel: 'Shortlisted' }
const DEMO_VALUE = 'demo'

// "premium-services" lives on the profile page for Premium members; Basic members are sent to the plan page.
function moveTarget(to, paid) {
  if (to === 'premium-services') return paid ? '/employees/profile#premium-services' : '/employees/subscription'
  return to
}

function JumpLink({ to, children, className }) {
  if (to.startsWith('#')) {
    return (
      <a
        href={to}
        onClick={(e) => {
          const el = document.getElementById(to.slice(1))
          if (!el) return
          e.preventDefault()
          el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
        }}
        className={className}
      >
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}

// One surface treatment for every card on the page: hairline border, 1px lift.
const cardCls = 'rounded-[14px] border border-mz-line bg-white shadow-[0_1px_2px_rgba(22,50,79,0.05)]'

// Button-weight link for the one action a section wants you to find.
const ctaCls =
  'group inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-mz-primary/30 bg-white px-3.5 text-[13.5px] font-semibold text-mz-primary-strong transition-colors hover:border-mz-primary hover:bg-mz-primary-tint/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary motion-reduce:transition-none'

const linkCls = 'group inline-flex items-center gap-1 rounded-[6px] text-[13.5px] font-semibold text-mz-primary-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary'

export function PageIntro({ paid }) {
  return (
    <header>
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-mz-primary-strong">My Applications</p>
      <div className="mt-1.5 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="max-w-[560px]">
          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-mz-ink sm:text-[28px]">Your Job Search. In Your Control.</h1>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-mz-muted">Every opportunity has a journey. Get a clearer view of yours with Mzobs.</p>
        </div>
        {paid ? (
          <span className="inline-flex items-center gap-2 rounded-[10px] border border-mz-primary/20 bg-mz-primary-tint/60 px-3 py-2 text-[12.5px] font-semibold text-mz-primary-strong">
            <BadgeCheck size={15} aria-hidden="true" /> Premium · full tracking on
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-[10px] border border-mz-line border-l-[3px] border-l-mz-primary bg-white px-3 py-2 text-[12.5px] font-medium text-mz-ink-2 shadow-[0_1px_2px_rgba(22,50,79,0.05)]">
            <Lock size={14} className="text-mz-primary-strong" aria-hidden="true" /> Complete application tracking requires Premium
          </span>
        )}
      </div>
    </header>
  )
}

function StageNode({ stage, index, reached, closed, selected, lockedDates, onSelect }) {
  const Icon = stage.icon
  const done = index < reached || (index === reached && closed)
  const active = index === reached && !closed
  const circle = done
    ? closed
      ? 'bg-[#9AA3AF] text-white'
      : 'bg-mz-primary text-white'
    : active
      ? 'bg-white text-mz-primary-strong ring-2 ring-mz-primary'
      : 'bg-white text-mz-muted ring-1 ring-mz-line-strong'
  const state = done ? 'reached' : active ? 'current stage' : 'upcoming'
  return (
    <li className="relative md:flex-1">
      <button
        type="button"
        onClick={() => onSelect(index)}
        aria-pressed={selected}
        className={`group flex w-full items-start gap-3.5 rounded-[12px] p-2 text-left transition-colors motion-reduce:transition-none md:flex-col md:items-center md:gap-2 md:px-1.5 md:py-2.5 md:text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary ${
          selected ? 'bg-mz-primary-tint/70 ring-1 ring-mz-primary/20' : active ? 'bg-mz-primary-tint/35 hover:bg-mz-primary-tint/60' : 'hover:bg-mz-bg'
        }`}
      >
        <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${circle} ${active ? 'shadow-[0_0_0_5px_var(--color-mz-primary-ring)]' : ''}`}>
          {done && !closed ? <Check size={18} strokeWidth={3} aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
          {lockedDates && index > 0 && (
            <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-mz-ink-2 ring-1 ring-mz-line-strong">
              <Lock size={9.5} aria-hidden="true" />
            </span>
          )}
        </span>
        <span className="min-w-0">
          <span className={`block text-[14px] leading-tight ${selected ? 'font-bold text-mz-ink' : 'font-semibold text-mz-ink'}`}>{stage.label}</span>
          <span className="mt-0.5 block text-[12.5px] leading-snug text-mz-muted md:px-1">{stage.short}</span>
          {active && (
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-mz-primary px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Current
            </span>
          )}
          <span className="sr-only">
            {state}
            {lockedDates && index > 0 ? ', dated details need Premium' : ''}
          </span>
        </span>
      </button>
      {index < STAGES.length - 1 && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-[-6px] left-[27px] top-[52px] w-0.5 rounded md:bottom-auto md:left-[calc(50%+28px)] md:top-[34px] md:h-0.5 md:w-[calc(100%-56px)] ${
            index < reached ? (closed ? 'bg-[#C9CED6]' : 'bg-mz-primary') : 'bg-mz-line-strong'
          }`}
        />
      )}
    </li>
  )
}

function OpportunityPreview({ opp, onViewJourney }) {
  return (
    <div className="rounded-[12px] border border-mz-line bg-mz-bg/60 p-3.5 sm:p-4">
      <div className="flex flex-wrap items-center gap-3">
        <CompanyLogo name={opp.company} logo={opp.logo} size={40} className="rounded-[10px]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-semibold text-mz-ink">{opp.role}</p>
          <p className="truncate text-[13px] text-mz-muted">{opp.company}</p>
        </div>
        {opp.demo && <span className="rounded-[6px] bg-white px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-mz-ink-2 ring-1 ring-mz-line-strong">Demo preview</span>}
        <span className="inline-flex items-center rounded-full bg-mz-primary-tint px-2.5 py-1 text-[12px] font-semibold text-mz-primary-strong">
          {opp.statusLabel}
          {opp.demo ? ' (example)' : ''}
        </span>
        <button type="button" onClick={onViewJourney} className={`${linkCls} px-1`}>
          View Journey <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </button>
      </div>
      {opp.demo && <p className="mt-2.5 text-[12px] leading-snug text-mz-muted">Illustrative only. This is not a real employer or application and nothing here reflects your account.</p>}
    </div>
  )
}

function TimelinePanel({ stage, paid, state, panelRef, titleId }) {
  const Icon = stage.icon
  return (
    <aside ref={panelRef} tabIndex={-1} aria-labelledby={titleId} className={`${cardCls} p-4 outline-none sm:p-5`}>
      <h2 id={titleId} className="text-[17px] font-bold tracking-[-0.01em] text-mz-ink">Your Application Timeline</h2>
      <div aria-live="polite" key={stage.key} className="mz-fade-in mt-3.5 space-y-4 motion-reduce:animate-none">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mz-primary-tint text-mz-primary-strong">
            <Icon size={16} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[14.5px] font-semibold leading-tight text-mz-ink">{stage.label}</p>
            <p className="text-[12px] text-mz-muted">{state}</p>
          </div>
        </div>
        <dl className="relative space-y-4 text-[13.5px] leading-relaxed before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-mz-line-strong">
          {[
            [Info, 'What it means', stage.meaning],
            [Eye, 'What you can see', stage.info],
            [ArrowRight, 'What you can do next', stage.next],
          ].map(([DetailIcon, term, text]) => (
            <div key={term} className="relative pl-9">
              <span className="absolute left-0 top-0 flex h-[23px] w-[23px] items-center justify-center rounded-full bg-white text-mz-primary-strong ring-1 ring-mz-line-strong">
                <DetailIcon size={12} aria-hidden="true" />
              </span>
              <dt className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-mz-muted">{term}</dt>
              <dd className="mt-0.5 text-mz-ink-2">{text}</dd>
            </div>
          ))}
        </dl>
        <div className={`rounded-[10px] px-3.5 py-3 ${paid ? 'bg-mz-primary-tint/70' : 'bg-mz-bg ring-1 ring-mz-line'}`}>
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-mz-ink">
            {paid ? <BadgeCheck size={14} className="text-mz-primary-strong" aria-hidden="true" /> : <Lock size={13} className="text-mz-ink-2" aria-hidden="true" />}
            {paid ? 'Included with your Premium' : 'Premium'}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-mz-ink-2">{stage.locked}</p>
          {!paid && (
            <Link to="/employees/subscription" className={`${linkCls} mt-2`}>
              See what Premium adds <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}

// Journey map + opportunity preview (left) beside the contextual timeline panel (right).
export function JourneyWorkspace({ apps, paid, selected, onSelect }) {
  const baseId = useId()
  const panelRef = useRef(null)
  const [source, setSource] = useState(DEMO_VALUE)

  const real = source !== DEMO_VALUE ? apps.find((a) => a.id === source) : null
  const reached = real ? stageOf(real) : DEMO.stage
  const closed = !!real && (real.status === 'rejected' || real.status === 'withdrawn')
  const lockedDates = !paid
  const stage = STAGES[selected]
  const stageState = selected < reached || (selected === reached && closed) ? 'Reached' : selected === reached ? 'Current stage' : 'Not reached yet'
  const stageNote = real ? stageState : `${stageState} · in the demo`

  const opp = real
    ? { role: real.job?.title ?? 'This job is no longer listed', company: real.job?.company?.name ?? '', logo: real.job?.company?.logo, statusLabel: STAGES[reached].label, demo: false }
    : { role: DEMO.role, company: DEMO.company, statusLabel: DEMO.statusLabel, demo: true }

  function viewJourney() {
    onSelect(reached)
    const el = panelRef.current
    if (!el) return
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' })
    el.focus({ preventScroll: true })
  }

  return (
    <section aria-labelledby={`${baseId}-map`} className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
      <div className={`${cardCls} p-4 sm:p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div>
            <h2 id={`${baseId}-map`} className="text-[17px] font-bold tracking-[-0.01em] text-mz-ink">Application Journey</h2>
            <p className="text-[12.5px] text-mz-muted">Select a stage to see what it means.</p>
          </div>
          <label className="flex items-center gap-2 text-[12.5px] text-mz-muted">
            <span>Viewing</span>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="max-w-[210px] truncate rounded-[8px] border border-mz-line-strong bg-white py-1.5 pl-2.5 pr-7 text-[13px] font-medium text-mz-ink focus-visible:outline-2 focus-visible:outline-mz-primary"
            >
              <option value={DEMO_VALUE}>Demo preview</option>
              {apps.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.job?.title ?? 'Unlisted job'}
                  {a.job?.company?.name ? ` · ${a.job.company.name}` : ''}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ol className="mt-3 flex flex-col gap-1 md:flex-row md:gap-0" aria-label="Journey stages">
          {STAGES.map((s, i) => (
            <StageNode key={s.key} stage={s} index={i} reached={reached} closed={closed} selected={selected === i} lockedDates={lockedDates} onSelect={onSelect} />
          ))}
        </ol>

        <div className="mt-4">
          <OpportunityPreview opp={opp} onViewJourney={viewJourney} />
        </div>
        {lockedDates && (
          <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-snug text-mz-muted">
            <Lock size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
            The lock marks stages whose dated details need Premium. Your current status is always visible.
          </p>
        )}
      </div>

      <TimelinePanel stage={stage} paid={paid} state={stageNote} panelRef={panelRef} titleId={`${baseId}-timeline`} />
    </section>
  )
}

export function NextMove({ selected, onSelect, paid }) {
  const baseId = useId()
  const stage = STAGES[selected]
  const move = stage.move
  return (
    <section aria-labelledby={`${baseId}-title`} className={`${cardCls} p-4 sm:p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={`${baseId}-title`} className="text-[18px] font-bold tracking-[-0.015em] text-mz-ink">Know Your Next Move</h2>
        <div className="mz-scroll-x -mx-1 flex max-w-full gap-1 overflow-x-auto px-1" role="group" aria-label="Choose a stage">
          {STAGES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={selected === i}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary ${
                selected === i ? 'bg-mz-primary-tint text-mz-primary-strong ring-1 ring-mz-primary/40' : 'bg-white text-mz-ink-2 ring-1 ring-mz-line hover:bg-mz-bg hover:text-mz-ink'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div aria-live="polite" key={stage.key} className="mz-fade-in mt-3.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-[10px] bg-mz-bg px-4 py-3.5 ring-1 ring-mz-line motion-reduce:animate-none">
        <p className="flex max-w-[560px] items-start gap-2.5 text-[15px] font-medium leading-snug text-mz-ink">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-mz-primary-strong" aria-hidden="true" />
          {move.text}
        </p>
        <JumpLink to={moveTarget(move.to, paid)} className={ctaCls}>
          {move.to === 'premium-services' && !paid ? 'Explore Premium support' : move.label}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </JumpLink>
      </div>
      <p className="mt-2.5 text-[12px] text-mz-muted">Suggestions for preparing, not a report of anything an employer has done.</p>
    </section>
  )
}

const TAG = {
  available: 'bg-mz-primary-tint text-mz-primary-strong',
  preview: 'bg-mz-bg text-mz-ink-2 ring-1 ring-mz-line-strong',
  premium: 'bg-[#EEF1FB] text-[#3B4A7A]',
}

export function PremiumValue({ paid, hasApps }) {
  const baseId = useId()
  const items = [
    {
      icon: FileText,
      title: 'Application Visibility',
      text: 'Your current status and the stages reached are always visible. The dated, stage-by-stage timeline is the Premium part.',
      tag: paid ? ['available', 'Included'] : ['premium', 'Dates need Premium'],
      action: hasApps ? { label: 'See your applications', to: '#applications' } : { label: 'Find jobs to apply to', to: '/#latest-jobs' },
    },
    {
      icon: Eye,
      title: 'Employer Activity',
      text: 'When an employer opens your profile for a role, a “Viewed” marker appears on that application, where the platform records it.',
      tag: ['available', 'Available'],
      action: hasApps ? { label: 'Check for updates', to: '#applications' } : null,
    },
    {
      icon: CalendarClock,
      title: 'Interview Organisation',
      text: 'Interviews scheduled by an employer or the Mzobs team are listed in one place with time, mode and joining details.',
      tag: ['available', 'Available'],
      action: { label: 'Go to Interviews', to: '#interviews' },
    },
  ]
  return (
    <section aria-labelledby={`${baseId}-title`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 id={`${baseId}-title`} className="text-[18px] font-bold tracking-[-0.015em] text-mz-ink">What this page gives you</h2>
        <p className="text-[12.5px] text-mz-muted">Updates appear as employers act; timing isn’t guaranteed.</p>
      </div>
      <ul className="mt-3 grid divide-y divide-mz-line overflow-hidden rounded-[14px] border border-mz-line bg-white shadow-[0_1px_2px_rgba(22,50,79,0.05)] md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map(({ icon: Icon, title, text, tag, action }) => (
          <li key={title} className="flex flex-col p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-mz-primary-tint text-mz-primary-strong">
                <Icon size={17} aria-hidden="true" />
              </span>
              <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${TAG[tag[0]]}`}>{tag[1]}</span>
            </div>
            <h3 className="mt-3.5 text-[15px] font-semibold text-mz-ink">{title}</h3>
            <p className="mt-1.5 flex-1 text-[13.5px] leading-[1.6] text-mz-ink-2">{text}</p>
            {action && (
              <JumpLink to={action.to} className={`${linkCls} mt-3`}>
                {action.label} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
              </JumpLink>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ConversionBand({ onContinue }) {
  return (
    <section aria-label="Mzobs Premium" className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-[14px] bg-gradient-to-r from-mz-ink to-[#1B3A5C] px-5 py-6 text-white sm:px-7">
      <div className="max-w-[560px]">
        <p className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#7FD6C9]">
          <Star size={12} aria-hidden="true" /> Mzobs Premium
        </p>
        <h2 className="mt-1.5 text-[19px] font-bold leading-snug tracking-[-0.01em] sm:text-[21px]">Turn Applications Into a Clearer Career Journey.</h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-white/75">Discover the tools available with Mzobs Premium to organise your job search and follow your application journey.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/employees/subscription"
          className="mz-btn-teal inline-flex h-11 items-center gap-1.5 rounded-[10px] bg-mz-primary px-5 text-[14px] font-semibold text-white hover:bg-mz-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Explore Mzobs Premium <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex h-11 items-center rounded-[10px] px-4 text-[14px] font-semibold text-white/85 ring-1 ring-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Continue Exploring
        </button>
      </div>
    </section>
  )
}
