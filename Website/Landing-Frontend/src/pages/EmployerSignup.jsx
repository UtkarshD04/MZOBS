import { Link } from 'react-router-dom'
import EmployerAuthLayout from '../components/sections/employer/EmployerAuthLayout'
import EmployerSignupForm from '../components/forms/EmployerSignupForm'

export default function EmployerSignup() {
  return (
    <EmployerAuthLayout
      seoPath="/employers/signup"
      seoTitle="Create Your Employer Account | Mzobs"
      heading="Hire quality talent,"
      accent="not a stack of resumes."
      subtext="Create your free employer account and share your first requirement in minutes, no sales call required."
    >
      <EmployerSignupForm
        header={
          <p className="text-[14px] text-[#667085]">
            Already have an account?{' '}
            <Link to="/employers/signin" className="font-bold text-[#075f55] hover:text-[#111827] transition-colors">
              Sign in
            </Link>
          </p>
        }
      />
      <p className="mt-7 text-center text-[12px] text-[#667085]">Free to start · No credit card · No sales call</p>
    </EmployerAuthLayout>
  )
}
