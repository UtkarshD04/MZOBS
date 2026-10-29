import axios from 'axios'
import { API_URL, TOKEN_KEY, SESSION_KEY } from './config'

export const GST_REQUIRED_EVENT = 'mzt-gst-required'

// The session lives in an httpOnly cookie set by the API, so page script
// (and any XSS) never sees the token. The marker header opts into cookie mode
// and doubles as the CSRF guard for writes.
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { 'X-Requested-With': 'mzobs-web' },
})

// Tokens used to be kept in localStorage — drop any left over from before.
try {
  localStorage.removeItem(TOKEN_KEY)
} catch {
  /* storage unavailable */
}

// An expired/invalid session drops back to the sign-in screen.
apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.startsWith('/auth/')) {
      localStorage.removeItem(SESSION_KEY)
      window.dispatchEvent(new Event('mzt-signed-out'))
    }
    // The company's mandatory GST verification isn't complete (or was revoked):
    // App.jsx re-reads the company and shows the GST gate.
    if (err.response?.status === 403 && err.response.data?.code === 'GST_VERIFICATION_REQUIRED') {
      window.dispatchEvent(new Event(GST_REQUIRED_EVENT))
    }
    return Promise.reject(err)
  }
)
