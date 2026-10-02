import { ArrowRight } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

function scrollToForm(e) {
  e.preventDefault()
  document.getElementById('campus-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function CampusFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-mz-dark py-16 text-white lg:py-20">
      <div className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full bg-mz-primary/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-mz-accent/20 blur-3xl" aria-hidden="true" />

      <Container className="relative text-center">
        <Reveal>
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em] sm:text-[34px]">Your Students Deserve More Than a Placement Drive.</h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">
            Build a continuous pathway from skills and preparation to real career opportunities with Mzobs.
          </p>
          <a
            href="#campus-form"
            onClick={scrollToForm}
            className="group mt-7 inline-flex h-[50px] items-center gap-2 rounded-full px-6 text-[15px] font-bold text-white shadow-mz-cta transition-transform duration-200 hover:-translate-y-0.5"
            style={{ backgroundImage: 'var(--mz-gradient)' }}
          >
            Partner With Mzobs
            <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </Reveal>
      </Container>
    </section>
  )
}
