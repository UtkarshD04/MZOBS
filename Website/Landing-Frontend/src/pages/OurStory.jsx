import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useSpring } from 'framer-motion'
import { ArrowRight, Building2, Lightbulb, Puzzle, Unlink, User } from 'lucide-react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'

const INK = '#073B3A'
const TEAL = '#0F8B7D'
const VIOLET = '#7C6CFF'
const ease = [0.22, 1, 0.36, 1]

const Serif = ({ children, color }) => (
  <span className="font-serif font-normal italic" style={color ? { color } : undefined}>{children}</span>
)

/* ---------- tiny card visuals ---------------------------------------------- */

const chipBase = 'flex h-9 w-9 items-center justify-center rounded-xl'

function BrokenLinkVisual() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <span className={`${chipBase} bg-white text-[#E76F51]`}><User size={16} /></span>
      <span className="h-px w-8 border-t-2 border-dashed border-[#1F2A37]/40" />
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F2A37]/70">no reply</span>
      <span className="h-px w-8 border-t-2 border-dashed border-[#1F2A37]/40" />
      <span className={`${chipBase} bg-white text-[#7a3b2c]`}><Building2 size={16} /></span>
    </div>
  )
}

function GapVisual() {
  return (
    <div className="flex items-center" aria-hidden="true">
      <span className={`${chipBase} bg-white text-[#4a3fb5]`}><User size={16} /></span>
      <span className="ml-1 h-[3px] w-10 rounded-full bg-[#7C6CFF]" />
      <span className="w-8" />
      <span className="mr-1 h-[3px] w-10 rounded-full bg-[#7C6CFF]/35" />
      <span className={`${chipBase} bg-white text-[#4a3fb5]`}><Building2 size={16} /></span>
    </div>
  )
}

function IdeaVisual() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold" aria-hidden="true">
      {['Profile', 'Skills', 'Intent'].map((t) => (
        <span key={t} className="rounded-full bg-white px-3 py-1.5 text-[#073B3A] shadow-sm">{t}</span>
      ))}
      <ArrowRight size={14} className="text-[#0F8B7D]" />
      <span className="flex h-8 items-center rounded-full bg-[#073B3A] px-3.5 text-white">Mzobs</span>
    </div>
  )
}

/* ---------- chapters -------------------------------------------------------- */

const CHAPTERS = [
  {
    num: '01',
    label: 'The problem',
    bg: '#FFF1C2',
    text: '#4a2218',
    sub: '#7a3b2c',
    accent: '#E76F51',
    nodeIcon: Unlink,
    heading: <>Hiring wasn’t broken by accident.</>,
    body: 'Job seekers were sending applications into systems that often felt like a black hole. Employers were receiving hundreds of applications and still struggling to find the right people.',
    punch: 'Both sides were searching. Neither side was being understood.',
    Visual: BrokenLinkVisual,
    x: 36,
    side: 'right',
    nodeColor: '#8C9C99',
  },
  {
    num: '02',
    label: 'The gap',
    bg: '#DCEBFF',
    text: '#241a66',
    sub: '#4a3fb5',
    accent: VIOLET,
    nodeIcon: Puzzle,
    heading: <>There was a gap between talent and <Serif>opportunity.</Serif></>,
    body: 'There were talented people. There were companies hiring. But something was missing between the two.',
    punch: 'The problem wasn’t talent. It was connection.',
    Visual: GapVisual,
    x: 64,
    side: 'left',
    nodeColor: '#4F9C93',
  },
  {
    num: '03',
    label: 'The idea',
    bg: '#FFDDE8',
    text: INK,
    sub: '#2f6f69',
    accent: TEAL,
    nodeIcon: Lightbulb,
    heading: <>What if both sides could be <Serif>understood?</Serif></>,
    body: 'What if a candidate could be more than a resume? What if an employer could see more than keywords? What if the right context could lead to the right opportunity?',
    punch: 'That question became the beginning of Mzobs.',
    punchColor: VIOLET,
    Visual: IdeaVisual,
    x: 36,
    side: 'right',
    nodeColor: VIOLET,
  },
  {
    num: '04',
    label: 'Mzobs',
    bg: '#2B2A6B',
    text: '#ffffff',
    sub: 'rgba(255,255,255,0.74)',
    accent: '#A99CFF',
    nodeIcon: null,
    heading: <>So we started <Serif>building.</Serif></>,
    body: 'Mzobs brings talent and employers closer through verified opportunities, better signals and a more transparent hiring experience.',
    principles: [
      ['For Talent', 'Better opportunities'],
      ['For Employers', 'Better hiring signals'],
      ['For Everyone', 'A more trusted connection'],
    ],
    x: 64,
    side: 'left',
    nodeColor: TEAL,
  },
  {
    num: '05',
    label: 'What’s next',
    bg: '#D9F4E8',
    text: INK,
    sub: '#3d5654',
    accent: VIOLET,
    nodeIcon: ArrowRight,
    heading: <>We’re still <Serif>building.</Serif></>,
    body: 'Because better hiring isn’t something you finish. It’s something you keep improving.',
    punch: 'And this is only the beginning.',
    x: 40,
    side: 'right',
    nodeColor: VIOLET,
    small: true,
  },
]

