import { TRUSTED_LOGOS_DATA } from '../../../lib/content'
<<<<<<< Updated upstream
import { useLiveStatRows } from '../../../lib/useLiveStats'
import { FadeInLoad } from './employerMotion'

// Live platform numbers straight from the database (see useLiveStatRows) —
// rendered only when the API returns them, never a fixed figure.
=======
import { FadeInLoad } from './employerMotion'

>>>>>>> Stashed changes
export default function EmployerAuthTrustPanel({ delay = 0.34 }) {
  const stats = useLiveStatRows().slice(0, 2)
  return (
    <FadeInLoad delay={delay} className="mt-10">
<<<<<<< Updated upstream
      {stats.length > 0 && (
      <div className="grid grid-cols-2 gap-5 pb-8 border-b border-[#111827]/10">
        {stats.map((s) => (
          <div key={s.number}>
            <div className="font-sans text-[26px] font-bold text-[#111827] leading-none">{s.number}</div>
            <div className="text-[12px] text-[#667085] mt-1.5 leading-snug">{s.label}</div>
          </div>
        ))}
      </div>
      )}

      <div className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#667085] mb-4">Companies hiring on Mzobs</p>
=======
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#51697e] mb-4">Companies hiring on Mzobs</p>
>>>>>>> Stashed changes
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
