import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/staff',
  timeout: 15000,
  // httpOnly session cookie — the token is never visible to page script.
  withCredentials: true,
  headers: { 'X-Requested-With': 'mzobs-web' },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
