import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Briefcase, Check, ChevronDown, MapPin, Search } from 'lucide-react'
import { JOB_SEARCH_DATA } from '../../../lib/content'
import { fetchJobSuggestions } from '../../../lib/publicJobs'
import Autocomplete from '../../ui/Autocomplete'

const toTags = (values) => (values ?? []).map((value) => ({ value, kind: undefined }))

// A custom listbox instead of a native <select>, so the open list matches the
// title and city dropdowns (a native popup is drawn by the browser and cannot
// be styled).
function ExperienceSelect({ value, onChange, options, className }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef(null)
  const listboxId = useId()
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value))

  useEffect(() => {
    if (!open) return undefined
    const close = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [open])

  function toggle() {
    setActiveIndex(selectedIndex)
    setOpen((o) => !o)
  }

  function pick(index) {
    onChange(options[index].value)
    setOpen(false)
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      if (open) { e.preventDefault(); setOpen(false) }
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (!open) { setActiveIndex(selectedIndex); setOpen(true); return }
      setActiveIndex((i) => (e.key === "ArrowDown" ? Math.min(i + 1, options.length - 1) : Math.max(i - 1, 0)))
    } else if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault()
      pick(activeIndex)
    } else if (e.key === "Tab") {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-label="Experience"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className="flex w-full cursor-pointer items-center gap-2 bg-transparent px-3.5 py-3 text-left text-[14.5px] text-mz-ink outline-none"
      >
        <Briefcase size={17} className="shrink-0 text-[#078B7D]" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{options[selectedIndex].label}</span>
        <ChevronDown size={14} className={`shrink-0 text-mz-muted transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Experience"
          className="absolute left-0 right-0 top-full z-30 mt-2 min-w-44 rounded-lg border border-(--explorer-border) bg-white py-1.5 shadow-lg shadow-(--explorer-navy)/10"
        >
          {options.map((opt, index) => (
            <li key={opt.value} role="presentation">
              <div
                role="option"
                aria-selected={opt.value === value}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`mx-1.5 flex cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-2 text-[13.5px] font-semibold ${
                  index === activeIndex ? "bg-(--explorer-blue-surface) text-(--explorer-blue-hover)" : "text-(--explorer-navy)"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {opt.value === value && <Check size={14} className="shrink-0 text-[#078B7D]" aria-hidden="true" />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

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

  const field = 'rounded-[8px] transition-colors focus-within:bg-mz-bg'

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Search jobs"
      className="rounded-[10px] bg-white p-1.5 ring-1 ring-mz-line-strong transition-shadow focus-within:ring-2 focus-within:ring-mz-primary/50"
    >
      <div className="flex flex-col gap-1 lg:flex-row lg:items-stretch lg:gap-0">
        <div className={`${field} min-w-0 lg:flex-[1.6]`}>
          <Autocomplete
            icon={<Search size={18} className="text-[#078B7D]" />}
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
              icon={<MapPin size={18} className="text-[#078B7D]" />}
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

          <ExperienceSelect
            value={experience}
            onChange={setExperience}
            options={JOB_SEARCH_DATA.experienceOptions}
            className={`${field} sm:w-44 sm:shrink-0`}
          />

          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-mz-primary px-6 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-mz-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary lg:ml-1 lg:h-auto lg:min-h-12"
          >
            <Search size={16} aria-hidden="true" />
            Find jobs
          </button>
        </div>
      </div>
    </form>
  )
}
