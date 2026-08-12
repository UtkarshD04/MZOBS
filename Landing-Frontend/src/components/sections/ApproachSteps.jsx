import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import SectionHeading from './SectionHeading'
import { cn } from '../../lib/utils'

export default function ApproachSteps({ eyebrow = 'OUR APPROACH', title, subtitle, steps = [], tone = 'band' }) {
  return (
    <section className={cn(tone === 'band' && 'bg-bg-secondary border-y border-border')}>
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} className="mb-12" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon
            const stepNum = s.n || s.num || `0${i + 1}`

            return (
              <div key={stepNum} className="relative">
                <Card pad className="h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-900/10 text-blue-900 flex items-center justify-center">
                      {Icon && <Icon size={16} />}
                    </div>
                    <span className="text-xs font-bold text-amber-600 tracking-wide">{stepNum}</span>
                  </div>
                  <h3 className="text-[14.5px] font-semibold text-slate-900">{s.title}</h3>
                  <p className="text-[13px] text-slate-600 mt-1.5 leading-relaxed">{s.desc}</p>
                </Card>
                {i < steps.length - 1 && <ArrowRight size={16} className="hidden lg:block absolute top-1/2 -right-[22px] -translate-y-1/2 text-slate-400" />}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
