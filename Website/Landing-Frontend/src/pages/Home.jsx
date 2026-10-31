import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CLIENT_ONLY_ROUTES } from '../lib/routes'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import Footer from '../components/layout/Footer'
import SuccessStoriesSection from '../components/mz/home/SuccessStoriesSection'
import LandingNav from '../components/landing/LandingNav'
import Hero from '../components/landing/Hero'
import NextMove from '../components/landing/NextMove'
import Companies from '../components/landing/Companies'
import Audiences from '../components/landing/Audiences'
import RejectionFeedback from '../components/landing/RejectionFeedback'
import Faq from '../components/landing/Faq'
import { useLandingMotion } from '../components/landing/useLandingMotion'
import '../components/landing/landing.css'

export default function Home() {
  const rootRef = useRef(null)
  useLandingMotion(rootRef)
  const navigate = useNavigate()
  // A company logo opens the candidate job board, where the jobs are.
  const onPick = useCallback(() => navigate(CLIENT_ONLY_ROUTES.candidates), [navigate])

  return (
    // id="services" preserves the old "/#services" footer link used on other pages.
    <div id="services" ref={rootRef} className="lp min-h-screen antialiased">
      <Seo path="/" {...STATIC_PAGE_SEO['/']} />
      <LandingNav />
      <main>
        <Hero />
        <NextMove />
        <Audiences />
        <Companies onPick={onPick} />
        <RejectionFeedback />
        <Faq />
        {/* Last thing before the footer. */}
        <section style={{ background: '#f7f8fc' }}>
          <SuccessStoriesSection />
        </section>
      </main>
      <Footer signature />
    </div>
  )
}
