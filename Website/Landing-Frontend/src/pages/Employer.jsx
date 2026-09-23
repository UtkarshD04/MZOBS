import { useRef } from 'react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import EmployerNavbar from '../components/layout/EmployerNavbar'
import EmployerFooter from '../components/layout/EmployerFooter'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import EmployerHero from '../components/sections/employer/EmployerHero'
import EmployerTrustStrip from '../components/sections/employer/EmployerTrustStrip'
import EmployerLogosSection from '../components/sections/employer/EmployerLogosSection'
import EmployerWhySection from '../components/sections/employer/EmployerWhySection'
import EmployerResdexSection from '../components/sections/employer/EmployerResdexSection'
import EmployerSegments from '../components/sections/employer/EmployerSegments'
import EmployerTalentLensSection from '../components/sections/employer/EmployerTalentLensSection'
import EmployerMatchIntelligenceSection from '../components/sections/employer/EmployerMatchIntelligenceSection'
import EmployerTrustSignalsSection from '../components/sections/employer/EmployerTrustSignalsSection'
import EmployerTalentRadarSection from '../components/sections/employer/EmployerTalentRadarSection'
import EmployerCopilotSection from '../components/sections/employer/EmployerCopilotSection'
import EmployerProcessSteps from '../components/sections/employer/EmployerProcessSteps'
import EmployerTalentPoolsSection from '../components/sections/employer/EmployerTalentPoolsSection'
import EmployerQualitySection from '../components/sections/employer/EmployerQualitySection'
import EmployerTestimonialSection from '../components/sections/employer/EmployerTestimonialSection'
import EmployerFAQ from '../components/sections/employer/EmployerFAQ'
import EmployerCTABand from '../components/sections/employer/EmployerCTABand'
import { useEmployerSmoothScroll, useEdgeBounce } from '../components/sections/employer/employerMotion'

export default function Employer() {
  useEmployerSmoothScroll()
  const pageRef = useRef(null)
  useEdgeBounce(pageRef)
  return (
    <div ref={pageRef} className="min-h-screen bg-white text-[#102a43] font-sans antialiased selection:bg-blue-200">
      <Seo path="/employers" {...STATIC_PAGE_SEO['/employers']} />
      <EmployerNavbar />

      {/* 1. Hero */}
      <EmployerHero />

      {/* 2. Thin real-data trust strip */}
      <EmployerTrustStrip />

      {/* 2.5. Companies already hiring on Mzobs */}
      <EmployerLogosSection />

      {/* 3. One platform for every stage of hiring */}
      <EmployerWhySection />

      {/* 3.5. Resume database search (Resdex-style proactive sourcing) */}
      <EmployerResdexSection />

      {/* 4. Hiring made simpler for your business */}
      <EmployerSegments />

      {/* 5. Talent Lens — describe who you need, see a focused search */}
      <EmployerTalentLensSection />

      {/* 6. Match Intelligence — why a recommendation appears */}
      <EmployerMatchIntelligenceSection />

      {/* 7. Trust Signals — verification, kept separate from Match Score */}
      <EmployerTrustSignalsSection />

      {/* 8. Talent Radar — proactive discovery for roles you may open next */}
      <EmployerTalentRadarSection />

      {/* 9. Mzobs Copilot — a contextual assistant over your own results */}
      <EmployerCopilotSection />

      {/* 10. How MZOBS works — the full requirement-to-hire journey */}
      <EmployerProcessSteps />

      {/* 11. Talent Pools — keep promising people close */}
      <EmployerTalentPoolsSection />

      {/* 12. Why employers choose MZOBS */}
      <EmployerQualitySection />

      {/* 13. Social proof */}
      <EmployerTestimonialSection />

      {/* 14. Employer FAQs (doubles as recruiter resources — no blog exists) */}
      <EmployerFAQ />

      {/* 15. Closing CTA */}
      <EmployerCTABand />

      <EmployerFooter />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
