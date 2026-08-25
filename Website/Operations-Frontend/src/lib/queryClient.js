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
  team: ['team'],
  me: ['me'],
}
