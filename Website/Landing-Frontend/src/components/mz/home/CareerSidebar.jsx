import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ClipboardList, FileText, ListChecks, Sparkles, UserRound } from 'lucide-react'
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
// Same mint wash and diagonal-line texture as the homepage search (SearchTop).
const LINE_TEXTURE = { backgroundImage: 'repeating-linear-gradient(135deg, rgba(11,122,109,0.18) 0 1.5px, transparent 1.5px 12px)' }

// One row of the list. The whole row is the link (single tab stop); `lead`
// marks the step this person's real data calls for.
function StepRow({ icon: Icon, title, status, to, lead, action }) {
  return (
    <li>
      <Link
        to={to}
        className={`group flex min-h-[52px] items-center gap-3 px-4 py-2.5 transition-colors duration-150 ${
          lead ? 'bg-mz-primary-tint' : 'hover:bg-[#F0F8F5]'
        } ${RING} focus-visible:-outline-offset-2`}
      >
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-[8px] transition-colors duration-150 ${
            lead ? 'bg-mz-primary text-white' : 'bg-mz-primary-tint text-mz-primary-strong group-hover:bg-mz-primary group-hover:text-white'
          }`}
        >
          <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-[14px] leading-snug text-mz-ink ${lead ? 'font-semibold' : 'font-medium'}`}>{title}</span>
          {status && <span className="line-clamp-2 text-[12.5px] leading-snug text-mz-muted">{status}</span>}
          {lead && <span className="mt-0.5 block text-[13px] font-semibold text-mz-primary-strong group-hover:underline">{action}</span>}
        </span>
        <ChevronRight size={15} className="shrink-0 text-mz-line-strong transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-mz-primary" aria-hidden="true" />
      </Link>
    </li>
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
      <div className="overflow-hidden rounded-[10px] border border-[#D3E9E2] bg-white shadow-[0_12px_32px_-22px_rgba(11,95,85,0.35)]">
        <div className="relative bg-[linear-gradient(180deg,#DBF0E9_0%,#F1F9F6_100%)] px-4 pb-4 pt-5">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-2/3 mask-[radial-gradient(ellipse_at_top_right,black_15%,transparent_70%)]" style={LINE_TEXTURE} aria-hidden="true" />
          <h2 id="career-tools-title" className="relative text-[18px] font-bold text-mz-ink">
            {firstName ? `Hi ${firstName}` : 'Looking for a job?'}
          </h2>
          <p className="relative mt-1 text-[13.5px] leading-relaxed text-mz-ink-2">
            {signedIn
              ? 'Pick up where you left off.'
              : 'Create a free account to upload your resume, apply to jobs and keep track of your applications.'}
          </p>
          {!signedIn && (
            <>
              <Link
                to="/employees/signup"
                className={`relative mt-4 flex h-10 items-center justify-center rounded-[6px] bg-mz-primary text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-mz-primary-strong ${RING} focus-visible:outline-offset-2`}
              >
                Create free account
              </Link>
              <p className="relative mt-3 text-center text-[13px] text-mz-muted">
                Already registered?{' '}
                <Link to="/employees/signin" className={`font-semibold text-mz-primary-strong hover:underline ${RING}`}>
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        <nav aria-label="Your Mzobs profile" className="border-t border-mz-line">
          <ul className="divide-y divide-mz-line">
            {signedIn && !upNext
              ? [0, 1, 2, 3, 4].map((i) => <li key={i} aria-hidden="true" className="flex h-[52px] items-center gap-3 px-4"><span className="mz-skeleton size-8 rounded-[8px]" /><span className="mz-skeleton h-3 w-40 rounded" /></li>)
              : ordered.map((r) => <StepRow key={r.id} {...r} lead={r === upNext} action={upNextAction} />)}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
