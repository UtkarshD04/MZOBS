import { useState } from 'react'
import { ArrowRight, Check, Briefcase, FileText, ListChecks, ReceiptIndianRupee, Phone } from 'lucide-react'
import { FadeInView } from './employerMotion'
import EmployerGuestSubscribe from './EmployerGuestSubscribe'
import EmployerPlanEnquiry from './EmployerPlanEnquiry'
import { GST_RATE_PERCENT, PLANS, fmtINR, totalAmount } from '../../../lib/employerPricingPlan'

const CORE_FEATURES = [
  { icon: Briefcase, text: 'Unlimited job postings for a full year, no per-job fee' },
  { icon: FileText, text: 'Unlimited resumes for candidates who apply to your jobs' },
  { icon: ListChecks, text: 'Shortlist, message, reject and track every application' },
  { icon: ReceiptIndianRupee, text: 'GST invoice provided for every payment' },
]

const CUSTOM_FEATURES = ['Built around your hiring volume', 'Multiple recruiters / teams', 'Our team will call you with a quote']

// "MZOBS Employer Annual Plus" → "Annual Plus"; the full name stays as the
// small label above it so nothing about the plan is renamed.
const shortName = (name) => name.replace(/^MZOBS Employer\s+/i, '')

// The plan cards — ₹999 / ₹1499 / ₹2199 pay straight away through the guest
// checkout, "Customize plan" opens the enquiry form. Used on /employers/pricing
// and the /employers page.
export default function EmployerPlanCards() {
  const [selected, setSelected] = useState(null)
  const [enquiryOpen, setEnquiryOpen] = useState(false)

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <FadeInView className="rounded-[24px] border border-(--explorer-border) bg-white p-5 sm:p-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-(--explorer-muted)">Every plan includes</p>
          <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_FEATURES.map((f) => (
              <li key={f.text} className="flex items-start gap-3 text-[14px] font-semibold leading-snug text-(--explorer-navy)">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-(--explorer-blue-surface) text-(--explorer-blue)">
                  <f.icon size={16} aria-hidden="true" />
                </span>
                <span className="pt-1">{f.text}</span>
              </li>
            ))}
          </ul>
        </FadeInView>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => {
            const featured = plan.popular
            return (
              <FadeInView key={plan.code} delay={i * 0.05} className="h-full">
                <div
                  className={`relative flex h-full flex-col rounded-[24px] p-6 sm:p-7 ${
                    featured
                      ? 'bg-(--explorer-navy-deep) text-white shadow-[0_30px_60px_-30px_rgba(11,16,32,0.6)]'
                      : 'border border-(--explorer-border) bg-white text-(--explorer-navy)'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-[11px] font-bold uppercase tracking-[0.12em] ${featured ? 'text-white/55' : 'text-(--explorer-muted)'}`}>MZOBS Employer</p>
                      <h3 className="mt-1 text-[19px] font-extrabold tracking-[-0.02em]">{shortName(plan.name)}</h3>
                    </div>
                    {featured && (
                      <span className="shrink-0 rounded-full bg-[#5fe0b8] px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide text-(--explorer-navy-deep)">Most popular</span>
                    )}
                  </div>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-[40px] font-extrabold leading-none tracking-[-0.04em]">{fmtINR(plan.baseAmount)}</span>
                    <span className={`text-[13.5px] font-semibold ${featured ? 'text-white/60' : 'text-(--explorer-muted)'}`}>/ year</span>
                  </div>
                  <p className={`mt-2 text-[12.5px] font-semibold leading-snug ${featured ? 'text-white/65' : 'text-(--explorer-muted)'}`}>
                    + {GST_RATE_PERCENT}% GST · {fmtINR(totalAmount(plan.baseAmount))} total, billed once
                  </p>

                  <ul className={`mt-6 flex-1 space-y-2.5 border-t pt-5 ${featured ? 'border-white/12' : 'border-(--explorer-border)'}`}>
                    <li className={`flex items-start gap-2.5 text-[13.5px] font-semibold ${featured ? 'text-white/85' : 'text-(--explorer-navy)/85'}`}>
                      <Check size={16} strokeWidth={2.6} aria-hidden="true" className={`mt-0.5 shrink-0 ${featured ? 'text-[#5fe0b8]' : 'text-(--explorer-blue)'}`} />
                      Everything every plan includes
                    </li>
                    {plan.extras.map((x) => (
                      <li key={x} className={`flex items-start gap-2.5 text-[13.5px] font-semibold ${featured ? 'text-white' : 'text-(--explorer-navy)'}`}>
                        <Check size={16} strokeWidth={2.6} aria-hidden="true" className={`mt-0.5 shrink-0 ${featured ? 'text-[#5fe0b8]' : 'text-(--explorer-blue)'}`} />
                        {x}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => setSelected(plan)}
                    aria-label={`Choose ${shortName(plan.name)}, ${fmtINR(plan.baseAmount)} a year`}
                    className={`explorer-btn-primary mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-5 text-[14px] font-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      featured
                        ? 'bg-[#5fe0b8] text-(--explorer-navy-deep) hover:bg-white focus-visible:outline-white'
                        : 'bg-(--explorer-navy) text-white hover:bg-(--explorer-blue) focus-visible:outline-(--explorer-blue)'
                    }`}
                  >
                    Choose {shortName(plan.name)} <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </FadeInView>
            )
          })}

          <FadeInView delay={PLANS.length * 0.05} className="h-full">
            <div className="flex h-full flex-col rounded-[24px] border-2 border-dashed border-(--explorer-blue-border) bg-(--explorer-blue-surface)/50 p-6 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--explorer-muted)">Custom</p>
              <h3 className="mt-1 text-[19px] font-extrabold tracking-[-0.02em] text-(--explorer-navy)">Customize plan</h3>
              <p className="mt-6 text-[32px] font-extrabold leading-none tracking-[-0.03em] text-(--explorer-navy)">Let's talk</p>
              <p className="mt-2 text-[12.5px] font-semibold text-(--explorer-muted)">A plan shaped around your hiring</p>

              <ul className="mt-6 flex-1 space-y-2.5 border-t border-(--explorer-blue-border) pt-5">
                {CUSTOM_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] font-semibold text-(--explorer-navy)/85">
                    <Check size={16} strokeWidth={2.6} aria-hidden="true" className="mt-0.5 shrink-0 text-(--explorer-blue)" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-(--explorer-blue) bg-white px-5 text-[14px] font-bold text-(--explorer-blue) transition-colors hover:bg-(--explorer-blue) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
              >
                <Phone size={15} aria-hidden="true" /> Request a callback
              </button>
            </div>
          </FadeInView>
        </div>
      </div>

      <EmployerGuestSubscribe open={!!selected} plan={selected} onClose={() => setSelected(null)} />
      <EmployerPlanEnquiry open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  )
}
