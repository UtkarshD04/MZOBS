import { ArrowDown, ArrowRight, GraduationCap, MessageSquareText, ShieldCheck, Target, TrendingUp, UserRound } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

const STAGES = [
  { icon: GraduationCap, label: 'Your Campus' },
  { icon: UserRound, label: 'Student Profiles' },
  { icon: Target, label: 'Skills & Readiness' },
  { icon: ShieldCheck, label: 'Verified Opportunities' },
  { icon: MessageSquareText, label: 'Interviews' },
  { icon: TrendingUp, label: 'Career Outcomes' },
]

export default function CampusFlowVisual() {
  return (
    <section className="relative overflow-hidden bg-mz-dark py-16 text-white lg:py-24">
      <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-mz-primary/25 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-mz-accent/20 blur-3xl" aria-hidden="true" />
      <div className="mz-grid-bg-dark absolute inset-0" aria-hidden="true" />

      <Container className="relative">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em] sm:text-[32px]">A continuous pathway, not a one-time drive.</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">Every stage connects to the next — from onboarding a campus to a student&rsquo;s real career outcome.</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex flex-col items-center gap-3 lg:flex-row lg:items-stretch lg:justify-between lg:gap-2">
          {STAGES.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex flex-col items-center gap-3 lg:flex-row">
              <div className="flex w-[168px] flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-5 text-center shadow-[0_18px_40px_-16px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ backgroundImage: 'var(--mz-gradient)' }}>
                  <Icon size={17} aria-hidden="true" />
                </span>
                <span className="text-[13px] font-bold leading-tight">{label}</span>
              </div>
              {i < STAGES.length - 1 && (
                <>
                  <ArrowDown size={16} className="text-white/35 lg:hidden" aria-hidden="true" />
                  <ArrowRight size={16} className="hidden shrink-0 text-white/35 lg:block" aria-hidden="true" />
                </>
              )}
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
