import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Briefcase, ChevronDown, ShieldCheck } from 'lucide-react'
import { JOB_SEARCH_DATA } from '../../../lib/content'
import { fetchJobSuggestions } from '../../../lib/publicJobs'
import Autocomplete from '../../ui/Autocomplete'
import ExplorerButton from '../../ui/ExplorerButton'

// Only the first 4–5 read as "useful shortcuts" — a longer row starts
// reading as a second, competing search box under the real one.
const POPULAR_SEARCH_LIMIT = 5

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
    <section id="job-search" className="bg-(--explorer-bg) pt-28 pb-14 md:pt-32 md:pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Eyebrow, headline, search, popular searches */}
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-(--explorer-teal)"
          >
            <ShieldCheck size={13} aria-hidden="true" /> {JOB_SEARCH_DATA.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-[34px] sm:text-[42px] lg:text-[46px] font-extrabold text-(--explorer-navy) leading-[1.08] tracking-tight text-balance"
          >
            {JOB_SEARCH_DATA.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3.5 text-[15.5px] text-(--explorer-muted) leading-relaxed max-w-md"
          >
            {JOB_SEARCH_DATA.subtitle}
          </motion.p>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-7 bg-white rounded-lg border border-(--explorer-border) focus-within:border-(--explorer-teal) focus-within:ring-3 focus-within:ring-(--explorer-teal)/12 transition-[border-color,box-shadow] duration-150 p-1.5 flex flex-col gap-1.5 shadow-[0_8px_24px_-12px_rgba(16,50,79,0.18)]"
          >
            <Autocomplete
              icon={<Search size={18} aria-hidden="true" />}
              label="Job title, skills or company"
              placeholder={JOB_SEARCH_DATA.titlePlaceholder}
              tags={titleTags}
              onAddTag={(item) => setTitleTags((t) => [...t, item])}
              onRemoveTag={(i) => setTitleTags((t) => t.filter((_, idx) => idx !== i))}
              fetchItems={fetchTitleSuggestions}
            />

            <div className="flex flex-col sm:flex-row gap-1.5 sm:border-t sm:border-(--explorer-border) sm:pt-1.5">
              <Autocomplete
                className="sm:border-r sm:border-(--explorer-border)"
                icon={<MapPin size={18} aria-hidden="true" />}
                label="Location"
                placeholder={JOB_SEARCH_DATA.locationPlaceholder}
                tags={locationTags}
                onAddTag={(item) => setLocationTags((t) => [...t, item])}
                onRemoveTag={(i) => setLocationTags((t) => t.filter((_, idx) => idx !== i))}
                fetchItems={fetchLocationSuggestions}
                searchActionLabel={(text) => `Add “${text}”`}
              />

              <label className="relative flex items-center gap-2 px-3.5 py-2.5 sm:w-44 shrink-0">
                <Briefcase size={17} className="text-(--explorer-muted) shrink-0" aria-hidden="true" />
                <span className="sr-only">Experience</span>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-transparent outline-none text-[14px] text-(--explorer-navy) appearance-none pr-5 cursor-pointer"
                >
                  {JOB_SEARCH_DATA.experienceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--explorer-muted) pointer-events-none" aria-hidden="true" />
              </label>

              <ExplorerButton type="submit" size="lg" className="w-full sm:w-auto sm:h-auto shrink-0">
                {JOB_SEARCH_DATA.searchCta}
              </ExplorerButton>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1.5 text-[13.5px]"
          >
            <span className="text-(--explorer-muted) font-medium">Popular:</span>
            {JOB_SEARCH_DATA.popularSearches.slice(0, POPULAR_SEARCH_LIMIT).map((term, i, arr) => (
              <span key={term} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onSearch?.({ q: term, location: '', experience: '' })}
                  className="font-semibold text-(--explorer-navy) hover:text-(--explorer-teal) underline-offset-4 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal) rounded-xs"
                >
                  {term}
                </button>
                {i < arr.length - 1 && <span className="text-(--explorer-border)" aria-hidden="true">·</span>}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
