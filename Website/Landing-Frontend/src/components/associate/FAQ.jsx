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
        </div>
      </Container>
    </section>
  )
}
