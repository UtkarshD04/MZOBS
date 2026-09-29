import { Check, CalendarClock, Gauge, Search, Sparkles, Workflow, ListFilter, Layers, Clock3 } from 'lucide-react'
import { Container, Reveal, SectionHead } from '../primitives'
import AnimatedNumber from '../AnimatedNumber'
import { usePlatformStats } from '../../../lib/useHomeData'

function Tick() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mz-accent text-white">
      <Check size={12} strokeWidth={3} aria-hidden="true" />
    </span>
  )
}

function PillarCard({ icon: Icon, pillar, tag, children, stat, delay }) {
  return (
    <Reveal delay={delay} className="group relative flex flex-col rounded-3xl bg-white p-6 ring-1 ring-mz-line shadow-mz-card transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:shadow-mz-lift">
      <div className="flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mz-primary-tint text-mz-primary-strong transition-colors duration-300 group-hover:bg-mz-primary group-hover:text-white">
          <Icon size={22} aria-hidden="true" />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mz-accent-tint py-1 pl-1.5 pr-3 text-[12.5px] font-semibold text-mz-accent-ink">
          <Tick /> {tag}
        </span>
      </div>
      <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.015em] text-mz-ink">{pillar}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-mz-muted">{children}</p>
      {stat && (
        <p className="mt-5 border-t border-mz-line pt-4 text-[13.5px] text-mz-ink-2">
          <AnimatedNumber value={stat.value} className="text-[22px] font-bold tracking-tight text-mz-ink" /> <span className="ml-1">{stat.label}</span>
        </p>
      )}
    </Reveal>
  )
}

// "The usual way" → "With Mzobs", for the problems each pillar solves.
const SHIFTS = [
  { icon: ListFilter, from: 'Endless scrolling', to: 'Roles ranked by how well they fit your skills, experience and location.' },
  { icon: Layers, from: 'Scattered hiring', to: 'Matching, applications, interviews and offers in one pipeline.' },
  { icon: Clock3, from: 'Slow shortlisting', to: 'Employers start from candidates already ranked by fit for the role.' },
]

export default function SmarterHiringSection() {
  const { data } = usePlatformStats()
  // A stat only renders when the database returned a real number above zero.
  const liveJobs = data?.liveJobs > 0 ? { value: data.liveJobs, label: data.liveJobs === 1 ? 'job open right now' : 'jobs open right now' } : null

  return (
    <section id="smarter-hiring" aria-labelledby="smarter-title" className="relative bg-white py-20 lg:py-28">
      <Container>
        <SectionHead id="smarter-title" eyebrow="Why it works" title={<>Built for <span className="mz-text-gradient">Smarter Hiring.</span></>}>
          Mzobs puts the right people in front of the right roles &mdash; so candidates spend less time searching and employers spend less time sorting.
        </SectionHead>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <PillarCard delay={0} icon={Sparkles} pillar="Intelligent Matching" tag="AI-powered" stat={liveJobs}>
            Every role is compared with your skills, experience, location and preferences, and you see why it fits.
          </PillarCard>
          <PillarCard delay={0.07} icon={Search} pillar="Better Candidate Discovery" tag="Ranked by fit">
            Employers search a talent pool by skills and keywords &mdash; even the text inside resumes.
          </PillarCard>
          <PillarCard delay={0.14} icon={Gauge} pillar="Faster Hiring" tag="Less sorting">
            Shortlists start from the best-matched candidates, so the first conversations are the right ones.
          </PillarCard>
          <PillarCard delay={0.21} icon={Workflow} pillar="Simple Hiring Workflow" tag="One pipeline">
            Post a job, review applicants, schedule interviews and send offers from a single dashboard.
          </PillarCard>
        </div>

        <Reveal className="mt-8 overflow-hidden rounded-3xl bg-mz-bg ring-1 ring-mz-line">
          <div className="flex items-center gap-2.5 border-b border-mz-line px-6 py-4 text-[13px] font-semibold uppercase tracking-wider text-mz-muted">
            <CalendarClock size={16} aria-hidden="true" /> What changes with Mzobs
          </div>
          <ul className="grid divide-y divide-mz-line md:grid-cols-3 md:divide-x md:divide-y-0">
            {SHIFTS.map(({ icon: Icon, from, to }) => (
              <li key={from} className="p-6">
                <p className="flex items-center gap-2 text-[15px] font-semibold text-mz-ink">
                  <Icon size={17} className="text-mz-muted" aria-hidden="true" />
                  <span className="text-mz-muted line-through decoration-mz-muted/50">{from}</span>
                </p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-mz-ink-2">{to}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
