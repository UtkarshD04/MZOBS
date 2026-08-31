import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import FloatingElement from '../components/ui/FloatingElement'
import Reveal from '../components/ui/Reveal'
import SectionLabel from '../components/ui/SectionLabel'
import SplitText from '../components/ui/SplitText'
import AboutCTABand from '../components/sections/about/AboutCTABand'

const CHAPTERS = [
  {
    num: '01',
    eyebrow: 'The Gap We Saw',
    title: 'Hiring wasn’t broken by accident.',
    body: 'Job seekers were applying into what felt like a void — sending resumes into inboxes with no real way to know if a role was even the right fit. Employers, meanwhile, were sifting through unscreened applications trying to find people who genuinely matched what they needed. Both sides wanted the same outcome — a good match — but neither had a reliable way to get there, and neither had much reason to trust what the other side was presenting.',
    bg: 'bg-white',
  },
  {
    num: '02',
    eyebrow: 'The Idea',
    title: 'A layer of real verification, not another listing.',
    body: 'That gap is where the idea for Mzobs came from. If job seekers needed a way to prove they were genuinely qualified, and employers needed a way to see only candidates worth their time, the fix wasn’t a bigger job board — it was something sitting between the two sides: a place where profiles and requirements were actually checked before either side ever saw them.',
    bg: 'bg-[var(--careers-tint-sage)]',
  },
  {
    num: '03',
    eyebrow: 'Why Mzobs',
    title: 'Built to bring both sides together.',
    body: 'Mzobs was created to bring job seekers and employers together through a hiring process that’s more trusted, more relevant and more transparent than posting a listing and hoping for the best. Every profile is reviewed before it reaches an employer, and every requirement is understood before candidates are matched to it — so what each side sees is actually worth their time.',
    bg: 'bg-white',
  },
  {
    num: '04',
    eyebrow: 'What We’re Building',
    title: 'A hiring ecosystem worth trusting.',
    body: 'The goal is simple to state and harder to build: a hiring ecosystem where verified talent can connect with genuine opportunities, and employers can consistently discover people who fit what they’re actually hiring for. Not a bigger pile of listings and resumes — a smaller, more trustworthy layer between the two sides, where being on Mzobs actually means something.',
    bg: 'bg-[var(--careers-tint-sand)]',
  },
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

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 py-24 md:py-36 text-center">
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

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-16 flex justify-center text-black/25"
          >
            <ChevronDown size={22} />
          </motion.div>
        </div>
      </section>

      {/* Chapters — alternating tint bands, tied together by a thin spine */}
      <section className="relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--careers-accent)]/25 to-transparent pointer-events-none" />

        {CHAPTERS.map((chapter) => (
          <div key={chapter.num} className={`relative ${chapter.bg} px-6 md:px-12 py-16 md:py-24 border-t border-black/[0.05] first:border-t-0`}>
            <Reveal direction="up" duration={0.85} scale={0.96} blur className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-12 gap-6 md:gap-14 items-start">
                <div className="md:col-span-4 flex items-baseline gap-3 md:block">
                  <span className="block text-[64px] sm:text-[88px] md:text-[110px] font-black leading-none tracking-tight text-black/[0.09] tabular-nums select-none">
                    {chapter.num}
                  </span>
                </div>
                <div className="md:col-span-8">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--careers-accent)]">
                    {chapter.eyebrow}
                  </span>
                  <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight leading-tight max-w-2xl">
                    {chapter.title}
                  </h2>
                  <p className="mt-5 text-[15px] sm:text-base text-[#444] leading-relaxed font-medium max-w-2xl">
                    {chapter.body}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        ))}
      </section>

      <AboutCTABand />

      <Footer />
      <FloatingQuickNav />
    </div>
  )
}
