import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import Reveal from '../ui/Reveal'
import ExplorerButton from '../ui/ExplorerButton'
import { FOOTER_DATA } from '../../lib/content'

const SOCIAL_ICONS = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  LinkedIn: FaLinkedinIn,
  'Twitter (X)': FaXTwitter,
}

export default function Footer() {
  return (
    <footer className="bg-(--explorer-blue-surface) pt-16 pb-8 px-6 md:px-12 border-t border-(--explorer-border)">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Footer Grid */}
        <Reveal direction="up" duration={0.9} scale={0.96} className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <motion.img
                src="/images/logo.png"
                alt="Mzobs"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                className="h-10 w-auto object-contain"
              />
              <span className="text-[8px] tracking-[0.18em] text-(--explorer-muted) uppercase font-bold">{FOOTER_DATA.logoSub}</span>
            </Link>

            <p className="text-[13px] text-(--explorer-muted) leading-relaxed max-w-md font-medium">{FOOTER_DATA.desc}</p>

            <div className="flex flex-wrap gap-3">
              <ExplorerButton to="/employees/signin" variant="secondary" size="md" className="rounded-full">
                Employee Login
              </ExplorerButton>
              <ExplorerButton to="/employers/signin" variant="primary" size="md" className="rounded-full">
                Employer Login
              </ExplorerButton>
            </div>
          </div>

          {/* Menu Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-(--explorer-navy)">{FOOTER_DATA.menuTitle}</h4>
            <ul className="space-y-2.5 text-[13px] text-(--explorer-muted) font-medium">
              {FOOTER_DATA.menuItems.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    className="relative w-fit inline-block hover:text-(--explorer-blue) transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-(--explorer-blue) after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-(--explorer-navy)">{FOOTER_DATA.contactTitle}</h4>
            <div className="space-y-2.5 text-[13px] text-(--explorer-muted) leading-relaxed font-medium">
              <a href={`tel:${FOOTER_DATA.phone}`} className="block hover:text-(--explorer-blue) transition-colors w-fit">{FOOTER_DATA.phone}</a>
              <a href={`mailto:${FOOTER_DATA.email}`} className="block hover:text-(--explorer-blue) transition-colors w-fit">{FOOTER_DATA.email}</a>
              <p className="pt-1">{FOOTER_DATA.address}</p>
            </div>
          </div>

          {/* Socials Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-(--explorer-navy)">{FOOTER_DATA.socialsTitle}</h4>
            <div className="flex flex-wrap gap-2.5">
              {FOOTER_DATA.socialsItems.map((item, idx) => {
                const Icon = SOCIAL_ICONS[item.label]
                return (
                  <motion.a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    // Framer Motion animates this as a color value, so it needs a
                    // literal hex rather than var(--explorer-blue).
                    whileHover={{ scale: 1.15, rotate: -10, backgroundColor: '#2563EB', color: '#fff' }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                    className="w-9 h-9 rounded-full bg-white border border-(--explorer-border) flex items-center justify-center text-(--explorer-blue)"
                  >
                    {Icon && <Icon size={14} />}
                  </motion.a>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-6 border-t border-(--explorer-border) flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-(--explorer-muted) font-medium">
          <p>{FOOTER_DATA.copyright}</p>
          <div className="flex items-center gap-4">
            {FOOTER_DATA.rightLinks.map((link, i) => (
              <span key={i} className="flex items-center gap-4">
                <Link to={link.to} className="hover:text-(--explorer-blue) transition-colors">
                  {link.label}
                </Link>
                {i < FOOTER_DATA.rightLinks.length - 1 && <span className="text-(--explorer-border)">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
