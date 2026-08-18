import { Link } from 'react-router-dom'
import { Sparkles, ShieldCheck, Target } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SectionLabel from '../components/ui/SectionLabel'
import FloatingElement from '../components/ui/FloatingElement'
import EmployeeSigninForm from '../components/forms/EmployeeSigninForm'

const PERKS = [
  { icon: ShieldCheck, text: 'Every employer on Mzobs is verified before their openings go live.' },
  { icon: Sparkles, text: 'A real recruiter rebuilds your resume and runs mock interviews with you.' },
  { icon: Target, text: 'Get matched to roles based on your verified skills, not keyword luck.' }
]

export default function EmployeeSignin() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <title>Sign In — Mzobs</title>
      <Navbar />

      <section id="home" className="relative bg-white pt-[76px] overflow-hidden">
        <FloatingElement duration={9} distance={16} className="absolute top-24 right-[8%] w-64 h-64 rounded-full bg-[#F5F5F5] blur-3xl pointer-events-none" />
        <FloatingElement duration={11} delay={1.5} distance={20} className="absolute bottom-10 left-[4%] w-72 h-72 rounded-full bg-[var(--careers-cyan-soft)]/40 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: pitch */}
          <div className="lg:col-span-6">
            <SectionLabel>For Job Seekers</SectionLabel>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black leading-[1.1] tracking-tight">
              Welcome Back To Your <span className="text-[#333333]">Placement</span> Journey.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[#595959] max-w-md leading-relaxed font-medium">
              Sign in to check your application status, continue your resume review, and pick up mock interview prep where you left off.
            </p>

            <ul className="mt-8 space-y-4">
              {PERKS.map((perk, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-black shrink-0">
                    <perk.icon size={17} strokeWidth={1.8} />
                  </div>
                  <p className="text-sm text-[#595959] font-medium leading-relaxed pt-1.5">{perk.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: signin card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl shadow-xl p-7 sm:p-9 border border-[#e0e0e0]">
              <h2 className="text-xl font-black text-black">Sign in to your account</h2>
              <p className="text-[13.5px] text-[#595959] mt-1 mb-6">
                Don't have one yet?{' '}
                <Link to="/employees/signup" className="font-bold text-black hover:text-[#333333] transition-colors">
                  Create free account
                </Link>
              </p>

              <EmployeeSigninForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
