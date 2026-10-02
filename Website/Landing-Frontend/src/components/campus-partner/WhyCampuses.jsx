import { Brain, Handshake, MessageSquareText, ShieldCheck, Target, BookOpenCheck } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

const FEATURES = [
  { icon: ShieldCheck, title: 'Verified Opportunities', desc: 'Help students discover verified jobs and career opportunities.', tone: 'accent' },
  { icon: Brain, title: 'AI-Powered Job Matching', desc: 'Match students with opportunities based on their skills, interests and profiles.', tone: 'primary' },
  { icon: Target, title: 'Career Readiness', desc: 'Help students identify skill gaps and prepare for the roles they want.', tone: 'primary' },
  { icon: MessageSquareText, title: 'Interview Preparation', desc: 'Give students access to mock interviews and interview preparation resources.', tone: 'accent' },
  { icon: BookOpenCheck, title: 'Learn & Test', desc: 'Provide structured learning and assessments based on individual student needs.', tone: 'primary' },
  { icon: Handshake, title: 'Industry Connections', desc: 'Connect students and institutions with relevant employers and hiring opportunities.', tone: 'accent' },
]

const TONE = {
  primary: 'bg-mz-primary-tint text-mz-primary-strong',
  accent: 'bg-mz-accent-tint text-mz-accent-ink',
}

export default function WhyCampuses() {
  return (
    <section id="campus-benefits" className="scroll-mt-20 bg-white py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-mz-ink sm:text-[36px]">More Opportunities. Better Prepared Students.</h2>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc, tone }, i) => (
            <Reveal as="li" key={title} delay={i * 0.06}>
              <div className="group h-full rounded-[20px] border border-mz-line bg-white p-6 transition-colors duration-200 hover:border-mz-primary/40">
                <span className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${TONE[tone]} transition-transform duration-200 group-hover:-translate-y-0.5`}>
                  <Icon size={19} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[16px] font-bold text-mz-ink">{title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-mz-muted">{desc}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
