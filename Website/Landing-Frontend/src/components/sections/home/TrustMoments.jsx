import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useInView } from 'framer-motion'
import { HeartHandshake } from 'lucide-react'

// Replaces the old three-column TrustStrip with three soft, translucent
// floating panels — a smaller, calmer continuation of the Hero's bubble
// language, not a technical diagram. Nothing here is fabricated: "live
// openings" is the same real total Home.jsx already fetches for the hero,
// the other two are statements about how MZOBS actually operates.

const GLOW = {
  verified: 'radial-gradient(circle, rgba(36,107,90,0.16), rgba(63,190,119,0.10) 45%, transparent 72%)',
  live: 'radial-gradient(circle, rgba(37,99,235,0.14), rgba(124,92,232,0.11) 45%, transparent 72%)',
  support: 'radial-gradient(circle, rgba(236,97,163,0.14), rgba(237,137,54,0.10) 45%, transparent 72%)',
}

// A handful of small decorative bubbles continuing the Hero's visual
// language at a calmer scale — randomized once per mount so the field
// never reads as a repeating loop.
function useDecorBubbles(count, reduceMotion) {
  return useMemo(() => {
    const tones = ['rgba(36,107,90,0.16)', 'rgba(37,99,235,0.14)', 'rgba(124,92,232,0.13)', 'rgba(236,97,163,0.14)', 'rgba(237,137,54,0.12)']
    const sizes = [8, 14, 22, 35, 50]
    return Array.from({ length: count }, (_, i) => ({
      top: 6 + Math.random() * 88,
      left: 4 + Math.random() * 92,
      size: sizes[i % sizes.length],
      color: tones[i % tones.length],
      blur: Math.random() > 0.5 ? 1 : 0,
      dur: 10 + Math.random() * 10,
      delay: Math.random() * -12,
      axis: Math.random() > 0.5 ? 'y' : 'x',
      amp: (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 14),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, count])
}

// Fires once, the first time the number enters view — a real total only
// counts up once, never re-triggered on scroll-back.
function useCountUp(target, active, reduceMotion) {
  const [value, setValue] = useState(0)
  const done = useRef(false)
  useEffect(() => {
    if (!active || target == null || done.current) return
    done.current = true
    if (reduceMotion) {
      setValue(target)
      return
    }
    let raf
    const duration = 900
    const start = performance.now()
    function tick(now) {
      const p = Math.min(1, (now - start) / duration)
      setValue(Math.round((1 - (1 - p) ** 3) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, reduceMotion])
  return value
}

// Circle → shield outline → checkmark, drawn once in ~600ms the first time
// it scrolls into view, then still — never a looping check.
function VerifiedGlyph({ active, reduceMotion }) {
  const d = reduceMotion ? 0 : undefined
  return (
    <svg width="28" height="28" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <motion.circle
        cx="13" cy="13" r="12" fill="rgba(36,107,90,0.12)"
        initial={{ scale: 0, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: d ?? 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M13 4 L21 7 V13 C21 18 17.5 21 13 22.5 C8.5 21 5 18 5 13 V7 Z"
        stroke="#246B5A" strokeWidth="1.6" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: d ?? 0.3, delay: d ?? 0.15, ease: 'easeOut' }}
      />
      <motion.path
        d="M9.5 13 L12 15.5 L17 10"
        stroke="#246B5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: d ?? 0.25, delay: d ?? 0.4, ease: 'easeOut' }}
      />
    </svg>
  )
}

// The icon fades in, then one small dot drifts once around it and settles —
// a light, literal touch of "people, not tech" (see item on Real Application
// Support). No loop, no repeat.
function SupportGlyph({ active, reduceMotion }) {
  const orbit = reduceMotion
    ? { x: 0, y: 0, opacity: 1 }
    : { x: [0, 9, 0, -9, 0], y: [0, -9, -13, -9, 0], opacity: [0, 1, 1, 1, 1] }
  return (
    <span className="relative inline-flex items-center justify-center w-7 h-7">
      <motion.span
        initial={{ opacity: 0, scale: 0.7 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
      >
        <HeartHandshake size={18} className="text-[#D6497A]" strokeWidth={1.9} aria-hidden="true" />
      </motion.span>
      {active && (
        <motion.span
          className="absolute w-1.5 h-1.5 rounded-full bg-[#D6497A]"
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={orbit}
          transition={{ duration: reduceMotion ? 0 : 1.3, delay: 0.3, ease: 'easeInOut' }}
        />
      )}
    </span>
  )
}

const PANEL_ENTRANCE = {
  verified: { initial: { opacity: 0, scale: 0.92 }, inView: { opacity: 1, scale: 1 } },
  live: { initial: { opacity: 0, x: -18 }, inView: { opacity: 1, x: 0 } },
  support: { initial: { opacity: 0, x: 18 }, inView: { opacity: 1, x: 0 } },
}

function TrustPanel({ id, floatClass, wrapClass, glyph, title, children, big, reduceMotion, delay }) {
  const entrance = PANEL_ENTRANCE[id]
  return (
    <motion.div
      className={wrapClass}
      initial={reduceMotion ? { opacity: 0 } : entrance.initial}
      whileInView={reduceMotion ? { opacity: 1 } : entrance.inView}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={floatClass}>
        <div className="group relative">
          <div
            className="absolute -inset-8 rounded-full blur-2xl opacity-80 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-100 pointer-events-none"
            style={{ background: GLOW[id] }}
            aria-hidden="true"
          />
          <div
            className={`relative rounded-tl-[38px] rounded-br-[38px] rounded-tr-[18px] rounded-bl-[18px] border border-white bg-white/80 backdrop-blur-md shadow-[0_20px_44px_-24px_rgba(32,37,31,0.28)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_56px_-24px_rgba(32,37,31,0.34)] ${
              big ? 'px-8 py-7' : 'px-7 py-6'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white shadow-sm shrink-0 motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-105">
                {glyph}
              </span>
              <div className="min-w-0">
                <p className={`font-bold text-(--explorer-navy) leading-snug ${big ? 'text-[16px]' : 'text-[14.5px]'}`}>{title}</p>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TrustMoments({ total, status }) {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.3 })
  const bubbles = useDecorBubbles(9, reduceMotion)

  const count = useCountUp(status === 'ready' ? total : null, inView, reduceMotion)
  const liveTitle = status === 'ready' && total != null ? `${count.toLocaleString('en-IN')} live opening${total === 1 ? '' : 's'}` : 'Live openings, updated daily'

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-20 md:py-28 px-6 md:px-10">
      {/* Atmosphere — soft, huge, overlapping washes; no visible edges, no
          hard shapes. Fades/softens in on entrance rather than snapping on. */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        initial={{ opacity: 0, filter: 'blur(12px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      >
        <div className="trust-atmosphere-a absolute -top-1/4 -left-1/5 w-[65%] h-[80%] rounded-full opacity-70 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.06), transparent 70%)' }} />
        <div className="trust-atmosphere-b absolute -bottom-1/4 -right-1/5 w-[60%] h-[80%] rounded-full opacity-70 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(124,92,232,0.06), transparent 70%)' }} />
        <div className="trust-atmosphere-c absolute bottom-0 left-1/3 w-[50%] h-[60%] rounded-full opacity-60 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(236,97,163,0.05), transparent 70%)' }} />
        <div className="absolute top-0 right-1/4 w-[45%] h-[50%] rounded-full opacity-60 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(63,190,119,0.05), transparent 70%)' }} />
      </motion.div>

      {/* Small decorative bubbles — the Hero's visual language, smaller and
          calmer. Purely atmospheric, never covering content. */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {bubbles.map((b, i) => (
          <motion.span
            key={i}
            className={`trust-bubble ${b.axis === 'y' ? 'trust-bubble-drift-y' : 'trust-bubble-drift-x'}`}
            style={{
              top: `${b.top}%`,
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              background: b.color,
              filter: b.blur ? 'blur(1px)' : undefined,
              '--dur': `${b.dur}s`,
              '--delay': `${b.delay}s`,
              '--amp': `${b.amp}px`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.04, ease: 'easeOut' }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.p
          className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-(--explorer-teal)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          Why MZOBS
        </motion.p>

        <motion.h2
          className="mt-3 text-center text-[28px] sm:text-[36px] font-extrabold tracking-tight text-(--explorer-navy) text-balance"
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          Trust behind every opportunity.
        </motion.h2>
        <motion.p
          className="mt-3 text-center max-w-lg mx-auto text-[15px] text-(--explorer-muted)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Every opportunity on MZOBS is designed around verification, fresh openings and real human support.
        </motion.p>

        {/* Three floating panels — a deliberately asymmetrical composition
            (left / right / left-of-center), never a 3-column grid. Stacks
            centered on mobile. */}
        <div className="mt-14 md:mt-20 flex flex-col gap-8 md:gap-10">
          <TrustPanel
            id="verified"
            floatClass="trust-panel-float-1"
            wrapClass="md:max-w-sm md:mr-auto"
            glyph={<VerifiedGlyph active={inView} reduceMotion={reduceMotion} />}
            title="Verified employers"
            reduceMotion={reduceMotion}
            delay={0.3}
          >
            <p className="mt-0.5 text-[12.5px] text-(--explorer-muted) leading-snug">Every company is reviewed before a role goes live.</p>
          </TrustPanel>

          <TrustPanel
            id="live"
            big
            floatClass="trust-panel-float-2"
            wrapClass="md:max-w-md md:ml-auto md:-mt-4"
            glyph={
              <span className="relative flex items-center justify-center w-2.5 h-2.5">
                <span className="live-dot absolute inset-0 rounded-full bg-[#2563EB]" aria-hidden="true" />
                <span className="relative w-2.5 h-2.5 rounded-full bg-[#2563EB]" aria-hidden="true" />
              </span>
            }
            title={liveTitle}
            reduceMotion={reduceMotion}
            delay={0.42}
          >
            <p className="mt-0.5 text-[12.5px] text-(--explorer-muted) leading-snug">Fresh roles added as employers post new requirements.</p>
          </TrustPanel>

          <TrustPanel
            id="support"
            floatClass="trust-panel-float-3"
            wrapClass="md:max-w-sm md:mr-auto md:ml-6 lg:ml-16"
            glyph={<SupportGlyph active={inView} reduceMotion={reduceMotion} />}
            title="Real application support"
            reduceMotion={reduceMotion}
            delay={0.54}
          >
            <p className="mt-0.5 text-[12.5px] text-(--explorer-muted) leading-snug">Applications are reviewed by our team, not filtered by a bot.</p>
          </TrustPanel>
        </div>
      </div>
    </section>
  )
}
