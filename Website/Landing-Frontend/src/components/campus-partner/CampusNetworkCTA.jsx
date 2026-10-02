import { Sparkles } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

function scrollToForm(e) {
  e.preventDefault()
  document.getElementById('campus-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// No campus partnerships are live yet, so this is a genuine empty state —
// not a placeholder for invented numbers. Once real campuses join, this
// section can be swapped for their verified logos/cards.
export default function CampusNetworkCTA() {
  return (
    <section className="relative bg-white py-16 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-xl rounded-[28px] border border-dashed border-mz-line-strong bg-mz-bg px-8 py-12 text-center sm:py-14">
          <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-mz-ink sm:text-[28px]">Join the Growing Mzobs Campus Network</h2>

          <span className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ backgroundImage: 'var(--mz-gradient)' }}>
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <p className="mt-4 text-[17px] font-bold text-mz-ink">Your campus could be next.</p>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-mz-muted">
            Be among the institutions building stronger pathways from education to employment.
          </p>

          <a
            href="#campus-form"
            onClick={scrollToForm}
            className="mt-6 inline-flex h-11 items-center rounded-full px-6 text-[14px] font-bold text-white shadow-mz-cta transition-transform duration-200 hover:-translate-y-0.5"
            style={{ backgroundImage: 'var(--mz-gradient)' }}
          >
            Add Your Campus
          </a>
        </Reveal>
      </Container>
    </section>
  )
}
