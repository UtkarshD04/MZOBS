import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import { CAMPUS_NETWORK_DATA } from '../../../lib/content'

const EASE = [0.16, 1, 0.3, 1]

/* ------------------------------------------------------------------ *
 * Isometric helpers. x runs right-down, y runs left-down, z is up.
 * Only the top face and the two front faces of a box are ever visible.
 * ------------------------------------------------------------------ */
const U = 24
const mkIso = (ox, oy) => (x, y, z = 0) => [ox + (x - y) * U * 0.866, oy + (x + y) * U * 0.5 - z]
const pts = (arr) => arr.map((p) => p.join(',')).join(' ')

const GLASS = { t: '#FFFFFF', l: '#E9EFFA', r: '#D3DDF0' }
const BLUE = { t: '#5B8DFF', l: '#2F63E6', r: '#2450C4' }
const MINT = { t: '#6FD8C0', l: '#35BFA3', r: '#2A9E86' }
const SKY = { t: '#E3EBFF', l: '#BDCFF8', r: '#A2B8EE' }
const LILAC = { t: '#E7E3FF', l: '#C9C2FA', r: '#B0A7F0' }

// Scene reveal: parts rise into place, then their windows light up.
const rise = {
  off: { opacity: 0, y: 28 },
  on: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, delay, ease: EASE } }),
}
const fade = {
  off: { opacity: 0 },
  on: (delay = 0) => ({ opacity: 1, transition: { duration: 1.2, delay, ease: 'easeOut' } }),
}

function Box({ iso, x, y, w, d, h, z0 = 0, fill, cols = 0, rows = 0, delay = 0, litAt = 1.6 }) {
  const top = [iso(x, y, h), iso(x + w, y, h), iso(x + w, y + d, h), iso(x, y + d, h)]
  const left = [iso(x, y + d, z0), iso(x + w, y + d, z0), iso(x + w, y + d, h), iso(x, y + d, h)]
  const right = [iso(x + w, y, z0), iso(x + w, y + d, z0), iso(x + w, y + d, h), iso(x + w, y, h)]

  const wins = []
  if (cols && rows) {
    const span = h - z0
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const u0 = (i + 0.22) / cols
        const u1 = (i + 0.78) / cols
        const v0 = 0.12 + ((j + 0.2) / rows) * 0.78
        const v1 = 0.12 + ((j + 0.7) / rows) * 0.78
        const zA = z0 + span * v0
        const zB = z0 + span * v1
        wins.push(
          pts([iso(x + w * u0, y + d, zA), iso(x + w * u1, y + d, zA), iso(x + w * u1, y + d, zB), iso(x + w * u0, y + d, zB)]),
          pts([iso(x + w, y + d * u0, zA), iso(x + w, y + d * u1, zA), iso(x + w, y + d * u1, zB), iso(x + w, y + d * u0, zB)]),
        )
      }
    }
  }

  return (
    <motion.g variants={rise} custom={delay}>
      <polygon points={pts(left)} fill={fill.l} stroke="rgba(255,255,255,.7)" strokeWidth=".6" />
      <polygon points={pts(right)} fill={fill.r} stroke="rgba(255,255,255,.7)" strokeWidth=".6" />
      <polygon points={pts(top)} fill={fill.t} stroke="rgba(255,255,255,.9)" strokeWidth=".6" />
      {wins.length > 0 && (
        <>
          <g fill="#8FA9DE" opacity=".5">{wins.map((p, k) => <polygon key={k} points={p} />)}</g>
          <motion.g variants={fade} custom={delay + litAt} fill="#FFDD9A" style={{ filter: 'drop-shadow(0 0 2px rgba(255,205,110,.9))' }}>
            {wins.map((p, k) => (k % 5 === 3 ? null : <polygon key={k} points={p} />))}
          </motion.g>
        </>
      )}
    </motion.g>
  )
}

