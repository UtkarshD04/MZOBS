import SectionBadge from '../ui/SectionBadge'
import { WHO_WE_ARE_DATA } from '../../lib/content'

export default function WhoWeAre() {
  return (
    <section id="who-we-are" className="bg-[#EEF3F8] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Statement */}
        <div className="max-w-4xl space-y-6">
          <SectionBadge label={WHO_WE_ARE_DATA.badge} />
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-medium text-[#0B1220] leading-[1.3] tracking-tight">
            {WHO_WE_ARE_DATA.statement.map((item, idx) =>
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

        {/* 4 Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHO_WE_ARE_DATA.stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="text-4xl sm:text-5xl font-serif font-normal text-[#0B1220] tracking-tight mb-4 group-hover:text-blue-900 transition-colors">
                {stat.number}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
