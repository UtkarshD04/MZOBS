import { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AssociateHero from '../components/associate/AssociateHero'
import NetworkStats from '../components/associate/NetworkStats'
import WhyAssociate from '../components/associate/WhyAssociate'
import HowItWorks from '../components/associate/HowItWorks'
import CityNetwork from '../components/associate/CityNetwork'
import PartnerFit from '../components/associate/PartnerFit'
import MzobsEcosystem from '../components/associate/MzobsEcosystem'
import TrustSection from '../components/associate/TrustSection'
import OfficialApplication from '../components/associate/OfficialApplication'
import AssociateCTA from '../components/associate/AssociateCTA'
import '../components/associate/associate.css'

export default function Associate() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Become an Associate — Mzobs'
    return () => { document.title = prev }
  }, [])

  return (
    <div className="mz-home min-h-screen bg-white font-sans text-mz-ink antialiased">
      <Navbar />
      <main>
        <AssociateHero />
        <NetworkStats />
        <WhyAssociate />
        <HowItWorks />
        <CityNetwork />
        <PartnerFit />
        <MzobsEcosystem />
        <TrustSection />
        <OfficialApplication />
        <AssociateCTA />
      </main>
      <Footer />
    </div>
  )
}
