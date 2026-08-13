import Reveal from '../ui/Reveal'
import TiltCard from '../ui/TiltCard'
import ImageReveal from '../ui/ImageReveal'
import { StaggerGroup, StaggerItem } from '../ui/Stagger'
import { WHO_WE_ARE_DATA } from '../../lib/content'

export default function WhoWeAre() {
  return (
    <section id="who-we-are" className="bg-[#EEF3F8] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Statement */}
        <Reveal direction="left" duration={0.9} scale={0.90} blur className="max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-serif font-normal text-[#0A1128] leading-[1.38] tracking-tight">
            {WHO_WE_ARE_DATA.statement.map((item) => item.text).join('')}
          </h2>
        </Reveal>

        {/* 4 Stat Cards Grid */}
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHO_WE_ARE_DATA.stats.map((stat, i) => (
            <StaggerItem key={i}>
              <TiltCard className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300 flex flex-col justify-between h-full">
                <div className="text-4xl sm:text-5xl font-serif font-normal text-[#0B1220] tracking-tight mb-4 group-hover:text-blue-900 group-hover:scale-105 transition-all">
                  {stat.number}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {stat.label}
                </p>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

