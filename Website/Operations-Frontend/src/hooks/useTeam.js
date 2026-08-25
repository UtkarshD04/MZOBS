import { useQuery } from '@tanstack/react-query'
import * as teamService from '../services/teamService'
import { queryKeys } from '../lib/queryClient'

export function useTeamQuery() {
  return useQuery({ queryKey: queryKeys.team, queryFn: teamService.listTeam })
}
