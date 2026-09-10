import { Link } from 'react-router-dom'
import { Briefcase, CalendarCheck2, ShieldCheck } from 'lucide-react'
import Seo from '../components/Seo'
import EmployerNavbar from '../components/layout/EmployerNavbar'
import EmployerFooter from '../components/layout/EmployerFooter'
import { FadeInLoad } from '../components/sections/employer/employerMotion'
import EmployerAuthTrustPanel from '../components/sections/employer/EmployerAuthTrustPanel'
import EmployerSigninForm from '../components/forms/EmployerSigninForm'

const PERKS = [
  { icon: ShieldCheck, text: 'Every candidate you receive has already cleared our screening and resume review.' },
  { icon: Briefcase, text: 'Fill dozens of roles at once with a single hiring pipeline, not scattered spreadsheets.' },
  { icon: CalendarCheck2, text: 'Track interviews, offers and billing from one dashboard, always up to date.' }
]

export default function EmployerSignin() {
  return (
    <div className="min-h-screen bg-[#F5F6F4] text-[#20251F] font-sans antialiased selection:bg-[#DDE6DF]">
      <Seo path="/employers/signin" title="Employer Sign In — Mzobs" noindex />
      <EmployerNavbar />

      <section id="home" className="relative overflow-hidden pt-[76px]">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#246B5A]" />
        <div aria-hidden="true" className="absolute left-[45%] top-20 h-[500px] w-[500px] rounded-full border border-[#20251F]/10 pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#DDE6DF]/60 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: pitch */}
          <div className="lg:col-span-6">
            <FadeInLoad delay={0.08}>
              <h1 className="mt-6 font-serif text-[42px] sm:text-5xl md:text-[60px] font-bold leading-[0.96] tracking-[-0.04em] text-[#20251F]">
                Welcome Back To Your <em className="font-serif font-normal text-[#246B5A]">Hiring</em> Portal.
              </h1>
            </FadeInLoad>

            <FadeInLoad delay={0.16}>
              <p className="mt-6 text-base sm:text-lg text-[#526051] max-w-md leading-relaxed">
                Sign in to review your requirements, screen candidates and manage interviews, offers and billing.
              </p>
            </FadeInLoad>

            <FadeInLoad delay={0.22}>
              <ul className="mt-8 space-y-4">
                {PERKS.map((perk, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#20251F]/10 flex items-center justify-center text-[#246B5A] shrink-0">
                      <perk.icon size={17} strokeWidth={1.8} />
                    </div>
                    <p className="text-sm text-[#526051] leading-relaxed pt-1.5">{perk.text}</p>
                  </li>
                ))}
              </ul>
            </FadeInLoad>

            <EmployerAuthTrustPanel />
          </div>

          {/* Right: signin card */}
          <FadeInLoad delay={0.18} className="lg:col-span-6">
            <div className="bg-[#FAF7F1] rounded-[28px] border border-[#20251F]/10 shadow-[10px_12px_0_#20251F] p-7 sm:p-9">
              <h2 className="font-serif text-2xl font-bold text-[#20251F]">Sign in to your portal</h2>
              <p className="text-[13.5px] text-[#526051] mt-1 mb-6">
                New to Mzobs?{' '}
                <Link to="/employers/signup" className="font-bold text-[#20251F] hover:text-[#246B5A] transition-colors">
                  Create a free account
                </Link>
              </p>

              <EmployerSigninForm />
            </div>
          </FadeInLoad>
        </div>
      </section>

      <EmployerFooter />
    </div>
  )
}
