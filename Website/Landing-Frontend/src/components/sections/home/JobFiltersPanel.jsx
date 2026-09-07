import { SlidersHorizontal, X } from 'lucide-react'
import {
  WORK_MODES,
  EMPLOYMENT_TYPES,
  SALARY_OPTIONS,
  POSTED_WITHIN_OPTIONS,
  DEPARTMENT_OPTIONS,
  toggleValue,
  countActiveFilters,
} from '../../../lib/jobFilters'

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center h-8 px-3 rounded-full border text-[12.5px] font-semibold transition-colors ${
        active
          ? 'border-(--jobs-teal-dark) bg-(--jobs-teal-dark) text-white'
          : 'border-(--jobs-border) bg-white text-(--jobs-navy) hover:border-(--jobs-teal-dark)'
      }`}
    >
      {children}
    </button>
  )
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <h4 className="font-bold text-[12.5px] uppercase tracking-wide text-(--jobs-ink-soft)">{label}</h4>
      <div className="mt-2.5 flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

// The dashboard-equivalent filter set (Work mode, Employment type,
// Department, Salary, Posted date) surfaced right on the home page, next to
// the "Latest jobs" section — same option lists and matching rules as
// Website/Frontend's FilterSidebar (see lib/jobFilters.js), reworked as a
// flat chip panel since this page has no room for a full sidebar.
export default function JobFiltersPanel({ open, filters, onChange, onClear }) {
  if (!open) return null

  function patch(partial) {
    onChange({ ...filters, ...partial })
  }

  return (
    <div className="mb-6 rounded-xl border border-(--jobs-border) bg-(--jobs-bg-subtle) p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-(--jobs-navy)">
          <SlidersHorizontal size={15} aria-hidden="true" /> Filters
        </p>
        {countActiveFilters(filters) > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[13px] font-bold text-(--jobs-blue) hover:text-(--jobs-blue-dark) transition-colors"
          >
            <X size={13} aria-hidden="true" /> Clear all
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
        <FilterGroup label="Work mode">
          {WORK_MODES.map((mode) => (
            <Chip key={mode} active={filters.workMode.includes(mode)} onClick={() => patch({ workMode: toggleValue(filters.workMode, mode) })}>
              {mode}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Employment type">
          {EMPLOYMENT_TYPES.map((type) => (
            <Chip
              key={type}
              active={filters.employmentType.includes(type)}
              onClick={() => patch({ employmentType: toggleValue(filters.employmentType, type) })}
            >
              {type}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Department">
          {DEPARTMENT_OPTIONS.map((opt) => (
            <Chip key={opt.value} active={filters.track.includes(opt.value)} onClick={() => patch({ track: toggleValue(filters.track, opt.value) })}>
              {opt.label}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Salary">
          {SALARY_OPTIONS.filter((opt) => opt.value).map((opt) => (
            <Chip key={opt.value} active={filters.salary === opt.value} onClick={() => patch({ salary: filters.salary === opt.value ? '' : opt.value })}>
              {opt.label}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Posted">
          {POSTED_WITHIN_OPTIONS.filter((opt) => opt.value).map((opt) => (
            <Chip
              key={opt.value}
              active={filters.postedWithin === opt.value}
              onClick={() => patch({ postedWithin: filters.postedWithin === opt.value ? '' : opt.value })}
            >
              {opt.label}
            </Chip>
          ))}
        </FilterGroup>
      </div>
    </div>
  )
}
