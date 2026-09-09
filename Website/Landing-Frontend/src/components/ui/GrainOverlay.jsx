// Subtle animated film-grain texture — an inline SVG fractal-noise filter
// as a data URI background, tiled and looped via a CSS keyframe (defined
// alongside its usage) instead of a JS render loop, so it's essentially free.
const NOISE_SVG =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

export default function GrainOverlay({ className = '', opacity = 0.05 }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none mix-blend-overlay animate-grain-shift ${className}`}
      style={{ backgroundImage: `url("${NOISE_SVG}")`, opacity }}
    />
  )
}
