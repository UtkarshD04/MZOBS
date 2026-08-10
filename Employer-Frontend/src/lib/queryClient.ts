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
  dashboard: ['dashboard'] as const,
  jobs: (filters?: unknown) => ['jobs', filters] as const,
  job: (id: string) => ['jobs', id] as const,
  candidates: (filters?: unknown) => ['candidates', filters] as const,
  candidate: (id: string) => ['candidates', id] as const,
  batches: ['batches'] as const,
  interviews: ['interviews'] as const,
  offers: ['offers'] as const,
  team: ['team'] as const,
  notifications: ['notifications'] as const,
  company: ['company'] as const,
  billingSummary: ['billing', 'summary'] as const,
  invoices: ['billing', 'invoices'] as const,
}
