import { Quote } from 'lucide-react'
import { FadeInView } from './employerMotion'
import { EMPLOYER_TESTIMONIAL } from '../../../lib/content'

export default function EmployerTestimonialSection() {
  const t = EMPLOYER_TESTIMONIAL
  return (
    <section className="bg-[#f7f9fb] py-16 md:py-20 px-6 md:px-12">
      <FadeInView className="max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-[#e8f8f5] text-[#0a6f64] mb-6">
          <Quote size={20} />
        </span>
        <p className="text-xl sm:text-2xl font-semibold text-[#102a43] leading-snug tracking-tight">"{t.quote}"</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <img src={t.image} alt={t.name} className="h-11 w-11 rounded-full object-cover border border-[#102a43]/10" />
          <div className="text-left">
            <p className="text-[13.5px] font-bold text-[#102a43]">{t.name}</p>
            <p className="text-[12px] text-[#51697e]">{t.title}</p>
          </div>
        </div>
      </FadeInView>
    </section>
  )
}
