import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../../ui/Reveal'
import { HOME_EMPLOYER_CTA_DATA } from '../../../lib/content'

export default function HomeEmployerCTA() {
  return (
    <section className="bg-(--jobs-navy-deep) py-14 md:py-16 px-6 md:px-10">
      <Reveal
        direction="up"
        duration={0.7}
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
      >
        <div>
          <h2 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight">{HOME_EMPLOYER_CTA_DATA.title}</h2>
          <p className="mt-2 text-[15px] text-white/70 max-w-lg">{HOME_EMPLOYER_CTA_DATA.subtitle}</p>
        </div>
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 350, damping: 18 }} className="shrink-0">
          <Link
            to={HOME_EMPLOYER_CTA_DATA.ctaTo}
            className="inline-flex items-center gap-2 h-12 px-7 rounded-lg bg-(--jobs-teal) text-(--jobs-navy-deep) text-[14.5px] font-bold hover:bg-white transition-colors"
          >
            {HOME_EMPLOYER_CTA_DATA.ctaText} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </Reveal>
    </section>
  )
}
