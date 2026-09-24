// import.meta.env is undefined outside Vite (unit scripts), so read it defensively.
const ENV = import.meta.env ?? {}

// 'live' calls the Mzobs employer API; 'demo' searches a clearly-labelled
// sample pool bundled with the app. The backend has no cross-company talent
// search endpoint yet (see services/talentService.js), so demo is the default.
export const TALENT_SOURCE = ENV.VITE_TALENT_SOURCE ?? 'demo'
export const IS_DEMO = TALENT_SOURCE !== 'live'
export const API_URL = ENV.VITE_API_URL ?? '/api/employer'
export const FILE_BASE_URL = ENV.VITE_FILE_BASE_URL ?? ''
export const LANDING_APP_URL = ENV.VITE_LANDING_URL ?? 'http://localhost:5176'
export const EMPLOYER_SIGNIN_URL = `${LANDING_APP_URL}/employers/signin`
export const TOKEN_KEY = 'mzobs-employer-token'
