import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as teamService from '../services/teamService'

export function useTeamQuery() {
  return useQuery({ queryKey: queryKeys.team, queryFn: teamService.listTeam })
}

export function useInviteMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input) => teamService.inviteMember(input),
    onSuccess: (member) => {
      qc.invalidateQueries({ queryKey: queryKeys.team })
      toast.success(`Invite sent to ${member?.email}`)
    },
    onError: () => toast.error('Could not send the invite.'),
  })
}

export function useUpdateMemberRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }) => teamService.updateMemberRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.team })
      toast.success('Role updated')
    },
  })
}

export function useRemoveMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => teamService.removeMember(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.team })
      toast.success('Member removed')
    },
  })
}
