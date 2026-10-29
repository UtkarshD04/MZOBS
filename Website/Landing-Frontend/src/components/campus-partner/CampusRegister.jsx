import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, BarChart3, CalendarCheck, Check, ClipboardCheck, Handshake, Headset } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

// Palette for this page: navy #173653, teal #009688, mint #EAF6F3, neutral #F7F9FC.
// Plain teal (#009688) is reserved for large type and accents; text and buttons that
// carry small white/teal copy use the deeper #00796B so they clear AA contrast.

const BENEFITS = [
  { icon: BadgeCheck, title: 'Verified Jobs & Internships', text: 'Help students discover relevant opportunities with appropriate screening and verification.' },
  { icon: ClipboardCheck, title: 'Career Preparation', text: 'Support resume development, interview preparation and skill readiness.' },
  { icon: Handshake, title: 'Employer Connections', text: 'Help students discover opportunities with companies hiring emerging talent.' },
  { icon: CalendarCheck, title: 'Campus Hiring Drives', text: 'Support the coordination of placement activities and hiring events.' },
  { icon: BarChart3, title: 'Placement Insights', text: 'A clearer view of where your students are heading, as supported on the platform.' },
  { icon: Headset, title: 'Dedicated Campus Support', text: 'An identifiable Mzobs point of contact for your institution.' },
]

const STEPS = [
  { title: 'Register Your Campus', text: 'Submit your institution’s details through a short registration form.' },
  { title: 'Connect With Mzobs', text: 'Our team reviews your request and gets in touch as part of the campus onboarding process.' },
  { title: 'Prepare Your Students', text: 'Once verified, students can access relevant career resources and opportunities on Mzobs.' },
  { title: 'Connect With Opportunities', text: 'Students explore relevant openings and connect with employers hiring emerging talent.' },
]

const BRIDGE = [
  { title: 'Easier discovery', text: 'Students find relevant job opportunities in one place instead of searching in many.' },
  { title: 'Better preparation', text: 'Access to career preparation resources that support resume, interview and skill readiness.' },
  { title: 'A structured connection', text: 'A clearer path between your students and the employers who are hiring.' },
]

const FAQ = [
  { q: 'Who can add their campus?', a: 'Colleges, universities, polytechnics, management institutes and other educational institutions.' },
  { q: 'Does it cost anything?', a: 'No. Submitting a campus request is free. Our team will share the details when they contact you.' },
  { q: 'What happens after I submit?', a: 'Our team reviews your request and contacts you on the email and phone you provide.' },
  { q: 'How long does verification take?', a: 'We aim to get back to you soon after reviewing your details. Share accurate contact information to speed it up.' },
]

const cta =
  'group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#00796B] px-7 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(0,121,107,0.7)] transition-[background-color,transform] duration-200 hover:bg-[#00695C] hover:shadow-[0_14px_28px_-10px_rgba(0,121,107,0.75)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00796B] motion-safe:hover:-translate-y-0.5'
const ctaGhost =
  'inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-semibold text-[#173653] ring-1 ring-[#173653]/25 transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-[0_8px_20px_-12px_rgba(23,54,83,0.4)] hover:ring-[#173653]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173653]'

function SectionTitle({ eyebrow, children, sub, align = 'center', dark = false }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-xl'}>
      <p className={`text-[13px] font-bold uppercase tracking-[0.14em] ${dark ? 'text-[#4DB6AC]' : 'text-[#00796B]'}`}>{eyebrow}</p>
      <h2 className={`mt-3 text-balance text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-[36px] ${dark ? 'text-white' : 'text-[#173653]'}`}>{children}</h2>
      {sub && <p className={`mt-4 text-[16px] leading-relaxed sm:text-[17px] ${dark ? 'text-white/75' : 'text-[#475467]'}`}>{sub}</p>}
    </div>
  )
}

