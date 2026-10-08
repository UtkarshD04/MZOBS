import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { FOOTER_DATA } from '../../lib/content'
import { CONTACT_EMAIL } from '../../lib/config'
import { Container } from '../mz/primitives'

const SOCIAL_ICONS = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  LinkedIn: FaLinkedinIn,
  'Twitter (X)': FaXTwitter,
}

const LINK_GROUPS = [
  {
    title: 'For Candidates',
    links: [
      { label: 'Find jobs', to: '/#latest-jobs' },
      { label: 'Create profile', to: '/employees/signup' },
      { label: 'Candidate sign in', to: '/employees/signin' },
      { label: 'Mzobs Premium', to: '/employees/subscription' },
      { label: 'Mzobs Ally', to: '/ally' },
    ],
  },
  {
    title: 'For Employers',
    links: [
      { label: 'Post a job', to: '/employers/signup' },
      { label: 'Hire with Mzobs', to: '/employers' },
      { label: 'Pricing', to: '/employers/pricing' },
      { label: 'Employer sign in', to: '/employers/signin' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Categories', to: '/#categories' },
      { label: 'Companies hiring', to: '/#companies' },
      { label: 'Campus', to: '/#campuses' },
      { label: 'Jobs matching your profile', to: '/employees/recommended' },
      { label: 'Your profile', to: '/employees/profile' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our story', to: '/our-story' },
      { label: 'Associate with Mzobs', to: '/associate' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', href: `mailto:${CONTACT_EMAIL}?subject=Careers%20at%20Mzobs` },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms', to: '/terms-of-service' },
      { label: 'Help Center', to: '/contact' },
      { label: 'Delete account', to: '/delete-account' },
    ],
  },
]

const linkClass = 'inline-block rounded text-[14px] text-mz-muted transition-colors duration-150 hover:text-mz-primary-strong focus-visible:outline-2 focus-visible:outline-mz-primary'

// Socials whose profile isn't set up yet ("#") are left out instead of
// rendering icons that go nowhere.
const liveSocials = FOOTER_DATA.socialsItems.filter((item) => item.href && item.href !== '#')

export default function Footer() {
  return (
    <footer className="border-t border-mz-line bg-white">
      <Container className="pb-8 pt-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-[1.6fr_repeat(5,1fr)]">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" aria-label="Mzobs home" className="inline-block rounded-lg">
              <img src="/images/logo.png" alt="Mzobs" width="120" height="48" loading="lazy" className="h-12 w-auto object-contain" />
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-mz-muted">{FOOTER_DATA.desc}</p>
            <ul className="mt-5 space-y-2.5 text-[13.5px] text-mz-muted">
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="mt-0.5 shrink-0 text-mz-primary" aria-hidden="true" />
                <a href={`mailto:${FOOTER_DATA.email}`} className="break-all hover:text-mz-primary-strong">{FOOTER_DATA.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0 text-mz-primary" aria-hidden="true" />
                <a href={`tel:${FOOTER_DATA.phone.replace(/\s+/g, '')}`} className="hover:text-mz-primary-strong">{FOOTER_DATA.phone}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-mz-primary" aria-hidden="true" />
                <span className="leading-relaxed">{FOOTER_DATA.address}</span>
              </li>
            </ul>
          </div>

          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-mz-ink">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link to={item.to} className={linkClass}>{item.label}</Link>
                    ) : (
                      <a href={item.href} className={linkClass}>{item.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-5 border-t border-mz-line pt-6 text-[13px] text-mz-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Mzobs. All rights reserved.</p>
          {liveSocials.length > 0 && (
            <ul className="flex items-center gap-2" aria-label="Mzobs on social media">
              {liveSocials.map((item) => {
                const Icon = SOCIAL_ICONS[item.label]
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Mzobs on ${item.label}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-mz-bg text-mz-ink-2 ring-1 ring-mz-line transition-colors hover:bg-mz-primary hover:text-white hover:ring-mz-primary focus-visible:outline-2 focus-visible:outline-mz-primary"
                    >
                      {Icon && <Icon size={15} aria-hidden="true" />}
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </Container>
    </footer>
  )
}
