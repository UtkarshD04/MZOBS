import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext(null)

let toastId = 0

export function AppProvider({ children }) {
  const [themeOverride, setThemeOverride] = useState(() => localStorage.getItem('mzobs-theme') || 'light')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [modal, setModal] = useState(null)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const root = document.documentElement
    if (themeOverride) {
      root.setAttribute('data-theme', themeOverride)
      localStorage.setItem('mzobs-theme', themeOverride)
    } else {
      root.removeAttribute('data-theme')
      localStorage.removeItem('mzobs-theme')
    }
  }, [themeOverride])

  const toggleTheme = useCallback(() => {
    setThemeOverride((cur) => {
      const active = cur || 'light'
      return active === 'dark' ? 'light' : 'dark'
    })
  }, [])

  const isDark = useMemo(() => themeOverride === 'dark', [themeOverride])

  const addToast = useCallback((type, message) => {
    const id = ++toastId
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400)
  }, [])

  const openModal = useCallback((content, wide = false) => setModal({ content, wide }), [])
  const closeModal = useCallback(() => setModal(null), [])

  const value = {
    isDark,
    toggleTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    avatarMenuOpen,
    setAvatarMenuOpen,
    modal,
    openModal,
    closeModal,
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
