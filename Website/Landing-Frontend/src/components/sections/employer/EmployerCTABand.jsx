import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeInView } from './employerMotion'

export default function EmployerCTABand() {
  return (
    <section id="contact" className="bg-[#DDE6DF] py-20 md:py-28 px-6 md:px-12">
      <FadeInView className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#20251F] tracking-tight leading-tight">
          Ready to start hiring with more clarity?
        </h2>
        <p className="mt-4 text-base text-[#20251F]/75 leading-relaxed max-w-lg mx-auto">
          Create your free employer account and start receiving relevant applications today.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link
            to="/employers/signup"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[44px] rounded-full bg-[#20251F] text-[#FAF7F1] text-sm font-bold transition-all duration-200 hover:-translate-y-px"
          >
            Create employer account <ArrowRight size={16} />
          </Link>
          <Link
            to="/employers/signin"
            className="inline-flex items-center text-sm font-bold text-[#20251F]/75 hover:text-[#20251F] transition-colors"
          >
            Sign in to employer dashboard
          </Link>
        </div>
      </FadeInView>
    </section>
  )
}
