import { Container } from '../mz/primitives'
import { CONTACT_EMAIL } from '../../lib/config'

const FAQS = [
  { q: 'Who can become a Mzobs associate?', a: 'Placement consultants, recruitment agencies, local hiring partners and career or placement organizations that genuinely work to connect people with jobs.' },
  { q: 'What happens after I apply?', a: 'Our team reviews your application and business details, then gets in touch to discuss how we can work together. Onboarding begins only after this review.' },
  { q: 'How do I know a message is really from Mzobs?', a: 'Apply only through this official page and rely on communication from the Mzobs team. Never share sensitive information with unknown individuals claiming to represent Mzobs.' },
  { q: 'Who do I contact with questions?', a: `Write to us at ${CONTACT_EMAIL} and the Mzobs team will respond.` },
]

export default function FAQ() {
  return (
    <section className="border-y border-[#E6E8F0] bg-[#F8FAFC] py-14 lg:py-20">
      <Container>
        <h2 className="text-[26px] font-extrabold text-[#101828] sm:text-[32px]">Frequently asked questions</h2>
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
        </div>
      </Container>
    </section>
  )
}