function Platform({ iso, n, p }) {
  const c = (a, b, z) => iso(a, b, z)
  const T = 14
  return (
    <motion.g variants={rise} custom={0}>
      <ellipse cx={iso(n / 2, n / 2, 0)[0]} cy={iso(n / 2, n / 2, -T)[1] + 20} rx={n * 19} ry={n * 6} fill="rgba(22,50,79,.16)" filter={`url(#${p}-blur)`} />
      <polygon points={pts([c(0, n, 0), c(n, n, 0), c(n, n, -T), c(0, n, -T)])} fill={`url(#${p}-side-l)`} stroke="rgba(255,255,255,.85)" strokeWidth=".7" />
      <polygon points={pts([c(n, 0, 0), c(n, n, 0), c(n, n, -T), c(n, 0, -T)])} fill={`url(#${p}-side-r)`} stroke="rgba(255,255,255,.85)" strokeWidth=".7" />
      <polygon points={pts([c(0, 0, 0), c(n, 0, 0), c(n, n, 0), c(0, n, 0)])} fill={`url(#${p}-top)`} stroke="rgba(255,255,255,.95)" strokeWidth=".8" />
      <polygon points={pts([c(0.5, 0.5, 0), c(n - 0.5, 0.5, 0), c(n - 0.5, n - 0.5, 0), c(0.5, n - 0.5, 0)])} fill={`url(#${p}-lawn)`} />
    </motion.g>
  )
}

function Tree({ iso, x, y, delay }) {
  const [cx, cy] = iso(x, y, 0)
  return (
    <motion.g variants={rise} custom={delay}>
      <ellipse cx={cx} cy={cy + 1} rx="6" ry="2.6" fill="rgba(22,50,79,.12)" />
      <rect x={cx - 1} y={cy - 9} width="2" height="9" rx="1" fill="#8B7E74" />
      <ellipse cx={cx} cy={cy - 15} rx="7.5" ry="9" fill="#4CC9AC" />
      <ellipse cx={cx - 2} cy={cy - 18} rx="3.4" ry="4.4" fill="#8BE3CB" opacity=".75" />
    </motion.g>
  )
}

