import { Briefcase, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../../ui/Reveal'
import SectionLabel from '../../ui/SectionLabel'
import SplitText from '../../ui/SplitText'
import FloatingElement from '../../ui/FloatingElement'

export default function EmployerHero() {
  return (
    <section id="home" className="relative bg-white pt-[76px] overflow-hidden">
      <FloatingElement duration={9} distance={16} className="absolute top-24 right-[8%] w-64 h-64 rounded-full bg-[#F5F5F5] blur-3xl pointer-events-none" />
      <FloatingElement duration={11} delay={1.5} distance={20} className="absolute bottom-10 left-[4%] w-72 h-72 rounded-full bg-[var(--careers-mint)]/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left: Headline, Copy, CTAs */}
        <div className="lg:col-span-7">
          <Reveal direction="up" duration={0.7} scale={0.95} blur>
            <SectionLabel>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase size={14} /> For Employers
              </span>
            </SectionLabel>
          </Reveal>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[54px] font-black text-black leading-[1.1] tracking-tight">
            <SplitText text="Hire Verified Talent," />
            <br />
            <SplitText text="Not A Stack Of Unread Resumes." delay={0.15} wordClassName="text-[#333333]" />
          </h1>

          <Reveal direction="up" delay={0.35} duration={0.85} scale={0.96}>
            <p className="mt-6 text-base sm:text-lg text-[#595959] max-w-xl leading-relaxed font-medium">
              A single pipeline for requirements, interviews, offers and billing — filled only with candidates our team has personally screened.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.45} duration={0.8} scale={0.97}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/employers/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#333333] text-white text-sm font-bold border border-[#333333] hover:bg-white hover:text-[#595959] hover:border-[#666] transition-colors"
              >
                Create your account <ArrowRight size={16} />
              </Link>
              <Link
                to="/employers/signin"
                className="inline-flex items-center px-6 py-3 rounded-full bg-white text-[#595959] text-sm font-bold border border-[#666] hover:bg-[#333333] hover:text-white hover:border-[#333333] transition-colors"
              >
                Sign in
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Right: Hero Banner Image */}
        <div className="lg:col-span-5">
          <Reveal direction="right" duration={1} delay={0.2} scale={0.9} blur>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
              className="relative rounded-[32px] overflow-hidden shadow-2xl border border-[#e0e0e0] aspect-[4/5] bg-[#F5F5F5] group"
            >
              <img
                src="/images/employer-hero-new.jpg"
                alt="Hiring team reviewing verified candidates on Mzobs"
                fetchPriority="high"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-lg text-xs font-bold text-black flex items-center justify-between">
                <div>
                  <span className="text-[#333333] font-extrabold block text-sm">Pre-Screened Pipeline</span>
                  <span className="text-[#666] font-medium text-[11px]">Only candidates worth your time</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
