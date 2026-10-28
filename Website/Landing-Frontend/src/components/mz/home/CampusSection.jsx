import { Building, GraduationCap, Megaphone } from 'lucide-react'
import { Container, Reveal, Button } from '../primitives'

const CARDS = [
  {
    icon: Building,
    title: 'Placement cells',
    body: 'Bring your whole batch onto Mzobs and give students one place to discover employers hiring freshers.',
    cta: { label: 'Partner with us', to: '/contact' },
  },
  {
    icon: GraduationCap,
    title: 'Students & freshers',
    body: 'Build your profile before you graduate and discover fresher-friendly roles and internships.',
    cta: { label: 'Create your profile', to: '/employees/signup' },
  },
  {
    icon: Megaphone,
    title: 'Mzobs Ally',
    body: 'Represent Mzobs on your campus, help classmates get hired and build real-world experience of your own.',
    cta: { label: 'Become an Ally', to: '/ally' },
  },
]

export default function CampusSection() {
  return (
    <section id="campuses" aria-labelledby="campus-title" className="relative scroll-mt-20 border-t border-mz-line bg-mz-bg py-10 lg:py-12">
      <Container>
        <h2 id="campus-title" className="text-mz-ink text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.1] tracking-tight">
          For colleges and students
        </h2>
        <p className="mt-1 text-mz-muted text-[16px] sm:text-[17px] font-normal leading-relaxed">Mzobs works with colleges to give students a direct route from the classroom to their first job.</p>

        <ul className="mt-6 grid gap-3 md:grid-cols-4">
          <Reveal as="li" className="flex flex-col justify-center rounded-[8px] bg-mz-primary p-5 text-white">
            <span className="text-[40px] font-extrabold leading-none tracking-[-0.03em]">100+</span>
            <span className="mt-2 text-[14px] font-medium text-white/90">Campuses on Mzobs</span>
          </Reveal>

          {CARDS.map(({ icon: Icon, title, body, cta }, i) => (
            <Reveal as="li" key={title} delay={(i + 1) * 0.08} className="flex flex-col rounded-[8px] border border-mz-line bg-white p-5">
              <Icon size={20} className="text-mz-primary-strong" aria-hidden="true" />
              <h3 className="mt-3 text-[16px] font-semibold text-mz-ink">{title}</h3>
              <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-mz-muted">{body}</p>
              <Button to={cta.to} variant="secondary" size="sm" arrow className="mt-4 self-start">{cta.label}</Button>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
