import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ModalRoot from './components/ui/Modal'
import ToastStack from './components/ui/ToastStack'
import RequireAuth from './components/auth/RequireAuth'

import AdminShell from './components/layout/admin/AdminShell'
import Login from './pages/admin/Login'
import ForgotPassword from './pages/admin/ForgotPassword'
import ResetPassword from './pages/admin/ResetPassword'
import Overview from './pages/admin/Overview'
import Resumes from './pages/admin/Resumes'
import ResumeStats from './pages/admin/ResumeStats'
import MockInterviews from './pages/admin/MockInterviews'
import HRContacts from './pages/admin/HRContacts'
import Companies from './pages/admin/Companies'
import Requirements from './pages/admin/Requirements'
import PostJob from './pages/admin/PostJob'
import Shortlisted from './pages/admin/Shortlisted'
import Queries from './pages/admin/Queries'
import Payments from './pages/admin/Payments'
import Coupons from './pages/admin/Coupons'
import SubscriptionTrend from './pages/admin/SubscriptionTrend'
import EmployerRevenueTrend from './pages/admin/EmployerRevenueTrend'
import Team from './pages/admin/Team'
import Placements from './pages/admin/Placements'
import SendNotification from './pages/admin/SendNotification'
import Employees from './pages/admin/Employees'
import Applications from './pages/admin/Applications'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<RequireAuth />}>
          <Route path="/app" element={<AdminShell />}>
            <Route index element={<Overview />} />
            <Route path="resumes" element={<Resumes />} />
            <Route path="resume-stats" element={<ResumeStats />} />
            <Route path="mock-interviews" element={<MockInterviews />} />
            <Route path="hr-contacts" element={<HRContacts />} />
            <Route path="companies" element={<Companies />} />
            <Route path="requirements" element={<Requirements />} />
            <Route path="requirements/new" element={<PostJob />} />
            <Route path="shortlisted" element={<Shortlisted />} />
            <Route path="placements" element={<Placements />} />
            <Route path="queries" element={<Queries />} />
            <Route path="payments" element={<Payments />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="subscriptions" element={<SubscriptionTrend />} />
            <Route path="employer-revenue" element={<EmployerRevenueTrend />} />
            <Route path="team" element={<Team />} />
            <Route path="notifications/send" element={<SendNotification />} />
            <Route path="employees" element={<Employees />} />
            <Route path="applications" element={<Applications />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ModalRoot />
      <ToastStack />
    </AppProvider>
  )
}
