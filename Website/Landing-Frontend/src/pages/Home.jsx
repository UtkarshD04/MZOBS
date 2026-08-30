import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import CareersHero from '../components/sections/home/CareersHero'
import SpotlightGrid from '../components/sections/home/SpotlightGrid'
import HowWeHireSection from '../components/sections/home/HowWeHireSection'
import CategoryGrid from '../components/sections/home/CategoryGrid'
import EmployerLogosSection from '../components/sections/employer/EmployerLogosSection'
import CompanyWorkflowSection from '../components/sections/home/CompanyWorkflowSection'
import FAQSection from '../components/sections/home/FAQSection'
import StatsTimeline from '../components/sections/home/StatsTimeline'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <title>Mzobs — Hiring, Built Right From Both Sides</title>

      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero: rotating headline + job search + banner image */}
      <CareersHero />

      {/* 3. Spotlight: what Mzobs offers, pastel cards */}
      <SpotlightGrid />

      {/* 4. How We Hire: mission narrative + 4-step process */}
      <HowWeHireSection />

      {/* 5. Find Your Team: browse jobs by category */}
      <CategoryGrid />

      {/* 6. Companies hiring on Mzobs */}
      <EmployerLogosSection showBadge={false} />

      {/* 7. How companies hire: colorful workflow steps */}
      <CompanyWorkflowSection />

      
     

      {/* 9. Mzobs by the numbers */}

      <StatsTimeline />

      {/* 8. Frequently asked questions */}
 <FAQSection />
      {/* 10. Footer */}
      <Footer />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
