import { useQuery } from '@tanstack/react-query'
import * as shortlistService from '../services/shortlistService'
import { queryKeys } from '../lib/queryClient'

export function useShortlistQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.shortlist(filters), queryFn: () => shortlistService.listShortlisted(filters) })
}
