import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import MzobsTopNav from './MzobsTopNav'
import MzobsSidebar from './MzobsSidebar'
import MzobsFooter from './MzobsFooter'
import RouteProgress from '../RouteProgress'
import { useApp } from '../../../context/AppContext'
import { subscribeToPush } from '../../../lib/webPush'

export default function MzobsShell() {
  const location = useLocation()
  const { setMobileSidebarOpen, setDrawerOpen, setAvatarMenuOpen } = useApp()

  useEffect(() => {
    setMobileSidebarOpen(false)
    setDrawerOpen(false)
    setAvatarMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname, setMobileSidebarOpen, setDrawerOpen, setAvatarMenuOpen])

  // Only mounted once signed in (nested under <RequireAuth /> in App.jsx),
  // so this is the first moment there's an account to link a subscription to.
  useEffect(() => {
    subscribeToPush()
  }, [])

  return (
    <div className="min-h-screen">
      <MzobsTopNav />
      <RouteProgress />
      <div className="flex min-h-[calc(100vh-64px)] mt-16">
        <MzobsSidebar />
        <main className="flex-1 min-w-0 flex flex-col bg-bg-secondary px-8 pt-7 pb-8 max-lg:px-[18px] max-lg:pt-[22px] max-lg:pb-6">
          <div className="flex-1">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={location.pathname} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
          <MzobsFooter />
        </main>
      </div>
    </div>
  )
}
