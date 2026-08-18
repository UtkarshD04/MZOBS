import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../../ui/Reveal'
import ParallaxImage from '../../ui/ParallaxImage'
import FloatingElement from '../../ui/FloatingElement'
import { CTA_BAND_DATA } from '../../../lib/content'

export default function AboutCTABand() {
  return (
    <section id="contact" className="bg-[#F5F5F5] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[400px] sm:min-h-[440px] rounded-[32px] overflow-hidden shadow-2xl border border-[#e0e0e0] group bg-black"
        >
          <ParallaxImage
            src={CTA_BAND_DATA.bgImage}
            alt="Ready to get started with Mzobs"
            offset={50}
            className="w-full h-full absolute inset-0 object-cover object-center brightness-[0.55] group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent pointer-events-none" />
          <FloatingElement duration={7} distance={24} className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <Reveal direction="up" delay={0.15} duration={0.9} scale={0.94} blur className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-14 max-w-2xl space-y-5">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {CTA_BAND_DATA.titlePrefix}
              <em className="italic">{CTA_BAND_DATA.titleItalic}</em>
              {CTA_BAND_DATA.titleSuffix}
            </h2>
            <p className="text-sm sm:text-base text-white/75 leading-relaxed font-medium max-w-xl">
              {CTA_BAND_DATA.desc}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/employees"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black text-sm font-bold hover:bg-[#F5F5F5] transition-colors"
              >
                For Employees <ArrowRight size={16} />
              </Link>
              <Link
                to="/employers"
                className="inline-flex items-center px-7 py-3.5 rounded-full border border-white/30 text-white text-sm font-bold hover:bg-white/10 transition-colors"
              >
                For Employers
              </Link>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  )
}
