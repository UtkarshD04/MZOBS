export default function SectionLabel({ children, tone = 'white', className = '' }) {
  return (
    <span
      className={`inline-block px-3.5 py-1.5 rounded-full text-[13px] font-black uppercase tracking-wider text-black mb-3 ${
        tone === 'gray' ? 'bg-[#F5F5F5]' : 'bg-white border border-[#e0e0e0]'
      } ${className}`}
    >
      {children}
    </span>
  )
}
