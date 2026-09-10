import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as candidatesService from '../services/candidatesService'

export function useCandidatesQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.candidates(filters), queryFn: () => candidatesService.listCandidates(filters) })
}

export function useCandidateQuery(id) {
  return useQuery({ queryKey: queryKeys.candidate(id ?? ''), queryFn: () => candidatesService.getCandidate(id), enabled: !!id })
}

const stageLabel = {
  shared: 'moved back to shared',
  shortlisted: 'shortlisted',
  interviewing: 'moved to interviewing',
  offered: 'moved to offered',
  hired: 'marked as hired',
  rejected: 'rejected',
}

export function useSetCandidateStage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, stage, reason }) => candidatesService.setCandidateStage(id, stage, reason),
    onSuccess: (_c, vars) => {
      qc.invalidateQueries({ queryKey: ['candidates'] })
      toast.success(`Candidate ${stageLabel[vars.stage]}`)
    },
    onError: () => toast.error('Could not update candidate stage.'),
  })
}

// Fetched on demand (not embedded in the list/profile response) so a plain
// `GET /candidates` never leaks contact info — each call is what the
// backend actually logs as an access event. Callers should pass
// `enabled: false` whenever the plan is known to be inactive, so the
// request (and the resulting 403) never fires in the first place — private
// data should never render briefly before being masked.
export function useCandidatePrivateDetailsQuery(id, { enabled = true } = {}) {
  return useQuery({
    queryKey: ['candidates', id, 'private-details'],
    queryFn: () => candidatesService.getCandidatePrivateDetails(id),
    enabled: !!id && enabled,
    retry: false,
  })
}

export function useCandidateResumeUrl() {
  return useMutation({ mutationFn: (id) => candidatesService.getCandidateResumeUrl(id) })
}
