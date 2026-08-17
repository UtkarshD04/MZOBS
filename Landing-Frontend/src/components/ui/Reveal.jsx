import { motion } from 'framer-motion'

const OFFSETS = {
  left: { x: -36, y: 0 },
  right: { x: 36, y: 0 },
  up: { x: 0, y: 30 },
  down: { x: 0, y: -30 },
  none: { x: 0, y: 0 },
}

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  amount = 0.2,
  once = true,
  scale = 0.98,
  blur = false,
  className,
  style,
  ...props
}) {
  const offset = OFFSETS[direction] || OFFSETS.up

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...offset,
        scale,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ once, amount, margin: '0px 0px -80px 0px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={{ willChange: 'transform, opacity', ...style }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
