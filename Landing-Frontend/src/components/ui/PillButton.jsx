import { ArrowUpRight } from 'lucide-react'

export default function PillButton({
  children,
  href = "#",
  onClick,
  variant = "dark", // "dark" | "white" | "outline"
  className = ""
}) {
  const baseClasses = "inline-flex items-center gap-3 px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 transform hover:-translate-y-0.5 shadow-md group cursor-pointer"
  
  const variants = {
    dark: "bg-[#0B1220] text-white hover:bg-[#1A253A]",
    white: "bg-white text-[#0B1220] hover:bg-slate-100",
    outline: "border border-white/30 text-white hover:bg-white/10"
  }

  const circleVariants = {
    dark: "bg-white/15 text-white group-hover:bg-white/25",
    white: "bg-[#0B1220] text-white group-hover:scale-110",
    outline: "bg-white/20 text-white"
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.dark} ${className}`}
    >
      <span>{children}</span>
      <span className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ${circleVariants[variant]}`}>
        <ArrowUpRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </a>
  )
}
