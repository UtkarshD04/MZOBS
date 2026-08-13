import { motion } from 'framer-motion'

const OFFSETS = {
  left: { x: -75, y: 0 },
  right: { x: 75, y: 0 },
  up: { x: 0, y: 65 },
  down: { x: 0, y: -65 },
  none: { x: 0, y: 0 },
}

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.85,
  amount = 0.15,
  once = true,
  scale = 0.92,
  blur = true,
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
        filter: blur ? 'blur(12px)' : 'blur(0px)',
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  )
}


