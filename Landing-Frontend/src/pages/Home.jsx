import { ArrowRight, Briefcase, GraduationCap, Handshake, Users2 } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHero from '../components/sections/PageHero'
import StatStrip from '../components/sections/StatStrip'
import ExpertiseGrid from '../components/sections/ExpertiseGrid'
import SectionHeading from '../components/sections/SectionHeading'
import PathCard from '../components/sections/PathCard'
import TestimonialRow from '../components/sections/TestimonialRow'
import SplitBlock from '../components/sections/SplitBlock'
import ApproachSteps from '../components/sections/ApproachSteps'
import LogoCloud from '../components/sections/LogoCloud'
import CTABand from '../components/sections/CTABand'
import Button, { goldSolidClass } from '../components/ui/Button'
import { HOME_FEATURES, HOME_STATS, HOME_STEPS, HOME_TESTIMONIALS, TRUSTED_LOGOS } from '../lib/content'

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <title>Mzobs — Careers &amp; Hiring Platform</title>
      <Navbar />

      <PageHero
        size="lg"
        kicker="Careers & Hiring, Simplified"
        title={
          <>
            Where <em className="italic text-gold-dot">Great Talent</em> Meets Great Companies.
          </>
        }
        subtitle="Mzobs is a results-driven hiring platform helping job seekers land verified roles and employers hire pre-screened talent — faster, and with less noise."
        photoIcon={Handshake}
        actions={
          <>
            <Button to="/employees" variant="primary" size="lg" pill className={goldSolidClass}>
              For Employees <ArrowRight size={16} />
            </Button>
            <Button to="/employers" variant="secondary" size="lg" pill className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/25">
              For Employers
            </Button>
          </>
        }
      />

      <section className="max-w-3xl mx-auto px-6 py-14 text-center">
        <p className="text-[15.5px] sm:text-[17px] leading-relaxed text-ink-secondary">
          Mzobs is a results-driven hiring platform helping job seekers <em className="italic text-gold-strong">navigate</em> their careers,{' '}
          <em className="italic text-gold-strong">refine</em> their next move, and helping employers <em className="italic text-gold-strong">achieve</em>{' '}
          sustainable growth — with verified people on both sides of the table.
        </p>
      </section>

      <StatStrip stats={HOME_STATS} />

      <ExpertiseGrid
        eyebrow="What We Offer"
        title={
          <>
            What We <em className="italic text-gold-strong">Offer</em>
          </>
        }
        subtitle="The pieces every good hire is built on, whichever side of the table you're on."
        items={HOME_FEATURES}
        photoIcon={GraduationCap}
        ctaLabel="Create free account"
        ctaHref="/employees"
      />

      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <SectionHeading eyebrow="Get Started" title="Choose Your Path" subtitle="One platform, two doors in — tell us which one is yours." className="mb-12" />
        <div className="grid sm:grid-cols-2 gap-6">
          <PathCard
            photoIcon={GraduationCap}
            tags={['For Job Seekers', 'Free to join']}
            title="Looking for your next role?"
            desc="Get a verified profile, guided training and real mock interviews — everything between job hunting and placed."
            ctaLabel="Explore for Employees"
            href="/employees"
          />
          <PathCard
            photoIcon={Briefcase}
            tags={['For Employers', 'Verified pipeline']}
            title="Hiring for your company?"
            desc="Skip the unread resumes — review a shortlist of candidates our team has already screened."
            ctaLabel="Explore for Employers"
            href="/employers"
          />
        </div>
      </section>

      <TestimonialRow testimonials={HOME_TESTIMONIALS} />

      <SplitBlock
        eyebrow="Our Story"
        title={
          <>
            Built By People Who&rsquo;ve <em className="italic text-gold-strong">Done This Before</em>
          </>
        }
        text="Mzobs started because hiring was broken on both sides — job seekers were applying into a void, and employers were drowning in unscreened resumes. So we built a team that verifies both, before anyone's time gets wasted."
        cta={
          <Button to="/about" variant="secondary" size="lg" pill>
            Learn More About Us
          </Button>
        }
        photoIcon={Users2}
      />

      <ApproachSteps eyebrow="How It Works" title="Our Approach" subtitle="The same four steps power both sides of the platform." steps={HOME_STEPS} />

      <LogoCloud logos={TRUSTED_LOGOS} />

      <CTABand
        title={
          <>
            Ready to <em className="italic text-gold-dot">Get Started</em>?
          </>
        }
        subtitle="Free to join. Every profile and every requirement is verified by our operations team."
        photoIcon={Users2}
        actions={
          <>
            <Button to="/employees" variant="primary" size="lg" pill className={goldSolidClass}>
              Join as Employee <ArrowRight size={16} />
            </Button>
            <Button to="/employers" variant="secondary" size="lg" pill className="bg-white/10 border-white/20 text-white hover:bg-white/15">
              Join as Employer
            </Button>
          </>
        }
      />

      <Footer />
    </div>
  )
}
