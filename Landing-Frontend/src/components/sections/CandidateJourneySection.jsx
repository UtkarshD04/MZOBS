import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button, { goldSolidClass } from '../ui/Button'
import { CANDIDATE_JOURNEY_DATA } from '../../lib/candidateJourneyData'

export default function CandidateJourneySection() {
  return (
    <section
      id="candidate-journey"
      className="bg-[#FAF8F5] py-10 sm:py-14 px-4 sm:px-6 lg:px-12 border-t border-stone-200/40 relative overflow-hidden select-none"
    >
      {/* ============================================================
         THE WOW ELEMENT — CONTINUOUS ARTWORK FLOWING RIBBON SVG
         Runs continuously down the section
      ============================================================ */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg
          className="w-full h-full min-h-[900px] opacity-70"
          viewBox="0 0 1400 1900"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mzobsRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1C2B4E" stopOpacity="0.8" />
              <stop offset="25%" stopColor="#3B82F6" stopOpacity="0.7" />
              <stop offset="55%" stopColor="#A855F7" stopOpacity="0.6" />
              <stop offset="80%" stopColor="#EC4899" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.7" />
            </linearGradient>

            <linearGradient id="mzobsRibbonGradSubtle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#C084FC" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Primary Flowing Ribbon Lines */}
          <path
            d="M 300 120 C 700 150, 1100 280, 1050 480 C 1000 680, 300 780, 350 1020 C 400 1240, 1150 1280, 1050 1500 C 950 1700, 450 1780, 700 1850"
            fill="none"
            stroke="url(#mzobsRibbonGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          <path
            d="M 320 135 C 720 165, 1120 295, 1070 495 C 1020 695, 320 795, 370 1035 C 420 1255, 1170 1295, 1070 1515 C 970 1715, 470 1795, 720 1865"
            fill="none"
            stroke="url(#mzobsRibbonGradSubtle)"
            strokeWidth="1.5"
            strokeDasharray="10 8"
          />

          <path
            d="M 280 105 C 680 135, 1080 265, 1030 465 C 980 665, 280 765, 330 1005 C 380 1225, 1130 1265, 1030 1485 C 930 1685, 430 1765, 680 1835"
            fill="none"
            stroke="url(#mzobsRibbonGradSubtle)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14 relative z-10">

        {/* ============================================================
           1. SECTION HEADER
        ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-2"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#1C2B4E]/70 tracking-widest uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1C2B4E]" />
            {CANDIDATE_JOURNEY_DATA.badge}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-[#0A1128] tracking-tight uppercase leading-tight">
            FROM PROFILE TO{' '}
            <span className="font-serif italic font-normal text-blue-900 capitalize px-1">
              Opportunity
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto pt-1">
            {CANDIDATE_JOURNEY_DATA.subtitle}
          </p>
        </motion.div>

        {/* ============================================================
           2. 5 EDITORIAL CONTINUOUS ARTWORK STAGES (COMPACT HEIGHT)
        ============================================================ */}
        <div className="space-y-10 sm:space-y-14">
          {CANDIDATE_JOURNEY_DATA.steps.map((step) => {
            const isImageLeft = step.align === 'image-left'

            return (
              <div key={step.id} className="relative">
                <div
                  className={`grid lg:grid-cols-12 gap-6 lg:gap-10 items-center ${
                    isImageLeft ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* PHOTOGRAPH ARTWORK CONTAINER */}
                  <motion.div
                    initial={{ opacity: 0, x: isImageLeft ? -60 : 60, y: 15 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className={`lg:col-span-6 relative group ${
                      isImageLeft ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    {/* Ambient Glow behind Photo */}
                    <div
                      className={`absolute -inset-4 rounded-full bg-gradient-to-tr ${step.lineAccent} blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none`}
                    />

                    {/* Compact Image with Organic Cutout Mask */}
                    <div
                      className={`relative overflow-hidden shadow-xl transition-all duration-500 group-hover:shadow-2xl ${
                        step.shapeType === 'arch-left'
                          ? 'rounded-t-[3rem] rounded-b-xl'
                          : step.shapeType === 'curve-right'
                          ? 'rounded-tr-[3.5rem] rounded-bl-[2rem] rounded-tl-xl rounded-br-xl'
                          : 'rounded-[2rem]'
                      }`}
                    >
                      <img
                        src={step.image}
                        alt={step.imageAlt}
                        className="w-full h-[180px] sm:h-[220px] lg:h-[240px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out-premium"
                        loading="lazy"
                      />
                    </div>
                  </motion.div>

                  {/* EDITORIAL TYPOGRAPHY CONTAINER */}
                  <motion.div
                    initial={{ opacity: 0, x: isImageLeft ? 60 : -60, y: 15 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className={`lg:col-span-6 space-y-2.5 ${
                      isImageLeft ? 'lg:order-2 lg:pl-6' : 'lg:order-1 lg:pr-6'
                    }`}
                  >
                    {/* Minimal Number Badge */}
                    <div className="text-lg sm:text-xl font-mono font-light text-slate-400 tracking-wider">
                      {step.num}
                    </div>

                    {/* Stage Title */}
                    <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#0A1128] tracking-tight leading-tight uppercase">
                      {step.title}
                    </h3>

                    {/* Short Paragraph */}
                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ============================================================
           3. ELEGANT CLOSING MOMENT & CTA
        ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center py-6 px-6 sm:px-12 relative z-10 max-w-2xl mx-auto space-y-3"
        >
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-sans font-bold tracking-tight text-[#0A1128] uppercase leading-tight">
            {CANDIDATE_JOURNEY_DATA.cta.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            {CANDIDATE_JOURNEY_DATA.cta.subtitle}
          </p>

          <div className="pt-2 flex items-center justify-center">
            <Button
              to="/employees/signup"
              variant="primary"
              size="lg"
              pill
              className={goldSolidClass}
            >
              {CANDIDATE_JOURNEY_DATA.cta.buttonText} <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