const ROW = 100 // viewBox units per chapter row (5 rows → 500)
const nodeY = (i) => ROW / 2 + ROW * i

// One smooth S-curve between every pair of nodes, vertical at each node.
function buildPath() {
  const pts = [{ x: 50, y: 0 }, ...CHAPTERS.map((c, i) => ({ x: c.x, y: nodeY(i) })), { x: 52, y: ROW * CHAPTERS.length }]
  return pts.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const a = pts[i - 1]
    const my = (a.y + p.y) / 2
    return `${d} C ${a.x} ${my}, ${p.x} ${my}, ${p.x} ${p.y}`
  }, '')
}
const PATH_D = buildPath()

function NodeDot({ c, state }) {
  const Icon = c.nodeIcon
  const on = state !== 'future'
  return (
    <span
      className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-[3px] bg-[#FFFFFF] transition-all duration-700"
      style={{
        borderColor: on ? c.nodeColor : 'rgba(7,59,58,0.15)',
        background: state === 'active' ? c.nodeColor : '#FFFFFF',
        color: state === 'active' ? '#fff' : on ? c.nodeColor : 'rgba(7,59,58,0.3)',
        transform: state === 'active' ? 'scale(1.12)' : 'scale(1)',
        boxShadow: state === 'active' ? `0 0 0 7px ${c.nodeColor}26` : 'none',
      }}
    >
      {Icon ? <Icon size={21} /> : <span className="text-[22px] font-extrabold leading-none">M</span>}
    </span>
  )
}

const BOLD_BG = { '01': '#FBD3DE', '02': '#FBEBB0', '03': '#CDE3CC', '04': '#D0E4F7', '05': '#E3DAF8' }
const CARD_INK = '#1F2A37'

function ChapterCard({ c, state, seen }) {
  const { Visual } = c
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={seen ? { opacity: state === 'past' ? 0.88 : 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.9, ease }}
      className={`relative overflow-hidden rounded-[26px] shadow-[0_2px_4px_rgba(7,59,58,0.06),0_26px_50px_-28px_rgba(7,59,58,0.45)] ${c.small ? 'p-6 md:p-8' : 'p-6 md:p-9'}`}
      style={{ background: BOLD_BG[c.num], color: CARD_INK }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[150px] font-extrabold leading-none tracking-[-0.06em] md:text-[190px]"
        style={{ color: CARD_INK, opacity: 0.06 }}
      >
        {c.num}
      </span>
      <div className="relative">
        <p className="text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(31,42,55,0.62)' }}>
          {c.num} / {c.label}
        </p>
        <h2 className={`mt-2.5 font-extrabold leading-[1.1] tracking-[-0.025em] ${c.small ? 'text-[24px] md:text-[28px]' : 'text-[24px] md:text-[30px]'}`}>{c.heading}</h2>
        <p className="mt-3 text-[14.5px] leading-[1.65] md:text-[15px]" style={{ color: 'rgba(31,42,55,0.78)' }}>{c.body}</p>

        {c.punch && (
          <p className="mt-4 border-l-2 pl-3.5 font-serif text-[18px] italic leading-snug md:text-[20px]" style={{ borderColor: 'rgba(31,42,55,0.35)', color: CARD_INK }}>
            {c.punch}
          </p>
        )}
        {c.principles && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[#1F2A37]/15">
            {c.principles.map(([who, what]) => (
              <div key={who} className="sm:px-3 sm:first:pl-0 sm:last:pr-0">
                <p className="text-[13.5px] font-bold text-[#1F2A37]">{who}</p>
                <p className="mt-0.5 text-[12.5px] text-[#1F2A37]/70">{what}</p>
              </div>
            ))}
          </div>
        )}
        {Visual && <div className="mt-5"><Visual /></div>}
      </div>
    </motion.article>
  )
}

// Watches one chapter: reports when it is the focus of the screen and when it has first appeared.
function useChapter(index, setActive) {
  const ref = useRef(null)
  const focus = useInView(ref, { margin: '-40% 0px -40% 0px' })
  const seen = useInView(ref, { amount: 0.2, once: true })
  useEffect(() => {
    if (focus) setActive(index)
  }, [focus, index, setActive])
  return { ref, seen }
}

const stateOf = (active, i) => (active === i ? 'active' : active > i ? 'past' : 'future')

/* ---------- desktop pathway ------------------------------------------------- */

function DesktopRow({ c, i, active, setActive }) {
  const { ref, seen } = useChapter(i, setActive)
  const state = stateOf(active, i)
  const y = `${(nodeY(i) / (ROW * CHAPTERS.length)) * 100}%`
  const right = c.side === 'right'
  return (
    <>
      <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${c.x}%`, top: y }}>
        <NodeDot c={c} state={state} />
      </div>
      <div
        ref={ref}
        className={`absolute -translate-y-1/2 ${c.small ? 'w-[min(430px,38%)]' : 'w-[min(520px,46%)]'}`}
        style={{ top: y, ...(right ? { left: `calc(${c.x}% + 62px)` } : { right: `calc(${100 - c.x}% + 62px)` }) }}
      >
        {/* stem from the path to the card */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-[2px] w-9 rounded-full"
          style={{ background: c.nodeColor, opacity: state === 'future' ? 0.25 : 0.8, ...(right ? { left: -36 } : { right: -36 }) }}
        />
        <ChapterCard c={c} state={state} seen={seen} />
      </div>
    </>
  )
}

function DesktopPath({ active, setActive }) {
  const wrapRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start 65%', 'end 55%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.7 })

  return (
    <div ref={wrapRef} className="relative mx-auto hidden h-[2800px] max-w-[1160px] md:block">
      <svg viewBox={`0 0 100 ${ROW * CHAPTERS.length}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="storyPath" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={ROW * CHAPTERS.length}>
            <stop offset="0" stopColor="#9AA8A6" stopOpacity="0" />
            <stop offset="0.12" stopColor="#9AA8A6" />
            <stop offset="0.3" stopColor="#4F9C93" />
            <stop offset="0.5" stopColor={VIOLET} />
            <stop offset="0.7" stopColor={TEAL} />
            <stop offset="0.88" stopColor={VIOLET} />
            <stop offset="1" stopColor={VIOLET} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={PATH_D} stroke="#073B3A" strokeOpacity="0.1" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <motion.path d={PATH_D} stroke="url(#storyPath)" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength: draw }} />
      </svg>
      {CHAPTERS.map((c, i) => (
        <DesktopRow key={c.num} c={c} i={i} active={active} setActive={setActive} />
      ))}
    </div>
  )
}

