import { Route, Routes, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollToTop from './components/layout/ScrollToTop'
import CursorDot from './components/ui/CursorDot'
import ScrollToTopButton from './components/ui/ScrollToTopButton'
import Home from './pages/Home'
import JobDetail from './pages/JobDetail'
import CityJobs from './pages/CityJobs'
import About from './pages/About'
import OurStory from './pages/OurStory'
import Contact from './pages/Contact'
import Employee from './pages/Employee'
import EmployeeProfile from './pages/EmployeeProfile'
import EmployeeSubscription from './pages/EmployeeSubscription'
import EmployeeSignup from './pages/EmployeeSignup'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import EmployeeSignin from './pages/EmployeeSignin'
import EmployeeForgotPassword from './pages/EmployeeForgotPassword'
import EmployeeResetPassword from './pages/EmployeeResetPassword'
import DeleteAccount from './pages/DeleteAccount'
import Employer from './pages/Employer'
import EmployerPricing from './pages/EmployerPricing'
import EmployerSignup from './pages/EmployerSignup'
import EmployerSignin from './pages/EmployerSignin'
import EmployerForgotPassword from './pages/EmployerForgotPassword'
import EmployerResetPassword from './pages/EmployerResetPassword'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <CursorDot />
      <ScrollToTopButton />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/city/:citySlug" element={<CityJobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/employees/profile" element={<EmployeeProfile />} />
            <Route path="/employees/subscription" element={<EmployeeSubscription />} />
            <Route path="/employees/signup" element={<EmployeeSignup />} />
            <Route path="/employees/signin" element={<EmployeeSignin />} />
            <Route path="/employees/forgot-password" element={<EmployeeForgotPassword />} />
            <Route path="/employees/reset-password" element={<EmployeeResetPassword />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/employers" element={<Employer />} />
            <Route path="/employers/pricing" element={<EmployerPricing />} />
            <Route path="/employers/signup" element={<EmployerSignup />} />
            <Route path="/employers/signin" element={<EmployerSignin />} />
            <Route path="/employers/forgot-password" element={<EmployerForgotPassword />} />
            <Route path="/employers/reset-password" element={<EmployerResetPassword />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

