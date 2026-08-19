import { motion, useReducedMotion } from 'framer-motion'

export default function SplitText({ text, className = '', wordClassName = '', delay = 0, stagger = 0.045, once = true, amount = 0.4 }) {
  const shouldReduceMotion = useReducedMotion()
  const words = String(text).split(' ')

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>
  }

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }

  const wordVariants = {
    hidden: { y: '105%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: '0px 0px -80px 0px' }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.1em] mr-[0.28em] last:mr-0">
            <motion.span variants={wordVariants} className={`inline-block ${wordClassName}`}>
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.span>
  )
}