/* ---------- mobile pathway -------------------------------------------------- */

function MobileRow({ c, i, active, setActive }) {
  const { ref, seen } = useChapter(i, setActive)
  const state = stateOf(active, i)
  return (
    <div ref={ref} className="relative pb-8 pl-[68px] last:pb-0">
      <div className="absolute left-0 top-5 origin-center scale-[0.78]">
        <NodeDot c={c} state={state} />
      </div>
      <ChapterCard c={c} state={state} seen={seen} />
    </div>
  )
}

function MobilePath({ active, setActive }) {
  const wrapRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start 65%', 'end 55%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.7 })
  return (
    <div ref={wrapRef} className="relative mx-auto max-w-[560px] md:hidden">
      <span className="absolute bottom-0 left-[20px] top-0 w-[3px] -translate-x-1/2 rounded-full bg-[#073B3A]/10" aria-hidden="true" />
      <motion.span
        className="absolute bottom-0 left-[20px] top-0 w-[3px] origin-top -translate-x-1/2 rounded-full"
        style={{ scaleY: draw, background: `linear-gradient(to bottom, #9AA8A6, ${TEAL} 40%, ${VIOLET} 70%, ${TEAL})` }}
        aria-hidden="true"
      />
      {CHAPTERS.map((c, i) => (
        <MobileRow key={c.num} c={c} i={i} active={active} setActive={setActive} />
      ))}
    </div>
  )
}

