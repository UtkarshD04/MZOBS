import { ArrowRight, GraduationCap } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHero from '../components/sections/PageHero'
import StatStrip from '../components/sections/StatStrip'
import CandidateJourneySection from '../components/sections/CandidateJourneySection'
import OurGoalSection from '../components/sections/OurGoalSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import CTABand from '../components/sections/CTABand'
import Button, { goldSolidClass } from '../components/ui/Button'
import { EMPLOYEE_GOAL_DATA, EMPLOYEE_STATS, EMPLOYEE_TESTIMONIALS } from '../lib/content'

export default function Employee() {
  return (
    <div className="min-h-screen bg-bg">
      <title>For Employees — Mzobs</title>
      <Navbar />

      <PageHero
        kicker="For Job Seekers"
        bgImage="/images/employeeheroimagejpeg.jpeg"
        bgFit="contain"
        title={
          <>
            Find A Role You&rsquo;re <em className="italic text-amber-400">Actually</em> Qualified For.
          </>
        }
        subtitle="Verified resumes, guided training and real mock interviews — everything between job hunting and placed, in one dashboard."
        photoIcon={GraduationCap}
        actions={
          <>
            <Button to="/employees/signup" variant="primary" size="lg" pill className={goldSolidClass}>
              Create free account <ArrowRight size={16} />
            </Button>
            <Button to="/employees/signin" variant="secondary" size="lg" pill className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/25">
              Sign in
            </Button>
          </>
        }
      />

      <StatStrip stats={EMPLOYEE_STATS} />

      <CandidateJourneySection />

      <OurGoalSection data={EMPLOYEE_GOAL_DATA} />

      <TestimonialsSection
        eyebrow="Success Stories"
        title={
          <>
            What Our <em className="font-serif italic font-normal text-blue-950">Candidates</em> Say
          </>
        }
        items={EMPLOYEE_TESTIMONIALS}
      />

      <CTABand
        bgImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=85"
        title={
          <>
            Ready To Start Your <em className="italic text-amber-300">Placement Journey</em>?
          </>
        }
        subtitle="Free to join. Verified by our operations team before anything reaches an employer."
        photoIcon={GraduationCap}
        actions={
          <Button to="/employees/signup" variant="primary" size="lg" pill className={goldSolidClass}>
            Create free account <ArrowRight size={16} />
          </Button>
        }
      />

      <Footer />
    </div>
  )
}
