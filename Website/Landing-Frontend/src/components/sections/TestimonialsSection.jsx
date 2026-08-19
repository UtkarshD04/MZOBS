import { Play } from 'lucide-react'
import SectionBadge from '../ui/SectionBadge'
import Reveal from '../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../ui/Stagger'
import { TESTIMONIALS_DATA } from '../../lib/content'

export default function TestimonialsSection({ eyebrow, title, items }) {
  const testimonialItems = items || TESTIMONIALS_DATA.items
  const gridCols =
    testimonialItems.length >= 5 ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 'sm:grid-cols-2 md:grid-cols-3'

  return (
    <section id="testimonials" className="bg-[#EEF3F8] py-20 px-6 md:px-12 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <Reveal direction="up" className="text-center max-w-2xl mx-auto">
          <SectionBadge label={eyebrow || TESTIMONIALS_DATA.badge} />
          {title ? (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#0B1220] tracking-tight">
              {title}
            </h2>
          ) : (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#0B1220] tracking-tight">
              {TESTIMONIALS_DATA.titlePrefix}
              <span className="font-serif italic font-normal text-blue-950">
                {TESTIMONIALS_DATA.titleItalic}
              </span>
              {TESTIMONIALS_DATA.titleSuffix}
            </h2>
          )}
        </Reveal>

        {/* Portrait Testimonial Cards Grid */}
        <StaggerGroup className={`grid grid-cols-1 ${gridCols} gap-5`}>
          {testimonialItems.map((item) => (
            <StaggerItem
              key={item.id}
              className="relative min-h-[380px] rounded-2xl overflow-hidden shadow-md group border border-slate-200/60 hover:shadow-lg transition-all duration-300 ease-out-premium hover:-translate-y-1.5"
            >
              {/* Client Portrait Photo */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full absolute inset-0 object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-500 ease-out-premium"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/95 via-[#0B1220]/40 to-transparent flex flex-col justify-end p-5 text-white" />

              {/* Content & Play Button */}
              <div className="relative z-10 p-5 flex flex-col justify-end h-full space-y-3">
                <p className="text-xs text-slate-200 leading-snug font-normal italic">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-[10px] text-slate-300">{item.title}</p>
                  </div>

                  {/* Video Testimonial Play Button */}
                  <button
                    aria-label={`Play testimonial from ${item.name}`}
                    className="w-8 h-8 rounded-full bg-white text-[#0B1220] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <Play size={14} fill="#0B1220" className="ml-0.5" />
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
