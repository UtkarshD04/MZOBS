import { Container } from '../mz/primitives'
import { BriefcaseBusiness, Network, HeartHandshake, TrendingUp } from 'lucide-react'
import { AssociateCard, AssociateSectionHeading } from './associateUi'

const CARDS = [
  { title: 'Access more opportunities', desc: 'Find relevant openings from employers across industries.', icon: BriefcaseBusiness },
  { title: 'Expand your reach', desc: 'Connect your candidates with opportunities beyond your local network.', icon: Network },
  { title: 'Candidate-first network', desc: 'Help candidates discover relevant and verified opportunities.', icon: HeartHandshake },
  { title: 'Long-term association', desc: 'Build a lasting relationship with a growing hiring ecosystem.', icon: TrendingUp },
]

export default function WhyAssociate() {
  return (
    <section className="associate-section bg-white">
      <Container>
        <AssociateSectionHeading
          title="Why partner with Mzobs"
          description="Mzobs helps placement companies expand their reach and connect the right candidates with the right employers."
        />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ title, desc, icon }, index) => (
            <AssociateCard key={title} title={title} description={desc} icon={icon} delay={index * 0.06} />
          ))}
        </ul>
      </Container>
    </section>
  )
}
