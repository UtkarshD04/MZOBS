import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as applicationsService from '../services/applicationsService'
import { queryKeys } from '../lib/queryClient'

export function useApplicationsQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.applications(filters), queryFn: () => applicationsService.listApplications(filters) })
}

export function useUpdateApplicationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => applicationsService.updateApplication(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}
