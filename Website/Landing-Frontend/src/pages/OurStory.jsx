import { motion } from 'framer-motion'
import { ChevronDown, Compass, Lightbulb, Users2, Target } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import FloatingElement from '../components/ui/FloatingElement'
import Reveal from '../components/ui/Reveal'
import SectionLabel from '../components/ui/SectionLabel'
import SplitText from '../components/ui/SplitText'
import AboutCTABand from '../components/sections/about/AboutCTABand'
import { WHO_WE_ARE_DATA } from '../lib/content'

const CHAPTERS = [
  {
    num: '01',
    icon: Compass,
    tint: 'rose',
    eyebrow: 'The Gap We Saw',
    title: 'Hiring wasn’t broken by accident.',
    body: 'Job seekers were applying into what felt like a void — sending resumes into inboxes with no real way to know if a role was even the right fit. Employers, meanwhile, were sifting through unscreened applications trying to find people who genuinely matched what they needed. Both sides wanted the same outcome — a good match — but neither had a reliable way to get there, and neither had much reason to trust what the other side was presenting.',
  },
  {
    num: '02',
    icon: Lightbulb,
    tint: 'sand',
    eyebrow: 'The Idea',
    title: 'A layer of real verification, not another listing.',
    body: 'That gap is where the idea for Mzobs came from. If job seekers needed a way to prove they were genuinely qualified, and employers needed a way to see only candidates worth their time, the fix wasn’t a bigger job board — it was something sitting between the two sides: a place where profiles and requirements were actually checked before either side ever saw them.',
  },
  {
    num: '03',
    icon: Users2,
    tint: 'sage',
    eyebrow: 'Why Mzobs',
    title: 'Built to bring both sides together.',
    body: 'Mzobs was created to bring job seekers and employers together through a hiring process that’s more trusted, more relevant and more transparent than posting a listing and hoping for the best. Every profile is reviewed before it reaches an employer, and every requirement is understood before candidates are matched to it — so what each side sees is actually worth their time.',
  },
  {
    num: '04',
    icon: Target,
    tint: 'blue',
    eyebrow: 'What We’re Building',
    title: 'A hiring ecosystem worth trusting.',
    body: 'The goal is simple to state and harder to build: a hiring ecosystem where verified talent can connect with genuine opportunities, and employers can consistently discover people who fit what they’re actually hiring for. Not a bigger pile of listings and resumes — a smaller, more trustworthy layer between the two sides, where being on Mzobs actually means something.',
  },
]

const TINTS = {
  rose: 'bg-[var(--careers-tint-rose)] text-[var(--careers-tint-rose-ink)]',
  sand: 'bg-[var(--careers-tint-sand)] text-[var(--careers-tint-sand-ink)]',
  sage: 'bg-[var(--careers-tint-sage)] text-[var(--careers-tint-sage-ink)]',
  blue: 'bg-[var(--careers-tint-blue)] text-[var(--careers-tint-blue-ink)]',
}

const STAT_TINTS = [
  'bg-[var(--careers-tint-rose)]',
  'bg-[var(--careers-tint-sand)]',
  'bg-[var(--careers-tint-sage)]',
  'bg-[var(--careers-tint-blue)]',
]

