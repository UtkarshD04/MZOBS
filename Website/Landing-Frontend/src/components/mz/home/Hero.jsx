import { useReducedMotion } from 'framer-motion'
import { Container, Button } from '../primitives'
import SearchBar from './SearchBar'
import HeroVisual from './HeroVisual'

export default function Hero({ filters, onSearch }) {
  const reduce = useReducedMotion()
  const drift = (s, dir = '') => (reduce ? 'none' : `mzDrift ${s}s ease-in-out infinite ${dir}`)
  return (
    <section id="job-search" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-mz-bg pb-16 pt-[108px] sm:pt-[128px] lg:pb-24 lg:pt-[140px]">
      {/* ambient light: three faint washes and a whisper of grain, no grid */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-56 -top-24 h-[520px] w-[520px] rounded-full bg-mz-secondary/10 blur-[130px]" style={{ animation: drift(24) }} />
        <div className="absolute right-[-8%] top-10 h-[560px] w-[560px] rounded-full bg-[#5b8def]/10 blur-[140px]" style={{ animation: drift(28, 'reverse') }} />
        <div className="absolute bottom-[-20%] left-[35%] h-[420px] w-[420px] rounded-full bg-mz-accent/8 blur-[130px]" style={{ animation: drift(32) }} />
        <div className="mz-grain absolute inset-0" />
      </div>

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-8 xl:gap-14">
          <div>
            <p className="mz-rise flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-mz-muted sm:text-[12px] sm:tracking-[0.16em]">
              <span className="h-px w-6" style={{ backgroundImage: 'var(--mz-gradient)' }} aria-hidden="true" />
              Talent &times; Opportunity &times; Smarter Hiring
            </p>

            <h1 id="hero-title" style={{ '--d': '0.05s' }} className="mz-rise mt-5 text-[clamp(28px,8.6vw,40px)] font-bold leading-[1.06] tracking-[-0.035em] text-mz-ink sm:text-[52px] lg:text-[54px] xl:text-[60px]">
              <span className="whitespace-nowrap">You Dream. We Connect.</span>
              <br />
              <span className="mz-text-gradient">You Grow.</span>
            </h1>

            <p style={{ '--d': '0.1s' }} className="mz-rise mt-5 max-w-[500px] text-[17px] leading-relaxed text-mz-muted sm:text-[18px]">
              Discover meaningful opportunities, connect with the right employers, and move forward with confidence.
            </p>

            <div style={{ '--d': '0.16s' }} className="mz-rise mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="quiet" arrow onClick={() => document.getElementById('latest-jobs')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Jobs
              </Button>
              <Button size="lg" variant="secondary" to="/employers/signup">
                Post a Job
              </Button>
            </div>

            <div style={{ '--d': '0.22s' }} className="mz-rise mt-10 max-w-[620px]">
              <SearchBar filters={filters} onSearch={onSearch} />
            </div>
          </div>

          <div style={{ '--d': '0.25s' }} className="mz-rise">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  )
}
