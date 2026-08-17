import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function PillButton({
  children,
  href = "#",
  onClick,
  variant = "dark", // "dark" | "white" | "outline" | "blueFill" | "blueOutline"
  className = "",
  magnetic = true
}) {
  const ref = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const baseClasses = "relative inline-flex items-center gap-3 px-6 py-3 rounded-full font-medium text-sm shadow-md group cursor-pointer transition-colors duration-300 will-change-transform"

  const variants = {
    dark: "bg-[#0B1220] text-white hover:bg-[#1A253A]",
    white: "bg-white text-[#0B1220] hover:bg-slate-100",
    outline: "border border-white/30 text-white hover:bg-white/10",
    blueFill: "bg-[#333333] text-white border border-[#333333] hover:bg-white hover:text-[#595959] hover:border-[#666]",
    blueOutline: "bg-white text-[#595959] border border-[#666] hover:bg-[#333333] hover:text-white hover:border-[#333333]"
  }

  const circleVariants = {
    dark: "bg-white/15 text-white group-hover:bg-white/25",
    white: "bg-[#0B1220] text-white group-hover:scale-110",
    outline: "bg-white/20 text-white",
    blueFill: "bg-white/20 text-white",
    blueOutline: "bg-[#F5F5F5] text-[#595959]"
  }

  function handleMouseMove(e) {
    if (!magnetic || shouldReduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.3,
      y: (e.clientY - rect.top - rect.height / 2) * 0.3,
    })
  }

  function handleMouseEnter() {
    setHovered(true)
  }

  function handleMouseLeave() {
    setHovered(false)
    setPos({ x: 0, y: 0 })
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: hovered ? pos.y - 3 : 0 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
      className={`${baseClasses} ${variants[variant] || variants.dark} ${className}`}
    >
      <span>{children}</span>
      <span className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ${circleVariants[variant]}`}>
        <ArrowUpRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </motion.a>
  )
}
