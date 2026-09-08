import { useEffect, useState } from 'react'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { COMPANIES_HIRING_DATA } from '../../../lib/content'
import { fetchLatestJobs } from '../../../lib/publicJobs'
import { ExplorerTextLink } from '../../ui/ExplorerButton'

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function CompanyLogoTile({ company }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = company.logo && !logoFailed

  return (
    <div className="w-12 h-12 rounded-lg bg-white border border-(--explorer-border) flex items-center justify-center p-2 shrink-0">
      {showLogo ? (
        <img
          src={company.logo}
          alt=""
          onError={() => setLogoFailed(true)}
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <span className="flex items-center justify-center w-full h-full rounded-md bg-(--explorer-teal-surface) text-(--explorer-teal) text-[12px] font-bold">
          {initialsOf(company.name)}
        </span>
      )}
    </div>
  )
}

// Deterministic per-industry tone (same industry string -> same tone) so
// repeats like "Solar Energy" or "Steel & Metals" read as a visual group
// instead of a random color per row.
const INDUSTRY_TONES = [
  'bg-(--explorer-teal-surface) text-(--explorer-teal)',
  'bg-(--explorer-blue-surface) text-(--explorer-blue)',
  'bg-(--explorer-bg) text-(--explorer-navy)',
]
function industryTone(industry) {
  const hash = [...industry].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return INDUSTRY_TONES[hash % INDUSTRY_TONES.length]
}

// `onSelect` filters "Latest jobs" further down this same page by company
// name — same pattern as the hero search bar, quick-discovery pills and
// category tiles (see Home.jsx).
export default function CompaniesHiring({ onSelect }) {
  // Real, per-company open-role counts — fetched live from the same public
  // jobs API the rest of the page searches against (matching jobs by
  // company name, exactly what "View company jobs" itself does), never a
  // fixed figure baked into content.js. `null` means "still checking" for
  // that company, not zero.
  const [counts, setCounts] = useState({})

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    Promise.allSettled(
      COMPANIES_HIRING_DATA.map((c) => fetchLatestJobs({ q: [c.name], limit: 1 }, { signal: controller.signal }))
    ).then((results) => {
      if (cancelled) return
      const next = {}
      results.forEach((r, i) => {
        next[COMPANIES_HIRING_DATA[i].name] = r.status === 'fulfilled' ? r.value.total : null
      })
      setCounts(next)
    })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  const industryCount = new Set(COMPANIES_HIRING_DATA.map((c) => c.industry)).size

  return (
    <section id="companies" className="bg-(--explorer-bg) py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <Reveal direction="up" duration={0.7} className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-(--explorer-navy) tracking-tight">Companies hiring through MZOBS</h2>
          <p className="mt-2 text-[15px] text-(--explorer-muted)">
            {COMPANIES_HIRING_DATA.length} verified partners across {industryCount} industries.
          </p>
        </Reveal>

        <StaggerGroup className="flex flex-col bg-white border border-(--explorer-border) rounded-xl overflow-hidden">
          {COMPANIES_HIRING_DATA.map((company) => {
            const tone = industryTone(company.industry)
            const count = counts[company.name]
            return (
              <StaggerItem key={company.name}>
                <div className="group flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 border-b border-(--explorer-border) last:border-b-0 hover:bg-(--explorer-bg) transition-colors">
                  <div className="flex items-center gap-3 min-w-50 flex-1">
                    <CompanyLogoTile company={company} />
                    <div className="min-w-0">
                      <p className="font-bold text-[14px] text-(--explorer-navy) truncate" title={company.name}>
                        {company.name}
                      </p>
                      <span className={`inline-flex items-center mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${tone}`}>
                        {company.industry}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 ml-auto">
                    {count != null && count > 0 && (
                      <span className="hidden sm:block text-[12.5px] font-bold text-(--explorer-navy)">
                        {count} open role{count === 1 ? '' : 's'}
                      </span>
                    )}

                    <ExplorerTextLink
                      onClick={() => onSelect?.({ q: company.name, location: '', experience: '' })}
                      className="text-[13px]"
                    >
                      View company jobs
                    </ExplorerTextLink>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