/* ---------- page ------------------------------------------------------------ */

export default function OurStory() {
  const [active, setActive] = useState(-1)

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans antialiased selection:bg-[#EEEAFE]" style={{ color: INK }}>
      <Seo path="/our-story" {...STATIC_PAGE_SEO['/our-story']} />
      <Navbar />

      {/* Hero */}
      <section className="px-6 pb-10 pt-[140px] text-center md:pb-14 md:pt-[180px]">
        <div className="mx-auto max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }} className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#5C7370]">
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="mt-5 text-[56px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[76px] md:text-[92px]"
          >
            Why Mzobs
            <br />
            <Serif color={VIOLET}>Exists</Serif>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="mx-auto mt-8 max-w-xl text-[18px] leading-relaxed text-[#3d5654]"
          >
            Every idea starts with something that doesn’t feel right. Ours started with the way hiring was working for both sides.
          </motion.p>
          <a href="#journey" className="mt-10 inline-block text-[11.5px] font-semibold uppercase tracking-[0.22em] text-[#073B3A]/50 transition-colors hover:text-[#073B3A]">
            Follow the story ↓
          </a>
        </div>
      </section>

      {/* Journey */}
      <section id="journey" className="scroll-mt-16 px-4 sm:px-6">
        <p className="pb-10 text-center font-serif text-[22px] italic text-[#5C7370] md:pb-0">Here’s how we got here.</p>
        <DesktopPath active={active} setActive={setActive} />
        <MobilePath active={active} setActive={setActive} />
      </section>

      {/* Ending */}
      <section className="px-6 pb-10 pt-20 text-center md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9, ease }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="text-[40px] font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-[60px]">
            That’s why <br className="hidden sm:block" />
            <span style={{ color: VIOLET }}>Mzobs</span> <Serif>exists.</Serif>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[19px] leading-snug text-[#3d5654]">
            To make the distance between talent and opportunity smaller.
          </p>
          <p className="mt-8 font-serif text-[20px] italic text-[#5C7370]">And we’re only getting started.</p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 pt-10 text-center">
        <p className="text-[18px] font-bold">Be part of the journey.</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className="group inline-flex h-12 items-center gap-2 rounded-full px-7 text-[15px] font-bold text-white transition-colors hover:bg-[#0F8B7D]" style={{ background: INK }}>
            Find Jobs
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link to="/employers" className="group inline-flex h-12 items-center gap-2 rounded-full border border-[#073B3A]/25 px-7 text-[15px] font-bold transition-colors hover:border-[#0F8B7D] hover:text-[#0F8B7D]">
            For Employers
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Footer />
      <FloatingQuickNav />
    </div>
  )
}
