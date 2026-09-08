import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Briefcase, ChevronDown } from 'lucide-react'
import { JOB_SEARCH_DATA } from '../../../lib/content'
import { fetchJobSuggestions } from '../../../lib/publicJobs'
import Autocomplete from '../../ui/Autocomplete'

function toTags(values) {
  return (values ?? []).map((value) => ({ value, kind: undefined }))
}

// `filters` is Home.jsx's lifted, single-source-of-truth filter state — the
// tag boxes below stay synced to it (not just one-way local state) so that
// clearing filters elsewhere (the "Clear search"/"Clear filters" chip down
// in Latest jobs) or picking a quick-discovery pill is reflected up here
// too, instead of leaving stale tags sitting in the box.
//
// Filling in job titles/skills/companies and locations here only *stages*
// them as removable tags — nothing is searched until "Find jobs" is
// clicked (or Enter is pressed with no suggestion highlighted), matching
// how a multi-select search box is expected to behave. `onSearch` filters
// the Latest jobs section further down this same page instead of sending
// the visitor off to the dashboard app.
export default function JobSearchHero({ filters, onSearch }) {
  const [titleTags, setTitleTags] = useState(toTags(filters?.q))
  const [locationTags, setLocationTags] = useState(toTags(filters?.location))
  const [experience, setExperience] = useState(filters?.experience ?? '')

  useEffect(() => {
    setTitleTags(toTags(filters?.q))
    setLocationTags(toTags(filters?.location))
    setExperience(filters?.experience ?? '')
  }, [filters])

  // Stable across renders so Autocomplete's effects/callbacks don't see a
  // "new" function on every keystroke — only the typed query matters here.
  const fetchTitleSuggestions = useCallback(
    (query, { signal }) => fetchJobSuggestions({ q: query, type: 'all', limit: 15 }, { signal }),
    []
  )
  const fetchLocationSuggestions = useCallback(
    (query, { signal }) => fetchJobSuggestions({ q: query, type: 'location', limit: 15 }, { signal }),
    []
  )

  function handleSearch(e) {
    e.preventDefault()
    onSearch?.({ q: titleTags.map((t) => t.value), location: locationTags.map((t) => t.value), experience })
  }

  return (
    <section id="job-search" className="bg-linear-to-br from-(--jobs-blue-tint) to-(--jobs-teal-tint) pt-28 pb-10 md:pt-28 md:pb-12">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* Visually hidden — keeps a real page heading for accessibility/SEO
            without showing a marketing-style hero above the search bar. */}
        <h1 className="sr-only">
          {JOB_SEARCH_DATA.headlineLead} {JOB_SEARCH_DATA.headlineAccent} — {JOB_SEARCH_DATA.subtitle}
        </h1>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white rounded-lg ring-1 ring-(--jobs-navy)/6 focus-within:ring-2 focus-within:ring-(--jobs-blue)/40 transition-shadow duration-150 p-1.5 flex flex-col md:flex-row items-stretch gap-1.5 shadow-lg shadow-(--jobs-navy)/10"
        >
          <Autocomplete
            className="md:border-r md:border-(--jobs-border)"
            icon={<Search size={18} aria-hidden="true" />}
            label="Job title, skills or company"
            placeholder={JOB_SEARCH_DATA.titlePlaceholder}
            tags={titleTags}
            onAddTag={(item) => setTitleTags((t) => [...t, item])}
            onRemoveTag={(i) => setTitleTags((t) => t.filter((_, idx) => idx !== i))}
            fetchItems={fetchTitleSuggestions}
          />

          <Autocomplete
            className="md:border-r md:border-(--jobs-border)"
            icon={<MapPin size={18} aria-hidden="true" />}
            label="Location"
            placeholder={JOB_SEARCH_DATA.locationPlaceholder}
            tags={locationTags}
            onAddTag={(item) => setLocationTags((t) => [...t, item])}
            onRemoveTag={(i) => setLocationTags((t) => t.filter((_, idx) => idx !== i))}
            fetchItems={fetchLocationSuggestions}
            searchActionLabel={(text) => `Add “${text}”`}
          />

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
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1.5 text-[13.5px]"
        >
          <span className="text-(--jobs-ink-soft) font-medium">Popular searches:</span>
          {JOB_SEARCH_DATA.popularSearches.map((term, i) => (
            <span key={term} className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSearch?.({ q: term, location: '', experience: '' })}
                className="font-semibold text-(--jobs-navy) hover:text-(--jobs-blue) underline-offset-4 hover:underline transition-colors"
              >
                {term}
              </button>
              {i < JOB_SEARCH_DATA.popularSearches.length - 1 && (
                <span className="text-(--jobs-border)" aria-hidden="true">·</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
