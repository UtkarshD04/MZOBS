import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../../lib/content'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
            M
          </div>
          <div className="flex flex-col text-white">
            <span className="font-bold text-lg leading-tight tracking-tight">Mzobs</span>
            <span className="text-[9px] tracking-[0.2em] text-white/70 uppercase font-medium">Hiring Platform</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 bg-white/10 backdrop-blur-md border border-white/15 px-8 py-2.5 rounded-full text-sm font-medium text-white/90 shadow-lg">
          {NAV_LINKS.map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href || '#'} className="hover:text-white transition-colors">
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Desktop Contact CTA Button */}
        <div className="hidden md:block">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-[#0B1220] font-semibold text-sm shadow-md hover:bg-white/90 transition-all transform hover:-translate-y-0.5"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden mt-4 bg-[#0B1220]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-white shadow-2xl animate-in fade-in duration-200">
          {NAV_LINKS.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="text-base font-medium hover:text-blue-400"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href || '#'}
                onClick={() => setOpen(false)}
                className="text-base font-medium hover:text-blue-400"
              >
                {link.label}
              </a>
            )
          )}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 text-center py-3 rounded-full bg-white text-[#0B1220] font-bold text-sm"
          >
            Contact Us
          </a>
        </div>
      )}
    </header>
  )
}
