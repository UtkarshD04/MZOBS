import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ModalRoot from './components/ui/Modal'
import ToastStack from './components/ui/ToastStack'
import RequireAuth from './components/auth/RequireAuth'
import RequireAdmin from './components/auth/RequireAdmin'

import OpsShell from './components/layout/ops/OpsShell'
import Login from './pages/ops/Login'
import ForgotPassword from './pages/ops/ForgotPassword'
import ResetPassword from './pages/ops/ResetPassword'
import Overview from './pages/ops/Overview'
import Resumes from './pages/ops/Resumes'
import HRContacts from './pages/ops/HRContacts'
import Companies from './pages/ops/Companies'
import Requirements from './pages/ops/Requirements'
import Shortlisted from './pages/ops/Shortlisted'
import Queries from './pages/ops/Queries'
import Payments from './pages/ops/Payments'
import Team from './pages/ops/Team'
import SendNotification from './pages/ops/SendNotification'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<RequireAuth />}>
          <Route path="/app" element={<OpsShell />}>
            <Route index element={<Overview />} />
            <Route path="resumes" element={<Resumes />} />
            <Route path="shortlisted" element={<Shortlisted />} />
            <Route element={<RequireAdmin />}>
              <Route path="hr-contacts" element={<HRContacts />} />
              <Route path="companies" element={<Companies />} />
              <Route path="requirements" element={<Requirements />} />
              <Route path="queries" element={<Queries />} />
              <Route path="payments" element={<Payments />} />
              <Route path="team" element={<Team />} />
            </Route>
            <Route path="notifications/send" element={<SendNotification />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ModalRoot />
      <ToastStack />
    </AppProvider>
  )
}
