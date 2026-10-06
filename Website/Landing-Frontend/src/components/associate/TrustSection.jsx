import { CheckCircle2 } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

const POINTS = [
  'Business details reviewed',
  'Transparent onboarding',
  'Candidate-first approach',
  'Official Mzobs communication',
]

export default function TrustSection() {
  return (
    <section className="relative bg-white py-16 lg:py-20">
      <Container>
        <div className="rounded-[28px] border border-[#E6E8F0] bg-[#F8FAFC] p-8 sm:p-10 lg:p-12">
          <Reveal className="text-center">
            <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-[#101828] sm:text-[30px]">Built for genuine partnerships.</h2>
          </Reveal>
          <ul className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            {POINTS.map((point, i) => (
              <Reveal as="li" key={point} delay={i * 0.06} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6F6F3] text-[#0F8F83]">
                  <CheckCircle2 size={15} aria-hidden="true" />
                </span>
                <span className="text-[14px] font-semibold text-[#101828]">{point}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
