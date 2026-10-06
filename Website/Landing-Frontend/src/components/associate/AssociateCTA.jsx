import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'
import { CONTACT_EMAIL } from '../../lib/config'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

export default function AssociateCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#101828] via-[#17213a] to-[#1e2a5e] py-16 text-white lg:py-24">
      <div className="assoc-blob assoc-drift -left-20 top-0 h-[320px] w-[320px] bg-[#0b7a6d]/35" aria-hidden="true" />
      <div className="assoc-blob assoc-drift right-0 bottom-0 h-[300px] w-[300px] bg-[#0b7a6d]/30" aria-hidden="true" style={{ animationDelay: '2.5s' }} />
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="assoc-particle absolute h-1.5 w-1.5 rounded-full bg-white/40"
          style={{ left: `${10 + i * 15}%`, bottom: '10%', animationDelay: `${i * 0.9}s` }}
          aria-hidden="true"
        />
      ))}

      <Container className="relative text-center">
        <Reveal>
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em] sm:text-[38px]">Ready to grow with Mzobs?</h2>
          <p className="mx-auto mt-3 max-w-lg text-[15.5px] leading-relaxed text-white/70">
            Bring your network into a wider ecosystem of candidates, employers and opportunities.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to={CLIENT_ONLY_ROUTES.associateApply}
              className="group inline-flex h-[50px] items-center gap-2 rounded-full bg-gradient-to-r from-[#0b7a6d] to-[#0b7a6d] px-6 text-[15px] font-bold text-white shadow-[0_16px_34px_-10px_rgba(11, 122, 109,0.6)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Become an Associate
              <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex h-[50px] items-center rounded-full border border-white/25 px-6 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
            >
              Contact Mzobs
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
