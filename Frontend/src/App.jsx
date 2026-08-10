import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ModalRoot from './components/ui/Modal'
import DrawerRoot from './components/ui/Drawer'
import ToastStack from './components/ui/ToastStack'
import CommandPalette from './components/ui/CommandPalette'
import AppShell from './components/layout/AppShell'

import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Otp from './pages/auth/Otp'
import Onboarding from './pages/Onboarding'

import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ResumeCenter from './pages/ResumeCenter'
import SkillAssessment from './pages/SkillAssessment'
import MockInterview from './pages/MockInterview'
import Training from './pages/Training'
import JobMatching from './pages/JobMatching'
import Applications from './pages/Applications'
import InterviewCenter from './pages/InterviewCenter'
import Notifications from './pages/Notifications'
import Messages from './pages/Messages'
import Subscription from './pages/Subscription'
import Settings from './pages/Settings'
import Support from './pages/Support'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resume" element={<ResumeCenter />} />
          <Route path="assessment" element={<SkillAssessment />} />
          <Route path="interview" element={<MockInterview />} />
          <Route path="training" element={<Training />} />
          <Route path="jobs" element={<JobMatching />} />
          <Route path="applications" element={<Applications />} />
          <Route path="interview-center" element={<InterviewCenter />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="messages" element={<Messages />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ModalRoot />
      <DrawerRoot />
      <ToastStack />
      <CommandPalette />
    </AppProvider>
  )
}
