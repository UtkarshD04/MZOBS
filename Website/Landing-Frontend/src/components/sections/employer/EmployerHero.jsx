import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import MagneticButton from '../../ui/MagneticButton'

export default function EmployerHero() {
  return (
    <section id="home" className="relative bg-white pt-19">
      <div className="relative max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
        <Reveal direction="up" delay={0} duration={0.6}>
          <span className="block text-[12.5px] font-bold uppercase tracking-[0.14em] text-(--jobs-teal-dark) mb-5">
            For Employers
          </span>
        </Reveal>

        <h1 className="text-4xl sm:text-5xl md:text-[52px] font-black text-(--jobs-navy) leading-[1.08] tracking-tight">
          <SplitText text="Hire Verified Talent," className="justify-center" />
          <br />
          <SplitText text="Not A Stack Of Unread Resumes." delay={0.15} className="justify-center" wordClassName="text-(--jobs-teal-dark)" />
        </h1>

        <Reveal direction="up" delay={0.35} duration={0.7}>
          <p className="mt-6 text-base sm:text-lg text-(--jobs-ink-soft) max-w-xl mx-auto leading-relaxed font-medium">
            Connect with verified talent and discover candidates relevant to your requirements — all within a
            hiring ecosystem built for better employer–candidate connections.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.45} duration={0.7}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              <Link
                to="/employers/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-(--jobs-teal-dark) text-white text-sm font-bold hover:bg-(--jobs-navy) transition-colors"
              >
                Create your account <ArrowRight size={16} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to="/employers/signin"
                className="inline-flex items-center px-6 py-3 rounded-full bg-transparent text-(--jobs-navy) text-sm font-bold border border-(--jobs-border) hover:border-(--jobs-navy) transition-colors"
              >
                Sign in
              </Link>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
