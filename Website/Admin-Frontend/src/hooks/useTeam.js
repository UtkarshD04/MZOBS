import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as teamService from '../services/teamService'
import { queryKeys } from '../lib/queryClient'

export function useTeamQuery(filters = {}) {
  return useQuery({ queryKey: [...queryKeys.team, filters], queryFn: () => teamService.listTeam(filters), placeholderData: keepPreviousData })
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

export function useResetTeammatePasswordMutation() {
  return useMutation({ mutationFn: ({ id, password }) => teamService.resetTeammatePassword(id, password) })
}

export function useDeleteTeammateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: teamService.deleteTeammate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.team }),
  })
}
