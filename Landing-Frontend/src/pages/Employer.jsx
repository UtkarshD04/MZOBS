import { ArrowRight, Briefcase } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHero from '../components/sections/PageHero'
import StatStrip from '../components/sections/StatStrip'
import ExpertiseGrid from '../components/sections/ExpertiseGrid'
import ApproachSteps from '../components/sections/ApproachSteps'
import TestimonialRow from '../components/sections/TestimonialRow'
import LogoCloud from '../components/sections/LogoCloud'
import CTABand from '../components/sections/CTABand'
import Button, { goldSolidClass } from '../components/ui/Button'
import { CONTACT_EMAIL, EMPLOYER_LOGIN_URL } from '../lib/config'
import { EMPLOYER_FEATURES, EMPLOYER_STATS, EMPLOYER_STEPS, EMPLOYER_TESTIMONIAL, TRUSTED_LOGOS } from '../lib/content'

export default function Employer() {
  return (
    <div className="min-h-screen bg-bg">
      <title>For Employers — Mzobs</title>
      <Navbar />

      <PageHero
        kicker="For Employers"
        title={
          <>
            Hire Verified Talent, Not A Stack Of <em className="italic text-gold-dot">Unread</em> Resumes.
          </>
        }
        subtitle="A single pipeline for requirements, interviews, offers and billing — filled only with candidates our team has personally screened."
        photoIcon={Briefcase}
        actions={
          <>
            <Button href={EMPLOYER_LOGIN_URL} variant="primary" size="lg" pill className={goldSolidClass}>
              Sign in to your portal <ArrowRight size={16} />
            </Button>
            <Button
              href={`mailto:${CONTACT_EMAIL}`}
              variant="secondary"
              size="lg"
              pill
              className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/25"
            >
              Talk to our team
            </Button>
          </>
        }
      />

      <StatStrip stats={EMPLOYER_STATS} />

      <ExpertiseGrid
        eyebrow="Why Employers Choose Mzobs"
        title={
          <>
            Everything Hiring Teams Need, <em className="italic text-gold-strong">In One Portal</em>
          </>
        }
        subtitle="From requirement to offer letter, without switching tools."
        items={EMPLOYER_FEATURES}
        photoIcon={Briefcase}
        ctaLabel="Talk to our team"
        ctaHref="/contact"
        reverse
      />

      <ApproachSteps eyebrow="How It Works" title="Four Steps To Your Next Hire" subtitle="From open requirement to signed offer." steps={EMPLOYER_STEPS} />

      <TestimonialRow eyebrow="Customer Stories" title="What Employers Say" testimonials={[EMPLOYER_TESTIMONIAL]} />

      <LogoCloud eyebrow="Trusted By" title="Companies Hiring On Mzobs" logos={TRUSTED_LOGOS} />

      <CTABand
        title={
          <>
            Ready To Hire Your Next <em className="italic text-gold-dot">Verified Candidate</em>?
          </>
        }
        subtitle="Employer accounts are provisioned by our team — sign in if you already have one, or reach out to get started."
        photoIcon={Briefcase}
        actions={
          <>
            <Button href={EMPLOYER_LOGIN_URL} variant="primary" size="lg" pill className={goldSolidClass}>
              Sign in <ArrowRight size={16} />
            </Button>
            <Button
              href={`mailto:${CONTACT_EMAIL}`}
              variant="secondary"
              size="lg"
              pill
              className="bg-white/10 border-white/20 text-white hover:bg-white/15"
            >
              Talk to our team
            </Button>
          </>
        }
      />

      <Footer />
    </div>
  )
}
