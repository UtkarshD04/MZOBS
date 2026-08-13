import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function ImageReveal({
  src,
  alt = '',
  className = '',
  imageClassName = '',
  delay = 0,
  duration = 0.95,
  direction = 'right',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion()

  const clipInitial =
    direction === 'left'
      ? 'inset(0 0 0 100%)'
      : direction === 'up'
      ? 'inset(100% 0 0 0)'
      : 'inset(0 100% 0 0)'

  if (shouldReduceMotion) {
    return (
      <div className={cn('overflow-hidden relative', className)} {...props}>
        <img src={src} alt={alt} className={cn('w-full h-full object-cover', imageClassName)} />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ clipPath: clipInitial, opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('overflow-hidden relative group', className)}
      {...props}
    >
      <motion.img
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: duration * 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        src={src}
        alt={alt}
        className={cn('w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-premium', imageClassName)}
      />
    </motion.div>
  )
}
