import { Navigate, Route, Routes } from 'react-router-dom'
import { Settings, LifeBuoy } from 'lucide-react'
import { AppProvider } from './context/AppContext'
import ModalRoot from './components/ui/Modal'
import DrawerRoot from './components/ui/Drawer'
import ToastStack from './components/ui/ToastStack'
import CommandPalette from './components/ui/CommandPalette'
import RequireAuth from './components/auth/RequireAuth'
import RequireAdmin from './components/auth/RequireAdmin'

import MzobsShell from './components/layout/mzobs/MzobsShell'
import Login from './pages/mzobs/Login'
import ForgotPassword from './pages/mzobs/ForgotPassword'
import ResetPassword from './pages/mzobs/ResetPassword'
import Dashboard from './pages/mzobs/Dashboard'
import ResumeQueue from './pages/mzobs/ResumeQueue'
import MockInterviews from './pages/mzobs/MockInterviews'
import Shortlisted from './pages/mzobs/Shortlisted'
import Team from './pages/mzobs/Team'
import ComingSoon from './pages/mzobs/ComingSoon'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<RequireAuth />}>
        <Route path="/app" element={<MzobsShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="resumes" element={<ResumeQueue />} />
          <Route path="mock-interviews" element={<MockInterviews />} />
          <Route path="shortlisted" element={<Shortlisted />} />

          <Route element={<RequireAdmin />}>
            <Route path="team" element={<Team />} />
          </Route>
          <Route path="settings" element={<ComingSoon icon={Settings} title="Settings" subtitle="Portal preferences, rate card and notification rules." />} />
          <Route path="support" element={<ComingSoon icon={LifeBuoy} title="Support Desk" subtitle="Tickets raised by candidates and employers." />} />
        </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ModalRoot />
      <DrawerRoot />
      <ToastStack />
      <CommandPalette />
    </AppProvider>
  )
}
