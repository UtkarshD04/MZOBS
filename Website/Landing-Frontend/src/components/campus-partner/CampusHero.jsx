import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Bell, GraduationCap, Sparkles } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

function scrollTo(id) {
  return (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// A small glass "notification" card standing in for a real product moment
// (a job match, a verification badge, an interview reminder) — not a
// literal screenshot, just enough UI texture to read as "real product".
function FloatCard({ className, delay = 0, icon: Icon, iconTone, title, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`mz-glass absolute flex items-center gap-2.5 rounded-2xl px-3.5 py-3 shadow-mz-float ${className}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]" style={{ background: iconTone.bg, color: iconTone.ink }}>
        <Icon size={15} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] font-bold leading-tight text-mz-ink">{title}</span>
        <span className="block text-[11px] leading-tight text-mz-muted">{sub}</span>
      </span>
    </motion.div>
  )
}

export default function CampusHero() {
  return (
    <section className="relative overflow-hidden bg-mz-bg pb-16 pt-24 sm:pt-28 lg:pb-24 lg:pt-32">
      <div className="mz-grid-bg absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-mz-primary/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-mz-accent/12 blur-3xl" aria-hidden="true" />

      <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-mz-primary-tint px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wide text-mz-primary-strong">
            <GraduationCap size={13} aria-hidden="true" />
            For Campuses &amp; Institutions
          </span>

          <h1 className="mt-5 text-[34px] font-black leading-[1.1] tracking-[-0.02em] text-mz-ink sm:text-[44px] lg:text-[50px]">
            Bring <span className="mz-text-gradient">Mzobs</span> to Your Campus
          </h1>

          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-mz-ink-2">
            Connect your students with verified opportunities, smarter career preparation and real-world industry connections — all through Mzobs.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href="#campus-form"
              onClick={scrollTo('campus-form')}
              className="group inline-flex h-[50px] items-center gap-2 rounded-full px-6 text-[15px] font-bold text-white shadow-mz-cta transition-transform duration-200 hover:-translate-y-0.5"
              style={{ backgroundImage: 'var(--mz-gradient)' }}
            >
              Partner With Mzobs
              <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <a
              href="#campus-benefits"
              onClick={scrollTo('campus-benefits')}
              className="inline-flex h-[50px] items-center rounded-full border border-mz-line-strong bg-white px-6 text-[15px] font-bold text-mz-ink transition-colors hover:border-mz-primary hover:text-mz-primary-strong"
            >
              Explore Campus Benefits
            </a>
          </div>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto h-[340px] w-full max-w-[440px] sm:h-[380px]"
        >
          <div className="mz-glass absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[28px] shadow-mz-float">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ backgroundImage: 'var(--mz-gradient)' }}>
              <GraduationCap size={22} aria-hidden="true" />
            </span>
            <span className="mt-2 text-[12.5px] font-bold text-mz-ink">Your Campus</span>
          </div>

          <FloatCard
            className="left-0 top-2 sm:left-2"
            delay={0.3}
            icon={BadgeCheck}
            iconTone={{ bg: 'var(--color-mz-accent-tint)', ink: 'var(--color-mz-accent-ink)' }}
            title="Verified Partner Campus"
            sub="Reviewed by the Mzobs team"
          />
          <FloatCard
            className="right-0 top-10 sm:right-2"
            delay={0.45}
            icon={Bell}
            iconTone={{ bg: 'var(--color-mz-primary-tint)', ink: 'var(--color-mz-primary-strong)' }}
            title="New opportunity matched"
            sub="Frontend Intern · TechCorp"
          />
          <FloatCard
            className="bottom-4 left-4 sm:bottom-8"
            delay={0.6}
            icon={Sparkles}
            iconTone={{ bg: 'var(--color-mz-accent-tint)', ink: 'var(--color-mz-accent-ink)' }}
            title="Mock interview scheduled"
            sub="Tomorrow, 11:00 AM"
          />
        </motion.div>
      </Container>
    </section>
  )
}
