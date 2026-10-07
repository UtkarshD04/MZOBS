import { Link } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import Seo from '../components/Seo'
import EmployerNavbar from '../components/layout/EmployerNavbar'
import EmployerFooter from '../components/layout/EmployerFooter'
import { FadeInLoad } from '../components/sections/employer/employerMotion'
import EmployerResetPasswordForm from '../components/forms/EmployerResetPasswordForm'

export default function EmployerResetPassword() {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans antialiased selection:bg-teal-200">
      <Seo path="/employers/reset-password" title="Reset Password | Mzobs" noindex />
      <EmployerNavbar />

      <section id="home" className="relative overflow-hidden pt-[76px]">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#075f55]" />
        <div aria-hidden="true" className="absolute left-1/2 top-16 h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-[#111827]/10 pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#b8d6d0]/60 blur-3xl pointer-events-none" />

        <div className="relative max-w-md mx-auto px-6 py-16 md:py-24">
          <FadeInLoad delay={0.1}>
            <div className="bg-[#e7f5f1] rounded-[28px] border border-[#111827]/10 shadow-[10px_12px_0_#111827] p-7 sm:p-9">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound size={18} className="text-[#075f55]" />
                <h2 className="font-sans text-2xl font-bold text-[#111827]">Set a new password</h2>
              </div>
              <p className="text-[13.5px] text-[#667085] mt-1 mb-6">
                <Link to="/employers/signin" className="font-bold text-[#111827] hover:text-[#075f55] transition-colors">
                  Back to sign in
                </Link>
              </p>

              <EmployerResetPasswordForm />
            </div>
          </FadeInLoad>
        </div>
      </section>

      <EmployerFooter />
    </div>
  )
}
