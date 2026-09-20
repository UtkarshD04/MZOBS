import { useMemo, useState } from 'react'
import { Check, MapPin, Search, X } from 'lucide-react'
import { WORK_MODES, EMPLOYMENT_TYPES } from '../../../lib/jobFilters'
import {
  DEPARTMENT_CHOICES,
  EXPERIENCE_CHOICES,
  SALARY_CHOICES,
  POSTED_CHOICES,
  MAX_EXPERIENCE_YEARS,
  toggleIn,
  countFor,
} from '../../../lib/marketplaceFilters'

// Naukri-style filter column for the home marketplace: every group is multi-select
// (except freshness and "my experience"), each option shows a live count from
// /api/jobs/facets, and the long lists (location, company) are searchable.

function Count({ value }) {
  if (value == null) return null
  return <span className="ml-auto pl-2 text-[12px] font-medium text-(--explorer-muted) tabular-nums">({value})</span>
}

function CheckOption({ checked, onChange, count, children }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <span
        className={`flex items-center justify-center w-4.5 h-4.5 rounded-[6px] border-2 shrink-0 motion-safe:transition-colors motion-safe:duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--explorer-blue) ${
          checked ? 'bg-(--explorer-blue) border-(--explorer-blue)' : 'bg-white border-(--explorer-border) group-hover:border-(--explorer-blue-border)'
        }`}
      >
        <Check size={11} strokeWidth={3.5} className={checked ? 'text-white' : 'text-transparent'} aria-hidden="true" />
      </span>
      <span className="flex flex-1 min-w-0 items-baseline text-[13.5px] font-medium text-(--explorer-navy)">
        <span className="truncate">{children}</span>
        <Count value={count} />
      </span>
    </label>
  )
}

function RadioOption({ checked, onChange, count, children }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <input type="radio" checked={checked} onChange={onChange} className="sr-only peer" />
      <span
        className={`flex items-center justify-center w-4.5 h-4.5 rounded-full border-2 shrink-0 motion-safe:transition-colors motion-safe:duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--explorer-blue) ${
          checked ? 'border-(--explorer-blue)' : 'border-(--explorer-border) group-hover:border-(--explorer-blue-border)'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${checked ? 'bg-(--explorer-blue)' : 'bg-transparent'}`} />
      </span>
      <span className="flex flex-1 min-w-0 items-baseline text-[13.5px] font-medium text-(--explorer-navy)">
        <span className="truncate">{children}</span>
        <Count value={count} />
      </span>
    </label>
  )
}

function Group({ label, children }) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-wide text-(--explorer-muted) mb-3">{label}</p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

// A long, searchable list of dynamic options (cities / companies) — top few by
// count, "Show all" for the rest. Selected values always stay visible.
function SearchableList({ label, rows, selected, onToggle, placeholder, icon: Icon, initial = 6, idOf = (r) => r.value, nameOf = (r) => r.value }) {
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const matching = needle ? rows.filter((r) => nameOf(r).toLowerCase().includes(needle)) : rows
    if (needle || showAll) return matching
    const top = matching.slice(0, initial)
    const extraSelected = matching.slice(initial).filter((r) => selected.includes(idOf(r)))
    return [...top, ...extraSelected]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, showAll, selected])

  if (!rows.length && !selected.length) return null

  return (
    <Group label={label}>
      {rows.length > initial && (
        <div className="relative">
          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--explorer-muted)" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-(--explorer-border) bg-white text-[13px] text-(--explorer-navy) outline-none focus:border-(--explorer-blue) focus:ring-3 focus:ring-(--explorer-blue)/12 transition-colors"
          />
        </div>
      )}
      {visible.map((r) => (
        <CheckOption key={idOf(r)} checked={selected.includes(idOf(r))} onChange={() => onToggle(idOf(r))} count={r.count}>
          {nameOf(r)}
        </CheckOption>
      ))}
      {query && visible.length === 0 && <p className="text-[12.5px] text-(--explorer-muted)">No matches.</p>}
      {!query && rows.length > initial && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="self-start text-[12.5px] font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover) transition-colors"
        >
          {showAll ? 'Show less' : `Show all ${rows.length}`}
        </button>
      )}
    </Group>
  )
}

