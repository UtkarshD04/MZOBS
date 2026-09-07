import { useEffect, useState } from 'react'
import { MapPin, Briefcase, Laptop, ShieldCheck, ArrowUpRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import SpotlightCard from '../../ui/SpotlightCard'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { fetchFeaturedJobs } from '../../../lib/publicJobs'
import { EMPLOYEE_APP_URL } from '../../../lib/config'

function experienceLabel(min, max) {
  if (!min && !max) return 'Fresher'
  if (min === max) return `${min} yrs`
  return `${min}–${max} yrs`
}

export default function HotJobsSection() {
  const [jobs, setJobs] = useState(null) // null = loading, [] = loaded empty
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchFeaturedJobs(8)
      .then((data) => {
        if (!cancelled) setJobs(data)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Nothing to show yet and nothing broken either — quietly skip the
  // section rather than showing an empty shell.
  if (!failed && jobs && jobs.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
            <SplitText text="Hot Jobs, Live Right Now" />
          </h2>
          <p className="mt-2 text-[15px] text-[#595959] leading-relaxed font-medium">
            A sample of verified openings currently sourcing on Mzobs.
          </p>
        </Reveal>

        {failed && <p className="text-sm text-[#9E9E9E] font-medium">Couldn't load live jobs right now — check back shortly.</p>}

        {jobs === null && !failed && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl p-5 h-[168px] bg-[#F5F5F5] animate-pulse" />
            ))}
          </div>
        )}

        {jobs && jobs.length > 0 && (
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <StaggerItem key={job.id}>
                <SpotlightCard
                  as="a"
                  href={`${EMPLOYEE_APP_URL}/app/jobs?highlight=${encodeURIComponent(job.id)}`}
                  glow="rgba(13,148,136,0.06)"
                  className="flex flex-col rounded-2xl p-6 h-full bg-white border border-[#e5e5e5] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--careers-accent)]/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-black text-black text-[16px] leading-snug">{job.title}</h3>
                    <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--careers-tint-sage)] text-[var(--careers-accent)] text-[10.5px] font-black">
                      <ShieldCheck size={11} />
                      Verified
                    </span>
                  </div>

                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F5F5] text-[11.5px] font-bold text-[#595959]">
                      <MapPin size={11} />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F5F5] text-[11.5px] font-bold text-[#595959]">
                      <Briefcase size={11} />
                      {experienceLabel(job.experienceMin, job.experienceMax)}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F5F5] text-[11.5px] font-bold text-[#595959]">
                      <Laptop size={11} />
                      {job.workMode}
                    </span>
                  </div>

                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-[#f0f0f0]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--careers-accent)] text-white text-[11.5px] font-black flex items-center justify-center">
                        {job.logo || job.company?.[0] || '?'}
                      </span>
                      <span className="text-[12.5px] font-bold text-[#595959] truncate">{job.company}</span>
                    </div>
                    <span className="shrink-0 text-[11px] font-bold text-[#9E9E9E]">{job.posted}</span>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}

        {jobs && jobs.length > 0 && (
          <Reveal direction="up" delay={0.1}>
            <a
              href={`${EMPLOYEE_APP_URL}/app/jobs`}
              className="inline-flex items-center gap-1.5 text-sm font-black text-black hover:text-[var(--careers-accent)] transition-colors"
            >
              See all openings
              <ArrowUpRight size={16} />
            </a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
