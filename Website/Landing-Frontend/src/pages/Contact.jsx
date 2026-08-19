import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHero from '../components/sections/PageHero'
import Card from '../components/ui/Card'
import Photo from '../components/sections/Photo'
import ContactForm from '../components/forms/ContactForm'
import Reveal from '../components/ui/Reveal'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from '../lib/config'

const INFO_CARDS = [
  { icon: Mail, label: 'Email us', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: Phone, label: 'Call us', value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE.replace(/\s+/g, '')}` },
  { icon: MapPin, label: 'Visit us', value: CONTACT_ADDRESS, href: undefined },
]

export default function Contact() {
  return (
    <div className="min-h-screen bg-bg">
      <title>Contact Us — Mzobs</title>
      <Navbar />

      <PageHero
        kicker="Get In Touch"
        title={
          <>
            Let&rsquo;s Talk About Your <em className="italic text-gold-dot">Next Hire</em> — Or Your Next Role.
          </>
        }
        subtitle="Whether you're a job seeker with a question or an employer ready to hire, our team replies within one business day."
        photoIcon={Mail}
      />

      <section className="max-w-6xl mx-auto px-6 py-16">
        <StaggerGroup className="grid sm:grid-cols-3 gap-4">
          {INFO_CARDS.map((c) => (
            <StaggerItem key={c.label}>
              <Card pad hover className="text-center h-full">
                <div className="w-11 h-11 rounded-lg bg-navy-tint text-navy flex items-center justify-center mx-auto mb-3">
                  <c.icon size={19} />
                </div>
                <h3 className="text-[13.5px] font-semibold">{c.label}</h3>
                {c.href ? (
                  <a href={c.href} className="text-[13px] text-ink-secondary mt-1 block hover:text-navy transition-colors duration-200">
                    {c.value}
                  </a>
                ) : (
                  <p className="text-[13px] text-ink-secondary mt-1">{c.value}</p>
                )}
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-6">
          <Reveal direction="left" blur className="lg:col-span-3">
            <Card pad className="h-full">
              <h2 className="text-xl font-bold tracking-tight mb-1">Send us a message</h2>
              <p className="text-[13.5px] text-ink-secondary mb-6">Tell us a bit about what you need and we'll route it to the right team.</p>
              <ContactForm />
            </Card>
          </Reveal>

          <Reveal direction="right" delay={0.1} blur className="lg:col-span-2 flex flex-col gap-4">
            <Photo icon={MapPin} tone="navy" ratio="square" rounded="xl" className="shadow-lg" alt="Mzobs office" />
            <Card pad>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-gold-strong" />
                <h3 className="text-[13.5px] font-semibold">Office hours</h3>
              </div>
              <ul className="text-[13px] text-ink-secondary space-y-1.5">
                <li className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span>9:30 AM – 6:30 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM – 2:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </Card>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}

