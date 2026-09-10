import { FadeInView } from './employerMotion'
import { TRUSTED_LOGOS_DATA } from '../../../lib/content'

export default function EmployerLogosSection() {
  return (
    <section id="companies" className="bg-[#F7F9FC] py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <FadeInView className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#16324F] tracking-tight">
            {TRUSTED_LOGOS_DATA.title}
          </h2>
        </FadeInView>

        <FadeInView delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14">
          {TRUSTED_LOGOS_DATA.logos.map((logo) => (
            <div key={logo.name} className="group relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md bg-[#16324F] text-white text-[11px] font-semibold opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none">
                {logo.name}
              </div>
              <img
                src={logo.logo}
                alt={logo.name}
                className="h-8 sm:h-9 max-w-[120px] object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </FadeInView>
      </div>
    </section>
  )
}
