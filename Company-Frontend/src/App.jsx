import { Navigate, Route, Routes } from 'react-router-dom'
import { Settings, LifeBuoy } from 'lucide-react'
import { AppProvider } from './context/AppContext'
import ModalRoot from './components/ui/Modal'
import DrawerRoot from './components/ui/Drawer'
import ToastStack from './components/ui/ToastStack'
import CommandPalette from './components/ui/CommandPalette'

import MzobsShell from './components/layout/mzobs/MzobsShell'
import Home from './pages/mzobs/Home'
import Login from './pages/mzobs/Login'
import Dashboard from './pages/mzobs/Dashboard'
import Candidates from './pages/mzobs/Candidates'
import ResumeQueue from './pages/mzobs/ResumeQueue'
import MockInterviews from './pages/mzobs/MockInterviews'
import Companies from './pages/mzobs/Companies'
import Requirements from './pages/mzobs/Requirements'
import Applications from './pages/mzobs/Applications'
import Dispatch from './pages/mzobs/Dispatch'
import Payments from './pages/mzobs/Payments'
import Team from './pages/mzobs/Team'
import ComingSoon from './pages/mzobs/ComingSoon'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/app" element={<MzobsShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="candidates" element={<Candidates />} />
          <Route path="resumes" element={<ResumeQueue />} />
          <Route path="mock-interviews" element={<MockInterviews />} />

          <Route path="companies" element={<Companies />} />
          <Route path="requirements" element={<Requirements />} />
          <Route path="applications" element={<Applications />} />
          <Route path="dispatch" element={<Dispatch />} />

          <Route path="payments" element={<Payments />} />
          <Route path="team" element={<Team />} />
          <Route path="settings" element={<ComingSoon icon={Settings} title="Settings" subtitle="Portal preferences, rate card and notification rules." />} />
          <Route path="support" element={<ComingSoon icon={LifeBuoy} title="Support Desk" subtitle="Tickets raised by candidates and employers." />} />
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
