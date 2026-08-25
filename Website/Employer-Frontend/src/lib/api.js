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