export default function CampusRegister() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-[#EAF6F3] via-[#F2F9F7] to-white pb-16 pt-28 lg:pb-24 lg:pt-36">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <Reveal y={12}>
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#00796B]">For Campus Partners</p>
            <h1 className="mt-5 max-w-[640px] text-balance text-[#173653] text-[34px] sm:text-[44px] lg:text-[52px] font-extrabold leading-[1.08] tracking-tight">
              <span className="sm:block">Bring Better</span>{' '}
              <span className="text-[#009688] sm:block sm:whitespace-nowrap">Career Opportunities</span>{' '}
              <span className="sm:block">to Your Campus.</span>
            </h1>
            <p className="mt-6 max-w-[520px] text-[#475467] text-[16px] sm:text-[17px] font-normal leading-relaxed">
              Connect your students with verified job opportunities, career readiness resources, and employers looking for emerging talent — all through Mzobs.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to={CLIENT_ONLY_ROUTES.campusPartnerApply} className={cta}>
                Register Your Campus
                <ArrowRight size={17} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a href="#campus-benefits" className={ctaGhost}>Explore Campus Benefits</a>
            </div>
            <p className="mt-5 text-[14px] text-[#475467]">For colleges, universities, and educational institutions.</p>
          </Reveal>

          <Reveal delay={0.1} y={0} className="relative lg:justify-self-end lg:w-full lg:max-w-[540px]">
            <div className="absolute -bottom-4 -right-4 hidden h-full w-full rounded-[28px] border border-[#173653]/20 lg:block" aria-hidden="true" />
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#173653] sm:aspect-[5/4] lg:aspect-[4/5]">
              <img
                src="/images/campus/dehradun.jpg"
                alt="Students inside a multi-storey college campus building"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-[50%_55%] transition-transform duration-300 ease-out will-change-transform motion-safe:group-hover:scale-[1.02]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#173653]/55 to-transparent" aria-hidden="true" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Benefits */}
      <section id="campus-benefits" className="scroll-mt-24 bg-white py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionTitle eyebrow="Campus benefits" sub="Give your students better access to career opportunities and help your institution build stronger employer connections.">
              More Than Opportunities. A Stronger Campus-to-Career Journey.
            </SectionTitle>
          </Reveal>
          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={(i % 3) * 0.06}>
                <div className="group h-full rounded-2xl border border-[#E6E8F0] bg-[#F7F9FC] p-6 transition-[border-color,box-shadow,background-color] duration-200 hover:border-[#009688]/50 hover:bg-white hover:shadow-[0_18px_36px_-24px_rgba(23,54,83,0.35)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6F3] text-[#00796B] transition-colors duration-200 group-hover:bg-[#00796B] group-hover:text-white">
                    <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[18px] font-bold leading-snug text-[#173653]">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#475467]">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-[#EAF6F3] py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionTitle eyebrow="How it works" sub="From registration to opportunities — a simple, clear path for your institution.">
              Your Campus Partnership Journey
            </SectionTitle>
          </Reveal>
          <ol className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-4">
            {STEPS.map(({ title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 0.07} className="relative pl-14 md:pl-0 md:pt-0">
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-5 top-12 -bottom-10 w-px bg-gradient-to-b from-[#173653]/40 to-[#009688]/40 md:bottom-auto md:left-[3.25rem] md:top-5 md:h-px md:w-[calc(100%-2.5rem)] md:bg-gradient-to-r"
                  />
                )}
                <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#173653] text-[14px] font-bold tabular-nums text-white ring-4 ring-[#EAF6F3] md:relative">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[18px] font-bold leading-snug text-[#173653] md:mt-5">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#475467]">{text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Institutional partnership */}
      <section className="bg-white py-16 lg:py-24">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative mx-auto grid w-full max-w-[520px] grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden rounded-3xl">
              <img src="/images/campus/bengaluru.jpg" alt="Open-air campus walkway lined with plants" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
            <div className="mt-12 aspect-[3/4] overflow-hidden rounded-3xl">
              <img src="/images/campus/mumbai.jpg" alt="Heritage college building framed by trees" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
            <span className="absolute -bottom-3 left-6 rounded-full bg-[#173653] px-4 py-2 text-[13px] font-semibold text-white shadow-lg">Campus ↔ Career</span>
          </Reveal>

          <Reveal delay={0.08}>
            <SectionTitle align="left" eyebrow="Institutional partnership">
              Build a Stronger Bridge Between Campus and Career.
            </SectionTitle>
            <ul className="mt-8 divide-y divide-[#E6E8F0] border-y border-[#E6E8F0]">
              {BRIDGE.map(({ title, text }) => (
                <li key={title} className="flex gap-4 py-5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF6F3] text-[#00796B]">
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#173653]">{title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-[#475467]">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#E6E8F0] bg-[#F7F9FC] py-16 lg:py-20">
        <Container>
          <SectionTitle eyebrow="FAQ">Frequently asked questions</SectionTitle>
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-[#E6E8F0] rounded-2xl border border-[#E6E8F0] bg-white">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded text-[16px] font-bold text-[#173653] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00796B] [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="text-[22px] leading-none text-[#00796B] group-open:hidden" aria-hidden="true">+</span>
                  <span className="hidden text-[22px] leading-none text-[#00796B] group-open:inline" aria-hidden="true">−</span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-[#475467]">{a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="bg-[#173653] py-16 text-white lg:py-24">
        <Container className="flex flex-col items-center text-center">
          <h2 className="max-w-3xl text-balance text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.1] tracking-tight">
            Let’s Create More <span className="text-[#4DB6AC]">Career Opportunities</span> for Your Students.
          </h2>
          <p className="mt-5 max-w-xl text-white/75 text-[16px] sm:text-[17px] font-normal leading-relaxed">
            Connect your institution with Mzobs and explore how we can support your students’ career journey.
          </p>
          <Link to={CLIENT_ONLY_ROUTES.campusPartnerApply} className={`${cta} mt-9 bg-white !text-[#173653] shadow-none hover:!bg-[#EAF6F3] focus-visible:!outline-white`}>
            Register Your Campus
            <ArrowRight size={17} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Container>
      </section>
    </>
  )
}
