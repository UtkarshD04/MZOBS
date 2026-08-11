import SectionBadge from '../ui/SectionBadge'
import { APPROACH_DATA } from '../../lib/content'

export default function ApproachSection() {
  return (
    <section id="approach" className="bg-[#EEF3F8] py-20 px-6 md:px-12 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="max-w-4xl space-y-6">
          <SectionBadge label={APPROACH_DATA.badge} />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-medium text-[#0B1220] leading-[1.3] tracking-tight">
            {APPROACH_DATA.heading.map((item, idx) =>
              item.italic ? (
                <span key={idx} className="font-serif italic font-normal text-blue-950 px-1">
                  {item.text}
                </span>
              ) : (
                <span key={idx}>{item.text}</span>
              )
            )}
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Large Photo Container */}
          <div className="lg:col-span-5 min-h-[420px] rounded-3xl overflow-hidden shadow-md border border-slate-200/60 group">
            <img
              src={APPROACH_DATA.image}
              alt="How Mzobs verifies every hire"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Right 4 Stacked Step Cards */}
          <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
            {APPROACH_DATA.steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-6 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-bold text-[#0B1220] group-hover:text-blue-900 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  <div className="text-2xl sm:text-3xl font-serif font-light text-slate-300 group-hover:text-blue-600 transition-colors shrink-0">
                    {step.num}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
