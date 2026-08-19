import { ArrowRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SectionLabel from '../../ui/SectionLabel'
import SplitText from '../../ui/SplitText'
import ParallaxImage from '../../ui/ParallaxImage'
import { OUR_VISION_DATA } from '../../../lib/content'

export default function AboutStorySection() {
  return (
    <section id="our-story" className="bg-[#F5F5F5] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Copy Card */}
        <Reveal direction="left" duration={0.9} scale={0.94} blur className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-12 border border-[#e0e0e0] shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between space-y-8">
          <div className="space-y-5">
            <SectionLabel tone="gray">{OUR_VISION_DATA.badge}</SectionLabel>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
              <SplitText text={OUR_VISION_DATA.heading} />
            </h2>
            <p className="text-[15px] sm:text-base text-[#595959] leading-relaxed font-medium">
              {OUR_VISION_DATA.desc}
            </p>
          </div>

          <div>
            <a
              href={OUR_VISION_DATA.ctaHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--careers-accent)] text-white text-sm font-bold border border-[var(--careers-accent)] hover:bg-white hover:text-[#595959] hover:border-[#666] transition-colors"
            >
              {OUR_VISION_DATA.ctaText} <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>

        {/* Right: Photo Card */}
        <Reveal direction="right" delay={0.15} duration={1} scale={0.9} blur className="lg:col-span-6 min-h-[320px] sm:min-h-[420px] rounded-3xl overflow-hidden shadow-md border border-[#e0e0e0] group bg-[#e6e6e6]">
          <ParallaxImage
            src={OUR_VISION_DATA.image}
            alt="Where Mzobs is going"
            offset={16}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
        </Reveal>
      </div>
    </section>
  )
}
