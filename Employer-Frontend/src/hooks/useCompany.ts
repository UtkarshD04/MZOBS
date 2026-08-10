import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as companyService from '../services/companyService'
import type { Company } from '../types'

export function useCompanyQuery() {
  return useQuery({ queryKey: queryKeys.company, queryFn: companyService.getCompany })
}

export function useUpdateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<Company>) => companyService.updateCompany(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.company })
      toast.success('Company profile updated')
    },
    onError: () => toast.error('Could not update the company profile.'),
  })
}
