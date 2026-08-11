import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export const queryKeys = {
  dashboard: ['dashboard'],
  jobs: (filters) => ['jobs', filters],
  job: (id) => ['jobs', id],
  candidates: (filters) => ['candidates', filters],
  candidate: (id) => ['candidates', id],
  batches: ['batches'],
  interviews: ['interviews'],
  offers: ['offers'],
  team: ['team'],
  notifications: ['notifications'],
  company: ['company'],
  billingSummary: ['billing', 'summary'],
  invoices: ['billing', 'invoices'],
}
