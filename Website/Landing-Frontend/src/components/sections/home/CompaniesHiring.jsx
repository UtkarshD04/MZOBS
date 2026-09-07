import { useState } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { COMPANIES_HIRING_DATA } from '../../../lib/content'
import { EMPLOYEE_APP_URL } from '../../../lib/config'

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
    <div className="w-14 h-14 rounded-xl bg-white border border-(--jobs-border) flex items-center justify-center p-2.5 shrink-0">
      {showLogo ? (
        <img
          src={company.logo}
          alt=""
          onError={() => setLogoFailed(true)}
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <span className="flex items-center justify-center w-full h-full rounded-lg bg-(--jobs-teal-tint) text-(--jobs-teal-dark) text-[13px] font-bold">
          {initialsOf(company.name)}
        </span>
      )}
    </div>
  )
}

// Deterministic per-industry tone (same industry string -> same tone) so
// repeats like "Solar Energy" or "Steel & Metals" read as a visual group
// instead of a random color per card. Kept to the page's own --jobs-*
// palette, same technique as CategoryGrid's TONES.
const INDUSTRY_TONES = [
  { chip: 'bg-(--jobs-teal-tint) text-(--jobs-teal-dark)', dot: 'bg-(--jobs-teal-dark)' },
  { chip: 'bg-(--jobs-blue-tint) text-(--jobs-blue-dark)', dot: 'bg-(--jobs-blue-dark)' },
  { chip: 'bg-(--jobs-gold-soft) text-(--jobs-navy)', dot: 'bg-(--jobs-gold)' },
]
function industryTone(industry) {
  const hash = [...industry].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return INDUSTRY_TONES[hash % INDUSTRY_TONES.length]
}

export default function CompaniesHiring() {
  const totalRoles = COMPANIES_HIRING_DATA.reduce((sum, c) => sum + c.openRoles, 0)
  const industryCount = new Set(COMPANIES_HIRING_DATA.map((c) => c.industry)).size
  const topRoles = Math.max(...COMPANIES_HIRING_DATA.map((c) => c.openRoles))

  return (
    <section id="companies" className="bg-white border-t border-(--jobs-border) py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="flex flex-wrap items-end justify-between gap-6 mb-9">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-(--jobs-navy) tracking-tight">Companies hiring through MZOBS</h2>
            <p className="mt-2 text-[15px] text-(--jobs-ink-soft)">Explore roles from teams building across India.</p>
          </div>
          <div className="flex items-center gap-5">
            <div>
              <p className="text-2xl font-extrabold text-(--jobs-navy)">{totalRoles}+</p>
              <p className="text-[12px] text-(--jobs-ink-soft)">open roles</p>
            </div>
            <div className="w-px h-9 bg-(--jobs-border)" aria-hidden="true" />
            <div>
              <p className="text-2xl font-extrabold text-(--jobs-navy)">{industryCount}</p>
              <p className="text-[12px] text-(--jobs-ink-soft)">industries</p>
            </div>
          </div>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPANIES_HIRING_DATA.map((company) => {
            const tone = industryTone(company.industry)
            const isTopHirer = company.openRoles === topRoles
            return (
              <StaggerItem key={company.name}>
                <a
                  href={`${EMPLOYEE_APP_URL}/app/jobs`}
                  className="group relative flex flex-col gap-4 h-full bg-white border border-(--jobs-border) rounded-2xl p-5 hover:border-(--jobs-teal-dark) hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--jobs-teal-dark) transition-all duration-200"
                >
                  {isTopHirer && (
                    <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-(--jobs-gold-soft) text-(--jobs-navy)">
                      <Sparkles size={10} aria-hidden="true" /> Most active
                    </span>
                  )}

                  <div className="flex items-start gap-3">
                    <CompanyLogoTile company={company} />
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="font-bold text-[14px] text-(--jobs-navy) leading-snug truncate" title={company.name}>
                        {company.name}
                      </p>
                      <span className={`inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${tone.chip}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
                        {company.industry}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-3.5 border-t border-(--jobs-border) flex items-center justify-between">
                    <span className="text-[12.5px] font-bold text-(--jobs-navy)">
                      {company.openRoles} open role{company.openRoles === 1 ? '' : 's'}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-(--jobs-teal-dark) opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      aria-hidden="true"
                    />
                  </div>
                </a>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

        <div className="mt-10 flex justify-center">
          <a
            href={`${EMPLOYEE_APP_URL}/app/jobs`}
            className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-(--jobs-blue) hover:text-(--jobs-blue-dark) transition-colors"
          >
            Explore all opportunities <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
