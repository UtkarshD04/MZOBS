import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronsRight } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Container } from '../components/mz/primitives'
import { CONTACT_EMAIL } from '../lib/config'
import { CLIENT_ONLY_ROUTES } from '../lib/routes'

// Copy here is deliberately limited to what the Mzobs team has asked for —
// placement companies in large and small cities associating with Mzobs. The
// commercial terms aren't promised on the page; the team agrees them after review.
const ctaCls =
  'inline-flex items-center justify-center gap-2 rounded-[3px] px-6 py-3 text-[13px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary'

export default function Associate() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Become an Associate — Mzobs'
    return () => { document.title = prev }
  }, [])

  return (
    <div className="mz-home min-h-screen bg-white font-sans text-mz-ink antialiased">
      <Navbar />
      <main>
        {/* Title band + accent strip */}
        <section className="bg-mz-dark pt-16" aria-labelledby="associate-title">
          <Container className="py-14 sm:py-20">
            <h1 id="associate-title" className="text-[40px] font-extrabold leading-none tracking-[-0.02em] text-white sm:text-[56px] lg:text-[68px]">
              Become an Associate
            </h1>
          </Container>
        </section>
        <div className="bg-mz-primary py-3 text-center text-[20px] font-extrabold tracking-tight text-white sm:text-[24px]" aria-hidden="true">
          Associate with Mzobs
        </div>

        <Container className="max-w-5xl py-10 sm:py-14">
          <h2 className="text-[24px] font-extrabold tracking-tight sm:text-[28px]">Grow with the Mzobs network</h2>
          <div className="mt-4 max-w-3xl space-y-4 text-[15.5px] leading-relaxed text-mz-ink-2">
            <p>
              If you run a placement company, associating with Mzobs puts your business inside one hiring network. Mzobs brings job seekers and employers together,
              and associated placement companies are attached to that network.
            </p>
            <p>
              It doesn’t matter where you are. We want placement companies from big cities and from small towns alike, so that good candidates and real
              openings can find each other everywhere.
            </p>
          </div>

          <h2 className="mt-12 text-[24px] font-extrabold tracking-tight sm:text-[28px]">Partner with Mzobs in your city</h2>
          <h3 className="mt-5 text-[17px] font-bold">What we seek?</h3>
          <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-mz-ink-2">
            Placement companies in large and small cities, with a candidate-first approach and a genuine interest in connecting people with jobs. Once
            we’ve reviewed your request, the Mzobs team gets in touch to agree how we’ll work together.
          </p>

          {/* Notice */}
          <div className="mt-12 border-y border-mz-line py-8 text-center">
            <p className="text-[18px] font-extrabold uppercase tracking-tight text-mz-ink sm:text-[24px]">Apply only through this official Mzobs page</p>
            <p className="mx-auto mt-2 max-w-2xl text-[14.5px] text-mz-muted">Not sure about something, or want to check a message you received? Write to us before you share any details.</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className={`${ctaCls} mt-4 bg-mz-primary text-white hover:bg-mz-primary-strong`}>
              Contact us
            </a>
          </div>

          {/* Action row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mz-line py-5">
            <Link to={CLIENT_ONLY_ROUTES.associateApply} className={`${ctaCls} bg-mz-primary text-white hover:bg-mz-primary-strong`}>
              Online associate application form <ChevronsRight size={17} aria-hidden="true" />
            </Link>
            <p className="flex items-center gap-3 text-[14px] text-mz-ink-2">
              Questions about associating?
              <a href={`mailto:${CONTACT_EMAIL}`} className={`${ctaCls} bg-mz-dark text-white hover:bg-mz-ink`}>Click here</a>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
