import { useCallback, useRef, useState } from 'react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import Footer from '../components/layout/Footer'
import SuccessStoriesSection from '../components/mz/home/SuccessStoriesSection'
import LandingNav from '../components/landing/LandingNav'
import Hero from '../components/landing/Hero'
import LatestJobs from '../components/landing/LatestJobs'
import NextMove from '../components/landing/NextMove'
import Difference from '../components/landing/Difference'
import Categories from '../components/landing/Categories'
import Cities from '../components/landing/Cities'
import Campus from '../components/landing/Campus'
import Companies from '../components/landing/Companies'
import Employers from '../components/landing/Employers'
import { useDefaultJobs } from '../components/landing/shared'
import { useLandingMotion } from '../components/landing/useLandingMotion'
import '../components/landing/landing.css'

export default function Home() {
  const rootRef = useRef(null)
  useLandingMotion(rootRef)
  const { jobs, total } = useDefaultJobs(6)
  // A search chosen from a category tile or company logo: handed to the job
  // list, then the page scrolls to it. A fresh object each time so picking the
  // same tile again (after clearing it) still applies.
  const [pick, setPick] = useState(null)
  const onPick = useCallback((next) => {
    setPick({ ...next })
    if (typeof window !== 'undefined') window.history.replaceState(null, '', '#latest-jobs')
    document.getElementById('latest-jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    // id="services" preserves the old "/#services" footer link used on other pages.
    <div id="services" ref={rootRef} className="lp min-h-screen antialiased">
      <Seo path="/" {...STATIC_PAGE_SEO['/']} />
      <a href="#latest-jobs" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-white">
        Skip to jobs
      </a>
      <LandingNav />
      <main>
        <Hero />
        <LatestJobs initialJobs={jobs} initialTotal={total} pick={pick} />
        <NextMove />
        <Difference />
        <Categories onPick={onPick} />
        <Cities />
        <Campus />
        <Companies onPick={onPick} />
        <section style={{ background: '#f7f8fc' }}>
          <SuccessStoriesSection />
        </section>
        <Employers />
      </main>
      <Footer signature />
    </div>
  )
}
