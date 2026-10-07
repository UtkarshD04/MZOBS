import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeInView } from './employerMotion'
import { CONTACT_EMAIL, CONTACT_PHONE } from '../../../lib/config'

const FAQ_ITEMS = [
  {
    q: 'How do I create an employer account?',
    a: 'Use the "Create account" tab above, or the sign-up page, enter your business email, name, company details and a password to get started. There is no sales call required.',
  },
  {
    q: 'How do I post a job?',
    a: 'Once your employer account is set up, share the role, must-have skills, location and budget from your dashboard. Your requirement goes live once it has been reviewed, and matching starts straight away.',
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
    <div className="border-b border-(--explorer-border) last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group w-full flex items-center justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue)"
      >
        <span className="text-[15px] font-bold text-(--explorer-navy) group-hover:text-(--explorer-blue) transition-colors">{item.q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-(--explorer-blue) transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="pb-5 text-[14px] text-(--explorer-muted) leading-relaxed max-w-2xl">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function EmployerFAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="bg-(--explorer-bg) py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <FadeInView className="lg:sticky lg:top-28 self-start">
          <h2 className="font-sans text-4xl sm:text-5xl font-bold text-(--explorer-navy) tracking-tight leading-[0.98]">Answers before you begin.</h2>
          <p className="mt-5 text-[15px] text-(--explorer-muted) leading-relaxed">
            Everything you need to know about hiring on MZOBS. Still have questions?{' '}
            <Link to="/contact" className="font-bold text-(--explorer-blue) underline decoration-(--explorer-blue) decoration-2 underline-offset-4 hover:text-(--explorer-blue-hover) transition-colors">
              Contact our team
            </Link>
            .
          </p>
        </FadeInView>

        <FadeInView delay={0.08} className="rounded-[26px] border border-(--explorer-border) bg-white px-6 shadow-[0_18px_35px_-24px_rgba(16,42,67,0.25)] sm:px-8">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={item.q} item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </FadeInView>
      </div>
    </section>
  )
}
