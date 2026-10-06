import { Link } from 'react-router-dom'
import { ArrowRight, Check, MapPin, Sparkles, Target, Wrench } from 'lucide-react'
import { Container } from '../primitives'
import { useEmployeeSession } from '../../../lib/useEmployeeSession'

const TARGET = '/employees/recommended'
const POINTS = ['Matched to your skills and preferred role', 'A clear reason for every recommendation', 'Updates as your profile grows']
const SIGNALS = [
  { icon: Wrench, label: 'Your skills' },
  { icon: Target, label: 'Preferred role' },
  { icon: MapPin, label: 'Location' },
]

// Abstract preview of how a match is built — no sample jobs, nothing invented.
function MatchPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[340px]" aria-hidden="true">
      <div className="absolute -inset-6 rounded-full bg-mz-primary/10 blur-3xl" />
      <div className="absolute left-5 top-4 h-full w-full -rotate-3 rounded-[20px] border border-mz-line bg-white/70" />
      <div className="relative rounded-[20px] border border-mz-line bg-white p-5 shadow-[0_24px_50px_-26px_rgba(11,122,109,0.45)]">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-mz-primary-tint text-mz-primary">
            <Sparkles size={20} />
          </span>
          <div className="flex-1 space-y-2">
            <span className="block h-2.5 w-3/4 rounded-full bg-mz-ink/15" />
            <span className="block h-2 w-1/2 rounded-full bg-mz-ink/10" />
          </div>
          <span className="rounded-full bg-mz-primary-tint px-2.5 py-1 text-[11px] font-bold text-mz-primary-strong">Strong match</span>
        </div>
        <div className="mt-4 space-y-2 rounded-[12px] bg-mz-bg p-3.5">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-mz-muted">Why this matches you</p>
          {SIGNALS.map(({ icon: Icon, label }) => (
            <p key={label} className="flex items-center gap-2 text-[13px] font-semibold text-mz-ink">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mz-primary text-white"><Check size={12} /></span>
              <Icon size={14} className="text-mz-muted" /> {label}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

// Entry card to the candidate's matched jobs. The list itself lives on
// /employees/recommended; signed out, the link goes through sign-in first.
export default function RecommendedCard() {
  const { session } = useEmployeeSession()
  const signedIn = Boolean(session?.token)
  const to = signedIn ? TARGET : `/employees/signin?next=${encodeURIComponent(TARGET)}`

  return (
    <section aria-labelledby="recommended-title" className="mz-section">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] border border-mz-primary/15 bg-gradient-to-br from-[#E7F5F1] via-white to-[#FBEBB0]/45 p-6 shadow-[0_30px_60px_-36px_rgba(11,122,109,0.4)] sm:p-9 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:p-12">
          <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-mz-primary/10 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-mz-primary-strong shadow-sm">
              <Sparkles size={14} aria-hidden="true" /> Recommended for you
            </p>
            <h2 id="recommended-title" className="mt-4 text-[28px] font-extrabold leading-[1.1] tracking-[-0.025em] text-mz-ink sm:text-[36px]">
              Jobs that fit your profile
            </h2>
            <ul className="mt-5 space-y-2.5">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[15px] text-mz-ink-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mz-primary text-white"><Check size={12} aria-hidden="true" /></span>
                  {p}
                </li>
              ))}
            </ul>
            <Link
              to={to}
              className="group mt-7 inline-flex h-12 items-center gap-2 rounded-[12px] bg-mz-primary px-7 text-[15px] font-bold text-white shadow-[0_14px_28px_-14px_rgba(11,122,109,0.7)] transition-colors hover:bg-mz-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary"
            >
              {signedIn ? 'See my matches' : 'Sign in to see matches'}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative mt-10 lg:mt-0">
            <MatchPreview />
          </div>
        </div>
      </Container>
    </section>
  )
}
