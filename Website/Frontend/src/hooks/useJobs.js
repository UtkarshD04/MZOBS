import { useQuery } from '@tanstack/react-query'
import * as jobsService from '../services/jobsService'
import { queryKeys } from '../lib/queryClient'

export function useJobsQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.jobs(filters), queryFn: ({ signal }) => jobsService.listJobs(filters, signal) })
}

// Paginated job-board listing. `placeholderData` keeps the previous page's
// jobs on screen (instead of unmounting into a blank state) while a new
// filter/page/sort combination is in flight — see JobMatching's isFetching
// use for the accompanying "updating" indicator.
export function useJobsPageQuery(params = {}, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.jobsPage(params),
    queryFn: ({ signal }) => jobsService.listJobsPage(params, signal),
    placeholderData: (prev) => prev,
    enabled,
  })
}

export function useJobFacetsQuery(params = {}, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.jobFacets(params),
    queryFn: ({ signal }) => jobsService.getJobFacets(params, signal),
    placeholderData: (prev) => prev,
    enabled,
  })
}

export function useJobQuery(id) {
  return useQuery({ queryKey: queryKeys.job(id), queryFn: ({ signal }) => jobsService.getJob(id, signal), enabled: !!id })
}

export function useAppliedBasedJobsQuery() {
  return useQuery({ queryKey: queryKeys.appliedBasedJobs, queryFn: ({ signal }) => jobsService.getAppliedBasedJobs(signal) })
}

export function useInstantHiringJobsQuery() {
  return useQuery({ queryKey: queryKeys.instantHiringJobs, queryFn: ({ signal }) => jobsService.getInstantHiringJobs(signal) })
}

// Job-title / location autocomplete. Only fetches while `enabled` (the
// dropdown is actually open) — no point pre-fetching suggestions for a
// closed panel.
export function useJobSuggestionsQuery({ type, q = '', limit = 15 }, { enabled = true } = {}) {
  const params = { type, q, limit }
  return useQuery({
    queryKey: queryKeys.jobSuggestions(params),
    queryFn: ({ signal }) => jobsService.getJobSuggestions(params, signal),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
    enabled: enabled && !!type,
  })
}
