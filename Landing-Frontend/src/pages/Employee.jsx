import { ArrowRight, GraduationCap } from 'lucide-react'
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
import { EMPLOYEE_LOGIN_URL, EMPLOYEE_REGISTER_URL } from '../lib/config'
import { EMPLOYEE_FEATURES, EMPLOYEE_STATS, EMPLOYEE_STEPS, EMPLOYEE_TESTIMONIAL, TRUSTED_LOGOS } from '../lib/content'

export default function Employee() {
  return (
    <div className="min-h-screen bg-bg">
      <title>For Employees — Mzobs</title>
      <Navbar />

      <PageHero
        kicker="For Job Seekers"
        title={
          <>
            Find A Role You&rsquo;re <em className="italic text-gold-dot">Actually</em> Qualified For.
          </>
        }
        subtitle="Verified resumes, guided training and real mock interviews — everything between job hunting and placed, in one dashboard."
        photoIcon={GraduationCap}
        actions={
          <>
            <Button href={EMPLOYEE_REGISTER_URL} variant="primary" size="lg" pill className={goldSolidClass}>
              Create free account <ArrowRight size={16} />
            </Button>
            <Button href={EMPLOYEE_LOGIN_URL} variant="secondary" size="lg" pill className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/25">
              Sign in
            </Button>
          </>
        }
      />

      <StatStrip stats={EMPLOYEE_STATS} />

      <ExpertiseGrid
        eyebrow="Why Job Seekers Choose Mzobs"
        title={
          <>
            Everything You Need To <em className="italic text-gold-strong">Get Placed</em>
          </>
        }
        subtitle="One platform, from your first resume draft to your signed offer."
        items={EMPLOYEE_FEATURES}
        photoIcon={GraduationCap}
        ctaLabel="Create free account"
        ctaHref={EMPLOYEE_REGISTER_URL}
      />

      <ApproachSteps eyebrow="How It Works" title="Four Steps To Placed" subtitle="From sign-up to signed offer." steps={EMPLOYEE_STEPS} />

      <TestimonialRow eyebrow="Success Stories" title="What Job Seekers Say" testimonials={[EMPLOYEE_TESTIMONIAL]} />

      <LogoCloud eyebrow="Recently Placed At" title="Our Candidates Work At" logos={TRUSTED_LOGOS} />

      <CTABand
        title={
          <>
            Ready To Start Your <em className="italic text-gold-dot">Placement Journey</em>?
          </>
        }
        subtitle="Free to join. Verified by our operations team before anything reaches an employer."
        photoIcon={GraduationCap}
        actions={
          <Button href={EMPLOYEE_REGISTER_URL} variant="primary" size="lg" pill className={goldSolidClass}>
            Create free account <ArrowRight size={16} />
          </Button>
        }
      />

      <Footer />
    </div>
  )
}
