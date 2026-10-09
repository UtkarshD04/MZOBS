import { Sparkles, Briefcase, CalendarCheck2 } from 'lucide-react'
import Seo from '../../Seo'
import EmployerNavbar from '../../layout/EmployerNavbar'
import EmployerFooter from '../../layout/EmployerFooter'
import { FadeInLoad } from './employerMotion'

const PERKS = [
  { icon: Sparkles, text: 'Candidates arrive ranked by how well they match your requirement.' },
  { icon: Briefcase, text: 'Fill dozens of roles with one hiring pipeline, not scattered spreadsheets.' },
  { icon: CalendarCheck2, text: 'Track interviews, offers and billing from one dashboard.' },
]

// Shared shell for the employer sign in / sign up pages: brand panel on the
// left, a single focused form card on the right.
export default function EmployerAuthLayout({ seoPath, seoTitle, heading, accent, subtext, children }) {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans antialiased selection:bg-teal-200">
      <Seo path={seoPath} title={seoTitle} noindex />
      <EmployerNavbar />

      <main className="pt-[76px] bg-[#f4faf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-14 grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <FadeInLoad delay={0.05} className="lg:col-span-5">
            <div className="relative h-full overflow-hidden rounded-[28px] bg-[#075f55] text-white p-8 sm:p-10 flex flex-col justify-between min-h-[320px]">
              <div aria-hidden="true" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10" />
              <div aria-hidden="true" className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full border border-white/15" />

              <div className="relative">
                <h1 className="font-sans text-[34px] sm:text-[42px] font-bold leading-[1.02] tracking-[-0.035em]">
                  {heading} <em className="font-sans font-normal text-[#b8f0e2]">{accent}</em>
                </h1>
                <p className="mt-4 text-[15px] leading-relaxed text-white/75 max-w-sm">{subtext}</p>
              </div>

              <ul className="relative mt-10 hidden sm:block space-y-4">
                {PERKS.map((perk) => (
                  <li key={perk.text} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/12 border border-white/20 flex items-center justify-center shrink-0">
                      <perk.icon size={16} strokeWidth={1.8} />
                    </div>
                    <p className="text-[13.5px] text-white/80 leading-relaxed pt-1.5">{perk.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInLoad>

          <FadeInLoad delay={0.12} className="lg:col-span-7">
            <div className="h-full bg-white rounded-[28px] border border-[#111827]/10 shadow-[0_20px_50px_-24px_rgba(7,95,85,0.35)] p-6 sm:p-10 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">{children}</div>
            </div>
          </FadeInLoad>
        </div>
      </main>

      <EmployerFooter />
    </div>
  )
}
