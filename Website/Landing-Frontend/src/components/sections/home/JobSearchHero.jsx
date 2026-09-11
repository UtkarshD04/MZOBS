import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Briefcase, ChevronDown, ShieldCheck, ArrowRight } from 'lucide-react'
import { JOB_SEARCH_DATA } from '../../../lib/content'
import { fetchJobSuggestions } from '../../../lib/publicJobs'
import Autocomplete from '../../ui/Autocomplete'
import HeroBubbleField from '../../decor/HeroBubbleField'

// Only the first 4–5 read as "useful shortcuts" — a longer row starts
// reading as a second, competing search box under the real one.
const POPULAR_SEARCH_LIMIT = 5

function toTags(values) {
  return (values ?? []).map((value) => ({ value, kind: undefined }))
}

// Restored, centered composition (see the restore brief's reference
// screenshot): headline/toggle/search bar centered on the page, bracketed
// by the six large "alive" bubbles in HeroBubbleField.jsx. The
// job-seeker/employer toggle switches the search bar's own fields, not the
// page below it — Latest jobs, categories etc. all stay candidate-facing,
// so "I'm hiring talent" just routes its submit to the employer signup
// flow instead of filtering this page's own job list.
const HeroCtaClasses =
  'group relative inline-flex items-center justify-center gap-1.5 rounded-full px-6 h-11 text-[13.5px] font-bold text-white whitespace-nowrap shadow-[0_10px_24px_-8px_rgba(59,109,240,0.55)] ' +
  'transition-transform duration-200 motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)'

function HeroCtaButton({ children, className = '', ...props }) {
  return (
    <button type="submit" className={`${HeroCtaClasses} ${className}`} style={{ backgroundImage: 'var(--hero-cta-gradient)' }} {...props}>
      {children}
      <ArrowRight size={15} aria-hidden="true" className="shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-[3px]" />
    </button>
  )
}

