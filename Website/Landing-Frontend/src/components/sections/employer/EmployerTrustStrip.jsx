import { useEffect, useState } from 'react'
import CountUp from '../../ui/CountUp'
import { fetchHiringCompanies, fetchPlatformStats } from '../../../lib/publicJobs'

// Real, live platform numbers — never a fixed/illustrative figure (see
// Backend's getPublicPlatformStats). Renders nothing extra while loading;
// each stat just sits at 0 until the real number arrives, then counts up.
const STATS = [
  { key: 'liveJobs', label: 'Live openings' },
  { key: 'hiringCompanies', label: 'Companies hiring now' },
]

export default function EmployerTrustStrip() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      fetchPlatformStats({ signal: controller.signal }),
      fetchHiringCompanies({ signal: controller.signal }).catch(() => null),
    ])
      .then(([platform, hiring]) => setStats({ liveJobs: platform.liveJobs, hiringCompanies: hiring?.total ?? hiring?.companies?.length ?? 0 }))
      .catch((err) => { if (err?.name !== 'AbortError') setStats(null) })
    return () => controller.abort()
  }, [])

  return (
    <section className="bg-[#111827] px-6 md:px-12">
      <div className="max-w-7xl mx-auto py-6 md:py-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {STATS.map((stat, i) => (
          <span key={stat.key} className="flex items-center gap-10">
            <span className="text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#eeefff] tabular-nums">
                <CountUp value={stats?.[stat.key] ?? 0} duration={900} />
              </span>
              <span className="block mt-0.5 text-[11px] sm:text-[12px] font-bold uppercase text-[#eeefff]/60 tracking-[0.1em]">{stat.label}</span>
            </span>
            {i < STATS.length - 1 && <span className="w-px h-9 bg-[#eeefff]/15" aria-hidden="true" />}
          </span>
        ))}
      </div>
    </section>
  )
}
