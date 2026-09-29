import { useCallback, useEffect, useRef, useState } from 'react'
import { Briefcase, ChevronDown, MapPin, Search } from 'lucide-react'
import { JOB_SEARCH_DATA } from '../../../lib/content'
import { fetchJobSuggestions } from '../../../lib/publicJobs'
import Autocomplete from '../../ui/Autocomplete'

// Quick suggestions under the bar. `q` is the list of terms actually searched
// (OR) — "AI/ML" expands to specific phrases because a bare "AI" would
// substring-match unrelated words like "retail".
const SUGGESTIONS = [
  { label: 'Software Engineer', q: ['Software Engineer'] },
  { label: 'Data Analyst', q: ['Data Analyst'] },
  { label: 'Frontend Developer', q: ['Frontend Developer'] },
  { label: 'Marketing', q: ['Marketing'] },
  { label: 'Sales', q: ['Sales'] },
  { label: 'AI/ML', q: ['Machine Learning', 'AI Engineer', 'ML Engineer'] },
]

const toTags = (values) => (values ?? []).map((value) => ({ value, kind: undefined }))

// The hero search: stage several titles/skills/companies and cities as
// removable tags, pick experience, and go. Anything typed but not yet turned
// into a tag is included on submit, so "React" + click Search just works.
// `onSearch` is Home's applyJobFilters — it scrolls to and drives the job list.
export default function SearchBar({ filters, onSearch }) {
  const [titleTags, setTitleTags] = useState(toTags(filters?.q))
  const [locationTags, setLocationTags] = useState(toTags(filters?.location))
  const [experience, setExperience] = useState(filters?.experience ?? '')
  const pending = useRef({ title: '', location: '' })

  useEffect(() => {
    setTitleTags(toTags(filters?.q))
    setLocationTags(toTags(filters?.location))
    setExperience(filters?.experience ?? '')
  }, [filters])

  const fetchTitles = useCallback((query, { signal }) => fetchJobSuggestions({ q: query, type: 'all', limit: 15 }, { signal }), [])
  const fetchLocations = useCallback((query, { signal }) => fetchJobSuggestions({ q: query, type: 'location', limit: 15 }, { signal }), [])

  function submit(e) {
    e.preventDefault()
    const withPending = (tags, typed) => {
      const values = tags.map((t) => t.value)
      const t = typed.trim()
      return t && !values.some((v) => v.toLowerCase() === t.toLowerCase()) ? [...values, t] : values
    }
    onSearch?.({ q: withPending(titleTags, pending.current.title), location: withPending(locationTags, pending.current.location), experience })
  }

  return (
    <div>
      <form
        onSubmit={submit}
        role="search"
        aria-label="Search jobs"
        className="group/search relative rounded-[24px] bg-white/90 p-2 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_24px_48px_-24px_rgba(45,50,140,0.22)] ring-1 ring-mz-line backdrop-blur-sm transition-shadow duration-300 focus-within:ring-2 focus-within:ring-mz-primary"
      >
        <div className="flex flex-col gap-1.5">
          <div className="rounded-2xl transition-colors focus-within:bg-mz-primary-tint/50">
            <Autocomplete
              icon={<Search size={18} className="text-mz-primary" />}
              label="Job title, skills or company"
              placeholder="What role are you looking for?"
              tags={titleTags}
              onAddTag={(item) => setTitleTags((t) => [...t, item])}
              onRemoveTag={(i) => setTitleTags((t) => t.filter((_, idx) => idx !== i))}
              onInputChange={(v) => (pending.current.title = v)}
              fetchItems={fetchTitles}
            />
          </div>

          <div className="flex flex-col gap-1.5 border-t border-mz-line pt-1.5 sm:flex-row sm:items-stretch">
            <div className="rounded-2xl transition-colors focus-within:bg-mz-primary-tint/50 sm:flex-1">
              <Autocomplete
                icon={<MapPin size={18} className="text-mz-primary" />}
                label="Location"
                placeholder="Location"
                tags={locationTags}
                onAddTag={(item) => setLocationTags((t) => [...t, item])}
                onRemoveTag={(i) => setLocationTags((t) => t.filter((_, idx) => idx !== i))}
                onInputChange={(v) => (pending.current.location = v)}
                fetchItems={fetchLocations}
                searchActionLabel={(text) => `Add “${text}”`}
              />
            </div>

            <label className="relative flex items-center gap-2 rounded-2xl px-3.5 py-3 transition-colors focus-within:bg-mz-primary-tint/50 sm:w-44 sm:shrink-0">
              <Briefcase size={17} className="shrink-0 text-mz-primary" aria-hidden="true" />
              <span className="sr-only">Experience</span>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full cursor-pointer appearance-none bg-transparent pr-5 text-[14.5px] text-mz-ink outline-none"
              >
                {JOB_SEARCH_DATA.experienceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-mz-muted" aria-hidden="true" />
            </label>

            <button
              type="submit"
              className="group/go inline-flex h-12 shrink-0 items-center whitespace-nowrap justify-center gap-2 rounded-2xl bg-mz-primary px-6 text-[15px] font-semibold text-white shadow-mz-cta transition-[transform,background-color] duration-200 hover:bg-mz-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary motion-safe:active:scale-[0.98]"
            >
              Search Jobs
              <Search size={16} aria-hidden="true" className="transition-transform duration-200 group-hover/go:scale-110" />
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1 px-1 text-[13px]" aria-label="Popular searches">
        <span className="mr-1 text-mz-muted">Popular:</span>
        {SUGGESTIONS.map((s, i) => (
          <span key={s.label} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSearch?.({ q: s.q, location: [], experience: '' })}
              className="rounded px-0.5 font-medium text-mz-ink-2 underline-offset-4 transition-colors duration-150 hover:text-mz-primary-strong hover:underline focus-visible:outline-2 focus-visible:outline-mz-primary"
            >
              {s.label}
            </button>
            {i < SUGGESTIONS.length - 1 && <span className="text-mz-line-strong" aria-hidden="true">&middot;</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
