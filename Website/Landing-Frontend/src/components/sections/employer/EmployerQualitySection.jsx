import { Check, CheckCircle2, FileText } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import TiltCard from '../../ui/TiltCard'
import FloatingElement from '../../ui/FloatingElement'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { EMPLOYER_QUALITY_POINTS } from '../../../lib/content'

const PIPELINE_STEPS = ['Resume screened', 'Skills tested', 'Mock interview done', 'Ready to hire']

export default function EmployerQualitySection() {
  return (
    <section id="quality" className="relative bg-(--jobs-blue-tint) py-16 md:py-24 px-6 md:px-12 overflow-hidden">
      <FloatingElement duration={10} distance={14} className="absolute -top-10 right-[6%] w-56 h-56 rounded-full bg-white/50 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: promise + checklist */}
        <div className="lg:col-span-7">
          <Reveal direction="up" duration={0.8} scale={0.95} blur>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-(--jobs-navy) tracking-tight leading-tight">
              <SplitText text="No Fake Resumes." />
              <br />
              <SplitText text="Only Verified, Job-Ready Talent." delay={0.15} wordClassName="text-(--jobs-teal-dark)" />
            </h2>
            <p className="mt-4 text-[15px] sm:text-base text-(--jobs-ink-soft) max-w-xl leading-relaxed font-medium">
              We don't forward resume dumps. Every candidate on Mzobs is personally screened, skill-tested and interviewed by our team before they ever reach your dashboard.
            </p>
          </Reveal>

          <StaggerGroup className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-7">
            {EMPLOYER_QUALITY_POINTS.map((point) => {
              const Icon = point.icon
              return (
                <StaggerItem key={point.title} className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 border border-(--jobs-border)">
                    <Icon size={18} strokeWidth={1.8} className="text-(--jobs-teal-dark)" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black text-(--jobs-navy) leading-snug mb-1">{point.title}</h3>
                    <p className="text-[13px] text-(--jobs-ink-soft) leading-relaxed">{point.desc}</p>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </div>

        {/* Right: verification pipeline card */}
        <div className="lg:col-span-5">
          <Reveal direction="right" duration={0.9} delay={0.15} scale={0.94} blur>
            <TiltCard maxTilt={3} y={-6}>
              <div className="rounded-3xl border border-(--jobs-border) bg-white p-8 shadow-xl">
                <div className="relative w-14 h-14 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-(--jobs-teal-tint) flex items-center justify-center">
                    <FileText size={24} strokeWidth={1.8} className="text-(--jobs-teal-dark)" />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-(--jobs-teal-dark) border-2 border-white flex items-center justify-center">
                    <Check size={12} strokeWidth={3.5} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-(--jobs-navy) tracking-tight leading-snug">Every Candidate, Verified</h3>
                <p className="mt-1.5 text-sm font-bold text-(--jobs-ink-soft)">Resumes manually checked before you ever see them</p>

                <div className="mt-7 space-y-3.5 border-t border-(--jobs-border) pt-6">
                  {PIPELINE_STEPS.map((step) => (
                    <div key={step} className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-(--jobs-teal-dark) flex-shrink-0" />
                      <span className="text-[13.5px] font-semibold text-(--jobs-navy)">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
