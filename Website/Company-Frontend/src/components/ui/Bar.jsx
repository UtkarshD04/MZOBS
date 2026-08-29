import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

const fillTones = {
  navy: 'bg-navy',
  gold: 'bg-gold-dot',
  green: 'bg-green-dot',
}

export default function Bar({ value, tone = 'navy', thin = false, className }) {
  const [w, setW] = useState(0)
  const raf = useRef()

  useEffect(() => {
    setW(0)
    raf.current = requestAnimationFrame(() => {
      raf.current = requestAnimationFrame(() => setW(value))
    })
    return () => cancelAnimationFrame(raf.current)
  }, [value])

  return (
    <div className={cn('rounded-full bg-surface-sunken overflow-hidden', thin ? 'h-[5px]' : 'h-2', className)}>
      <div className={cn('h-full rounded-full transition-[width] duration-700 ease-out', fillTones[tone])} style={{ width: `${w}%` }} />
    </div>
  )
}
