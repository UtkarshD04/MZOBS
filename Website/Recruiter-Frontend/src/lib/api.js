import axios from 'axios'
import { API_URL, TOKEN_KEY } from './config'

export const apiClient = axios.create({ baseURL: API_URL, timeout: 15000 })

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// An expired/invalid session drops back to the sign-in screen.
apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.startsWith('/auth/')) {
      localStorage.removeItem(TOKEN_KEY)
      window.dispatchEvent(new Event('mzt-signed-out'))
    }
    return Promise.reject(err)
  }
)
