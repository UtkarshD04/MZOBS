import { useRef } from 'react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import EmployerNavbar from '../components/layout/EmployerNavbar'
import EmployerFooter from '../components/layout/EmployerFooter'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import EmployerHero from '../components/sections/employer/EmployerHero'
import EmployerWhySection from '../components/sections/employer/EmployerWhySection'
import EmployerResdexSection from '../components/sections/employer/EmployerResdexSection'
import EmployerJobPostingPreview from '../components/sections/employer/EmployerJobPostingPreview'
import EmployerProcessSteps from '../components/sections/employer/EmployerProcessSteps'
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

      {/* 1. Hero — workflow visual + real company logos, no fake candidate data */}
      <EmployerHero />

      {/* 2. Everything You Need to Hire */}
      <EmployerWhySection />

      {/* 3. Find Talent Beyond the Applications */}
      <EmployerResdexSection />

      {/* 4. Turn Your Requirement Into an Opportunity */}
      <EmployerJobPostingPreview />

      {/* 5. Simple hiring workflow: Post -> Discover -> Shortlist -> Interview -> Hire */}
      <EmployerProcessSteps />

      {/* 6. Built for growing teams */}
      <EmployerSegments />

      {/* 7. One platform, two sides of hiring */}
      <EmployerEcosystemSection />

      {/* 8. Pricing */}
      <EmployerPricingTeaser />

      {/* 9. Employer FAQs (doubles as recruiter resources — no blog exists) */}
      <EmployerFAQ />

      {/* 10. Closing CTA */}
      <EmployerCTABand />

      <EmployerFooter />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
