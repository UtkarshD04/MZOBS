import { createContext, useContext } from 'react'

// Carries the job SSR already fetched for /jobs/:id down to JobDetail.jsx,
// so hydration reuses it instead of re-fetching client-side. Set by
// entry-server.jsx (per-request SSR) and by entry-client.jsx (reading
// window.__INITIAL_JOB__ back out for hydration); null everywhere else.
export const InitialJobContext = createContext(null)

export function useInitialJob() {
  return useContext(InitialJobContext)
}
