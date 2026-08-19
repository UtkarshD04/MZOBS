import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as meService from '../services/meService'

export function useMeQuery() {
  return useQuery({ queryKey: queryKeys.me, queryFn: meService.getMe })
}

export function useUpdateMe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input) => meService.updateMe(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.me })
      toast.success('Profile updated')
    },
    onError: () => toast.error('Could not update your profile.'),
  })
}
