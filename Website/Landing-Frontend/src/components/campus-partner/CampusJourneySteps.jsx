import { ClipboardCheck, Rocket, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

const STEPS = [
  { n: '01', icon: ClipboardCheck, title: 'Register Your Campus', desc: 'Submit your institution’s details through the partnership form.' },
  { n: '02', icon: ShieldCheck, title: 'Campus Verification', desc: 'Our team reviews your request and confirms the details.' },
  { n: '03', icon: Rocket, title: 'Activate Your Campus', desc: 'Your campus profile goes live inside the Mzobs ecosystem.' },
  { n: '04', icon: Users, title: 'Students Join Mzobs', desc: 'Your students create profiles and start discovering opportunities.' },
  { n: '05', icon: TrendingUp, title: 'Track Career Progress', desc: 'Follow your students’ readiness and opportunities over time.' },
]

export default function CampusJourneySteps() {
  return (
    <section className="relative bg-mz-bg py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-mz-ink sm:text-[36px]">From Campus to Career</h2>
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-mz-primary/0 via-mz-primary/30 to-mz-secondary/0 lg:block" aria-hidden="true" />
          <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-mz-primary/0 via-mz-primary/25 to-mz-secondary/0 lg:hidden" aria-hidden="true" />

          <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
              <Reveal as="li" key={n} delay={i * 0.08} className="relative flex gap-4 lg:flex-col lg:gap-0 lg:text-center">
                <span
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-mz-lift lg:mx-auto"
                  style={{ backgroundImage: 'var(--mz-gradient)' }}
                >
                  <Icon size={19} aria-hidden="true" />
                </span>
                <div className="lg:mt-5">
                  <span className="text-[12px] font-extrabold tracking-wide text-mz-primary-strong">{n}</span>
                  <h3 className="mt-0.5 text-[15.5px] font-bold text-mz-ink">{title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-mz-muted">{desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
