import { motion } from 'framer-motion'

export function StaggerGroup({
  className,
  children,
  staggerDelay = 0.09,
  delayChildren = 0,
  amount = 0.15,
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
      viewport={{ once, amount, margin: '0px 0px -80px 0px' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  className,
  children,
  y = 34,
  scale = 0.95,
  rotate = 0,
  duration = 0.65,
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
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <motion.div className={className} variants={itemVariants} {...props}>
      {children}
    </motion.div>
  )
}
