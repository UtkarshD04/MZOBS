import { useCallback, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Briefcase, Building2, Check, GraduationCap, Handshake, Headset, LineChart, Plus, Users } from 'lucide-react'
import { Container } from '../mz/primitives'
import CampusModal from './CampusModal'

const FEATURES = [
  { label: 'Verified Opportunities', icon: BadgeCheck },
  { label: 'Career Readiness', icon: GraduationCap },
  { label: 'Industry Connections', icon: Handshake },
]

const ease = [0.22, 1, 0.36, 1]

const BENEFITS = [
  { title: 'Verified jobs & internships', text: 'Relevant, screened opportunities for your students.', icon: BadgeCheck },
  { title: 'Career preparation', text: 'Resume, interview and skill readiness support.', icon: GraduationCap },
  { title: 'Employer access', text: 'Direct connections with companies hiring freshers.', icon: Building2 },
  { title: 'Campus hiring drives', text: 'Help organising placement drives and hiring events.', icon: Users },
  { title: 'Placement insights', text: 'A clearer view of where your students are heading.', icon: LineChart },
  { title: 'A dedicated contact', text: 'One Mzobs point of contact for your institution.', icon: Headset },
]

const STEPS = [
  { title: 'Submit your details', text: 'Tell us about your institution in a short form. It takes about two minutes.' },
  { title: 'We review & verify', text: 'Our team checks your details and gets in touch with you.' },
  { title: 'Your students get started', text: 'Once verified, your campus joins Mzobs and students can access opportunities.' },
]

const FAQ = [
  { q: 'Who can add their campus?', a: 'Colleges, universities, polytechnics, management institutes and other educational institutions.' },
  { q: 'Does it cost anything?', a: 'No. Submitting a campus request is free. Our team will share the details when they contact you.' },
  { q: 'What happens after I submit?', a: 'Our team reviews your request and contacts you on the email and phone you provide.' },
  { q: 'How long does verification take?', a: 'We aim to get back to you soon after reviewing your details. Share accurate contact information to speed it up.' },
]

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}
const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
})

