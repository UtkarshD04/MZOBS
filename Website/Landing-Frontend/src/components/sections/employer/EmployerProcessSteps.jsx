import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeInView } from './employerMotion'
import { Accent, Eyebrow, h2Class } from './employerUi'
import { GST_RATE_PERCENT, PLANS, fmtINR } from '../../../lib/employerPricingPlan'

const STARTING_PRICE = Math.min(...PLANS.map((p) => p.baseAmount))

// How an employer actually gets going: account (or the pricing page's
// phone-number checkout, see EmployerGuestSubscribe), an annual plan, then a
// job that Mzobs reviews (Job.status 'pending_review') before it goes live.
const STEPS = [
  {
    title: 'Create your employer account',
    desc: 'Sign up with your business email, name and company details. No sales call. Prefer to pay first? Pick a plan and start with just your mobile number.',
    link: { label: 'Create employer account', to: '/employers/signup' },
  },
  {
    title: 'Choose an annual plan',
    desc: `Plans start at ${fmtINR(STARTING_PRICE)} a year + ${GST_RATE_PERCENT}% GST, paid once. Every plan includes unlimited job posts and a GST invoice.`,
    link: { label: 'Compare plans', to: '/employers#pricing' },
  },
  {
    title: 'Publish your first role',
    desc: 'Add the title, skills, location, experience and salary range. Mzobs reviews the job, then it goes live and applications reach your dashboard.',
    link: { label: 'Post a job', to: '/employers/signup' },
  },
]

export default function EmployerProcessSteps() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="bg-(--explorer-bg) px-4 py-20 sm:px-6 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeInView className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Eyebrow index="01">Get started</Eyebrow>
            <h2 id="how-heading" className={`${h2Class} max-w-2xl text-(--explorer-navy)`}>
              Start hiring in <Accent>three steps.</Accent>
            </h2>
          </div>
          <p className="max-w-sm text-[15.5px] leading-relaxed text-(--explorer-muted)">
            No sales call and no per-job fee. Every job is reviewed by Mzobs before candidates see it.
          </p>
        </FadeInView>

        <ol className="mt-14 grid gap-0 md:mt-16 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <FadeInView as="li" key={step.title} delay={i * 0.06} className="relative flex gap-5 pb-10 last:pb-0 md:block md:pb-0">
              {/* Mobile: vertical rail. Desktop: top rule. */}
              {i < STEPS.length - 1 && <span aria-hidden="true" className="absolute left-4.75 top-11 bottom-0 w-px bg-(--explorer-border) md:hidden" />}
              <span aria-hidden="true" className="hidden h-px w-full bg-(--explorer-navy)/15 md:block" />
              <span className="relative z-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-(--explorer-navy) text-[14px] font-extrabold text-white md:mt-6 md:h-auto md:w-auto md:place-items-start md:bg-transparent md:text-[56px] md:font-extrabold md:leading-none md:tracking-tighter md:text-(--explorer-navy)/12">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 pt-1.5 md:pt-0">
                <h3 className="text-[19px] font-extrabold tracking-[-0.02em] text-(--explorer-navy) md:mt-5 md:text-[21px]">{step.title}</h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-(--explorer-muted)">{step.desc}</p>
                <Link
                  to={step.link.to}
                  className="group mt-4 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) rounded-sm"
                >
                  {step.link.label}
                  <ArrowRight size={15} aria-hidden="true" className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
                </Link>
              </div>
            </FadeInView>
          ))}
        </ol>
      </div>
    </section>
  )
}
