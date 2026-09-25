import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import ScrollToTop from './components/layout/ScrollToTop'
import CursorDot from './components/ui/CursorDot'
import ScrollToTopButton from './components/ui/ScrollToTopButton'
import Home from './pages/Home'
// Everything below stays a regular (eager) import because server.js/
// scripts/prerender.js call entry-server.jsx's render() — a synchronous
// renderToString — for these: JobDetail and the catch-all (NotFound, or
// CityJobs for an unknown city — see server.js) are rendered per-request,
// and About/OurStory/Employee(s)/Contact/PrivacyPolicy/TermsOfService/
// CityJobs are rendered at build time by prerender.js. renderToString
// doesn't wait for React.lazy's dynamic import, so any component it can
// reach has to already be loaded — see the comment on CLIENT_ONLY_ROUTES in
// lib/routes.js for the routes that don't have this constraint.
import JobDetail from './pages/JobDetail'
import CityJobs from './pages/CityJobs'
import About from './pages/About'
import OurStory from './pages/OurStory'
import Contact from './pages/Contact'
import Employee from './pages/Employee'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Employer from './pages/Employer'
import EmployerPricing from './pages/EmployerPricing'
import NotFound from './pages/NotFound'
import { CLIENT_ONLY_ROUTES } from './lib/routes'

// CLIENT_ONLY_ROUTES pages are never reached by server-side render() (see
// server.js's catch-all — a known client-only route ships an empty shell
// instead), so they're free to be real, separate chunks fetched on demand.
const EmployeeProfile = lazy(() => import('./pages/EmployeeProfile'))
const EmployeeSubscription = lazy(() => import('./pages/EmployeeSubscription'))
const EmployeeSignup = lazy(() => import('./pages/EmployeeSignup'))
const EmployeeSignin = lazy(() => import('./pages/EmployeeSignin'))
const EmployeeForgotPassword = lazy(() => import('./pages/EmployeeForgotPassword'))
const EmployeeResetPassword = lazy(() => import('./pages/EmployeeResetPassword'))
const DeleteAccount = lazy(() => import('./pages/DeleteAccount'))
const EmployerSignup = lazy(() => import('./pages/EmployerSignup'))
const EmployerSignin = lazy(() => import('./pages/EmployerSignin'))
const EmployerForgotPassword = lazy(() => import('./pages/EmployerForgotPassword'))
const EmployerResetPassword = lazy(() => import('./pages/EmployerResetPassword'))
const Doot = lazy(() => import('./pages/Doot'))

// Only ever visible for the fraction of a second a lazy route's chunk takes
// to fetch (and never at all for the eager/SSR'd routes above) — deliberately
// bare, no motion/icon import, so it can't drag in its own chunk to wait on.
function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-[3px] border-(--jobs-border) border-t-(--jobs-blue) animate-spin" />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <ScrollToTop />
      <CursorDot />
      <ScrollToTopButton />
      {/* No AnimatePresence/exit animation — the old page unmounts the
          instant the route changes (no ~350ms wait for an exit transition
          before the new one appears); this key'd div only fades the new
          page *in*, and skips even that when the visitor prefers reduced
          motion (initial={false} means it renders straight into its
          "animate" state, no transition run at all). */}
      <motion.div
        key={location.pathname}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/city/:citySlug" element={<CityJobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/employees" element={<Employee />} />
            <Route path={CLIENT_ONLY_ROUTES.employeeProfile} element={<EmployeeProfile />} />
            <Route path={CLIENT_ONLY_ROUTES.employeeSubscription} element={<EmployeeSubscription />} />
            <Route path={CLIENT_ONLY_ROUTES.employeeSignup} element={<EmployeeSignup />} />
            <Route path={CLIENT_ONLY_ROUTES.employeeSignin} element={<EmployeeSignin />} />
            <Route path={CLIENT_ONLY_ROUTES.employeeForgotPassword} element={<EmployeeForgotPassword />} />
            <Route path={CLIENT_ONLY_ROUTES.employeeResetPassword} element={<EmployeeResetPassword />} />
            <Route path={CLIENT_ONLY_ROUTES.deleteAccount} element={<DeleteAccount />} />
            <Route path="/employers" element={<Employer />} />
            <Route path="/employers/pricing" element={<EmployerPricing />} />
            <Route path={CLIENT_ONLY_ROUTES.employerSignup} element={<EmployerSignup />} />
            <Route path={CLIENT_ONLY_ROUTES.employerSignin} element={<EmployerSignin />} />
            <Route path={CLIENT_ONLY_ROUTES.employerForgotPassword} element={<EmployerForgotPassword />} />
            <Route path={CLIENT_ONLY_ROUTES.employerResetPassword} element={<EmployerResetPassword />} />
            <Route path={CLIENT_ONLY_ROUTES.doot} element={<Doot />} />
            <Route path={CLIENT_ONLY_ROUTES.dootLegacy} element={<Navigate to={CLIENT_ONLY_ROUTES.doot} replace />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </>
  )
}

