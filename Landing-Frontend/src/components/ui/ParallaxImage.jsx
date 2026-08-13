import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function ParallaxImage({
  src,
  alt = '',
  className = '',
  offset = 50,
  style,
  ...props
}) {
  const ref = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Smooth transform from +offset to -offset as element scrolls through viewport
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  if (shouldReduceMotion) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        {...props}
      />
    )
  }

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        style={{ y, ...style }}
        className={className}
        {...props}
      />
    </div>
  )
}
