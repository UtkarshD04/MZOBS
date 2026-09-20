import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import ExplorerButton from '../ui/ExplorerButton'
import { FOOTER_DATA } from '../../lib/content'

const SOCIAL_ICONS = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  LinkedIn: FaLinkedinIn,
  'Twitter (X)': FaXTwitter,
}

const LINK_GROUPS = [
  {
    title: 'For job seekers',
    links: [
      { label: 'Find jobs', to: '/#job-search' },
      { label: 'Companies hiring', to: '/#companies' },
      { label: 'Create account', to: '/employees/signup' },
      { label: 'Sign in', to: '/employees/signin' },
    ],
  },
  {
    title: 'For employers',
    links: [
      { label: 'Hire with Mzobs', to: '/employers' },
      { label: 'Pricing', to: '/employers/pricing' },
      { label: 'Post a requirement', to: '/employers/signup' },
      { label: 'Employer sign in', to: '/employers/signin' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Who we are', to: '/about' },
      { label: 'Our story', to: '/our-story' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
]

const linkClass =
  'relative w-fit inline-block hover:text-(--explorer-blue) transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-(--explorer-blue) after:transition-all after:duration-300 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)'

// Socials whose profile isn't set up yet ("#") are left out instead of
// rendering icons that go nowhere.
const liveSocials = FOOTER_DATA.socialsItems.filter((item) => item.href && item.href !== '#')

export default function Footer() {
  return (
    <footer className="bg-white border-t border-(--explorer-border)">
      <div className="h-1 bg-(image:--hero-cta-gradient)" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 space-y-5">
            <Link to="/" className="block w-fit" aria-label="Mzobs home">
              {/* The logo file carries a lot of empty padding; the negative
                  margins trim it so the mark sits flush with the text below. */}
              <img src="/images/logo.png" alt="Mzobs" className="h-24 w-auto object-contain -my-6 -ml-5" />
            </Link>
            <p className="text-[14px] text-(--explorer-muted) leading-relaxed max-w-sm">{FOOTER_DATA.desc}</p>

            <div className="flex flex-wrap gap-3">
              <ExplorerButton to="/employees/signin" variant="secondary" size="md">
                Employee login
              </ExplorerButton>
              <ExplorerButton to="/employers/signin" variant="primary" size="md">
                Employer login
              </ExplorerButton>
            </div>
          </div>

          {/* Link groups */}
          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title} className="md:col-span-2 space-y-4">
              <h4 className="text-[13px] font-extrabold uppercase tracking-wider text-(--explorer-navy)">{group.title}</h4>
              <ul className="space-y-2.5 text-[14px] text-(--explorer-muted) font-medium">
                {group.links.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <h4 className="text-[13px] font-extrabold uppercase tracking-wider text-(--explorer-navy)">{FOOTER_DATA.contactTitle}</h4>
            <ul className="space-y-3 text-[14px] text-(--explorer-muted) font-medium">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="mt-1 shrink-0 text-(--explorer-blue)" aria-hidden="true" />
                <a href={`tel:${FOOTER_DATA.phone.replace(/\s+/g, '')}`} className={linkClass}>
                  {FOOTER_DATA.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="mt-1 shrink-0 text-(--explorer-blue)" aria-hidden="true" />
                <a href={`mailto:${FOOTER_DATA.email}`} className={`${linkClass} break-all`}>
                  {FOOTER_DATA.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-1 shrink-0 text-(--explorer-blue)" aria-hidden="true" />
                <span className="leading-relaxed">{FOOTER_DATA.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-(--explorer-border) flex flex-col-reverse md:flex-row items-center justify-between gap-5 text-[12.5px] text-(--explorer-muted) font-medium">
          <p>{FOOTER_DATA.copyright}</p>

          <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-3">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {FOOTER_DATA.rightLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-(--explorer-blue) transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {liveSocials.length > 0 && (
              <div className="flex gap-2">
                {liveSocials.map((item) => {
                  const Icon = SOCIAL_ICONS[item.label]
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="w-9 h-9 rounded-full border border-(--explorer-border) bg-(--explorer-bg) flex items-center justify-center text-(--explorer-blue) transition-colors hover:bg-(--explorer-blue) hover:text-white hover:border-(--explorer-blue) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
                    >
                      {Icon && <Icon size={14} />}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
