import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'Resumes', to: '/app/resumes' },
  { label: 'HR Contacts', to: '/app/hr-contacts' },
  { label: 'Companies', to: '/app/companies' },
  { label: 'Requirements', to: '/app/requirements' },
  { label: 'Queries', to: '/app/queries' },
]

export default function AdminFooter() {
  return (
    <footer className="mt-12 pt-6 border-t border-border">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <img src="/images/logo.png" alt="Mzobs" className="h-6 w-auto object-contain" />
          <span className="text-xs text-ink-tertiary">© {new Date().getFullYear()} Mzobs · Admin Portal</span>
        </div>

        <nav className="flex items-center gap-5 flex-wrap">
          {LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="text-xs text-ink-tertiary hover:text-navy transition-colors duration-200">
              {l.label}
            </Link>
          ))}
          <span className="flex items-center gap-1.5 text-xs text-ink-tertiary">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-green-dot opacity-60 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-green-dot" />
            </span>
            All systems operational
          </span>
        </nav>
      </div>
    </footer>
  )
}
