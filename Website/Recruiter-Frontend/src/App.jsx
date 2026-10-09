import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import TopNav from './components/TopNav'
import ErrorBoundary from './components/ErrorBoundary'
import AskAI from './components/AskAI'
import { ToastStack } from './components/ui'
import { WorkspaceProvider } from './store/workspace'
import SearchCandidates from './pages/SearchCandidates'
import CandidateProfile from './pages/CandidateProfile'
import SavedSearches from './pages/SavedSearches'
import Shortlists from './pages/Shortlists'
import UnlockedCvs from './pages/UnlockedCvs'
import JobTalent from './pages/JobTalent'
import Jobs from './pages/Jobs'
import JobForm from './pages/JobForm'
import { Messages, Interviews, AITalent, Reports } from './pages/Workspaces'
import { Notifications, Help, Settings } from './pages/Account'
import PlanCredits from './pages/PlanCredits'
import { refreshPlan } from './services/planService'
import { useCompany } from './services/companyService'
import GstGate from './components/GstGate'
import { IS_DEMO, TOKEN_KEY, EMPLOYER_SIGNIN_URL } from './lib/config'

// Live mode needs an employer session, issued by the marketing site's
// employer sign-in and handed over as a one-time code (see main.jsx). With no
// session we send the recruiter there; demo mode runs without one.
function useSession() {
  const [ok, setOk] = useState(IS_DEMO || !!localStorage.getItem(TOKEN_KEY))
  useEffect(() => {
    const out = () => setOk(false)
    window.addEventListener('mzt-signed-out', out)
    return () => window.removeEventListener('mzt-signed-out', out)
  }, [])
  return [ok, setOk]
}

export default function App() {
  const [ok] = useSession()
  const [ai, setAi] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setAi((v) => !v)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!ok) window.location.href = EMPLOYER_SIGNIN_URL
  }, [ok])
  if (!ok) return null
  return <GstGatedApp ai={ai} setAi={setAi} location={location} />
}

// Mandatory GST verification: nothing but the verification screen until the
// company's GSTIN is VERIFIED (the API refuses everything else anyway).
function GstGatedApp({ ai, setAi, location }) {
  const { company, error, reload } = useCompany()
  const verified = IS_DEMO || company?.gstVerification?.status === 'VERIFIED'
  useEffect(() => {
    if (verified) refreshPlan()
  }, [verified])

  if (!IS_DEMO && !company) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg p-6 text-center">
        {error ? (
          <div>
            <p className="text-[14px] text-ink-2">Couldn’t load your company.</p>
            <button onClick={reload} className="mt-3 text-[13px] font-semibold text-accent hover:underline">Retry</button>
          </div>
        ) : (
          <p className="text-[14px] text-muted">Loading…</p>
        )}
      </div>
    )
  }
  if (!verified) return <GstGate company={company} onRefresh={reload} />
  return (
    <WorkspaceProvider>
      <TopNav onAskAI={() => setAi(true)} />
      <main key={location.pathname} className="fade-up">
        <ErrorBoundary key={location.pathname}>
        <Routes>
          <Route path="/" element={<SearchCandidates />} />
          <Route path="/candidate/:id" element={<CandidateProfile />} />
          <Route path="/saved-searches" element={<SavedSearches />} />
          <Route path="/shortlists" element={<Shortlists />} />
          <Route path="/unlocked" element={<UnlockedCvs />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/new" element={<JobForm />} />
          <Route path="/jobs/:id/edit" element={<JobForm />} />
          <Route path="/talent-pool" element={<JobTalent />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/ai-talent" element={<AITalent onAskAI={() => setAi(true)} />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/credits" element={<PlanCredits />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ErrorBoundary>
      </main>
      <AskAI open={ai} onClose={() => setAi(false)} />
      <ToastStack />
    </WorkspaceProvider>
  )
}
