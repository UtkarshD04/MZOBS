import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import CollapsibleGroup from './CollapsibleGroup'
import LocationAutocomplete from './LocationAutocomplete'
import { WORK_MODES, EMPLOYMENT_TYPES, EXPERIENCE_OPTIONS, SALARY_OPTIONS, POSTED_WITHIN_OPTIONS, DEPARTMENT_OPTIONS, toggleValue } from '../../lib/jobFilters'

function CheckboxRow({ id, checked, onChange, label, count }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-2 text-[13px] text-ink-secondary cursor-pointer py-0.5 hover:text-ink">
      <span className="flex items-center gap-2 min-w-0">
        <input id={id} type="checkbox" checked={checked} onChange={onChange} className="accent-navy w-[15px] h-[15px] flex-shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      {count != null && <span className="text-xs text-ink-tertiary flex-shrink-0">{count}</span>}
    </label>
  )
}

function RadioRow({ id, name, checked, onChange, label, count }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-2 text-[13px] text-ink-secondary cursor-pointer py-0.5 hover:text-ink">
      <span className="flex items-center gap-2 min-w-0">
        <input id={id} type="radio" name={name} checked={checked} onChange={onChange} className="accent-navy w-[15px] h-[15px] flex-shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      {count != null && <span className="text-xs text-ink-tertiary flex-shrink-0">{count}</span>}
    </label>
  )
}

// Reused as-is for the desktop sidebar and the mobile filter drawer — the
// caller decides whether onChange writes straight to the URL (desktop) or
// to a draft that's only committed on "Apply" (mobile), see JobMatching.jsx.
export default function FilterSidebar({ filters, onChange, facets, lockedTrack, idPrefix = 'f' }) {
  const [skillQuery, setSkillQuery] = useState('')

  function patch(partial, opts) {
    onChange({ ...filters, ...partial }, opts)
  }

  function countOf(list, value) {
    return list?.find((x) => x.value === value)?.count ?? null
  }

  const visibleSkills = useMemo(() => {
    const all = facets?.skills ?? []
    const query = skillQuery.trim().toLowerCase()
    const pool = query ? all.filter((s) => s.value.toLowerCase().includes(query)) : all
    // Keep already-selected skills visible even once they scroll out of the top-N facet list.
    const extra = filters.skills.filter((v) => !pool.some((p) => p.value === v)).map((value) => ({ value, count: null }))
    return [...extra, ...pool].slice(0, 40)
  }, [facets, skillQuery, filters.skills])

  return (
    <div>
      <CollapsibleGroup title="Location">
        <LocationAutocomplete
          value={filters.location}
          onTyping={(text) => patch({ location: text })}
          onSelect={(text) => patch({ location: text }, { immediate: true })}
        />
      </CollapsibleGroup>

      <CollapsibleGroup title="Work mode" badge={filters.workMode.length}>
        {WORK_MODES.map((mode) => (
          <CheckboxRow
            key={mode}
            id={`${idPrefix}-workMode-${mode}`}
            checked={filters.workMode.includes(mode)}
            onChange={() => patch({ workMode: toggleValue(filters.workMode, mode) })}
            label={mode}
            count={countOf(facets?.workModes, mode)}
          />
        ))}
      </CollapsibleGroup>

      <CollapsibleGroup title="Experience" badge={filters.experience ? 1 : 0}>
        {EXPERIENCE_OPTIONS.map((opt) => (
          <RadioRow
            key={opt.value || 'any'}
            id={`${idPrefix}-experience-${opt.value || 'any'}`}
            name={`${idPrefix}-experience`}
            checked={filters.experience === opt.value}
            onChange={() => patch({ experience: opt.value })}
            label={opt.label}
          />
        ))}
      </CollapsibleGroup>

      <CollapsibleGroup title="Salary" badge={filters.salary ? 1 : 0}>
        {SALARY_OPTIONS.map((opt) => (
          <RadioRow
            key={opt.value || 'any'}
            id={`${idPrefix}-salary-${opt.value || 'any'}`}
            name={`${idPrefix}-salary`}
            checked={filters.salary === opt.value}
            onChange={() => patch({ salary: opt.value })}
            label={opt.label}
          />
        ))}
      </CollapsibleGroup>

      <CollapsibleGroup title="Employment type" badge={filters.employmentType.length}>
        {EMPLOYMENT_TYPES.map((type) => (
          <CheckboxRow
            key={type}
            id={`${idPrefix}-employmentType-${type}`}
            checked={filters.employmentType.includes(type)}
            onChange={() => patch({ employmentType: toggleValue(filters.employmentType, type) })}
            label={type}
            count={countOf(facets?.employmentTypes, type)}
          />
        ))}
      </CollapsibleGroup>

      <CollapsibleGroup title="Department" badge={filters.track.length}>
        {lockedTrack ? (
          <p className="text-xs text-ink-tertiary">Locked to your assigned track on this tab.</p>
        ) : (
          DEPARTMENT_OPTIONS.map((opt) => (
            <CheckboxRow
              key={opt.value}
              id={`${idPrefix}-track-${opt.value}`}
              checked={filters.track.includes(opt.value)}
              onChange={() => patch({ track: toggleValue(filters.track, opt.value) })}
              label={opt.label}
              count={countOf(facets?.departments, opt.value)}
            />
          ))
        )}
      </CollapsibleGroup>

      <CollapsibleGroup title="Skills" badge={filters.skills.length} defaultOpen={false}>
        <p className="text-xs text-ink-tertiary -mt-1 mb-1">Shows jobs matching any of the skills you select.</p>
        <div className="relative mb-1">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <input
            value={skillQuery}
            onChange={(e) => setSkillQuery(e.target.value)}
            placeholder="Search skills"
            aria-label="Search skills"
            className="h-8 pl-8 pr-2 rounded-lg border border-border-strong bg-surface text-[12.5px] w-full outline-none focus:border-navy"
          />
        </div>
        <div className="max-h-52 overflow-y-auto pr-1 flex flex-col gap-0.5">
          {visibleSkills.length ? (
            visibleSkills.map((s) => (
              <CheckboxRow
                key={s.value}
                id={`${idPrefix}-skill-${s.value}`}
                checked={filters.skills.includes(s.value)}
                onChange={() => patch({ skills: toggleValue(filters.skills, s.value) })}
                label={s.value}
                count={s.count}
              />
            ))
          ) : (
            <p className="text-xs text-ink-tertiary">No matching skills</p>
          )}
        </div>
      </CollapsibleGroup>

      <CollapsibleGroup title="Posted date" badge={filters.postedWithin ? 1 : 0}>
        {POSTED_WITHIN_OPTIONS.map((opt) => (
          <RadioRow
            key={opt.value || 'any'}
            id={`${idPrefix}-posted-${opt.value || 'any'}`}
            name={`${idPrefix}-posted`}
            checked={filters.postedWithin === opt.value}
            onChange={() => patch({ postedWithin: opt.value })}
            label={opt.label}
          />
        ))}
      </CollapsibleGroup>

      {!!facets?.companies?.length && (
        <CollapsibleGroup title="Company" badge={filters.company.length} defaultOpen={false}>
          <div className="max-h-52 overflow-y-auto pr-1 flex flex-col gap-0.5">
            {facets.companies.map((c) => (
              <CheckboxRow
                key={c.id}
                id={`${idPrefix}-company-${c.id}`}
                checked={filters.company.includes(c.id)}
                onChange={() => patch({ company: toggleValue(filters.company, c.id) })}
                label={c.name}
                count={c.count}
              />
            ))}
          </div>
        </CollapsibleGroup>
      )}
    </div>
  )
}
