import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as employeesService from '../services/employeesService'
import { queryKeys } from '../lib/queryClient'

export function useEmployeesQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.employees(filters), queryFn: () => employeesService.listEmployees(filters) })
}

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: employeesService.createEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  })
}

export function useSetEmployeeStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => employeesService.setEmployeeStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  })
}

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: employeesService.deleteEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  })
}
