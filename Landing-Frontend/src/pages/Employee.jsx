import { ArrowRight, GraduationCap } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHero from '../components/sections/PageHero'
import StatStrip from '../components/sections/StatStrip'
import CandidateJourneySection from '../components/sections/CandidateJourneySection'
import ExpertiseGrid from '../components/sections/ExpertiseGrid'
import OurGoalSection from '../components/sections/OurGoalSection'
import ApproachSection from '../components/sections/ApproachSection'
import LogoCloud from '../components/sections/LogoCloud'
import CTABand from '../components/sections/CTABand'
import Button, { goldSolidClass } from '../components/ui/Button'
import { EMPLOYEE_LOGIN_URL, EMPLOYEE_REGISTER_URL } from '../lib/config'
import { EMPLOYEE_FEATURES, EMPLOYEE_STATS, TRUSTED_LOGOS } from '../lib/content'

export default function Employee() {
  return (
    <div className="min-h-screen bg-bg">
      <title>For Employees — Mzobs</title>
      <Navbar />

      <PageHero
        kicker="For Job Seekers"
        bgImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=85"
        title={
          <>
            Find A Role You&rsquo;re <em className="italic text-amber-400">Actually</em> Qualified For.
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

      <CandidateJourneySection />

      <ExpertiseGrid
        eyebrow="Why Job Seekers Choose Mzobs"
        title={
          <>
            Everything You Need To <em className="italic text-[#0B1220]">Get Placed</em>
          </>
        }
        subtitle="One platform, from your first resume draft to your signed offer."
        items={EMPLOYEE_FEATURES}
        photoIcon={GraduationCap}
        ctaLabel="Create free account"
        ctaHref={EMPLOYEE_REGISTER_URL}
        featuredCard={{
          titlePrefix: "Get Matched & ",
          titleItalic: "Get Hired",
          ctaText: "Create Free Account",
          ctaHref: EMPLOYEE_REGISTER_URL,
          bgImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85"
        }}
      />

      <OurGoalSection />

      <ApproachSection />

      <LogoCloud eyebrow="Recently Placed At" title="Our Candidates Work At" logos={TRUSTED_LOGOS} />

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
          <Button href={EMPLOYEE_REGISTER_URL} variant="primary" size="lg" pill className={goldSolidClass}>
            Create free account <ArrowRight size={16} />
          </Button>
        }
      />

      <Footer />
    </div>
  )
}
