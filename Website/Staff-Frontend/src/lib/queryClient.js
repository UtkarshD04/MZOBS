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
  resumes: (filters) => ['resumes', filters],
  mockInterviews: (filters) => ['mockInterviews', filters],
  me: ['me'],
  resumePool: (filters) => ['resumePool', filters],
  resumePoolStats: ['resumePool', 'stats'],
  notifications: ['notifications'],
}
