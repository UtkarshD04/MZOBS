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
