import { ArrowRight, Briefcase } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHero from '../components/sections/PageHero'
import StatStrip from '../components/sections/StatStrip'
import ExpertiseGrid from '../components/sections/ExpertiseGrid'
import LogoCloud from '../components/sections/LogoCloud'
import CTABand from '../components/sections/CTABand'
import Button, { goldSolidClass } from '../components/ui/Button'
import { CONTACT_EMAIL } from '../lib/config'
import { EMPLOYER_FEATURES, EMPLOYER_STATS, TRUSTED_LOGOS } from '../lib/content'

export default function Employer() {
  return (
    <div className="min-h-screen bg-bg">
      <title>For Employers — Mzobs</title>
      <Navbar />

      <PageHero
        kicker="For Employers"
        bgImage="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=85"
        title={
          <>
            Hire Verified Talent, Not A Stack Of <em className="italic text-amber-400">Unread</em> Resumes.
          </>
        }
        subtitle="A single pipeline for requirements, interviews, offers and billing — filled only with candidates our team has personally screened."
        photoIcon={Briefcase}
        actions={
          <>
            <Button to="/employers/signup" variant="primary" size="lg" pill className={goldSolidClass}>
              Create your account <ArrowRight size={16} />
            </Button>
            <Button to="/employers/signin" variant="secondary" size="lg" pill className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/25">
              Sign in
            </Button>
          </>
        }
      />

      <StatStrip stats={EMPLOYER_STATS} />

      <ExpertiseGrid
        eyebrow="Why Employers Choose Mzobs"
        title={
          <>
            Everything Hiring Teams Need, <em className="italic text-[#0B1220]">In One Portal</em>
          </>
        }
        subtitle="From requirement to offer letter, without switching tools."
        items={EMPLOYER_FEATURES}
        photoIcon={Briefcase}
        ctaLabel="Talk to our team"
        ctaHref="/contact"
        featuredCard={{
          titlePrefix: "Build Your ",
          titleItalic: "Dream Hiring Pipeline",
          ctaText: "Talk To Our Team",
          ctaHref: `mailto:${CONTACT_EMAIL}`,
          bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85"
        }}
        reverse
      />

      <LogoCloud eyebrow="Trusted By" title="Companies Hiring On Mzobs" logos={TRUSTED_LOGOS} />

      <CTABand
        bgImage="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=2000&q=85"
        title={
          <>
            Ready To Hire Your Next <em className="italic text-amber-300">Verified Candidate</em>?
          </>
        }
        subtitle="Create your free employer account in minutes, or sign in if you already have one."
        photoIcon={Briefcase}
        actions={
          <>
            <Button to="/employers/signup" variant="primary" size="lg" pill className={goldSolidClass}>
              Create your account <ArrowRight size={16} />
            </Button>
            <Button to="/employers/signin" variant="secondary" size="lg" pill className="bg-white/10 border-white/20 text-white hover:bg-white/15">
              Sign in
            </Button>
          </>
        }
      />

      <Footer />
    </div>
  )
}
