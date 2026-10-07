import { Container } from '../mz/primitives'

const CARDS = [
  { title: 'Access more opportunities', desc: 'Find relevant openings from employers across industries.' },
  { title: 'Expand your reach', desc: 'Connect your candidates with opportunities beyond your local network.' },
  { title: 'Candidate-first network', desc: 'Help candidates discover relevant and verified opportunities.' },
  { title: 'Long-term association', desc: 'Build a lasting relationship with a growing hiring ecosystem.' },
]

export default function WhyAssociate() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <h2 className="text-[26px] font-extrabold text-[#101828] sm:text-[32px]">Why partner with Mzobs</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#475467]">
          Mzobs helps placement companies expand their reach and connect the right candidates with the right employers.
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ title, desc }) => (
            <li key={title} className="rounded-lg border border-[#E6E8F0] p-5">
              <h3 className="text-[15.5px] font-bold text-[#101828]">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#475467]">{desc}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
