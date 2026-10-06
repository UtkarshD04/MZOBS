import { Rocket, Search, TrendingUp, Users } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

const CARDS = [
  { n: '01', icon: Search, title: 'Access More Opportunities', desc: 'Find relevant openings from employers across industries.', tone: 'from-[#2563EB] to-[#4F46E5]' },
  { n: '02', icon: Rocket, title: 'Expand Your Reach', desc: 'Connect your candidates with opportunities beyond your local network.', tone: 'from-[#4F46E5] to-[#6366F1]' },
  { n: '03', icon: Users, title: 'Candidate-First Network', desc: 'Help candidates discover relevant and verified opportunities.', tone: 'from-[#0F8F83] to-[#2563EB]' },
  { n: '04', icon: TrendingUp, title: 'Grow With Mzobs', desc: 'Build a long-term association with a growing hiring ecosystem.', tone: 'from-[#2563EB] to-[#0F8F83]' },
]

export default function WhyAssociate() {
  return (
    <section className="relative bg-[#F8FAFC] py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#101828] sm:text-[36px]">
            More than a partnership.
            <br />
            It&rsquo;s a bigger opportunity network.
          </h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-[#475467]">
            Mzobs helps placement companies expand their reach, discover opportunities and connect the right candidates with the right employers.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ n, icon: Icon, title, desc, tone }, i) => (
            <Reveal as="li" key={n} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-[22px] border border-[#E6E8F0] bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_28px_56px_-20px_rgba(37,99,235,0.28)]">
                <span className="pointer-events-none absolute -right-4 -top-6 text-[64px] font-extrabold leading-none text-[#101828]/[0.045] transition-colors duration-300 group-hover:text-[#2563EB]/[0.08]">
                  {n}
                </span>
                <span className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-[12px] bg-gradient-to-br ${tone} text-white shadow-[0_10px_20px_-8px_rgba(37,99,235,0.45)]`}>
                  <Icon size={19} aria-hidden="true" />
                </span>
                <h3 className="relative z-10 mt-5 text-[16.5px] font-bold text-[#101828]">{title}</h3>
                <p className="relative z-10 mt-2 text-[13.5px] leading-relaxed text-[#475467]">{desc}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
