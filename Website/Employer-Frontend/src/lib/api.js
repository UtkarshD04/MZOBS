import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/employer',
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mzobs-employer-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/**
 * The backend isn't wired up yet — this resolves with the given payload after a
 * network-like delay so loading/skeleton states behave the way they will once
 * `apiClient` calls replace these resolvers.
 */
export function mockResolve(data, ms = 420) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export function mockReject(message, ms = 420) {
  return new Promise((_resolve, reject) => setTimeout(() => reject(new Error(message)), ms))
}
