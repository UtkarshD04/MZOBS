import { Link } from 'react-router-dom'
import { Briefcase, CalendarCheck2, ShieldCheck, Sparkles } from 'lucide-react'
import Seo from '../components/Seo'
import EmployerNavbar from '../components/layout/EmployerNavbar'
import EmployerFooter from '../components/layout/EmployerFooter'
import { FadeInLoad } from '../components/sections/employer/employerMotion'
import EmployerAuthTrustPanel from '../components/sections/employer/EmployerAuthTrustPanel'
import EmployerSignupForm from '../components/forms/EmployerSignupForm'

const PERKS = [
  { icon: Sparkles, text: 'Candidates arrive ranked by how well they match your requirement.' },
  { icon: Briefcase, text: 'Fill dozens of roles at once with a single hiring pipeline, not scattered spreadsheets.' },
  { icon: CalendarCheck2, text: 'Track interviews, offers and billing from one dashboard, always up to date.' }
]

export default function EmployerSignup() {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans antialiased selection:bg-teal-200">
      <Seo path="/employers/signup" title="Create Your Employer Account | Mzobs" noindex />
      <EmployerNavbar />

      <section id="home" className="relative overflow-hidden pt-[76px]">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#075f55]" />
        <div aria-hidden="true" className="absolute left-[45%] top-20 h-[500px] w-[500px] rounded-full border border-[#111827]/10 pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#b8d6d0]/60 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: pitch */}
          <div className="lg:col-span-6">
            <FadeInLoad delay={0.08}>
              <h1 className="mt-6 font-sans text-[42px] sm:text-5xl md:text-[60px] font-bold leading-[0.96] tracking-[-0.04em] text-[#111827]">
                Hire Quality Talent, <em className="font-sans font-normal text-[#075f55]">Not</em> A Stack Of Resumes.
              </h1>
            </FadeInLoad>

            <FadeInLoad delay={0.16}>
              <p className="mt-6 text-base sm:text-lg text-[#667085] max-w-md leading-relaxed">
                Create your free employer account and share your first requirement in minutes, no sales call required.
              </p>
            </FadeInLoad>

            <FadeInLoad delay={0.22}>
              <ul className="mt-8 space-y-4">
                {PERKS.map((perk, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#111827]/10 flex items-center justify-center text-[#075f55] shrink-0">
                      <perk.icon size={17} strokeWidth={1.8} />
                    </div>
                    <p className="text-sm text-[#667085] leading-relaxed pt-1.5">{perk.text}</p>
                  </li>
                ))}
              </ul>
            </FadeInLoad>

            <FadeInLoad delay={0.3}>
              <p className="mt-10 text-xs font-semibold uppercase tracking-[0.13em] text-[#667085]">No resume dumps · Human-reviewed profiles · Direct hiring workflow</p>
            </FadeInLoad>

            <EmployerAuthTrustPanel delay={0.38} />
          </div>

          {/* Right: signup card */}
          <FadeInLoad delay={0.18} className="lg:col-span-6">
            <div className="bg-[#e7f5f1] rounded-[28px] border border-[#111827]/10 shadow-[10px_12px_0_#111827] p-7 sm:p-9">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#075f55]/25 bg-white px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#075f55] mb-4">
                <ShieldCheck size={12} /> Mzobs for employers
              </span>
              <h2 className="font-sans text-[26px] tracking-tight font-bold text-[#111827]">Create your employer account</h2>
              <p className="text-[13.5px] text-[#667085] mt-1 mb-6">
                Already have one?{' '}
                <Link to="/employers/signin" className="font-bold text-[#111827] hover:text-[#075f55] transition-colors">
                  Sign in
                </Link>
              </p>

              <EmployerSignupForm />

              <p className="mt-6 pt-5 border-t border-[#111827]/10 text-center text-[12px] text-[#667085]">Free to start · No credit card · No sales call</p>
            </div>
          </FadeInLoad>
        </div>
      </section>

      <EmployerFooter />
    </div>
  )
}
