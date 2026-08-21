import { createContext, useCallback, useContext, useState } from 'react'

const AppContext = createContext(null)

let toastId = 0

// Fixed light theme, pinned via data-theme="light" on <html> in index.html
// to match the Landing site — no dark mode here, so no toggle to manage it.
export function AppProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [modal, setModal] = useState(null)
  const [sidePanel, setSidePanel] = useState(null)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((type, message) => {
    const id = ++toastId
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400)
  }, [])

  const openModal = useCallback((content, wide = false) => setModal({ content, wide }), [])
  const closeModal = useCallback(() => setModal(null), [])

  const openSidePanel = useCallback((content, width = 480) => setSidePanel({ content, width }), [])
  const closeSidePanel = useCallback(() => setSidePanel(null), [])

  const value = {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    avatarMenuOpen,
    setAvatarMenuOpen,
    modal,
    openModal,
    closeModal,
    sidePanel,
    openSidePanel,
    closeSidePanel,
    toasts,
    addToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
