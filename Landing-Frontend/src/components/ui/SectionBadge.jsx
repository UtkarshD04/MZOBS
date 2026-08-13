export default function SectionBadge({ label }) {
  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-amber-500/10 border border-blue-500/20 text-[11px] font-bold tracking-widest text-blue-900 uppercase mb-4 shadow-[0_2px_12px_rgba(59,130,246,0.12)] backdrop-blur-xs">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
      </span>
      {label}
    </div>
  )
}
