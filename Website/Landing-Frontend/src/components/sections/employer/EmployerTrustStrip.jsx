const ITEMS = ['Verified job requirements', 'Relevant applications', 'One hiring workspace']

export default function EmployerTrustStrip() {
  return (
    <section className="bg-[#102a43] px-6 md:px-12">
      <div className="max-w-7xl mx-auto py-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
        {ITEMS.map((item, i) => (
          <span key={item} className="flex items-center gap-3">
            <span className="text-[11px] sm:text-[12px] font-bold uppercase text-[#e8f8f5]/75 tracking-[0.12em]">{item}</span>
            {i < ITEMS.length - 1 && <span className="w-px h-3.5 bg-[#e8f8f5]/20" aria-hidden="true" />}
          </span>
        ))}
      </div>
    </section>
  )
}