function Student({ path, color, delay, walk }) {
  return (
    <motion.g variants={fade} custom={delay}>
      <g>
        <ellipse cx="0" cy="0" rx="3" ry="1.2" fill="rgba(22,50,79,.18)" />
        <rect x="-1.8" y="-7" width="3.6" height="6.6" rx="1.8" fill={color} />
        <circle cx="0" cy="-9.2" r="2.2" fill="#1F2A44" />
        {walk && <animateMotion dur="14s" begin={`${delay + 1}s`} repeatCount="indefinite" path={path.d} keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear" />}
      </g>
    </motion.g>
  )
}

function SceneDefs({ p }) {
  return (
    <defs>
      <filter id={`${p}-blur`} x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="9" /></filter>
      <linearGradient id={`${p}-top`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E6EEFF" /></linearGradient>
      <linearGradient id={`${p}-lawn`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EAF8F3" /><stop offset="1" stopColor="#D8F0EA" /></linearGradient>
      <linearGradient id={`${p}-side-l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F1F5FF" stopOpacity=".95" /><stop offset="1" stopColor="#B9CCF5" stopOpacity=".75" /></linearGradient>
      <linearGradient id={`${p}-side-r`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#DCE6FB" stopOpacity=".95" /><stop offset="1" stopColor="#9DB3EC" stopOpacity=".75" /></linearGradient>
      <linearGradient id={`${p}-dome`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8E82FF" /><stop offset="1" stopColor="#4F6FF0" /></linearGradient>
    </defs>
  )
}

/* ---------------- The campus (local box 374 × 350) ---------------- */
function CampusScene({ p, animate: walk }) {
  const iso = mkIso(187, 120)
  const at = (x, y) => iso(x, y, 0).join(' ')
  const dome = iso(7.2, 5.6, 36)
  const items = [
    { k: 2.8, el: <Tree key="t1" iso={iso} x={1.2} y={1.6} delay={0.9} /> },
    { k: 9.1, el: <Tree key="t2" iso={iso} x={7.8} y={1.3} delay={1.0} /> },
    {
      k: 6.8,
      el: (
        <g key="hall">
          <Box iso={iso} x={2.6} y={0.9} w={4} d={2.5} h={66} fill={GLASS} cols={5} rows={3} delay={0.3} litAt={1.5} />
          <Box iso={iso} x={2.4} y={0.7} w={4.4} d={2.9} z0={66} h={74} fill={BLUE} delay={0.45} />
          <Box iso={iso} x={4.05} y={1.55} w={1.1} d={1.1} z0={74} h={112} fill={GLASS} cols={1} rows={2} delay={0.6} litAt={1.4} />
          <Box iso={iso} x={3.95} y={1.45} w={1.3} d={1.3} z0={112} h={118} fill={MINT} delay={0.7} />
        </g>
      ),
    },
    { k: 7.5, el: <Box key="lib" iso={iso} x={0.7} y={4.4} w={2.4} d={2.4} h={48} fill={GLASS} cols={3} rows={2} delay={0.5} litAt={1.7} /> },
    { k: 9, el: <Tree key="t3" iso={iso} x={1.0} y={8.0} delay={1.0} /> },
    { k: 10.4, el: <Tree key="t4" iso={iso} x={2.5} y={8.0} delay={1.05} /> },
    { k: 12.2, el: <Box key="office" iso={iso} x={3.7} y={6.9} w={1.8} d={1.4} h={28} fill={GLASS} cols={2} rows={1} delay={0.7} litAt={1.8} /> },
    {
      k: 12.8,
      el: (
        <g key="grad">
          <Box iso={iso} x={6} y={4.4} w={2.4} d={2.4} h={36} fill={GLASS} cols={3} rows={1} delay={0.6} litAt={1.9} />
          <motion.g variants={rise} custom={0.8}>
            <ellipse cx={dome[0]} cy={dome[1]} rx="29" ry="14" fill="#C9C2FA" />
            <path d={`M${dome[0] - 29} ${dome[1]} A29 26 0 0 1 ${dome[0] + 29} ${dome[1]} A29 14 0 0 1 ${dome[0] - 29} ${dome[1]} Z`} fill={`url(#${p}-dome)`} />
            <ellipse cx={dome[0] - 8} cy={dome[1] - 14} rx="8" ry="5" fill="#fff" opacity=".35" />
          </motion.g>
        </g>
      ),
    },
    { k: 16, el: <Tree key="t5" iso={iso} x={8.0} y={8.0} delay={1.1} /> },
  ].sort((a, b) => a.k - b.k)

  const walkers = [
    { d: `M${at(4.6, 6.6)} L${at(4.6, 3.9)}`, color: '#2563EB', delay: 2.2 },
    { d: `M${at(1.4, 3.9)} L${at(4.4, 3.9)}`, color: '#6D5DFB', delay: 2.5 },
    { d: `M${at(7.8, 3.9)} L${at(4.8, 3.9)}`, color: '#35BFA3', delay: 2.8 },
  ]
  const still = [at(4.6, 6.0), at(2.4, 3.9), at(6.8, 3.9)]

  return (
    <g>
      <SceneDefs p={p} />
      <Platform iso={iso} n={9} p={p} />
      <motion.g variants={fade} custom={0.4}>
        <polygon points={pts([iso(4, 3.4), iso(5.2, 3.4), iso(5.2, 6.9), iso(4, 6.9)])} fill="#F3F6FC" />
        <polygon points={pts([iso(0.7, 3.6), iso(8.4, 3.6), iso(8.4, 4.2), iso(0.7, 4.2)])} fill="#F3F6FC" />
      </motion.g>
      {items.map((i) => i.el)}
      {walkers.map((w, i) => (
        <g key={i} transform={walk ? undefined : `translate(${still[i]})`}>
          <Student path={w} color={w.color} delay={w.delay} walk={walk} />
        </g>
      ))}
    </g>
  )
}

/* ---------------- Employer skyline (local box 208 × 240) ---------------- */
function EmployerScene({ p }) {
  const iso = mkIso(104, 96)
  return (
    <g>
      <SceneDefs p={p} />
      <Platform iso={iso} n={5} p={p} />
      <Box iso={iso} x={0.5} y={0.5} w={1.6} d={1.6} h={84} fill={GLASS} cols={2} rows={5} delay={0.2} litAt={0.2} />
      <Box iso={iso} x={2.7} y={0.6} w={1.4} d={1.4} h={112} fill={LILAC} cols={2} rows={7} delay={0.35} litAt={0.2} />
      <Box iso={iso} x={0.6} y={2.7} w={1.7} d={1.5} h={50} fill={SKY} cols={2} rows={3} delay={0.5} litAt={0.2} />
      <Box iso={iso} x={3.0} y={2.9} w={1.5} d={1.5} h={68} fill={GLASS} cols={2} rows={4} delay={0.65} litAt={0.2} />
    </g>
  )
}

/* ---------------- The MZOBS light ribbon ---------------- */
function Ribbon({ d, id, from, to, show, animateParticles, delay }) {
  const reduce = useReducedMotion()
  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}>
          <stop offset="0" stopColor="#2563EB" /><stop offset=".5" stopColor="#6D5DFB" /><stop offset="1" stopColor="#35BFA3" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>
      <motion.path d={d} fill="none" stroke={`url(#${id})`} strokeWidth="16" strokeLinecap="round" filter={`url(#${id}-glow)`} opacity=".4"
        initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: show ? 1 : 0 }} transition={{ duration: 1.8, delay, ease: 'easeInOut' }} />
      <motion.path d={d} fill="none" stroke={`url(#${id})`} strokeWidth="4.5" strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: show ? 1 : 0 }} transition={{ duration: 1.8, delay, ease: 'easeInOut' }} />
      <motion.path d={d} fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity=".85"
        initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: show ? 1 : 0 }} transition={{ duration: 1.8, delay, ease: 'easeInOut' }} />
      {animateParticles && [0, 1, 2, 3].map((i) => (
        <circle key={i} r="2.6" fill={i % 2 ? '#35BFA3' : '#fff'} stroke="#6D5DFB" strokeWidth=".6">
          <animateMotion dur="5.2s" begin={`${delay + 2 + i * 1.3}s`} repeatCount="indefinite" path={d} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.88;1" dur="5.2s" begin={`${delay + 2 + i * 1.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  )
}

function Badge({ x, y, title, sub, delay }) {
  return (
    <motion.g variants={{ off: { opacity: 0, y: 8 }, on: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: EASE } } }}>
      <g transform={`translate(${x} ${y})`}>
        <rect x="-92" y="-27" width="184" height="54" rx="18" fill="rgba(255,255,255,.82)" stroke="#fff" strokeWidth="1.2" style={{ filter: 'drop-shadow(0 14px 22px rgba(37,99,235,.28))' }} />
        <rect x="-80" y="-15" width="30" height="30" rx="10" fill="#2563EB" />
        <rect x="-80" y="-15" width="30" height="30" rx="10" fill="url(#badge-sheen)" />
        <text x="-65" y="5" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" fontFamily="inherit">M</text>
        <text x="-40" y="-2" fontSize="13.5" fontWeight="900" fill="#16324F" fontFamily="inherit" letterSpacing=".4">{title}</text>
        <text x="-40" y="12" fontSize="9.4" fontWeight="600" fill="#64748B" fontFamily="inherit">{sub}</text>
      </g>
    </motion.g>
  )
}

