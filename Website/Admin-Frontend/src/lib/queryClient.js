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
  shortlist: (filters) => ['shortlist', filters],
  team: ['team'],
  me: ['me'],
  supportTickets: (filters) => ['supportTickets', filters],
  payments: (filters) => ['payments', filters],
  resumeStats: ['resumeStats'],
  mockInterviewStats: ['mockInterviewStats'],
  applications: (filters) => ['applications', filters],
  subscriptionTrend: (range) => ['subscriptionTrend', range],
  employerRevenueTrend: (range) => ['employerRevenueTrend', range],
  coupons: ['coupons'],
  employees: (filters) => ['employees', filters],
  notifications: ['notifications'],
}
