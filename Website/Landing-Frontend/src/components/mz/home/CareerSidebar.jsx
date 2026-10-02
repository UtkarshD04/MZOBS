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

// Real profile and application count for the signed-in candidate; while they
// load — or if they fail — rows simply show no status line.
function useCandidateState(token) {
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState(null)

  useEffect(() => {
    setProfile(null)
    setApplications(null)
    if (!token) return
    const controller = new AbortController()
    fetchEmployeeProfile(token).then((p) => !controller.signal.aborted && setProfile(p)).catch(() => {})
    fetchApplicationCount(token, { signal: controller.signal }).then(setApplications).catch(() => {})
    return () => controller.abort()
  }, [token])

  return { profile, applications }
}

function Row({ icon: Icon, title, status, to, onClick }) {
  const inner = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#E8F7F4] text-[#078B7D]">
        <Icon size={16} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-[#123B5D]">{title}</span>
        {status && <span className="block truncate text-[12.5px] text-mz-muted">{status}</span>}
      </span>
      <ChevronRight size={16} className="shrink-0 text-mz-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#078B7D]" aria-hidden="true" />
    </>
  )
  const cls = 'group flex w-full items-center gap-3 rounded-[10px] px-2 py-2.5 text-left transition-colors duration-200 hover:bg-[#E8F7F4]/60 focus-visible:outline-2 focus-visible:outline-[#078B7D]'
  return (
    <li>
      {onClick ? (
        <button type="button" onClick={onClick} className={cls}>{inner}</button>
      ) : (
        <Link to={to} className={cls}>{inner}</Link>
      )}
    </li>
  )
}

// "Build your next move": the candidate actions MZOBS actually has. Signed
// out, each one routes through sign-in back to the right page; signed in,
// each shows that person's real status (nothing estimated or sample).
export default function CareerSidebar() {
  const { session } = useEmployeeSession()
  const { profile, applications } = useCandidateState(session?.token)
  const signedIn = Boolean(session?.token)
  const completion = profile ? profileCompletion(profile) : null
  const nextStep = completion?.missing?.[0]

  const rows = signedIn
    ? [
        {
          icon: UserRound,
          title: 'Complete your profile',
          status: completion && (completion.missing.length ? `${completion.missing.length} of ${COMPLETION_CHECKS.length} details still to add` : 'All profile details added'),
          to: '/employees/profile',
        },
        { icon: FileText, title: 'Upload or update resume', status: profile && RESUME_STATUS[profile.resume?.status ?? 'none'], to: '/employees/profile#resume' },
        { icon: Sparkles, title: 'Jobs matching your profile', status: 'Based on your skills and preferences', to: '/employees/recommended' },
        {
          icon: ClipboardList,
          title: 'Track applications',
          status: applications != null && (applications ? `${applications} ${applications === 1 ? 'application' : 'applications'} sent` : 'No applications yet'),
          to: '/employees/applications',
        },
        {
          icon: ListChecks,
          title: 'Improve your application',
          status: completion && (nextStep ? `Next: ${nextStep.label.toLowerCase()}` : 'Your profile has every detail'),
          to: nextStep ? `/employees/profile#${nextStep.section}` : '/employees/profile',
        },
      ]
    : [
        { icon: UserRound, title: 'Complete your profile', to: signIn('/employees/profile') },
        { icon: FileText, title: 'Upload or update resume', to: signIn('/employees/profile') },
        { icon: Sparkles, title: 'Jobs matching your profile', to: signIn('/employees/recommended') },
        { icon: ClipboardList, title: 'Track applications', to: signIn('/employees/applications') },
        { icon: ListChecks, title: 'Improve your application', to: signIn('/employees/profile') },
      ]

  return (
    <aside aria-labelledby="career-tools-title" className="lg:sticky lg:top-20">
      <div className="rounded-[16px] bg-gradient-to-br from-[#12A89D]/45 via-[#F0EDFF]/70 to-[#078B7D]/35 p-[1.5px] shadow-[0_18px_40px_-24px_rgba(18,59,93,0.3)]">
        <div className="relative overflow-hidden rounded-[14.5px] bg-gradient-to-br from-white to-[#EFF9F7] p-4 sm:p-5">
          <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#12A89D]/10 blur-2xl" aria-hidden="true" />

          <p className="relative flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-mz-muted">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#12A89D] shadow-[0_0_8px_2px_rgba(18,168,157,0.45)]" aria-hidden="true" />
            Your MZOBS
          </p>
          <h2 id="career-tools-title" className="relative mt-1 text-[17px] font-bold text-[#123B5D]">
            {signedIn ? `Build your next move, ${session.employee?.name?.split(' ')[0] ?? 'there'}` : 'Build your next move'}
          </h2>
          {!signedIn && (
            <p className="relative mt-1 text-[13.5px] leading-relaxed text-mz-muted">Sign in to keep your profile, resume and applications in one place.</p>
          )}

          <ul className="relative -mx-2 mt-3">
            {rows.map((r) => <Row key={r.title} {...r} />)}
          </ul>

          {!signedIn && (
            <div className="relative mt-3 flex items-center gap-3 border-t border-[#DCE5EC] pt-4">
              <Link
                to="/employees/signup"
                className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] bg-gradient-to-r from-[#078B7D] to-[#056F68] px-4 text-[14px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(7,139,125,0.55)] transition-shadow duration-200 hover:shadow-[0_10px_22px_-8px_rgba(7,139,125,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078B7D]"
              >
                Create free account
              </Link>
              <Link to="/employees/signin" className="text-[14px] font-semibold text-[#123B5D] hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
