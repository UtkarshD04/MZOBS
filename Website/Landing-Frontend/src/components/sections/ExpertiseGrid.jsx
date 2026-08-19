import SectionBadge from '../ui/SectionBadge'
// PillButton removed — featured card removed
import Reveal from '../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../ui/Stagger'
import { SERVICES_DATA } from '../../lib/content'
import Photo from './Photo'
import { motion } from 'framer-motion'

export default function ExpertiseGrid({
  eyebrow,
  title,
  subtitle,
  items,
  photoIcon,
  ctaLabel,
  ctaHref,
  reverse
}) {
  const servicesList = items || SERVICES_DATA.services

  return (
    <section id="services" className="bg-[#EEF3F8] py-14 px-6 md:px-12 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <Reveal direction="up" duration={0.9} scale={0.92} blur>
          {eyebrow && <SectionBadge label={eyebrow} />}
          {title ? (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#0B1220] tracking-tight">
              {title}
            </h2>
          ) : (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#0B1220] tracking-tight">
              {SERVICES_DATA.titlePrefix}
              <span className="font-serif italic font-normal text-blue-950">
                {SERVICES_DATA.titleItalic}
              </span>
            </h2>
          )}
          {subtitle && (
            <p className="text-base text-slate-600 mt-2 max-w-2xl">{subtitle}</p>
          )}
        </Reveal>

        {/* 2-Column Grid */}
        <div className={`grid lg:grid-cols-12 gap-8 items-stretch ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          {/* Left 2x2 Services Grid */}
          <StaggerGroup className="lg:col-span-12 grid sm:grid-cols-2 gap-5">
            {servicesList.map((service, i) => {
              const Icon = service.icon

              return (
                <StaggerItem key={i} className="w-full">
                  <motion.div
                    className="bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group"
                    initial={{ borderRadius: 8, opacity: 0, y: 8 }}
                    whileInView={{ borderRadius: 28, opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ borderRadius: 8 }}
                  >
                      {service.image && (
                        <div className="h-36 w-full overflow-hidden relative bg-slate-100">
                          <Photo
                            src={service.image}
                            alt={service.title}
                            rounded="xl"
                            ratio="video"
                            className="w-full h-full object-cover object-right"
                          />

                          {/* Icon overlay on top right */}
                          {Icon && (
                            <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm flex items-center justify-center text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-all duration-300">
                              <Icon size={18} strokeWidth={1.8} />
                            </div>
                          )}
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
                    </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerGroup>

          {/* Featured card removed — showing only 2x2 service cards */}
        </div>
      </div>
    </section>
  )
}
