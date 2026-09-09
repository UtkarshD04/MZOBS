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
  jobsPage: (params) => ['jobsPage', params],
  jobFacets: (params) => ['jobFacets', params],
  jobSuggestions: (params) => ['jobSuggestions', params],
  job: (id) => ['jobs', id],
  appliedBasedJobs: ['jobs', 'applied-based'],
  instantHiringJobs: ['jobs', 'instant-hiring'],
  applications: ['applications'],
  mockInterview: ['mockInterview'],
  interviews: ['interviews'],
  notifications: ['notifications'],
  supportTickets: ['supportTickets'],
  savedJobs: ['savedJobs'],
  recentlyViewed: ['recentlyViewed'],
  recommendedJobs: (sort) => ['recommendedJobs', sort],
  notificationPreferences: ['notificationPreferences'],
}
