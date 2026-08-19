import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function RotatingWord({ words, interval = 2200, className = '', colors }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!words || words.length < 2) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, interval)
    return () => clearInterval(id)
  }, [words, interval])

  if (!words || words.length === 0) return null

  const longest = words.reduce((a, b) => (a.length > b.length ? a : b), '')

  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className}`}>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true" className="invisible whitespace-nowrap">
        {longest}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        <AnimatePresence>
          <motion.span
            key={index}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 whitespace-nowrap"
            style={colors?.length ? { color: colors[index % colors.length] } : undefined}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}
