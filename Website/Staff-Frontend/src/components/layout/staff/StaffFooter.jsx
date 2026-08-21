export default function StaffFooter() {
  return (
    <footer className="mt-12 pt-6 border-t border-border">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <img src="/images/logo.png" alt="Mzobs" className="h-6 w-auto object-contain" />
          <span className="text-xs text-ink-tertiary">© {new Date().getFullYear()} Mzobs · Staff Portal</span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-ink-tertiary">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex w-full h-full rounded-full bg-green-dot opacity-60 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-green-dot" />
          </span>
          All systems operational
        </span>
      </div>
    </footer>
  )
}
