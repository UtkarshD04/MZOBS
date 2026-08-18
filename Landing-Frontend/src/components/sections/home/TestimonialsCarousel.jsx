import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SectionLabel from '../../ui/SectionLabel'
import SplitText from '../../ui/SplitText'
import TiltCard from '../../ui/TiltCard'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { TESTIMONIALS_DATA } from '../../../lib/content'

export default function TestimonialsCarousel({ items, badge, heading }) {
  const testimonialItems = items || TESTIMONIALS_DATA.items
  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  function updateEdges() {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateEdges()
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [])

  function scroll(dir) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <section id="testimonials" className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-end justify-between gap-6 mb-10">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-xl">
          <SectionLabel>{badge || TESTIMONIALS_DATA.badge}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
            {heading || <SplitText text={`${TESTIMONIALS_DATA.titlePrefix}${TESTIMONIALS_DATA.titleItalic}${TESTIMONIALS_DATA.titleSuffix}`} />}
          </h2>
        </Reveal>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <motion.button
            onClick={() => scroll(-1)}
            disabled={!canPrev}
            aria-label="Previous"
            whileHover={canPrev ? { scale: 1.1, backgroundColor: '#3D5C34', color: '#fff' } : {}}
            whileTap={canPrev ? { scale: 0.9 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-11 h-11 rounded-full border border-[#C9C9C9] flex items-center justify-center text-[#595959] disabled:opacity-30 disabled:pointer-events-none transition-opacity"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <motion.button
            onClick={() => scroll(1)}
            disabled={!canNext}
            aria-label="Next"
            whileHover={canNext ? { scale: 1.1, backgroundColor: '#3D5C34', color: '#fff' } : {}}
            whileTap={canNext ? { scale: 0.9 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-11 h-11 rounded-full border border-[#C9C9C9] flex items-center justify-center text-[#595959] disabled:opacity-30 disabled:pointer-events-none transition-opacity"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>

      <div ref={trackRef} className="careers-scroll-x overflow-x-auto snap-x snap-mandatory px-6 md:px-12 pb-2">
        <StaggerGroup className="flex gap-6 w-max">
          {testimonialItems.map((item) => (
            <StaggerItem key={item.id} className="snap-start shrink-0 w-[240px] sm:w-[280px]">
              <TiltCard maxTilt={3} className="relative rounded-3xl overflow-hidden min-h-[360px] shadow-md border border-[#e0e0e0] group h-full">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />
                <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                  <Quote size={22} className="text-white/70" />
                  <div className="space-y-2">
                    <p className="text-[12px] text-white/90 leading-relaxed line-clamp-4">{item.quote}</p>
                    <div className="pt-1">
                      <h4 className="text-[13px] font-black text-white">{item.name}</h4>
                      <p className="text-[11px] text-white/70">{item.title}</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
