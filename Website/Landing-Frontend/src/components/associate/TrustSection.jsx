import { Container } from '../mz/primitives'
import { BadgeCheck, ClipboardCheck, Handshake, ShieldCheck } from 'lucide-react'
import { AssociateCard, AssociateSectionHeading } from './associateUi'

const POINTS = [
  { title: 'Business details reviewed', icon: ClipboardCheck },
  { title: 'Transparent onboarding', icon: Handshake },
  { title: 'Candidate-first approach', icon: BadgeCheck },
  { title: 'Official Mzobs communication', icon: ShieldCheck },
]

export default function TrustSection() {
  return (
    <section className="associate-section bg-white">
      <Container>
<<<<<<< HEAD
        <AssociateSectionHeading title="Our commitments" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(({ title, icon }, index) => (
            <AssociateCard key={title} title={title} icon={icon} delay={index * 0.06} />
=======
        <h2 className="text-[#101828] text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.1] tracking-tight">Our commitments</h2>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <li key={p} className="rounded-lg border border-[#E6E8F0] px-5 py-4 text-[14.5px] font-semibold text-[#101828]">{p}</li>
>>>>>>> 505a7472e6e3593ddda92924986acbdc69c4c533
          ))}
        </ul>
      </Container>
    </section>
  )
}
