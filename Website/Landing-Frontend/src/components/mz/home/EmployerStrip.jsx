import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container } from '../primitives'

// Small, secondary employer prompt near the bottom of the candidate homepage.
export default function EmployerStrip() {
  return (
    <section aria-labelledby="employer-strip-title" className="border-t border-mz-line bg-mz-bg py-8">
      <Container>
        <div className="flex flex-col gap-4 rounded-[12px] border border-mz-line bg-white px-5 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
          <div>
            <h2 id="employer-strip-title" className="text-[16px] font-semibold text-mz-ink">Hiring for your team?</h2>
            <p className="mt-0.5 text-[14px] text-mz-muted">Post a requirement with MZOBS.</p>
          </div>
          <Link
            to="/employers"
            className="mz-btn-teal group inline-flex h-10 shrink-0 items-center justify-center gap-1.5 self-start rounded-[10px] bg-mz-primary px-4 text-[14px] font-semibold text-white transition-colors hover:bg-mz-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary sm:order-first sm:self-auto"
          >
            For employers
            <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
