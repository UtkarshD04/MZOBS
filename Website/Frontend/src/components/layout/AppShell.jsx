import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import TopNav from './TopNav'
import Sidebar from './Sidebar'
import RouteProgress from './RouteProgress'
import AppFooter from './AppFooter'
import { useApp } from '../../context/AppContext'
import { subscribeToPush } from '../../lib/webPush'
import { hasEmployeeToken } from '../../lib/auth'

export default function AppShell() {
  const location = useLocation()
  const { setMobileSidebarOpen, setDrawerOpen, setAvatarMenuOpen } = useApp()
  // Profile is a standalone, full-width page (no dashboard side nav) —
  // matches the Naukri-style layout it was designed against.
  const hideSidebar = location.pathname.startsWith('/app/profile')

  useEffect(() => {
    setMobileSidebarOpen(false)
    setDrawerOpen(false)
    setAvatarMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname, setMobileSidebarOpen, setDrawerOpen, setAvatarMenuOpen])

  // /app/jobs is reachable without a session (see App.jsx), so guard for
  // that instead of assuming AppShell only ever mounts signed in.
  useEffect(() => {
    if (hasEmployeeToken()) subscribeToPush()
  }, [])

  return (
    <div className="min-h-screen">
      <TopNav />
      <RouteProgress />
      <div className="flex min-h-[calc(100vh-64px)] mt-16">
        {!hideSidebar && <Sidebar />}
        <main
          className={
            hideSidebar
              ? 'theme-landing flex-1 min-w-0 flex flex-col bg-bg-secondary px-5 sm:px-8 pt-7 pb-8'
              : 'flex-1 min-w-0 flex flex-col bg-bg-secondary px-8 pt-7 pb-8 max-lg:px-[18px] max-lg:pt-[22px] max-lg:pb-6'
          }
        >
          <div className={hideSidebar ? 'flex-1 max-w-6xl w-full mx-auto' : 'flex-1'}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={location.pathname} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
          <AppFooter />
        </main>
      </div>
    </div>
  )
}
