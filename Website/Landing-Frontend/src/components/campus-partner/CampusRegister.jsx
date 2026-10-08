import { Link } from 'react-router-dom'
import { Container } from '../mz/primitives'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

const POINTS = [
  'Verified opportunities for your students',
  'Career readiness and industry connections',
  'A dedicated Mzobs contact for your institution',
]

const BENEFITS = [
  { title: 'Verified jobs & internships', text: 'Relevant, screened opportunities for your students.' },
  { title: 'Career preparation', text: 'Resume, interview and skill readiness support.' },
  { title: 'Employer access', text: 'Direct connections with companies hiring freshers.' },
  { title: 'Campus hiring drives', text: 'Help organizing placement drives and hiring events.' },
  { title: 'Placement insights', text: 'A clearer view of where your students are heading.' },
  { title: 'A dedicated contact', text: 'One Mzobs point of contact for your institution.' },
]

const STEPS = [
  { title: 'Submit your details', text: 'Tell us about your institution in a short form. It takes about two minutes.' },
  { title: 'We review & verify', text: 'Our team checks your details and gets in touch with you.' },
  { title: 'Your students get started', text: 'Once verified, your campus joins Mzobs and students can access opportunities.' },
]

const FAQ = [
  { q: 'Who can add their campus?', a: 'Colleges, universities, polytechnics, management institutes and other educational institutions.' },
  { q: 'Does it cost anything?', a: 'No. Submitting a campus request is free. Our team will share the details when they contact you.' },
  { q: 'What happens after I submit?', a: 'Our team reviews your request and contacts you on the email and phone you provide.' },
  { q: 'How long does verification take?', a: 'We aim to get back to you soon after reviewing your details. Share accurate contact information to speed it up.' },
]

const btn = 'inline-flex h-12 items-center rounded-md bg-[#0b7a6d] px-6 text-[15px] font-semibold text-white hover:bg-[#096558] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b7a6d]'
const h2 = 'text-[26px] font-extrabold text-[#101828] sm:text-[32px]'

export default function CampusRegister() {
  return (
    <>
      <section className="border-b border-[#E6E8F0] bg-[#F8FAFC] pb-14 pt-28 lg:pb-20 lg:pt-36">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wide text-[#0b7a6d]">For Campuses</p>
            <h1 className="mt-3 text-[34px] font-extrabold leading-[1.15] text-[#101828] sm:text-[44px]">Add your campus to Mzobs</h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-[#475467]">
              Connect your students with verified opportunities, career preparation and industry connections.
            </p>
            <div className="mt-7">
              <Link to={CLIENT_ONLY_ROUTES.campusPartnerApply} className={btn}>Add Your Campus</Link>
              <p className="mt-2.5 text-[13px] text-[#475467]">For colleges, universities and institutions</p>
            </div>
          </div>

          <div className="rounded-lg border border-[#E6E8F0] bg-white p-6">
            <h2 className="text-[16px] font-bold text-[#101828]">What you get</h2>
            <ul className="mt-4 space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex gap-3 text-[14.5px] leading-snug text-[#475467]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b7a6d]" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <Container>
          <h2 className={h2}>What your campus gets</h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ title, text }) => (
              <li key={title} className="rounded-lg border border-[#E6E8F0] p-5">
                <h3 className="text-[15.5px] font-bold text-[#101828]">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#475467]">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-y border-[#E6E8F0] bg-[#F8FAFC] py-14 lg:py-20">
        <Container>
          <h2 className={h2}>How it works</h2>
          <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STEPS.map(({ title, text }, i) => (
              <li key={title} className="rounded-lg border border-[#E6E8F0] bg-white p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0b7a6d] text-[14px] font-bold text-white">{i + 1}</span>
                <h3 className="mt-3 text-[15.5px] font-bold text-[#101828]">{title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#475467]">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <Container>
          <h2 className={h2}>Frequently asked questions</h2>
          <div className="mt-6 max-w-3xl divide-y divide-[#EAECF0] rounded-lg border border-[#E6E8F0] bg-white">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-[#101828] [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="text-[20px] leading-none text-[#475467] group-open:hidden" aria-hidden="true">+</span>
                  <span className="hidden text-[20px] leading-none text-[#475467] group-open:inline" aria-hidden="true">−</span>
                </summary>
                <p className="mt-2.5 text-[14px] leading-relaxed text-[#475467]">{a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#101828] py-14 text-white lg:py-16">
        <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-[24px] font-extrabold sm:text-[28px]">Ready to connect your campus?</h2>
            <p className="mt-1.5 text-[15px] text-white/70">Submit your details and our team will get back to you.</p>
          </div>
          <Link to={CLIENT_ONLY_ROUTES.campusPartnerApply} className={btn}>Add Your Campus</Link>
        </Container>
      </section>
    </>
  )
}
