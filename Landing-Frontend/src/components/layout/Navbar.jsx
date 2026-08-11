import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Button, { goldSolidClass } from '../ui/Button'
import { NAV_LINKS } from '../../lib/content'
import { cn } from '../../lib/utils'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-bg border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-navy-700 to-navy flex items-center justify-center text-sm font-extrabold text-white shadow-navy">M</div>
          <span className="text-[17px] font-bold">Mzobs</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-ink-secondary">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => cn('transition-colors duration-200 hover:text-ink', isActive && 'text-ink font-semibold')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button to="/contact" variant="primary" size="md" pill className={goldSolidClass}>
            Contact Us
          </Button>
        </div>

        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-hover"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-bg px-6 py-5 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => cn('text-[14.5px] font-medium', isActive ? 'text-navy font-semibold' : 'text-ink-secondary')}
            >
              {l.label}
            </NavLink>
          ))}
          <Button to="/contact" variant="primary" size="md" pill className={cn(goldSolidClass, 'w-full')} onClick={() => setOpen(false)}>
            Contact Us
          </Button>
        </div>
      )}
    </header>
  )
}
