import { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CampusHero from '../components/campus-partner/CampusHero'
import WhyCampuses from '../components/campus-partner/WhyCampuses'
import CampusJourneySteps from '../components/campus-partner/CampusJourneySteps'
import CampusBento from '../components/campus-partner/CampusBento'
import CampusFlowVisual from '../components/campus-partner/CampusFlowVisual'
import CampusForm from '../components/campus-partner/CampusForm'
import CampusNetworkCTA from '../components/campus-partner/CampusNetworkCTA'
import CampusFinalCTA from '../components/campus-partner/CampusFinalCTA'

export default function CampusPartner() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Add Your Campus — Mzobs'
    return () => { document.title = prev }
  }, [])

  return (
    <div className="mz-home min-h-screen bg-mz-bg font-sans text-mz-ink antialiased">
      <Navbar />
      <main>
        <CampusHero />
        <WhyCampuses />
        <CampusJourneySteps />
        <CampusBento />
        <CampusFlowVisual />
        <CampusForm />
        <CampusNetworkCTA />
        <CampusFinalCTA />
      </main>
      <Footer />
    </div>
  )
}
