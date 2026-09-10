import { useRef } from 'react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import EmployerNavbar from '../components/layout/EmployerNavbar'
import EmployerFooter from '../components/layout/EmployerFooter'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import EmployerHero from '../components/sections/employer/EmployerHero'
import EmployerTrustStrip from '../components/sections/employer/EmployerTrustStrip'
import EmployerWhySection from '../components/sections/employer/EmployerWhySection'
import EmployerSegments from '../components/sections/employer/EmployerSegments'
import EmployerProcessSteps from '../components/sections/employer/EmployerProcessSteps'
import EmployerQualitySection from '../components/sections/employer/EmployerQualitySection'
import EmployerFAQ from '../components/sections/employer/EmployerFAQ'
import EmployerCTABand from '../components/sections/employer/EmployerCTABand'
import { useEmployerSmoothScroll, useEdgeBounce } from '../components/sections/employer/employerMotion'

export default function Employer() {
  useEmployerSmoothScroll()
  const pageRef = useRef(null)
  useEdgeBounce(pageRef)
  return (
    <div ref={pageRef} className="min-h-screen bg-[#F5F6F4] text-[#20251F] font-sans antialiased selection:bg-[#DDE6DF]">
      <Seo path="/employers" {...STATIC_PAGE_SEO['/employers']} />
      <EmployerNavbar />

      {/* 1. Hero */}
      <EmployerHero />

      {/* 2. Thin real-data trust strip */}
      <EmployerTrustStrip />

      {/* 3. One platform for every stage of hiring */}
      <EmployerWhySection />

      {/* 4. Hiring made simpler for your business */}
      <EmployerSegments />

      {/* 5. How MZOBS works */}
      <EmployerProcessSteps />

      {/* 6. Why employers choose MZOBS */}
      <EmployerQualitySection />

      {/* 7 & 8. Employer FAQs (doubles as recruiter resources — no blog exists) */}
      <EmployerFAQ />

      {/* 9. Closing CTA */}
      <EmployerCTABand />

      <EmployerFooter />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
