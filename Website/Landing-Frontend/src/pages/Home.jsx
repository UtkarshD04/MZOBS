import { useCallback, useState } from 'react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Container } from '../components/mz/primitives'
import SearchTop from '../components/mz/home/SearchTop'
import UrgentHiringSection from '../components/mz/home/UrgentHiringSection'
import JobMarketplace from '../components/sections/home/JobMarketplace'
import CareerSidebar from '../components/mz/home/CareerSidebar'
import JobSidePanel from '../components/mz/home/JobSidePanel'
import RecommendedCard from '../components/mz/home/RecommendedCard'
import CategorySection from '../components/mz/home/CategorySection'
import CompaniesSection from '../components/mz/home/CompaniesSection'
import CampusSection from '../components/mz/home/CampusSection'
import EmployerStrip from '../components/mz/home/EmployerStrip'

// q and location are each a *list* of terms (searched as OR) — the search
// box stages several titles/skills/companies or cities as tags. Single-value
// entry points (quick links, category rows) can pass a plain string;
// normalizeFilters wraps it into a list. `company` is [{ id, name }] from the
// "Companies hiring now" list.
const EMPTY_FILTERS = { q: [], location: [], experience: '', track: '', company: [] }

const toTermList = (value) => (Array.isArray(value) ? value : value ? [value] : [])

function normalizeFilters(next) {
  return { ...EMPTY_FILTERS, ...next, q: toTermList(next.q), location: toTermList(next.location) }
}

export default function Home() {
  // The one search the whole page shares: every entry point sets it, and
  // JobMarketplace applies it to its own filters.
  const [jobFilters, setJobFilters] = useState(EMPTY_FILTERS)
  // Desktop: the job whose description is open beside the feed (null shows
  // the career sidebar there instead), plus the feed's current list for
  // "Next opportunity".
  const [openJob, setOpenJob] = useState(null)
  const [feedJobs, setFeedJobs] = useState([])
  const closeJob = useCallback(() => setOpenJob(null), [])
  const openIndex = openJob ? feedJobs.findIndex((j) => j.id === openJob.id) : -1
  const nextJob = openIndex >= 0 ? (feedJobs[openIndex + 1] ?? null) : null

  // Replaces (not merges) the search, jumps to the job feed, and records the
  // #latest-jobs hash (JobDetail's "Back to jobs" links and old bookmarks
  // point at it).
  function applyJobFilters(next) {
    setJobFilters(normalizeFilters(next))
    setOpenJob(null)
    if (typeof window !== 'undefined') window.history.replaceState(null, '', '#latest-jobs')
    document.getElementById('latest-jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    // id="services" preserves the old "/#services" footer link used on other pages.
    <div id="services" className="mz-home min-h-screen bg-mz-bg font-sans text-mz-ink antialiased">
      <Seo path="/" {...STATIC_PAGE_SEO['/']} />
      <a href="#latest-jobs" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-mz-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to jobs
      </a>
      <Navbar />
      <main>
        <SearchTop filters={jobFilters} onSearch={applyJobFilters} />

        {/* Job feed first, career actions alongside — or, on desktop, the
            opened job's full description in their place. On phones the career
            tools come after the feed. */}
        <div className="py-8 lg:py-10">
          <Container
            className={`grid grid-cols-1 gap-6 lg:gap-8 ${openJob ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]' : 'lg:grid-cols-[minmax(0,1fr)_320px]'}`}
          >
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <JobMarketplace external={jobFilters} selectedId={openJob?.id} onOpenJob={setOpenJob} onJobsChange={setFeedJobs} />
            </div>
            <div className="min-w-0 lg:col-start-2 lg:row-start-1">
              {openJob && (
                <div className="hidden h-full lg:block">
                  <JobSidePanel job={openJob} nextJob={nextJob} onNext={() => nextJob && setOpenJob(nextJob)} onClose={closeJob} />
                </div>
              )}
              <div className={openJob ? 'lg:hidden' : ''}>
                <CareerSidebar />
              </div>
            </div>
          </Container>
        </div>

        <UrgentHiringSection />

        <CategorySection onSelect={applyJobFilters} />
        <CompaniesSection onSelect={applyJobFilters} />
        <CampusSection />
        <EmployerStrip />
        <RecommendedCard />
      </main>
      <Footer />
    </div>
  )
}
