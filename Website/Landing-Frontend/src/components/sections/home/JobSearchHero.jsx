import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Briefcase, ChevronDown } from 'lucide-react'
import { JOB_SEARCH_DATA } from '../../../lib/content'
import { buildJobsUrl } from '../../../lib/jobsUrl'

export default function JobSearchHero() {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    window.location.href = buildJobsUrl({ q: title, location, experience })
  }

  return (
    <section id="job-search" className="bg-linear-to-br from-(--jobs-blue-tint) to-(--jobs-teal-tint) pt-28 pb-10 md:pt-28 md:pb-12">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* Visually hidden — keeps a real page heading for accessibility/SEO
            without showing a marketing-style hero above the search bar. */}
        <h1 className="sr-only">
          {JOB_SEARCH_DATA.headlineLead} {JOB_SEARCH_DATA.headlineAccent} — {JOB_SEARCH_DATA.subtitle}
        </h1>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-lg ring-1 ring-(--jobs-navy)/6 focus-within:ring-2 focus-within:ring-(--jobs-blue)/40 transition-shadow duration-150 p-1.5 flex flex-col md:flex-row items-stretch gap-1.5 shadow-lg shadow-(--jobs-navy)/10"
        >
          <label className="flex-1 flex items-center gap-2.5 px-4 py-3 md:border-r md:border-(--jobs-border)">
            <Search size={18} className="text-(--jobs-ink-soft) shrink-0" aria-hidden="true" />
            <span className="sr-only">Job title, skills or company</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={JOB_SEARCH_DATA.titlePlaceholder}
              className="w-full bg-transparent outline-none text-[14.5px] text-(--jobs-navy) placeholder:text-(--jobs-ink-soft)"
            />
          </label>

          <label className="flex-1 flex items-center gap-2.5 px-4 py-3 md:border-r md:border-(--jobs-border)">
            <MapPin size={18} className="text-(--jobs-ink-soft) shrink-0" aria-hidden="true" />
            <span className="sr-only">Location</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={JOB_SEARCH_DATA.locationPlaceholder}
              className="w-full bg-transparent outline-none text-[14.5px] text-(--jobs-navy) placeholder:text-(--jobs-ink-soft)"
            />
          </label>

          <label className="relative flex items-center gap-2.5 px-4 py-3 md:w-52 shrink-0">
            <Briefcase size={18} className="text-(--jobs-ink-soft) shrink-0" aria-hidden="true" />
            <span className="sr-only">Experience</span>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-transparent outline-none text-[14.5px] text-(--jobs-navy) appearance-none pr-6 cursor-pointer"
            >
              {JOB_SEARCH_DATA.experienceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-(--jobs-ink-soft) pointer-events-none" aria-hidden="true" />
          </label>

          <motion.button
            type="submit"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className="shrink-0 w-full md:w-auto h-12 md:h-auto px-7 rounded-md bg-(--jobs-blue) text-white text-[14.5px] font-bold hover:bg-(--jobs-blue-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--jobs-blue) transition-colors"
          >
            {JOB_SEARCH_DATA.searchCta}
          </motion.button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1.5 text-[13.5px]">
          <span className="text-(--jobs-ink-soft) font-medium">Popular searches:</span>
          {JOB_SEARCH_DATA.popularSearches.map((term, i) => (
            <span key={term} className="flex items-center gap-1.5">
              <a
                href={buildJobsUrl({ q: term })}
                className="font-semibold text-(--jobs-navy) hover:text-(--jobs-blue) underline-offset-4 hover:underline"
              >
                {term}
              </a>
              {i < JOB_SEARCH_DATA.popularSearches.length - 1 && (
                <span className="text-(--jobs-border)" aria-hidden="true">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
