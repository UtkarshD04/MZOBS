import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ModalRoot from './components/ui/Modal'
import DrawerRoot from './components/ui/Drawer'
import ToastStack from './components/ui/ToastStack'
import RequireAuth from './components/auth/RequireAuth'

import StaffShell from './components/layout/staff/StaffShell'
import Login from './pages/staff/Login'
import ForgotPassword from './pages/staff/ForgotPassword'
import ResetPassword from './pages/staff/ResetPassword'
import Dashboard from './pages/staff/Dashboard'
import MyResumes from './pages/staff/MyResumes'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<RequireAuth />}>
          <Route path="/app" element={<StaffShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="my-resumes" element={<MyResumes />} />
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
