import { createContext, useContext } from 'react'

// Shared with context/AppContext.jsx's AppProvider (the component that
// actually creates the value) — split out here, alongside the useApp hook
// that reads it, so that file only exports components (Fast Refresh).
export const AppContext = createContext(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
