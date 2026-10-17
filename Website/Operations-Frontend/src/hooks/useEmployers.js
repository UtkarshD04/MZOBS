import { useQuery } from '@tanstack/react-query'
import * as employersService from '../services/employersService'
import { queryKeys } from '../lib/queryClient'

export function useEmployersQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.employers(filters), queryFn: () => employersService.listEmployers(filters) })
}
