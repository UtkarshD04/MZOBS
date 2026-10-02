import { useCallback, useEffect, useRef, useState } from 'react'
import { Briefcase, ChevronDown, MapPin, Search } from 'lucide-react'
import { JOB_SEARCH_DATA } from '../../../lib/content'
import { fetchJobSuggestions } from '../../../lib/publicJobs'
import Autocomplete from '../../ui/Autocomplete'

const toTags = (values) => (values ?? []).map((value) => ({ value, kind: undefined }))

// The homepage search: stage several titles/skills/companies and cities as
// removable tags, pick experience, and go. Anything typed but not yet turned
// into a tag is included on submit, so "React" + click Find jobs just works.
// `onSearch` is Home's applyJobFilters — it scrolls to and drives the job feed.
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

  const field = 'rounded-[10px] transition-colors focus-within:bg-mz-primary-tint/60'

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Search jobs"
      className="rounded-[12px] bg-white p-1.5 ring-1 ring-mz-line-strong transition-shadow focus-within:ring-2 focus-within:ring-mz-primary"
    >
      <div className="flex flex-col gap-1 lg:flex-row lg:items-stretch lg:gap-0">
        <div className={`${field} min-w-0 lg:flex-[1.6]`}>
          <Autocomplete
            icon={<Search size={18} className="text-mz-primary" />}
            label="Job title, skills or company"
            placeholder="Job title, skills or company"
            tags={titleTags}
            onAddTag={(item) => setTitleTags((t) => [...t, item])}
            onRemoveTag={(i) => setTitleTags((t) => t.filter((_, idx) => idx !== i))}
            onInputChange={(v) => (pending.current.title = v)}
            fetchItems={fetchTitles}
          />
        </div>

        <span className="hidden w-px self-stretch bg-mz-line lg:my-2 lg:block" aria-hidden="true" />

        <div className="flex flex-col gap-1 border-t border-mz-line pt-1 sm:flex-row sm:items-stretch lg:contents">
          <div className={`${field} min-w-0 sm:flex-1 lg:flex-1`}>
            <Autocomplete
              icon={<MapPin size={18} className="text-mz-primary" />}
              label="Location"
              placeholder="City or Remote"
              tags={locationTags}
              onAddTag={(item) => setLocationTags((t) => [...t, item])}
              onRemoveTag={(i) => setLocationTags((t) => t.filter((_, idx) => idx !== i))}
              onInputChange={(v) => (pending.current.location = v)}
              fetchItems={fetchLocations}
              searchActionLabel={(text) => `Add “${text}”`}
            />
          </div>

          <span className="hidden w-px self-stretch bg-mz-line lg:my-2 lg:block" aria-hidden="true" />

          <label className={`${field} relative flex items-center gap-2 px-3.5 py-3 sm:w-44 sm:shrink-0`}>
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
            className="mz-btn-teal inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-mz-primary px-6 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-mz-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary lg:ml-1 lg:h-auto lg:min-h-12"
          >
            <Search size={16} aria-hidden="true" />
            Find jobs
          </button>
        </div>
      </div>
    </form>
  )
}
