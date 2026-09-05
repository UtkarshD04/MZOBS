import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../../ui/Reveal'
import ParallaxImage from '../../ui/ParallaxImage'
import FloatingElement from '../../ui/FloatingElement'
import { CTA_BAND_DATA } from '../../../lib/content'

export default function EmployerCTABand() {
  return (
    <section id="contact" className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[400px] sm:min-h-[440px] rounded-[32px] overflow-hidden shadow-xl border border-(--jobs-border) group bg-gradient-to-br from-(--jobs-navy-deep) to-(--jobs-navy)"
        >
          <ParallaxImage
            src={CTA_BAND_DATA.bgImage}
            alt="Ready to hire your next verified candidate"
            offset={50}
            className="w-full h-full absolute inset-0 object-cover object-center opacity-[0.16] group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-(--jobs-navy-deep) via-(--jobs-navy-deep)/85 to-(--jobs-navy)/60 pointer-events-none" />
          <FloatingElement duration={7} distance={24} className="absolute top-10 right-10 w-72 h-72 bg-(--jobs-teal)/15 rounded-full blur-3xl pointer-events-none" />
          <FloatingElement duration={9} distance={18} className="absolute bottom-16 left-10 w-56 h-56 bg-(--jobs-gold)/20 rounded-full blur-3xl pointer-events-none" />

          <Reveal direction="up" delay={0.15} duration={0.9} scale={0.94} blur className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-14 max-w-2xl space-y-5">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Ready To Hire Your Next Verified Candidate?
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-medium max-w-xl">
              Create your free employer account in minutes, or sign in if you already have one.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/employers/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-(--jobs-teal) text-(--jobs-navy-deep) text-sm font-bold hover:bg-white transition-colors"
              >
                Create your account <ArrowRight size={16} />
              </Link>
              <Link
                to="/employers/signin"
                className="inline-flex items-center px-7 py-3.5 rounded-full border border-white/25 bg-white/10 text-white text-sm font-bold hover:border-(--jobs-teal) hover:bg-white/15 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  )
}
