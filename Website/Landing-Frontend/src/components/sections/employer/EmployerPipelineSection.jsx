import { useRef, useState } from 'react'
import { Inbox, ListChecks, CalendarCheck, FileSignature, CheckCircle2, XCircle } from 'lucide-react'
import { FadeInView } from './employerMotion'
import { Accent, Eyebrow, h2Class } from './employerUi'

// Mirrors Backend Candidate.stage: shared ("New") → shortlisted →
// interviewing → offered → hired, with rejected (plus a reason) available
// from any stage.
const STAGES = [
  {
    key: 'new',
    label: 'New',
    icon: Inbox,
    title: 'Applications arrive with a reviewed resume',
    desc: 'When a candidate applies to your live job, the application goes straight to your company dashboard with their resume attached. There is no staff queue in between.',
    actions: ['Open the full profile and resume', 'Shortlist or reject in one step'],
  },
  {
    key: 'shortlisted',
    label: 'Shortlisted',
    icon: ListChecks,
    title: 'Keep the people who fit',
    desc: 'Move promising applicants into your shortlist so the whole role reads at a glance. Everyone else can be rejected with a reason, keeping your list clean.',
    actions: ['Send outreach messages to candidates', 'Schedule an interview from the dashboard'],
  },
  {
    key: 'interviewing',
    label: 'Interview',
    icon: CalendarCheck,
    title: 'Run interviews in one place',
    desc: 'Schedule interviews from the dashboard, reschedule or cancel when plans change, and record feedback after each conversation.',
    actions: ['Schedule, reschedule or cancel interviews', 'Record interview feedback'],
  },
  {
    key: 'offered',
    label: 'Offered',
    icon: FileSignature,
    title: 'Record the offer',
    desc: 'Create an offer for the candidate you want, then update its status as they respond, so pending decisions stay visible.',
    actions: ['Create an offer from the dashboard', 'Update the offer status as it moves'],
  },
  {
    key: 'hired',
    label: 'Hired',
    icon: CheckCircle2,
    title: 'Close the loop',
    desc: 'Mark the hire to complete the role, with a clear record of how each candidate moved through the pipeline.',
    actions: ['Keep a record of every hiring decision', 'Post your next role anytime'],
  },
]

export default function EmployerPipelineSection() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef([])
  const stage = STAGES[active]

  // WAI-ARIA tabs keyboard pattern: arrows move between tabs, Home/End jump.
  function onKeyDown(e, i) {
    const last = STAGES.length - 1
    const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="pipeline" aria-labelledby="pipeline-heading" className="border-t border-(--explorer-border) bg-(--explorer-bg) px-4 py-20 sm:px-6 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeInView className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Eyebrow index="03">Manage applications</Eyebrow>
            <h2 id="pipeline-heading" className={`${h2Class} max-w-3xl text-(--explorer-navy)`}>
              Every applicant, <Accent>one stage</Accent> at a time.
            </h2>
          </div>
          <p className="max-w-sm text-[15.5px] leading-relaxed text-(--explorer-muted)">
            Each job has its own pipeline. Select a stage to see what happens there.
          </p>
        </FadeInView>

        <FadeInView delay={0.06} className="mt-12">
          <div role="tablist" aria-label="Hiring pipeline stages" className="relative grid grid-cols-5 gap-1.5 sm:gap-3">
            <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-[22px] hidden h-0.5 bg-(--explorer-border) sm:block" />
            <span
              aria-hidden="true"
              className="absolute left-[10%] top-[22px] hidden h-0.5 bg-(--explorer-blue) transition-[width] duration-500 ease-out motion-reduce:transition-none sm:block"
              style={{ width: `${(active / (STAGES.length - 1)) * 80}%` }}
            />
            {STAGES.map((s, i) => {
              const selected = i === active
              const done = i < active
              return (
                <button
                  key={s.key}
                  ref={(el) => (tabRefs.current[i] = el)}
                  id={`pipeline-tab-${s.key}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="pipeline-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="group relative flex min-h-[76px] flex-col items-center gap-2 rounded-xl px-1 py-1 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full border-2 transition-colors duration-300 ${
                      selected
                        ? 'border-(--explorer-blue) bg-(--explorer-blue) text-white shadow-mz-cta'
                        : done
                          ? 'border-(--explorer-blue) bg-white text-(--explorer-blue)'
                          : 'border-(--explorer-border) bg-white text-(--explorer-muted) group-hover:border-(--explorer-blue-border) group-hover:text-(--explorer-blue)'
                    }`}
                  >
                    <s.icon size={18} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className={`text-[11.5px] font-bold sm:text-[13.5px] ${selected ? 'text-(--explorer-navy)' : 'text-(--explorer-muted) group-hover:text-(--explorer-navy)'}`}>
                    {s.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div
            id="pipeline-panel"
            role="tabpanel"
            aria-labelledby={`pipeline-tab-${stage.key}`}
            tabIndex={0}
            className="mt-8 grid gap-8 rounded-[28px] border border-(--explorer-border) bg-white p-6 shadow-[0_30px_60px_-46px_rgba(16,42,67,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue) sm:p-9 md:grid-cols-[1.2fr_1fr] md:gap-12"
          >
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-(--explorer-blue)">
                Stage {active + 1} of {STAGES.length} · {stage.label}
              </p>
              <h3 className="mt-3 text-[24px] font-extrabold leading-tight tracking-[-0.025em] text-(--explorer-navy) sm:text-[30px]">{stage.title}</h3>
              <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-(--explorer-muted)">{stage.desc}</p>
            </div>
            <div className="flex flex-col justify-between gap-6 border-t border-(--explorer-border) pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-(--explorer-muted)">What you can do here</p>
                <ul className="mt-4 space-y-3">
                  {stage.actions.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-[15px] font-semibold text-(--explorer-navy)">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--explorer-blue)" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="flex items-start gap-2.5 rounded-xl bg-(--explorer-bg) px-4 py-3 text-[13.5px] leading-relaxed text-(--explorer-navy)/75">
                <XCircle size={16} className="mt-0.5 shrink-0 text-(--explorer-muted)" aria-hidden="true" />
                Not a fit? Reject a candidate at any stage and record the reason.
              </p>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
