import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Briefcase, Building2, MapPin, ShieldCheck, Sparkles, User } from 'lucide-react'
import { Container } from '../mz/primitives'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

function scrollToHowItWorks(e) {
  e.preventDefault()
  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Floating glass badge — the small "Verified Partner" / "PAN India" style
// labels orbiting the network visual.
function FloatBadge({ icon: Icon, label, className = '', delay = 0, slow = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`assoc-glass ${slow ? 'assoc-floating-slow' : 'assoc-floating'} absolute flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-[0_8px_24px_-8px_rgba(16,24,40,0.18)] ${className}`}
    >
      <Icon size={13} className="shrink-0 text-[#2563EB]" aria-hidden="true" />
      <span className="whitespace-nowrap text-[11.5px] font-bold text-[#101828]">{label}</span>
    </motion.div>
  )
}

// A mini "entity" card standing in for a candidate / employer / opportunity
// — an abstract network diagram, not a literal stock-photo illustration.
function EntityCard({ icon: Icon, title, lines, tone, className = '' }) {
  return (
    <div className={`assoc-glass relative z-10 w-[164px] rounded-2xl p-3.5 shadow-[0_20px_40px_-20px_rgba(16,24,40,0.25)] ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-[9px]" style={{ background: tone.bg, color: tone.ink }}>
        <Icon size={15} aria-hidden="true" />
      </span>
      <p className="mt-2 text-[12.5px] font-bold text-[#101828]">{title}</p>
      <div className="mt-1.5 space-y-1">
        {lines.map((w, i) => (
          <span key={i} className="block h-1.5 rounded-full" style={{ width: w, background: 'rgba(16,24,40,0.1)' }} />
        ))}
      </div>
    </div>
  )
}

export default function AssociateHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#F8FAFC] pb-16 pt-24 sm:pt-28 lg:pb-24 lg:pt-32">
      <div className="assoc-blob assoc-drift -left-24 -top-24 h-[420px] w-[420px] bg-[#4F46E5]/20" aria-hidden="true" />
      <div className="assoc-blob assoc-drift right-[-10%] top-10 h-[360px] w-[360px] bg-[#0F8F83]/14" aria-hidden="true" style={{ animationDelay: '3s' }} />
      <div className="mz-grid-bg absolute inset-0 opacity-70" aria-hidden="true" />

      <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Left — copy */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wide text-[#4F46E5]">
            <Sparkles size={13} aria-hidden="true" />
            Partner with Mzobs
          </span>

          <h1 className="mt-5 text-[38px] font-extrabold leading-[1.08] tracking-[-0.025em] text-[#101828] sm:text-[48px] lg:text-[56px]">
            Become an{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#6366F1] bg-clip-text text-transparent">Associate.</span>
            <br />
            Grow with{' '}
            <span className="bg-gradient-to-r from-[#6366F1] to-[#0F8F83] bg-clip-text text-transparent">Mzobs.</span>
          </h1>

          <p className="mt-5 max-w-xl text-[17px] font-semibold leading-relaxed text-[#344054] sm:text-[18.5px]">
            Bring opportunities to your city. Build your network. Grow your placement business with Mzobs.
          </p>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#475467]">
            Join the Mzobs hiring network and connect candidates with verified opportunities from employers across industries and cities.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              to={CLIENT_ONLY_ROUTES.associateApply}
              className="group inline-flex h-[50px] items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-6 text-[15px] font-bold text-white shadow-[0_14px_30px_-10px_rgba(37,99,235,0.55)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              Become an Associate
              <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <a
              href="#how-it-works"
              onClick={scrollToHowItWorks}
              className="inline-flex h-[50px] items-center rounded-full border border-[#D5D8E4] bg-white px-6 text-[15px] font-bold text-[#101828] transition-colors hover:border-[#2563EB] hover:text-[#2563EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              How It Works
            </a>
          </div>

          <p className="mt-6 flex items-center gap-2 text-[13px] font-semibold text-[#475467]">
            <ShieldCheck size={15} className="shrink-0 text-[#0F8F83]" aria-hidden="true" />
            Every application is reviewed by the Mzobs team before onboarding.
          </p>
        </motion.div>

        {/* Right — abstract recruitment-network visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto h-[360px] w-full max-w-[460px] sm:h-[420px] lg:h-[460px]"
        >
          <FloatBadge icon={BadgeCheck} label="Verified Partner" className="left-1 top-2 sm:left-4" delay={0.3} />
          <FloatBadge icon={Sparkles} label="More Opportunities" className="bottom-2 left-0 sm:bottom-6" delay={0.45} slow />
          <FloatBadge icon={MapPin} label="PAN India" className="bottom-10 right-0 sm:bottom-16 sm:right-2" delay={0.6} />
          <FloatBadge icon={Building2} label="Growing Network" className="right-0 top-0 sm:right-4 sm:top-4" delay={0.5} slow />

          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <line className="assoc-line" x1="200" y1="200" x2="90" y2="130" stroke="#4F46E5" strokeWidth="1.5" opacity="0.5" />
            <line className="assoc-line" x1="200" y1="200" x2="310" y2="130" stroke="#2563EB" strokeWidth="1.5" opacity="0.5" />
            <line className="assoc-line" x1="200" y1="200" x2="200" y2="320" stroke="#0F8F83" strokeWidth="1.5" opacity="0.5" />
          </svg>

          <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-[17px] font-extrabold text-white shadow-[0_18px_40px_-12px_rgba(37,99,235,0.55)]">
            Mzobs
          </div>

          <EntityCard
            icon={User}
            title="Candidate Profile"
            lines={['70%', '45%']}
            tone={{ bg: '#EEF2FF', ink: '#4F46E5' }}
            className="absolute left-0 top-[18%]"
          />
          <EntityCard
            icon={Building2}
            title="Employer"
            lines={['60%', '40%']}
            tone={{ bg: '#EFF6FF', ink: '#2563EB' }}
            className="absolute right-0 top-[14%]"
          />
          <EntityCard
            icon={Briefcase}
            title="Job Opportunity"
            lines={['65%', '50%']}
            tone={{ bg: '#E6F6F3', ink: '#0F8F83' }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
          />
        </motion.div>
      </Container>
    </section>
  )
}
