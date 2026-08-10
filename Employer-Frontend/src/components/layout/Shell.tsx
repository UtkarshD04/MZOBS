import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import TopNavbar from './TopNavbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useApp } from '../../context/AppContext'

export default function Shell() {
  const location = useLocation()
  const { setMobileSidebarOpen, cmdkOpen, setCmdkOpen } = useApp()

  useEffect(() => {
    setMobileSidebarOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname, setMobileSidebarOpen])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdkOpen(!cmdkOpen)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [cmdkOpen, setCmdkOpen])

  return (
    <div className="min-h-screen">
      <TopNavbar />
      <div className="flex min-h-[calc(100vh-64px)] mt-16">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col bg-bg-secondary px-8 pt-7 pb-8 max-lg:px-[18px] max-lg:pt-[22px] max-lg:pb-6">
          <div className="flex-1">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={location.pathname} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
