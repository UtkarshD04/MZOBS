import PillButton from '../ui/PillButton'
import Reveal from '../ui/Reveal'
import ParallaxImage from '../ui/ParallaxImage'
import { OUR_GOAL_DATA } from '../../lib/content'

export default function OurGoalSection({ data }) {
  const goalData = data || OUR_GOAL_DATA

  return (
    <section className="bg-[#EEF3F8] py-20 px-6 md:px-12 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Left White Content Card */}
        <Reveal direction="left" blur className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 ease-out-premium flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#0B1220] tracking-tight leading-tight">
              {goalData.titlePrefix}
              <span className="font-serif italic font-normal text-blue-950">
                {goalData.titleItalic}
              </span>
              {goalData.titleSuffix}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {goalData.desc}
            </p>
          </div>

          <div>
            <PillButton href={goalData.ctaHref || "#about"} variant="dark">
              {goalData.ctaText}
            </PillButton>
          </div>
        </Reveal>

        {/* Right Photo Card */}
        <Reveal direction="right" delay={0.1} blur className="lg:col-span-6 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden shadow-md border border-slate-200/60 group">
          <ParallaxImage
            src={goalData.image}
            alt="Turning hiring into a fair match"
            offset={16}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out-premium"
          />
        </Reveal>
      </div>
    </section>
  )
}

