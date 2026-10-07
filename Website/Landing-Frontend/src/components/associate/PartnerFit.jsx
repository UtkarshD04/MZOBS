import { Container } from '../mz/primitives'

const TYPES = ['Placement Consultants', 'Recruitment Agencies', 'Local Hiring Partners', 'Career & Placement Organizations']

export default function PartnerFit() {
  return (
    <section className="border-y border-[#E6E8F0] bg-[#F8FAFC] py-14 lg:py-20">
      <Container>
        <h2 className="text-[26px] font-extrabold text-[#101828] sm:text-[32px]">Who can apply</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#475467]">
          We work with genuine organizations that care about connecting people with meaningful job opportunities.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TYPES.map((t) => (
            <li key={t} className="flex items-center gap-3 rounded-lg border border-[#E6E8F0] bg-white px-5 py-4 text-[15px] font-semibold text-[#101828]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#0b7a6d]" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
