// import.meta.env is undefined outside Vite (unit scripts), so read it defensively.
const ENV = import.meta.env ?? {}

// 'live' calls the Mzobs employer API (the resume database plus the company's
// own pipeline — see services/talentService.js); 'demo' searches a
// clearly-labelled sample pool bundled with the app.
export const TALENT_SOURCE = ENV.VITE_TALENT_SOURCE ?? 'live'
export const IS_DEMO = TALENT_SOURCE !== 'live'
export const API_URL = ENV.VITE_API_URL ?? '/api/employer'
// CV links are root-relative (`/files/resume/:token`) and must open on the API host. When
// VITE_FILE_BASE_URL wasn't passed as a build arg, fall back to the API URL's origin —
// otherwise the CV iframe loads this app's own index.html (and X-Frame-Options blocks it).
const originOf = (u) => {
  try {
    return new URL(u).origin
  } catch {
    return ''
  }
}
export const FILE_BASE_URL = (ENV.VITE_FILE_BASE_URL || originOf(API_URL)).replace(/\/+$/, '')
export const LANDING_APP_URL = ENV.VITE_LANDING_URL ?? 'http://localhost:5176'
export const EMPLOYER_SIGNIN_URL = `${LANDING_APP_URL}/employers/signin`
export const TOKEN_KEY = 'mzobs-employer-token'
