import SectionBadge from '../ui/SectionBadge'
import PillButton from '../ui/PillButton'
import { OUR_GOAL_DATA } from '../../lib/content'

export default function OurGoalSection() {
  return (
    <section className="bg-[#EEF3F8] py-20 px-6 md:px-12 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Left White Content Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <SectionBadge label={OUR_GOAL_DATA.badge} />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#0B1220] tracking-tight leading-tight">
              {OUR_GOAL_DATA.titlePrefix}
              <span className="font-serif italic font-normal text-blue-950">
                {OUR_GOAL_DATA.titleItalic}
              </span>
              {OUR_GOAL_DATA.titleSuffix}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {OUR_GOAL_DATA.desc}
            </p>
          </div>

          <div>
            <PillButton href="#about" variant="dark">
              {OUR_GOAL_DATA.ctaText}
            </PillButton>
          </div>
        </div>

        {/* Right Photo Card */}
        <div className="lg:col-span-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden shadow-md border border-slate-200/60 group">
          <img
            src={OUR_GOAL_DATA.image}
            alt="Transforming Strategy into Results"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    </section>
  )
}
