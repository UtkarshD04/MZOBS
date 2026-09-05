import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
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
    <div className="w-14 h-14 rounded-lg bg-white border border-(--jobs-border) flex items-center justify-center p-2.5">
      {showLogo ? (
        <img
          src={company.logo}
          alt=""
          onError={() => setLogoFailed(true)}
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <span className="flex items-center justify-center w-full h-full rounded bg-(--jobs-teal-tint) text-(--jobs-teal-dark) text-[13px] font-bold">
          {initialsOf(company.name)}
        </span>
      )}
    </div>
  )
}

export default function CompaniesHiring() {
  return (
    <section id="companies" className="bg-white border-t border-(--jobs-border) py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="max-w-xl mb-9">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-(--jobs-navy) tracking-tight">Companies hiring through MZOBS</h2>
          <p className="mt-2 text-[15px] text-(--jobs-ink-soft)">Explore roles from teams building across India.</p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {COMPANIES_HIRING_DATA.map((company) => (
            <StaggerItem key={company.name}>
              <a
                href={`${EMPLOYEE_APP_URL}/app/jobs`}
                className="group flex flex-col items-center text-center gap-3 h-full bg-white border border-(--jobs-border) rounded-xl p-5 hover:border-(--jobs-teal-dark) hover:shadow-sm hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--jobs-teal-dark) transition-all duration-200"
              >
                <CompanyLogoTile company={company} />
                <div>
                  <p className="font-bold text-[13.5px] text-(--jobs-navy) leading-snug">{company.name}</p>
                  <p className="text-[12px] text-(--jobs-ink-soft) mt-0.5">{company.industry}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-bold text-(--jobs-teal-dark)">
                  {company.openRoles} open roles
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </span>
              </a>
            </StaggerItem>
          ))}
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
