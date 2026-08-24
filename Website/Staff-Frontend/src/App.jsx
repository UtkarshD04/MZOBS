import { Navigate, Route, Routes } from 'react-router-dom'
import { Settings, LifeBuoy } from 'lucide-react'
import { AppProvider } from './context/AppContext'
import ModalRoot from './components/ui/Modal'
import DrawerRoot from './components/ui/Drawer'
import ToastStack from './components/ui/ToastStack'
import RequireAuth from './components/auth/RequireAuth'

import MzobsShell from './components/layout/mzobs/MzobsShell'
import Login from './pages/mzobs/Login'
import ForgotPassword from './pages/mzobs/ForgotPassword'
import ResetPassword from './pages/mzobs/ResetPassword'
import ResumeQueue from './pages/mzobs/ResumeQueue'
import MockInterviews from './pages/mzobs/MockInterviews'
import ResumePool from './pages/mzobs/ResumePool'
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
          <Route index element={<Navigate to="resumes" replace />} />
          <Route path="resumes" element={<ResumeQueue />} />
          <Route path="resume-pool" element={<ResumePool />} />
          <Route path="mock-interviews" element={<MockInterviews />} />
          <Route path="settings" element={<ComingSoon icon={Settings} title="Settings" subtitle="Portal preferences and notification rules." />} />
          <Route path="support" element={<ComingSoon icon={LifeBuoy} title="Support Desk" subtitle="Reach the ops team for help." />} />
        </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ModalRoot />
      <DrawerRoot />
      <ToastStack />
    </AppProvider>
  )
}
