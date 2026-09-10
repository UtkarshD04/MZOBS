import { Link } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import Seo from '../components/Seo'
import EmployerNavbar from '../components/layout/EmployerNavbar'
import EmployerFooter from '../components/layout/EmployerFooter'
import { FadeInLoad } from '../components/sections/employer/employerMotion'
import EmployerForgotPasswordForm from '../components/forms/EmployerForgotPasswordForm'

export default function EmployerForgotPassword() {
  return (
    <div className="min-h-screen bg-[#F5F6F4] text-[#20251F] font-sans antialiased selection:bg-[#DDE6DF]">
      <Seo path="/employers/forgot-password" title="Forgot Password — Mzobs" noindex />
      <EmployerNavbar />

      <section id="home" className="relative overflow-hidden pt-[76px]">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#246B5A]" />
        <div aria-hidden="true" className="absolute left-1/2 top-16 h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-[#20251F]/10 pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#DDE6DF]/60 blur-3xl pointer-events-none" />

        <div className="relative max-w-md mx-auto px-6 py-16 md:py-24">
          <FadeInLoad delay={0.1}>
            <div className="bg-[#FAF7F1] rounded-[28px] border border-[#20251F]/10 shadow-[10px_12px_0_#20251F] p-7 sm:p-9">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound size={18} className="text-[#246B5A]" />
                <h2 className="font-serif text-2xl font-bold text-[#20251F]">Forgot your password?</h2>
              </div>
              <p className="text-[13.5px] text-[#526051] mt-1 mb-6">
                Remembered it after all?{' '}
                <Link to="/employers/signin" className="font-bold text-[#20251F] hover:text-[#246B5A] transition-colors">
                  Back to sign in
                </Link>
              </p>

              <EmployerForgotPasswordForm />
            </div>
          </FadeInLoad>
        </div>
      </section>

      <EmployerFooter />
    </div>
  )
}
