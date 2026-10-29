import { Container } from '../mz/primitives'
import { BriefcaseBusiness, Building2, MapPin, GraduationCap } from 'lucide-react'
import { AssociateCard, AssociateSectionHeading } from './associateUi'

const TYPES = [
  { title: 'Placement Consultants', icon: BriefcaseBusiness },
  { title: 'Recruitment Agencies', icon: Building2 },
  { title: 'Local Hiring Partners', icon: MapPin },
  { title: 'Career & Placement Organizations', icon: GraduationCap },
]

export default function PartnerFit() {
  return (
    <section className="associate-section associate-section--soft border-y border-[#E1E9E8]">
      <Container>
        <AssociateSectionHeading
          title="Who can apply"
          description="We work with genuine organizations that care about connecting people with meaningful job opportunities."
        />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TYPES.map(({ title, icon }, index) => (
            <AssociateCard key={title} title={title} icon={icon} delay={index * 0.06} />
          ))}
        </ul>
      </Container>
    </section>
  )
}
