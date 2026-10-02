import { useMemo, useState } from 'react'
import { Check, ChevronDown, MapPin, Wrench, Building2 } from 'lucide-react'
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

// Filters for the homepage job feed. Every option shows a live count from
// /api/jobs/facets (each group's counts leave that group's own selection out,
// so siblings stay meaningful while multi-selecting). Once counts have
// loaded, an option with 0 matching jobs is disabled unless already picked —
// so a click can never lead to an empty feed.

// The fixed-option groups, shared by the full panel and the quick-filter
// dropdowns above the feed (see JobMarketplace.jsx).
export const FILTER_GROUPS = {
  workModes: {
    label: 'Work mode',
    facetKey: 'workModes',
    options: WORK_MODES.map((v) => ({ value: v, label: v === 'On-site' ? 'Work from office' : v })),
  },
  experience: { label: 'Experience', facetKey: 'experience', options: EXPERIENCE_CHOICES },
  salary: { label: 'Salary', facetKey: 'salary', options: SALARY_CHOICES },
  postedWithin: { label: 'Date posted', facetKey: 'postedWithin', single: true, options: POSTED_CHOICES },
  jobTypes: { label: 'Job type', facetKey: 'employmentTypes', options: EMPLOYMENT_TYPES.map((v) => ({ value: v, label: v })) },
  tracks: { label: 'Department', facetKey: 'departments', options: DEPARTMENT_CHOICES },
}

export function selectedCount(key, state) {
  const value = state[key]
  const n = Array.isArray(value) ? value.length : value ? 1 : 0
  return key === 'experience' && state.experienceYears != null ? n + 1 : n
}

// The facet response only lists values that have jobs, so once a group's
// counts are in, a missing value really is 0.
function optionCount(facets, facetKey, value) {
  const rows = facets?.[facetKey]
  if (!rows) return undefined
  return countFor(rows, value) ?? 0
}

function Count({ value }) {
  if (value == null) return null
  return <span className="ml-auto pl-2 text-[12px] font-medium text-(--explorer-muted) tabular-nums">{value.toLocaleString('en-IN')}</span>
}

function OptionRow({ type, checked, disabled, onChange, count, children }) {
  return (
    <label className={`group flex select-none items-center gap-2.5 rounded-[8px] px-2 py-1.5 ${disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:bg-(--explorer-bg)'}`}>
      <input type={type} checked={checked} disabled={disabled} onChange={onChange} className="peer sr-only" />
      <span
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center border-2 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--explorer-blue) motion-safe:transition-colors ${
          type === 'radio' ? 'rounded-full' : 'rounded-[5px]'
        } ${checked ? 'border-(--explorer-blue) bg-(--explorer-blue)' : 'border-(--explorer-border) bg-white group-hover:border-(--explorer-blue-border)'}`}
      >
        {type === 'radio' ? (
          <span className={`h-1.5 w-1.5 rounded-full ${checked ? 'bg-white' : 'bg-transparent'}`} />
        ) : (
          <Check size={11} strokeWidth={3.5} className={checked ? 'text-white' : 'text-transparent'} aria-hidden="true" />
        )}
      </span>
      <span className="flex min-w-0 flex-1 items-baseline text-[13.5px] font-medium text-(--explorer-navy)">
        <span className="truncate">{children}</span>
        <Count value={count} />
      </span>
    </label>
  )
}

// One fixed-option group as a list of checkbox (or radio, for single-choice)
// rows. Used inside the panel's sections and the quick-filter dropdowns.
export function OptionList({ groupKey, state, setState, facets }) {
  const group = FILTER_GROUPS[groupKey]
  const current = state[groupKey]
  return (
    <div className="flex flex-col gap-0.5">
      {group.options.map((o) => {
        const checked = group.single ? current === o.value : current.includes(o.value)
        const count = optionCount(facets, group.facetKey, o.value)
        return (
          <OptionRow
            key={o.value}
            type={group.single ? 'radio' : 'checkbox'}
            checked={checked}
            disabled={!checked && count === 0}
            count={count}
            onChange={() =>
              setState((prev) => ({
                ...prev,
                [groupKey]: group.single ? (prev[groupKey] === o.value ? '' : o.value) : toggleIn(prev[groupKey], o.value),
              }))
            }
          >
            {o.label}
          </OptionRow>
        )
      })}
    </div>
  )
}

// Collapsible panel section; the header carries how many values are picked.
function Section({ title, count = 0, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen || count > 0)
  return (
    <div className="border-b border-(--explorer-border) py-1 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-[8px] px-1 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-(--explorer-blue)"
      >
        <span className="text-[14px] font-semibold text-(--explorer-navy)">{title}</span>
        {count > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-(--explorer-blue) px-1.5 text-[11px] font-bold text-white">{count}</span>
        )}
        <ChevronDown size={16} className={`ml-auto text-(--explorer-muted) transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}

