import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { CAMPUS_NETWORK_DATA } from '../../../lib/content'

const EASE = [0.16, 1, 0.3, 1]

function CountUp({ to, active }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!active || reduce) return undefined
    const c = animate(0, to, { duration: 2, ease: EASE, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [active, reduce, to])
  return <>{n.toLocaleString('en-IN')}</>
}

function CollegeCount({ data, active }) {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center">
      {/* Soft concentric rings */}
      <span className="absolute inset-[4%] rounded-full border border-[#5b5fef]/15" aria-hidden="true" />
      <span className="absolute inset-[16%] rounded-full border border-[#6D5DFB]/20" aria-hidden="true" />
      <span className="absolute inset-[28%] rounded-full bg-[radial-gradient(circle,rgba(109,93,251,.16),transparent_70%)]" aria-hidden="true" />
      <div className="campus-glass relative z-10 flex w-[78%] flex-col items-center rounded-[32px] px-6 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5b5fef] text-white shadow-[0_12px_24px_-10px_rgba(37,99,235,.7)]">
          <GraduationCap size={24} aria-hidden="true" />
        </span>
        <p className="campus-accent mt-5 text-[84px] font-black leading-none tracking-[-0.04em] sm:text-[104px]" aria-label={`${data.count}+ ${data.statLabel}`}>
          <CountUp to={data.count} active={active} />+
        </p>
        <p className="mt-3 text-[13px] font-bold uppercase tracking-[0.18em] text-(--explorer-muted)">{data.statLabel}</p>
        <p className="mt-2 text-[14px] font-semibold text-(--explorer-navy)">{data.statNote}</p>
      </div>
    </div>
  )
}

function MagneticCta({ to, children }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 16 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 16 })
  function onMove(e) {
    if (reduce) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.16)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.26)
  }
  function onLeave() { x.set(0); y.set(0) }
  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      <Link to={to} className="group/cta relative inline-flex rounded-full p-[1.5px] shadow-[0_16px_36px_-14px_rgba(37,99,235,0.6)] motion-safe:transition-shadow hover:shadow-[0_20px_46px_-12px_rgba(109,93,251,0.6)]">
        <span className="campus-cta-border absolute inset-0 rounded-full" aria-hidden="true" />
        <span className="relative inline-flex items-center gap-2.5 rounded-full bg-[#16324F] px-6 py-3 text-[14.5px] font-bold text-white">
          {children}
          <ArrowRight size={16} aria-hidden="true" className="motion-safe:transition-transform motion-safe:duration-300 group-hover/cta:translate-x-1" />
        </span>
      </Link>
    </motion.div>
  )
}

export default function CampusNetwork() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const reduce = useReducedMotion()
  const show = useInView(stageRef, { once: true, amount: 0.3 })
  const d = CAMPUS_NETWORK_DATA

  // Scroll: soft white → subtle blue wash; the scene drifts gently upward.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const tint = useTransform(scrollYProgress, [0.1, 0.5], [0, 1])
  const lift = useTransform(scrollYProgress, [0, 1], [26, -26])

  return (
    <section id="campuses" ref={sectionRef} className="relative isolate overflow-hidden pb-6 pt-16 md:pb-10 md:pt-24">
      {/* Backdrop — base wash, scroll-driven blue tint, curved lower edge */}
      <div
        className="absolute inset-0 -z-10 rounded-b-[50%_44px]"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 85% 20%, rgba(37,99,235,.09), transparent 70%), radial-gradient(ellipse 45% 40% at 10% 90%, rgba(53,191,163,.11), transparent 70%), radial-gradient(ellipse 40% 30% at 45% 0%, rgba(255,247,235,.9), transparent 70%), #F7F9FC',
        }}
      >
        <motion.div className="absolute inset-0 rounded-b-[50%_44px]" style={{ opacity: tint, background: 'linear-gradient(180deg, rgba(37,99,235,.03) 0%, rgba(109,93,251,.07) 55%, rgba(53,191,163,.07) 100%)' }} />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[0.82fr_1.18fr] md:gap-6 md:px-10 lg:gap-10">
        {/* Editorial copy */}
        <div className="md:pb-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#5b5fef]"
          >
            <span className="h-px w-6 bg-[#5b5fef]" aria-hidden="true" />{d.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
            className="mt-5 text-[44px] font-black leading-[1.02] tracking-[-0.035em] text-[#16324F] sm:text-[56px] lg:text-[64px]"
          >
            {d.headline.map((l) => <span key={l} className="block">{l}</span>)}
            <span className="campus-accent block pb-1">{d.headlineAccent}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mt-6 max-w-md text-[16.5px] leading-relaxed text-(--explorer-muted)"
          >
            {d.subtitle}
          </motion.p>
          <div className="mt-9 hidden md:block"><MagneticCta to={d.ctaTo}>{d.ctaText}</MagneticCta></div>
        </div>

        {/* College count */}
        <div ref={stageRef}>
          <motion.div style={{ y: reduce ? 0 : lift }}>
            <CollegeCount data={d} active={show} />
          </motion.div>
          <div className="mt-8 text-center md:hidden"><MagneticCta to={d.ctaTo}>{d.ctaText}</MagneticCta></div>
        </div>
      </div>
    </section>
  )
}
