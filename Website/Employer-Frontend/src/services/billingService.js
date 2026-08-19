import { apiClient } from '../lib/api'

export function getBillingSummary() {
  return apiClient.get('/billing/summary').then((r) => r.data)
}

export function listInvoices() {
  return apiClient.get('/billing/invoices').then((r) => r.data)
}
