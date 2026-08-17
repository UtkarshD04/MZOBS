import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import EmployerHero from '../components/sections/employer/EmployerHero'
import StatsTimeline from '../components/sections/home/StatsTimeline'
import EmployerWhySection from '../components/sections/employer/EmployerWhySection'
import EmployerLogosSection from '../components/sections/employer/EmployerLogosSection'
import EmployerCTABand from '../components/sections/employer/EmployerCTABand'

export default function Employer() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <title>For Employers — Mzobs</title>
      <Navbar />

      {/* 1. Hero: employer headline + CTAs */}
      <EmployerHero />

      {/* 2. Mzobs by the numbers */}
      <StatsTimeline />

      {/* 3. Why employers choose Mzobs: feature grid */}
      <EmployerWhySection />

      {/* 4. Trusted by / companies hiring on Mzobs */}
      <EmployerLogosSection />

      {/* 5. Closing CTA */}
      <EmployerCTABand />

      <Footer />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
