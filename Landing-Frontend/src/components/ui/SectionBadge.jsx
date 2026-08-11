export default function SectionBadge({ label }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-[11px] font-bold tracking-wider text-blue-900 uppercase mb-4 shadow-2xs">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
      {label}
    </div>
  )
}
