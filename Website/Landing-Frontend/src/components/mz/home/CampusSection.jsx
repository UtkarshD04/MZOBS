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
    <section id="campuses" aria-labelledby="campus-title" className="relative scroll-mt-20 overflow-hidden border-t border-mz-line bg-mz-bg py-10 lg:py-12">
      <Container>
        <h2 id="campus-title" className="text-[20px] font-bold tracking-[-0.015em] text-mz-ink sm:text-[22px]">
          From Campus to <span className="text-mz-primary">Career.</span>
        </h2>
        <p className="mt-1 text-[14px] text-mz-muted">Mzobs works with colleges to give students a direct route from the classroom to their first job.</p>

        <ul className="mt-6 grid gap-4 md:grid-cols-4">
          <Reveal
            as="li"
            className="flex flex-col items-center justify-center rounded-2xl p-5 text-center text-white"
            style={{ backgroundImage: 'var(--mz-gradient)' }}
          >
            <span className="text-[32px] font-extrabold leading-none tracking-[-0.02em]">100+</span>
            <span className="mt-1.5 text-[13px] font-semibold text-white/90">Campuses on Mzobs</span>
          </Reveal>

          {CARDS.map(({ icon: Icon, title, body, cta }, i) => (
            <Reveal
              as="li"
              key={title}
              delay={(i + 1) * 0.08}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-mz-line shadow-mz-card transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:shadow-mz-lift"
            >
              <span
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-125"
                style={{ backgroundImage: 'var(--mz-gradient)' }}
                aria-hidden="true"
              />
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundImage: 'var(--mz-gradient)' }}>
                <Icon size={19} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.015em] text-mz-ink">{title}</h3>
              <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-mz-muted">{body}</p>
              <Button to={cta.to} variant="secondary" size="sm" arrow className="mt-4 self-start">{cta.label}</Button>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
