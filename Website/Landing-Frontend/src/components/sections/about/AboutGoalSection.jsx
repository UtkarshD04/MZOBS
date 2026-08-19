import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import { ABOUT_GOAL_DATA } from '../../../lib/content'

const GOALS = ABOUT_GOAL_DATA.items
const MARQUEE_GOALS = [...GOALS, ...GOALS]

export default function AboutGoalSection() {
  const [active, setActive] = useState(null)

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <Reveal direction="up" duration={0.9} scale={0.94} blur className="text-center mb-12 px-6 md:px-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
          <SplitText text="What Is Our Goal" className="justify-center" />
        </h2>
        <p className="mt-3 text-[15px] sm:text-base text-[#595959] font-medium">
          Six commitments behind every hire on Mzobs — click a card to know more.
        </p>
      </Reveal>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="careers-marquee-track flex w-max gap-6 px-6">
          {MARQUEE_GOALS.map((goal, i) => {
            const Icon = goal.icon
            return (
              <button
                key={goal.title + i}
                type="button"
                onClick={() => setActive(goal)}
                style={{ backgroundColor: goal.bg }}
                className="group shrink-0 w-[220px] sm:w-[248px] rounded-3xl p-6 text-left border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center mb-5">
                  <Icon size={20} strokeWidth={2} style={{ color: goal.ink }} />
                </div>
                <h3 className="text-[17px] font-black leading-snug mb-1.5" style={{ color: goal.ink }}>
                  {goal.title}
                </h3>
                <p className="text-[12.5px] leading-relaxed opacity-80 mb-4" style={{ color: goal.ink }}>
                  {goal.desc}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-[11.5px] font-black uppercase tracking-wide opacity-90 group-hover:gap-1.5 transition-all"
                  style={{ color: goal.ink }}
                >
                  Know more <ArrowUpRight size={14} strokeWidth={2.5} />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F5F5F5] hover:bg-[#e6e6e6] flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-black" />
              </button>

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: active.bg }}
              >
                <active.icon size={22} strokeWidth={2} style={{ color: active.ink }} />
              </div>
              <h3 className="text-2xl font-black text-black tracking-tight mb-3">{active.title}</h3>
              <p className="text-[14.5px] text-[#595959] leading-relaxed font-medium">
                {active.detail}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
