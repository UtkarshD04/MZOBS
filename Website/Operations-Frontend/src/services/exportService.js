import { apiClient } from '../lib/api'

// Fetches a staff CSV export (auth header needed, so not a plain link) and saves it.
export async function downloadCsv(path, params = {}) {
  const res = await apiClient.get(path, { params, responseType: 'blob', timeout: 120000 })
  const name = /filename="?([^"]+)"?/.exec(res.headers['content-disposition'] ?? '')?.[1] ?? 'export.csv'
  const url = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export const exportEmployeesCsv = (params) => downloadCsv('/employees/export', params)
export const exportApplicationsCsv = (params) => downloadCsv('/applications/export', params)
