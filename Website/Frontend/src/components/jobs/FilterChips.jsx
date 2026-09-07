import { X } from 'lucide-react'
import { buildFilterChips } from '../../lib/jobFilters'

export default function FilterChips({ filters, onChange, onClearAll, companyNameOf }) {
  const chips = buildFilterChips(filters, { companyNameOf })
  if (!chips.length) return null

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onChange(chip.clear(filters))}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium pl-3 pr-2 py-1.5 rounded-full bg-navy-tint text-navy hover:bg-navy hover:text-white transition-colors cursor-pointer"
        >
          {chip.label}
          <X size={12} />
        </button>
      ))}
      <button type="button" onClick={onClearAll} className="text-[12.5px] font-semibold text-ink-tertiary hover:text-red px-2 py-1.5 cursor-pointer">
        Clear all filters
      </button>
    </div>
  )
}
