import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import CareersHero from '../components/sections/home/CareersHero'
import SpotlightGrid from '../components/sections/home/SpotlightGrid'
import HowWeHireSection from '../components/sections/home/HowWeHireSection'
import CategoryGrid from '../components/sections/home/CategoryGrid'
import TeamSection from '../components/sections/home/TeamSection'
import SuccessStoriesCarousel from '../components/sections/home/SuccessStoriesCarousel'
import TestimonialsCarousel from '../components/sections/home/TestimonialsCarousel'
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

      {/* 6. Meet the team behind Mzobs */}
      <TeamSection />

      {/* 7. Success stories carousel */}
      <SuccessStoriesCarousel />

      {/* 8. Testimonials carousel */}
      <TestimonialsCarousel />

      {/* 9. Mzobs by the numbers */}
      <StatsTimeline />

      {/* 10. Footer */}
      <Footer />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
