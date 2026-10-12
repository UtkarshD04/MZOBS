import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, ClipboardList, FileText, ListChecks, Sparkles, UserRound } from 'lucide-react'
import { useEmployeeSession } from '../../../lib/useEmployeeSession'
import { fetchApplicationCount, fetchEmployeeProfile } from '../../../lib/employeeApi'
import { COMPLETION_CHECKS, profileCompletion } from '../../../lib/profileCompletion'

const signIn = (next) => `/employees/signin?next=${encodeURIComponent(next)}`
const RESUME_STATUS = {
  none: 'No resume uploaded yet',
  pending: 'Resume under review',
  verified: 'Resume verified',
  changes: 'Resume needs changes',
  rejected: 'Resume needs a new upload',
}

// Real profile and application count for the signed-in candidate. `failed`
// lets the card stop waiting if the profile can't be loaded.
function useCandidateState(token) {
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setProfile(null)
    setApplications(null)
    setFailed(false)
    if (!token) return
    const controller = new AbortController()
    fetchEmployeeProfile(token)
      .then((p) => !controller.signal.aborted && setProfile(p))
      .catch(() => !controller.signal.aborted && setFailed(true))
    fetchApplicationCount(token, { signal: controller.signal }).then(setApplications).catch(() => {})
    return () => controller.abort()
  }, [token])

  return { profile, applications, failed }
}

const RING = 'focus-visible:outline-2 focus-visible:outline-mz-primary'
// Remounted panels (a new leading step) ease in; reduced motion skips it.
const EASE_IN = 'transition-[opacity,translate] duration-300 ease-out starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none'

// The signature: two forward chevrons, cropped by the card edge — "in motion".
// Pure shape, no data; sits behind the headline's right side.
function MotionMark() {
  return (
    <svg viewBox="0 0 120 150" className="pointer-events-none absolute -right-7 top-3 h-[120px] w-[96px]" fill="none" strokeLinejoin="miter" aria-hidden="true">
      <path d="M8 8 L68 75 L8 142" stroke="var(--color-mz-primary)" strokeWidth="22" />
      <path d="M62 8 L122 75 L62 142" stroke="var(--color-mz-primary)" strokeOpacity="0.22" strokeWidth="22" />
    </svg>
  )
}

// One stop on the rail. The whole row is the link (single tab stop); `lead`
// marks the step this person's real data calls for.
function RailItem({ icon: Icon, title, status, to, lead, action, delay }) {
  return (
    <li className={lead ? EASE_IN : 'mz-rise'} style={lead ? undefined : { '--d': `${delay}s` }}>
      <Link
        to={to}
        className={`group relative -mx-2 grid min-h-[52px] grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-x-3 rounded-[6px] px-2 transition-[background-color,scale] duration-150 motion-safe:active:scale-[0.99] ${
          lead ? 'bg-mz-primary-tint py-3 hover:bg-mz-primary-tint' : 'py-2 hover:bg-mz-bg active:bg-mz-primary-tint'
        } ${RING} focus-visible:-outline-offset-2`}
      >
        <span
          className={`relative flex size-7 items-center justify-center rounded-full border transition-colors duration-150 ${
            lead
              ? 'border-mz-primary bg-mz-primary text-white'
              : 'border-mz-line-strong bg-white text-mz-ink-2 group-hover:border-mz-primary group-hover:bg-mz-primary group-hover:text-white group-focus-visible:border-mz-primary group-focus-visible:bg-mz-primary group-focus-visible:text-white'
          }`}
        >
          <Icon size={14} strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className={`block leading-snug text-mz-ink ${lead ? 'text-[16px] font-bold' : 'text-[14.5px] font-semibold'}`}>{title}</span>
          {status && <span className="line-clamp-2 text-[12.5px] leading-snug text-mz-muted">{status}</span>}
          {lead && (
            <span className="mt-1 inline-flex items-center gap-1 text-[13.5px] font-bold text-mz-primary-strong">
              {action}
              <ArrowRight size={15} className="transition-transform duration-150 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
            </span>
          )}
        </span>
        {!lead && (
          <ChevronRight
            size={16}
            className="text-mz-line-strong transition-[translate,color] duration-150 group-hover:text-mz-primary group-focus-visible:text-mz-primary motion-safe:group-hover:translate-x-1"
            aria-hidden="true"
          />
        )}
      </Link>
    </li>
  )
}

// Signed-out call to action: a squared button with an offset outline that
// closes up on hover and press.
function SignupActions() {
  return (
    <div className="mz-rise mt-5 flex flex-wrap items-center gap-x-5 gap-y-3" style={{ '--d': '0.1s' }}>
      <Link to="/employees/signup" className={`group relative inline-block ${RING} focus-visible:outline-offset-4`}>
        <span className="absolute inset-0 translate-x-1 translate-y-1 rounded-[3px] border-2 border-mz-primary" aria-hidden="true" />
        <span className="relative flex h-11 items-center gap-2 rounded-[3px] bg-mz-primary px-5 text-[14.5px] font-bold text-white transition-[translate,background-color] duration-150 group-hover:bg-mz-primary-strong motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:translate-y-0.5 motion-safe:group-active:translate-x-1 motion-safe:group-active:translate-y-1">
          Create free account
          <ArrowRight size={16} strokeWidth={2.4} className="transition-transform duration-150 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Link>
      <Link
        to="/employees/signin"
        className={`inline-flex min-h-[44px] items-center rounded-sm text-[14px] font-semibold text-mz-ink underline decoration-mz-line-strong decoration-2 underline-offset-4 transition-colors duration-150 hover:decoration-mz-primary ${RING} focus-visible:outline-offset-2`}
      >
        Sign in
      </Link>
    </div>
  )
}