function Chip({ icon: Icon, eyebrow, title, accent, calm, delay = 0 }) {
  return (
    <motion.div
      animate={calm ? undefined : { y: [0, -3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
      className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center"
    >
      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_8px_20px_-10px_rgba(7,59,58,0.35)] ring-1 ${accent ? 'text-[#0f8b7d] ring-[#0f8b7d]/20' : 'text-[#0F8B7D] ring-[#0F8B7D]/15'}`}>
        <Icon size={21} aria-hidden="true" />
      </span>
      <span>
        <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-mz-muted">{eyebrow}</span>
        <span className="block text-[15px] font-extrabold leading-tight text-[#073B3A] sm:text-[17px]">{title}</span>
      </span>
    </motion.div>
  )
}

function PreviewCard({ calm }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease }}
      className="relative mx-auto mt-9 w-full max-w-[580px]"
    >
      <div className="absolute -inset-6 rounded-[40px] bg-[radial-gradient(ellipse_at_50%_60%,rgba(15, 139, 125,0.18),transparent_70%)] blur-xl" aria-hidden="true" />
      <motion.div
        animate={calm ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[24px] border border-white/80 bg-white/70 px-5 py-6 shadow-[0_30px_60px_-28px_rgba(7,59,58,0.35)] ring-1 ring-[#073B3A]/[0.06] backdrop-blur-xl sm:px-8 sm:py-7"
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <Chip icon={GraduationCap} eyebrow="Your" title="Campus" calm={calm} />
          <ArrowRight size={16} className="mt-[-26px] shrink-0 text-[#0F8B7D]/60" aria-hidden="true" />
          <motion.div
            animate={calm ? undefined : { y: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#073B3A] text-[22px] font-extrabold text-white shadow-[0_12px_26px_-10px_rgba(7,59,58,0.7)]">
              m
            </span>
            <span className="block text-[17px] font-extrabold leading-tight text-[#073B3A]">Mzobs</span>
          </motion.div>
          <ArrowRight size={16} className="mt-[-26px] shrink-0 text-[#0F8B7D]/60" aria-hidden="true" />
          <Chip icon={Briefcase} eyebrow="More" title="Opportunities" accent calm={calm} delay={2} />
        </div>
        <p className="mt-5 border-t border-[#073B3A]/[0.07] pt-4 text-center text-[13px] text-mz-muted">
          Connecting students with the right opportunities.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function CampusRegister() {
  const calm = useReducedMotion()
  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E6F5F1] via-[#F1F4FB] to-[#F8FAFC] pb-8 pt-24 sm:pt-28">
        <div className="pointer-events-none absolute -left-32 top-10 h-[380px] w-[380px] rounded-full bg-[#0F8B7D]/[0.16] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-32 top-24 h-[420px] w-[420px] rounded-full bg-[#0f8b7d]/[0.16] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#073B3A_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.045]" aria-hidden="true" />
        <Container className="relative">
          <div className="mx-auto max-w-[700px] text-center">
            <motion.p {...rise(0)} className="text-[11.5px] font-bold uppercase tracking-[0.24em] text-[#0F8B7D]">
              For Campuses
            </motion.p>
            <motion.h1 {...rise(0.08)} className="mt-3 text-[38px] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#073B3A] sm:text-[52px] lg:text-[58px]">
              Bring Your <span className="bg-gradient-to-r from-[#0F8B7D] to-[#0f8b7d] bg-clip-text text-transparent">Campus</span>
              <br /> to Mzobs.
            </motion.h1>
            <motion.p {...rise(0.16)} className="mx-auto mt-4 max-w-[500px] text-[15.5px] leading-relaxed text-mz-ink-2 sm:text-[17px]">
              Connect your students with verified opportunities, career preparation and industry connections.
            </motion.p>
            <motion.div {...rise(0.24)} className="mt-6">
              <button
                type="button"
                onClick={openModal}
                className="inline-flex h-[52px] items-center gap-2 rounded-full bg-[#073B3A] px-8 text-[15.5px] font-bold text-white shadow-[0_14px_30px_-14px_rgba(7,59,58,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0F8B7D]"
              >
                <Plus size={18} aria-hidden="true" />
                Add Your Campus
              </button>
              <p className="mt-2.5 text-[12px] text-mz-muted">For colleges · universities · institutions</p>
            </motion.div>
          </div>

          <PreviewCard calm={calm} />

          <motion.ul {...rise(0.5)} className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {FEATURES.map(({ label, icon: Icon }) => (
              <li key={label} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#073B3A]/80">
                <Check size={13} strokeWidth={3} className="text-[#0F8B7D]" aria-hidden="true" />
                <Icon size={14} className="text-[#0F8B7D]" aria-hidden="true" />
                {label}
              </li>
            ))}
          </motion.ul>
        </Container>
      </section>

      <section className="bg-[#F8FAFC] py-14 sm:py-16">
        <Container>
          <motion.div {...reveal} className="mx-auto max-w-[1000px]">
            <p className="text-center text-[11.5px] font-bold uppercase tracking-[0.24em] text-[#0F8B7D]">What your campus gets</p>
            <h2 className="mx-auto mt-2 max-w-[560px] text-center text-[26px] font-extrabold tracking-tight text-[#073B3A] sm:text-[32px]">
              Everything students need, <span className="text-[#0f8b7d]">in one place.</span>
            </h2>
            <div className="mt-9 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map(({ title, text, icon: Icon }) => (
                <div key={title} className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F8B7D]/10 text-[#0F8B7D]">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[15.5px] font-bold text-[#073B3A]">{title}</p>
                    <p className="mt-0.5 text-[13.5px] leading-relaxed text-mz-muted">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="border-t border-[#073B3A]/[0.07] bg-white py-14 sm:py-16">
        <Container>
          <motion.div {...reveal} className="mx-auto max-w-[900px]">
            <h2 className="text-center text-[26px] font-extrabold tracking-tight text-[#073B3A] sm:text-[32px]">How it works</h2>
            <ol className="mt-9 grid gap-8 sm:grid-cols-3">
              {STEPS.map(({ title, text }, i) => (
                <li key={title} className="text-center sm:text-left">
                  <span className="text-[34px] font-extrabold leading-none tracking-tight text-[#0f8b7d]/70">0{i + 1}</span>
                  <p className="mt-2 text-[16px] font-bold text-[#073B3A]">{title}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-mz-muted">{text}</p>
                </li>
              ))}
            </ol>
          </motion.div>
        </Container>
      </section>

      <section className="border-t border-[#073B3A]/[0.07] bg-[#F8FAFC] py-14 sm:py-16">
        <Container>
          <motion.div {...reveal} className="mx-auto max-w-[760px]">
            <h2 className="text-center text-[26px] font-extrabold tracking-tight text-[#073B3A] sm:text-[32px]">Good to know</h2>
            <div className="mt-8 divide-y divide-[#073B3A]/10 rounded-2xl border border-[#073B3A]/10 bg-white">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-[#073B3A]">
                    {q}
                    <Plus size={16} className="shrink-0 text-[#0F8B7D] transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
                  </summary>
                  <p className="mt-2 text-[14px] leading-relaxed text-mz-muted">{a}</p>
                </details>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="border-t border-[#073B3A]/[0.07] bg-[#F8FAFC] py-9 text-center">
        <h2 className="text-[20px] font-extrabold tracking-tight text-[#073B3A] sm:text-[22px]">Ready to connect your campus?</h2>
        <button
          type="button"
          onClick={openModal}
          className="group mt-4 inline-flex h-[48px] items-center gap-2 rounded-full bg-[#073B3A] px-7 text-[15px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0F8B7D]"
        >
          Add Your Campus
          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </section>

      <CampusModal open={open} onClose={closeModal} />
    </>
  )
}
