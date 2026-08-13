import { Building2, Rocket } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHero from '../components/sections/PageHero'
import StatStrip from '../components/sections/StatStrip'
import SplitBlock from '../components/sections/SplitBlock'
import TeamGrid from '../components/sections/TeamGrid'
import ApproachSteps from '../components/sections/ApproachSteps'
import LogoCloud from '../components/sections/LogoCloud'
import CTABand from '../components/sections/CTABand'
import Button, { goldSolidClass } from '../components/ui/Button'
import { HOME_STATS, HOME_STEPS, TEAM, TRUSTED_LOGOS } from '../lib/content'

export default function About() {
  return (
    <div className="min-h-screen bg-bg">
      <title>About Us — Mzobs</title>
      <Navbar />

      <PageHero
        kicker="About Mzobs"
        title={
          <>
            Hiring, <em className="italic text-gold-dot">Rebuilt</em> From Both Sides.
          </>
        }
        subtitle="We're a team of operations people, not just software — every profile and every requirement on Mzobs is reviewed by a person before it goes live."
        photoIcon={Building2}
        bgImage="/images/who-we-are-hero-new.jpg"
      />

      <section className="max-w-3xl mx-auto px-6 py-14 text-center">
        <p className="text-[15.5px] sm:text-[17px] leading-relaxed text-ink-secondary">
          Mzobs exists to <em className="italic text-gold-strong">navigate</em> job seekers toward roles they're actually qualified for, and to{' '}
          <em className="italic text-gold-strong">refine</em> employer pipelines down to candidates worth their time — so that both sides{' '}
          <em className="italic text-gold-strong">achieve</em> a faster, better hire.
        </p>
      </section>

      <StatStrip stats={HOME_STATS} />

      <SplitBlock
        eyebrow="Our Story"
        title="How Mzobs Started"
        text="Mzobs started because hiring was broken on both sides — job seekers were applying into a void, and employers were drowning in unscreened resumes. We started as a small placement team rebuilding resumes by hand, and grew into a platform that verifies every profile and every requirement before it reaches the other side."
        cta={
          <Button href="mailto:hello@mzobs.com" variant="secondary" size="lg" pill>
            Get in touch
          </Button>
        }
        photoIcon={Rocket}
        reverse
      />

      <TeamGrid members={TEAM} />

      <ApproachSteps eyebrow="How We Work" title="Verification, Not Just Listings" subtitle="The same four steps power every profile and every requirement on Mzobs." steps={HOME_STEPS} />

      <LogoCloud logos={TRUSTED_LOGOS} />

      <CTABand
        title={
          <>
            Ready to <em className="italic text-gold-dot">Get Started</em>?
          </>
        }
        subtitle="Whichever side of hiring you're on, our team verifies it before it goes live."
        photoIcon={Building2}
        actions={
          <>
            <Button to="/employees" variant="primary" size="lg" pill className={goldSolidClass}>
              For Employees
            </Button>
            <Button href="#contact" variant="secondary" size="lg" pill className="bg-white/10 border-white/20 text-white hover:bg-white/15">
              Contact Us
            </Button>
          </>
        }
      />

      <Footer />
    </div>
  )
}
