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
        <AssociateSectionHeading title="Our commitments" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(({ title, icon }, index) => (
            <AssociateCard key={title} title={title} icon={icon} delay={index * 0.06} />
          ))}
        </ul>
      </Container>
    </section>
  )
}
