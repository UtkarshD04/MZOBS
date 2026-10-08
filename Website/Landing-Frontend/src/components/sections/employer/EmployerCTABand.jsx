import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Search, IndianRupee, MessageSquare } from 'lucide-react'
import { FadeInView } from './employerMotion'
import { PLANS, fmtINR } from '../../../lib/employerPricingPlan'

const STARTING_PRICE = Math.min(...PLANS.map((p) => p.baseAmount))

const SECONDARY = [
  { icon: Search, label: 'Search candidates', hint: 'Unlock reviewed resumes', to: '/employers#discover-talent' },
  { icon: IndianRupee, label: 'Compare plans', hint: `From ${fmtINR(STARTING_PRICE)} a year + GST`, to: '/employers/pricing' },
  { icon: MessageSquare, label: 'Talk to our team', hint: 'Custom plans and questions', to: '/contact' },
]

// Closing call to action, shared by /employers and /employers/pricing.
export default function EmployerCTABand() {
  return (
    <section id="contact" aria-labelledby="cta-heading" className="bg-white px-4 pb-20 sm:px-6 md:px-10 md:pb-28">
      <FadeInView className="employer-cta relative mx-auto max-w-7xl overflow-hidden rounded-4xl bg-(--explorer-blue) text-white">
        <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16 lg:p-14">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/90">Start hiring today</p>
            <h2 id="cta-heading" className="mt-4 max-w-xl text-balance text-[34px] font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-[46px] lg:text-[54px]">
              Your next hire starts with one job post.
            </h2>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/employers/signup"
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-md bg-white px-7 text-[15px] font-bold text-(--explorer-navy) shadow-[0_14px_30px_-14px_rgba(0,0,0,0.5)] transition-colors hover:bg-mz-accent-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Post a job
                <ArrowRight size={17} aria-hidden="true" className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
              </Link>
              <Link
                to="/employers/signin"
                className="inline-flex h-13 items-center justify-center rounded-md border border-white/40 px-7 text-[15px] font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Sign in
              </Link>
            </div>
          </div>

          <ul className="divide-y divide-white/20 border-y border-white/20">
            {SECONDARY.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="group flex min-h-19 items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/12 ring-1 ring-white/20">
                    <item.icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold">{item.label}</span>
                    <span className="block text-[13px] text-white/90">{item.hint}</span>
                  </span>
                  <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 opacity-70 motion-safe:transition-transform group-hover:opacity-100 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </FadeInView>
    </section>
  )
}
