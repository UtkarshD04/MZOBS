import AuthHeader from '../components/ui/AuthHeader'
import CareerOnboardingPanel from '../components/ui/CareerOnboardingPanel'
import EmployeeSignupForm from '../components/forms/EmployeeSignupForm'

export default function EmployeeSignup() {
  return (
    <div className="min-h-screen bg-white text-(--jobs-navy) font-sans antialiased selection:bg-blue-200">
      <title>Create Your Account — Mzobs</title>
      <AuthHeader />

      <section className="relative py-6 sm:py-10 lg:py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="lg:hidden mb-6">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.16em] text-(--jobs-blue-dark) uppercase">
              MZOBS Careers
            </span>
            <h1 className="mt-2 text-[22px] font-black leading-tight text-(--jobs-navy) tracking-tight">
              Your next opportunity starts here.
            </h1>
            <p className="mt-1.5 text-[13.5px] text-(--jobs-ink-soft)">
              Create your profile and get matched with verified employers.
            </p>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_460px] xl:grid-cols-[minmax(0,1fr)_500px] gap-6 xl:gap-8 items-stretch">
            <div className="hidden lg:block">
              <CareerOnboardingPanel showJobPreview={false} />
            </div>

            <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(16,42,67,0.04),0_20px_44px_-16px_rgba(16,42,67,0.14)] border border-(--jobs-border) p-6 sm:p-8">
              <EmployeeSignupForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
