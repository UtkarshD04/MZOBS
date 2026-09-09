import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { ShieldCheck, MapPin, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react'
import FloatingElement from '../../ui/FloatingElement'
import ExplorerButton from '../../ui/ExplorerButton'
import { HERO_OPPORTUNITY_DATA as DATA } from '../../../lib/content'

const EASE = [0.16, 1, 0.3, 1]

// The hero's right-side visual: the third step of "search → verified job →
// apply" — one real MZOBS listing, verification folded into the card's own
// copy ("Employer verified") rather than a separate pill or a floating
// match-score badge bolted onto its corner. Purely illustrative — aria-
// hidden, no focusable content — the real "Apply" action lives in the
// search module on the left.
//
// Motion budget, restrained on purpose: the card fades/slides in once, then
// drifts 3–5px vertically over several seconds (FloatingElement, self-
// disabling under reduced motion); a soft diagonal "verification sweep"
// crosses it once when it enters the viewport, standing in for the pulse
// this card no longer carries; and it tilts at most a few px with the
// cursor. Everything here is skipped under reduced motion, not just slowed.
export default function HeroOpportunityCard() {
  const reduceMotion = useReducedMotion()

  const wrapRef = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springCfg = { stiffness: 120, damping: 22, mass: 0.6 }
  const parallaxX = useSpring(useTransform(mx, [-1, 1], [-5, 5]), springCfg)
  const parallaxY = useSpring(useTransform(my, [-1, 1], [-4, 4]), springCfg)

  function handleMouseMove(e) {
    if (reduceMotion) return
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1)
  }

  function handleMouseLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <div ref={wrapRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="flex flex-col items-start gap-3">
      {/* Same label treatment as "Popular searches" on the left, so the
          two columns read as one composition — this names step 3 of
          search → verified job → apply, it doesn't decorate it. */}
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        className="text-[11.5px] font-bold uppercase tracking-wide text-(--explorer-muted)"
      >
        Verified job opportunity
      </motion.p>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        style={{ x: parallaxX, y: parallaxY }}
        className="w-full max-w-[400px]"
      >
        <FloatingElement duration={7} distance={4.5} rotate={false}>
          <div className="relative overflow-hidden rounded-2xl bg-white border border-(--explorer-border) shadow-[0_10px_28px_-14px_rgba(16,50,79,0.2)] p-5 sm:p-6">
            {/* Verification sweep — a single soft diagonal band crossing the
                card once it's on screen, standing in for the badge pulse
                this layout no longer has. Disabled under reduced motion. */}
            {!reduceMotion && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                initial={{ left: '-45%', opacity: 0 }}
                whileInView={{ left: '130%', opacity: [0, 1, 1, 0] }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ left: { duration: 1.1, delay: 1, ease: EASE }, opacity: { duration: 1.1, delay: 1, times: [0, 0.2, 0.8, 1] } }}
              />
            )}

            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-(--explorer-teal-hover)">
                <ShieldCheck size={14} strokeWidth={2.4} className="text-(--explorer-teal) shrink-0" aria-hidden="true" /> {DATA.badge}
              </span>
              <span className="text-[11px] text-(--explorer-muted) shrink-0">{DATA.postedLabel}</span>
            </div>

            <p className="mt-3 text-[20px] sm:text-[22px] font-extrabold text-(--explorer-navy) leading-tight">{DATA.title}</p>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-(--explorer-muted)">
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} className="shrink-0" aria-hidden="true" /> {DATA.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Briefcase size={13} className="shrink-0" aria-hidden="true" /> {DATA.employmentType}
              </span>
            </div>

            <p className="mt-2.5 text-[17px] font-bold text-(--explorer-navy)">{DATA.salary}</p>

            <div className="mt-4 pt-4 border-t border-(--explorer-border)">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-(--explorer-muted)">Skills</p>
              <p className="mt-1.5 text-[13px] font-semibold text-(--explorer-navy)">{DATA.skills.join(' · ')}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-(--explorer-border) flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-(--explorer-muted)">
                <CheckCircle2 size={14} className="text-(--explorer-teal) shrink-0" aria-hidden="true" /> {DATA.reviewedLabel}
              </span>

              <ExplorerButton size="sm" className="group/apply shrink-0">
                {DATA.cta}
                <ArrowRight
                  size={13}
                  aria-hidden="true"
                  className="shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/apply:translate-x-[3px]"
                />
              </ExplorerButton>
            </div>
          </div>
        </FloatingElement>
      </motion.div>
    </div>
  )
}
