import { ShieldCheck, FileCheck2, LockKeyhole, Inbox, Mail, Phone, FileText, KeyRound, History } from 'lucide-react'
import { FadeInView } from './employerMotion'
import { Accent, Eyebrow, h2Class } from './employerUi'

// Every claim here maps to enforced Backend behaviour — keep it that way:
// - resume review: employeeApplicationController (apply needs resume.status
//   'verified') + resumeSearchFilters.baseResumeSearchFilter
// - job review: Job.status 'pending_review' + staff-set visibleToCandidates
// - contact privacy / logging: candidateReveal + CandidateUnlock (company,
//   unlockedBy, unlockedAt)
// - applications: employeeApplicationController creates the Candidate for
//   the job's company directly, no staff dispatch step
const CHECKS = [
  {
    icon: ShieldCheck,
    title: 'Resumes reviewed by our team',
    desc: 'Mzobs reviews every candidate resume. Only verified resumes can apply to your jobs or appear in candidate search.',
  },
  {
    icon: FileCheck2,
    title: 'Jobs reviewed before going live',
    desc: 'Each role you post is reviewed by Mzobs before candidates can see it, so listings stay clear and genuine.',
  },
  {
    icon: LockKeyhole,
    title: 'Contact details stay private',
    desc: 'In candidate search, email, phone and resume stay hidden until your team unlocks the profile.',
  },
  {
    icon: Inbox,
    title: 'Applications come only to you',
    desc: "Applications to your jobs go straight to your company's dashboard, with no staff queue in between.",
  },
]

const LOCKED_FIELDS = [
  { icon: Mail, label: 'Email', value: '••••••••@••••.com' },
  { icon: Phone, label: 'Phone', value: '+91 ••••• •••••' },
  { icon: FileText, label: 'Resume', value: 'Hidden' },
]

// Decorative illustration of a locked search result (aria-hidden); the list
// beside it carries the actual information.
function LockedProfile() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[440px]">
      <div className="rounded-[24px] bg-white p-5 text-(--explorer-navy) shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-(--explorer-bg) text-(--explorer-muted)">
            <LockKeyhole size={17} />
          </span>
          <div>
            <p className="text-[14px] font-extrabold">Candidate profile</p>
            <p className="text-[11.5px] font-semibold text-(--explorer-muted)">Verified resume · 3 yrs · Pune</p>
          </div>
          <span className="ml-auto rounded-full bg-(--color-mz-accent-tint) px-2 py-0.5 text-[10.5px] font-bold text-(--color-mz-accent-ink)">Verified</span>
        </div>

        <ul className="mt-5 divide-y divide-(--explorer-border) rounded-xl border border-(--explorer-border)">
          {LOCKED_FIELDS.map((f) => (
            <li key={f.label} className="flex items-center gap-3 px-3.5 py-3">
              <f.icon size={14} className="shrink-0 text-(--explorer-muted)" />
              <span className="w-14 shrink-0 text-[11.5px] font-semibold text-(--explorer-muted)">{f.label}</span>
              <span className="truncate font-mono text-[12.5px] font-semibold tracking-wide text-(--explorer-navy)/45">{f.value}</span>
              <LockKeyhole size={12} className="ml-auto shrink-0 text-(--explorer-navy)/30" />
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-(--explorer-navy) py-3 text-[13px] font-bold text-white">
          <KeyRound size={14} /> Unlock with 1 CV credit
        </div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-(--explorer-muted)">
          <History size={12} /> Unlocks are logged to your company account
        </p>
      </div>
    </div>
  )
}

export default function EmployerTrustPrivacySection() {
  return (
    <section id="trust" aria-labelledby="trust-heading" className="employer-trust relative overflow-hidden bg-(--explorer-navy-deep) px-4 py-20 text-white sm:px-6 md:px-10 md:py-28">
      <div className="relative mx-auto max-w-7xl">
        <FadeInView className="max-w-3xl">
          <Eyebrow index="05" tone="dark">Trust &amp; privacy</Eyebrow>
          <h2 id="trust-heading" className={h2Class}>
            Reviewed before it reaches you. <Accent tone="dark">Private until you unlock it.</Accent>
          </h2>
        </FadeInView>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <ol className="border-t border-white/12">
            {CHECKS.map((c, i) => (
              <FadeInView as="li" key={c.title} delay={i * 0.05} className="grid grid-cols-[auto_1fr] gap-x-5 border-b border-white/12 py-6 sm:grid-cols-[auto_auto_1fr] sm:gap-x-6">
                <span className="hidden pt-1 text-[13px] font-extrabold tabular-nums text-white/40 sm:block">{String(i + 1).padStart(2, '0')}</span>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.07] text-[#5fe0b8] ring-1 ring-white/10">
                  <c.icon size={19} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[18px] font-bold tracking-[-0.01em]">{c.title}</h3>
                  <p className="mt-1.5 max-w-lg text-[14.5px] leading-relaxed text-white/68">{c.desc}</p>
                </div>
              </FadeInView>
            ))}
          </ol>

          <FadeInView delay={0.1}>
            <LockedProfile />
            <ol className="mx-auto mt-8 grid max-w-[440px] grid-cols-3 gap-3 text-center">
              {['Find a profile', 'Spend 1 CV credit', 'Reveal contact & resume'].map((t, i) => (
                <li key={t} className="flex flex-col items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#5fe0b8] text-[12px] font-extrabold text-(--explorer-navy-deep)">{i + 1}</span>
                  <span className="text-[12.5px] font-semibold leading-snug text-white/75">{t}</span>
                </li>
              ))}
            </ol>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}
