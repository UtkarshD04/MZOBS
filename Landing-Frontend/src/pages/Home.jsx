import Navbar from '../components/layout/Navbar'
import PageHero from '../components/sections/PageHero'
import WhoWeAre from '../components/sections/WhoWeAre'
import CandidateJourneySection from '../components/sections/CandidateJourneySection'
import ExpertiseGrid from '../components/sections/ExpertiseGrid'
import OurGoalSection from '../components/sections/OurGoalSection'
import ApproachSection from '../components/sections/ApproachSection'
import LogoCloud from '../components/sections/LogoCloud'
import CTABand from '../components/sections/CTABand'
import Footer from '../components/layout/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EEF3F8] text-[#0B1220] font-sans antialiased selection:bg-blue-200">
      <title>Mzobs — Hiring, Built Right From Both Sides</title>
      
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <PageHero />

      {/* 3. Who We Are / Statement & Stats */}
      <WhoWeAre />

      {/* 4. Candidate Journey Artwork Section */}
      <CandidateJourneySection />

      {/* 5. Our Expertise / Services */}
      <ExpertiseGrid />

      {/* 6. Our Goal / Transforming Strategy into Results */}
      <OurGoalSection />

      {/* 8. Our Approach / 4 Steps */}
      <ApproachSection />

      {/* 9. We Work With / Logo Cloud */}
      <LogoCloud />

      {/* 10. CTA Band */}
      <CTABand />

      {/* 11. Footer */}
      <Footer />
    </div>
  )
}
