import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import FloatingElement from '../../ui/FloatingElement'

export default function EmployerHero() {
  return (
    <section id="home" className="relative bg-white pt-[76px] overflow-hidden">
      <FloatingElement duration={9} distance={16} className="absolute top-24 right-[8%] w-64 h-64 rounded-full bg-[#F5F5F5] blur-3xl pointer-events-none" />
      <FloatingElement duration={11} delay={1.5} distance={20} className="absolute bottom-10 left-[4%] w-72 h-72 rounded-full bg-[var(--careers-mint)]/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left: Headline, Copy, CTAs */}
        <div className="lg:col-span-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[54px] font-black text-black leading-[1.1] tracking-tight">
            <SplitText text="Hire Verified Talent," />
            <br />
            <SplitText text="Not A Stack Of Unread Resumes." delay={0.15} wordClassName="text-[var(--careers-accent)]" />
          </h1>

          <Reveal direction="up" delay={0.35} duration={0.85} scale={0.96}>
            <p className="mt-6 text-base sm:text-lg text-[#595959] max-w-xl leading-relaxed font-medium">
              Connect with verified talent and discover candidates relevant to your requirements — all within a hiring ecosystem built for better employer–candidate connections.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.45} duration={0.8} scale={0.97}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/employers/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--careers-accent)] text-white text-sm font-bold border border-[var(--careers-accent)] hover:bg-white hover:text-[#595959] hover:border-[#666] transition-colors"
              >
                Create your account <ArrowRight size={16} />
              </Link>
              <Link
                to="/employers/signin"
                className="inline-flex items-center px-6 py-3 rounded-full bg-white text-[#595959] text-sm font-bold border border-[#666] hover:bg-[var(--careers-accent)] hover:text-white hover:border-[var(--careers-accent)] transition-colors"
              >
                Sign in
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Right: Hero Banner Image */}
        <div className="lg:col-span-7">
          <Reveal direction="right" duration={1} delay={0.2} scale={0.9} blur>
            <motion.img
              src="/images/heroemployer.jpg"
              alt="Hiring team reviewing verified candidates on Mzobs"
              fetchPriority="high"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
              className="w-full h-auto"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
