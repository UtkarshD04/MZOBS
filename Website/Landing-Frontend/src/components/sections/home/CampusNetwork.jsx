import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, BookOpen, GraduationCap, Landmark, Library, School } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import ExplorerButton from '../../ui/ExplorerButton'
import { CAMPUS_NETWORK_DATA } from '../../../lib/content'

const EASE = [0.16, 1, 0.3, 1]

// Overlapping glossy bubbles (the Hero's .bubble-surface-major) standing in
// for the campuses on the network, capped by a "100+" bubble — the same
// idiom as an avatar stack of people who've joined.
const CAMPUS_BUBBLES = [
  { icon: GraduationCap, tone: 'blue' },
  { icon: BookOpen, tone: 'teal' },
  { icon: Landmark, tone: 'gold' },
  { icon: School, tone: 'blue' },
  { icon: Library, tone: 'teal' },
]

// Starts at the real figure (so the prerendered HTML and no-JS visitors read
// "100+", not "0+"), drops to 0 once hydrated while still off-screen, and
// counts up the first time the figure scrolls into view. Reduced-motion
// visitors just keep the final number.
function useCountUpOnView(ref, target) {
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(target)

  useEffect(() => {
    if (reduceMotion) {
      setValue(target)
      return
    }
    if (!inView) {
      setValue(0)
      return
    }
    const controls = animate(0, target, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, target])

  return value
}

function CampusStack({ count }) {
  const reduceMotion = useReducedMotion()
  const pop = (i) => ({
    hidden: { opacity: 0, scale: 0.4, y: 18 },
    shown: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 17, delay: 0.2 + i * 0.09 } },
  })

  return (
    <motion.ul
      className="flex items-center -space-x-3.5 sm:-space-x-4"
      initial={reduceMotion ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
      aria-hidden="true"
    >
      {CAMPUS_BUBBLES.map(({ icon: Icon, tone }, i) => (
        <motion.li key={i} variants={pop(i)} className="relative hover:z-10" style={{ zIndex: CAMPUS_BUBBLES.length - i }}>
          <div className="bubble-anim-float-y" style={{ '--dur': `${5 + i * 0.6}s`, '--delay': `${i * 0.35}s`, '--amp-y': '-5px' }}>
            <div
              className={`bubble-surface-major bubble-tone-${tone} w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center outline-3 outline-white transition-transform duration-300 ease-out motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-110`}
            >
              <Icon className="w-[44%] h-[44%] text-white" strokeWidth={2.1} />
            </div>
          </div>
        </motion.li>
      ))}
      <motion.li variants={pop(CAMPUS_BUBBLES.length)} className="relative" style={{ zIndex: CAMPUS_BUBBLES.length + 1 }}>
        <span className="absolute inset-0 rounded-full bg-(--explorer-gold)/30 motion-safe:animate-ping" style={{ animationDuration: '2.4s' }} />
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white outline-3 outline-white shadow-[0_12px_26px_-12px_rgba(198,138,31,0.7)] flex items-center justify-center text-[13px] sm:text-[14px] font-black text-(--explorer-gold)">
          {count}+
        </div>
      </motion.li>
    </motion.ul>
  )
}

export default function CampusNetwork() {
  const figureRef = useRef(null)
  const count = useCountUpOnView(figureRef, CAMPUS_NETWORK_DATA.count)
  const { eyebrow, titleLead, titleAccent, titleTail, subtitle, highlights, ctaText, ctaTo } = CAMPUS_NETWORK_DATA

  return (
    <section id="campuses" className="bg-(--explorer-bg) px-4 sm:px-6 md:px-10 py-12 md:py-16">
      <Reveal
        direction="up"
        duration={0.8}
        className="campus-panel relative max-w-6xl mx-auto overflow-hidden rounded-[28px] sm:rounded-[36px] border border-white"
      >
        {/* Aurora backdrop: drifting color washes + a faint dot grid */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="campus-aurora campus-aurora-a w-[42%] h-[120%] -left-[10%] -top-[30%]" style={{ background: 'rgba(var(--bubble-blue-rgb), 0.26)' }} />
          <div className="campus-aurora campus-aurora-b w-[36%] h-[110%] -right-[6%] -bottom-[40%]" style={{ background: 'rgba(var(--bubble-teal-rgb), 0.2)' }} />
          <div className="campus-aurora campus-aurora-a w-[28%] h-[90%] left-[40%] -top-[50%]" style={{ background: 'rgba(139, 92, 246, 0.14)', animationDelay: '-7s' }} />
          <div className="campus-aurora campus-aurora-b w-[26%] h-[80%] right-[26%] -bottom-[45%]" style={{ background: 'rgba(var(--bubble-gold-rgb), 0.16)', animationDelay: '-4s' }} />
          <div className="campus-dots absolute inset-0" />
        </div>

        <div className="relative grid lg:grid-cols-[1fr_auto] items-center gap-8 lg:gap-12 px-6 py-9 sm:px-10 sm:py-11 lg:px-14">
          <div>
            <span className="campus-glass inline-flex items-center gap-2 rounded-full pl-1 pr-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-(--explorer-navy)">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundImage: 'var(--hero-cta-gradient)' }}>
                <GraduationCap size={13} aria-hidden="true" />
              </span>
              {eyebrow}
            </span>

            {/* Headline lockup: the count, a hairline, then what it counts */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <p ref={figureRef} className="shrink-0 leading-none whitespace-nowrap">
                <span className="campus-count inline-block text-[72px] sm:text-[88px] font-black tracking-[-0.06em] tabular-nums">{count}</span>
                <span
                  className="inline-block align-top text-[40px] sm:text-[48px] font-black leading-none ml-0.5 mt-1.5"
                  style={{ backgroundImage: 'linear-gradient(160deg, #e0a93b, var(--explorer-gold))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
                >
                  +
                </span>
              </p>
              <span className="hidden sm:block w-px self-stretch my-2 bg-gradient-to-b from-transparent via-(--explorer-blue-border) to-transparent" aria-hidden="true" />
              <h2 className="text-[26px] sm:text-[30px] font-black leading-[1.12] tracking-tight text-(--explorer-navy)">
                {titleLead}
                <br />
                <span className="campus-accent font-serif italic font-bold tracking-normal pr-[0.06em]">{titleAccent}</span> {titleTail}
              </h2>
            </div>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-(--explorer-muted)">{subtitle}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {highlights.map(({ icon: Icon, label }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.1, ease: EASE }}
                  className="campus-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-(--explorer-navy)"
                >
                  <Icon size={14} className="text-(--explorer-blue)" aria-hidden="true" />
                  {label}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start lg:items-center gap-5">
            <CampusStack count={CAMPUS_NETWORK_DATA.count} />
            <ExplorerButton to={ctaTo} size="lg" className="rounded-full! px-6 group/cta">
              {ctaText}
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/cta:translate-x-1"
              />
            </ExplorerButton>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
