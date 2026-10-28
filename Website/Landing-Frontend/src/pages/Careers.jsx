import { ArrowUpRight, ChevronDown, Compass, GraduationCap, Mail, Users } from 'lucide-react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Reveal from '../components/ui/Reveal'
import ExplorerButton, { ExplorerTextLink } from '../components/ui/ExplorerButton'
import { Container } from '../components/mz/primitives'

const POINTS = ['More opportunities', 'More trust', 'More meaningful careers']

const PRINCIPLES = [
  { num: '01', icon: Users, title: 'People first', body: 'We believe meaningful professional opportunities begin with understanding people.' },
  { num: '02', icon: Compass, title: 'Ownership', body: 'We value initiative, accountability, and practical ideas that make a difference.' },
  { num: '03', icon: GraduationCap, title: 'Keep learning', body: 'We encourage curiosity, collaboration, and continuous improvement.' },
]

const eyebrow = 'text-[12.5px] font-bold uppercase tracking-[0.14em] text-(--explorer-teal)'
const sectionTitle = 'text-[36px] font-extrabold leading-[1.06] tracking-[-0.025em] sm:text-[46px] lg:text-[54px]'
const lead = 'text-[17px] font-medium leading-[1.75] text-(--explorer-muted) sm:text-[18.5px]'

function Photo({ src, alt, className = '', position = 'center' }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-(--explorer-bg) ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: position }} />
    </div>
  )
}

