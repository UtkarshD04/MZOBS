import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Reveal from '../components/ui/Reveal'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import ExplorerButton from '../components/ui/ExplorerButton'
import ContactForm from '../components/forms/ContactForm'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from '../lib/config'

const INFO_CARDS = [
  { icon: Mail, label: 'Email us', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: Phone, label: 'Call us', value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE.replace(/\s+/g, '')}` },
  { icon: MapPin, label: 'Visit us', value: CONTACT_ADDRESS, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_ADDRESS)}` },
]

const OFFICE_HOURS = [
  ['Monday – Friday', '9:30 AM – 6:30 PM'],
  ['Saturday', '10:00 AM – 2:00 PM'],
  ['Sunday', 'Closed'],
]

export default function Contact() {
  return (
    <div className="min-h-screen bg-(--explorer-bg) text-(--explorer-navy) font-sans antialiased selection:bg-(--explorer-teal-surface)">
      <Seo path="/contact" {...STATIC_PAGE_SEO['/contact']} />
      <Navbar />

      {/* Hero — same atmosphere as the home page's search hero */}
      <section className="hero-atmosphere relative pt-28 pb-24 md:pt-36 md:pb-28">
        <div className="relative max-w-3xl mx-auto px-6 md:px-10 text-center">
          <Reveal direction="up" duration={0.7}>
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/80 border border-(--explorer-border) text-[12px] font-bold uppercase tracking-wider text-(--explorer-blue)">
              Get in touch
            </span>
            <h1 className="mt-5 text-[34px] sm:text-[44px] lg:text-[52px] font-extrabold leading-[1.08] tracking-tight text-balance">
              <span className="block text-(--explorer-navy)">Let&rsquo;s talk about your next hire</span>
              <span
                className="block"
                style={{ backgroundImage: 'var(--hero-cta-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
              >
                — or your next role.
              </span>
            </h1>
            <p className="mt-5 text-[16px] sm:text-[17.5px] text-(--explorer-navy)/75 font-medium leading-relaxed max-w-2xl mx-auto">
              Whether you&rsquo;re a job seeker with a question or an employer ready to hire, our team replies within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Info cards overlap the hero's bottom edge */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 -mt-14">
        <StaggerGroup className="grid sm:grid-cols-3 gap-4">
          {INFO_CARDS.map((c) => {
            const external = c.href.startsWith('http')
            return (
              <StaggerItem key={c.label}>
                <a
                  href={c.href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-start gap-4 h-full bg-white border border-(--explorer-border) rounded-xl p-5 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.3)] transition-all duration-200 hover:border-(--explorer-blue-border) hover:shadow-[0_14px_32px_-16px_rgba(37,99,235,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
                >
                  <span className="w-11 h-11 shrink-0 rounded-lg bg-(--explorer-blue-surface) text-(--explorer-blue) flex items-center justify-center">
                    <c.icon size={19} strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[13.5px] font-extrabold text-(--explorer-navy)">{c.label}</span>
                      <ArrowUpRight size={15} className="text-(--explorer-muted) opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true" />
                    </span>
                    <span className="mt-1 block text-[13.5px] text-(--explorer-muted) font-medium break-words">{c.value}</span>
                  </span>
                </a>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </section>

      {/* Form + office hours */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <div className="grid lg:grid-cols-5 gap-6">
          <Reveal direction="up" className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-(--explorer-border) shadow-[0_10px_28px_-18px_rgba(15,23,42,0.25)] p-6 sm:p-8 h-full">
              <h2 className="text-xl font-extrabold text-(--explorer-navy) tracking-tight">Send us a message</h2>
              <p className="text-[14px] text-(--explorer-muted) mt-1 mb-6">Tell us a bit about what you need and we&rsquo;ll route it to the right team.</p>
              <ContactForm />
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.1} className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white border border-(--explorer-border) rounded-xl p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-9 h-9 rounded-lg bg-(--explorer-teal-surface) text-(--explorer-teal) flex items-center justify-center">
                  <Clock size={17} />
                </span>
                <h3 className="text-[14.5px] font-extrabold text-(--explorer-navy)">Office hours</h3>
              </div>
              <ul className="text-[13.5px] font-medium divide-y divide-(--explorer-border)">
                {OFFICE_HOURS.map(([day, hours]) => (
                  <li key={day} className="flex justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="text-(--explorer-navy)">{day}</span>
                    <span className={hours === 'Closed' ? 'text-(--explorer-muted)' : 'text-(--explorer-teal) font-bold'}>{hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-(--explorer-navy-deep) p-6 text-white">
              <MapPin size={20} className="text-white/70" />
              <h3 className="mt-3 text-[15px] font-extrabold">Our office</h3>
              <p className="mt-1.5 text-[13.5px] text-white/70 leading-relaxed">{CONTACT_ADDRESS}</p>
              <ExplorerButton
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
                size="md"
                className="mt-4"
                style={{ outlineColor: '#ffffff' }}
              >
                Get directions <ArrowUpRight size={15} aria-hidden="true" />
              </ExplorerButton>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
