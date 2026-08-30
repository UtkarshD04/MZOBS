import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as companiesService from '../services/companiesService'
import { queryKeys } from '../lib/queryClient'

export function useCompaniesQuery(filters = {}, { enabled = true } = {}) {
  return useQuery({ queryKey: queryKeys.companies(filters), queryFn: () => companiesService.listCompanies(filters), enabled })
}

export function useVerifyCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => companiesService.verifyCompany(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  })
}

export function useRejectCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => companiesService.rejectCompany(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  })
}

export function useBlockCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => companiesService.blockCompany(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  })
}

export function useUnblockCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => companiesService.unblockCompany(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  })
}

export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => companiesService.deleteCompany(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  })
}
