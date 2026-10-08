import { ArrowUpRight, Briefcase, MapPin, Laptop, IndianRupee, GraduationCap, FileText } from 'lucide-react'
import { FadeInView } from './employerMotion'
import ExplorerButton from '../../ui/ExplorerButton'

// Mirrors the real fields captured by the job-posting form (Backend Job
// model: title, department, employmentType, experience range, salary range,
// location, workMode, skills, description) — shown empty, since this is a
// preview of the form's shape, not a claim about any real job.
const FIELDS = [
  { label: 'Job title', icon: Briefcase },
  { label: 'Location', icon: MapPin },
  { label: 'Work mode', icon: Laptop },
  { label: 'Experience', icon: GraduationCap },
  { label: 'Salary range', icon: IndianRupee },
  { label: 'Required skills', icon: FileText },
]

export default function EmployerJobPostingPreview() {
  return (
    <section className="bg-(--explorer-bg) py-20 md:py-28 px-6 md:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <FadeInView>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[44px] font-bold text-(--explorer-navy) tracking-tight leading-[1.05]">
            Turn Your Requirement Into an Opportunity.
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-(--explorer-muted)">
            Share the role, must-have skills, location and budget, and Mzobs turns it into a live posting candidates can find and apply to.
          </p>
          <ExplorerButton to="/employers/signup" size="lg" className="mt-9">
            Post a Job <ArrowUpRight size={16} />
          </ExplorerButton>
        </FadeInView>

        <FadeInView delay={0.1}>
          <div className="mx-auto max-w-[480px] rounded-[28px] border border-(--explorer-border) bg-white p-6 sm:p-8 shadow-[0_30px_60px_-30px_rgba(16,50,79,0.25)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-(--explorer-muted)">New job posting</p>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {FIELDS.map((field) => (
                <div key={field.label} className="flex items-center gap-2.5 rounded-xl border border-(--explorer-border) bg-(--explorer-bg) px-3 py-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white border border-(--explorer-border) text-(--explorer-blue)">
                    <field.icon size={13} />
                  </span>
                  <span className="text-[12px] font-semibold text-(--explorer-navy)/40 truncate">{field.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-2.5 rounded-xl border border-dashed border-(--explorer-border) px-3.5 py-4">
              <span className="text-[12px] font-semibold text-(--explorer-navy)/40">Job description</span>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