const BadgeDefs = () => (
  <defs>
    <linearGradient id="badge-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#6D5DFB" stopOpacity=".55" /></linearGradient>
  </defs>
)

function StatCard({ data, className = '' }) {
  return (
    <div className={`campus-glass rounded-2xl px-4 py-3 ${className}`}>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-(--explorer-muted)">{data.statLabel}</p>
      <p className="mt-0.5 text-[22px] font-black leading-none tracking-tight text-(--explorer-navy)">
        {data.count != null ? `${data.count.toLocaleString('en-IN')}+` : <span className="campus-accent text-[17px]">{data.statFallback}</span>}
      </p>
    </div>
  )
}

function VerifiedCard({ data, className = '' }) {
  return (
    <div className={`campus-glass flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#35BFA3] text-white"><BadgeCheck size={15} aria-hidden="true" /></span>
      <span>
        <span className="block text-[12.5px] font-bold leading-tight text-(--explorer-navy)">{data.verifiedLabel}</span>
        <span className="block text-[11px] text-(--explorer-muted)">{data.verifiedDetail}</span>
      </span>
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

const RIBBON_D = 'M250 410 C330 445 375 335 455 335 S 570 262 622 232'
const RIBBON_MOB = 'M120 0 C96 40 144 60 120 80 S 144 130 120 170'

export default function CampusNetwork() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const reduce = useReducedMotion()
  const show = useInView(stageRef, { once: true, amount: 0.3 })
  const on = reduce ? 'on' : show ? 'on' : 'off'
  const live = show && !reduce
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
            className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#2563EB]"
          >
            <span className="h-px w-6 bg-[#2563EB]" aria-hidden="true" />{d.eyebrow}
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

        {/* Hero visual */}
        <div ref={stageRef}>
          {/* Tablet / desktop: one continuous scene */}
          <motion.div style={{ y: reduce ? 0 : lift }} className="relative hidden md:block">
            <motion.svg initial={false} animate={on} viewBox="0 0 820 520" className="block w-full overflow-visible" role="img" aria-label="A digital campus connected through MZOBS to employers">
              <BadgeDefs />
              <g transform="translate(590 40)"><EmployerScene p="e" /></g>
              <g transform="translate(10 150)">
                <g className="bubble-anim-float-y" style={{ '--dur': '9s', '--amp-y': '-5px' }}><CampusScene p="c" animate={live} /></g>
              </g>
              <Ribbon d={RIBBON_D} id="rib-d" from={[250, 410]} to={[622, 232]} show={on === 'on'} animateParticles={live} delay={1.6} />
              <Badge x={455} y={335} title={d.badgeTitle} sub={d.badgeSub} delay={2.5} />
            </motion.svg>
            <StatCard data={d} className="absolute left-[2%] top-[8%]" />
            <VerifiedCard data={d} className="absolute left-[33%] top-[22%]" />
          </motion.div>

          {/* Mobile: its own vertical journey — campus → MZOBS → employers */}
          <motion.div initial={false} animate={on} className="md:hidden">
            <div className="relative mx-auto max-w-[360px]">
              <svg viewBox="0 0 374 350" className="block w-full overflow-visible" role="img" aria-label="A digital campus">
                <g className="bubble-anim-float-y" style={{ '--dur': '9s', '--amp-y': '-4px' }}><CampusScene p="mc" animate={live} /></g>
              </svg>
              <StatCard data={d} className="absolute left-0 top-0 scale-90 origin-top-left" />
              <VerifiedCard data={d} className="absolute left-0 top-[76%] scale-90 origin-top-left" />
            </div>
            <svg viewBox="0 0 240 170" className="mx-auto -mt-2 block w-[240px] overflow-visible" aria-hidden="true">
              <BadgeDefs />
              <Ribbon d={RIBBON_MOB} id="rib-m" from={[120, 0]} to={[120, 170]} show={on === 'on'} animateParticles={live} delay={1.4} />
              <Badge x={120} y={82} title={d.badgeTitle} sub={d.badgeSub} delay={2.2} />
            </svg>
            <svg viewBox="0 0 208 240" className="mx-auto -mt-2 block w-[210px] overflow-visible" role="img" aria-label="Employers hiring on MZOBS">
              <EmployerScene p="me" />
            </svg>
            <div className="mt-6 text-center"><MagneticCta to={d.ctaTo}>{d.ctaText}</MagneticCta></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
