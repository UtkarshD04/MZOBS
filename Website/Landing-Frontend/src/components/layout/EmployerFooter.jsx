import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { FOOTER_DATA } from '../../lib/content'

const SOCIAL_ICONS = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  LinkedIn: FaLinkedinIn,
  'Twitter (X)': FaXTwitter,
}

const LINK_GROUPS = [
  {
    title: 'For employers',
    links: [
      { label: 'Post a job', to: '/employers/signup' },
      { label: 'Find candidates', to: '/employers#discover-talent' },
      { label: 'Pricing', to: '/employers/pricing' },
      { label: 'Employer sign in', to: '/employers/signin' },
    ],
  },
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
    title: 'Company',
    links: [
      { label: 'Our story', to: '/our-story' },
      { label: 'Become an Associate', to: '/associate' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
]

const linkClass =
  'inline-flex min-h-8 items-center rounded-sm text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5fe0b8]'

const liveSocials = FOOTER_DATA.socialsItems.filter((item) => item.href && item.href !== '#')

// Employer-section footer, shared by /employers, /employers/pricing and the
// employer auth pages: a dark close with "For employers" leading the links.
export default function EmployerFooter() {
  return (
    <footer className="bg-(--explorer-navy-deep) text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 md:px-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-12">
          <div className="col-span-2 space-y-5 md:col-span-4">
            <Link to="/employers" className="block w-fit rounded-sm focus-visible:outline-2 focus-visible:outline-[#5fe0b8]" aria-label="Mzobs for employers">
              <img src="/images/logo.png" alt="" className="-my-6 -ml-5 h-24 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="max-w-sm text-[14px] leading-relaxed text-white/65">
              Post jobs, search reviewed candidate resumes and manage your hiring pipeline, all on Mzobs.
            </p>
            <Link
              to="/employers/signup"
              className="group inline-flex h-11 items-center gap-2 rounded-md bg-[#5fe0b8] px-5 text-[14px] font-bold text-(--explorer-navy-deep) transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Post a job
              <ArrowRight size={15} aria-hidden="true" className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
            </Link>
          </div>

          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title} className="space-y-3 md:col-span-2">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/45">{group.title}</h3>
              <ul className="space-y-1 text-[14px] font-medium">
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

          <div className="col-span-2 space-y-3 md:col-span-2">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/45">{FOOTER_DATA.contactTitle}</h3>
            <ul className="space-y-2 text-[14px] font-medium">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="mt-2 shrink-0 text-[#5fe0b8]" aria-hidden="true" />
                <a href={`tel:${FOOTER_DATA.phone.replace(/\s+/g, '')}`} className={linkClass}>
                  {FOOTER_DATA.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="mt-2 shrink-0 text-[#5fe0b8]" aria-hidden="true" />
                <a href={`mailto:${FOOTER_DATA.email}`} className={`${linkClass} break-all`}>
                  {FOOTER_DATA.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <MapPin size={15} className="mt-1 shrink-0 text-[#5fe0b8]" aria-hidden="true" />
                <span className="leading-relaxed text-white/70">{FOOTER_DATA.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-5 border-t border-white/12 pt-6 text-[12.5px] font-medium text-white/55 md:flex-row">
          <p>{FOOTER_DATA.copyright}</p>

          <div className="flex flex-col items-center gap-x-6 gap-y-3 sm:flex-row">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {FOOTER_DATA.rightLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="inline-flex min-h-8 items-center transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#5fe0b8]">
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
                      aria-label={`Mzobs on ${item.label}`}
                      className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#5fe0b8] hover:bg-[#5fe0b8] hover:text-(--explorer-navy-deep) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5fe0b8]"
                    >
                      {Icon && <Icon size={14} aria-hidden="true" />}
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
