import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import AboutHero from '../components/sections/about/AboutHero'
import StatsTimeline from '../components/sections/home/StatsTimeline'
import AboutStorySection from '../components/sections/about/AboutStorySection'
import TeamSection from '../components/sections/home/TeamSection'
import AboutApproachSection from '../components/sections/about/AboutApproachSection'
import EmployerLogosSection from '../components/sections/employer/EmployerLogosSection'
import AboutCTABand from '../components/sections/about/AboutCTABand'

export default function About() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <title>Who We Are — Mzobs</title>
      <Navbar />

      {/* 1. Hero: who we are statement */}
      <AboutHero />

      {/* 2. Mzobs by the numbers */}
      <StatsTimeline />

      {/* 3. Our story */}
      <AboutStorySection />

      {/* 4. Meet the team behind Mzobs */}
      <TeamSection />

      {/* 5. How we work: verification steps */}
      <AboutApproachSection />

      {/* 6. Companies hiring on Mzobs */}
      <EmployerLogosSection />

      {/* 7. Closing CTA */}
      <AboutCTABand />

      <Footer />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
