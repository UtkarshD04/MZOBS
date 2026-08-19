import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../../ui/Reveal'
import ParallaxImage from '../../ui/ParallaxImage'
import FloatingElement from '../../ui/FloatingElement'
import { CTA_BAND_DATA } from '../../../lib/content'

export default function EmployeeCTABand() {
  return (
    <section id="contact" className="bg-[#F5F5F5] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[400px] sm:min-h-[440px] rounded-[32px] overflow-hidden shadow-xl border border-[#e0e0e0] group bg-gradient-to-br from-[#eef3ea] to-[#f7f2e6]"
        >
          <ParallaxImage
            src={CTA_BAND_DATA.bgImage}
            alt="Ready to start your placement journey"
            offset={50}
            className="w-full h-full absolute inset-0 object-cover object-center opacity-[0.16] group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#eef3ea] via-[#eef3ea]/85 to-[#f7f2e6]/60 pointer-events-none" />
          <FloatingElement duration={7} distance={24} className="absolute top-10 right-10 w-72 h-72 bg-[var(--careers-accent)]/10 rounded-full blur-3xl pointer-events-none" />
          <FloatingElement duration={9} distance={18} className="absolute bottom-16 left-10 w-56 h-56 bg-[#e8a87c]/20 rounded-full blur-3xl pointer-events-none" />

          <Reveal direction="up" delay={0.15} duration={0.9} scale={0.94} blur className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-14 max-w-2xl space-y-5">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-tight">
              Ready To Start Your Placement Journey?
            </h2>
            <p className="text-sm sm:text-base text-[#595959] leading-relaxed font-medium max-w-xl">
              Free to join. Verified by our operations team before anything reaches an employer.
            </p>
            <div className="pt-2">
              <Link
                to="/employees/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--careers-accent)] text-white text-sm font-bold hover:bg-[var(--careers-accent-hover)] transition-colors"
              >
                Create free account <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  )
}
