import { Briefcase, Building2, GraduationCap, MapPin, ShieldCheck } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

const TYPES = [
  { icon: Briefcase, title: 'Placement Consultants' },
  { icon: Building2, title: 'Recruitment Agencies' },
  { icon: MapPin, title: 'Local Hiring Partners' },
  { icon: GraduationCap, title: 'Career & Placement Organizations' },
]

export default function PartnerFit() {
  return (
    <section className="relative bg-white py-16 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#101828] sm:text-[36px]">Are you the right fit?</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#475467]">
              We&rsquo;re looking to work with genuine organizations that care about connecting people with meaningful job opportunities.
            </p>
            <div className="mt-6 inline-flex items-center gap-2.5 rounded-2xl bg-[#E6F6F3] px-4 py-3">
              <ShieldCheck size={18} className="shrink-0 text-[#0F8F83]" aria-hidden="true" />
              <span className="text-[13px] font-bold text-[#0F8F83]">Every associate request is reviewed before onboarding</span>
            </div>
          </Reveal>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TYPES.map(({ icon: Icon, title }, i) => (
              <Reveal as="li" key={title} delay={i * 0.08}>
                <div className="group flex h-full flex-col gap-3 rounded-[18px] border border-[#E6E8F0] bg-[#F8FAFC] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#2563EB]/40 hover:bg-white hover:shadow-[0_20px_40px_-20px_rgba(37,99,235,0.25)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#EEF2FF] text-[#2563EB] transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-[#2563EB] group-hover:to-[#4F46E5] group-hover:text-white">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="text-[14.5px] font-bold leading-snug text-[#101828]">{title}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
