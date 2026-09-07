import { ArrowUpRight, ArrowRight, Flame } from 'lucide-react'
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

// Cycled per row so the list reads as a curated palette rather than one
// flat teal chip repeated nine times — same "array of literal class strings"
// technique LatestJobs.jsx uses for its LOGO_TONES, kept to the page's own
// --jobs-* palette.
const TONES = [
  'bg-(--jobs-teal-tint) text-(--jobs-teal-dark)',
  'bg-(--jobs-blue-tint) text-(--jobs-blue-dark)',
  'bg-(--jobs-gold-soft) text-(--jobs-navy)',
]

export default function CategoryGrid() {
  const totalOpenings = CATEGORY_DATA.categories.reduce((sum, c) => sum + c.count, 0)
  const maxCount = Math.max(...CATEGORY_DATA.categories.map((c) => c.count))
  // Pulls the busiest category out to headline its own spotlight tile —
  // everything else fills the compact list beside it, rather than every
  // category getting an identically-sized box.
  const featuredIndex = CATEGORY_DATA.categories.findIndex((c) => c.count === maxCount)
  const featured = CATEGORY_DATA.categories[featuredIndex]
  const rest = CATEGORY_DATA.categories.filter((_, i) => i !== featuredIndex)
  const FeaturedIcon = featured.icon

  return (
    <section id="categories" className="bg-(--jobs-bg-subtle) py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="max-w-xl mb-9">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-(--jobs-navy) tracking-tight">{CATEGORY_DATA.title}</h2>
          <p className="mt-2 text-[15px] text-(--jobs-ink-soft)">
            {CATEGORY_DATA.subtitle} {totalOpenings.toLocaleString('en-IN')} openings across {CATEGORY_DATA.categories.length} categories.
          </p>
        </Reveal>

        <Reveal direction="up" duration={0.7} delay={0.05} className="grid lg:grid-cols-5 gap-4">
          {/* Spotlight tile — the one category with the most openings, given
              real visual weight instead of blending into a uniform grid. */}
          <a
            href={categoryHref(featured)}
            className="group lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-80 rounded-3xl p-7 bg-linear-to-br from-(--jobs-navy) to-(--jobs-navy-deep) text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <FeaturedIcon
              size={220}
              strokeWidth={1}
              className="absolute -right-10 -bottom-10 text-white/10 rotate-12 pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/15">
                <Flame size={11} aria-hidden="true" /> Most in-demand
              </span>
              <div className="mt-6 w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <FeaturedIcon size={22} strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-3xl font-extrabold tracking-tight">{featured.title}</h3>
              <p className="mt-1.5 text-[14.5px] text-white/70">{featured.count} openings live right now</p>
            </div>

            <span className="relative inline-flex items-center gap-2 text-[14px] font-bold">
              Browse {featured.title.toLowerCase()} jobs
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-(--jobs-navy) group-hover:translate-x-1 transition-transform">
                <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </span>
          </a>

          {/* Everything else: a dense, scannable list rather than nine more
              boxes — each row inverts to a solid navy fill on hover instead
              of the border/shadow treatment used elsewhere on the page, so
              this section reads as its own thing. */}
          <StaggerGroup className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {rest.map((cat, i) => {
              const Icon = cat.icon
              const tone = TONES[i % TONES.length]
              return (
                <StaggerItem key={cat.title}>
                  <a
                    href={categoryHref(cat)}
                    className="group flex items-center gap-3 h-full bg-white rounded-2xl p-4 hover:bg-(--jobs-navy) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--jobs-teal-dark)"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tone}`}>
                      <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[13.5px] text-(--jobs-navy) group-hover:text-white truncate transition-colors">{cat.title}</p>
                      <p className="text-[12px] text-(--jobs-ink-soft) group-hover:text-white/60 transition-colors">{cat.count} openings</p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="shrink-0 text-white opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      aria-hidden="true"
                    />
                  </a>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </Reveal>
      </div>
    </section>
  )
}
