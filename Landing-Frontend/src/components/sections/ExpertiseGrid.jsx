import SectionBadge from '../ui/SectionBadge'
import PillButton from '../ui/PillButton'
import { SERVICES_DATA } from '../../lib/content'

export default function ExpertiseGrid() {
  return (
    <section id="services" className="bg-[#EEF3F8] py-14 px-6 md:px-12 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div>
          <SectionBadge label={SERVICES_DATA.badge} />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#0B1220] tracking-tight">
            {SERVICES_DATA.titlePrefix}
            <span className="font-serif italic font-normal text-blue-950">
              {SERVICES_DATA.titleItalic}
            </span>
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 2x2 Services Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            {SERVICES_DATA.services.map((service, i) => {
              const Icon = service.icon
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {service.image && (
                    <div className="h-36 w-full overflow-hidden relative bg-slate-100">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                      
                      {/* Icon overlay on top right */}
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm flex items-center justify-center text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-all duration-300">
                        <Icon size={18} strokeWidth={1.8} />
                      </div>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#0B1220] mb-1.5 group-hover:text-blue-900 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Featured Card with Background Image */}
          <div className="lg:col-span-5 relative min-h-75 rounded-3xl overflow-hidden shadow-lg group">
            <img
              src={SERVICES_DATA.featuredCard.bgImage}
              alt="Start your hiring journey"
              className="w-full h-full object-cover object-center brightness-[0.85] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/30 to-transparent flex flex-col justify-end p-8 sm:p-10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-sans font-medium text-white tracking-tight leading-snug">
                {SERVICES_DATA.featuredCard.titlePrefix}
                <span className="font-serif italic font-normal text-slate-100">
                  {SERVICES_DATA.featuredCard.titleItalic}
                </span>
              </h3>
              <div>
                <PillButton href="#contact" variant="white">
                  {SERVICES_DATA.featuredCard.ctaText}
                </PillButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
