import { useRef } from 'react'
import { useInView } from 'framer-motion'
import Reveal from '../../ui/Reveal'
import SectionLabel from '../../ui/SectionLabel'
import SplitText from '../../ui/SplitText'
import CountUp from '../../ui/CountUp'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { WHO_WE_ARE_DATA } from '../../../lib/content'

const TINTS = ['bg-[var(--careers-tint-blue)]', 'bg-[var(--careers-tint-sage)]', 'bg-[var(--careers-tint-sand)]', 'bg-[var(--careers-tint-rose)]']

function parseStat(str) {
  const match = String(str).match(/^([^\d]*)([\d,]+)(.*)$/)
  if (!match) return { prefix: '', value: 0, suffix: str }
  const [, prefix, digits, suffix] = match
  return { prefix, value: parseInt(digits.replace(/,/g, ''), 10) || 0, suffix }
}

function StatNumber({ number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const { prefix, value, suffix } = parseStat(number)

  return (
    <span ref={ref} className="text-4xl sm:text-[40px] font-black text-black tracking-tight">
      {inView ? <CountUp value={value} prefix={prefix} suffix={suffix} duration={1600} /> : `${prefix}0${suffix}`}
    </span>
  )
}

export default function StatsTimeline() {
  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl mx-auto text-center">
          <SectionLabel className="mx-auto">Our Numbers</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
            <SplitText text="Mzobs, By The Numbers" className="justify-center" />
          </h2>
        </Reveal>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHO_WE_ARE_DATA.stats.map((stat, i) => (
            <StaggerItem key={stat.label} className="h-full">
              <div className={`rounded-3xl p-6 h-full flex flex-col justify-between min-h-[190px] border border-black/[0.04] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${TINTS[i % TINTS.length]}`}>
                <StatNumber number={stat.number} />
                <span className="text-[12.5px] font-bold text-black/70 leading-snug">{stat.label}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
