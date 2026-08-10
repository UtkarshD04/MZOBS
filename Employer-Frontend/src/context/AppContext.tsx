import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface AppContextValue {
  isDark: boolean
  toggleTheme: () => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  cmdkOpen: boolean
  setCmdkOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [themeOverride, setThemeOverride] = useState<string | null>(() => localStorage.getItem('mzobs-employer-theme'))
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [cmdkOpen, setCmdkOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (themeOverride) {
      root.setAttribute('data-theme', themeOverride)
      localStorage.setItem('mzobs-employer-theme', themeOverride)
    } else {
      root.removeAttribute('data-theme')
      localStorage.removeItem('mzobs-employer-theme')
    }
  }, [themeOverride])

  const toggleTheme = useCallback(() => {
    setThemeOverride((cur) => ((cur || 'light') === 'dark' ? 'light' : 'dark'))
  }, [])

  const isDark = useMemo(() => themeOverride === 'dark', [themeOverride])

  const value: AppContextValue = {
    isDark,
    toggleTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    cmdkOpen,
    setCmdkOpen,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
