import { createContext, useContext } from 'react'

// Carries the homepage's default (unfiltered) marketplace/category/hot-city
// data down to JobMarketplace.jsx/CategoryGrid.jsx/HotJobsByCity.jsx, fetched
// once from the live API by scripts/prerender.js at build time and re-read
// from window.__INITIAL_HOME_DATA__ by entry-client.jsx for hydration — same
// pattern as initialJobContext.js, just for the home page's three sections
// instead of a single job. Without this, each section's own useEffect never
// runs during the static prerender pass, so the shipped HTML freezes at that
// section's initial loading/zero state ("0 opportunities", empty city/category
// skeletons) even though the live API has real data.
// { jobs, total, categories, hotCities } | null
export const InitialHomeDataContext = createContext(null)

export function useInitialHomeData() {
  return useContext(InitialHomeDataContext)
}
