import { ArrowRight } from 'lucide-react'
import TiltCard from '../ui/TiltCard'
import SectionHeading from './SectionHeading'
import { StaggerGroup, StaggerItem } from '../ui/Stagger'
import { cn } from '../../lib/utils'

export default function ApproachSteps({ eyebrow = 'OUR APPROACH', title, subtitle, steps = [], tone = 'band' }) {
  return (
    <section className={cn(tone === 'band' && 'bg-bg-secondary border-y border-border')}>
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} className="mb-12" />

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon
            const stepNum = s.n || s.num || `0${i + 1}`

            return (
              <StaggerItem key={stepNum} className="relative">
                <TiltCard className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300 flex flex-col overflow-hidden h-full">
                  <div className="h-32 w-full overflow-hidden relative bg-slate-100">
                    {s.image && (
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out-premium"
                        loading="lazy"
                      />
                    )}
                    {Icon && (
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-center justify-center text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-all">
                        <Icon size={16} />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 text-xs font-bold text-amber-700 bg-amber-50/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-200/80 shadow-xs">
                      {stepNum}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[14.5px] font-bold text-slate-900 group-hover:text-blue-900 transition-colors">{s.title}</h3>
                      <p className="text-[13px] text-slate-600 mt-1.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </TiltCard>
                {i < steps.length - 1 && (
                  <ArrowRight size={16} className="hidden lg:block absolute top-1/2 -right-[15px] -translate-y-1/2 text-slate-400 z-10" />
                )}
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}

