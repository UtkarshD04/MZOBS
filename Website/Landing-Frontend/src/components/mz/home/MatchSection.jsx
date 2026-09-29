import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { Container, Reveal, SectionHead, Button } from '../primitives'

const SKILLS = ['Python', 'React', 'SQL', 'AWS']
const BARS = [
  { label: 'Skills', value: 96 },
  { label: 'Experience', value: 92 },
  { label: 'Location', value: 100 },
  { label: 'Role preference', value: 88 },
]

// Match ring + factor bars + reasons — fills once when scrolled into view.
// It is a worked example of how a match is explained, and is labelled as one.
function MatchPanel() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const on = inView || reduce
  const r = 54
  const c = 2 * Math.PI * r

  return (
    <div ref={ref} className="relative">
      <div className="absolute -inset-4 rounded-[36px] bg-[radial-gradient(closest-side,rgba(124,108,255,0.22),transparent)]" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[28px] bg-white p-6 ring-1 ring-mz-line shadow-mz-float sm:p-8">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-mz-muted">Example match</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-mz-accent-tint px-2 py-0.5 text-[11px] font-semibold text-mz-accent-ink"><Sparkles size={12} aria-hidden="true" /> Top match</span>
        </div>

        <div className="mt-5 flex items-center gap-5">
          <div className="relative shrink-0">
            <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label="94 percent match">
              <defs>
                <linearGradient id="mzMatch" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#5b5fef" />
                  <stop offset="1" stopColor="#20c997" />
                </linearGradient>
              </defs>
              <circle cx="66" cy="66" r={r} fill="none" stroke="#eceef6" strokeWidth="11" />
              <circle
                cx="66" cy="66" r={r} fill="none" stroke="url(#mzMatch)" strokeWidth="11" strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={on ? c * 0.06 : c} transform="rotate(-90 66 66)"
                style={{ transition: reduce ? 'none' : 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[34px] font-extrabold leading-none tracking-tight text-mz-ink">94%</span>
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-mz-muted">Match</span>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-mz-muted">Candidate</p>
            <p className="text-[18px] font-semibold tracking-tight text-mz-ink">Software Engineer</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {SKILLS.map((s) => (
                <span key={s} className="rounded-md bg-mz-primary-tint px-2 py-0.5 text-[12px] font-medium text-mz-primary-strong">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 space-y-3.5">
          {BARS.map((b, i) => (
            <div key={b.label}>
              <div className="mb-1.5 flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-1.5 font-medium text-mz-ink-2">
                  <motion.span
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-mz-accent text-white"
                    initial={reduce ? false : { scale: 0 }}
                    animate={{ scale: on ? 1 : 0 }}
                    transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 420, damping: 18 }}
                  >
                    <Check size={10} strokeWidth={3.2} aria-hidden="true" />
                  </motion.span>
                  {b.label}
                </span>
                <span className="font-semibold text-mz-ink">{b.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-mz-bg">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: on ? `${b.value}%` : '0%',
                    backgroundImage: 'var(--mz-gradient)',
                    transition: reduce ? 'none' : `width 1.1s cubic-bezier(0.22,1,0.36,1) ${0.3 + i * 0.12}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MatchSection() {
  return (
    <section id="matching" aria-labelledby="match-title" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <SectionHead id="match-title" eyebrow="Intelligent matching" title={<>Stop Searching. <span className="mz-text-gradient">Start Matching.</span></>}>
              Instead of scrolling an endless list, Mzobs compares your skills, experience, location and role preference with each opening &mdash; and tells you why it fits.
            </SectionHead>
            <Reveal as="ul" className="mt-7 space-y-3.5">
              {[
                'A match score for every role, with the reasons behind it',
                'Recommendations that improve as your profile does',
                'Employers see candidates ranked by fit, not by who applied first',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15.5px] text-mz-ink-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mz-primary-tint text-mz-primary-strong">
                    <Sparkles size={11} aria-hidden="true" />
                  </span>
                  {t}
                </li>
              ))}
            </Reveal>
            <Reveal className="mt-8 flex flex-wrap gap-3">
              <Button to="/employees/signup" size="lg" arrow>Get my matches</Button>
              <Button href="#latest-jobs" variant="secondary" size="lg">Browse jobs</Button>
            </Reveal>
          </div>

          <Reveal><MatchPanel /></Reveal>
        </div>
      </Container>
    </section>
  )
}
