import { Link } from 'react-router-dom'
import { Briefcase, CalendarCheck2, ShieldCheck } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SectionBadge from '../components/ui/SectionBadge'
import EmployerSignupForm from '../components/forms/EmployerSignupForm'

const PERKS = [
  { icon: ShieldCheck, text: 'Every candidate you receive has already cleared our screening and resume review.' },
  { icon: Briefcase, text: 'Fill dozens of roles at once with a single hiring pipeline, not scattered spreadsheets.' },
  { icon: CalendarCheck2, text: 'Track interviews, offers and billing from one dashboard, always up to date.' }
]

export default function EmployerSignup() {
  return (
    <div className="min-h-screen bg-bg">
      <title>Create Your Employer Account — Mzobs</title>
      <Navbar />

      {/* Slim dark backdrop so the navbar (built for a dark hero) stays legible */}
      <div className="h-28 bg-[#0B1220]" />

      <section className="bg-[#EEF3F8] px-6 md:px-12 pt-12 pb-20 md:pb-28 border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: pitch */}
          <div className="space-y-8">
            <SectionBadge label="For Employers" />

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-medium leading-[1.15] tracking-tight text-[#0B1220]">
              Hire Verified Talent, <em className="italic font-serif text-blue-900">Not</em> A Stack Of Resumes.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-md">
              Create your free employer account and share your first requirement in minutes — no sales call required.
            </p>

            <ul className="space-y-4 pt-2">
              {PERKS.map((perk, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-blue-800 shrink-0">
                    <perk.icon size={17} strokeWidth={1.8} />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pt-1.5">{perk.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: signup card */}
          <div className="bg-white rounded-3xl shadow-md p-7 sm:p-9 border border-slate-200/60">
            <h2 className="text-xl font-bold tracking-tight text-[#0B1220]">Create your employer account</h2>
            <p className="text-[13.5px] text-slate-600 mt-1 mb-6">
              Already have one?{' '}
              <Link to="/employers/signin" className="font-semibold text-[#0B1220] hover:text-blue-800 transition-colors">
                Sign in
              </Link>
            </p>

            <EmployerSignupForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
