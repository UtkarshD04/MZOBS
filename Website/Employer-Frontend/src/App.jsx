import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Shell from './components/layout/Shell'
import RequireAuth from './components/auth/RequireAuth'
import { PageSkeleton } from './components/ui/Skeleton'
import { EMPLOYER_SIGNIN_URL } from './lib/config'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Jobs = lazy(() => import('./pages/Jobs'))
const JobForm = lazy(() => import('./pages/JobForm'))
const Candidates = lazy(() => import('./pages/Candidates'))
const Batches = lazy(() => import('./pages/Batches'))
const CandidateProfile = lazy(() => import('./pages/CandidateProfile'))
const Interviews = lazy(() => import('./pages/Interviews'))
const Offers = lazy(() => import('./pages/Offers'))
const Billing = lazy(() => import('./pages/Billing'))
const CompanyProfile = lazy(() => import('./pages/CompanyProfile'))
const TeamMembers = lazy(() => import('./pages/TeamMembers'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Settings = lazy(() => import('./pages/Settings'))
const Support = lazy(() => import('./pages/Support'))

// This app has no marketing page of its own — Landing-Frontend is the real
// entry point (sign-in/sign-up happen there) — so any visit here without a
// session just bounces straight there.
function RedirectToLanding() {
  useEffect(() => {
    window.location.href = EMPLOYER_SIGNIN_URL
  }, [])
  return null
}

export default function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<RedirectToLanding />} />

        <Route element={<RequireAuth />}>
          <Route element={<Shell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/new" element={<JobForm />} />
            <Route path="/jobs/:id/edit" element={<JobForm />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/:id" element={<CandidateProfile />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/company" element={<CompanyProfile />} />
            <Route path="/team" element={<TeamMembers />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