export default function MarketplaceFilters({ state, setState, facets, activeCount, onClear }) {
  const patch = (partial) => setState((prev) => ({ ...prev, ...partial }))
  const years = state.experienceYears

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-black uppercase tracking-wide text-(--explorer-navy)">Filters</p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[12.5px] font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover) transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) rounded-xs"
          >
            <X size={12} aria-hidden="true" /> Clear all
          </button>
        )}
      </div>

      <Group label="Work mode">
        {WORK_MODES.map((m) => (
          <CheckOption key={m} checked={state.workModes.includes(m)} onChange={() => patch({ workModes: toggleIn(state.workModes, m) })} count={countFor(facets?.workModes, m)}>
            {m === 'On-site' ? 'Work from office' : m}
          </CheckOption>
        ))}
      </Group>

      <Group label="Department">
        {DEPARTMENT_CHOICES.map((d) => (
          <CheckOption key={d.value} checked={state.tracks.includes(d.value)} onChange={() => patch({ tracks: toggleIn(state.tracks, d.value) })} count={countFor(facets?.departments, d.value)}>
            {d.label}
          </CheckOption>
        ))}
      </Group>

      <Group label="Experience">
        {EXPERIENCE_CHOICES.map((o) => (
          <CheckOption key={o.value} checked={state.experience.includes(o.value)} onChange={() => patch({ experience: toggleIn(state.experience, o.value) })} count={countFor(facets?.experience, o.value)}>
            {o.label}
          </CheckOption>
        ))}
        <div className="mt-1.5 rounded-xl bg-(--explorer-bg) p-3">
          <div className="flex items-center justify-between">
            <label htmlFor="mp-experience-years" className="text-[12.5px] font-bold text-(--explorer-navy)">
              My experience
            </label>
            <span className="text-[12.5px] font-black text-(--explorer-navy) tabular-nums">
              {years == null ? 'Any' : `${years} ${years === 1 ? 'year' : 'years'}`}
            </span>
          </div>
          <input
            id="mp-experience-years"
            type="range"
            min={0}
            max={MAX_EXPERIENCE_YEARS}
            step={1}
            value={years ?? 0}
            onChange={(e) => patch({ experienceYears: Number(e.target.value) })}
            className="mt-2 w-full cursor-pointer"
            style={{ accentColor: 'var(--explorer-blue)' }}
            aria-valuetext={years == null ? 'Any experience' : `${years} years`}
          />
          <div className="mt-1 flex items-center justify-between text-[11px] text-(--explorer-muted)">
            <span>0</span>
            {years != null ? (
              <button type="button" onClick={() => patch({ experienceYears: null })} className="font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover)">
                Clear
              </button>
            ) : (
              <span>Drag to set</span>
            )}
            <span>{MAX_EXPERIENCE_YEARS}+</span>
          </div>
        </div>
      </Group>

      <Group label="Salary">
        {SALARY_CHOICES.map((o) => (
          <CheckOption key={o.value} checked={state.salary.includes(o.value)} onChange={() => patch({ salary: toggleIn(state.salary, o.value) })} count={countFor(facets?.salary, o.value)}>
            {o.label}
          </CheckOption>
        ))}
      </Group>

      <Group label="Freshness">
        {POSTED_CHOICES.map((o) => (
          <RadioOption key={o.value} checked={state.postedWithin === o.value} onChange={() => patch({ postedWithin: state.postedWithin === o.value ? '' : o.value })} count={countFor(facets?.postedWithin, o.value)}>
            {o.label}
          </RadioOption>
        ))}
      </Group>

      <Group label="Job type">
        {EMPLOYMENT_TYPES.map((t) => (
          <CheckOption key={t} checked={state.jobTypes.includes(t)} onChange={() => patch({ jobTypes: toggleIn(state.jobTypes, t) })} count={countFor(facets?.employmentTypes, t)}>
            {t}
          </CheckOption>
        ))}
      </Group>

      <SearchableList
        label="Location"
        rows={facets?.locations ?? []}
        selected={state.location}
        onToggle={(city) => patch({ location: toggleIn(state.location, city) })}
        placeholder="Search location..."
        icon={MapPin}
      />

      <SearchableList
        label="Company"
        rows={facets?.companies ?? []}
        selected={state.company}
        onToggle={(id) => patch({ company: toggleIn(state.company, id) })}
        placeholder="Search company..."
        icon={Search}
        idOf={(r) => r.id}
        nameOf={(r) => r.name}
      />
    </div>
  )
}
