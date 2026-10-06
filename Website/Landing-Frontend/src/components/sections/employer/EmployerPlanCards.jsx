import { useState } from 'react'
import { CheckCircle2, IndianRupee, SlidersHorizontal } from 'lucide-react'
import { FadeInView } from './employerMotion'
import EmployerGuestSubscribe from './EmployerGuestSubscribe'
import EmployerPlanEnquiry from './EmployerPlanEnquiry'
import { GST_RATE_PERCENT, PLANS, fmtINR, totalAmount } from '../../../lib/employerPricingPlan'

const CORE_FEATURES = [
  'Unlimited job postings for a full year — no per-job fee',
  "Unlimited resumes for candidates who apply to your jobs",
  'Shortlist, message, reject and track every application',
  'GST invoice provided for every payment',
]

const CUSTOM_FEATURES = ['Built around your hiring volume', 'Multiple recruiters / teams', 'Our team will call you with a quote']

const btnClass =
  'explorer-btn-primary mt-7 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] rounded-md text-sm font-bold transition-all duration-200 hover:-translate-y-0.5'

function Features({ items }) {
  return (
    <ul className="mt-6 flex flex-col gap-2.5 flex-1">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-[13px] text-(--explorer-navy)/85 leading-relaxed">
          <CheckCircle2 size={16} className="text-(--explorer-blue) mt-0.5 flex-shrink-0" /> {f}
        </li>
      ))}
    </ul>
  )
}

// The four plan cards — ₹999 / ₹1499 / ₹2199 pay straight away, "Customize plan"
// opens the enquiry form. Used on /employers/pricing and the /employers page.
export default function EmployerPlanCards() {
  const [selected, setSelected] = useState(null)
  const [enquiryOpen, setEnquiryOpen] = useState(false)

  return (
    <>
      <div className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan, i) => (
          <FadeInView key={plan.code} delay={i * 0.05} className="h-full">
            <div className={`relative h-full flex flex-col rounded-[24px] bg-white p-7 shadow-[0_30px_60px_-30px_rgba(16,50,79,0.3)] border ${plan.popular ? 'border-(--explorer-blue)' : 'border-(--explorer-border)'}`}>
              {plan.popular && (
                <span className="absolute -top-3 left-7 rounded-full bg-(--explorer-blue) px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide text-white">Most popular</span>
              )}
              <div className="text-[11.5px] font-semibold tracking-wide uppercase text-(--explorer-muted)">{plan.name}</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-sans text-4xl font-bold tracking-tight text-(--explorer-navy)">{fmtINR(plan.baseAmount)}</span>
                <span className="text-[12.5px] text-(--explorer-muted)">+ {GST_RATE_PERCENT}% GST / year</span>
              </div>
              <div className="mt-1.5 text-[12px] text-(--explorer-muted)/90">Total {fmtINR(totalAmount(plan.baseAmount))} — billed once</div>

              <Features items={[...CORE_FEATURES, ...plan.extras]} />

              <button
                type="button"
                onClick={() => setSelected(plan)}
                className={`${btnClass} ${plan.popular ? 'bg-(--explorer-blue) text-white hover:bg-(--explorer-blue-hover)' : 'bg-(--explorer-navy) text-(--explorer-teal-surface) hover:bg-(--explorer-blue)'}`}
              >
                <IndianRupee size={15} /> Start Hiring
              </button>
            </div>
          </FadeInView>
        ))}

        <FadeInView delay={PLANS.length * 0.05} className="h-full">
          <div className="h-full flex flex-col rounded-[24px] border border-dashed border-(--explorer-blue)/50 bg-(--explorer-teal-surface) p-7">
            <div className="text-[11.5px] font-semibold tracking-wide uppercase text-(--explorer-muted)">Customize plan</div>
            <div className="mt-3 font-sans text-4xl font-bold tracking-tight text-(--explorer-navy)">Let's talk</div>
            <div className="mt-1.5 text-[12px] text-(--explorer-muted)/90">A plan shaped around your hiring</div>

            <Features items={CUSTOM_FEATURES} />

            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className={`${btnClass} border border-(--explorer-blue) text-(--explorer-blue) bg-white hover:bg-(--explorer-blue-surface)`}
            >
              <SlidersHorizontal size={15} /> Customize plan
            </button>
          </div>
        </FadeInView>
      </div>

      <EmployerGuestSubscribe open={!!selected} plan={selected} onClose={() => setSelected(null)} />
      <EmployerPlanEnquiry open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  )
}
