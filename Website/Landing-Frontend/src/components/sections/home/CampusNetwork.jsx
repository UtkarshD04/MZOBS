import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import ExplorerButton from '../../ui/ExplorerButton'
import { CAMPUS_NETWORK_DATA } from '../../../lib/content'

const GRID_SIZE = 10

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
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, target])

  return value
}

// One square per campus, filled diagonally from blue (top-left) to teal
// (bottom-right) with a light deterministic brightness jitter so the mosaic
// reads as many individual campuses rather than one flat gradient block.
function CampusMosaic({ count }) {
  const reduceMotion = useReducedMotion()
  const cells = Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / GRID_SIZE)
    const col = i % GRID_SIZE
    const diagonal = (row + col) / ((GRID_SIZE - 1) * 2)
    return { i, diagonal, opacity: 0.72 + ((i * 37) % 29) / 100 }
  })

  return (
    <motion.ul
      className="grid gap-1.5 sm:gap-2"
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      aria-hidden="true"
    >
      {cells.map((cell) => (
        <motion.li
          key={cell.i}
          className="aspect-square rounded-[5px] sm:rounded-md"
          style={{
            backgroundColor: `color-mix(in oklab, var(--explorer-teal) ${Math.round(cell.diagonal * 100)}%, var(--explorer-blue))`,
            opacity: cell.opacity,
          }}
          variants={{
            hidden: { scale: 0.3, opacity: 0 },
            shown: {
              scale: 1,
              opacity: cell.opacity,
              transition: { delay: cell.diagonal * 0.9, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        />
      ))}
    </motion.ul>
  )
}

export default function CampusNetwork() {
  const figureRef = useRef(null)
  const count = useCountUpOnView(figureRef, CAMPUS_NETWORK_DATA.count)

  return (
    <section id="campuses" className="bg-white py-16 md:py-24 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <Reveal direction="up" duration={0.7}>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-(--explorer-teal-surface) border border-(--explorer-teal-border) text-[12px] font-bold uppercase tracking-wider text-(--explorer-teal)">
            <GraduationCap size={15} aria-hidden="true" />
            {CAMPUS_NETWORK_DATA.eyebrow}
          </span>

          <p ref={figureRef} className="mt-6 leading-none">
            <span
              className="text-[84px] sm:text-[112px] font-black tracking-tighter tabular-nums"
              style={{ backgroundImage: 'var(--hero-cta-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
            >
              {count}+
            </span>
          </p>

          <h2 className="mt-3 text-[28px] sm:text-[36px] font-black leading-[1.1] tracking-tight text-balance text-(--explorer-navy)">
            {CAMPUS_NETWORK_DATA.title}
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-(--explorer-muted)">{CAMPUS_NETWORK_DATA.subtitle}</p>

          <ul className="mt-8 space-y-4">
            {CAMPUS_NETWORK_DATA.highlights.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3.5">
                <span className="shrink-0 w-10 h-10 rounded-xl bg-(--explorer-blue-surface) border border-(--explorer-blue-border) text-(--explorer-blue) flex items-center justify-center">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[15px] font-bold text-(--explorer-navy)">{title}</p>
                  <p className="text-[14px] text-(--explorer-muted)">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <ExplorerButton to={CAMPUS_NETWORK_DATA.ctaTo} size="lg" className="mt-9">
            {CAMPUS_NETWORK_DATA.ctaText}
          </ExplorerButton>
        </Reveal>

        <Reveal direction="up" duration={0.7} delay={0.1} className="w-full max-w-[460px] mx-auto lg:mr-0">
          <figure className="relative rounded-[28px] border border-(--explorer-border) bg-(--explorer-bg) p-5 sm:p-7 shadow-[0_24px_48px_-28px_rgba(15,35,56,0.35)]">
            <CampusMosaic count={CAMPUS_NETWORK_DATA.count} />
            <figcaption className="mt-5 flex items-center justify-between gap-4 text-[13px] text-(--explorer-muted)">
              <span>{CAMPUS_NETWORK_DATA.mosaicCaption}</span>
              <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white border border-(--explorer-border) px-3 py-1 font-bold text-(--explorer-navy)">
                <span className="w-2 h-2 rounded-full bg-(--explorer-teal)" aria-hidden="true" />
                {CAMPUS_NETWORK_DATA.count}+ campuses
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
