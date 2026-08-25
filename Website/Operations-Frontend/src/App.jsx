import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ModalRoot from './components/ui/Modal'
import ToastStack from './components/ui/ToastStack'
import RequireAuth from './components/auth/RequireAuth'

import OpsShell from './components/layout/ops/OpsShell'
import Login from './pages/ops/Login'
import ForgotPassword from './pages/ops/ForgotPassword'
import ResetPassword from './pages/ops/ResetPassword'
import Overview from './pages/ops/Overview'
import Resumes from './pages/ops/Resumes'
import HRContacts from './pages/ops/HRContacts'
import Companies from './pages/ops/Companies'
import Requirements from './pages/ops/Requirements'

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
            <Route path="hr-contacts" element={<HRContacts />} />
            <Route path="companies" element={<Companies />} />
            <Route path="requirements" element={<Requirements />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ModalRoot />
      <ToastStack />
    </AppProvider>
  )
}