// `filters` is Home.jsx's lifted, single-source-of-truth filter state — the
// tag boxes below stay synced to it (not just one-way local state) so that
// clearing filters elsewhere (the "Clear search"/"Clear filters" chip down
// in Latest jobs) or picking a quick-discovery pill is reflected up here
// too, instead of leaving stale tags sitting in the box.
//
// Filling in job titles/skills/companies and locations here only *stages*
// them as removable tags — nothing is searched until "Search Jobs" is
// clicked (or Enter is pressed with no suggestion highlighted), matching
// how a multi-select search box is expected to behave. `onSearch` filters
// the Latest jobs section further down this same page instead of sending
// the visitor off to the dashboard app.
export default function JobSearchHero({ filters, onSearch }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('candidate')
  const [titleTags, setTitleTags] = useState(toTags(filters?.q))
  const [locationTags, setLocationTags] = useState(toTags(filters?.location))
  const [experience, setExperience] = useState(filters?.experience ?? '')
  const [employerQuery, setEmployerQuery] = useState('')
  const [employerLocation, setEmployerLocation] = useState('')

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
    if (mode === 'employer') {
      navigate('/employers/signup')
      return
    }
    onSearch?.({ q: titleTags.map((t) => t.value), location: locationTags.map((t) => t.value), experience })
  }

  return (
    <section id="job-search" className="hero-atmosphere relative pt-28 pb-24 md:pt-32 md:pb-28">
      <HeroBubbleField />

      {/* Bleeds past this section's own bottom edge, unlike HeroBubbleField's
          clipped inset-0 layer — the deliberate Hero → next-section handoff
          (see index.css's .hero-handoff-blob). */}
      <div className="absolute -bottom-28 inset-x-0 h-56 z-0 pointer-events-none" aria-hidden="true">
        <div className="hero-handoff-blob" style={{ width: 'min(640px, 90vw)', height: 220 }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Eyebrow, headline, toggle */}
        <div className="max-w-2xl mx-auto text-center">
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
            className="mt-3 text-[34px] sm:text-[44px] lg:text-[50px] xl:text-[54px] font-extrabold leading-[1.08] tracking-tight text-balance"
          >
            <span className="block text-(--explorer-navy)">{JOB_SEARCH_DATA.headlineLine1}</span>
            <span
              className="block"
              style={{ backgroundImage: 'var(--hero-cta-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
            >
              {JOB_SEARCH_DATA.headlineLine2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-[16px] sm:text-[17.5px] text-(--explorer-navy)/80 font-medium leading-relaxed"
          >
            {JOB_SEARCH_DATA.subtitleLine1}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.13, ease: [0.16, 1, 0.3, 1] }}
            className="mt-1.5 text-[14px] text-(--explorer-muted) leading-relaxed"
          >
            {JOB_SEARCH_DATA.subtitleLine2}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 inline-flex items-center gap-1 rounded-full bg-white p-1.5 border border-(--explorer-border) shadow-[0_10px_30px_-14px_rgba(16,50,79,0.35)]"
          >
            <button
              type="button"
              onClick={() => setMode('candidate')}
              aria-pressed={mode === 'candidate'}
              className={`rounded-full px-5 h-9 text-[12.5px] font-bold uppercase tracking-wide transition-colors duration-200 ${
                mode === 'candidate' ? 'text-white' : 'text-(--explorer-muted) hover:text-(--explorer-navy)'
              }`}
              style={mode === 'candidate' ? { backgroundImage: 'var(--hero-cta-gradient)' } : undefined}
            >
              {JOB_SEARCH_DATA.toggleJobLabel}
            </button>
            <button
              type="button"
              onClick={() => setMode('employer')}
              aria-pressed={mode === 'employer'}
              className={`rounded-full px-5 h-9 text-[12.5px] font-bold uppercase tracking-wide transition-colors duration-200 ${
                mode === 'employer' ? 'text-white' : 'text-(--explorer-muted) hover:text-(--explorer-navy)'
              }`}
              style={mode === 'employer' ? { backgroundImage: 'var(--hero-cta-gradient)' } : undefined}
            >
              {JOB_SEARCH_DATA.toggleEmployerLabel}
            </button>
          </motion.div>
        </div>

        {/* Search bar — fields swap by mode, container stays constant */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-7 max-w-3xl mx-auto bg-white rounded-2xl border border-(--explorer-border) focus-within:border-(--explorer-blue) focus-within:ring-3 focus-within:ring-(--explorer-blue)/12 transition-[border-color,box-shadow] duration-150 p-1.5 flex flex-col gap-1.5 shadow-[0_20px_44px_-16px_rgba(16,50,79,0.28)]"
        >
          {mode === 'candidate' ? (
            <>
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

                <HeroCtaButton className="w-full sm:w-auto shrink-0">{JOB_SEARCH_DATA.searchCta}</HeroCtaButton>
              </div>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-1.5">
              <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5">
                <Search size={18} className="text-(--explorer-muted) shrink-0" aria-hidden="true" />
                <span className="sr-only">Find talent, skills or role</span>
                <input
                  type="text"
                  value={employerQuery}
                  onChange={(e) => setEmployerQuery(e.target.value)}
                  placeholder={JOB_SEARCH_DATA.employerTitlePlaceholder}
                  autoComplete="off"
                  className="flex-1 min-w-24 bg-transparent outline-none text-[14.5px] text-(--explorer-navy) placeholder:text-(--explorer-muted)"
                />
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2.5 sm:w-56 sm:border-l sm:border-(--explorer-border) shrink-0">
                <MapPin size={18} className="text-(--explorer-muted) shrink-0" aria-hidden="true" />
                <span className="sr-only">Location</span>
                <input
                  type="text"
                  value={employerLocation}
                  onChange={(e) => setEmployerLocation(e.target.value)}
                  placeholder={JOB_SEARCH_DATA.employerLocationPlaceholder}
                  autoComplete="off"
                  className="flex-1 min-w-0 bg-transparent outline-none text-[14.5px] text-(--explorer-navy) placeholder:text-(--explorer-muted)"
                />
              </div>

              <HeroCtaButton className="w-full sm:w-auto shrink-0">{JOB_SEARCH_DATA.employerCta}</HeroCtaButton>
            </div>
          )}
        </motion.form>

        {mode === 'candidate' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1.5 text-[13.5px]"
          >
            <span className="text-(--explorer-muted) font-medium">Popular:</span>
            {JOB_SEARCH_DATA.popularSearches.slice(0, POPULAR_SEARCH_LIMIT).map((term, i, arr) => (
              <span key={term} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onSearch?.({ q: term, location: '', experience: '' })}
                  className="font-semibold text-(--explorer-navy) hover:text-(--explorer-blue) underline-offset-4 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) rounded-xs"
                >
                  {term}
                </button>
                {i < arr.length - 1 && <span className="text-(--explorer-border)" aria-hidden="true">·</span>}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
