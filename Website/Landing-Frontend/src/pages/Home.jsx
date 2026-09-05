import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import JobSearchHero from '../components/sections/home/JobSearchHero'
import QuickDiscoveryStrip from '../components/sections/home/QuickDiscoveryStrip'
import LatestJobs from '../components/sections/home/LatestJobs'
import CategoryGrid from '../components/sections/home/CategoryGrid'
import CompaniesHiring from '../components/sections/home/CompaniesHiring'
import HowItWorksSteps from '../components/sections/home/HowItWorksSteps'
import CareerSupportSection from '../components/sections/home/CareerSupportSection'
import HomeEmployerCTA from '../components/sections/home/HomeEmployerCTA'

export default function Home() {
  return (
    // id="services" preserves the shared Footer's "/#services" link
    // (Footer.jsx / FOOTER_DATA, rendered on every page) now that this
    // redesign has no dedicated services section of its own — it just
    // scrolls back to the top of the job-discovery home page instead
    // of landing on a missing anchor.
    <div id="services" className="min-h-screen bg-white text-(--jobs-navy) font-sans antialiased selection:bg-(--jobs-teal-tint)">
      <title>Mzobs — Find Verified Jobs & Hire Job-Ready Talent</title>

      {/* 1. Sticky job-discovery navigation (sitewide header) */}
      <Navbar />

      {/* 2. Hero: headline + job search bar + popular searches */}
      <JobSearchHero />

      {/* 3. Quick job-discovery strip: freshers, remote, top metros */}
      <QuickDiscoveryStrip />

      {/* 4. Latest opportunities — first content section after the hero */}
      <LatestJobs />

      {/* 5. Explore jobs by category */}
      <CategoryGrid />

      {/* 6. Companies hiring through MZOBS (single, consolidated company section) */}
      <CompaniesHiring />

      {/* 7. How it works: search, chat, get hired */}
      <HowItWorksSteps />

      {/* 8. MZOBS career support: resume, interview prep, matching, employer access */}
      <CareerSupportSection />

      {/* 9. Employer CTA band */}
      <HomeEmployerCTA />

      <Footer />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
