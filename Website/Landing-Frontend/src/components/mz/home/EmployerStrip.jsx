import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container } from '../primitives'

// Small, secondary employer prompt near the bottom of the candidate homepage.
export default function EmployerStrip() {
  return (
    <section aria-labelledby="employer-strip-title" className="border-t border-mz-line bg-mz-bg py-8">
      <Container>
        <div
          className="relative flex flex-col gap-4 overflow-hidden rounded-[18px] px-5 py-6 text-white shadow-mz-lift sm:flex-row sm:items-center sm:gap-6 sm:px-8"
          style={{ backgroundImage: 'linear-gradient(135deg, #0f2338 0%, #16324f 55%, #0b7a6d 130%)' }}
        >
          <span className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[#12A89D]/30 blur-2xl" aria-hidden="true" />
          <div className="relative">
            <h2 id="employer-strip-title" className="text-[18px] font-bold tracking-[-0.01em] text-white">Hiring for your team?</h2>
            <p className="mt-0.5 text-[14px] text-white/70">Post a requirement with Mzobs.</p>
          </div>
          <Link
            to="/employers"
            className="group relative inline-flex h-10 shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-white px-5 text-[14px] font-semibold text-[#0f2338] transition-colors hover:bg-[#E3F3FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:order-first sm:self-auto"
          >
            For employers
            <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
