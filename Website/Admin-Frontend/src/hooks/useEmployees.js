import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as employeesService from '../services/employeesService'
import { queryKeys } from '../lib/queryClient'

export function useEmployeesQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.employees(filters), queryFn: () => employeesService.listEmployees(filters) })
}

// The resume link expires in ~10 minutes, so every open fetches a fresh one.
export function useEmployeeQuery(id) {
  return useQuery({ queryKey: queryKeys.employee(id), queryFn: () => employeesService.getEmployee(id), enabled: !!id, staleTime: 0, gcTime: 0 })
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
