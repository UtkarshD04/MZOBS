import { motion, useReducedMotion } from 'framer-motion'

export default function FloatingElement({
  children,
  duration = 6,
  delay = 0,
  distance = 18,
  rotate = true,
  className = '',
  style,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        y: [0, -distance, 0],
        rotate: rotate ? [0, -3.5, 0, 3.5, 0] : 0,
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay,
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  )
}
