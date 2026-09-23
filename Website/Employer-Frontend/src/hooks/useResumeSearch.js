import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryClient'
import * as resumeSearchService from '../services/resumeSearchService'

export function useResumeSearchQuery(filters = {}) {
  return useQuery({
    queryKey: queryKeys.resumeSearch(filters),
    queryFn: () => resumeSearchService.searchResumeDatabase(filters),
    placeholderData: (prev) => prev,
  })
}

export function useResumeSearchCandidateQuery(employeeId) {
  return useQuery({
    queryKey: queryKeys.resumeSearchCandidate(employeeId ?? ''),
    queryFn: () => resumeSearchService.getResumeDatabaseCandidate(employeeId),
    enabled: !!employeeId,
  })
}

export function useUnlockResumeSearchCandidate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeId, jobId }) => resumeSearchService.unlockResumeSearchCandidate(employeeId, jobId),
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: ['resume-search'] })
      qc.invalidateQueries({ queryKey: ['candidates'] })
      qc.invalidateQueries({ queryKey: queryKeys.cvCredits })
      qc.invalidateQueries({ queryKey: queryKeys.cvUnlocks })
      qc.setQueryData(queryKeys.resumeSearchCandidate(vars.employeeId), data.candidate)
    },
  })
}
