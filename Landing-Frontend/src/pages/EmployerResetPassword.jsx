import { Link } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SectionLabel from '../components/ui/SectionLabel'
import FloatingElement from '../components/ui/FloatingElement'
import EmployerResetPasswordForm from '../components/forms/EmployerResetPasswordForm'

export default function EmployerResetPassword() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <title>Reset Password — Mzobs</title>
      <Navbar />

      <section id="home" className="relative bg-white pt-[76px] overflow-hidden">
        <FloatingElement duration={9} distance={16} className="absolute top-24 right-[8%] w-64 h-64 rounded-full bg-[#F5F5F5] blur-3xl pointer-events-none" />
        <FloatingElement duration={11} delay={1.5} distance={20} className="absolute bottom-10 left-[4%] w-72 h-72 rounded-full bg-[var(--careers-cyan-soft)]/40 blur-3xl pointer-events-none" />

        <div className="relative max-w-md mx-auto px-6 py-16 md:py-24">
          <div className="bg-white rounded-3xl shadow-xl p-7 sm:p-9 border border-[#e0e0e0]">
            <SectionLabel>For Employers</SectionLabel>
            <div className="flex items-center gap-2 mb-1">
              <KeyRound size={18} className="text-black" />
              <h2 className="text-xl font-black text-black">Set a new password</h2>
            </div>
            <p className="text-[13.5px] text-[#595959] mt-1 mb-6">
              <Link to="/employers/signin" className="font-bold text-black hover:text-[#333333] transition-colors">
                Back to sign in
              </Link>
            </p>

            <EmployerResetPasswordForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
