import SectionBadge from '../ui/SectionBadge'
import PillButton from '../ui/PillButton'
import Reveal from '../ui/Reveal'
import ParallaxImage from '../ui/ParallaxImage'
import { StaggerGroup, StaggerItem } from '../ui/Stagger'
import { CASE_STUDIES_DATA } from '../../lib/content'

export default function CaseStudiesSection() {
  return (
    <section id="case-studies" className="bg-[#EEF3F8] py-20 px-6 md:px-12 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <Reveal direction="up" className="text-center max-w-2xl mx-auto">
          <SectionBadge label={CASE_STUDIES_DATA.badge} />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#0B1220] tracking-tight">
            {CASE_STUDIES_DATA.titlePrefix}
            <span className="font-serif italic font-normal text-blue-950">
              {CASE_STUDIES_DATA.titleItalic}
            </span>
            {CASE_STUDIES_DATA.titleSuffix}
          </h2>
        </Reveal>

        {/* 3 Stacked Large Case Study Cards */}
        <StaggerGroup className="space-y-8">
          {CASE_STUDIES_DATA.items.map((item) => (
            <StaggerItem
              key={item.id}
              className="relative min-h-[420px] sm:min-h-[460px] rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 group"
            >
              {/* Background Image */}
              <ParallaxImage
                src={item.bgImage}
                alt={item.title}
                offset={15}
                className="w-full h-full absolute inset-0 object-cover object-center brightness-[0.7] group-hover:scale-105 transition-transform duration-700 ease-out-premium"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/40 to-black/20" />

              {/* Top Tags */}
              <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex flex-wrap gap-2 z-10">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-blue-600/90 backdrop-blur-md text-white font-bold text-[10px] tracking-wider uppercase shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom Glass Content Overlay Box */}
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl text-white">
                <h3 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight leading-snug">
                  {item.italicWords ? (
                    item.title.split(item.italicWords).map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <span className="font-serif italic font-normal text-slate-100">
                            {item.italicWords}
                          </span>
                        )}
                      </span>
                    ))
                  ) : (
                    item.title
                  )}
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl font-normal">
                  {item.desc}
                </p>

                <div className="pt-2">
                  <PillButton href="#contact" variant="white" className="text-xs sm:text-sm">
                    View Case Study
                  </PillButton>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Centered View More Button */}
        <div className="text-center pt-4">
          <PillButton href="#case-studies" variant="dark" className="px-8 py-3.5 text-sm font-semibold">
            View More Case Studies
          </PillButton>
        </div>
      </div>
    </section>
  )
}
