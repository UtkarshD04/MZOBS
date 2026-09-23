import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CompactSummaryStrip({ items }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-5 px-1">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && <span className="text-border-strong select-none" aria-hidden="true">|</span>}
          <button
            onClick={() => navigate(item.to)}
            className="flex items-baseline gap-1.5 text-[13px] font-medium text-ink-secondary hover:text-navy transition-colors duration-150 rounded-md px-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            <span>{item.label}:</span>
            <span className="font-bold text-ink tabular-nums">{item.value}</span>
          </button>
        </Fragment>
      ))}
    </div>
  )
}
