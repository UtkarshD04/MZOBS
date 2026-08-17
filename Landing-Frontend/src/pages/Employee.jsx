import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import EmployeeHero from '../components/sections/employee/EmployeeHero'
import StatsTimeline from '../components/sections/home/StatsTimeline'
import CandidateJourneySection from '../components/sections/CandidateJourneySection'
import EmployeeWhySection from '../components/sections/employee/EmployeeWhySection'
import TestimonialsCarousel from '../components/sections/home/TestimonialsCarousel'
import EmployeeCTABand from '../components/sections/employee/EmployeeCTABand'
import { EMPLOYEE_TESTIMONIALS } from '../lib/content'

export default function Employee() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <title>For Employees — Mzobs</title>
      <Navbar />

      {/* 1. Hero: job-seeker headline + CTAs */}
      <EmployeeHero />

      {/* 2. Mzobs by the numbers */}
      <StatsTimeline />

      {/* 3. From Profile To Opportunity — untouched, kept as-is */}
      <CandidateJourneySection />

      {/* 4. Why Mzobs: mission + feature grid */}
      <EmployeeWhySection />

      {/* 5. Candidate testimonials */}
      <TestimonialsCarousel items={EMPLOYEE_TESTIMONIALS} badge="Success Stories" />

      {/* 6. Closing CTA */}
      <EmployeeCTABand />

      <Footer />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
