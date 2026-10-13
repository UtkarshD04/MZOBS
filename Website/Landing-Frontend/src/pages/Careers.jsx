import { ArrowUpRight, Briefcase, Building2, Check, GraduationCap, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Reveal from '../components/ui/Reveal'
import ExplorerButton from '../components/ui/ExplorerButton'
import ContactForm from '../components/forms/ContactForm'
import { Container } from '../components/mz/primitives'
import { CONTACT_ADDRESS, CONTACT_EMAIL } from '../lib/config'

// Many people land on "Careers" looking for a job (or to hire), not to work
// at Mzobs, so the first thing after the hero routes them to the right place.
const ROUTES = [
  { icon: Briefcase, title: 'Looking for a job?', body: 'Browse openings from employers hiring now.', cta: 'Find jobs', to: '/#latest-jobs' },
  { icon: Building2, title: 'Hiring for your team?', body: 'Post a job and manage applicants in one place.', cta: 'Post a job', to: '/employers/signup' },
  { icon: GraduationCap, title: 'Representing a college?', body: 'Bring Mzobs to your campus and your students.', cta: 'Add your campus', to: '/add-your-campus' },
  { icon: Users, title: 'Want to work at Mzobs?', body: 'Tell us about yourself and the work you do.', cta: 'Share your interest', to: '#interest' },
]

const INCLUDE = [
  'Your resume, or a link to your LinkedIn, portfolio or GitHub',
  'The kind of work you want to do here, in a line or two',
  'Something you have built, run or improved that you are proud of',
  'Where you are based and when you could start',
]

const PRINCIPLES = [
  { num: '01', title: 'People first', body: 'We believe meaningful professional opportunities begin with understanding people.' },
  { num: '02', title: 'Ownership', body: 'We value initiative, accountability, and ideas that improve how we work.' },
  { num: '03', title: 'Keep learning', body: 'We encourage curiosity, collaboration, and continuous improvement.' },
]

const FAQS = [
  { q: 'Does Mzobs have open roles right now?', a: 'No positions are listed at the moment. New roles will be posted on this page when they open, and you can share your interest below in the meantime.' },
  { q: 'How do I get in touch about working at Mzobs?', a: `Use the form on this page or write to ${CONTACT_EMAIL} with the subject "Careers at Mzobs". Include the details listed above so we can understand your background.` },
  { q: 'I want to find a job, not work at Mzobs. Where do I start?', a: 'Head to the jobs listings and create a free profile. Employers on Mzobs post their openings there.' },
  { q: 'Where is the Mzobs team based?', a: `Our office is at ${CONTACT_ADDRESS}.` },
]

const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_ADDRESS)}`

const eyebrow = 'text-[12.5px] font-bold uppercase tracking-[0.14em] text-(--explorer-teal)'
const sectionTitle = 'text-[32px] font-extrabold leading-[1.08] tracking-[-0.025em] text-balance sm:text-[42px] lg:text-[48px]'

function RouteLink({ to, className, children }) {
  return to.startsWith('#') ? <a href={to} className={className}>{children}</a> : <Link to={to} className={className}>{children}</Link>
}

export default function Careers() {
  return (
    <div className="min-h-screen bg-white text-(--explorer-navy) font-sans antialiased selection:bg-(--explorer-teal-surface)">
      <Seo path="/careers" {...STATIC_PAGE_SEO['/careers']} />
      <Navbar />

      {/* Hero. The photo is the site's existing team-at-the-whiteboard image. */}
      <section className="hero-atmosphere relative overflow-hidden pt-28 pb-14 md:pt-32 md:pb-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal direction="up" duration={0.7}>
            <span className={eyebrow}>Careers at Mzobs</span>
            <h1 className="mt-5 text-[44px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[60px] xl:text-[70px]">
              Build something <span className="text-(--explorer-teal)">meaningful.</span>
              <span className="mt-1 block text-(--explorer-navy)/90">Shape what comes next.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] font-medium leading-relaxed text-(--explorer-navy)/75 sm:text-[19px]">
              Help us make connections between talent and opportunity more thoughtful, transparent, and human.
            </p>
            <div className="mt-8">
              <ExplorerButton href="#opportunities" size="xl">Explore opportunities</ExplorerButton>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.12} duration={0.8}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(15,35,56,0.4)]">
              <img
                src="/images/new_images/approach.jpg"
                alt="A team gathered around a whiteboard of sticky notes, planning together"
                width="1200"
                height="800"
                className="absolute inset-0 h-full w-full object-cover object-[48%_50%]"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Where to start */}
      <section className="py-14 md:py-20">
        <Container>
          <Reveal direction="up" className="max-w-2xl">
            <span className={eyebrow}>Where to start</span>
            <h2 className={`mt-3 ${sectionTitle}`}>Not sure you&rsquo;re in the right place?</h2>
          </Reveal>
          <div className="mt-10 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {ROUTES.map((r, i) => (
              <Reveal key={r.title} direction="up" delay={i * 0.05}>
                <RouteLink
                  to={r.to}
                  className="group block h-full border-t-2 border-(--explorer-border) py-6 transition-colors duration-200 hover:border-(--explorer-teal) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
                >
                  <r.icon size={22} strokeWidth={1.8} className="text-(--explorer-teal)" aria-hidden="true" />
                  <h3 className="mt-4 text-[19px] font-extrabold tracking-tight">{r.title}</h3>
                  <p className="mt-1.5 text-[15.5px] font-medium leading-relaxed text-(--explorer-muted)">{r.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[14.5px] font-bold text-(--explorer-blue) group-hover:text-(--explorer-blue-hover)">
                    {r.cta} <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </RouteLink>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Open roles. The jobs API only carries employers' listings, not
          Mzobs's own vacancies, so this is an honest empty state plus what to
          send when getting in touch. */}
      <section id="opportunities" className="scroll-mt-24 bg-(--explorer-bg) py-14 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="up">
            <span className={eyebrow}>Open roles</span>
            <h2 className={`mt-3 ${sectionTitle}`}>Find your place at Mzobs.</h2>
            <p className="mt-4 text-[18px] font-medium text-(--explorer-muted)">Bring your perspective. Build something meaningful.</p>
            <div className="mt-8 border-l-2 border-(--explorer-teal) pl-5">
              <h3 className="text-[20px] font-extrabold">No positions are listed right now.</h3>
              <p className="mt-1.5 text-[16.5px] font-medium leading-relaxed text-(--explorer-muted)">
                New roles will appear here when they open. Until then, you can share your interest and we&rsquo;ll keep it on file.
              </p>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.08}>
            <h3 className="text-[18px] font-extrabold">What to include when you write to us</h3>
            <ul className="mt-4 space-y-3.5">
              {INCLUDE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[16.5px] font-medium leading-relaxed">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--explorer-teal-surface) text-(--explorer-teal)">
                    <Check size={12} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Share your interest: the real contact form, pre-filled for careers. */}
      <section id="interest" className="scroll-mt-24 py-14 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
          <Reveal direction="up">
            <span className={eyebrow}>Share your interest</span>
            <h2 className={`mt-3 ${sectionTitle}`}>Tell us about yourself.</h2>
            <p className="mt-4 text-[17px] font-medium leading-relaxed text-(--explorer-muted)">
              Send a note through the form and our team will reply by email. You can also write to us directly.
            </p>
            <ul className="mt-6 space-y-3 text-[16px] font-medium">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}?subject=Careers%20at%20Mzobs`} className="font-bold underline decoration-(--explorer-border) underline-offset-4 hover:text-(--explorer-teal) hover:decoration-(--explorer-teal)">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2.5 leading-relaxed">
                  <MapPin size={18} className="mt-1 shrink-0 text-(--explorer-teal)" aria-hidden="true" />
                  <span className="text-(--explorer-muted) group-hover:text-(--explorer-teal)">{CONTACT_ADDRESS}</span>
                </a>
              </li>
            </ul>
          </Reveal>
          <Reveal direction="up" delay={0.08}>
            <div className="rounded-xl border border-(--explorer-border) bg-white p-6 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.25)] sm:p-8">
              <ContactForm defaults={{ role: 'Other', subject: 'Careers at Mzobs' }} />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* How we work */}
      <section id="culture" className="scroll-mt-24 bg-(--explorer-bg) py-14 md:py-20">
        <Container>
          <Reveal direction="up" className="max-w-2xl">
            <span className={eyebrow}>Working at Mzobs</span>
            <h2 className={`mt-3 ${sectionTitle}`}>How we work</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.num} direction="up" delay={i * 0.07}>
                <div className="border-t-2 border-(--explorer-teal) pt-4">
                  <span className="text-[14px] font-bold tracking-[0.14em] text-(--explorer-teal)">{p.num}</span>
                  <h3 className="mt-4 text-[26px] font-extrabold tracking-tight sm:text-[30px]">{p.title}</h3>
                  <p className="mt-2 text-[16.5px] font-medium leading-relaxed text-(--explorer-muted)">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-14 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
          <Reveal direction="up">
            <span className={eyebrow}>Questions</span>
            <h2 className={`mt-3 ${sectionTitle}`}>Before you write</h2>
          </Reveal>
          <Reveal direction="up" delay={0.08}>
            <div className="divide-y divide-(--explorer-border) border-y border-(--explorer-border)">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17.5px] font-bold [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue)">
                    {f.q}
                    <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--explorer-bg) text-[18px] leading-none text-(--explorer-teal) transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-[16.5px] font-medium leading-relaxed text-(--explorer-muted)">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <Footer />
    </div>
  )
}
