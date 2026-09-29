import { useRef } from 'react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import EmployerNavbar from '../components/layout/EmployerNavbar'
import EmployerFooter from '../components/layout/EmployerFooter'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import EmployerHero from '../components/sections/employer/EmployerHero'
import EmployerLogosSection from '../components/sections/employer/EmployerLogosSection'
import EmployerWhySection from '../components/sections/employer/EmployerWhySection'
import EmployerResdexSection from '../components/sections/employer/EmployerResdexSection'
import EmployerJobPostingPreview from '../components/sections/employer/EmployerJobPostingPreview'
import EmployerProcessSteps from '../components/sections/employer/EmployerProcessSteps'
import EmployerQualitySection from '../components/sections/employer/EmployerQualitySection'
import EmployerSegments from '../components/sections/employer/EmployerSegments'
import EmployerEcosystemSection from '../components/sections/employer/EmployerEcosystemSection'
import EmployerPricingTeaser from '../components/sections/employer/EmployerPricingTeaser'
import EmployerFAQ from '../components/sections/employer/EmployerFAQ'
import EmployerCTABand from '../components/sections/employer/EmployerCTABand'
import { useEmployerSmoothScroll, useEdgeBounce } from '../lib/employerMotionHooks'

export default function Employer() {
  useEmployerSmoothScroll()
  const pageRef = useRef(null)
  useEdgeBounce(pageRef)
  return (
    <div ref={pageRef} className="min-h-screen bg-(--explorer-bg) text-(--explorer-navy) font-sans antialiased selection:bg-(--explorer-blue-surface)">
      <Seo path="/employers" {...STATIC_PAGE_SEO['/employers']} />
      <EmployerNavbar />

      {/* 1. Hero — brand-led, no fake dashboard/candidate data */}
      <EmployerHero />

      {/* 3. Companies already hiring on Mzobs (real logos) */}
      <EmployerLogosSection />

      {/* 4. Everything You Need to Hire */}
      <EmployerWhySection />

      {/* 5. Find Talent Beyond the Applications */}
      <EmployerResdexSection />

      {/* 6. Turn Your Requirement Into an Opportunity */}
      <EmployerJobPostingPreview />

      {/* 7. Simple hiring workflow: Post -> Discover -> Shortlist -> Interview -> Hire */}
      <EmployerProcessSteps />

      {/* 8. Made for the way teams hire today */}
      <EmployerQualitySection />

      {/* 9. Built for growing teams */}
      <EmployerSegments />

      {/* 10. One platform, two sides of hiring */}
      <EmployerEcosystemSection />

      {/* 11. Pricing */}
      <EmployerPricingTeaser />

      {/* 12. Employer FAQs (doubles as recruiter resources — no blog exists) */}
      <EmployerFAQ />

      {/* 13. Closing CTA */}
      <EmployerCTABand />

      <EmployerFooter />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
