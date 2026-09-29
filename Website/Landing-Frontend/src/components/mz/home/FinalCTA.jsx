import { useReducedMotion } from 'framer-motion'
import { Container, Reveal, Button } from '../primitives'

export default function FinalCTA() {
  const reduce = useReducedMotion()
  return (
    <section aria-labelledby="cta-title" className="bg-white px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="relative isolate mx-auto max-w-[1200px] overflow-hidden rounded-[32px] bg-mz-dark px-6 py-20 text-center sm:px-12 lg:py-24">
        <div className="mz-grid-bg-dark pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-mz-primary/40 blur-[100px]" style={{ animation: reduce ? 'none' : 'mzDrift 14s ease-in-out infinite' }} aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 -z-10 h-80 w-80 rounded-full bg-mz-accent/25 blur-[100px]" style={{ animation: reduce ? 'none' : 'mzDrift 18s ease-in-out infinite reverse' }} aria-hidden="true" />
        <Container className="max-w-3xl px-0">
          <Reveal>
            <h2 id="cta-title" className="text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-white text-balance sm:text-[48px]">
              Your Next Opportunity Starts Here.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">
              Join Mzobs as a candidate or an employer &mdash; and let smart matching bring the right people and roles together.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="#latest-jobs" size="lg" variant="light" arrow>Find Your Opportunity</Button>
              <Button to="/employers/signup" size="lg" variant="outlineDark">Start Hiring</Button>
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  )
}
