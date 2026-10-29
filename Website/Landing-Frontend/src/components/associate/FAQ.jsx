import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'
import { CONTACT_EMAIL } from '../../lib/config'
import { AssociateSectionHeading } from './associateUi'

const FAQS = [
  { q: 'Who can become a Mzobs associate?', a: 'Placement consultants, recruitment agencies, local hiring partners and career or placement organizations that genuinely work to connect people with jobs.' },
  { q: 'What happens after I apply?', a: 'Our team reviews your application and business details, then gets in touch to discuss how we can work together. Onboarding begins only after this review.' },
  { q: 'How do I know a message is really from Mzobs?', a: 'Apply only through this official page and rely on communication from the Mzobs team. Never share sensitive information with unknown individuals claiming to represent Mzobs.' },
  { q: 'Who do I contact with questions?', a: `Write to us at ${CONTACT_EMAIL} and the Mzobs team will respond.` },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <section className="associate-section associate-section--soft border-y border-[#E1E9E8]">
      <Container>
<<<<<<< HEAD
        <AssociateSectionHeading title="Frequently asked questions" />
        <div className="grid max-w-3xl gap-3">
          {FAQS.map(({ q, a }, index) => {
            const isOpen = openIndex === index
            const buttonId = `associate-faq-question-${index}`
            const panelId = `associate-faq-answer-${index}`

            return (
              <Reveal as="article" key={q} delay={index * 0.05} className="associate-faq-item">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="associate-faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span className="associate-faq-question">{q}</span>
                    <ChevronDown
                      size={20}
                      className="associate-faq-chevron"
                      data-open={isOpen}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!isOpen}
                  className="associate-faq-panel"
                  data-open={isOpen}
                >
                  <div className="associate-faq-panel-inner">
                    <p className="associate-faq-answer">{a}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
=======
        <h2 className="text-[#101828] text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.1] tracking-tight">Frequently asked questions</h2>
        <div className="mt-6 max-w-3xl divide-y divide-[#EAECF0] rounded-lg border border-[#E6E8F0] bg-white">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-[#101828] [&::-webkit-details-marker]:hidden">
                {q}
                <span className="text-[20px] leading-none text-[#475467] group-open:hidden" aria-hidden="true">+</span>
                <span className="hidden text-[20px] leading-none text-[#475467] group-open:inline" aria-hidden="true">−</span>
              </summary>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[#475467]">{a}</p>
            </details>
          ))}
>>>>>>> 505a7472e6e3593ddda92924986acbdc69c4c533
        </div>
      </Container>
    </section>
  )
}
