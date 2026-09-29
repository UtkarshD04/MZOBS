import { Building2 } from 'lucide-react'
import { Container, SectionHead, initials } from '../primitives'
import { useCompanyJobCounts } from '../../../lib/useHomeData'
import { COMPANIES_HIRING_DATA } from '../../../lib/content'

const COMPANY_NAMES = COMPANIES_HIRING_DATA.map((c) => c.name)

const BADGE_SIZE = 160

// Fallback tone (initials color only, bubble stays plain white) for a
// company with no logo — picked deterministically per company name so the
// same company always lands on the same tone.
const MONOGRAM_TONES = ['#4338CA', '#0F766E', '#B4530A', '#1A63B8', '#B23A72', '#6D28D9']

function CompanyBadge({ company, onSelect }) {
  const jobsLabel =
    company.activeJobs > 0
      ? `${company.activeJobs} open ${company.activeJobs === 1 ? 'position' : 'positions'}`
      : company.activeJobs === 0
        ? 'no open positions right now'
        : 'see open positions'
  const code = company.name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  const textTone = MONOGRAM_TONES[code % MONOGRAM_TONES.length]

  return (
    <button
      type="button"
      onClick={() => onSelect?.({ q: [company.name], location: [], experience: '' })}
      className="group relative shrink-0 rounded-full transition-transform duration-300 motion-safe:hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mz-primary"
      aria-label={`${company.name}: ${jobsLabel}. Show their jobs`}
      title={company.name}
    >
      <span
        style={{ width: BADGE_SIZE, height: BADGE_SIZE }}
        className="flex items-center justify-center overflow-hidden rounded-full bg-white p-6 shadow-mz-card ring-1 ring-mz-line transition-shadow duration-300 group-hover:shadow-mz-lift"
      >
        {company.logo ? (
          <img src={company.logo} alt="" loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
        ) : (
          <span aria-hidden="true" style={{ color: textTone }} className="text-[32px] font-bold">
            {initials(company.name)}
          </span>
        )}
      </span>
    </button>
  )
}

// Mzobs' real, hand-curated logo partners (see COMPANIES_HIRING_DATA in
// lib/content.js) — name/logo/industry are real assets, not placeholders.
// Each card's open-role count is fetched live from the public jobs API
// (useCompanyJobCounts, one company-name search per company — the same
// total a "View company jobs" click would return) so the number shown is
// never a fixed/illustrative figure, only the identities are curated.
export default function CompaniesSection({ onSelect }) {
  const counts = useCompanyJobCounts(COMPANY_NAMES)
  const list = COMPANIES_HIRING_DATA.map((c) => ({ ...c, id: c.name, activeJobs: counts[c.name] ?? null }))
  const loop = list.length >= 5
  const industryCount = new Set(list.map((c) => c.industry).filter(Boolean)).size

  return (
    <section id="companies" aria-labelledby="companies-title" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <Container>
        <SectionHead id="companies-title" eyebrow="Companies" title="Companies hiring through Mzobs">
          {`${list.length} verified partner${list.length === 1 ? '' : 's'}${industryCount > 0 ? ` across ${industryCount} industr${industryCount === 1 ? 'y' : 'ies'}` : ''}.`}
        </SectionHead>
      </Container>

      <div className="mt-14">
        {loop ? (
          <div className="mz-marquee py-3">
            <ul className="mz-marquee-track gap-8 pl-4" style={{ animationDuration: `${Math.max(10, list.length * 2.5)}s` }}>
              {[...list, ...list].map((c, i) => (
                <li key={`${c.id}-${i}`} aria-hidden={i >= list.length ? 'true' : undefined} inert={i >= list.length ? true : undefined}>
                  <CompanyBadge company={c} onSelect={onSelect} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Container>
            <ul className="mz-scroll-x -mx-4 flex snap-x scroll-px-4 gap-8 overflow-x-auto px-4 py-3">
              {list.map((c) => (
                <li key={c.id} className="snap-start"><CompanyBadge company={c} onSelect={onSelect} /></li>
              ))}
              <li className="snap-start">
                <a
                  href="/employers/signup"
                  style={{ width: BADGE_SIZE, height: BADGE_SIZE }}
                  className="group flex flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-mz-line-strong text-center transition-colors hover:border-mz-primary hover:bg-mz-primary-tint/40 focus-visible:outline-2 focus-visible:outline-mz-primary"
                >
                  <Building2 size={20} className="text-mz-primary" aria-hidden="true" />
                  <span className="px-3 text-[11px] font-semibold leading-tight text-mz-primary-strong">Your company here</span>
                </a>
              </li>
            </ul>
          </Container>
        )}
      </div>
    </section>
  )
}