export default function Careers() {
  return (
    <div className="min-h-screen bg-white text-(--explorer-navy) font-sans antialiased selection:bg-(--explorer-teal-surface)">
      <Seo path="/careers" {...STATIC_PAGE_SEO['/careers']} />
      <Navbar />

      {/* A. Hero: headline left, layered photo collage right (all existing
          project images, none of them cropped to a sliver). */}
      <section className="hero-atmosphere relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
        <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <Reveal direction="up" duration={0.7} className="min-w-0">
            <span className={eyebrow}>Careers at Mzobs</span>
            <h1 className="mt-5 text-[34px] sm:text-[44px] lg:text-[52px] font-extrabold leading-[1.08] tracking-tight">
              <span className="block">Build something</span>
              <span className="block text-(--explorer-teal)">meaningful.</span>
              <span className="block">Shape what comes next.</span>
            </h1>
            <p className="mt-6 max-w-xl text-(--explorer-navy)/75 text-[16px] sm:text-[17px] font-normal leading-relaxed">
              Help us make connections between talent and opportunity more thoughtful, transparent, and human.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ExplorerButton href="#opportunities" size="xl">Explore opportunities</ExplorerButton>
              <ExplorerTextLink href="#culture" className="text-[15px]">Our culture</ExplorerTextLink>
            </div>
            <a
              href="#why"
              aria-label="Scroll to learn why Mzobs"
              className="mt-10 hidden items-center gap-2 text-[12.5px] font-bold uppercase tracking-[0.14em] text-(--explorer-muted) hover:text-(--explorer-teal) lg:inline-flex"
            >
              Scroll <ChevronDown size={16} className="motion-safe:animate-bounce" aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal direction="up" delay={0.12} duration={0.8} className="min-w-0">
            <div className="relative mx-auto aspect-[1/1] w-full max-w-[640px]">
              <span aria-hidden="true" className="absolute left-[6%] top-[8%] h-[34%] w-[30%] rounded-2xl bg-(--explorer-teal-surface) ring-1 ring-(--explorer-teal-border)" />
              <Photo
                src="/images/new_images/approach.jpg"
                alt="A team gathered around a whiteboard of sticky notes, planning together"
                className="absolute right-0 top-0 h-[58%] w-[80%] shadow-[0_24px_50px_-28px_rgba(15,35,56,0.45)]"
                position="48% 50%"
              />
              <Photo
                src="/images/new_images/cta_band.jpg"
                alt="Hands in conversation beside a laptop and notebook during a meeting"
                className="absolute bottom-[4%] left-0 h-[36%] w-[48%] border-[5px] border-white shadow-[0_24px_50px_-28px_rgba(15,35,56,0.45)]"
                position="60% 50%"
              />
              <Photo
                src="/images/new_images/our_goal.jpg"
                alt="Two colleagues celebrating together at a desk"
                className="absolute bottom-0 right-0 h-[44%] w-[58%] border-[5px] border-white shadow-[0_24px_50px_-28px_rgba(15,35,56,0.45)]"
                position="50% 40%"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* B. Why Mzobs: two equal columns, readable measure on both sides. */}
      <section id="why" className="scroll-mt-24 py-16 md:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal direction="up" className="min-w-0">
            <span className={eyebrow}>Why Mzobs</span>
            <h2 className={`mt-3 ${sectionTitle}`}>
              <span className="block">Better connections</span>
              <span className="block text-(--explorer-teal)">change careers.</span>
            </h2>
            <p className={`mt-6 max-w-xl ${lead}`}>
              We believe finding the right opportunity should be more transparent, thoughtful, and human. Mzobs is our effort to make the connection between talent and employers better for everyone — from first job to next big opportunity.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2.5 whitespace-nowrap text-[15.5px] font-bold">
                  <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-(--explorer-teal)" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="up" delay={0.1} className="min-w-0">
            <div className="relative mx-auto w-full max-w-[600px] pb-6 pr-6 lg:max-w-none">
              <span aria-hidden="true" className="absolute bottom-0 right-0 h-[72%] w-[72%] rounded-3xl bg-(--explorer-teal-surface) ring-1 ring-(--explorer-teal-border)" />
              <Photo
                src="/images/new_images/galleria_3.jpg"
                alt="A bright, modern open-plan workspace with glass-walled rooms"
                className="relative aspect-[4/3.1] w-full shadow-[0_24px_50px_-28px_rgba(15,35,56,0.45)]"
                position="40% 50%"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* D. Our culture: tinted section, three equal cards. */}
      <section id="culture" className="scroll-mt-24 bg-(--explorer-bg) py-16 md:py-24">
        <Container>
          <Reveal direction="up" className="mx-auto max-w-2xl text-center">
            <span className={eyebrow}>Our culture</span>
            <h2 className={`mt-3 ${sectionTitle}`}>How we work</h2>
            <p className={`mt-4 ${lead}`}>
              A thoughtful, collaborative, and growth-focused environment where your ideas can make a real impact.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.num} direction="up" delay={i * 0.07} className="min-w-0">
                <article className="relative h-full overflow-hidden rounded-2xl border border-(--explorer-border) bg-white p-8 shadow-[0_10px_28px_-20px_rgba(15,23,42,0.3)]">
                  <span aria-hidden="true" className="pointer-events-none absolute right-5 top-3 select-none text-[88px] font-extrabold leading-none tracking-tight text-(--explorer-teal)/10">
                    {p.num}
                  </span>
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-(--explorer-teal-surface) text-(--explorer-teal)">
                    <p.icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-8 text-[26px] font-extrabold tracking-tight">{p.title}</h3>
                  <p className="relative mt-3 text-[16.5px] font-medium leading-relaxed text-(--explorer-muted)">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* E. Open positions. The jobs API only carries employers' listings, not
          Mzobs's own vacancies, so this is an honest empty state whose CTA goes
          to the real contact flow. */}
      <section id="opportunities" className="scroll-mt-24 py-16 md:py-24">
        <Container>
          <Reveal direction="up" className="mx-auto max-w-2xl text-center">
            <span className={eyebrow}>Open positions</span>
            <h2 className={`mt-3 ${sectionTitle}`}>Find your place at Mzobs.</h2>
            <p className={`mt-4 ${lead}`}>Bring your perspective. Build something meaningful.</p>
          </Reveal>
          <Reveal direction="up" delay={0.08}>
            <div className="mx-auto mt-10 grid max-w-5xl items-center gap-8 rounded-3xl border border-(--explorer-border) bg-(--explorer-bg) p-6 sm:p-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:gap-10">
              <div className="relative aspect-[1536/860] w-full overflow-hidden rounded-2xl bg-white ring-1 ring-(--explorer-border)">
                {/* The illustration's own caption bar sits in its bottom 17%;
                    this frame is shorter than the image so it stays hidden. */}
                <img
                  src="/images/aboutimage.png"
                  alt="Illustration of a job seeker and an employer connected by the Mzobs handshake"
                  width="1536"
                  height="1024"
                  loading="lazy"
                  className="absolute inset-x-0 top-0 h-auto w-full max-w-none"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-[26px] font-extrabold leading-tight tracking-tight">No openings listed right now</h3>
                <p className="mt-3 text-[16.5px] font-medium leading-relaxed text-(--explorer-muted)">
                  We don&rsquo;t have any open roles at the moment. If you&rsquo;d like to be considered for future opportunities, we&rsquo;d love to hear from you.
                </p>
                <ExplorerButton to="/contact" size="lg" className="mt-6">
                  <Mail size={16} aria-hidden="true" /> Get in touch
                </ExplorerButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* F. Closing: text left, local career-journey illustration right.
          The CTA goes to the live job listings, a real destination while
          Mzobs has no openings of its own. */}
      <section className="pb-16 md:pb-24">
        <Container>
          <Reveal direction="up">
            <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-(--explorer-teal-surface) p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:p-14">
              <div className="min-w-0">
                <span className={eyebrow}>Join our journey</span>
                <h2 className="mt-3 text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.1] tracking-tight">
                  <span className="block">Your next chapter</span>
                  <span className="block text-(--explorer-teal)">starts with a conversation.</span>
                </h2>
                <p className="mt-5 max-w-lg text-(--explorer-navy)/75 text-[16px] sm:text-[17px] font-normal leading-relaxed">
                  Interested in contributing to what we&rsquo;re building? Explore available opportunities and be part of a more meaningful future.
                </p>
                <ExplorerButton to="/#latest-jobs" size="xl" className="mt-8">
                  Explore opportunities <ArrowUpRight size={17} aria-hidden="true" />
                </ExplorerButton>
              </div>
              <img
                src="/images/careers-journey.svg"
                alt="A winding path through hills toward a rising sun, with signposts pointing the way"
                width="640"
                height="440"
                loading="lazy"
                className="h-auto w-full min-w-0 rounded-2xl"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <Footer />
    </div>
  )
}
