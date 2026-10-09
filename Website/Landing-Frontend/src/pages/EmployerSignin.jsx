import { Link } from 'react-router-dom'
import EmployerAuthLayout from '../components/sections/employer/EmployerAuthLayout'
import EmployerSigninForm from '../components/forms/EmployerSigninForm'

export default function EmployerSignin() {
  return (
    <EmployerAuthLayout
      seoPath="/employers/signin"
      seoTitle="Employer Sign In | Mzobs"
      heading="Welcome back to your"
      accent="hiring portal."
      subtext="Sign in to review your requirements, screen candidates and manage interviews, offers and billing."
    >
      <h2 className="font-sans text-[28px] tracking-tight font-bold text-[#111827]">Sign in</h2>
      <p className="text-[14px] text-[#667085] mt-1 mb-7">
        New to Mzobs?{' '}
        <Link to="/employers/signup" className="font-bold text-[#075f55] hover:text-[#111827] transition-colors">
          Create a free account
        </Link>
      </p>

      <EmployerSigninForm />

      <p className="mt-7 text-center text-[12px] text-[#667085]">Secured sign-in · Your data stays private</p>
    </EmployerAuthLayout>
  )
}
