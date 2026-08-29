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
  profile: ['profile'],
  resume: ['resume'],
  subscription: ['subscription'],
  jobs: (filters) => ['jobs', filters],
  job: (id) => ['jobs', id],
  applications: ['applications'],
  mockInterview: ['mockInterview'],
  interviews: ['interviews'],
  notifications: ['notifications'],
  supportTickets: ['supportTickets'],
}
