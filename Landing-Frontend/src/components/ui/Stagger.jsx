import { motion } from 'framer-motion'

export function StaggerGroup({
  className,
  children,
  staggerDelay = 0.12,
  delayChildren = 0,
  amount = 0.12,
  once = true,
  ...props
}) {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren,
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  className,
  children,
  y = 70,
  scale = 0.88,
  rotate = 2.5,
  duration = 0.75,
  ...props
}) {
  const itemVariants = {
    hidden: { opacity: 0, y, scale, rotate },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div className={className} variants={itemVariants} {...props}>
      {children}
    </motion.div>
  )
}


