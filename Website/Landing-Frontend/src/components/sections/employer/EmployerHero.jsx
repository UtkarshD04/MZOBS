import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FadeInLoad } from './employerMotion'
import ExplorerButton from '../../ui/ExplorerButton'

// Small text-based capability labels under the hero CTA — not cards, not a
// dashboard, just a quiet pointer to the four things an employer can do.
const CAPABILITIES = [
  { label: 'Post Jobs', to: '/employers/signup' },
  { label: 'Find Talent', to: '/employers#discover-talent' },
  { label: 'Manage Applications', to: '/employers/signin' },
  { label: 'Schedule Interviews', to: '/employers/signin' },
]

// Abstract "talent meets opportunity" brand form — layered translucent
// organic shapes in the Mzobs indigo/violet/blue/mint range. No literal
// icons, cards or UI — a brand visual, not a product screenshot.
function AbstractBrandForm() {
  const reduceMotion = useReducedMotion()
  const float = (amplitude, duration, delay = 0) =>
    reduceMotion
      ? {}
      : {
          animate: { y: [0, -amplitude, 0], rotate: [0, 1.2, 0] },
          transition: { duration, delay, repeat: Infinity, ease: 'easeInOut' },
        }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-(--color-violet)/12 blur-[90px]"
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-[8%]"
        style={{
          borderRadius: '42% 58% 65% 35% / 48% 42% 58% 52%',
          background: 'linear-gradient(135deg, var(--color-violet) 0%, var(--explorer-blue) 100%)',
          opacity: 0.85,
          filter: 'blur(0.5px)',
        }}
        {...float(14, 9)}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-[18%]"
        style={{
          borderRadius: '58% 42% 38% 62% / 40% 55% 45% 60%',
          background: 'linear-gradient(140deg, var(--explorer-blue) 0%, var(--explorer-teal) 100%)',
          opacity: 0.55,
          mixBlendMode: 'multiply',
        }}
        {...float(10, 11, 0.6)}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-[30%]"
        style={{
          borderRadius: '50% 50% 42% 58% / 55% 45% 55% 45%',
          background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%)',
        }}
        {...float(8, 8, 0.3)}
      />
    </div>
  )
}

export default function EmployerHero() {
  return (
    <section id="home" className="relative overflow-hidden bg-(--explorer-bg) px-6 md:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-(image:--hero-cta-gradient)" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/4 left-0 h-[320px] w-[320px] rounded-full bg-(--color-violet)/5 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-1/4 h-[260px] w-[260px] rounded-full bg-(--explorer-teal)/6 blur-[130px]" />

      <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center pt-28 pb-16 md:pt-36 md:pb-16">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <FadeInLoad delay={0.05}>
              <span className="inline-flex items-center rounded-full bg-(--explorer-blue-surface) border border-(--explorer-blue-border) px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-(--explorer-blue)">
                Mzobs for Employers
              </span>
            </FadeInLoad>

            <FadeInLoad delay={0.12}>
              <h1 className="mt-6 max-w-lg text-[36px] font-extrabold leading-[1.06] tracking-tight text-(--explorer-navy) sm:text-[46px] lg:text-[54px]">
                Build Your Team
                <br />
                With the{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, var(--color-violet), var(--explorer-blue))' }}
                >
                  Right Talent.
                </span>
              </h1>
            </FadeInLoad>

            <FadeInLoad delay={0.2}>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-(--explorer-muted) sm:text-[16.5px]">
                Post jobs, discover relevant talent, and manage your hiring journey, all in one place.
              </p>
            </FadeInLoad>

            <FadeInLoad delay={0.28}>
              <div className="mt-9 flex flex-wrap items-center gap-3.5">
                <ExplorerButton to="/employers/signup" size="lg">
                  Post a Job →
                </ExplorerButton>
                <ExplorerButton to="/employers#discover-talent" variant="secondary" size="lg">
                  Find Candidates
                </ExplorerButton>
              </div>
            </FadeInLoad>

            <FadeInLoad delay={0.34}>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                {CAPABILITIES.map((c, i) => (
                  <span key={c.label} className="flex items-center gap-5">
                    <Link
                      to={c.to}
                      className="text-[12.5px] font-semibold text-(--explorer-muted) hover:text-(--explorer-blue) transition-colors"
                    >
                      {c.label}
                    </Link>
                    {i < CAPABILITIES.length - 1 && <span className="h-1 w-1 rounded-full bg-(--explorer-border)" aria-hidden="true" />}
                  </span>
                ))}
              </div>
            </FadeInLoad>
          </div>

          <FadeInLoad delay={0.3}>
            <AbstractBrandForm />
          </FadeInLoad>
        </div>
      </div>
    </section>
  )
}
