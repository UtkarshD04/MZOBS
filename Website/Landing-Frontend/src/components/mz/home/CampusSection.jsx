import { motion, useReducedMotion } from 'framer-motion'
import { Briefcase, Building, CalendarCheck, GraduationCap, Rocket, Sparkles, UserRound, Megaphone } from 'lucide-react'
import { Container, Reveal, SectionHead, Button } from '../primitives'

const JOURNEY = [
  { label: 'Campus', icon: GraduationCap },
  { label: 'Profile', icon: UserRound },
  { label: 'Matching', icon: Sparkles },
  { label: 'Opportunity', icon: Briefcase },
  { label: 'Interview', icon: CalendarCheck },
  { label: 'Career', icon: Rocket },
]

// Who takes part in the campus network, and what each gets — deliberately
// no counts here: the number of partner campuses isn't tracked in the
// database yet, so none is shown.
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
  const reduce = useReducedMotion()
  return (
    <section id="campuses" aria-labelledby="campus-title" className="relative overflow-hidden bg-mz-bg py-20 lg:py-28">
      <Container>
        <SectionHead id="campus-title" eyebrow="Campus network" title={<>From Campus to <span className="mz-text-gradient">Career.</span></>} align="center">
          Mzobs works with colleges to give students a direct route from the classroom to their first job.
        </SectionHead>

        {/* Journey rail: horizontal from md up, a 2×3 grid on phones */}
        <Reveal className="relative mx-auto mt-12 max-w-4xl">
          <motion.span
            className="absolute left-[8%] right-[8%] top-7 hidden h-px origin-left bg-gradient-to-r from-mz-primary via-mz-secondary to-mz-accent md:block"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />
          <ol className="relative grid grid-cols-3 gap-y-8 md:grid-cols-6">
            {JOURNEY.map(({ label, icon: Icon }, i) => (
              <li key={label} className="flex flex-col items-center text-center">
                <motion.span
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-mz-primary-strong shadow-mz-card ring-1 ring-mz-line"
                  initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Icon size={22} aria-hidden="true" />
                </motion.span>
                <span className="mt-3 text-[13.5px] font-semibold text-mz-ink">{label}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, body, cta }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08} className="flex flex-col rounded-3xl bg-white p-7 ring-1 ring-mz-line shadow-mz-card transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:shadow-mz-lift">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ backgroundImage: 'var(--mz-gradient)' }}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.015em] text-mz-ink">{title}</h3>
              <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-mz-muted">{body}</p>
              <Button to={cta.to} variant="secondary" size="sm" arrow className="mt-6 self-start">{cta.label}</Button>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
