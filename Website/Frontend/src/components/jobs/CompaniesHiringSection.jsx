import { useState } from 'react'
import Card, { CardHead } from '../ui/Card'
import { COMPANIES_HIRING_DATA } from '../../lib/companiesHiringData'

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
    <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center p-1.5 flex-shrink-0">
      {showLogo ? (
        <img src={company.logo} alt="" onError={() => setLogoFailed(true)} className="max-w-full max-h-full object-contain" />
      ) : (
        <span className="flex items-center justify-center w-full h-full rounded-md bg-navy-tint text-navy text-[11px] font-bold">
          {initialsOf(company.name)}
        </span>
      )}
    </div>
  )
}

// "Companies hiring through Mzobs" — same curated partner list the marketing
// site and mobile app show (Website/Landing-Frontend's COMPANIES_HIRING_DATA),
// with open-role counts computed from the jobs this dashboard already loaded
// (no extra request per company, unlike the logged-out marketing page which
// has no jobs list of its own to reuse).
export default function CompaniesHiringSection({ jobs = [], onSelectCompany }) {
  return (
    <Card>
      <CardHead>
        <span className="text-[15px] font-semibold">Companies hiring through Mzobs</span>
      </CardHead>
      <div className="flex flex-col">
        {COMPANIES_HIRING_DATA.map((company, i) => {
          const openRoles = jobs.filter((j) => j.company === company.name).length
          return (
            <div
              key={company.name}
              className={`flex items-center gap-3 px-[22px] py-3.5 ${i < COMPANIES_HIRING_DATA.length - 1 ? 'border-b border-border' : ''}`}
            >
              <CompanyLogoTile company={company} />
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold truncate">{company.name}</div>
                <div className="text-xs text-ink-tertiary">{company.industry}</div>
              </div>
              {openRoles > 0 ? (
                <button
                  type="button"
                  onClick={() => onSelectCompany?.(company.name)}
                  className="text-navy font-semibold text-[12.5px] hover:underline flex-shrink-0"
                >
                  {openRoles} open role{openRoles === 1 ? '' : 's'}
                </button>
              ) : (
                <span className="text-ink-tertiary text-[12.5px] flex-shrink-0">No openings right now</span>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
