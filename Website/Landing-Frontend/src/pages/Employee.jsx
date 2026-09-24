import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import EmployeeHero from '../components/sections/employee/EmployeeHero'
import StatsTimeline from '../components/sections/home/StatsTimeline'
import CandidateJourneySection from '../components/sections/CandidateJourneySection'
import EmployeeWhySection from '../components/sections/employee/EmployeeWhySection'
import EmployeePricingSection from '../components/sections/employee/EmployeePricingSection'
import EmployeeCTABand from '../components/sections/employee/EmployeeCTABand'

export default function Employee() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <Seo path="/employees" {...STATIC_PAGE_SEO['/employees']} />
      <Navbar />

      {/* 1. Hero: job-seeker headline + CTAs */}
      <EmployeeHero />

      {/* 2. Mzobs by the numbers */}
      <StatsTimeline />

      {/* 3. From Profile To Opportunity — untouched, kept as-is */}
      <CandidateJourneySection />

      {/* 4. Why Mzobs: mission + feature grid */}
      <EmployeeWhySection />

      {/* 4.5. ₹99 one-time premium access */}
      <EmployeePricingSection />

      {/* 5. Candidate testimonials */}
      {/* <TestimonialsCarousel items={EMPLOYEE_TESTIMONIALS} badge="Success Stories" /> */}

      {/* 6. Closing CTA */}
      <EmployeeCTABand />

      <Footer />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
