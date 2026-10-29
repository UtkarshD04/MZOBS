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
<<<<<<< HEAD
        <AssociateSectionHeading
          title="Who can apply"
          description="We work with genuine organizations that care about connecting people with meaningful job opportunities."
        />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TYPES.map(({ title, icon }, index) => (
            <AssociateCard key={title} title={title} icon={icon} delay={index * 0.06} />
=======
        <h2 className="text-[#101828] text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.1] tracking-tight">Who can apply</h2>
        <p className="mt-2 max-w-2xl text-[#475467] text-[16px] sm:text-[17px] font-normal leading-relaxed">
          We work with genuine organizations that care about connecting people with meaningful job opportunities.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TYPES.map((t) => (
            <li key={t} className="flex items-center gap-3 rounded-lg border border-[#E6E8F0] bg-white px-5 py-4 text-[15px] font-semibold text-[#101828]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#0b7a6d]" aria-hidden="true" />
              {t}
            </li>
>>>>>>> 505a7472e6e3593ddda92924986acbdc69c4c533
          ))}
        </ul>
      </Container>
    </section>
  )
}
