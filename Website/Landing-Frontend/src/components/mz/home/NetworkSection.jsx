import { useRef } from 'react'
import { User, Building2, Sparkles } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Container, Reveal, Eyebrow } from '../primitives'
import AnimatedNumber from '../AnimatedNumber'
import { usePlatformStats } from '../../../lib/useHomeData'

// Node layout in a 900x300 viewBox — kept in one place so the SVG connection
// lines and the HTML icon overlay (positioned by the same percentages) never
// drift apart. The whole graphic scales as one unit (container aspect ratio
// matches the viewBox ratio), so it only gets smaller on narrow screens,
// never distorted and never causing horizontal overflow.
const VB_W = 900
const VB_H = 300
const CENTER = { x: 450, y: 150 }
const CANDIDATE_NODES = [70, 150, 230].map((y) => ({ x: 90, y }))
const COMPANY_NODES = [70, 150, 230].map((y) => ({ x: 810, y }))
const pct = (v, total) => `${(v / total) * 100}%`

function ConnectionLines({ on }) {
  const curve = (from, to) => {
    const midX = (from.x + to.x) / 2
    return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`
  }
  const paths = [
    ...CANDIDATE_NODES.map((n, i) => ({ d: curve(n, CENTER), delay: i * 0.15 })),
    ...COMPANY_NODES.map((n, i) => ({ d: curve(CENTER, n), delay: 0.3 + i * 0.15 })),
  ]
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="mzNetLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5b5fef" stopOpacity="0.55" />
          <stop offset="1" stopColor="#20c997" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="mzNetGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#7c6cff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7c6cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={CENTER.x} cy={CENTER.y} r="90" fill="url(#mzNetGlow)" />
      {paths.map((p, i) => (
        <motion.path
          key={i}
          d={p.d}
          fill="none"
          stroke="url(#mzNetLine)"
          strokeWidth="1.75"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={on ? { pathLength: 1, opacity: [0, 1, 1, 0.4] } : {}}
          transition={{ duration: 1.8, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  )
}

function Node({ x, y, icon: Icon, tone, size = 'h-9 w-9 sm:h-12 sm:w-12 lg:h-14 lg:w-14', delay = 0, on, reduce }) {
  const tones = {
    primary: 'bg-mz-primary-tint text-mz-primary-strong ring-1 ring-mz-primary-ring',
    accent: 'bg-mz-accent-tint text-mz-accent-ink ring-1 ring-[rgba(32,201,151,0.28)]',
  }
  return (
    <motion.div
      className={`absolute flex ${size} -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-mz-card ${tones[tone]}`}
      style={{ left: pct(x, VB_W), top: pct(y, VB_H) }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={on ? { opacity: 1, scale: !reduce ? [1, 1.08, 1] : 1 } : {}}
      transition={
        on
          ? { opacity: { duration: 0.5, delay }, scale: reduce ? { duration: 0.5, delay } : { duration: 3, repeat: Infinity, delay: delay + 0.6, ease: 'easeInOut' } }
          : undefined
      }
    >
      <Icon className="h-[40%] w-[40%]" aria-hidden="true" />
    </motion.div>
  )
}

function NetworkGraphic() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const on = inView || reduce

  return (
    <div ref={ref} className="relative mx-auto mt-14 w-full max-w-3xl" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
      <ConnectionLines on={on} />

      {CANDIDATE_NODES.map((n, i) => (
        <Node key={`c-${i}`} {...n} icon={User} tone="primary" delay={0.1 + i * 0.12} on={on} reduce={reduce} />
      ))}
      {COMPANY_NODES.map((n, i) => (
        <Node key={`co-${i}`} {...n} icon={Building2} tone="accent" delay={0.35 + i * 0.12} on={on} reduce={reduce} />
      ))}

      {/* Mzobs — the central connection point */}
      <motion.div
        className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full text-white shadow-mz-lift sm:h-20 sm:w-20"
        style={{ left: pct(CENTER.x, VB_W), top: pct(CENTER.y, VB_H), backgroundImage: 'var(--mz-gradient)' }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={on ? { opacity: 1, scale: !reduce ? [1, 1.05, 1] : 1 } : {}}
        transition={on ? { opacity: { duration: 0.5 }, scale: reduce ? { duration: 0.5 } : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } } : undefined}
      >
        <Sparkles size={18} aria-hidden="true" />
        <span className="text-[10px] font-bold uppercase tracking-wide sm:text-[11px]">Mzobs</span>
      </motion.div>
    </div>
  )
}

export default function NetworkSection() {
  const { data } = usePlatformStats()
  const candidates = data?.verifiedCandidates > 0 ? data.verifiedCandidates : null
  const companies = data?.verifiedEmployers > 0 ? data.verifiedEmployers : null

  return (
    <section id="network" aria-labelledby="network-title" className="relative overflow-hidden bg-white mz-section">
      <Container>
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-mz-bg to-mz-primary-tint px-6 py-10 ring-1 ring-mz-line sm:px-10 sm:py-12 lg:px-16">
          {/* Ambient glow blobs — soft violet/blue, decorative only */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-mz-primary-tint blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-mz-accent-tint blur-3xl" aria-hidden="true" />

          <div className="relative">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="mx-auto">Our ecosystem</Eyebrow>
              <h2 id="network-title" className="mt-4 text-[30px] font-bold leading-[1.1] tracking-[-0.025em] text-balance text-mz-ink sm:text-[38px] lg:text-[44px]">
                A Growing Network. <span className="mz-text-gradient">Real Connections.</span>
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-mz-muted sm:text-[17px]">
                Bringing candidates and companies together through a trusted hiring ecosystem.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mx-auto mt-12 grid max-w-xl grid-cols-1 gap-10 text-center sm:max-w-none sm:grid-cols-2 sm:gap-6 sm:text-left">
              <div>
                {candidates != null ? (
                  <p className="text-[48px] font-extrabold leading-none tracking-tight text-mz-ink sm:text-[60px]">
                    <AnimatedNumber value={candidates} className="mz-text-gradient" />
                    <span className="mz-text-gradient">+</span>
                  </p>
                ) : (
                  <div className="mz-skeleton mx-auto h-[48px] w-40 rounded-2xl sm:mx-0 sm:h-[60px]" />
                )}
                <p className="mt-2 text-[14.5px] font-semibold text-mz-ink-2">Candidates Connected</p>
              </div>
              <div className="sm:border-l sm:border-mz-line sm:pl-10">
                {companies != null ? (
                  <p className="text-[48px] font-extrabold leading-none tracking-tight text-mz-ink sm:text-[60px]">
                    <AnimatedNumber value={companies} className="mz-text-gradient" />
                    <span className="mz-text-gradient">+</span>
                  </p>
                ) : (
                  <div className="mz-skeleton mx-auto h-[48px] w-40 rounded-2xl sm:mx-0 sm:h-[60px]" />
                )}
                <p className="mt-2 text-[14.5px] font-semibold text-mz-ink-2">Companies Associated</p>
              </div>
            </Reveal>

            <NetworkGraphic />

            <Reveal delay={0.15} className="mt-10 text-center">
              <p className="text-[13px] font-medium text-mz-muted">Growing together, every opportunity.</p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
