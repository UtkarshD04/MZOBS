import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import EmployerNavbar from '../components/layout/EmployerNavbar'
import EmployerFooter from '../components/layout/EmployerFooter'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import EmployerHero from '../components/sections/employer/EmployerHero'
import EmployerProcessSteps from '../components/sections/employer/EmployerProcessSteps'
import EmployerSourcingSection from '../components/sections/employer/EmployerSourcingSection'
import EmployerPipelineSection from '../components/sections/employer/EmployerPipelineSection'
import EmployerSegments from '../components/sections/employer/EmployerSegments'
import EmployerTrustPrivacySection from '../components/sections/employer/EmployerTrustPrivacySection'
import EmployerPricingTeaser from '../components/sections/employer/EmployerPricingTeaser'
import EmployerFAQ from '../components/sections/employer/EmployerFAQ'
import EmployerCTABand from '../components/sections/employer/EmployerCTABand'
import { useEmployerSmoothScroll } from '../lib/employerMotionHooks'

export default function Employer() {
  useEmployerSmoothScroll()
  return (
    <div className="min-h-screen bg-(--explorer-bg) text-(--explorer-navy) font-sans antialiased selection:bg-(--explorer-blue-surface)">
      <Seo path="/employers" {...STATIC_PAGE_SEO['/employers']} />
      <EmployerNavbar overHero />

      <main id="main">
        {/* Hero — who it's for, primary actions, dashboard preview, client logos */}
        <EmployerHero />

        {/* 01 How an employer starts: account → plan → first job */}
        <EmployerProcessSteps />

        {/* 02 Job posting (inbound) + candidate search (outbound, #discover-talent) */}
        <EmployerSourcingSection />

        {/* 03 How applications move: New → Shortlisted → Interview → Offered → Hired */}
        <EmployerPipelineSection />

        {/* 04 Audience tabs */}
        <EmployerSegments />

        {/* 05 Trust & privacy — only checks the Backend actually enforces */}
        <EmployerTrustPrivacySection />

        {/* 06 Pricing */}
        <EmployerPricingTeaser />

        {/* 07 FAQs */}
        <EmployerFAQ />

        {/* Closing CTA */}
        <EmployerCTABand />
      </main>

      <EmployerFooter />

      <FloatingQuickNav />
    </div>
  )
}
