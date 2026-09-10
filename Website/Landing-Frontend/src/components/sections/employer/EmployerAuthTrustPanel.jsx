import { TRUSTED_LOGOS_DATA, WHO_WE_ARE_DATA, EMPLOYER_TESTIMONIAL } from '../../../lib/content'
import { FadeInLoad } from './employerMotion'

// Real stats/logos/testimonial only — same ones already published on the
// About and Employer pages (content.js). Nothing here is invented for this
// panel: no fabricated counts, no stock logos.
const STATS = [WHO_WE_ARE_DATA.stats[1], WHO_WE_ARE_DATA.stats[2]]

export default function EmployerAuthTrustPanel({ delay = 0.34 }) {
  return (
    <FadeInLoad delay={delay} className="mt-10">
      <div className="grid grid-cols-2 gap-5 pb-8 border-b border-[#20251F]/10">
        {STATS.map((s) => (
          <div key={s.number}>
            <div className="font-serif text-[26px] font-bold text-[#20251F] leading-none">{s.number}</div>
            <div className="text-[12px] text-[#526051] mt-1.5 leading-snug">{s.label}</div>
          </div>
        ))}
      </div>

      <blockquote className="mt-8 pl-4 border-l-2 border-[#246B5A]">
        <p className="text-[14px] text-[#20251F] italic leading-relaxed">&ldquo;{EMPLOYER_TESTIMONIAL.quote}&rdquo;</p>
        <footer className="mt-2.5 text-[12.5px] text-[#526051]">
          <span className="font-bold text-[#20251F] not-italic">{EMPLOYER_TESTIMONIAL.name}</span> · {EMPLOYER_TESTIMONIAL.title}
        </footer>
      </blockquote>

      <div className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#7a8f79] mb-4">Companies hiring on Mzobs</p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          {TRUSTED_LOGOS_DATA.logos.map((logo) => (
            <img
              key={logo.name}
              src={logo.logo}
              alt={logo.name}
              title={logo.name}
              className="h-6 sm:h-7 max-w-[90px] object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </FadeInLoad>
  )
}
