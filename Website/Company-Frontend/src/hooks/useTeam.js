import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as teamService from '../services/teamService'
import { queryKeys } from '../lib/queryClient'

export function useTeamQuery() {
  return useQuery({ queryKey: queryKeys.team, queryFn: teamService.listTeam })
}

export function useCreateTeammateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: teamService.createTeammate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.team }),
  })
}

export function useUpdateTeammateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => teamService.updateTeammate(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.team }),
  })
}
