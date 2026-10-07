import { Container } from '../mz/primitives'

const POINTS = ['Business details reviewed', 'Transparent onboarding', 'Candidate-first approach', 'Official Mzobs communication']

export default function TrustSection() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <h2 className="text-[26px] font-extrabold text-[#101828] sm:text-[32px]">Our commitments</h2>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <li key={p} className="rounded-lg border border-[#E6E8F0] px-5 py-4 text-[14.5px] font-semibold text-[#101828]">{p}</li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
