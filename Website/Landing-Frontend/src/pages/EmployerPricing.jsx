import { ShieldCheck, RefreshCcw, FileCheck2, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import EmployerNavbar from '../components/layout/EmployerNavbar'
import EmployerFooter from '../components/layout/EmployerFooter'
import EmployerCTABand from '../components/sections/employer/EmployerCTABand'
import EmployerPlanCards from '../components/sections/employer/EmployerPlanCards'
import { FadeInLoad, FadeInView } from '../components/sections/employer/employerMotion'

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: 'One-time annual payment', desc: 'No auto-renewal, no hidden charges — MZOBS never charges your card without your action.' },
  { icon: FileCheck2, title: 'GST invoice included', desc: 'Every payment comes with a proper GST invoice for your records, generated automatically.' },
  { icon: RefreshCcw, title: 'Renew in a few clicks', desc: "When your plan is close to expiry, renew anytime from your dashboard — nothing to raise with support." },
]

const FAQS = [
  {
    q: 'How many jobs can I post?',
    a: 'As many as you need. Once any MZOBS Employer annual plan is active, job postings are unlimited for the full year — there is no per-job charge.',
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
    a: 'Pick a plan, confirm your mobile number and pay right from this page — no signup form. Your account, already on the active plan, is ready the moment payment goes through.',
  },
]

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-(--explorer-border) last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group w-full flex items-center justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue)"
      >
        <span className="text-[15px] font-bold text-(--explorer-navy) group-hover:text-(--explorer-blue) transition-colors">{item.q}</span>
        <ChevronDown size={18} className={`shrink-0 text-(--explorer-blue) transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="pb-5 text-[14px] text-(--explorer-muted) leading-relaxed max-w-2xl">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function EmployerPricing() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="min-h-screen bg-(--explorer-bg) text-(--explorer-navy) font-sans antialiased selection:bg-(--explorer-blue-surface)">
      <Seo path="/employers/pricing" {...STATIC_PAGE_SEO['/employers/pricing']} />
      <EmployerNavbar />

      {/* Header */}
      <section className="relative overflow-hidden pt-[104px] pb-14 md:pt-[128px] md:pb-20 px-6 md:px-12">
        <div aria-hidden="true" className="absolute -left-28 -top-16 h-72 w-72 rounded-full bg-(--explorer-blue-surface) blur-[90px]" />
        <FadeInLoad className="relative max-w-2xl mx-auto text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-(--explorer-blue)">Simple, transparent pricing</span>
          <h1 className="mt-3 font-sans text-4xl sm:text-5xl md:text-[56px] font-bold text-(--explorer-navy) tracking-tight leading-[1.02]">
            Pick the plan that fits your hiring.
          </h1>
          <p className="mt-5 text-[15px] sm:text-base text-(--explorer-muted) leading-relaxed max-w-xl mx-auto">
            Every annual plan unlocks unlimited job postings and full access to your applicants' resumes. Need something
            different? Customize a plan and our team will call you.
          </p>
        </FadeInLoad>
      </section>

      {/* Plans */}
      <section className="px-6 md:px-12 pb-20 md:pb-28">
        <EmployerPlanCards />

        <div className="mt-14 max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
          {HIGHLIGHTS.map((h, i) => (
            <FadeInView key={h.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-(--explorer-border) bg-(--explorer-teal-surface) p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue)">
                  <h.icon size={16} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 text-[13.5px] font-bold text-(--explorer-navy)">{h.title}</h3>
                <p className="mt-1.5 text-[12.5px] text-(--explorer-muted) leading-relaxed">{h.desc}</p>
              </div>
            </FadeInView>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 md:py-24 px-6 md:px-12 border-y border-(--explorer-border)">
        <div className="max-w-2xl mx-auto">
          <FadeInView className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-(--explorer-blue)">Good questions</span>
            <h2 className="mt-3 font-sans text-3xl sm:text-4xl font-bold text-(--explorer-navy) tracking-tight">Pricing, answered.</h2>
          </FadeInView>
          <FadeInView delay={0.08} className="rounded-[26px] border border-(--explorer-border) bg-(--explorer-bg) px-6 sm:px-8">
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} item={item} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </FadeInView>
        </div>
      </section>

      <EmployerCTABand />
      <EmployerFooter />
    </div>
  )
}
