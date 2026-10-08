import { useState } from 'react'
import { Plus, Mail, Phone, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeInView } from './employerMotion'
import { Accent, Eyebrow, h2Class } from './employerUi'
import { CONTACT_EMAIL, CONTACT_PHONE } from '../../../lib/config'
import { GST_RATE_PERCENT, PLANS, fmtINR } from '../../../lib/employerPricingPlan'

const STARTING_PRICE = Math.min(...PLANS.map((p) => p.baseAmount))

const FAQ_ITEMS = [
  {
    q: 'How do I create an employer account?',
    a: 'Go to the sign-up page and enter your business email, name, company details and a password to get started. There is no sales call required. You can also pick a plan on the pricing section and start with just your mobile number.',
  },
  {
    q: 'How do I post a job?',
    a: 'Once your employer account is set up, add the role, must-have skills, location, experience and salary range from your dashboard. Mzobs reviews the job, then it goes live to candidates.',
  },
  {
    q: 'What does a plan cost, and does it renew automatically?',
    a: `Annual plans start at ${fmtINR(STARTING_PRICE)} a year plus ${GST_RATE_PERCENT}% GST, paid once. There is no auto-renewal: you renew from your dashboard whenever you choose. Every payment comes with a GST invoice.`,
  },
  {
    q: 'Who can see candidate applications?',
    a: "Only your company's employer account can see applications submitted to your jobs. There is no staff queue between a candidate and your dashboard.",
  },
  {
    q: 'How are resumes and contact details protected?',
    a: 'Every resume is reviewed by our team before a candidate is allowed to apply. In candidate search, phone numbers, emails and resumes stay hidden until an employer unlocks them with a CV credit, and every unlock is logged.',
  },
  {
    q: 'How can I contact Mzobs support?',
    a: `Reach our team at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
  },
]

function FAQItem({ item, index, isOpen, onToggle }) {
  const buttonId = `employer-faq-q${index}`
  const panelId = `employer-faq-a${index}`
  return (
    <div className="border-b border-(--explorer-border)">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group flex min-h-18 w-full items-center gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue) rounded-md"
        >
          <span aria-hidden="true" className="hidden w-8 shrink-0 text-[13px] font-extrabold tabular-nums text-(--explorer-muted) sm:block">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`flex-1 text-[16px] font-bold leading-snug transition-colors sm:text-[17px] ${isOpen ? 'text-(--explorer-blue)' : 'text-(--explorer-navy) group-hover:text-(--explorer-blue)'}`}>
            {item.q}
          </span>
          <span
            aria-hidden="true"
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 motion-reduce:transition-none ${
              isOpen ? 'rotate-45 border-(--explorer-navy) bg-(--explorer-navy) text-white' : 'border-(--explorer-border) bg-white text-(--explorer-navy)'
            }`}
          >
            <Plus size={16} strokeWidth={2.4} />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!isOpen}
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 pr-12 text-[15px] leading-relaxed text-(--explorer-muted) sm:pl-12">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function EmployerFAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-white px-4 py-20 sm:px-6 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <FadeInView className="self-start lg:sticky lg:top-28">
          <Eyebrow index="07">FAQs</Eyebrow>
          <h2 id="faq-heading" className={`${h2Class} text-(--explorer-navy)`}>
            Answers <Accent>before you begin.</Accent>
          </h2>
          <p className="mt-5 max-w-sm text-[15.5px] leading-relaxed text-(--explorer-muted)">
            Still unsure about something?{' '}
            <Link to="/contact" className="font-bold text-(--explorer-navy) underline decoration-(--explorer-blue) decoration-2 underline-offset-4 transition-colors hover:text-(--explorer-blue)">
              Contact our team
            </Link>
            .
          </p>

          <ul className="mt-8 max-w-sm divide-y divide-(--explorer-border) border-y border-(--explorer-border)">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex min-h-14 items-center gap-3 text-[14.5px] font-semibold text-(--explorer-navy) transition-colors hover:text-(--explorer-blue) focus-visible:outline-2 focus-visible:outline-(--explorer-blue)">
                <Mail size={17} className="shrink-0 text-(--explorer-blue)" aria-hidden="true" /> {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="flex min-h-14 items-center gap-3 text-[14.5px] font-semibold text-(--explorer-navy) transition-colors hover:text-(--explorer-blue) focus-visible:outline-2 focus-visible:outline-(--explorer-blue)">
                <Phone size={17} className="shrink-0 text-(--explorer-blue)" aria-hidden="true" /> {CONTACT_PHONE}
              </a>
            </li>
            <li>
              <Link to="/employers/pricing" className="group flex min-h-14 items-center gap-3 text-[14.5px] font-bold text-(--explorer-blue) transition-colors hover:text-(--explorer-blue-hover) focus-visible:outline-2 focus-visible:outline-(--explorer-blue)">
                See full pricing details
                <ArrowRight size={16} className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </FadeInView>

        <FadeInView delay={0.08} className="self-start border-t border-(--explorer-border)">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={item.q} item={item} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </FadeInView>
      </div>
    </section>
  )
}
