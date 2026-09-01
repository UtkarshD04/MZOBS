import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SectionLabel from '../components/ui/SectionLabel'
import FloatingElement from '../components/ui/FloatingElement'
import Reveal from '../components/ui/Reveal'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import ContactForm from '../components/forms/ContactForm'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from '../lib/config'

const INFO_CARDS = [
  { icon: Mail, label: 'Email us', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: Phone, label: 'Call us', value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE.replace(/\s+/g, '')}` },
  { icon: MapPin, label: 'Visit us', value: CONTACT_ADDRESS, href: undefined },
]

export default function Contact() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <title>Contact Us — Mzobs</title>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-white pt-[76px] overflow-hidden">
        <FloatingElement duration={9} distance={18} className="absolute top-20 right-[8%] w-80 h-80 rounded-full bg-[var(--careers-tint-sage)]/60 blur-3xl pointer-events-none" />
        <FloatingElement duration={11} delay={1.2} distance={22} className="absolute bottom-0 left-[6%] w-72 h-72 rounded-full bg-[var(--careers-cyan-soft)]/40 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24 text-center">
          <Reveal direction="up" duration={0.7} scale={0.96} blur>
            <SectionLabel className="mx-auto">Get In Touch</SectionLabel>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black text-black leading-[1.1] tracking-tight">
              Let&rsquo;s Talk About Your{' '}
              <span className="font-serif italic font-normal text-[var(--careers-accent)]">Next Hire</span> — Or Your Next Role.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[#595959] leading-relaxed font-medium max-w-2xl mx-auto">
              Whether you're a job seeker with a question or an employer ready to hire, our team replies within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Info cards */}
      <section className="max-w-6xl mx-auto px-6 pb-6">
        <StaggerGroup className="grid sm:grid-cols-3 gap-4">
          {INFO_CARDS.map((c) => (
            <StaggerItem key={c.label}>
              <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 text-center h-full transition-all duration-200 hover:border-[var(--careers-accent)]/40 hover:shadow-md">
                <div className="w-11 h-11 rounded-xl bg-[#F5F5F5] text-[var(--careers-accent)] flex items-center justify-center mx-auto mb-3">
                  <c.icon size={19} strokeWidth={1.8} />
                </div>
                <h3 className="text-[13.5px] font-black text-black">{c.label}</h3>
                {c.href ? (
                  <a href={c.href} className="text-[13px] text-[#595959] font-medium mt-1 block hover:text-[var(--careers-accent)] transition-colors duration-200">
                    {c.value}
                  </a>
                ) : (
                  <p className="text-[13px] text-[#595959] font-medium mt-1">{c.value}</p>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Form + office hours */}
      <section className="max-w-6xl mx-auto px-6 pb-20 pt-10">
        <div className="grid lg:grid-cols-5 gap-6">
          <Reveal direction="left" blur className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-[#e0e0e0] p-7 sm:p-9 h-full">
              <h2 className="text-xl font-black text-black tracking-tight mb-1">Send us a message</h2>
              <p className="text-[13.5px] text-[#595959] font-medium mb-6">Tell us a bit about what you need and we'll route it to the right team.</p>
              <ContactForm />
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1} blur className="lg:col-span-2 flex flex-col gap-4">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[var(--careers-tint-sage)] shadow-lg">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage: 'radial-gradient(rgba(0,0,0,.06) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin size={44} className="text-[var(--careers-accent)]/40" strokeWidth={1.25} />
              </div>
            </div>
            <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-[var(--careers-accent)]" />
                <h3 className="text-[13.5px] font-black text-black">Office hours</h3>
              </div>
              <ul className="text-[13px] text-[#595959] font-medium space-y-1.5">
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
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
