// Backend's static/file host (uploads, resume access links, etc) — a
// window.open() to it works cross-origin with no proxy/CORS setup needed
// since it's a plain navigation, not a script-read request.
export const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL ?? 'http://localhost:4000'

// Sign-in and sign-up for the employer portal live on the marketing site
// (Landing-Frontend), not in this app — point at its real deployed URL here.
export const LANDING_APP_URL = import.meta.env.VITE_LANDING_URL ?? 'http://localhost:5176'
export const EMPLOYER_SIGNIN_URL = `${LANDING_APP_URL}/employers/signin`
export const EMPLOYER_SIGNUP_URL = `${LANDING_APP_URL}/employers/signup`
