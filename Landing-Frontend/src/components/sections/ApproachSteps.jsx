import { ArrowRight } from 'lucide-react'
import TiltCard from '../ui/TiltCard'
import SectionHeading from './SectionHeading'
import { StaggerGroup, StaggerItem } from '../ui/Stagger'
import { cn } from '../../lib/utils'

const STEP_IMAGES = [
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=85"
]

export default function ApproachSteps({ eyebrow = 'OUR APPROACH', title, subtitle, steps = [], tone = 'band' }) {
  return (
    <section className={cn(tone === 'band' && 'bg-bg-secondary border-y border-border')}>
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} className="mb-12" />

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon
            const stepNum = s.n || s.num || `0${i + 1}`
            const stepImg = s.image || STEP_IMAGES[i % STEP_IMAGES.length]

            return (
              <StaggerItem key={stepNum} className="relative">
                <TiltCard className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300 flex flex-col overflow-hidden h-full">
                  <div className="h-32 w-full overflow-hidden relative bg-slate-100">
                    <img
                      src={stepImg}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out-premium"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
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

