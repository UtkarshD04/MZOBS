import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { FAQ_DATA } from '../../../lib/content'

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <StaggerItem>
      <div className="border-b border-[#e0e0e0]">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        >
          <span className="text-[15px] sm:text-base font-black text-black group-hover:text-[var(--careers-accent)] transition-colors duration-300">
            {item.q}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isOpen ? 'bg-[var(--careers-accent)] text-white' : 'bg-[#F5F5F5] text-black group-hover:bg-[var(--careers-accent)] group-hover:text-white'
            }`}
          >
            <Plus size={16} strokeWidth={2.5} />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="pb-5 pr-12 text-[13.5px] sm:text-[14.5px] text-[#595959] leading-relaxed font-medium">
                {item.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StaggerItem>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl mx-auto text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
            <SplitText text={`${FAQ_DATA.titlePrefix}${FAQ_DATA.titleItalic}${FAQ_DATA.titleSuffix}`} />
          </h2>
          <p className="text-[15px] sm:text-base text-[#595959] leading-relaxed font-medium">{FAQ_DATA.subtitle}</p>
        </Reveal>

        <StaggerGroup className="mt-12">
          {FAQ_DATA.items.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
