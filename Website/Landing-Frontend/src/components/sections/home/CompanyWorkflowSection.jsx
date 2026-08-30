import { motion } from 'framer-motion'
import SplitText from '../../ui/SplitText'
import Reveal from '../../ui/Reveal'
import TiltCard from '../../ui/TiltCard'
import { StaggerGroup } from '../../ui/Stagger'
import { COMPANY_WORKFLOW_DATA } from '../../../lib/content'

function cardVariants(i) {
  const fromLeft = i % 2 === 0
  return {
    hidden: {
      opacity: 0,
      x: fromLeft ? -220 : 220,
      rotate: fromLeft ? -10 : 10,
      scale: 0.85,
    },
    show: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 110, damping: 15, mass: 0.9 },
    },
  }
}

function WorkflowCard({ step, i, isLast }) {
  const Icon = step.icon

  return (
    <motion.div variants={cardVariants(i)} className={isLast ? 'sm:col-span-2 flex justify-center' : ''}>
      <TiltCard
        maxTilt={6}
        scale={1.045}
        y={-10}
        className={`relative rounded-3xl p-7 border border-black/4 shadow-sm hover:shadow-2xl transition-shadow duration-500 overflow-hidden ${isLast ? 'w-full sm:max-w-md' : 'w-full'}`}
        style={{ backgroundColor: step.bg }}
      >
        {/* hover sheen */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 25% 15%, ${step.accent}2e, transparent 65%)` }}
        />
        {/* glow blob behind icon */}
        <div
          className="absolute top-3 left-3 w-20 h-20 rounded-full blur-2xl opacity-0 scale-75 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500 pointer-events-none"
          style={{ backgroundColor: step.accent }}
        />

        <div className="relative z-10">
          <motion.span
            className="inline-block text-[13px] font-black tracking-wide"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.25 + i * 0.06, type: 'spring', stiffness: 260, damping: 16 }}
            style={{ color: step.accent }}
          >
            {step.num}
          </motion.span>

          <motion.div
            className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center my-4 shadow-sm"
            whileHover={{ scale: 1.15, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 16 }}
          >
            <Icon size={22} strokeWidth={2} style={{ color: step.accent }} />
          </motion.div>

          <h3 className="text-[16px] font-black text-black mb-1.5 leading-snug transition-transform duration-300 group-hover:translate-x-0.5">
            {step.title}
          </h3>
          <p className="text-[12.5px] text-black/70 leading-relaxed">{step.desc}</p>
        </div>

        <div
          className="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-500 w-10 group-hover:w-full"
          style={{ backgroundColor: step.accent }}
        />
      </TiltCard>
    </motion.div>
  )
}

export default function CompanyWorkflowSection() {
  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl mx-auto text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
            <SplitText text={`${COMPANY_WORKFLOW_DATA.titlePrefix}${COMPANY_WORKFLOW_DATA.titleItalic}${COMPANY_WORKFLOW_DATA.titleSuffix}`} />
          </h2>
          <p className="text-[15px] sm:text-base text-[#595959] leading-relaxed font-medium">{COMPANY_WORKFLOW_DATA.subtitle}</p>
        </Reveal>

        <StaggerGroup staggerDelay={0.14} className="mt-14 grid sm:grid-cols-2 gap-6">
          {COMPANY_WORKFLOW_DATA.steps.map((step, i) => (
            <WorkflowCard key={step.num} step={step} i={i} isLast={i === COMPANY_WORKFLOW_DATA.steps.length - 1} />
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
