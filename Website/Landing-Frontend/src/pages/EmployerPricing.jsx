import { CheckCircle2, ShieldCheck, IndianRupee, RefreshCcw, FileCheck2, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import EmployerNavbar from '../components/layout/EmployerNavbar'
import EmployerFooter from '../components/layout/EmployerFooter'
import EmployerCTABand from '../components/sections/employer/EmployerCTABand'
import EmployerGuestSubscribe from '../components/sections/employer/EmployerGuestSubscribe'
import { FadeInLoad, FadeInView } from '../components/sections/employer/employerMotion'

// Mirrors Backend/src/config/env.js (EMPLOYER_ANNUAL_PLAN_AMOUNT_PAISE,
// GST_RATE_PERCENT) — this marketing site has no authenticated pricing
// endpoint to call, so these numbers are kept in sync by hand. Update both
// places together if the plan price ever changes.
const PLAN = {
  name: 'MZOBS Employer Annual',
  baseAmount: 999,
  gstRatePercent: 18,
}
const gstAmount = Math.round(PLAN.baseAmount * (PLAN.gstRatePercent / 100) * 100) / 100
const totalAmount = PLAN.baseAmount + gstAmount

const FEATURES = [
  'Unlimited job postings for a full year — no per-job fee',
  'Unlimited viewing & downloading of resumes for candidates who apply to your jobs',
  'Full applicant details — contact info, resume, profile — for your own applicants',
  'Shortlist, message, reject and track every application from one dashboard',
  'GST invoice provided for every payment',
]

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: 'One-time annual payment', desc: 'No auto-renewal, no hidden charges — MZOBS never charges your card without your action.' },
  { icon: FileCheck2, title: 'GST invoice included', desc: 'Every payment comes with a proper GST invoice for your records, generated automatically.' },
  { icon: RefreshCcw, title: 'Renew in a few clicks', desc: "When your plan is close to expiry, renew anytime from your dashboard — nothing to raise with support." },
]

const FAQS = [
  {
    q: 'How many jobs can I post?',
    a: 'As many as you need. Once your MZOBS Employer Annual plan is active, job postings are unlimited for the full year — there is no per-job charge.',
  },
  {
    q: 'Which candidates can I see resumes for?',
    a: "Only candidates who have applied to one of your own job postings. MZOBS does not sell access to a general resume database — a candidate's resume and contact details are only ever visible to the employer they applied to.",
  },
  {
    q: 'Does this renew automatically?',
    a: 'No. This is a one-time annual payment. MZOBS never auto-charges you — you renew manually from your dashboard whenever you choose.',
  },
  {
    q: 'How do I subscribe?',
    a: 'Verify your mobile number and pay right from this page — no signup form. Your account, already on the active plan, is ready the moment payment goes through.',
  },
]

function fmtINR(n) {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#20251F]/10 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group w-full flex items-center justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#246B5A]"
      >
        <span className="text-[15px] font-bold text-[#20251F] group-hover:text-[#246B5A] transition-colors">{item.q}</span>
        <ChevronDown size={18} className={`shrink-0 text-[#246B5A] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="pb-5 text-[14px] text-[#526051] leading-relaxed max-w-2xl">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function EmployerPricing() {
  const [openFaq, setOpenFaq] = useState(0)
  const [subscribeOpen, setSubscribeOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F5F6F4] text-[#20251F] font-sans antialiased selection:bg-[#DDE6DF]">
      <Seo path="/employers/pricing" {...STATIC_PAGE_SEO['/employers/pricing']} />
      <EmployerNavbar />

      {/* Header */}
      <section className="relative overflow-hidden pt-[104px] pb-14 md:pt-[128px] md:pb-20 px-6 md:px-12">
        <div aria-hidden="true" className="absolute -left-28 -top-16 h-72 w-72 rounded-full bg-[#DDE6DF]/60 blur-[90px]" />
        <FadeInLoad className="relative max-w-2xl mx-auto text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#246B5A]">Simple, transparent pricing</span>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl md:text-[56px] font-bold text-[#20251F] tracking-tight leading-[1.02]">
            One plan. Everything you need to hire.
          </h1>
          <p className="mt-5 text-[15px] sm:text-base text-[#526051] leading-relaxed max-w-xl mx-auto">
            No tiers to compare, no add-ons to negotiate. A single annual plan unlocks unlimited job postings and full
            access to your applicants' resumes.
          </p>
        </FadeInLoad>
      </section>

      {/* Pricing card */}
      <section className="px-6 md:px-12 pb-20 md:pb-28">
        <FadeInView className="relative max-w-lg mx-auto">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#20251F] text-[#F6C16E] text-[11px] font-bold uppercase tracking-[0.1em] shadow-sm">
            Best value
          </span>
          <div className="rounded-[28px] border border-[#20251F]/15 bg-white shadow-[10px_12px_0_#20251F] p-8 sm:p-10">
            <div className="text-[11.5px] font-semibold tracking-wide uppercase text-[#526051]">{PLAN.name}</div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-5xl font-bold tracking-tight text-[#20251F]">{fmtINR(PLAN.baseAmount)}</span>
              <span className="text-[13px] text-[#526051]">+ {PLAN.gstRatePercent}% GST / year</span>
            </div>
            <div className="mt-1.5 text-[12.5px] text-[#526051]/80">
              Total {fmtINR(totalAmount)} — billed once, no surprises at checkout
            </div>

            <ul className="mt-7 flex flex-col gap-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-[#20251F]/85 leading-relaxed">
                  <CheckCircle2 size={17} className="text-[#246B5A] mt-0.5 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setSubscribeOpen(true)}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] rounded-full bg-[#20251F] text-[#FAF7F1] text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#246B5A]"
            >
              <IndianRupee size={15} /> Create account to subscribe
            </button>
            <p className="mt-3 text-center text-[12px] text-[#526051]">
              Just verify your mobile number and pay — your account is created for you.
            </p>
          </div>
        </FadeInView>

        <div className="mt-14 max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
          {HIGHLIGHTS.map((h, i) => (
            <FadeInView key={h.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-[#20251F]/12 bg-[#FAF7F1] p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDE6DF] text-[#246B5A]">
                  <h.icon size={16} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 text-[13.5px] font-bold text-[#20251F]">{h.title}</h3>
                <p className="mt-1.5 text-[12.5px] text-[#526051] leading-relaxed">{h.desc}</p>
              </div>
            </FadeInView>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F1EDE5] py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <FadeInView className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1F5A43]">Good questions</span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#20251F] tracking-tight">Pricing, answered.</h2>
          </FadeInView>
          <FadeInView delay={0.08} className="rounded-[26px] border border-[#20251F]/15 bg-white px-6 shadow-[0_18px_35px_-24px_rgba(32,37,31,0.38)] sm:px-8">
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} item={item} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </FadeInView>
        </div>
      </section>

      <EmployerCTABand />
      <EmployerFooter />

      <EmployerGuestSubscribe open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </div>
  )
}