// A long, searchable list of dynamic options (cities / skills / companies) —
// top few by count, "Show all" for the rest. Selected values always stay visible.
function SearchableList({ rows, selected, onToggle, placeholder, icon: Icon, initial = 6, idOf = (r) => r.value, nameOf = (r) => r.value, orphanName = (id) => id }) {
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

  // A picked value that has dropped out of the facet response still shows,
  // so it can be unticked here.
  const orphans = selected.filter((id) => !rows.some((r) => idOf(r) === id))

  return (
    <div className="flex flex-col gap-0.5">
      {rows.length > initial && (
        <div className="relative mb-1.5">
          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--explorer-muted)" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-9 w-full rounded-[8px] border border-(--explorer-border) bg-white pl-9 pr-3 text-[13px] text-(--explorer-navy) outline-none transition-colors focus:border-(--explorer-blue) focus:ring-3 focus:ring-(--explorer-blue)/12"
          />
        </div>
      )}
      {visible.map((r) => (
        <OptionRow key={idOf(r)} type="checkbox" checked={selected.includes(idOf(r))} onChange={() => onToggle(idOf(r))} count={r.count}>
          {nameOf(r)}
        </OptionRow>
      ))}
      {orphans.map((id) => (
        <OptionRow key={id} type="checkbox" checked onChange={() => onToggle(id)}>
          {orphanName(id)}
        </OptionRow>
      ))}
      {!rows.length && !orphans.length && <p className="px-2 py-1 text-[12.5px] text-(--explorer-muted)">Nothing to filter by for this search.</p>}
      {query && visible.length === 0 && <p className="px-2 py-1 text-[12.5px] text-(--explorer-muted)">No matches.</p>}
      {!query && rows.length > initial && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-1 self-start px-2 text-[12.5px] font-semibold text-(--explorer-blue) transition-colors hover:text-(--explorer-blue-hover)"
        >
          {showAll ? 'Show less' : `Show all ${rows.length}`}
        </button>
      )}
    </div>
  )
}

function ExperienceYears({ years, onChange }) {
  return (
    <div className="mt-2 rounded-[10px] bg-(--explorer-bg) p-3">
      <div className="flex items-center justify-between">
        <label htmlFor="mp-experience-years" className="text-[12.5px] font-semibold text-(--explorer-navy)">
          Or match my experience
        </label>
        <span className="text-[12.5px] font-bold text-(--explorer-navy) tabular-nums">
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
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full cursor-pointer"
        style={{ accentColor: 'var(--explorer-blue)' }}
        aria-valuetext={years == null ? 'Any experience' : `${years} years`}
      />
      <div className="mt-1 flex items-center justify-between text-[11px] text-(--explorer-muted)">
        <span>0</span>
        {years != null ? (
          <button type="button" onClick={() => onChange(null)} className="font-semibold text-(--explorer-blue) hover:text-(--explorer-blue-hover)">
            Clear
          </button>
        ) : (
          <span>Drag to set</span>
        )}
        <span>{MAX_EXPERIENCE_YEARS}+</span>
      </div>
    </div>
  )
}

// The full filter panel (inside the side sheet / bottom sheet). The most-used
// groups start open; any group with a selection always opens.
export default function MarketplaceFilters({ state, setState, facets, companyNameOf }) {
  const patch = (partial) => setState((prev) => ({ ...prev, ...partial }))
  const fixed = (key, defaultOpen) => (
    <Section key={key} title={FILTER_GROUPS[key].label} count={selectedCount(key, state)} defaultOpen={defaultOpen}>
      <OptionList groupKey={key} state={state} setState={setState} facets={facets} />
      {key === 'experience' && <ExperienceYears years={state.experienceYears} onChange={(v) => patch({ experienceYears: v })} />}
    </Section>
  )

  return (
    <div className="flex flex-col">
      {fixed('workModes', true)}
      {fixed('experience', true)}
      <Section title="Location" count={state.location.length} defaultOpen>
        <SearchableList
          rows={facets?.locations ?? []}
          selected={state.location}
          onToggle={(city) => patch({ location: toggleIn(state.location, city) })}
          placeholder="Search location…"
          icon={MapPin}
        />
      </Section>
      {fixed('salary')}
      {fixed('tracks')}
      <Section title="Skills" count={state.skills.length}>
        <SearchableList
          rows={facets?.skills ?? []}
          selected={state.skills}
          onToggle={(skill) => patch({ skills: toggleIn(state.skills, skill) })}
          placeholder="Search skills…"
          icon={Wrench}
          initial={8}
        />
      </Section>
      {fixed('postedWithin')}
      {fixed('jobTypes')}
      <Section title="Company" count={state.company.length}>
        <SearchableList
          rows={facets?.companies ?? []}
          selected={state.company}
          onToggle={(id) => patch({ company: toggleIn(state.company, id) })}
          placeholder="Search company…"
          icon={Building2}
          idOf={(r) => r.id}
          nameOf={(r) => r.name}
          orphanName={(id) => companyNameOf?.(id) ?? 'Company'}
        />
      </Section>
    </div>
  )
}

