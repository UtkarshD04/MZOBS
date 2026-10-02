import { Award, BarChart3, BookOpenCheck, Briefcase, Building2, Handshake, Target, UserPlus } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

// `span` sets the card's width on tablet/desktop only — mobile always
// stacks at full width. Mixed spans are what give the grid its "Bento" feel.
const CARDS = [
  { icon: Building2, title: 'Dedicated Campus Profile', desc: 'Give your institution a professional presence within the Mzobs ecosystem.', span: 2, tone: 'primary' },
  { icon: UserPlus, title: 'Student Onboarding', desc: 'Make it easier for students to discover and use Mzobs.', span: 1, tone: 'accent' },
  { icon: Briefcase, title: 'Placement Opportunities', desc: 'Expose students to relevant hiring opportunities.', span: 1, tone: 'primary' },
  { icon: Target, title: 'Career Readiness Tools', desc: 'Help students prepare before they enter the recruitment process.', span: 1, tone: 'accent' },
  { icon: BookOpenCheck, title: 'Learn & Test', desc: 'Enable students to build and validate relevant skills.', span: 1, tone: 'primary' },
  { icon: Handshake, title: 'Employer Connections', desc: 'Create stronger connections between students, campuses and employers.', span: 2, tone: 'accent' },
  { icon: BarChart3, title: 'Placement Insights', desc: 'Provide useful visibility into student career engagement and readiness.', span: 2, tone: 'primary' },
  { icon: Award, title: 'Campus Recognition', desc: 'Highlight participating institutions within the Mzobs network.', span: 2, tone: 'accent' },
]

const TONE = {
  primary: 'bg-mz-primary-tint text-mz-primary-strong',
  accent: 'bg-mz-accent-tint text-mz-accent-ink',
}
const SPAN = { 1: '', 2: 'sm:col-span-2 lg:col-span-2' }

export default function CampusBento() {
  return (
    <section className="relative bg-white py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-mz-ink sm:text-[36px]">Everything Your Campus Needs to Strengthen Student Careers</h2>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ icon: Icon, title, desc, span, tone }, i) => (
            <Reveal as="li" key={title} delay={i * 0.05} className={SPAN[span]}>
              <div className="group flex h-full flex-col gap-3 rounded-[20px] border border-mz-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-mz-primary/30 hover:shadow-mz-card sm:p-6">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${TONE[tone]}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h3 className="text-[15.5px] font-bold text-mz-ink">{title}</h3>
                <p className="text-[13px] leading-relaxed text-mz-muted">{desc}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
