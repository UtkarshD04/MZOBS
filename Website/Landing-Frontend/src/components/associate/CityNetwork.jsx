import { Container, Reveal } from '../mz/primitives'
import { HOT_CITIES_DATA } from '../../lib/content'
import { AssociateSectionHeading } from './associateUi'

// Real cities already tracked elsewhere on the site (HOT_CITIES_DATA).
const CITY_SLUGS = ['delhi-ncr', 'mumbai', 'bengaluru', 'chennai', 'hyderabad', 'pune', 'kolkata', 'lucknow']
const CITIES = CITY_SLUGS.map((slug) => HOT_CITIES_DATA.cities.find((c) => c.slug === slug)?.city).filter(Boolean)

export default function CityNetwork() {
  return (
    <section className="associate-section bg-white">
      <Container>
        <AssociateSectionHeading
          title="Opportunities across cities"
          description="Mzobs brings placement partners and employers together, city by city."
        />
        <ul className="flex flex-wrap gap-2.5">
          {CITIES.map((city, index) => (
            <Reveal as="li" key={city} delay={index * 0.035} className="associate-city-chip">{city}</Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
