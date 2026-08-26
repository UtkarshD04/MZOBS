import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as couponsService from '../services/couponsService'
import { queryKeys } from '../lib/queryClient'

export function useCouponsQuery() {
  return useQuery({ queryKey: queryKeys.coupons, queryFn: couponsService.listCoupons })
}

export function useCreateCouponMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: couponsService.createCoupon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.coupons }),
  })
}

export function useUpdateCouponMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => couponsService.updateCoupon(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.coupons }),
  })
}

export function useDeleteCouponMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: couponsService.deleteCoupon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.coupons }),
  })
}
