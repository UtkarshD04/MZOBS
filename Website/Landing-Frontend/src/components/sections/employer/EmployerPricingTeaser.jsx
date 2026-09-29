import { useState } from 'react'
import { CheckCircle2, IndianRupee } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeInView } from './employerMotion'
import EmployerGuestSubscribe from './EmployerGuestSubscribe'
import { PLAN, totalAmount, fmtINR } from '../../../lib/employerPricingPlan'

const FEATURES = [
  'Unlimited job postings for a full year',
  'Unlimited resumes for candidates who apply to your jobs',
  'One dashboard for every application, shortlist and interview',
]

export default function EmployerPricingTeaser() {
  const [subscribeOpen, setSubscribeOpen] = useState(false)

  return (
    <section id="pricing" className="bg-(--explorer-bg) py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-lg mx-auto text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-(--explorer-blue)">Simple, transparent pricing</span>
        <h2 className="mt-3 font-sans text-3xl sm:text-4xl font-bold text-(--explorer-navy) tracking-tight">One plan for everything.</h2>
      </div>

      <FadeInView className="relative max-w-lg mx-auto mt-10">
        <div className="rounded-[28px] border border-(--explorer-border) bg-white p-8 sm:p-10 shadow-[0_30px_60px_-30px_rgba(16,50,79,0.3)]">
          <div className="text-[11.5px] font-semibold tracking-wide uppercase text-(--explorer-muted)">{PLAN.name}</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-sans text-5xl font-bold tracking-tight text-(--explorer-navy)">{fmtINR(PLAN.baseAmount)}</span>
            <span className="text-[13px] text-(--explorer-muted)">+ {PLAN.gstRatePercent}% GST / year</span>
          </div>
          <div className="mt-1.5 text-[12.5px] text-(--explorer-muted)/90">Total {fmtINR(totalAmount)} — billed once</div>

          <ul className="mt-6 flex flex-col gap-2.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-(--explorer-navy)/85 leading-relaxed">
                <CheckCircle2 size={16} className="text-(--explorer-blue) mt-0.5 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setSubscribeOpen(true)}
            className="explorer-btn-primary mt-7 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] rounded-md bg-(--explorer-blue) text-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:bg-(--explorer-blue-hover)"
          >
            <IndianRupee size={15} /> Start Hiring
          </button>
          <p className="mt-3 text-center text-[12px] text-(--explorer-muted)">
            <Link to="/employers/pricing" className="font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover)">
              See full pricing details
            </Link>
          </p>
        </div>
      </FadeInView>

      <EmployerGuestSubscribe open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </section>
  )
}
