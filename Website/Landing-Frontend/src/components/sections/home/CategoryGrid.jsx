import { ArrowUpRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { CATEGORY_DATA } from '../../../lib/content'
import { EMPLOYEE_APP_URL } from '../../../lib/config'
import { buildJobsUrl } from '../../../lib/jobsUrl'

function categoryHref(cat) {
  if (cat.browseCategory) return `${EMPLOYEE_APP_URL}/app/jobs?category=${encodeURIComponent(cat.browseCategory)}`
  if (cat.searchParams) return buildJobsUrl(cat.searchParams)
  return `${EMPLOYEE_APP_URL}/app/jobs`
}

export default function CategoryGrid() {
  return (
    <section id="categories" className="bg-(--jobs-bg-subtle) py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="max-w-xl mb-9">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-(--jobs-navy) tracking-tight">{CATEGORY_DATA.title}</h2>
          <p className="mt-2 text-[15px] text-(--jobs-ink-soft)">{CATEGORY_DATA.subtitle}</p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {CATEGORY_DATA.categories.map((cat) => {
            const Icon = cat.icon
            return (
              <StaggerItem key={cat.title}>
                <a
                  href={categoryHref(cat)}
                  className="group flex flex-col gap-3 h-full bg-white border border-(--jobs-border) rounded-xl p-4 hover:border-(--jobs-teal-dark) hover:shadow-sm hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--jobs-teal-dark) transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-(--jobs-teal-tint) flex items-center justify-center text-(--jobs-teal-dark) group-hover:bg-(--jobs-teal-dark) group-hover:text-white transition-colors">
                      <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-(--jobs-ink-soft) opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-[14px] text-(--jobs-navy)">{cat.title}</span>
                    <span className="block text-[12.5px] text-(--jobs-ink-soft)">{cat.count} openings</span>
                  </div>
                </a>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
