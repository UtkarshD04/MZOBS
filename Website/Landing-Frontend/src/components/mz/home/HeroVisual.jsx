import { useId } from 'react'

// The hero's brand visual: two translucent glass arches — one deep
// navy→indigo, one violet→mint — overlapping at the centre, where they glow.
// Together they form a soft, sculptural Mzobs "M". Purely
// decorative SVG; the only motion is a slow float, a barely-there sway and a
// drifting highlight (all off for prefers-reduced-motion — see .mz-sculpt-*).

// Two glass arches, side by side and overlapping at the centre — together
// they draw the Mzobs "M". Each arch is a filled outline (outer arc, rounded
// feet, inner arc), so it can be clipped, rimmed and lit like a solid.
const R = 132 // outer radius
const T = 86 // thickness
const TOP = 206 // y of the arcs' centre
const FOOT = 500 // y where the legs end (before the rounded cap)
const LEFT = { cx: 214 }
const RIGHT = { cx: 346 }

function arch({ cx }, inset = 0) {
  const ro = R - inset
  const ri = R - T + inset
  const cap = (ro - ri) / 2
  const foot = FOOT - inset
  return [
    `M ${cx - ro} ${foot}`,
    `L ${cx - ro} ${TOP}`,
    `A ${ro} ${ro} 0 0 1 ${cx + ro} ${TOP}`,
    `L ${cx + ro} ${foot}`,
    `A ${cap} ${cap} 0 0 1 ${cx + ri} ${foot}`,
    `L ${cx + ri} ${TOP}`,
    `A ${ri} ${ri} 0 0 0 ${cx - ri} ${TOP}`,
    `L ${cx - ri} ${foot}`,
    `A ${cap} ${cap} 0 0 1 ${cx - ro} ${foot}`,
    'Z',
  ].join(' ')
}

export default function HeroVisual() {
  const id = useId().replace(/:/g, '')
  const u = (name) => `url(#${id}-${name})`

  return (
    <div className="relative mx-auto aspect-[560/600] w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[520px]" aria-hidden="true">
      <svg viewBox="0 0 560 600" className="mz-sculpt-float h-full w-full overflow-visible" focusable="false">
        <defs>
          {/* forms */}
          <linearGradient id={`${id}-navy`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor="#5b5fef" stopOpacity="0.92" />
            <stop offset="0.55" stopColor="#2b2f7a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#141a3c" stopOpacity="0.94" />
          </linearGradient>
          <linearGradient id={`${id}-violet`} x1="1" y1="0" x2="0.5" y2="1">
            <stop offset="0" stopColor="#c9c3ff" stopOpacity="0.7" />
            <stop offset="0.5" stopColor="#8f84ff" stopOpacity="0.58" />
            <stop offset="1" stopColor="#6fdcbc" stopOpacity="0.62" />
          </linearGradient>
          {/* where the two forms meet */}
          <linearGradient id={`${id}-meet`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="0.55" stopColor="#b9b3ff" stopOpacity="0.75" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.95" />
          </linearGradient>
          {/* glass rim + specular sheen */}
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${id}-core`}>
            <stop offset="0" stopColor="#8e85ff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#8e85ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-aura-v`}>
            <stop offset="0" stopColor="#7c6cff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#7c6cff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-aura-m`}>
            <stop offset="0" stopColor="#20c997" stopOpacity="0.18" />
            <stop offset="1" stopColor="#20c997" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-shadow`}>
            <stop offset="0" stopColor="#1b2150" stopOpacity="0.22" />
            <stop offset="1" stopColor="#1b2150" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${id}-clip-left`}>
            <path d={arch(LEFT)} />
          </clipPath>
          <clipPath id={`${id}-clip-right`}>
            <path d={arch(RIGHT)} />
          </clipPath>
          <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        {/* atmosphere */}
        <circle cx="330" cy="250" r="260" fill={u('aura-v')} className="mz-sculpt-glow" />
        <circle cx="200" cy="400" r="200" fill={u('aura-m')} className="mz-sculpt-glow mz-sculpt-glow-2" />
        <ellipse cx="280" cy="556" rx="190" ry="24" fill={u('shadow')} className="mz-sculpt-shadow" />

        <g className="mz-sculpt-sway">
          {/* left form — deep navy → indigo */}
          <path d={arch(LEFT)} fill={u('navy')} />
          <g clipPath={u('clip-left')}>
            <ellipse cx="150" cy="150" rx="90" ry="110" fill="#7c6cff" opacity="0.5" filter={u('blur')} />
            <rect x="92" y="60" width="30" height="470" fill={u('sheen')} opacity="0.35" className="mz-sculpt-light" />
          </g>
          <path d={arch(LEFT)} fill="none" stroke={u('rim')} strokeWidth="1.5" />

          {/* right form — translucent violet → mint glass */}
          <path d={arch(RIGHT)} fill={u('violet')} />
          <g clipPath={u('clip-right')}>
            <ellipse cx="440" cy="430" rx="70" ry="120" fill="#20c997" opacity="0.32" filter={u('blur')} />
            <rect x="436" y="60" width="26" height="470" fill={u('sheen')} opacity="0.5" className="mz-sculpt-light mz-sculpt-light-2" />
          </g>

          {/* the meeting: right form clipped to the left one, lit from within */}
          <g clipPath={u('clip-left')}>
            <path d={arch(RIGHT)} fill={u('meet')} />
          </g>
          <ellipse cx="280" cy="300" rx="60" ry="170" fill={u('core')} className="mz-sculpt-glow" />

          <path d={arch(RIGHT)} fill="none" stroke={u('rim')} strokeWidth="1.5" />
          {/* inner rim — a hint of glass thickness */}
          <path d={arch(RIGHT, 9)} fill="none" stroke="#ffffff" strokeOpacity="0.28" />
          <path d={arch(LEFT, 9)} fill="none" stroke="#ffffff" strokeOpacity="0.12" />
        </g>
      </svg>
    </div>
  )
}
