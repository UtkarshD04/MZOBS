import { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CampusRegister from '../components/campus-partner/CampusRegister'

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
        <CampusRegister />
      </main>
      <Footer />
    </div>
  )
}
