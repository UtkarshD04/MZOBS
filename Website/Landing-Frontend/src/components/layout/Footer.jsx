import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import Reveal from '../ui/Reveal'
import { FOOTER_DATA } from '../../lib/content'

const SOCIAL_ICONS = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  LinkedIn: FaLinkedinIn,
  'Twitter (X)': FaXTwitter,
}

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5] pt-16 pb-8 px-6 md:px-12 border-t border-[#e0e0e0]">
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
              <span className="text-[8px] tracking-[0.18em] text-[#595959] uppercase font-bold">{FOOTER_DATA.logoSub}</span>
            </Link>

            <p className="text-[13px] text-[#666] leading-relaxed max-w-md font-medium">{FOOTER_DATA.desc}</p>

            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 350, damping: 18 }}>
                <Link
                  to="/employees/signin"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-[#595959] text-[12px] font-bold border border-[#666] hover:bg-[var(--careers-accent)] hover:text-white hover:border-[var(--careers-accent)] transition-colors"
                >
                  Employee Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 350, damping: 18 }}>
                <Link
                  to="/employers/signin"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--careers-accent)] text-white text-[12px] font-bold border border-[var(--careers-accent)] hover:bg-white hover:text-[#595959] hover:border-[#666] transition-colors"
                >
                  Employer Login
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Menu Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-black text-black uppercase tracking-wider">{FOOTER_DATA.menuTitle}</h4>
            <ul className="space-y-2.5 text-[13px] text-[#666] font-medium">
              {FOOTER_DATA.menuItems.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    className="relative w-fit inline-block hover:text-[var(--careers-accent)] transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-[var(--careers-accent)] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-black uppercase tracking-wider">{FOOTER_DATA.contactTitle}</h4>
            <div className="space-y-2.5 text-[13px] text-[#666] leading-relaxed font-medium">
              <a href={`tel:${FOOTER_DATA.phone}`} className="block hover:text-[var(--careers-accent)] transition-colors w-fit">{FOOTER_DATA.phone}</a>
              <a href={`mailto:${FOOTER_DATA.email}`} className="block hover:text-[var(--careers-accent)] transition-colors w-fit">{FOOTER_DATA.email}</a>
              <p className="pt-1">{FOOTER_DATA.address}</p>
            </div>
          </div>

          {/* Socials Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-black text-black uppercase tracking-wider">{FOOTER_DATA.socialsTitle}</h4>
            <div className="flex flex-wrap gap-2.5">
              {FOOTER_DATA.socialsItems.map((item, idx) => {
                const Icon = SOCIAL_ICONS[item]
                return (
                  <motion.a
                    key={idx}
                    href="#"
                    aria-label={item}
                    whileHover={{ scale: 1.15, rotate: -10, backgroundColor: '#3D5C34', color: '#fff' }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                    className="w-9 h-9 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center text-[var(--careers-accent)]"
                  >
                    {Icon && <Icon size={14} />}
                  </motion.a>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-6 border-t border-[#e0e0e0] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#666] font-medium">
          <p>{FOOTER_DATA.copyright}</p>
          <div className="flex items-center gap-4">
            {FOOTER_DATA.rightLinks.map((link, i) => (
              <span key={i} className="flex items-center gap-4">
                <Link to={link.to} className="hover:text-[var(--careers-accent)] transition-colors">
                  {link.label}
                </Link>
                {i < FOOTER_DATA.rightLinks.length - 1 && <span className="text-[#C9C9C9]">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
