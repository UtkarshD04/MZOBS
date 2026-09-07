import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Deterministic PRNG (mulberry32) — same seed always lays out the same
// network, so it doesn't reshuffle on every re-render.
function mulberry32(seed) {
  let t = seed
  return function () {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const VB_W = 1000
const VB_H = 640
const EASE = [0.16, 1, 0.3, 1]

// The ecosystem's four anchor points — hand-placed (not random) so the
// network reads as an intentional pipeline, Talent through to
// Opportunity, rather than a random particle cloud.
const HUBS = [
  { id: 'talent', x: 110, y: 560 },
  { id: 'verify', x: 460, y: 470 },
  { id: 'company', x: 700, y: 260 },
  { id: 'opportunity', x: 910, y: 130 },
]

function buildSatellites(count, seed) {
  const rand = mulberry32(seed)
  return Array.from({ length: count }, (_, i) => {
    const x = 3 + rand() * 94
    const y = 3 + rand() * 94
    const px = (x / 100) * VB_W
    const py = (y / 100) * VB_H
    let hub = HUBS[0]
    let best = Infinity
    HUBS.forEach((h) => {
      const d = Math.hypot(h.x - px, h.y - py)
      if (d < best) {
        best = d
        hub = h
      }
    })
    const layerRoll = rand()
    const layer = layerRoll < 0.4 ? 'far' : layerRoll < 0.78 ? 'mid' : 'near'
    const byLayer = {
      far: { r: 2.2, op: 0.28 },
      mid: { r: 3.4, op: 0.48 },
      near: { r: 4.6, op: 0.72 },
    }[layer]
    return {
      id: i,
      x: px,
      y: py,
      hub,
      r: byLayer.r,
      baseOpacity: byLayer.op,
      delay: rand() * 3.5,
      duration: 3 + rand() * 2.4,
    }
  })
}

function HubGlyph({ hub, bright }) {
  const { x, y, id } = hub
  const stroke = bright ? 'var(--auth-accent-bright)' : 'var(--auth-accent-glow)'

  return (
    <g>
      {/* soft glow disc beneath the crisp glyph */}
      <circle cx={x} cy={y} r={26} fill={stroke} opacity={0.16} style={{ filter: 'blur(10px)' }} />
      <circle cx={x} cy={y} r={17} fill="none" stroke={stroke} strokeWidth="1.2" opacity={0.5} />

      {id === 'talent' && (
        <g stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx={x} cy={y - 6} r={4.2} />
          <path d={`M ${x - 7.5} ${y + 9} q 7.5 -9 15 0`} />
        </g>
      )}

      {id === 'verify' && (
        <g stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M ${x} ${y - 9} l 8 3.2 v 6.5 q 0 6 -8 9.3 q -8 -3.3 -8 -9.3 v -6.5 z`} />
          <path d={`M ${x - 3.6} ${y} l 2.4 2.8 l 5 -6`} />
        </g>
      )}

      {id === 'company' && (
        <g stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x={x - 8} y={y - 11} width="16" height="22" rx="1.4" />
          <path d={`M ${x - 4} ${y - 6} h 0.01 M ${x + 4} ${y - 6} h 0.01 M ${x - 4} ${y} h 0.01 M ${x + 4} ${y} h 0.01 M ${x - 4} ${y + 6} h 0.01 M ${x + 4} ${y + 6} h 0.01`} />
        </g>
      )}

      {id === 'opportunity' && (
        <path
          d={`M ${x} ${y - 11} L ${x + 3.2} ${y - 3.2} L ${x + 11} ${y} L ${x + 3.2} ${y + 3.2} L ${x} ${y + 11} L ${x - 3.2} ${y + 3.2} L ${x - 11} ${y} L ${x - 3.2} ${y - 3.2} Z`}
          fill={stroke}
          opacity={0.9}
        />
      )}
    </g>
  )
}

// The "Trust Constellation" — an intentional ecosystem (Talent →
// Verification → Companies → Opportunity) rather than generic drifting
// particles. Reacts to `activity` (input focus) and `progress` (fields
// filled so far), and can sweep everything toward `convergeTo` on a
// successful sign-in/up.
export default function TrustConstellation({
  className = '',
  density = 46,
  seed = 12,
  activity = false,
  progress = 0,
  converge = false,
  convergeTo,
  fade = true,
}) {
  const reduceMotion = useReducedMotion()
  const satellites = useMemo(() => buildSatellites(density, seed), [density, seed])
  const target = convergeTo ?? { x: VB_W * 0.62, y: VB_H * 0.5 }
  const visibleCount = Math.max(6, Math.round(satellites.length * Math.min(1, Math.max(0, progress || 0.22))))
  const visible = satellites.slice(0, visibleCount)

  return (
    <div
      className={className}
      style={
        fade
          ? {
              WebkitMaskImage: 'radial-gradient(ellipse 78% 90% at 30% 45%, black 45%, transparent 92%)',
              maskImage: 'radial-gradient(ellipse 78% 90% at 30% 45%, black 45%, transparent 92%)',
            }
          : undefined
      }
    >
      <motion.svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
        animate={reduceMotion ? undefined : { opacity: activity ? 1 : 0.86, scale: activity ? 1.012 : 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ transformOrigin: '50% 50%' }}
      >
        <defs>
          <linearGradient id="tc-spine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--auth-accent-glow)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--auth-accent-bright)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--auth-accent-glow)" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="tc-spoke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--auth-accent-glow)" stopOpacity="0.38" />
            <stop offset="100%" stopColor="var(--auth-accent-glow)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* the pipeline "spine" linking the four hubs */}
        {HUBS.slice(0, -1).map((h, i) => {
          const next = HUBS[i + 1]
          return (
            <motion.line
              key={`spine-${h.id}`}
              x1={converge ? target.x : h.x}
              y1={converge ? target.y : h.y}
              x2={converge ? target.x : next.x}
              y2={converge ? target.y : next.y}
              stroke="url(#tc-spine)"
              strokeWidth={converge ? 0.4 : 2.2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                converge
                  ? { opacity: 0 }
                  : { pathLength: 1, opacity: 1 }
              }
              transition={
                converge
                  ? { duration: 0.7, delay: 0.1 + i * 0.05, ease: EASE }
                  : { duration: 1.3, delay: 0.2 + i * 0.15, ease: EASE }
              }
            />
          )
        })}

        {/* satellite → hub spokes */}
        {visible.map((n) => (
          <motion.line
            key={`spoke-${n.id}`}
            x1={converge ? target.x : n.hub.x}
            y1={converge ? target.y : n.hub.y}
            x2={converge ? target.x : n.x}
            y2={converge ? target.y : n.y}
            stroke="url(#tc-spoke)"
            strokeWidth={converge ? 0.3 : 0.9}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={converge ? { opacity: 0 } : { pathLength: 1, opacity: 1 }}
            transition={
              converge
                ? { duration: 0.6, delay: (n.id % 10) * 0.02, ease: EASE }
                : { duration: 1, delay: 0.05 * (n.id % 8), ease: EASE }
            }
          />
        ))}

        {/* satellite nodes */}
        {visible.map((n) => (
          <motion.circle
            key={n.id}
            r={converge ? 0.4 : n.r}
            fill="var(--auth-accent-glow)"
            initial={{ opacity: 0, cx: n.x, cy: n.y, scale: 0.5 }}
            animate={
              converge
                ? { cx: target.x, cy: target.y, opacity: 0, scale: 0.3 }
                : reduceMotion
                  ? { opacity: n.baseOpacity, cx: n.x, cy: n.y, scale: 1 }
                  : {
                      opacity: [n.baseOpacity * 0.7, n.baseOpacity, n.baseOpacity * 0.7],
                      cx: n.x,
                      cy: n.y,
                      scale: [1, 1.15, 1],
                    }
            }
            transition={
              converge
                ? { duration: 0.9, delay: (n.id % 12) * 0.025, ease: EASE }
                : reduceMotion
                  ? { duration: 0.5 }
                  : { duration: n.duration, repeat: Infinity, ease: 'easeInOut', delay: n.delay }
            }
          />
        ))}

        {/* the four ecosystem hubs */}
        {HUBS.map((h, i) => (
          <motion.g
            key={h.id}
            initial={{ opacity: 0 }}
            animate={
              converge
                ? { opacity: 0, x: target.x - h.x, y: target.y - h.y, scale: 0.4 }
                : { opacity: 1, x: 0, y: 0, scale: 1 }
            }
            transition={
              converge
                ? { duration: 1, delay: 0.15 + i * 0.06, ease: EASE }
                : { duration: 0.8, delay: 0.3 + i * 0.12, ease: EASE }
            }
          >
            <HubGlyph hub={h} bright={activity} />
          </motion.g>
        ))}
      </motion.svg>
    </div>
  )
}
