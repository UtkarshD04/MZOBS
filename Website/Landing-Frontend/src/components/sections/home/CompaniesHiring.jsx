import { useState } from 'react'
import Reveal from '../../ui/Reveal'
import { COMPANIES_HIRING_DATA } from '../../../lib/content'

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function CompanyCircle({ company, onSelect }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = company.logo && !logoFailed

  return (
    <button
      type="button"
      onClick={() => onSelect?.({ q: company.name, location: '', experience: '' })}
      title={`${company.name} — view jobs`}
      aria-label={`${company.name}, view company jobs`}
      className="shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white border border-(--explorer-border) shadow-[0_10px_28px_-14px_rgba(15,23,42,0.25)] flex items-center justify-center p-7 sm:p-9 cursor-pointer transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-(--explorer-blue)"
    >
      {showLogo ? (
        <img
          src={company.logo}
          alt=""
          loading="lazy"
          onError={() => setLogoFailed(true)}
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <span className="text-(--explorer-teal) text-lg font-bold">{initialsOf(company.name)}</span>
      )}
    </button>
  )
}

// Logos glide right-to-left in a seamless loop. The set is repeated so one
// half of the track is always wider than the viewport, and the CSS animation
// moves the track by exactly that half (see .company-marquee-track).
// `onSelect` filters "Latest jobs" further down this page by company name.
export default function CompaniesHiring({ onSelect }) {
  const industryCount = new Set(COMPANIES_HIRING_DATA.map((c) => c.industry)).size
  const half = [...COMPANIES_HIRING_DATA, ...COMPANIES_HIRING_DATA]

  return (
    <section id="companies" className="bg-(--explorer-bg) py-16 md:py-20 overflow-hidden">
      <Reveal direction="up" duration={0.7} className="mb-10 px-6 md:px-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-(--explorer-navy) tracking-tight">Companies hiring through MZOBS</h2>
        <p className="mt-2 text-[15px] text-(--explorer-muted)">
          {COMPANIES_HIRING_DATA.length} verified partners across {industryCount} industries.
        </p>
      </Reveal>

      <div className="company-marquee py-4">
        <ul className="company-marquee-track flex w-max gap-6 sm:gap-8 pr-6 sm:pr-8">
          {[0, 1].map((copy) =>
            half.map((company, i) => (
              <li key={`${copy}-${i}`} aria-hidden={copy === 1 ? 'true' : undefined}>
                <CompanyCircle company={company} onSelect={onSelect} />
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  )
}
