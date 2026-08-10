import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as candidatesService from '../services/candidatesService'
import type { CandidateFilters } from '../services/candidatesService'
import type { CandidateStage } from '../types'

export function useCandidatesQuery(filters: CandidateFilters = {}) {
  return useQuery({ queryKey: queryKeys.candidates(filters), queryFn: () => candidatesService.listCandidates(filters) })
}

export function useCandidateQuery(id: string | undefined) {
  return useQuery({ queryKey: queryKeys.candidate(id ?? ''), queryFn: () => candidatesService.getCandidate(id!), enabled: !!id })
}

const stageLabel: Record<CandidateStage, string> = {
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
    mutationFn: ({ id, stage, reason }: { id: string; stage: CandidateStage; reason?: string }) => candidatesService.setCandidateStage(id, stage, reason),
    onSuccess: (_c, vars) => {
      qc.invalidateQueries({ queryKey: ['candidates'] })
      toast.success(`Candidate ${stageLabel[vars.stage]}`)
    },
    onError: () => toast.error('Could not update candidate stage.'),
  })
}
