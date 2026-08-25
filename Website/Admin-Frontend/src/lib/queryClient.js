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
  companies: (filters) => ['companies', filters],
  company: (id) => ['companies', id],
  jobs: (filters) => ['jobs', filters],
  job: (id) => ['jobs', id],
  resumes: (filters) => ['resumes', filters],
  resumesStats: ['resumes', 'stats'],
  applications: (filters) => ['applications', filters],
  batches: (filters) => ['batches', filters],
  batch: (id) => ['batches', id],
  eligibleApplications: (batchId) => ['batches', batchId, 'eligible'],
  mockInterviews: (filters) => ['mockInterviews', filters],
  payments: (filters) => ['payments', filters],
  team: ['team'],
  me: ['me'],
  resumePool: (filters) => ['resumePool', filters],
  resumePoolStats: ['resumePool', 'stats'],
  notifications: ['notifications'],
}
