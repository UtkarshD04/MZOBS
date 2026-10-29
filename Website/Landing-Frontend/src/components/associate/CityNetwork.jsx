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
<<<<<<< HEAD
        <AssociateSectionHeading
          title="Opportunities across cities"
          description="Mzobs brings placement partners and employers together, city by city."
        />
        <ul className="flex flex-wrap gap-2.5">
          {CITIES.map((city, index) => (
            <Reveal as="li" key={city} delay={index * 0.035} className="associate-city-chip">{city}</Reveal>
=======
        <h2 className="text-[#101828] text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.1] tracking-tight">Opportunities across cities</h2>
        <p className="mt-2 max-w-2xl text-[#475467] text-[16px] sm:text-[17px] font-normal leading-relaxed">
          Mzobs brings placement partners and employers together, city by city.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {CITIES.map((city) => (
            <li key={city} className="rounded-md border border-[#E6E8F0] bg-[#F8FAFC] px-4 py-2 text-[14px] font-semibold text-[#101828]">{city}</li>
>>>>>>> 505a7472e6e3593ddda92924986acbdc69c4c533
          ))}
        </ul>
      </Container>
    </section>
  )
}
