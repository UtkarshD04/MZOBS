import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import FloatingElement from '../../ui/FloatingElement'
import GrainOverlay from '../../ui/GrainOverlay'
import Marquee from '../../ui/Marquee'
import MagneticButton from '../../ui/MagneticButton'

const MARQUEE_ITEMS = [
  '◆ Verified Talent',
  '◆ Zero Fake Resumes',
  '◆ Faster Hiring',
  '◆ Built For Employers',
]

export default function EmployerHero() {
  const sectionRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const parallaxX = useSpring(px, { stiffness: 60, damping: 20 })
  const parallaxY = useSpring(py, { stiffness: 60, damping: 20 })

  function handleMouseMove(e) {
    if (shouldReduceMotion || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    px.set(((e.clientX - rect.left) / rect.width - 0.5) * 40)
    py.set(((e.clientY - rect.top) / rect.height - 0.5) * 40)
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative bg-(--jobs-navy) pt-[76px] overflow-hidden"
    >
      <GrainOverlay opacity={0.05} />

      <motion.div style={{ x: parallaxX, y: parallaxY }}>
        <FloatingElement duration={9} distance={16} className="absolute top-24 right-[8%] w-64 h-64 rounded-full bg-(--jobs-teal-dark)/25 blur-3xl pointer-events-none" />
        <FloatingElement duration={11} delay={1.5} distance={20} className="absolute bottom-10 left-[4%] w-72 h-72 rounded-full bg-(--jobs-blue)/20 blur-3xl pointer-events-none" />
      </motion.div>

      {/* Faint grid backdrop — editorial-studio texture behind the headline */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]"
      />

      <div className="relative max-w-4xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-10 md:pb-14 text-center">
        <Reveal direction="up" delay={0} duration={0.6}>
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-(--jobs-teal) mb-6">
            <span className="w-6 h-px bg-(--jobs-teal)" />
            For Employers
            <span className="w-6 h-px bg-(--jobs-teal)" />
          </span>
        </Reveal>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[54px] font-black text-white leading-[1.1] tracking-tight">
          <SplitText text="Hire Verified Talent," />
          <br />
          <SplitText text="Not A Stack Of Unread Resumes." delay={0.15} wordClassName="text-(--jobs-teal)" />
        </h1>

        <Reveal direction="up" delay={0.35} duration={0.85} scale={0.96}>
          <p className="mt-6 text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed font-medium">
            Connect with verified talent and discover candidates relevant to your requirements — all within a hiring ecosystem built for better employer–candidate connections.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.45} duration={0.8} scale={0.97}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              <Link
                to="/employers/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-(--jobs-teal) text-(--jobs-navy) text-sm font-bold hover:bg-white transition-colors"
              >
                Create your account <ArrowRight size={16} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to="/employers/signin"
                className="inline-flex items-center px-6 py-3 rounded-full bg-transparent text-white text-sm font-bold border border-white/25 hover:border-white/60 transition-colors"
              >
                Sign in
              </Link>
            </MagneticButton>
          </div>
        </Reveal>
      </div>

      {/* Editorial marquee divider */}
      <div className="relative border-t border-white/10 bg-white/[0.03] py-4">
        <Marquee
          items={MARQUEE_ITEMS}
          duration={26}
          itemClassName="text-[13px] font-bold uppercase tracking-[0.15em] text-white/40 mx-6 [&::first-letter]:text-(--jobs-teal)"
        />
      </div>
    </section>
  )
}