export default function OurStory() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <title>Our Story — Mzobs</title>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-white pt-[76px] overflow-hidden">
        <FloatingElement duration={9} distance={18} className="absolute top-20 right-[8%] w-80 h-80 rounded-full bg-[var(--careers-tint-sage)]/60 blur-3xl pointer-events-none" />
        <FloatingElement duration={11} delay={1.2} distance={22} className="absolute bottom-0 left-[6%] w-72 h-72 rounded-full bg-[var(--careers-tint-sand)]/50 blur-3xl pointer-events-none" />

        <span
          aria-hidden="true"
          className="absolute -top-6 left-1/2 -translate-x-1/2 font-serif italic text-black/[0.04] text-[260px] sm:text-[340px] leading-none pointer-events-none select-none"
        >
          &ldquo;
        </span>

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 py-24 md:py-32 text-center">
          <Reveal direction="up" duration={0.7} scale={0.95} blur>
            <SectionLabel className="mx-auto">Our Story</SectionLabel>
          </Reveal>
          <h1 className="mt-7 text-5xl sm:text-6xl md:text-7xl font-black text-black leading-[1.05] tracking-tight">
            <SplitText text="Why Mzobs" className="justify-center" />
            <br />
            <SplitText text="Exists" delay={0.15} className="justify-center font-serif italic font-normal text-[var(--careers-accent)]" />
          </h1>
          <Reveal direction="up" delay={0.4} duration={0.85} scale={0.96}>
            <p className="mt-8 text-base sm:text-lg text-[#595959] leading-relaxed font-medium max-w-2xl mx-auto">
              Every hiring platform starts somewhere. Ours started with a gap we kept seeing on both sides of the hiring process — and what we built to close it.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.55} duration={0.8} scale={0.97}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {CHAPTERS.map((chapter) => (
                <a
                  key={chapter.num}
                  href={`#chapter-${chapter.num}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#e0e0e0] bg-white text-[11px] font-bold text-[#595959] hover:border-[var(--careers-accent)] hover:text-[var(--careers-accent)] transition-colors"
                >
                  <span className="tabular-nums text-black/35">{chapter.num}</span>
                  {chapter.eyebrow}
                </a>
              ))}
            </div>
          </Reveal>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-14 flex justify-center text-black/25"
          >
            <ChevronDown size={22} />
          </motion.div>
        </div>
      </section>

      {/* Chapters — alternating timeline, tied together by a center spine */}
      <section className="relative bg-white py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-black/10 to-transparent pointer-events-none" />

          {CHAPTERS.map((chapter, i) => {
            const isEven = i % 2 === 0
            const Icon = chapter.icon
            return (
              <div
                key={chapter.num}
                id={`chapter-${chapter.num}`}
                className="relative py-6 md:py-10 scroll-mt-28"
              >
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-10 z-10 w-14 h-14 rounded-full bg-white border-4 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)] items-center justify-center">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center ${TINTS[chapter.tint]}`}>
                    <Icon size={17} strokeWidth={2.25} />
                  </span>
                </div>

                <Reveal
                  direction={isEven ? 'left' : 'right'}
                  duration={0.8}
                  scale={0.96}
                  blur
                  className={`md:w-[46%] ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden bg-white rounded-3xl border border-black/[0.06] shadow-sm hover:shadow-xl transition-shadow duration-300 p-7 md:p-9"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -top-3 -right-1 font-black text-[100px] sm:text-[120px] leading-none text-black/[0.045] select-none tabular-nums"
                    >
                      {chapter.num}
                    </span>

                    <div className="relative">
                      <span className={`md:hidden inline-flex w-9 h-9 rounded-full items-center justify-center mb-4 ${TINTS[chapter.tint]}`}>
                        <Icon size={16} strokeWidth={2.25} />
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--careers-accent)]">
                        {chapter.eyebrow}
                      </span>
                      <h2 className="mt-3 text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
                        {chapter.title}
                      </h2>
                      <p className="mt-4 text-[15px] sm:text-base text-[#444] leading-relaxed font-medium">
                        {chapter.body}
                      </p>
                    </div>
                  </motion.div>
                </Reveal>
              </div>
            )
          })}
        </div>
      </section>

      {/* Story so far — the numbers behind it */}
      <section className="relative bg-[#fafaf9] py-16 md:py-20 px-6 md:px-12 border-y border-black/[0.05]">
        <div className="max-w-5xl mx-auto">
          <Reveal direction="up" duration={0.7} scale={0.96} blur className="text-center mb-10">
            <SectionLabel className="mx-auto">The Story So Far</SectionLabel>
            <h3 className="mt-3 text-2xl sm:text-3xl font-black text-black tracking-tight">Where it stands today</h3>
          </Reveal>
          <Reveal direction="up" delay={0.15} duration={0.8} scale={0.96} blur>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {WHO_WE_ARE_DATA.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border border-black/[0.06] p-5 md:p-6 text-center ${STAT_TINTS[i % STAT_TINTS.length]}`}
                >
                  <span className="block text-2xl sm:text-3xl font-black text-black tracking-tight tabular-nums">
                    {stat.number}
                  </span>
                  <span className="mt-1.5 block text-[12px] sm:text-[13px] text-[#4a4a4a] font-medium leading-snug">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pull quote */}
      <section className="relative bg-white py-20 md:py-28 px-6 md:px-12 overflow-hidden">
        <FloatingElement duration={10} distance={20} className="absolute top-10 left-[10%] w-64 h-64 rounded-full bg-[var(--careers-tint-blue)]/50 blur-3xl pointer-events-none" />
        <FloatingElement duration={12} delay={1} distance={16} className="absolute bottom-0 right-[8%] w-72 h-72 rounded-full bg-[var(--careers-tint-rose)]/40 blur-3xl pointer-events-none" />

        <Reveal direction="up" duration={0.9} scale={0.95} blur className="relative max-w-3xl mx-auto text-center">
          <span aria-hidden="true" className="block font-serif italic text-black/10 text-7xl leading-none mb-1 select-none">
            &ldquo;
          </span>
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-black leading-snug tracking-tight">
            Being on Mzobs should actually{' '}
            <span className="not-italic font-black text-[var(--careers-accent)]">mean something.</span>
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-black/15" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666]">The Mzobs Team</span>
            <span className="h-px w-10 bg-black/15" />
          </div>
        </Reveal>
      </section>

      <AboutCTABand />

      <Footer />
      <FloatingQuickNav />
    </div>
  )
}
