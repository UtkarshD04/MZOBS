import { useId, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

const VB_W = 600
const PAD_TOP = 18
const PAD_BOTTOM = 28

export default function AreaLineChart({ data, height = 220, formatValue = (v) => v, className }) {
  const [hover, setHover] = useState(null)
  const svgRef = useRef(null)
  const gradId = useId()

  const points = useMemo(() => {
    const values = data.map((d) => d.value)
    const maxV = Math.max(...values)
    const minV = Math.min(0, ...values)
    const usableH = height - PAD_TOP - PAD_BOTTOM
    const stepX = data.length > 1 ? VB_W / (data.length - 1) : VB_W
    return data.map((d, i) => {
      const t = maxV === minV ? 1 : (d.value - minV) / (maxV - minV)
      return { x: i * stepX, y: PAD_TOP + (1 - t) * usableH, ...d }
    })
  }, [data, height])

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const baseY = height - PAD_BOTTOM
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${baseY} L${points[0].x.toFixed(1)},${baseY} Z`

  function onMove(e) {
    const rect = svgRef.current.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * VB_W
    let nearest = 0
    let best = Infinity
    points.forEach((p, i) => {
      const d = Math.abs(p.x - relX)
      if (d < best) {
        best = d
        nearest = i
      }
    })
    setHover(nearest)
  }

  const hp = hover !== null ? points[hover] : null

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${height}`}
        width="100%"
        height={height}
        className="overflow-visible cursor-crosshair"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-navy)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-navy)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1={baseY} x2={VB_W} y2={baseY} stroke="var(--color-border)" strokeWidth="1" />
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke="var(--color-navy)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
        {hp && <line x1={hp.x} y1={PAD_TOP} x2={hp.x} y2={baseY} stroke="var(--color-border-strong)" strokeWidth="1" strokeDasharray="3 3" />}
        {points.map((p, i) => {
          const isLast = i === points.length - 1
          const isHover = i === hover
          const r = isHover ? 5.5 : isLast ? 4.5 : 0
          if (!r) return null
          return <circle key={i} cx={p.x} cy={p.y} r={r} fill={isLast ? 'var(--color-gold-dot)' : 'var(--color-navy)'} stroke="var(--color-surface)" strokeWidth="2" />
        })}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={height - 8} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-ink-tertiary)">
            {p.label}
          </text>
        ))}
      </svg>
      {hp && (
        <div
          className="absolute pointer-events-none bg-navy-900 text-white text-[12px] font-semibold rounded-lg px-2.5 py-[7px] shadow-lg -translate-x-1/2 whitespace-nowrap z-10"
          style={{ left: `${(hp.x / VB_W) * 100}%`, top: `${Math.max(0, hp.y - 42)}px` }}
        >
          {hp.label}: <span className="text-gold-dot">{formatValue(hp.value)}</span>
        </div>
      )}
    </div>
  )
}

export function HBarList({ data, tone = 'navy', className }) {
  const max = Math.max(...data.map((d) => d.value))
  const fillTone = { navy: 'bg-navy', gold: 'bg-gold-dot' }[tone]
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {data.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-[12.5px] text-ink-secondary w-[104px] flex-shrink-0 truncate">{d.label}</span>
          <div className="flex-1 h-2 rounded-full bg-surface-sunken overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-[width] duration-700 ease-out', i === 0 ? 'bg-gold-dot' : fillTone)}
              style={{ width: `${max ? (d.value / max) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[12.5px] font-semibold w-7 text-right flex-shrink-0 tabular-nums">{d.value}</span>
        </div>
      ))}
    </div>
  )
}
