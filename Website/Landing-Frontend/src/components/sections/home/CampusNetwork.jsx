import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Award,
  BookOpen,
  Calculator,
  FlaskConical,
  GraduationCap,
  Landmark,
  Laptop,
  Library,
  Microscope,
  Palette,
  School,
  Stethoscope,
} from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import ExplorerButton from '../../ui/ExplorerButton'
import { CAMPUS_NETWORK_DATA } from '../../../lib/content'

const EASE = [0.16, 1, 0.3, 1]

// Three orbits around the MZOBS hub. Sizes are % of the visual's width so the
// whole thing scales from phone to desktop; `angle` is where a node sits on
// its ring (0° = 3 o'clock). Nodes without an icon are small accent orbs
// that make the network read as "many more" than the icons shown.
const RINGS = [
  {
    size: 46,
    dur: 36,
    dir: 'normal',
    nodes: [
      { angle: -90, size: 12, tone: 'blue', icon: GraduationCap },
      { angle: 30, size: 11, tone: 'teal', icon: BookOpen },
      { angle: 150, size: 11, tone: 'gold', icon: Landmark },
    ],
  },
  {
    size: 72,
    dur: 58,
    dir: 'reverse',
    nodes: [
      { angle: -30, size: 9.5, tone: 'teal', icon: Microscope },
      { angle: 42, size: 4, tone: 'blue' },
      { angle: 90, size: 9.5, tone: 'blue', icon: Laptop },
      { angle: 162, size: 9.5, tone: 'gold', icon: Library },
      { angle: 214, size: 3.5, tone: 'teal' },
      { angle: 246, size: 9.5, tone: 'teal', icon: School },
    ],
  },
  {
    size: 97,
    dur: 90,
    dir: 'normal',
    nodes: [
      { angle: -62, size: 8, tone: 'gold', icon: Award },
      { angle: -18, size: 3, tone: 'blue' },
      { angle: 12, size: 8, tone: 'blue', icon: Calculator },
      { angle: 70, size: 3.5, tone: 'gold' },
      { angle: 118, size: 8, tone: 'teal', icon: Stethoscope },
      { angle: 188, size: 8, tone: 'blue', icon: Palette },
      { angle: 232, size: 3, tone: 'teal' },
      { angle: 262, size: 8, tone: 'teal', icon: FlaskConical },
    ],
  },
]

const HUB_SIZE = 26

function polar(angle) {
  const rad = (angle * Math.PI) / 180
  return { x: 50 + 50 * Math.cos(rad), y: 50 + 50 * Math.sin(rad) }
}

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

