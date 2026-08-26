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
  resumes: (filters) => ['resumes', filters],
  resumesStats: ['resumes', 'stats'],
  mockInterviews: (filters) => ['mockInterviews', filters],
  payments: (filters) => ['payments', filters],
  team: ['team'],
  me: ['me'],
  shortlist: (filters) => ['shortlist', filters],
  notifications: ['notifications'],
}
