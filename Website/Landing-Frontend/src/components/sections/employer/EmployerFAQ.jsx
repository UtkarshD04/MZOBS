import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeInView } from './employerMotion'
import { CONTACT_EMAIL, CONTACT_PHONE } from '../../../lib/config'

const FAQ_ITEMS = [
  {
    q: 'How do I create an employer account?',
    a: 'Use the "Create account" tab above, or the sign-up page — enter your business email, name, company details and a password to get started. There is no sales call required.',
  },
  {
    q: 'How do I post a job?',
    a: 'Once your employer account is set up, share the role, must-have skills, location and budget from your dashboard. Your requirement is reviewed and goes live once verified.',
  },
  {
    q: 'Who can see candidate applications?',
    a: "Only your company's employer account can see applications submitted against your requirements. There is no staff queue sitting between a candidate and your dashboard.",
  },
  {
    q: 'How are resumes and contact details protected?',
    a: 'Every resume is manually reviewed by our team before a candidate is allowed to apply, and candidate details are only shared with the employer they applied to.',
  },
  {
    q: 'How can I contact MZOBS support?',
    a: `Reach our team at ${CONTACT_EMAIL} or ${CONTACT_PHONE}, or use the "Talk to MZOBS" tab above to request a callback.`,
  },
]

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#20251F]/10 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group w-full flex items-center justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#246B5A]"
      >
        <span className="text-[15px] font-bold text-[#20251F] group-hover:text-[#246B5A] transition-colors">{item.q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#246B5A] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="pb-5 text-[14px] text-[#526051] leading-relaxed max-w-2xl">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function EmployerFAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="bg-[#F1EDE5] py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <FadeInView className="lg:sticky lg:top-28 self-start">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1F5A43]">Good questions</span>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-[#20251F] tracking-tight leading-[0.98]">Answers before you begin.</h2>
          <p className="mt-5 text-[15px] text-[#526051] leading-relaxed">
            Everything you need to know about hiring on MZOBS. Still have questions?{' '}
            <Link to="/contact" className="font-bold text-[#1F5A43] underline decoration-[#246B5A] decoration-2 underline-offset-4 hover:text-[#246B5A] transition-colors">
              Contact our team
            </Link>
            .
          </p>
        </FadeInView>

        <FadeInView delay={0.08} className="rounded-[26px] border border-[#20251F]/15 bg-white px-6 shadow-[0_18px_35px_-24px_rgba(32,37,31,0.38)] sm:px-8">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={item.q} item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </FadeInView>
      </div>
    </section>
  )
}
