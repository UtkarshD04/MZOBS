import { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function TiltCard({
  children,
  className,
  maxTilt = 4,
  scale = 1.03,
  y = -10,
  style,
  ...props
}) {
  const ref = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate rotation (-maxTilt to +maxTilt)
    const rX = ((mouseY / height) - 0.5) * -2 * maxTilt
    const rY = ((mouseX / width) - 0.5) * 2 * maxTilt

    setRotateX(rX)
    setRotateY(rY)
  }

  const handleMouseEnter = () => setIsHovered(true)

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={
        isHovered && !shouldReduceMotion
          ? {
              rotateX,
              rotateY,
              y,
              scale,
            }
          : {
              rotateX: 0,
              rotateY: 0,
              y: 0,
              scale: 1,
            }
      }
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        ...style,
      }}
      className={cn('group transition-shadow duration-300', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