// "Your next move": the candidate actions MZOBS actually has. Signed out, each
// routes through sign-in back to the right page; signed in, the step this
// person's real data calls for leads and carries a direct action.
export default function CareerSidebar() {
  const { session } = useEmployeeSession()
  const { profile, applications, failed } = useCandidateState(session?.token)
  const signedIn = Boolean(session?.token)
  const firstName = signedIn ? session.employee?.name?.trim().split(/\s+/)[0] : null
  const completion = profile ? profileCompletion(profile) : null
  const nextStep = completion?.missing?.[0]
  const resumeStatus = profile ? (profile.resume?.status ?? 'none') : null

  // Which action leads. Decided only from real data; null while it loads.
  let upNextId = null
  if (signedIn && profile) {
    if (['none', 'changes', 'rejected'].includes(resumeStatus)) upNextId = 'resume'
    else if (completion.missing.length) upNextId = 'profile'
    else upNextId = applications > 0 ? 'applications' : 'matches'
  } else if (signedIn && failed) {
    upNextId = 'matches'
  }
  const upNextAction = {
    resume: resumeStatus === 'changes' ? 'Update resume' : 'Upload resume',
    profile: 'Continue profile',
    matches: 'See matching jobs',
    applications: 'View applications',
  }[upNextId]

  const rows = signedIn
    ? [
        {
          id: 'profile',
          icon: UserRound,
          title: 'Complete your profile',
          status: completion && (completion.missing.length ? `${completion.missing.length} of ${COMPLETION_CHECKS.length} details still to add` : 'All profile details added'),
          to: '/employees/profile',
        },
        { id: 'resume', icon: FileText, title: 'Upload or update resume', status: profile && RESUME_STATUS[profile.resume?.status ?? 'none'], to: '/employees/profile#resume' },
        { id: 'matches', icon: Sparkles, title: 'Jobs matching your profile', status: 'Based on your skills and preferences', to: '/employees/recommended' },
        {
          id: 'applications',
          icon: ClipboardList,
          title: 'Track applications',
          status: applications != null && (applications ? `${applications} ${applications === 1 ? 'application' : 'applications'} sent` : 'No applications yet'),
          to: '/employees/applications',
        },
        {
          id: 'improve',
          icon: ListChecks,
          title: 'Improve your application',
          status: completion && (nextStep ? `Next: ${nextStep.label.toLowerCase()}` : 'Your profile is complete'),
          to: nextStep ? `/employees/profile#${nextStep.section}` : '/employees/profile',
        },
      ]
    : [
        { id: 'profile', icon: UserRound, title: 'Complete your profile', to: signIn('/employees/profile') },
        { id: 'resume', icon: FileText, title: 'Upload or update resume', to: signIn('/employees/profile') },
        { id: 'matches', icon: Sparkles, title: 'Jobs matching your profile', to: signIn('/employees/recommended') },
        { id: 'applications', icon: ClipboardList, title: 'Track applications', to: signIn('/employees/applications') },
        { id: 'improve', icon: ListChecks, title: 'Improve your application', to: signIn('/employees/profile') },
      ]
  const upNext = rows.find((r) => r.id === upNextId)
  const ordered = upNext ? [upNext, ...rows.filter((r) => r.id !== upNextId)] : rows

  return (
    <aside aria-labelledby="career-tools-title" className="lg:sticky lg:top-20">
      <div className="relative overflow-hidden rounded-[8px] border border-mz-line-strong bg-white px-5 pb-4 pt-5">
        <MotionMark />
        <div className="relative">
          <p className="mz-rise truncate text-[11px] font-bold tracking-[0.14em] text-mz-primary-strong">
            {firstName ? `${firstName.toUpperCase()} / YOUR CAREER` : 'MZOBS / YOUR CAREER'}
          </p>
          <h2 id="career-tools-title" className="mt-3 text-[36px] font-extrabold leading-[0.98] tracking-[-0.035em] text-mz-ink">
            <span className="mz-rise block" style={{ '--d': '0.04s' }}>Make your</span>
            <span className="mz-rise block text-mz-primary" style={{ '--d': '0.09s' }}>next move.</span>
          </h2>
          <p className="mz-rise mt-3 max-w-[210px] text-[14px] leading-snug text-mz-ink-2" style={{ '--d': '0.14s' }}>
            Get ready for the right opportunity.
          </p>
          {!signedIn && <SignupActions />}
        </div>

        <nav aria-label="Your Mzobs profile" className="relative mt-6">
          <ul className="relative before:absolute before:bottom-6 before:left-[13.5px] before:top-6 before:w-px before:bg-mz-line">
            {signedIn && !upNext
              ? [0, 1, 2, 3, 4].map((i) => <li key={i} aria-hidden="true" className="flex h-[52px] items-center gap-3"><span className="size-7 rounded-full bg-mz-bg" /><span className="h-3 w-40 rounded bg-mz-bg" /></li>)
              : ordered.map((r, i) =>
                  <RailItem key={r === upNext ? `${r.id}-lead` : r.id} {...r} lead={r === upNext} action={upNextAction} delay={0.18 + i * 0.04} />,
                )}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
