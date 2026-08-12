import { Link } from 'react-router-dom'
import { Sparkles, ShieldCheck, Target } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SectionBadge from '../components/ui/SectionBadge'
import EmployeeSignupForm from '../components/forms/EmployeeSignupForm'

const PERKS = [
  { icon: ShieldCheck, text: 'Every employer on Mzobs is verified before their openings go live.' },
  { icon: Sparkles, text: 'A real recruiter rebuilds your resume and runs mock interviews with you.' },
  { icon: Target, text: 'Get matched to roles based on your verified skills, not keyword luck.' }
]

export default function EmployeeSignup() {
  return (
    <div className="min-h-screen bg-bg">
      <title>Create Your Account — Mzobs</title>
      <Navbar />

      {/* Slim dark backdrop so the navbar (built for a dark hero) stays legible */}
      <div className="h-28 bg-[#0B1220]" />

      <section className="bg-[#EEF3F8] px-6 md:px-12 pt-12 pb-20 md:pb-28 border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: pitch */}
          <div className="space-y-8">
            <SectionBadge label="For Job Seekers" />

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-medium leading-[1.15] tracking-tight text-[#0B1220]">
              Your Placement Journey <em className="italic font-serif text-blue-900">Starts</em> Here.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-md">
              One-time ₹99 for lifetime access. Verified resumes, guided training and real mock interviews — everything between job hunting and placed.
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
            <h2 className="text-xl font-bold tracking-tight text-[#0B1220]">Create your free account</h2>
            <p className="text-[13.5px] text-slate-600 mt-1 mb-6">
              Do you have an account?{' '}
              <Link to="/employees/signin" className="font-semibold text-[#0B1220] hover:text-blue-800 transition-colors">
                Sign in
              </Link>
            </p>

            <EmployeeSignupForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
