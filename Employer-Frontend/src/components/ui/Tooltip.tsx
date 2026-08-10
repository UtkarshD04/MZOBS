import type { ReactNode } from 'react'

export default function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="relative inline-flex group">
      {children}
      <span className="pointer-events-none absolute left-1/2 bottom-full -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-navy-950 px-2.5 py-1.5 text-[11.5px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 z-50">
        {label}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-navy-950" />
      </span>
    </span>
  )
}