// Gentle 3D tilt toward the pointer — mouse/trackpad only, so touch
// scrolling past the section never jiggles it.
function usePointerTilt(maxDeg) {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-maxDeg, maxDeg]), { stiffness: 120, damping: 18 })
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [maxDeg, -maxDeg]), { stiffness: 120, damping: 18 })

  function onPointerMove(e) {
    if (e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function onPointerLeave() {
    px.set(0)
    py.set(0)
  }

  return { rotateX, rotateY, onPointerMove, onPointerLeave }
}

function OrbitRing({ ring, index }) {
  // Spokes are drawn in the ring's own 0–100 box, which is `ring.size`% of
  // the visual — scaling by `unit` keeps every ring's line the same
  // on-screen thickness and dash rhythm.
  const unit = 100 / ring.size

  return (
    <motion.div
      className="absolute inset-0 m-auto"
      style={{ width: `${ring.size}%`, height: `${ring.size}%` }}
      variants={{
        hidden: { opacity: 0, scale: 0.55 },
        shown: { opacity: 1, scale: 1, transition: { duration: 1.1, delay: 0.15 + index * 0.14, ease: EASE } },
      }}
    >
      <div
        className="campus-orbit campus-ring absolute inset-0 rounded-full"
        style={{ '--dur': `${ring.dur}s`, '--dir': ring.dir, '--counter': ring.dir === 'normal' ? 'reverse' : 'normal' }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
          {ring.nodes
            .filter((node) => node.icon)
            .map((node) => {
              const p = polar(node.angle)
              return (
                <line
                  key={node.angle}
                  className="campus-spoke"
                  x1={p.x}
                  y1={p.y}
                  x2={50}
                  y2={50}
                  strokeWidth={0.28 * unit}
                  strokeDasharray={`${0.9 * unit} ${2.1 * unit}`}
                  style={{ '--flow': -3 * unit }}
                />
              )
            })}
        </svg>

        {ring.nodes.map((node, n) => {
          const p = polar(node.angle)
          const pct = (node.size / ring.size) * 100
          const Icon = node.icon
          return (
            <div
              key={node.angle}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${pct}%`, height: `${pct}%` }}
            >
              <motion.div
                className="w-full h-full"
                variants={{
                  hidden: { opacity: 0, scale: 0 },
                  shown: {
                    opacity: 1,
                    scale: 1,
                    transition: { type: 'spring', stiffness: 260, damping: 16, delay: 0.55 + index * 0.18 + n * 0.07 },
                  },
                }}
              >
                <div className="campus-counter w-full h-full">
                  <div
                    className={`${Icon ? 'bubble-surface-major' : 'bubble-surface bubble-surface-vivid'} bubble-tone-${node.tone} w-full h-full flex items-center justify-center`}
                  >
                    {Icon && <Icon className="w-[46%] h-[46%] text-white" strokeWidth={2.2} />}
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function OrbitChip({ chip, className, delay, floatDur }) {
  const Icon = chip.icon
  return (
    <motion.div
      className={`absolute z-10 ${className}`}
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.9 },
        shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, delay, ease: EASE } },
      }}
    >
      <div className="bubble-anim-float-y" style={{ '--dur': floatDur, '--amp-y': '-10px' }}>
        <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/85 backdrop-blur-md pl-2.5 pr-4 py-2.5 shadow-[0_18px_40px_-18px_rgba(15,35,56,0.35)]">
          <span className="bubble-surface-major bubble-tone-teal w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <Icon size={17} className="text-white" />
          </span>
          <span className="leading-tight">
            <span className="block text-[13px] sm:text-[14px] font-extrabold text-(--explorer-navy) whitespace-nowrap">{chip.title}</span>
            <span className="block text-[11.5px] sm:text-[12px] text-(--explorer-muted) whitespace-nowrap">{chip.text}</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// Decorative: the section's real content (the count, heading, highlights)
// is all in the text column, so this whole visual is aria-hidden.
function CampusOrbit() {
  const reduceMotion = useReducedMotion()
  const { rotateX, rotateY, onPointerMove, onPointerLeave } = usePointerTilt(reduceMotion ? 0 : 7)
  const [chipA, chipB] = CAMPUS_NETWORK_DATA.orbitChips

  return (
    <motion.div
      className="relative aspect-square w-full"
      style={{ rotateX, rotateY, transformPerspective: 1400 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      aria-hidden="true"
    >
      <div className="bubble-blob bubble-tone-blue absolute inset-[18%] opacity-70" />
      <div className="bubble-blob bubble-tone-teal bubble-anim-blob-drift absolute w-[34%] h-[34%] right-[4%] bottom-[6%] opacity-60" />

      {RINGS.map((ring, i) => (
        <OrbitRing key={ring.size} ring={ring} index={i} />
      ))}

      {/* Hub — MZOBS at the center, rippling out to every campus */}
      <div className="absolute inset-0 m-auto" style={{ width: `${HUB_SIZE}%`, height: `${HUB_SIZE}%` }}>
        {[0, 1.2, 2.4].map((d) => (
          <span
            key={d}
            className="campus-ripple absolute inset-0 rounded-full border-2 border-(--explorer-blue)/30"
            style={{ '--delay': `${d}s` }}
          />
        ))}
        <motion.div
          className="relative w-full h-full rounded-full bg-white flex items-center justify-center ring-1 ring-(--explorer-blue-border) shadow-[0_24px_50px_-18px_rgba(37,99,235,0.55),inset_0_-8px_18px_-10px_rgba(37,99,235,0.25)]"
          variants={{
            hidden: { opacity: 0, scale: 0.2 },
            shown: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 180, damping: 14, delay: 0.1 } },
          }}
        >
          <img src="/images/logo.png" alt="" className="w-[64%] h-auto object-contain" />
        </motion.div>
      </div>

      <OrbitChip chip={chipA} className="left-0 top-[6%] sm:-left-[4%]" delay={1.1} floatDur="7s" />
      <OrbitChip chip={chipB} className="right-0 bottom-[5%] sm:-right-[2%]" delay={1.3} floatDur="8.5s" />
    </motion.div>
  )
}

export default function CampusNetwork() {
  const figureRef = useRef(null)
  const count = useCountUpOnView(figureRef, CAMPUS_NETWORK_DATA.count)

  return (
    <section id="campuses" className="campus-atmosphere relative py-20 md:py-28 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-14 lg:gap-12 items-center">
        <div>
          <Reveal direction="up" duration={0.6}>
            <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur border border-(--explorer-teal-border) text-[12px] font-bold uppercase tracking-wider text-(--explorer-teal) shadow-[0_4px_14px_-8px_rgba(11,122,109,0.4)]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-(--explorer-teal) opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-(--explorer-teal)" />
              </span>
              {CAMPUS_NETWORK_DATA.eyebrow}
            </span>
          </Reveal>

          <Reveal direction="up" duration={0.8} delay={0.05} blur>
            <p ref={figureRef} className="mt-6">
              <span className="campus-count inline-block text-[96px] sm:text-[128px] font-black leading-[0.9] tracking-tighter tabular-nums pb-2">
                {count}+
              </span>
            </p>
          </Reveal>

          <h2 className="mt-2 text-[30px] sm:text-[40px] font-black leading-[1.08] tracking-tight text-balance text-(--explorer-navy)">
            <SplitText text={CAMPUS_NETWORK_DATA.title} delay={0.15} />
          </h2>

          <Reveal direction="up" duration={0.7} delay={0.25}>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-(--explorer-muted)">{CAMPUS_NETWORK_DATA.subtitle}</p>
          </Reveal>

          <StaggerGroup className="mt-8 grid gap-3 max-w-xl" delayChildren={0.3} staggerDelay={0.12}>
            {CAMPUS_NETWORK_DATA.highlights.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title} y={24}>
                <div className="group flex items-center gap-4 rounded-2xl border border-(--explorer-border) bg-white/75 backdrop-blur-sm px-4 py-3.5 transition-[translate,border-color,box-shadow] duration-300 ease-out motion-safe:hover:translate-x-1.5 hover:border-(--explorer-blue-border) hover:shadow-[0_16px_34px_-20px_rgba(37,99,235,0.55)]">
                  <span className="shrink-0 w-11 h-11 rounded-xl bg-(--explorer-blue-surface) text-(--explorer-blue) flex items-center justify-center transition-colors duration-300 group-hover:bg-(--explorer-blue) group-hover:text-white">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-(--explorer-navy)">{title}</p>
                    <p className="text-[13.5px] text-(--explorer-muted)">{text}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="ml-auto shrink-0 text-(--explorer-blue) opacity-0 -translate-x-2 transition-[opacity,translate] duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal direction="up" duration={0.6} delay={0.2}>
            <ExplorerButton to={CAMPUS_NETWORK_DATA.ctaTo} size="xl" className="mt-9 group/cta">
              {CAMPUS_NETWORK_DATA.ctaText}
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/cta:translate-x-1"
              />
            </ExplorerButton>
          </Reveal>
        </div>

        <div className="w-full max-w-[420px] sm:max-w-[560px] mx-auto lg:mr-0">
          <CampusOrbit />
        </div>
      </div>
    </section>
  )
}
