import { motion, useReducedMotion } from 'framer-motion'
import { Handshake, Send, Sparkles, UserPlus } from 'lucide-react'
import { Container, Reveal, SectionHead, Button } from '../primitives'

const STEPS = [
  { n: '01', icon: UserPlus, title: 'Create Profile', body: 'Sign up with your phone or Google, add your resume, skills and role preferences.' },
  { n: '02', icon: Sparkles, title: 'Discover Matches', body: 'Get job recommendations based on your skills, experience, location and role preference.' },
  { n: '03', icon: Send, title: 'Apply', body: 'Apply in a couple of taps with your Mzobs profile and track every application in one place.' },
  { n: '04', icon: Handshake, title: 'Get Hired', body: 'Hear back from employers, move through interviews and land the offer.' },
]

export default function HowItWorks() {
  const reduce = useReducedMotion()
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative overflow-hidden bg-mz-bg py-20 lg:py-28">
      <Container>
        <SectionHead id="how-title" eyebrow="How Mzobs works" title="From profile to offer in four steps.">
          One journey, no guesswork &mdash; each step brings you closer to the right role.
        </SectionHead>

        <ol className="relative mt-14 grid gap-5 lg:grid-cols-4">
          {/* desktop: a line that draws across the cards; mobile: a vertical rail */}
          <motion.span
            className="absolute left-[27px] top-4 bottom-4 w-px origin-top bg-gradient-to-b from-mz-primary via-mz-secondary to-mz-accent lg:hidden"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />
          <motion.span
            className="absolute left-[12%] right-[12%] top-[27px] hidden h-px origin-left bg-gradient-to-r from-mz-primary via-mz-secondary to-mz-accent lg:block"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />
          {STEPS.map(({ n, icon: Icon, title, body }, i) => (
            <Reveal as="li" key={n} delay={i * 0.09} className="relative flex gap-4 lg:block">
              <span className="relative z-10 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl bg-white text-mz-primary-strong shadow-mz-card ring-1 ring-mz-line lg:mx-auto">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1 rounded-3xl bg-white p-6 ring-1 ring-mz-line shadow-mz-card transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:shadow-mz-lift lg:mt-5">
                <p className="text-[13px] font-bold tracking-wider text-mz-primary">{n}</p>
                <h3 className="mt-1.5 text-[19px] font-semibold tracking-[-0.015em] text-mz-ink">{title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-mz-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10 flex justify-center">
          <Button to="/employees/signup" size="lg" arrow>Create your profile</Button>
        </Reveal>
      </Container>
    </section>
  )
}
