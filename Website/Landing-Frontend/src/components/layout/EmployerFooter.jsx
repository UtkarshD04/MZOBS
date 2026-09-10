import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { FOOTER_DATA } from '../../lib/content'

const SOCIAL_ICONS = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  LinkedIn: FaLinkedinIn,
  'Twitter (X)': FaXTwitter,
}

// Employer-section footer — mounted on /employers and its sign-in/signup/
// password pages instead of the main site Footer, matching EmployerNavbar's
// deliberately distinct employer branding (dark ink + coral/gold, serif
// headline) rather than the site-wide cream/navy Footer.
export default function EmployerFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#20251F] pt-16 pb-8 px-6 md:px-12">
      <div aria-hidden="true" className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#1F5A43] blur-[100px] opacity-60" />
      <div aria-hidden="true" className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-[#F36D4C] blur-[110px] opacity-20" />

      <div className="relative max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/employers" className="flex items-center gap-2 group w-fit">
              <img src="/images/logo.png" alt="Mzobs" className="h-10 w-auto object-contain brightness-0 invert" />
              <span className="text-[10px] tracking-[0.18em] text-[#F6C16E] uppercase font-bold border-l border-white/20 pl-2">
                For Employers
              </span>
            </Link>

            <p className="text-[13px] text-white/55 leading-relaxed max-w-md font-medium">{FOOTER_DATA.desc}</p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white/20 text-white text-[12px] font-bold hover:border-[#F36D4C] hover:text-[#F36D4C] transition-colors"
              >
                Looking for a job?
              </Link>
              <Link
                to="/employers/signin"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#F36D4C] text-[#20251F] text-[12px] font-bold hover:bg-[#F6C16E] transition-colors"
              >
                Employer sign in
              </Link>
            </div>
          </div>

          {/* Menu column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-[#FAF7F1]">{FOOTER_DATA.menuTitle}</h4>
            <ul className="space-y-2.5 text-[13px] text-white/55 font-medium">
              {FOOTER_DATA.menuItems.map((item, idx) => (
                <li key={idx}>
                  <Link to={item.to} className="hover:text-[#F6C16E] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-[#FAF7F1]">{FOOTER_DATA.contactTitle}</h4>
            <div className="space-y-2.5 text-[13px] text-white/55 leading-relaxed font-medium">
              <a href={`tel:${FOOTER_DATA.phone}`} className="block hover:text-[#F6C16E] transition-colors w-fit">
                {FOOTER_DATA.phone}
              </a>
              <a href={`mailto:${FOOTER_DATA.email}`} className="block hover:text-[#F6C16E] transition-colors w-fit">
                {FOOTER_DATA.email}
              </a>
              <p className="pt-1">{FOOTER_DATA.address}</p>
            </div>
          </div>

          {/* Socials column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-[#FAF7F1]">{FOOTER_DATA.socialsTitle}</h4>
            <div className="flex flex-wrap gap-2.5">
              {FOOTER_DATA.socialsItems.map((item, idx) => {
                const Icon = SOCIAL_ICONS[item.label]
                return (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 transition-all duration-200 hover:border-[#F36D4C] hover:text-[#F36D4C] hover:-translate-y-0.5"
                  >
                    {Icon && <Icon size={14} />}
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40 font-medium">
          <p>{FOOTER_DATA.copyright}</p>
          <div className="flex items-center gap-4">
            {FOOTER_DATA.rightLinks.map((link, i) => (
              <span key={i} className="flex items-center gap-4">
                <Link to={link.to} className="hover:text-[#F6C16E] transition-colors">
                  {link.label}
                </Link>
                {i < FOOTER_DATA.rightLinks.length - 1 && <span className="text-white/15">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
