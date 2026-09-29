import { TRUSTED_LOGOS_DATA } from '../../../lib/content'
import { FadeInLoad } from './employerMotion'

export default function EmployerAuthTrustPanel({ delay = 0.34 }) {
  const stats = useLiveStatRows().slice(0, 2)
  return (
    <FadeInLoad delay={delay} className="mt-10">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#51697e] mb-4">Companies hiring on Mzobs</p>
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
