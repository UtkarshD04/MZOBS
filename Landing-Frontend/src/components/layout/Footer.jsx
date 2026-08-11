import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import Button, { goldSolidClass } from '../ui/Button'
import { NAV_LINKS } from '../../lib/content'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from '../../lib/config'
import { cn } from '../../lib/utils'

const SOCIALS = [
  { label: 'Facebook', icon: FaFacebookF, href: 'https://facebook.com' },
  { label: 'Instagram', icon: FaInstagram, href: 'https://instagram.com' },
  { label: 'LinkedIn', icon: FaLinkedinIn, href: 'https://linkedin.com' },
  { label: 'X (Twitter)', icon: FaXTwitter, href: 'https://x.com' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-navy-700 to-navy flex items-center justify-center text-sm font-extrabold text-white shadow-navy">M</div>
            <span className="text-[17px] font-bold">Mzobs</span>
          </Link>
          <p className="text-[13px] text-white/60 mt-4 leading-relaxed max-w-[220px]">
            Verified job seekers meet verified employers — one platform, both sides of hiring.
          </p>
          <div className="flex items-center gap-2.5 mt-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-colors duration-200"
              >
                <s.icon size={13} />
              </a>
            ))}
          </div>
          <Button to="/contact" variant="primary" size="sm" pill className={cn(goldSolidClass, 'mt-6')}>
            Contact Us
          </Button>
        </div>

        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-white/50 mb-4">Menu</h3>
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-[13.5px] text-white/70 hover:text-white transition-colors duration-200">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/contact" className="text-[13.5px] text-white/70 hover:text-white transition-colors duration-200">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-white/50 mb-4">Socials</h3>
          <ul className="flex flex-col gap-3">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-[13.5px] text-white/70 hover:text-white transition-colors duration-200">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-white/50 mb-4">Contact</h3>
          <ul className="flex flex-col gap-3 text-[13.5px] text-white/70">
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-gold-dot flex-shrink-0" /> {CONTACT_PHONE}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-gold-dot flex-shrink-0" /> {CONTACT_EMAIL}
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-gold-dot flex-shrink-0 mt-0.5" /> <span>{CONTACT_ADDRESS}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between gap-4 flex-wrap text-xs text-white/50">
          <span>© {new Date().getFullYear()} Mzobs. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <a href="#privacy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors duration-200">
              Terms
            </a>
            <a href="#careers" className="hover:text-white transition-colors duration-200">
              Careers
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
