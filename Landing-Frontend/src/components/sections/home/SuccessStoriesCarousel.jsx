import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SectionLabel from '../../ui/SectionLabel'
import SplitText from '../../ui/SplitText'
import TiltCard from '../../ui/TiltCard'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { CASE_STUDIES_DATA } from '../../../lib/content'

export default function SuccessStoriesCarousel() {
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
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-end justify-between gap-6 mb-10">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-xl">
          <SectionLabel>{CASE_STUDIES_DATA.badge}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
            <SplitText text={`${CASE_STUDIES_DATA.titlePrefix}${CASE_STUDIES_DATA.titleItalic}${CASE_STUDIES_DATA.titleSuffix}`} />
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
          {CASE_STUDIES_DATA.items.map((item) => (
            <StaggerItem key={item.id} className="snap-start shrink-0 w-[300px] sm:w-[360px]">
              <TiltCard maxTilt={3} className="relative rounded-3xl overflow-hidden min-h-[420px] shadow-md border border-[#e0e0e0] group h-full">
                <img
                  src={item.bgImage}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-white/90 text-black text-[10px] font-black uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-white leading-snug">{item.title}</h3>
                    <p className="text-[12px] text-white/80 leading-relaxed line-clamp-4">{item.desc}</p>
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
