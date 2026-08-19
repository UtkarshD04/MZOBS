import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'Support', to: '/app/support' },
  { label: 'Privacy Policy', to: '/app/settings' },
  { label: 'Terms of Service', to: '/app/settings' },
  { label: 'Subscription', to: '/app/subscription' },
]

export default function AppFooter() {
  return (
    <footer className="mt-12 pt-6 border-t border-border">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-[22px] h-[22px] rounded-md bg-gradient-to-br from-navy-700 to-navy text-white flex items-center justify-center text-[10px] font-extrabold">M</div>
          <span className="text-xs text-ink-tertiary">© {new Date().getFullYear()} Mzobs · Career Success Platform</span>
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
